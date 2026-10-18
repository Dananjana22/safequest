import * as ort from 'onnxruntime-web';
import type { GuardianStyle } from '../types';
import { hog } from './hog';
import { loadFaceCascade, loadOpenCv } from './opencv';
import { NoFaceDetectedError } from './faceAnalysis';

/**
 * Runs guardian_style.onnx (StandardScaler + LogisticRegression, exported
 * via skl2onnx from guardian_pipeline.py's make_model()) entirely in the
 * browser via onnxruntime-web. Mirrors clean_and_featurise()'s exact
 * preprocessing for the classifier input:
 *
 *   detectMultiScale(gray, 1.1, 4, minSize=(30,30))  -> largest face
 *   pad = 0.15 * w                                    -> padded crop
 *   resize to 64x64 (INTER_AREA)                       -> cv.resize
 *   equalizeHist                                       -> cv.equalizeHist
 *   hog(orientations=9, pixels_per_cell=8x8,
 *       cells_per_block=2x2, block_norm="L2-Hys")       -> src/ml/hog.ts
 *
 * Note this uses different cascade parameters (1.1, 4, minSize 30x30) than
 * faceAnalysis.ts's skin/hair detection (1.1, 5, minSize 60x60) - each
 * matches its own Python script's exact call rather than being deduplicated,
 * since the two scripts genuinely use different parameters.
 */

ort.env.wasm.wasmPaths = '/ort/';
ort.env.wasm.numThreads = 1; // avoids needing COOP/COEP headers for SharedArrayBuffer

const MODEL_URL = '/models/guardian_style.onnx';
const FACE_SIZE = 64;

let sessionPromise: Promise<ort.InferenceSession> | null = null;

function loadSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create(MODEL_URL, { executionProviders: ['wasm'] });
  }
  return sessionPromise;
}

/**
 * Starts fetching + instantiating the ORT wasm runtime and the model ahead
 * of the first classify call. Multi-megabyte and slow, so the worker kicks
 * this off as soon as the parent reaches the guardian step.
 */
export function warmUpGuardianClassifier(): Promise<unknown> {
  return loadSession();
}

export interface GuardianStyleResult {
  /** Final field for GuardianFeatures.guardianStyle - 'neutral' when below threshold. */
  guardianStyle: GuardianStyle;
  /** What the model actually predicted, regardless of confidence. */
  predictedLabel: 'masculine' | 'feminine';
  probabilities: { masculine: number; feminine: number };
  confident: boolean;
  faceBox: [number, number, number, number];
}

/**
 * Mirrors plot_confidence()'s "confidence gating" idea from guardian_pipeline.py:
 * above the threshold, pre-select the style; below it, leave it to the parent.
 */
const DEFAULT_CONFIDENCE_THRESHOLD = 0.65;

function extractEqualizedFaceCrop(
  cv: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  gray: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  box: [number, number, number, number]
): number[][] {
  const [x, y, w, h] = box;
  const pad = Math.round(0.15 * w);
  const x0 = Math.max(0, x - pad);
  const y0 = Math.max(0, y - pad);
  const x1 = Math.min(gray.cols, x + w + pad);
  const y1 = Math.min(gray.rows, y + h + pad);

  const rect = new cv.Rect(x0, y0, x1 - x0, y1 - y0);
  const cropped = gray.roi(rect);
  const resized = new cv.Mat();
  const equalized = new cv.Mat();
  try {
    cv.resize(cropped, resized, new cv.Size(FACE_SIZE, FACE_SIZE), 0, 0, cv.INTER_AREA);
    cv.equalizeHist(resized, equalized);

    const pixels: number[][] = [];
    for (let r = 0; r < FACE_SIZE; r++) {
      const row: number[] = new Array(FACE_SIZE);
      for (let c = 0; c < FACE_SIZE; c++) {
        row[c] = equalized.ucharPtr(r, c)[0];
      }
      pixels.push(row);
    }
    return pixels;
  } finally {
    cropped.delete();
    resized.delete();
    equalized.delete();
  }
}

/**
 * The HOG feature vector every head shares, plus the face box it came from.
 * Detection + crop + HOG is the expensive part of inference and is identical
 * for guardian_style and all the attribute heads, so it runs once and the
 * result is passed around.
 */
export interface FaceFeatures {
  features: Float64Array;
  faceBox: [number, number, number, number];
}

/** Takes rasterized pixels rather than an image element - see analyzeGuardianPhoto(). */
export async function extractFaceFeatures(imageData: ImageData): Promise<FaceFeatures> {
  const cv = await loadOpenCv();
  const classifier = await loadFaceCascade();

  const src = cv.matFromImageData(imageData);
  const gray = new cv.Mat();
  const faces = new cv.RectVector();
  const minSize = new cv.Size(30, 30);

  let faceBox: [number, number, number, number];
  let pixels: number[][];
  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    classifier.detectMultiScale(gray, faces, 1.1, 4, 0, minSize);

    if (faces.size() === 0) {
      throw new NoFaceDetectedError();
    }

    let best = faces.get(0);
    let bestArea = best.width * best.height;
    for (let i = 1; i < faces.size(); i++) {
      const f = faces.get(i);
      const area = f.width * f.height;
      if (area > bestArea) {
        best = f;
        bestArea = area;
      }
    }
    faceBox = [best.x, best.y, best.width, best.height];
    pixels = extractEqualizedFaceCrop(cv, gray, faceBox);
  } finally {
    // cv.Size is a plain JS value object - see the note in faceAnalysis.ts.
    src.delete();
    gray.delete();
    faces.delete();
  }

  return { features: hog(pixels), faceBox };
}

/**
 * Runs guardian_style.onnx over already-extracted features. Kept separate from
 * extraction so the attribute heads in guardianAttributes.ts can reuse the
 * same vector instead of detecting and re-HOGing the face a second time.
 */
export async function classifyGuardianStyle(
  { features, faceBox }: FaceFeatures,
  threshold = DEFAULT_CONFIDENCE_THRESHOLD
): Promise<GuardianStyleResult> {
  const session = await loadSession();

  const tensor = new ort.Tensor('float32', Float32Array.from(features), [1, features.length]);
  const outputs = await session.run({ input: tensor });

  const probData = outputs.probabilities.data as Float32Array;
  const pMasculine = probData[0];
  const pFeminine = probData[1];
  const predictedLabel: 'masculine' | 'feminine' = pFeminine > pMasculine ? 'feminine' : 'masculine';
  const confidence = Math.max(pMasculine, pFeminine);
  const confident = confidence >= threshold;

  return {
    guardianStyle: confident ? predictedLabel : 'neutral',
    predictedLabel,
    probabilities: { masculine: pMasculine, feminine: pFeminine },
    confident,
    faceBox,
  };
}
