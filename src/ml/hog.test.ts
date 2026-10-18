import { describe, expect, it } from 'vitest';
import { hog, DEFAULT_HOG_OPTIONS } from './hog';
import fixturesJson from './__fixtures__/hog-fixtures.json';

interface HogFixture {
  name: string;
  image: number[][];
  features: number[];
}

interface FixtureFile {
  params: {
    faceSize: number;
    orientations: number;
    pixelsPerCell: [number, number];
    cellsPerBlock: [number, number];
    blockNorm: string;
  };
  fixtures: HogFixture[];
}

const data = fixturesJson as FixtureFile;

describe('hog() matches scikit-image output', () => {
  it('fixture params match the Python pipeline call', () => {
    expect(data.params.orientations).toBe(DEFAULT_HOG_OPTIONS.orientations);
    expect(data.params.pixelsPerCell).toEqual(DEFAULT_HOG_OPTIONS.pixelsPerCell);
    expect(data.params.cellsPerBlock).toEqual(DEFAULT_HOG_OPTIONS.cellsPerBlock);
    expect(data.params.blockNorm).toBe('L2-Hys');
  });

  it('generated at least the expected number of fixtures', () => {
    expect(data.fixtures.length).toBeGreaterThanOrEqual(6);
  });

  for (const fixture of data.fixtures) {
    it(`"${fixture.name}": produces the same ${fixture.features.length}-length vector as skimage`, () => {
      const result = hog(fixture.image, DEFAULT_HOG_OPTIONS);

      expect(result.length).toBe(fixture.features.length);

      let maxAbsDiff = 0;
      for (let i = 0; i < result.length; i++) {
        maxAbsDiff = Math.max(maxAbsDiff, Math.abs(result[i] - fixture.features[i]));
      }
      // Tight tolerance: only float64 rounding (fixtures were rounded to 1e-10)
      // should separate the two implementations.
      expect(maxAbsDiff).toBeLessThan(1e-6);

      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toBeCloseTo(fixture.features[i], 6);
      }
    });
  }

  it('rejects images whose size is not an exact multiple of pixelsPerCell', () => {
    const bad = Array.from({ length: 63 }, () => new Array(64).fill(0));
    expect(() => hog(bad, DEFAULT_HOG_OPTIONS)).toThrow();
  });
});
