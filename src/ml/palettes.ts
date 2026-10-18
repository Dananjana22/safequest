import type { ClothingColor, HairColor, SkinTone } from '../types';
import { labDistance8, type RGB } from './colorSpace';

/** Monk Skin Tone Scale (Google, 10 tones) - sRGB. Ported from extract_colors.py. */
export const MONK: Record<string, RGB> = {
  'MST-1': [246, 237, 228], 'MST-2': [243, 231, 219], 'MST-3': [247, 234, 208],
  'MST-4': [234, 218, 186], 'MST-5': [215, 189, 150], 'MST-6': [160, 126, 86],
  'MST-7': [130, 92, 67], 'MST-8': [96, 65, 52], 'MST-9': [58, 49, 42],
  'MST-10': [41, 36, 32],
};

/** Ported from extract_colors.py's HAIR palette. */
export const HAIR_PALETTE: Record<string, RGB> = {
  black: [28, 24, 22], 'dark-brown': [60, 44, 34], brown: [94, 68, 48],
  'light-brown': [140, 102, 68], blonde: [205, 170, 110],
  red: [150, 70, 40], grey: [150, 150, 150], white: [225, 225, 225],
};

/**
 * The Python script's 10-tone Monk scale and 8-name hair palette are richer
 * than this app's SkinTone (5 buckets) / HairColor (8 names, different set)
 * types. These collapse the detection result onto the existing enums so the
 * character system doesn't need new types.
 */
const MST_TO_SKIN_TONE: Record<string, SkinTone> = {
  'MST-1': 'light', 'MST-2': 'light',
  'MST-3': 'light-medium', 'MST-4': 'light-medium',
  'MST-5': 'medium', 'MST-6': 'medium',
  'MST-7': 'medium-dark', 'MST-8': 'medium-dark',
  'MST-9': 'dark', 'MST-10': 'dark',
};

const HAIR_NAME_TO_HAIR_COLOR: Record<string, HairColor> = {
  black: 'black',
  'dark-brown': 'dark-brown',
  brown: 'brown',
  'light-brown': 'light-brown',
  blonde: 'blonde',
  red: 'auburn',
  grey: 'grey',
  white: 'grey',
};

/**
 * Representative sRGB for each ClothingColor the avatar can wear, so a colour
 * sampled off the torso can be snapped to one the renderer actually supports.
 */
export const CLOTHING_PALETTE: Record<ClothingColor, RGB> = {
  yellow: [250, 204, 21],
  navy: [30, 58, 138],
  emerald: [16, 185, 129],
  rose: [244, 63, 94],
  purple: [168, 85, 247],
  teal: [20, 184, 166],
  coral: [255, 127, 80],
  slate: [100, 116, 139],
};

export interface NearestMatch {
  id: string;
  rgb: RGB;
  hex: string;
  distance: number;
}

export function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Ported from extract_colors.py's nearest(): closest palette entry in Lab space. */
export function nearestInPalette(rgb: RGB, palette: Record<string, RGB>): NearestMatch {
  let best: string | null = null;
  let bestDist = Infinity;
  for (const [name, ref] of Object.entries(palette)) {
    const d = labDistance8(rgb, ref);
    if (d < bestDist) {
      best = name;
      bestDist = d;
    }
  }
  return { id: best!, rgb, hex: rgbToHex(rgb), distance: Math.round(bestDist * 100) / 100 };
}

export function nearestSkinTone(rgb: RGB): { skinTone: SkinTone; match: NearestMatch } {
  const match = nearestInPalette(rgb, MONK);
  return { skinTone: MST_TO_SKIN_TONE[match.id], match };
}

export function nearestHairColor(rgb: RGB): { hairColor: HairColor; match: NearestMatch } {
  const match = nearestInPalette(rgb, HAIR_PALETTE);
  return { hairColor: HAIR_NAME_TO_HAIR_COLOR[match.id], match };
}

export function nearestClothingColor(rgb: RGB): {
  clothingColor: ClothingColor;
  match: NearestMatch;
} {
  const match = nearestInPalette(rgb, CLOTHING_PALETTE);
  return { clothingColor: match.id as ClothingColor, match };
}
