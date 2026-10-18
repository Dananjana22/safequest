/**
 * Runs the guardian photo pipeline off the main thread.
 *
 * Both runtimes this needs are enormous and block whatever thread they
 * initialize on:
 *
 *   public/models/opencv.js   ~10.2 MB of JS with the OpenCV WASM binary
 *                             inlined as a base64 data: URI - because it's
 *                             a data: URI it can't be stream-compiled, so
 *                             the base64 decode and instantiation happen in
 *                             one uninterrupted block
 *   onnxruntime-web's wasm    ~10.5 MB (public/ort/ort-wasm-simd.wasm)
 *
 * Doing that on the main thread froze the whole page long enough for the
 * browser to show its "Page Unresponsive" dialog the moment a parent picked
 * a photo. Here it costs the worker thread instead, so the onboarding UI
 * keeps painting and its spinner keeps animating throughout.
 *
 * An ES module worker (with vite.config.ts's worker.format: 'es' to match
 * in production): Vite's dev server always serves worker files unbundled,
 * with the bare `import` statements below intact, and only a module worker
 * can execute those. opencv.js is a UMD bundle that would normally need
 * importScripts, which module workers lack - src/ml/opencv.ts handles that
 * mismatch.
 */
import { analyzeGuardianPhoto } from './faceAnalysis';
import {
  classifyGuardianStyle,
  extractFaceFeatures,
  warmUpGuardianClassifier,
} from './guardianClassifier';
import { classifyGuardianAttributes, warmUpGuardianAttributes } from './guardianAttributes';
import {
  deriveFaceShape,
  deriveGlassesStyle,
  deriveHairStyle,
  hasFacialHair,
  hasGlasses,
  resolveHairLength,
} from './guardianFeatureMapping';
import { loadFaceCascade, loadOpenCv } from './opencv';
import type { GuardianAnalysisResult, WorkerRequest, WorkerResponse } from './guardianAnalysisTypes';

function post(message: WorkerResponse, transfer: Transferable[] = []) {
  (self as unknown as Worker).postMessage(message, transfer);
}

let warmUpPromise: Promise<unknown> | null = null;

function warmUp(): Promise<unknown> {
  if (!warmUpPromise) {
    warmUpPromise = Promise.all([
      loadOpenCv().then(() => loadFaceCascade()),
      warmUpGuardianClassifier(),
      warmUpGuardianAttributes(),
    ]).catch((err) => {
      // Don't leave a rejected promise cached - it would make every later
      // upload fail with this same error even if the cause was transient.
      warmUpPromise = null;
      throw err;
    });
  }
  return warmUpPromise;
}

async function analyze(id: number, imageData: ImageData) {
  try {
    // Warm-up has usually already finished by now; awaiting it just shares
    // the same singletons rather than kicking off a second initialization.
    await warmUp();

    // Detection + crop + HOG happens once here; guardian_style and all six
    // attribute heads then score the same vector.
    const [colors, faceFeatures] = await Promise.all([
      analyzeGuardianPhoto(imageData),
      extractFaceFeatures(imageData),
    ]);
    // Sequential for the same reason as inside classifyGuardianAttributes:
    // ORT-web's wasm instance is shared and not reentrant.
    const style = await classifyGuardianStyle(faceFeatures);
    const attrs = await classifyGuardianAttributes(faceFeatures);

    const glasses = hasGlasses(attrs);
    const hairLength = resolveHairLength(colors.hairLength, attrs);

    const result: GuardianAnalysisResult = {
      skinTone: colors.skinTone,
      hairColor: colors.hairColor,
      guardianStyle: style.guardianStyle,
      hairLength,
      hairStyle: deriveHairStyle(hairLength, attrs, style.guardianStyle),
      faceShape: deriveFaceShape(attrs),
      glasses,
      glassesStyle: glasses ? deriveGlassesStyle(colors.eyeRegion) : 'none',
      hasFacialHair: hasFacialHair(attrs),
      clothingColor: colors.clothingColor,
      lowConfidence: colors.lowConfidence,
      attributeScores: attrs,
    };
    post({ type: 'result', id, result });
  } catch (err) {
    // Error objects don't survive structured clone with their prototype, so
    // send the name across and let the client rebuild the right class. The
    // stack comes along too: a failure in here is otherwise invisible from
    // the main thread's devtools.
    post({
      type: 'error',
      id,
      name: err instanceof Error ? err.name : 'Error',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  if (msg.type === 'warmup') {
    // Failures here are not surfaced: the analyze call that follows will
    // retry the same singletons and report the error against a real request.
    warmUp().catch(() => {});
    return;
  }
  if (msg.type === 'analyze') {
    void analyze(msg.id, msg.imageData);
  }
};
