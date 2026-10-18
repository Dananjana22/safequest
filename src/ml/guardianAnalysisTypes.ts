import type {
  ClothingColor,
  FaceShape,
  GlassesStyle,
  GuardianStyle,
  HairColor,
  HairLength,
  HairStyle,
  SkinTone,
} from '../types';
import type { AttributeScores } from './guardianAttributes';

/**
 * Message protocol shared by guardianAnalysis.worker.ts and the client that
 * drives it. Kept in its own module so importing the types on the main
 * thread doesn't drag the worker's OpenCV/ONNX imports along with them.
 */

/** The fields onboarding writes into GuardianFeatures. */
export interface GuardianAnalysisResult {
  skinTone: SkinTone;
  hairColor: HairColor;
  guardianStyle: GuardianStyle;
  hairLength: HairLength;
  hairStyle: HairStyle;
  faceShape: FaceShape;
  glasses: boolean;
  glassesStyle: GlassesStyle;
  hasFacialHair: boolean;
  /** Null when the photo was cropped too tightly to show clothing - keep the existing choice. */
  clothingColor: ClothingColor | null;
  /** True when the palette match was a poor fit - the parent may want to adjust manually. */
  lowConfidence: boolean;
  /** Raw head probabilities, useful for debugging why a character came out as it did. */
  attributeScores: AttributeScores;
}

export type WorkerRequest =
  | { type: 'warmup' }
  | { type: 'analyze'; id: number; imageData: ImageData };

export type WorkerResponse =
  | { type: 'result'; id: number; result: GuardianAnalysisResult }
  | { type: 'error'; id: number; name: string; message: string; stack?: string };
