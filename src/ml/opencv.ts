/**
 * opencv.js loader + the same Haar cascade file the Python pipeline uses
 * (public/models/haarcascade_frontalface_default.xml, copied straight from
 * the local OpenCV install). Both are singletons: the WASM module and the
 * loaded classifier are expensive to initialize, so every call site shares
 * one instance instead of reloading per photo.
 *
 * Self-hosted from public/models/opencv.js (the official OpenCV.js build,
 * fetched from docs.opencv.org) rather than the @techstark/opencv-js npm
 * package - that package's WASM was compiled without the objdetect module,
 * so `cv.CascadeClassifier` doesn't exist on it at all ("is not a
 * constructor" at runtime). Loaded as a plain <script> tag because it's a
 * ~10MB UMD bundle with the WASM binary inlined as base64, not an ESM
 * module Vite can import directly.
 *
 * `cv`'s real type comes from opencv.js's own generated declarations
 * (often stale/incomplete); typed as `any` here rather than fighting
 * mismatches against a moving, dynamically-shaped API surface.
 *
 * Runs in both window and classic-Web-Worker scopes. Initializing this
 * bundle is a multi-second, entirely main-thread-blocking operation (the
 * WASM binary is inlined as a base64 data: URI, so it can't be
 * stream-compiled), which is why guardianAnalysis.worker.ts drives it off
 * the main thread - see the note there.
 */

const OPENCV_SCRIPT_URL = '/models/opencv.js';

// Classic workers only; not in the DOM typings this project compiles against.
declare const importScripts: ((...urls: string[]) => void) | undefined;

/**
 * Loads the UMD bundle inside an ES module worker, where importScripts is
 * unusable. That matters twice over: the UMD wrapper picks its export branch
 * by feature-detecting `importScripts`, and so does Emscripten's own
 * environment detection (`ENVIRONMENT_IS_WORKER = typeof importScripts ===
 * "function"`). Left to itself the wrapper would never publish `cv`, and
 * Emscripten would fall through to its shell path, reaching for file APIs
 * that don't exist here.
 *
 * Evaluating the source with an `importScripts` binding in scope puts both
 * back on the worker path they were written for. The shim is never actually
 * called - opencv.js has its WASM inlined as a data: URI, so it has nothing
 * left to fetch by script.
 */
async function evaluateOpenCvAsWorkerUmd(src: string): Promise<void> {
  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`failed to fetch ${src}: ${res.status}`);
  }
  const source = await res.text();
  // Indirect eval runs the bundle in global scope, so `this` is the worker
  // global that the UMD wrapper assigns `cv` onto. Wrapping it in a single
  // 10MB `new Function` instead would force V8 to parse the whole bundle as
  // one function body up front.
  //
  // Both the wrapper and Emscripten only ever test `typeof importScripts ===
  // "function"`, which a module worker satisfies, so both take their worker
  // path here without any shim. That also pins ENVIRONMENT_IS_WORKER true,
  // which is what keeps Emscripten off its Node branch (require("fs")) if a
  // bundler happens to have defined `process` in the worker global.
  // eslint-disable-next-line no-eval
  (0, eval)(source);
}

function loadScript(src: string): Promise<void> {
  if (typeof document === 'undefined') {
    // A module worker still *exposes* importScripts - it's a real function
    // that throws "Module scripts don't support importScripts()" only once
    // called - so which kind of worker this is cannot be settled by `typeof`
    // alone. Try it (the supported path in a classic worker) and fall back
    // to evaluating the UMD source when it refuses.
    if (typeof importScripts === 'function') {
      try {
        importScripts(src);
        return Promise.resolve();
      } catch {
        // Module worker, or the script genuinely failed to load; either way
        // the fallback below reports its own error if it can't recover.
      }
    }
    return evaluateOpenCvAsWorkerUmd(src);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cvPromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadOpenCv(): Promise<any> {
  if (!cvPromise) {
    cvPromise = (async () => {
      await loadScript(OPENCV_SCRIPT_URL);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cv: any = (globalThis as any).cv;
      if (!cv) {
        throw new Error('opencv.js loaded but did not attach a global cv');
      }
      if (cv instanceof Promise) {
        cv = await cv;
      } else if (!cv.Mat) {
        await new Promise<void>((resolve) => {
          cv.onRuntimeInitialized = () => resolve();
        });
      }

      // Emscripten defines Module.then for its "ready promise" pattern, which
      // makes `cv` a thenable - and its then() resolves with Module itself,
      // another thenable. Returning it from this async function would hand it
      // to the promise resolution procedure, which would call then() again on
      // every pass and never settle, spinning the thread until the tab is
      // killed. Removing it is Emscripten's documented remedy, and is safe
      // here because the runtime is already initialized by this point.
      delete cv.then;
      return cv;
    })();
  }
  return cvPromise;
}

const CASCADE_FILENAME = 'haarcascade_frontalface_default.xml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cascadePromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadFaceCascade(): Promise<any> {
  if (!cascadePromise) {
    cascadePromise = (async () => {
      const cv = await loadOpenCv();
      const exists = cv.FS.analyzePath('/' + CASCADE_FILENAME).exists;
      if (!exists) {
        const res = await fetch('/models/' + CASCADE_FILENAME);
        if (!res.ok) {
          throw new Error(`failed to fetch ${CASCADE_FILENAME}: ${res.status}`);
        }
        const buf = new Uint8Array(await res.arrayBuffer());
        cv.FS_createDataFile('/', CASCADE_FILENAME, buf, true, false, false);
      }
      const classifier = new cv.CascadeClassifier();
      classifier.load(CASCADE_FILENAME);
      return classifier;
    })();
  }
  return cascadePromise;
}
