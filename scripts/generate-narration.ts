/**
 * Pre-generate Sinhala (or English) narration audio for the SafeQuest curriculum.
 *
 * Sinhala has no TTS voice on Windows, macOS or iOS, so the browser cannot
 * narrate it. This renders every spoken line once with a cloud TTS that does
 * support si-LK, writing MP3s into public/audio/<lang>/. The app plays those
 * files and falls back to speech synthesis for anything missing.
 *
 * Usage:
 *   # Google Cloud Text-to-Speech (simplest: one API key)
 *   GOOGLE_TTS_API_KEY=... npx tsx scripts/generate-narration.ts
 *
 *   # Azure Speech
 *   TTS_PROVIDER=azure AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=southeastasia \
 *     npx tsx scripts/generate-narration.ts
 *
 * Flags:
 *   --lang=si|en   Which language to render (default: si)
 *   --list         List what would be generated, with a character count, and exit
 *                  (--dry-run is an alias)
 *   --refresh      Re-render every clip, ignoring the manifest (--force is an alias)
 *   --voice=NAME   Override the provider's default voice
 *
 * On PowerShell, `npm run narration -- --list` loses the flag because the shell
 * eats the `--`. Use `npm run narration '--' --list`, or call the script directly:
 *   npx tsx scripts/generate-narration.ts --list
 *
 * Re-runs are cheap: a manifest records a hash of each line's text plus the
 * voice it was rendered with, and unchanged clips are skipped. Edit a Sinhala
 * string in the curriculum and only that clip regenerates.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { LEVELS_DATA } from '../src/data/curriculumData';
import {
  questionClipId,
  feedbackClipId,
  type NarrationLang
} from '../src/utils/narrationClips';

interface Clip {
  id: string;
  text: string;
  /** Where this line lives, for readable progress output. */
  where: string;
}

interface ManifestEntry {
  hash: string;
  chars: number;
}

type Manifest = Record<string, ManifestEntry>;

// --------------------------------------------------------------------------
// Arguments
// --------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const has = (name: string) => args.includes(`--${name}`);

const lang = (flag('lang') ?? 'si') as NarrationLang;
const dryRun = has('dry-run') || has('list');
const force = has('force') || has('refresh');

if (lang !== 'si' && lang !== 'en') {
  console.error(`Unsupported --lang=${lang}. Use "si" or "en".`);
  process.exit(1);
}

const provider = (process.env.TTS_PROVIDER ?? 'google').toLowerCase();

// Voices confirmed to support the language. Override with --voice=NAME.
const DEFAULT_VOICES: Record<string, Record<NarrationLang, string>> = {
  google: { si: 'si-LK-Standard-A', en: 'en-US-Neural2-F' },
  azure: { si: 'si-LK-ThiliniNeural', en: 'en-US-JennyNeural' }
};

const voice = flag('voice') ?? DEFAULT_VOICES[provider]?.[lang];
const languageCode = lang === 'si' ? 'si-LK' : 'en-US';

const outDir = join(process.cwd(), 'public', 'audio', lang);
const manifestPath = join(outDir, 'manifest.json');

// --------------------------------------------------------------------------
// Collect every spoken line
// --------------------------------------------------------------------------

function collectClips(): Clip[] {
  const clips: Clip[] = [];

  for (const level of LEVELS_DATA) {
    level.questions.forEach((question, qIdx) => {
      const narration =
        lang === 'si' ? question.voiceOverText.si : question.voiceOverText.en;

      if (narration?.trim()) {
        clips.push({
          id: questionClipId(level.id, qIdx),
          text: narration.trim(),
          where: `${level.id} Q${qIdx + 1} narration`
        });
      }

      for (const option of question.options) {
        const feedback =
          lang === 'si' ? option.feedbackSi ?? option.feedback : option.feedback;

        if (feedback?.trim()) {
          clips.push({
            id: feedbackClipId(level.id, qIdx, option.id),
            text: feedback.trim(),
            where: `${level.id} Q${qIdx + 1} ${option.id} (${option.type})`
          });
        }
      }
    });
  }

  return clips;
}

// --------------------------------------------------------------------------
// Providers
// --------------------------------------------------------------------------

async function synthesizeGoogle(text: string): Promise<Buffer> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error('GOOGLE_TTS_API_KEY is not set.');

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode, name: voice },
        // Slightly slowed for 6-9 year olds, matching the speech-synthesis rate.
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9, pitch: 1.0 }
      })
    }
  );

  if (!res.ok) {
    throw new Error(`Google TTS ${res.status}: ${await res.text()}`);
  }

  const body = (await res.json()) as { audioContent?: string };
  if (!body.audioContent) throw new Error('Google TTS returned no audioContent.');

  return Buffer.from(body.audioContent, 'base64');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function synthesizeAzure(text: string): Promise<Buffer> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key) throw new Error('AZURE_SPEECH_KEY is not set.');
  if (!region) throw new Error('AZURE_SPEECH_REGION is not set.');

  const ssml =
    `<speak version="1.0" xml:lang="${languageCode}">` +
    `<voice name="${voice}"><prosody rate="-10%">${escapeXml(text)}</prosody></voice>` +
    `</speak>`;

  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
      },
      body: ssml
    }
  );

  if (!res.ok) {
    throw new Error(`Azure TTS ${res.status}: ${await res.text()}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function synthesize(text: string): Promise<Buffer> {
  if (provider === 'google') return synthesizeGoogle(text);
  if (provider === 'azure') return synthesizeAzure(text);
  throw new Error(`Unknown TTS_PROVIDER "${provider}". Use "google" or "azure".`);
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------

async function loadManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8')) as Manifest;
  } catch {
    return {};
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const clips = collectClips();

  // Guard against a naming collision silently overwriting a clip.
  const seen = new Set<string>();
  for (const clip of clips) {
    if (seen.has(clip.id)) {
      throw new Error(`Duplicate clip id "${clip.id}" (${clip.where}).`);
    }
    seen.add(clip.id);
  }

  if (!voice) {
    throw new Error(`No default voice for provider "${provider}". Pass --voice=NAME.`);
  }

  const manifest = force ? {} : await loadManifest();
  const hashOf = (text: string) =>
    createHash('sha256').update(`${provider}:${voice}:${text}`).digest('hex');

  const pending = clips.filter((c) => manifest[c.id]?.hash !== hashOf(c.text));
  const totalChars = pending.reduce((sum, c) => sum + c.text.length, 0);

  console.log(`Language   : ${lang} (${languageCode})`);
  console.log(`Provider   : ${provider}`);
  console.log(`Voice      : ${voice}`);
  console.log(`Output     : ${outDir}`);
  console.log(`Clips      : ${clips.length} total, ${pending.length} to render`);
  console.log(`Characters : ${totalChars.toLocaleString()} (billed by most providers)`);

  if (dryRun) {
    console.log('\n--dry-run: nothing written. Lines that would be rendered:\n');
    for (const clip of pending) {
      console.log(`  ${clip.id}  [${clip.where}]`);
      console.log(`    ${clip.text}`);
    }
    return;
  }

  if (pending.length === 0) {
    console.log('\nEverything is up to date.');
    return;
  }

  await mkdir(outDir, { recursive: true });

  let done = 0;
  let failed = 0;

  for (const clip of pending) {
    try {
      const audio = await synthesize(clip.text);
      await writeFile(join(outDir, `${clip.id}.mp3`), audio);
      manifest[clip.id] = { hash: hashOf(clip.text), chars: clip.text.length };
      done++;
      console.log(`  [${done}/${pending.length}] ${clip.id}`);
    } catch (err) {
      failed++;
      console.error(`  FAILED ${clip.id} (${clip.where}): ${(err as Error).message}`);
    }

    // Stay clear of per-second quotas.
    await sleep(120);

    // Persist as we go, so an interrupted run resumes instead of restarting.
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  }

  console.log(`\nRendered ${done} clip(s)${failed ? `, ${failed} failed` : ''}.`);
  if (failed) {
    console.log('Re-run to retry the failures; completed clips are skipped.');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(`\n${(err as Error).message}`);
  process.exit(1);
});
