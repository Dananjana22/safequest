/**
 * TypeScript port of OpenCV's 8-bit sRGB -> CIE L*a*b* conversion
 * (cv2.cvtColor(px, cv2.COLOR_RGB2LAB) on a uint8 pixel), as used by
 * extract_colors.py's nearest() to compare skin/hair colors the way human
 * eyes judge color distance.
 *
 * OpenCV's 8-bit Lab output is scaled differently from "textbook" CIE Lab:
 * L in [0,255] (not [0,100]) and a,b offset by +128 (not centered on 0),
 * then rounded to uint8. Both this function and rgbToLab8Exact below match
 * that scaling exactly so palette-distance thresholds carried over from the
 * Python script (sd > 30, hd > 45) stay meaningful. Verified against real
 * cv2.cvtColor output across 64 fixtures (palette colors, RGB corners,
 * random samples) in colorSpace.test.ts.
 */

const D65 = { x: 0.950456, y: 1.0, z: 1.088754 };

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function labF(t: number): number {
  const delta = 6 / 29;
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

/** Full-precision CIE Lab (L in [0,100], a/b roughly [-128,127]). */
export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);

  const x = (0.412453 * rl + 0.35758 * gl + 0.180423 * bl) / D65.x;
  const y = (0.212671 * rl + 0.71516 * gl + 0.072169 * bl) / D65.y;
  const z = (0.019334 * rl + 0.119193 * gl + 0.950227 * bl) / D65.z;

  const fx = labF(x);
  const fy = labF(y);
  const fz = labF(z);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bb = 200 * (fy - fz);
  return [L, a, bb];
}

function clampToUint8(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/**
 * OpenCV's 8-bit-quantized Lab, matching cv2.cvtColor(..., COLOR_RGB2LAB)
 * on a uint8 image exactly: L *= 255/100, a/b += 128, then round-clip to
 * uint8 (this quantization is what the Python distances are computed on).
 */
export function rgbToLab8(r: number, g: number, b: number): [number, number, number] {
  const [L, a, bb] = rgbToLab(r, g, b);
  return [
    clampToUint8((L * 255) / 100),
    clampToUint8(a + 128),
    clampToUint8(bb + 128),
  ];
}

export type RGB = [number, number, number];

/**
 * Euclidean distance in OpenCV's 8-bit Lab space, matching extract_colors.py's
 * nearest(): np.linalg.norm(lab - reference_lab) on cv2-converted uint8 Lab.
 */
export function labDistance8(a: RGB, b: RGB): number {
  const [l1, a1, b1] = rgbToLab8(...a);
  const [l2, a2, b2] = rgbToLab8(...b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}
