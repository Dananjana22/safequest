import { describe, expect, it } from 'vitest';
import { rgbToLab8 } from './colorSpace';
import fixturesJson from './__fixtures__/lab-fixtures.json';

interface LabFixture {
  name: string;
  rgb: [number, number, number];
  lab: [number, number, number];
}

const data = fixturesJson as { fixtures: LabFixture[] };

describe('rgbToLab8() matches cv2.cvtColor(..., COLOR_RGB2LAB)', () => {
  it('loaded a healthy number of fixtures', () => {
    expect(data.fixtures.length).toBeGreaterThanOrEqual(60);
  });

  for (const fx of data.fixtures) {
    it(`"${fx.name}" rgb(${fx.rgb.join(',')}) -> lab(${fx.lab.join(',')})`, () => {
      const [L, a, b] = rgbToLab8(...fx.rgb);
      // OpenCV rounds to uint8; allow +/-1 for boundary rounding differences
      // between the two implementations' float paths.
      expect(Math.abs(L - fx.lab[0])).toBeLessThanOrEqual(1);
      expect(Math.abs(a - fx.lab[1])).toBeLessThanOrEqual(1);
      expect(Math.abs(b - fx.lab[2])).toBeLessThanOrEqual(1);
    });
  }
});
