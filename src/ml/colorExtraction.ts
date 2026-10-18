import type { RGB } from './colorSpace';

/**
 * Dominant-color extraction via k-means, in the spirit of extract_colors.py's
 * dominant(): cluster the region's pixels and return the largest cluster's
 * center. Not a bit-exact port - cv2.kmeans' KMEANS_PP_CENTERS init has its
 * own internal randomness and isn't seeded in the Python script either, so
 * there's no single "correct" Python output to match bit-for-bit here.
 * What matters (and is tested in colorExtraction.test.ts) is the behavior:
 * given a region dominated by one color with a minority of outlier pixels,
 * it returns the majority color, not an average pulled toward the outliers.
 */

// mulberry32: tiny deterministic PRNG so results are reproducible across runs.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dist2(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function mean(pixels: RGB[]): RGB {
  let r = 0;
  let g = 0;
  let b = 0;
  for (const p of pixels) {
    r += p[0];
    g += p[1];
    b += p[2];
  }
  const n = pixels.length || 1;
  return [r / n, g / n, b / n];
}

export function dominantColor(pixels: RGB[], k = 3, seed = 42): RGB {
  if (pixels.length === 0) return [0, 0, 0];
  if (pixels.length < k) return mean(pixels).map(Math.round) as RGB;

  const rand = mulberry32(seed);

  // k-means++-style init: first center random, rest weighted by distance².
  const centers: RGB[] = [pixels[Math.floor(rand() * pixels.length)]];
  while (centers.length < k) {
    const weights = pixels.map((p) => Math.min(...centers.map((c) => dist2(p, c))));
    const total = weights.reduce((a, b) => a + b, 0);
    if (total === 0) {
      centers.push(pixels[Math.floor(rand() * pixels.length)]);
      continue;
    }
    let r = rand() * total;
    let idx = 0;
    for (; idx < weights.length; idx++) {
      r -= weights[idx];
      if (r <= 0) break;
    }
    centers.push(pixels[Math.min(idx, pixels.length - 1)]);
  }

  const assignments = new Int32Array(pixels.length);
  for (let iter = 0; iter < 15; iter++) {
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = dist2(pixels[i], centers[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assignments[i] !== best) changed = true;
      assignments[i] = best;
    }
    if (!changed && iter > 0) break;

    const sums = centers.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i++) {
      const s = sums[assignments[i]];
      s[0] += pixels[i][0];
      s[1] += pixels[i][1];
      s[2] += pixels[i][2];
      s[3] += 1;
    }
    for (let c = 0; c < centers.length; c++) {
      if (sums[c][3] > 0) {
        centers[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]];
      }
    }
  }

  const counts = new Array(centers.length).fill(0);
  for (const a of assignments) counts[a]++;
  const biggest = counts.indexOf(Math.max(...counts));
  return centers[biggest].map(Math.round) as RGB;
}
