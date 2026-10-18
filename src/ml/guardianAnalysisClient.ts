import { NoFaceDetectedError } from './faceAnalysis';
import { getScaledImageData } from './imageUtils';
import type { GuardianAnalysisResult, WorkerRequest, WorkerResponse } from './guardianAnalysisTypes';

/**
 * Main-thread half of the guardian photo pipeline. Owns the single worker
 * instance, correlates replies to requests by id, and rebuilds error
 * classes that structured clone flattens on the way across.
 *
 * The only work left on the main thread is rasterizing the photo down to
 * the analysis size (a single drawImage), which is cheap. Everything
 * expensive - OpenCV, ONNX Runtime, detection, inference - happens in the
 * worker, so the page stays interactive.
 */

let worker: Worker | null = null;
let nextRequestId = 1;
const pending = new Map<
  number,
  { resolve: (r: GuardianAnalysisResult) => void; reject: (e: Error) => void }
>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./guardianAnalysis.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const msg = event.data;
      const entry = pending.get(msg.id);
      if (!entry) return;
      pending.delete(msg.id);

      if (msg.type === 'result') {
        entry.resolve(msg.result);
      } else if (msg.name === 'NoFaceDetectedError') {
        entry.reject(new NoFaceDetectedError());
      } else {
        const error = new Error(msg.message);
        error.name = msg.name;
        // Keep the worker-side stack; the one this Error was constructed
        // with points at the message handler and says nothing useful.
        if (msg.stack) error.stack = msg.stack;
        entry.reject(error);
      }
    };

    worker.onerror = (event) => {
      console.error('[SafeQuest] Guardian analysis worker error:', event.message, event);
      const error = new Error(event.message || 'Guardian analysis worker failed to start');
      for (const [, entry] of pending) entry.reject(error);
      pending.clear();
      // Drop the broken instance so a later attempt constructs a fresh one.
      worker?.terminate();
      worker = null;
    };
  }
  return worker;
}

function post(message: WorkerRequest, transfer: Transferable[] = []) {
  getWorker().postMessage(message, transfer);
}

/**
 * Starts loading OpenCV and the ONNX session in the worker before the
 * parent has picked a photo, so the ~20MB of runtime init overlaps with
 * them filling in the rest of the step instead of delaying the result.
 * Safe to call repeatedly - the worker keeps one warm-up promise.
 */
export function warmUpGuardianAnalysis(): void {
  post({ type: 'warmup' });
}

export function analyzeGuardianImage(
  image: HTMLImageElement | HTMLCanvasElement
): Promise<GuardianAnalysisResult> {
  const imageData = getScaledImageData(image);

  return new Promise<GuardianAnalysisResult>((resolve, reject) => {
    const id = nextRequestId++;
    pending.set(id, { resolve, reject });
    // The scaled pixels aren't needed on this side afterwards, so hand the
    // buffer over rather than copying it.
    post({ type: 'analyze', id, imageData }, [imageData.data.buffer]);
  });
}
