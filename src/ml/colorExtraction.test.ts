import { describe, expect, it } from 'vitest';
import { dominantColor } from './colorExtraction';
import type { RGB } from './colorSpace';

function repeat(color: RGB, n: number): RGB[] {
  return Array.from({ length: n }, () => color);
}

describe('dominantColor()', () => {
  it('returns the majority color when a minority of outlier pixels are present', () => {
    const skinTone: RGB = [215, 189, 150];
    const outlier: RGB = [20, 20, 20]; // e.g. a shadow or stray hair strand
    const pixels = [...repeat(skinTone, 90), ...repeat(outlier, 10)];

    const result = dominantColor(pixels);

    const distToSkin = Math.hypot(...result.map((v, i) => v - skinTone[i]));
    const distToOutlier = Math.hypot(...result.map((v, i) => v - outlier[i]));
    expect(distToSkin).toBeLessThan(distToOutlier);
    expect(distToSkin).toBeLessThan(15);
  });

  it('is stable for a uniform region', () => {
    const color: RGB = [100, 80, 60];
    const result = dominantColor(repeat(color, 50));
    expect(result[0]).toBeCloseTo(color[0], 0);
    expect(result[1]).toBeCloseTo(color[1], 0);
    expect(result[2]).toBeCloseTo(color[2], 0);
  });

  it('handles fewer pixels than k by falling back to the mean', () => {
    const pixels: RGB[] = [
      [10, 10, 10],
      [30, 30, 30],
    ];
    const result = dominantColor(pixels, 3);
    expect(result).toEqual([20, 20, 20]);
  });

  it('handles an empty region without throwing', () => {
    expect(dominantColor([])).toEqual([0, 0, 0]);
  });
});
