import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  UserCheck, 
  Gamepad2, 
  BarChart3, 
  ArrowRight, 
  Play, 
  X, 
  Sparkles, 
  Settings,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { playSoundEffect } from '../utils/audio';

interface ParentInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
  onOpenSetup: () => void;
  isSinhala?: boolean;
}

export const ParentInstructionsModal: React.FC<ParentInstructionsModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  onOpenSetup,
  isSinhala = false
}) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    try {
      return localStorage.getItem('safequest_hide_parent_guide') === 'true';
    } catch {
      return false;
    }
  });

  if (!isOpen) return null;

  const handleToggleDontShow = (checked: boolean) => {
    setDontShowAgain(checked);
    try {
      if (checked) {
        localStorage.setItem('safequest_hide_parent_guide', 'true');
      } else {
        localStorage.removeItem('safequest_hide_parent_guide');
      }
    } catch {
      // ignore
    }
  };

  const handleProceedToGame = () => {
    playSoundEffect('celebrate');
    onStartGame();
    onClose();
  };

  const handleProceedToSetup = () => {
    playSoundEffect('click');
    onOpenSetup();
    onClose();
  };

  const steps = [
    {
      num: '01',
      badgeBg: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-200',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-100',
      icon: ShieldCheck,
      iconColor: 'text-amber-500 bg-amber-50 border-amber-200',
      title: isSinhala ? '1. "Setup Profile" වෙත යන්න' : '1. Go to "Setup Profile"',
      desc: isSinhala 
        ? 'පවුලේ රහස් මුරපදය සහ විශ්වාසවන්ත වැඩිහිටියන් ඇතුළත් කර ආරක්ෂාව සකසන්න.'
        : 'Set up family password, guardian role, and trusted adult contacts.'
    },
    {
      num: '02',
      badgeBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-200',
      borderHover: 'hover:border-purple-400 hover:shadow-purple-100',
      icon: UserCheck,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-200',
      title: isSinhala ? '2. දරුවාගේ පැතිකඩ සාදන්න' : '2. Create Child Profile',
      desc: isSinhala 
        ? 'දරුවාගේ නම, වයස (6–9) තෝරා ප්‍රියතම වීර චරිතය (Avatar) තෝරන්න.'
        : "Set your child's name, age (6–9), and choose their hero avatar."
    },
    {
      num: '03',
      badgeBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-emerald-200',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-100',
      icon: Gamepad2,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      title: isSinhala ? '3. දරුවාට ක්‍රීඩා කිරීමට දෙන්න!' : '3. Give to Child to Play!',
      desc: isSinhala 
        ? 'ගම්මාන සිතියම ඔස්සේ විනෝදයෙන් ආරක්ෂක තීරණ ගන්නා ක්‍රීඩාව දරුවාට දෙන්න.'
        : 'Let your child explore the Village Map and solve interactive safety quests.'
    },
    {
      num: '04',
      badgeBg: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-200',
      borderHover: 'hover:border-sky-400 hover:shadow-sky-100',
      icon: BarChart3,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-200',
      title: isSinhala ? '4. දෙමාපිය ද්වාරයෙන් බලන්න' : '4. Monitor in Parent Portal',
      desc: isSinhala 
        ? 'දරුවාගේ ප්‍රගතිය, ආරක්ෂක තීරණ logs සහ සැකසුම් ඕනෑම වේලාවක බලන්න.'
        : 'View progress stars, session safety logs, and adjust settings anytime.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col my-auto"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-600 p-5 sm:p-6 text-white overflow-hidden">
            {/* Background glowing circles */}
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/20 filter blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/15 filter blur-lg pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border border-white/30 text-amber-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isSinhala ? 'දෙමාපියන් සඳහා මඟපෙන්වීම' : 'PARENT QUICK-START GUIDE'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] tracking-tight drop-shadow-sm">
                  {isSinhala ? 'SafeQuest සරල පියවර 4කින් ආරම්භ කරන්න' : 'Start SafeQuest in 4 Simple Steps'}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-amber-100/95 max-w-md">
                  {isSinhala 
                    ? 'ක්‍රීඩාව ආරම්භ කිරීමට පෙර දෙමාපියන් විසින් කළ යුතු මූලික පියවර පහතින් බලන්න.' 
                    : 'A quick guide on how to set up, hand over, and monitor your child.'}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  playSoundEffect('click');
                  onClose();
                }}
                className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 active:scale-95 ml-2 border border-white/30"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4 Steps Section (Large Fonts, Minimal Text) */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-slate-50/60 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {steps.map((st) => {
                const IconComponent = st.icon;
                return (
                  <div
                    key={st.num}
                    className={`relative p-4 rounded-2xl bg-white border-2 border-slate-200/80 shadow-sm transition-all duration-200 flex flex-col justify-between ${st.borderHover}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shadow ${st.badgeBg}`}>
                        {st.num}
                      </span>
                      <div className={`p-2 rounded-xl border ${st.iconColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      {/* Step Title in Large Font */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Fredoka',sans-serif] leading-tight">
                        {st.title}
                      </h3>
                      {/* Short Description */}
                      <p className="text-xs sm:text-sm font-bold text-slate-600 leading-snug">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remember Choice Checkbox */}
            <label className="flex items-center space-x-2.5 pt-2 cursor-pointer select-none px-1">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => handleToggleDontShow(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300 cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-500">
                {isSinhala 
                  ? 'ක්‍රීඩා කිරීමට පෙර මෙම පණිවිඩය නැවත නොපෙන්වන්න' 
                  : "Don't show this message again before starting game"}
              </span>
            </label>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            {/* Step 1 CTA: Go to Setup */}
            <button
              onClick={handleProceedToSetup}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center space-x-2 transition-all hover:scale-102 border-2 border-slate-200 shadow-sm"
            >
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>{isSinhala ? 'පැතිකඩ සකසන්න (Setup)' : 'Go to Setup Profile'}</span>
            </button>

            {/* Step 3 CTA: Play Game */}
            <button
              onClick={handleProceedToGame}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-base flex items-center justify-center space-x-2 shadow-lg shadow-amber-300/40 border-2 border-white transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{isSinhala ? 'ක්‍රීඩාව ආරම්භ කරන්න' : 'Start Play Game'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
