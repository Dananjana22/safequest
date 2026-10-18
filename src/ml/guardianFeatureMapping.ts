import type {
  ClothingColor,
  FaceShape,
  GlassesStyle,
  GuardianStyle,
  HairLength,
  HairStyle,
} from '../types';
import type { AttributeScores } from './guardianAttributes';
import type { EyeRegionMetrics } from './photoMetrics';

/**
 * Turns the raw signals - CelebA attribute probabilities, geometric
 * measurements and colour samples - into the GuardianFeatures fields the
 * avatar renders.
 *
 * Every threshold below is the operating point that maximised F1 on the
 * held-out 20% split during training, recorded in Model/attr_metrics.json.
 * They are not round numbers because they were measured, not chosen:
 * class_weight="balanced" pushes the rare heads well away from 0.5, so
 * guessing produced a beard detector that fired on clean-shaven men and a
 * bald detector that never fired at all.
 *
 * Re-run Model/train_attributes.py if the models change - it reprints these.
 */

/** eyeglasses: AUC 0.959, F1 0.699 at this point - the strongest head. */
const GLASSES_THRESHOLD = 0.8;
/** beard: AUC 0.907, F1 0.616. */
const BEARD_THRESHOLD = 0.59;
/** wavy_hair: AUC 0.830, F1 0.670. */
const WAVY_THRESHOLD = 0.52;
/** bald: AUC 0.968 but only 2.1% positive; F1 0.479. */
const BALD_THRESHOLD = 0.82;
/** chubby: AUC 0.887, 5.7% positive; F1 0.467. */
const CHUBBY_THRESHOLD = 0.75;
/** oval_face: AUC 0.681 - the weakest head, used only as a tie-breaker. */
const OVAL_THRESHOLD = 0.45;

/**
 * Face shape is the weakest field here, and deliberately only picks between
 * 'round' and 'oval'.
 *
 * A geometric version was tried first - skin-mask widths at forehead, cheek
 * and jaw height - on the theory that a real measurement would beat CelebA's
 * subjective "Oval_Face" label (AUC 0.681, barely above chance). It did not
 * survive contact with real photos: hair covers the forehead row, eyes and
 * nostrils break the cheek run, and across a 20-face sample it returned no
 * usable reading for nearly half of them and aspect ratios up to 11.8 for the
 * rest. Both variants are in the git history; neither was fit to drive a
 * visible feature, so the measurement was removed rather than left to add
 * noise.
 *
 * 'square', 'heart' and 'long' therefore never get chosen automatically -
 * CelebA has no labels for them, and nothing else here can tell them apart
 * honestly. The parent can still pick them by hand.
 */
export function deriveFaceShape(attrs: AttributeScores): FaceShape {
  if (attrs.chubby >= CHUBBY_THRESHOLD) return 'round';
  return attrs.ovalFace >= OVAL_THRESHOLD ? 'oval' : 'round';
}

export function deriveHairStyle(
  hairLength: HairLength,
  attrs: AttributeScores,
  guardianStyle: GuardianStyle
): HairStyle {
  if (attrs.bald >= BALD_THRESHOLD) return 'short-crop';

  const wavy = attrs.wavyHair >= WAVY_THRESHOLD;
  if (hairLength === 'short') return wavy ? 'curly-volume' : 'short-crop';
  if (hairLength === 'medium') {
    if (wavy) return 'curly-volume';
    return guardianStyle === 'feminine' ? 'classic-bob' : 'side-part';
  }
  // long
  if (wavy) return 'long-waves';
  return guardianStyle === 'masculine' ? 'side-part' : 'ponytail';
}

/**
 * Only called once the eyeglasses head has fired. Which frame to draw is a
 * photometric question, not one CelebA labels: dark lenses drop the eye band's
 * luminance, heavy frames raise its edge density, wireframes barely register.
 */
export function deriveGlassesStyle(eyes: EyeRegionMetrics | null): GlassesStyle {
  if (!eyes) return 'square-modern';
  if (eyes.relativeLuminance < 0.72) return 'round-dark';
  if (eyes.relativeEdges > 1.6) return 'square-modern';
  return 'wireframe';
}

export function hasGlasses(attrs: AttributeScores): boolean {
  return attrs.eyeglasses >= GLASSES_THRESHOLD;
}

export function hasFacialHair(attrs: AttributeScores): boolean {
  return attrs.beard >= BEARD_THRESHOLD;
}

/**
 * Bald overrides whatever the pixels said about length - hair that isn't
 * there cannot be measured, and the side-column sampling in
 * estimateHairLength() will happily pick up a collar instead.
 */
export function resolveHairLength(
  measured: HairLength,
  attrs: AttributeScores
): HairLength {
  return attrs.bald >= BALD_THRESHOLD ? 'short' : measured;
}

export type { ClothingColor };
