import * as ort from 'onnxruntime-web';
import type { FaceFeatures } from './guardianClassifier';

/**
 * The CelebA attribute heads trained by Model/train_attributes.py. Each is the
 * same shape as guardian_style.onnx - StandardScaler + LogisticRegression over
 * the identical 1764-dim HOG vector - so they all run over the features
 * extractFaceFeatures() already produced, with no second face detection.
 *
 * These fill in the GuardianFeatures fields that used to be left at their
 * defaults, which is why every generated character came out looking the same
 * apart from its colours.
 *
 * Colour is deliberately NOT learned here: HOG is greyscale, so skin and hair
 * colour stay with the Lab palette matcher in faceAnalysis.ts, which is
 * strictly better at that job.
 */

export type AttributeName =
  | 'eyeglasses'
  | 'beard'
  | 'wavyHair'
  | 'bald'
  | 'ovalFace'
  | 'chubby';

const MODEL_URLS: Record<AttributeName, string> = {
  eyeglasses: '/models/attr_eyeglasses.onnx',
  beard: '/models/attr_beard.onnx',
  wavyHair: '/models/attr_wavy_hair.onnx',
  bald: '/models/attr_bald.onnx',
  ovalFace: '/models/attr_oval_face.onnx',
  chubby: '/models/attr_chubby.onnx',
};

/** Probability that each attribute is present, in [0, 1]. */
export type AttributeScores = Record<AttributeName, number>;

const sessions = new Map<AttributeName, Promise<ort.InferenceSession>>();

function loadAttributeSession(name: AttributeName): Promise<ort.InferenceSession> {
  let existing = sessions.get(name);
  if (!existing) {
    existing = ort.InferenceSession.create(MODEL_URLS[name], {
      executionProviders: ['wasm'],
    }).catch((err) => {
      // Don't cache a rejection - a transient fetch failure would otherwise
      // disable this attribute for the rest of the session.
      sessions.delete(name);
      throw err;
    });
    sessions.set(name, existing);
  }
  return existing;
}

export function warmUpGuardianAttributes(): Promise<unknown> {
  return Promise.all((Object.keys(MODEL_URLS) as AttributeName[]).map(loadAttributeSession));
}

/**
 * Scores every attribute head. A head that fails to load or run yields 0.5
 * (no opinion) rather than rejecting: one missing model should soften the
 * generated character, not fail the whole photo.
 */
export async function classifyGuardianAttributes(
  { features }: FaceFeatures
): Promise<AttributeScores> {
  const names = Object.keys(MODEL_URLS) as AttributeName[];
  const results: (readonly [AttributeName, number])[] = [];

  // Sequential, with a fresh input buffer per run. ORT-web drives a single
  // wasm instance that is not reentrant: firing these off concurrently, and
  // over one shared Float32Array, made the heads corrupt each other's heap
  // ("memory access out of bounds"). They are tiny linear models, so running
  // them one after another costs almost nothing.
  for (const name of names) {
    try {
      const session = await loadAttributeSession(name);
      const tensor = new ort.Tensor('float32', Float32Array.from(features), [1, features.length]);
      const outputs = await session.run({ input: tensor });
      // Same head shape as guardian_style: probabilities is [1, 2] with the
      // positive class second (skl2onnx exports with zipmap disabled).
      const probs = outputs.probabilities.data as Float32Array;
      results.push([name, probs[1]] as const);
    } catch (err) {
      console.warn(`[SafeQuest] attribute head "${name}" unavailable:`, err);
      results.push([name, 0.5] as const);
    }
  }

  return Object.fromEntries(results) as AttributeScores;
}
