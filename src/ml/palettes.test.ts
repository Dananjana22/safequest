import { describe, expect, it } from 'vitest';
import { MONK, HAIR_PALETTE, nearestSkinTone, nearestHairColor, nearestInPalette } from './palettes';

describe('nearestInPalette()', () => {
  it('matches each Monk tone exactly to itself with ~0 distance', () => {
    for (const [name, rgb] of Object.entries(MONK)) {
      const match = nearestInPalette(rgb, MONK);
      expect(match.id).toBe(name);
      expect(match.distance).toBeLessThan(1);
    }
  });

  it('matches each hair palette color exactly to itself with ~0 distance', () => {
    for (const [name, rgb] of Object.entries(HAIR_PALETTE)) {
      const match = nearestInPalette(rgb, HAIR_PALETTE);
      expect(match.id).toBe(name);
      expect(match.distance).toBeLessThan(1);
    }
  });
});

describe('nearestSkinTone() maps the 10-tone Monk scale onto the app\'s 5-bucket SkinTone', () => {
  it('MST-1 (lightest) -> light', () => {
    expect(nearestSkinTone(MONK['MST-1']).skinTone).toBe('light');
  });
  it('MST-10 (darkest) -> dark', () => {
    expect(nearestSkinTone(MONK['MST-10']).skinTone).toBe('dark');
  });
  it('MST-5/6 (mid) -> medium', () => {
    expect(nearestSkinTone(MONK['MST-5']).skinTone).toBe('medium');
    expect(nearestSkinTone(MONK['MST-6']).skinTone).toBe('medium');
  });
});

describe('nearestHairColor() maps the Python hair palette onto the app\'s HairColor', () => {
  it('red -> auburn (closest existing enum member)', () => {
    expect(nearestHairColor(HAIR_PALETTE.red).hairColor).toBe('auburn');
  });
  it('white -> grey (app has no distinct white)', () => {
    expect(nearestHairColor(HAIR_PALETTE.white).hairColor).toBe('grey');
  });
  it('black -> black, blonde -> blonde (direct matches)', () => {
    expect(nearestHairColor(HAIR_PALETTE.black).hairColor).toBe('black');
    expect(nearestHairColor(HAIR_PALETTE.blonde).hairColor).toBe('blonde');
  });
});
