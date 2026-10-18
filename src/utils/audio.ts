// Web Audio API Synthesizer & Speech Synthesizer for SafeQuest

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSoundEffect(type: 'click' | 'correct' | 'star' | 'celebrate' | 'retry' | 'pop' | 'shield' | 'trap') {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      // Cheerful major arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.28);
      });
    } else if (type === 'star') {
      // High chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'celebrate') {
      // Fanfare chord
      const chords = [
        [523.25, 659.25, 783.99],
        [587.33, 739.99, 880.00],
        [659.25, 830.61, 987.77],
        [1046.50, 1318.51, 1567.98]
      ];
      chords.forEach((chord, step) => {
        const time = now + step * 0.16;
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.18, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + (step === 3 ? 0.8 : 0.25));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + (step === 3 ? 0.8 : 0.25));
        });
      });
    } else if (type === 'retry') {
      // Gentle, warm descending non-punitive tone
      const notes = [440, 392, 349.23];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.15, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.25);
      });
    } else if (type === 'shield') {
      // Protective resonant swoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'trap') {
      // Curious 'boing'
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.1);
      osc.frequency.linearRampToValueAtTime(350, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakVoiceNarrator(
  text: string,
  lang: 'en' | 'si' | 'ta' = 'en',
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();

    // Pick appropriate language code & voice
    if (lang === 'si') {
      utterance.lang = 'si-LK';
      // Match on the BCP-47 tag, never on a loose name substring: 'sin' is also
      // a substring of "Singapore", which would pick an English (Singapore)
      // voice and read Sinhala script with it.
      const sinhalaVoice = voices.find(v => {
        const tag = v.lang.toLowerCase().replace('_', '-');
        return tag === 'si' || tag.startsWith('si-') || v.name.toLowerCase().includes('sinhala');
      });
      if (sinhalaVoice) {
        utterance.voice = sinhalaVoice;
      }
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
    } else if (lang === 'ta') {
      utterance.lang = 'ta-LK';
      const tamilVoice = voices.find(v => v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil'));
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
    } else {
      utterance.lang = 'en-US';
      const englishVoice = voices.find(v => (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.08;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error', e);
    if (onEnd) onEnd();
  }
}

export function stopVoiceNarrator() {
  if (currentClip) {
    currentClip.pause();
    currentClip.src = '';
    currentClip = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

let currentClip: HTMLAudioElement | null = null;

/**
 * Speak a line, preferring a pre-generated audio clip over the Web Speech API.
 *
 * Sinhala has no TTS voice on Windows, macOS or iOS, so browser synthesis
 * cannot narrate it there. When `clipUrl` points at a generated file we play
 * that instead; if the file is absent (nothing generated yet, or a clip that
 * failed to render) we fall back to synthesis, which still works for English.
 */
export function narrate(options: {
  text: string;
  lang: 'en' | 'si' | 'ta';
  clipUrl?: string;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  const { text, lang, clipUrl, onStart, onEnd } = options;

  stopVoiceNarrator();

  if (!clipUrl || typeof window === 'undefined' || typeof Audio === 'undefined') {
    speakVoiceNarrator(text, lang, onStart, onEnd);
    return;
  }

  const clip = new Audio(clipUrl);
  currentClip = clip;
  let started = false;

  const fallBackToSynthesis = () => {
    if (currentClip !== clip) return; // superseded by a newer narration
    currentClip = null;
    if (started) {
      if (onEnd) onEnd();
    } else {
      speakVoiceNarrator(text, lang, onStart, onEnd);
    }
  };

  clip.onplaying = () => {
    started = true;
    if (onStart) onStart();
  };

  clip.onended = () => {
    if (currentClip === clip) currentClip = null;
    if (onEnd) onEnd();
  };

  // Missing file, decode failure, or a blocked autoplay attempt.
  clip.onerror = fallBackToSynthesis;
  clip.play().catch(fallBackToSynthesis);
}

