import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Star, 
  Lightbulb, 
  Shield, 
  Play, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  MousePointerClick,
  HelpCircle
} from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatars';
import { speakVoiceNarrator, stopVoiceNarrator, playSoundEffect } from '../utils/audio';

interface ChildInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarId?: string;
  isSinhala?: boolean;
  voiceEnabled?: boolean;
}

export const ChildInstructionsModal: React.FC<ChildInstructionsModalProps> = ({
  isOpen,
  onClose,
  avatarId = 'kai',
  isSinhala = false,
  voiceEnabled = true
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    try {
      return localStorage.getItem('safequest_hide_child_guide') === 'true';
    } catch {
      return false;
    }
  });

  const narrationText = isSinhala
    ? 'ප්‍රශ්නයට ප්‍රවේශමෙන් සිතා නිවැරදි පිළිතුර ක්ලික් කරන්න! නිවැරදි පිළිතුරු දී දිදුලන තරු එකතු කරන්න. අපි ක්‍රීඩා කරමු!'
    : 'Think and click the correct answer for the question! Collect shiny stars by giving correct answers. Let us play and stay safe!';

  const handleSpeak = () => {
    stopVoiceNarrator();
    setIsSpeaking(true);
    speakVoiceNarrator(
      narrationText,
      isSinhala ? 'si' : 'en',
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  useEffect(() => {
    if (isOpen) {
      playSoundEffect('pop');
      if (voiceEnabled) {
        // Small delay so modal animation starts first
        const timer = setTimeout(() => {
          handleSpeak();
        }, 350);
        return () => {
          clearTimeout(timer);
          stopVoiceNarrator();
          setIsSpeaking(false);
        };
      }
    } else {
      stopVoiceNarrator();
      setIsSpeaking(false);
    }
  }, [isOpen, voiceEnabled, isSinhala]);

  const handleClose = () => {
    stopVoiceNarrator();
    setIsSpeaking(false);
    playSoundEffect('celebrate');
    try {
      if (dontShowAgain) {
        localStorage.setItem('safequest_hide_child_guide', 'true');
      } else {
        localStorage.removeItem('safequest_hide_child_guide');
      }
    } catch {
      // ignore
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
        {/* Child Instruction Card Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-sky-400 via-indigo-500 to-purple-600 rounded-3xl sm:rounded-[36px] shadow-2xl border-4 sm:border-6 border-amber-300 overflow-hidden flex flex-col my-auto text-white"
        >
          {/* Drifting Clouds & Sparkles Background */}
          <div className="absolute top-2 right-4 w-24 h-24 rounded-full bg-amber-300/30 filter blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-purple-400/30 filter blur-2xl pointer-events-none" />

          {/* Top Banner with Avatar & Voice Controls */}
          <div className="relative z-10 px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Child Avatar preview */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/60 p-1 flex items-center justify-center shadow-lg">
                <CharacterAvatar id={avatarId} size="md" action="happy" />
              </div>
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-amber-300 text-amber-950 font-black px-3 py-0.5 rounded-full text-xs uppercase tracking-wider shadow">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
                  <span>{isSinhala ? 'ළමා මෙහෙයුම' : 'HOW TO PLAY'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] drop-shadow-md leading-tight">
                  {isSinhala ? 'ක්‍රීඩා කරන්නේ මෙහෙමයි!' : 'Ready to Play!'}
                </h2>
              </div>
            </div>

            {/* Voice Narration Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  if (isSpeaking) {
                    stopVoiceNarrator();
                    setIsSpeaking(false);
                  } else {
                    handleSpeak();
                  }
                }}
                className={`p-2.5 sm:px-3 sm:py-2 rounded-2xl font-black text-xs shadow-lg border-2 border-white flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isSpeaking
                    ? 'bg-emerald-400 text-emerald-950 ring-4 ring-emerald-300/50 animate-pulse'
                    : 'bg-white/90 text-slate-900 hover:bg-white'
                }`}
                title={isSinhala ? 'හඬට සවන් දෙන්න' : 'Listen to Voice'}
              >
                {isSpeaking ? (
                  <>
                    <Volume2 className="w-5 h-5 text-emerald-950 animate-bounce" />
                    <span className="hidden sm:inline">{isSinhala ? 'සවන් දෙන්න...' : 'Speaking...'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-indigo-700" />
                    <span className="hidden sm:inline">{isSinhala ? 'හඬ අසන්න' : 'Listen'}</span>
                  </>
                )}
              </button>

              {/* Close "X" in top right */}
              <button
                onClick={handleClose}
                className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 active:scale-95 border border-white/30 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Visual Instructions Body: Least Text, Large Icons, Large Fonts */}
          <div className="relative z-10 px-4 sm:px-6 py-2 space-y-3 sm:space-y-4">
            {/* INSTRUCTION 1: THINK & CLICK CORRECT ANSWER */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 sm:p-5 rounded-3xl bg-white text-slate-900 border-4 border-amber-300 shadow-xl flex items-center space-x-4 sm:space-x-5"
            >
              {/* Huge Icon 1 */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white flex-shrink-0 flex items-center justify-center shadow-lg ring-4 ring-amber-200">
                <Lightbulb className="w-9 h-9 sm:w-11 sm:h-11 fill-amber-100 text-white animate-pulse" />
              </div>

              {/* Text 1: Large Font, Very Little Text */}
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide">
                  <span>{isSinhala ? 'පියවර 1' : 'STEP 1'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif] text-slate-900 leading-tight">
                  {isSinhala ? 'සිතා නිවැරදි පිළිතුර ක්ලික් කරන්න!' : 'Think & Click the Right Answer!'}
                </h3>
                <p className="text-sm sm:text-base font-bold text-slate-600 leading-snug">
                  {isSinhala
                    ? 'ප්‍රශ්නය කියවා ආරක්ෂිත නිවැරදි තේරීම තෝරන්න.'
                    : 'Read the question and click the safe choice.'}
                </p>
              </div>
            </motion.div>

            {/* INSTRUCTION 2: COLLECT STARS */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 sm:p-5 rounded-3xl bg-white text-slate-900 border-4 border-yellow-300 shadow-xl flex items-center space-x-4 sm:space-x-5"
            >
              {/* Huge Icon 2 */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 text-white flex-shrink-0 flex items-center justify-center shadow-lg ring-4 ring-yellow-200">
                <Star className="w-10 h-10 sm:w-12 sm:h-12 fill-white text-yellow-100 drop-shadow animate-spin-slow" />
              </div>

              {/* Text 2: Large Font, Very Little Text */}
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 bg-yellow-100 text-yellow-900 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide">
                  <span>{isSinhala ? 'පියවර 2' : 'STEP 2'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif] text-slate-900 leading-tight">
                  {isSinhala ? 'දිදුලන තරු එකතු කරන්න!' : 'Collect Shiny Stars!'}
                </h3>
                <p className="text-sm sm:text-base font-bold text-slate-600 leading-snug">
                  {isSinhala
                    ? 'නිවැරදි පිළිතුරු දී සෑම මට්ටමකින්ම තරු 3ක් දිනාගන්න!'
                    : 'Give correct answers to earn all 3 golden stars!'}
                </p>
              </div>
            </motion.div>

            {/* Don't show again toggle */}
            <div className="flex items-center justify-between px-2 pt-1 text-white/90">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-400 focus:ring-amber-300 border-white/60 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-bold text-amber-100">
                  {isSinhala 
                    ? 'නැවත මෙය නොපෙන්වන්න' 
                    : "Don't show this before playing again"}
                </span>
              </label>

              <span className="text-xs font-black text-amber-200 uppercase tracking-wider hidden sm:inline">
                ⭐ SafeQuest Hero
              </span>
            </div>
          </div>

          {/* Bottom Section: Close Button at the Bottom */}
          <div className="relative z-10 p-4 sm:p-6 bg-white/10 backdrop-blur-md border-t-2 border-white/20 mt-2">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClose}
              className="w-full py-4 sm:py-4.5 px-8 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xl sm:text-2xl font-['Fredoka',sans-serif] shadow-2xl border-4 border-white flex items-center justify-center space-x-3 cursor-pointer tracking-wide"
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950" />
              <span>{isSinhala ? 'ක්‍රීඩා කරමු! (වසන්න)' : "LET'S PLAY! (CLOSE)"}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
