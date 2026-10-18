// Naming scheme for pre-generated narration audio.
//
// Both the app (to build playback URLs) and scripts/generate-narration.ts (to
// name the files it writes) import these helpers, so the two can never drift
// apart. Changing an id here orphans every previously generated file.

export type NarrationLang = 'si' | 'en';

/** Clip id for a question's scene narration (voiceOverText). */
export function questionClipId(levelId: string, questionIndex: number): string {
  return `${levelId}__q${questionIndex + 1}`;
}

/** Clip id for the guardian feedback spoken after an option is chosen. */
export function feedbackClipId(
  levelId: string,
  questionIndex: number,
  optionId: string
): string {
  return `${levelId}__q${questionIndex + 1}__${optionId}`;
}

/** Public URL a generated clip is served from (files live in public/audio/<lang>/). */
export function clipUrl(lang: NarrationLang, clipId: string): string {
  return `/audio/${lang}/${clipId}.mp3`;
}
