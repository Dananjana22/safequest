import type { ClothingColor, HairColor, HairLength, SkinTone } from '../types';
import { loadFaceCascade, loadOpenCv } from './opencv';
import { dominantColor } from './colorExtraction';
import {
  nearestClothingColor,
  nearestHairColor,
  nearestSkinTone,
  type NearestMatch,
} from './palettes';
import {
  estimateHairLength,
  measureEyeRegion,
  sampleClothingColor,
  type EyeRegionMetrics,
} from './photoMetrics';
import type { RGB } from './colorSpace';

/**
 * Browser port of extract_colors.py's analyse(): detect the largest face
 * with the same Haar cascade, sample the same cheek/hair regions (identical
 * proportions of the face box), and match to the same idea of "nearest
 * palette color in Lab space" - just collapsed onto this app's SkinTone/
 * HairColor enums (see palettes.ts).
 *
 * Not unit-testable the way colorSpace/colorExtraction are: it needs a real
 * browser (Canvas + WASM), which vitest's environment doesn't provide.
 * Verify it manually via the photo-lab.html test page.
 */

export interface GuardianPhotoAnalysis {
  skinTone: SkinTone;
  hairColor: HairColor;
  /** Measured from how far hair-coloured pixels fall beside the head. */
  hairLength: HairLength;
  /** Null when the photo is cropped too tightly to show any clothing. */
  clothingColor: ClothingColor | null;
  /** Used to choose a frame style once the eyeglasses head has fired. */
  eyeRegion: EyeRegionMetrics | null;
  faceBox: [number, number, number, number];
  /** True when either match was a poor fit (mirrors extract_colors.py's sd>30 or hd>45). */
  lowConfidence: boolean;
  debug: {
    skinRgb: RGB;
    skinMatch: NearestMatch;
    hairRgb: RGB;
    hairMatch: NearestMatch;
  };
}

export class NoFaceDetectedError extends Error {
  constructor() {
    super('No face detected - please use a clear, front-facing photo.');
    this.name = 'NoFaceDetectedError';
  }
}

function collectRegion(
  imageData: ImageData,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): RGB[] {
  const { width, height, data } = imageData;
  const pixels: RGB[] = [];
  const xStart = Math.max(0, Math.floor(x0));
  const xEnd = Math.min(width, Math.ceil(x1));
  const yStart = Math.max(0, Math.floor(y0));
  const yEnd = Math.min(height, Math.ceil(y1));
  for (let py = yStart; py < yEnd; py++) {
    for (let px = xStart; px < xEnd; px++) {
      const idx = (py * width + px) * 4;
      pixels.push([data[idx], data[idx + 1], data[idx + 2]]);
    }
  }
  return pixels;
}

/**
 * Takes already-rasterized pixels rather than an image element so this can
 * run in a Web Worker, which has no `document` to draw a canvas with. Call
 * getScaledImageData() on the main thread to produce the input - it also
 * caps the resolution, which keeps detectMultiScale off the multi-second
 * path that full-size phone photos put it on.
 */
export async function analyzeGuardianPhoto(
  imageData: ImageData
): Promise<GuardianPhotoAnalysis> {
  const cv = await loadOpenCv();
  const classifier = await loadFaceCascade();

  const src = cv.matFromImageData(imageData);
  const gray = new cv.Mat();
  const faces = new cv.RectVector();
  const minSize = new cv.Size(60, 60);

  let faceBox: [number, number, number, number];
  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    classifier.detectMultiScale(gray, faces, 1.1, 5, 0, minSize);

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
  } finally {
    // Only the Emscripten-bound C++ objects own memory that needs releasing.
    // cv.Size is a plain JS value object with no delete() - calling one here
    // would throw out of this finally and mask whatever the try block raised
    // (NoFaceDetectedError included).
    src.delete();
    gray.delete();
    faces.delete();
  }

  const [x, y, w, h] = faceBox;

  const cheekL = collectRegion(imageData, x + 0.12 * w, y + 0.55 * h, x + 0.3 * w, y + 0.72 * h);
  const cheekR = collectRegion(imageData, x + 0.7 * w, y + 0.55 * h, x + 0.88 * w, y + 0.72 * h);
  const skinRgb = dominantColor([...cheekL, ...cheekR]);

  const hy0 = Math.max(0, y - 0.35 * h);
  const hy1 = Math.max(hy0 + 1, y - 0.05 * h);
  const hairBand = collectRegion(imageData, x + 0.2 * w, hy0, x + 0.8 * w, hy1);
  const hairRgb: RGB = hairBand.length ? dominantColor(hairBand) : [0, 0, 0];

  const { skinTone, match: skinMatch } = nearestSkinTone(skinRgb);
  const { hairColor, match: hairMatch } = nearestHairColor(hairRgb);

  // Everything below is measured straight off the pixels, for the traits
  // CelebA has no attribute for or where a direct reading beats a 64x64
  // greyscale model. See photoMetrics.ts.
  const hairLength = estimateHairLength(imageData, faceBox, hairRgb);
  const clothingRgb = sampleClothingColor(imageData, faceBox, skinRgb);
  const clothingColor = clothingRgb ? nearestClothingColor(clothingRgb).clothingColor : null;
  const eyeRegion = measureEyeRegion(imageData, faceBox);

  return {
    skinTone,
    hairColor,
    hairLength,
    clothingColor,
    eyeRegion,
    faceBox,
    lowConfidence: skinMatch.distance > 30 || hairMatch.distance > 45,
    debug: { skinRgb, skinMatch, hairRgb, hairMatch },
  };
}
