import { labDistance8, type RGB } from './colorSpace';
import { dominantColor } from './colorExtraction';
import type { HairLength } from '../types';

/**
 * Photometric and geometric measurements taken straight off the pixels, for
 * the character traits CelebA has no attribute for (hair length, clothing
 * colour) or where a direct measurement beats a 64x64 greyscale HOG model
 * (how dark the eye region is, once the classifier says there are glasses).
 *
 * Pure functions over ImageData and a face box, so they are unit-testable
 * without a browser - unlike the OpenCV paths in faceAnalysis.ts.
 */

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export type FaceBox = [number, number, number, number];

function clampRect(imageData: ImageData, r: Rect): Rect {
  return {
    x0: Math.max(0, Math.floor(r.x0)),
    y0: Math.max(0, Math.floor(r.y0)),
    x1: Math.min(imageData.width, Math.ceil(r.x1)),
    y1: Math.min(imageData.height, Math.ceil(r.y1)),
  };
}

function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Mean Rec.709 luminance over a rectangle, or null when it is empty. */
export function meanLuminance(imageData: ImageData, rect: Rect): number | null {
  const { x0, y0, x1, y1 } = clampRect(imageData, rect);
  const { width, data } = imageData;
  let sum = 0;
  let n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      sum += luma(data[i], data[i + 1], data[i + 2]);
      n++;
    }
  }
  return n === 0 ? null : sum / n;
}

/**
 * Mean absolute luminance gradient over a rectangle - a cheap stand-in for
 * "how much structure is here". Frames, hair texture and beards all raise it
 * relative to bare skin.
 */
export function edgeDensity(imageData: ImageData, rect: Rect): number | null {
  const { x0, y0, x1, y1 } = clampRect(imageData, rect);
  const { width, data } = imageData;
  let sum = 0;
  let n = 0;
  for (let y = y0 + 1; y < y1 - 1; y++) {
    for (let x = x0 + 1; x < x1 - 1; x++) {
      const i = (y * width + x) * 4;
      const c = luma(data[i], data[i + 1], data[i + 2]);
      const rIdx = (y * width + x + 1) * 4;
      const dIdx = ((y + 1) * width + x) * 4;
      const gx = luma(data[rIdx], data[rIdx + 1], data[rIdx + 2]) - c;
      const gy = luma(data[dIdx], data[dIdx + 1], data[dIdx + 2]) - c;
      sum += Math.abs(gx) + Math.abs(gy);
      n++;
    }
  }
  return n === 0 ? null : sum / n;
}

/** How close a pixel must be to the sampled hair colour to count as hair. */
const HAIR_MATCH_DISTANCE = 26;
/** Fraction of a row that must be hair-coloured for that row to count. */
const HAIR_ROW_COVERAGE = 0.18;

/**
 * Estimates hair length from how far hair-coloured pixels reach below the
 * chin, sampled in the columns *beside* the head rather than the torso -
 * clothing sits centre-below and would otherwise read as very long hair
 * whenever it happened to match the hair colour.
 *
 * Inherently approximate: a dark top under dark hair can still stretch the
 * estimate, and hair tied back reads short. It only picks between three
 * buckets, which the avatar then renders loosely.
 */
export function estimateHairLength(
  imageData: ImageData,
  faceBox: FaceBox,
  hairRgb: RGB
): HairLength {
  const [x, y, w, h] = faceBox;
  const chinY = y + h;
  const bandBottom = Math.min(imageData.height, chinY + 1.2 * h);
  const { width, data } = imageData;

  // Two columns hugging the sides of the face.
  const sides: Rect[] = [
    { x0: x - 0.45 * w, y0: chinY, x1: x + 0.08 * w, y1: bandBottom },
    { x0: x + 0.92 * w, y0: chinY, x1: x + 1.45 * w, y1: bandBottom },
  ].map((r) => clampRect(imageData, r));

  let lowestHairRow = chinY;
  for (let py = Math.floor(chinY); py < bandBottom; py++) {
    let matched = 0;
    let total = 0;
    for (const s of sides) {
      for (let px = s.x0; px < s.x1; px++) {
        const i = (py * width + px) * 4;
        total++;
        const rgb: RGB = [data[i], data[i + 1], data[i + 2]];
        if (labDistance8(rgb, hairRgb) < HAIR_MATCH_DISTANCE) matched++;
      }
    }
    if (total > 0 && matched / total >= HAIR_ROW_COVERAGE) lowestHairRow = py;
  }

  const drop = (lowestHairRow - chinY) / Math.max(1, h);
  if (drop > 0.55) return 'long';
  if (drop > 0.15) return 'medium';
  return 'short';
}

/** Minimum pixels needed below the neck before a clothing sample is trusted. */
const MIN_CLOTHING_PIXELS = 250;
/** A sample this close to the skin colour is probably neck or chest, not cloth. */
const CLOTHING_SKIN_DISTANCE = 18;

/**
 * Samples the torso band below the chin. Returns null when the photo is
 * cropped too tightly to show clothing, or when what's there looks like more
 * skin - in both cases the caller should keep whatever the parent already
 * chose rather than inventing a colour.
 */
export function sampleClothingColor(
  imageData: ImageData,
  faceBox: FaceBox,
  skinRgb: RGB
): RGB | null {
  const [x, y, w, h] = faceBox;
  const chinY = y + h;
  const rect = clampRect(imageData, {
    x0: x + 0.05 * w,
    y0: chinY + 0.35 * h,
    x1: x + 0.95 * w,
    y1: chinY + 1.1 * h,
  });

  const { width, data } = imageData;
  const pixels: RGB[] = [];
  for (let py = rect.y0; py < rect.y1; py++) {
    for (let px = rect.x0; px < rect.x1; px++) {
      const i = (py * width + px) * 4;
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  if (pixels.length < MIN_CLOTHING_PIXELS) return null;

  const rgb = dominantColor(pixels);
  if (labDistance8(rgb, skinRgb) < CLOTHING_SKIN_DISTANCE) return null;
  return rgb;
}

export interface EyeRegionMetrics {
  /** Eye-band luminance relative to the cheeks; < 1 means darker than skin. */
  relativeLuminance: number;
  /** Eye-band edge density relative to the cheeks; higher means more structure. */
  relativeEdges: number;
}

/**
 * Compares the eye band against the cheeks. Only meaningful once the
 * eyeglasses head has said there are glasses at all - this just picks which
 * kind to draw.
 */
export function measureEyeRegion(
  imageData: ImageData,
  faceBox: FaceBox
): EyeRegionMetrics | null {
  const [x, y, w, h] = faceBox;
  const eyes: Rect = { x0: x + 0.12 * w, y0: y + 0.28 * h, x1: x + 0.88 * w, y1: y + 0.46 * h };
  const cheeks: Rect = { x0: x + 0.15 * w, y0: y + 0.55 * h, x1: x + 0.85 * w, y1: y + 0.72 * h };

  const eyeLuma = meanLuminance(imageData, eyes);
  const cheekLuma = meanLuminance(imageData, cheeks);
  const eyeEdges = edgeDensity(imageData, eyes);
  const cheekEdges = edgeDensity(imageData, cheeks);
  if (eyeLuma === null || cheekLuma === null || eyeEdges === null || cheekEdges === null) {
    return null;
  }

  return {
    relativeLuminance: eyeLuma / Math.max(1, cheekLuma),
    relativeEdges: eyeEdges / Math.max(0.001, cheekEdges),
  };
}
