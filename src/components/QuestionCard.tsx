import React, { useState } from 'react';
import { QuestionData, OptionItem, LanguageCode } from '../types';
import { IconHelper } from './IconHelper';
import { playSoundEffect } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, AlertCircle, Check, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionData;
  language: LanguageCode;
  familyPassword?: string;
  onSelectOption: (option: OptionItem) => void;
  onContinue: () => void;
  selectedOption: OptionItem | null;
  hasAnswered: boolean;
  onSpeak: () => void;
  isSpeaking: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  language,
  familyPassword = 'StarTiger77',
  onSelectOption,
  onContinue,
  selectedOption,
  hasAnswered,
  onSpeak,
  isSpeaking
}) => {
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [enteredPass, setEnteredPass] = useState('');
  const [passError, setPassError] = useState(false);
  const [pendingPassOption, setPendingPassOption] = useState<OptionItem | null>(null);
  const isSinhala = language === 'si';

  // Dynamic grid styling based on 2, 3, or 4 options
  const isThreeOptions = question.options.length === 3 || question.optionCount === 3;
  const getGridClass = () => {
    if (isThreeOptions) {
      return 'grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4';
    }
    return 'grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4';
  };

  const handleOptionClick = (option: OptionItem) => {
    if (hasAnswered) return;

    if (option.triggersFamilyPasswordCheck) {
      setPendingPassOption(option);
      setEnteredPass('');
      setPassError(false);
      setShowPasscodeDialog(true);
      return;
    }

    if (option.type === 'safe') {
      playSoundEffect('correct');
    } else if (option.type === 'trap') {
      playSoundEffect('trap');
    } else {
      playSoundEffect('retry');
    }

    onSelectOption(option);
  };

  const handleClosePasscodeDialog = () => {
    setShowPasscodeDialog(false);
    setPendingPassOption(null);
    setEnteredPass('');
    setPassError(false);
  };

  const handleVerifyPassword = () => {
    const matches =
      enteredPass.trim().toLowerCase() === familyPassword.trim().toLowerCase();

    if (!matches) {
      // Wrong code: keep the dialog open so the child can try again.
      setPassError(true);
      playSoundEffect('retry');
      return;
    }

    const targetOption = pendingPassOption;
    handleClosePasscodeDialog();

    if (!targetOption) return;

    playSoundEffect('correct');
    onSelectOption(targetOption);
  };

  const questionPrompt = isSinhala ? (question.onScreenTextSi || question.onScreenText) : question.onScreenText;

  return (
    <div className="w-full space-y-4">
      {/* On-Screen Prompt: HCI Low-Text Rule (Max 10 words) + Big 3D Voice Button */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl flex-shrink-0 shadow-md border-2 border-white">
            Q{question.stepNumber}
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-700">
              {question.stepNumber === 1 && (isSinhala ? 'පියවර 1 (විකල්ප 2)' : 'Step 1 • 2 Choices')}
              {question.stepNumber === 2 && (isSinhala ? 'පියවර 2 (විකල්ප 3)' : 'Step 2 • 3 Choices')}
              {question.stepNumber === 3 && (isSinhala ? 'පියවර 3 (විකල්ප 4)' : 'Step 3 • 4 Choices')}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-tight">
              {questionPrompt}
            </h3>
          </div>
        </div>

        {/* Big tactile Voice Narration Button */}
        <button
          onClick={onSpeak}
          id="btn-voice-narration"
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-md border-2 ${
            isSpeaking
              ? 'bg-amber-400 text-amber-950 border-white scale-105 ring-4 ring-amber-300 animate-pulse'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 hover:scale-105'
          }`}
          title="Listen to Voice"
        >
          <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-amber-950' : 'text-amber-700'}`} />
          <span className="whitespace-nowrap">
            {isSpeaking ? (isSinhala ? 'සවන් දෙන්න...' : 'Listening...') : (isSinhala ? 'හඬ අසන්න' : 'Hear Voice')}
          </span>
        </button>
      </div>

      {/* Options Grid: Tactile, 3D visual cards */}
      <div className={getGridClass()}>
        {question.options.map((option, idx) => {
          const isSelected = selectedOption?.id === option.id;
          const label = isSinhala ? (option.labelSi || option.label) : option.label;
          let btnStyle = 'bg-white hover:bg-amber-50/80 border-slate-200 text-slate-800 shadow-md hover:border-amber-400 hover:shadow-xl hover:-translate-y-0.5';
          let iconBg = 'bg-slate-100 text-slate-700';

          if (hasAnswered) {
            if (isSelected) {
              if (option.type === 'safe') {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xl ring-4 ring-emerald-300';
                iconBg = 'bg-emerald-500 text-white';
              } else if (option.type === 'trap') {
                btnStyle = 'bg-amber-50 border-amber-500 text-amber-950 shadow-xl ring-4 ring-amber-300';
                iconBg = 'bg-amber-500 text-white';
              } else {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 shadow-xl ring-4 ring-rose-300';
                iconBg = 'bg-rose-500 text-white';
              }
            } else if (option.type === 'safe' && selectedOption?.type !== 'safe') {
              btnStyle = 'bg-emerald-50/80 border-dashed border-emerald-400 text-emerald-900 opacity-90';
              iconBg = 'bg-emerald-200 text-emerald-800';
            } else {
              btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              iconBg = 'bg-slate-100 text-slate-400';
            }
          }

          if (isThreeOptions) {
            return (
              <motion.button
                key={option.id}
                whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                whileTap={!hasAnswered ? { scale: 0.97 } : {}}
                onClick={() => handleOptionClick(option)}
                disabled={hasAnswered}
                id={`option-btn-${idx + 1}`}
                className={`relative min-h-[140px] sm:min-h-[155px] p-3.5 sm:p-4 rounded-3xl border-3 flex sm:flex-col flex-row items-center justify-center sm:justify-between text-left sm:text-center space-x-3.5 sm:space-x-0 transition-all duration-200 ${btnStyle} cursor-pointer`}
              >
                {/* Large Visual 3D Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${iconBg} shadow-inner border-2 border-white sm:mb-2`}>
                  <IconHelper name={option.iconName} className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {/* Label (1-5 words with clean centering and auto wrap) */}
                <div className="flex-1 w-full flex flex-col items-start sm:items-center justify-center">
                  <span className="text-sm sm:text-base font-black block leading-snug text-left sm:text-center w-full break-words">
                    {label}
                  </span>
                  {option.type === 'trap' && hasAnswered && isSelected && (
                    <span className="inline-flex items-center text-[11px] font-black text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full mt-1.5 shadow-sm">
                      ⚠️ {isSinhala ? 'උගුලකි' : 'Sneaky Trap'}
                    </span>
                  )}
                  {option.type === 'safe' && hasAnswered && isSelected && (
                    <span className="inline-flex items-center text-[11px] font-black text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full mt-1.5 shadow-sm">
                      <Check className="w-3 h-3 mr-1 inline stroke-[3]" />
                      {isSinhala ? 'ආරක්ෂිතයි!' : 'Safe Choice!'}
                    </span>
                  )}
                </div>

                {/* Letter Badge (A, B, C) */}
                <span className="absolute top-2.5 right-3 text-xs font-black text-slate-400">
                  {String.fromCharCode(65 + idx)}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={option.id}
              whileHover={!hasAnswered ? { scale: 1.02 } : {}}
              whileTap={!hasAnswered ? { scale: 0.97 } : {}}
              onClick={() => handleOptionClick(option)}
              disabled={hasAnswered}
              id={`option-btn-${idx + 1}`}
              className={`relative min-h-[90px] p-3.5 sm:p-4 rounded-3xl border-3 text-left flex items-center space-x-3.5 transition-all duration-200 ${btnStyle} cursor-pointer`}
            >
              {/* Large Visual 3D Icon */}
              <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${iconBg} shadow-inner border-2 border-white`}>
                <IconHelper name={option.iconName} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              {/* Label (1-4 words as per HCI design) */}
              <div className="flex-1 pr-2">
                <span className="text-base sm:text-lg font-black block leading-snug break-words">
                  {label}
                </span>
                {option.type === 'trap' && hasAnswered && isSelected && (
                  <span className="inline-flex items-center text-xs font-black text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full mt-1">
                    ⚠️ {isSinhala ? 'උගුලකි' : 'Sneaky Trap'}
                  </span>
                )}
                {option.type === 'safe' && hasAnswered && isSelected && (
                  <span className="inline-flex items-center text-xs font-black text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full mt-1">
                    <Check className="w-3 h-3 mr-1 inline stroke-[3]" />
                    {isSinhala ? 'ආරක්ෂිතයි!' : 'Safe Choice!'}
                  </span>
                )}
              </div>

              {/* Letter Badge (A, B, C, D) */}
              <span className="absolute top-2.5 right-3 text-xs font-black text-slate-400">
                {String.fromCharCode(65 + idx)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Guardian Feedback & Learning Explanation Bubble */}
      <AnimatePresence>
        {hasAnswered && selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-4 sm:p-5 rounded-3xl border-3 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              selectedOption.type === 'safe'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : selectedOption.type === 'trap'
                ? 'bg-amber-50 border-amber-400 text-amber-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div className={`p-3 rounded-2xl flex-shrink-0 shadow-md ${
                selectedOption.type === 'safe'
                  ? 'bg-emerald-500 text-white'
                  : selectedOption.type === 'trap'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}>
                {selectedOption.type === 'safe' ? (
                  <Sparkles className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-black text-xs uppercase tracking-wider text-slate-600">
                  {selectedOption.type === 'safe' 
                    ? (isSinhala ? '🌟 විශිෂ්ට තේරීමක්!' : '🌟 Excellent Choice!') 
                    : (isSinhala ? '💡 ආරක්ෂක උපදෙස:' : '💡 Safety Lesson:')}
                </div>
                <p className="text-base font-bold leading-relaxed">
                  {isSinhala ? (selectedOption.feedbackSi || selectedOption.feedback) : selectedOption.feedback}
                </p>
              </div>
            </div>

            {/* Big tactile Next / Continue button */}
            <button
              onClick={onContinue}
              id="btn-continue-question"
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-xl transition-transform hover:scale-105 active:scale-95 flex-shrink-0 ${
                selectedOption.type === 'safe'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              <span>{isSinhala ? 'ඉදිරියට' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Family Password Verification Modal */}
      {showPasscodeDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-amber-400 space-y-4"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center border-2 border-amber-300 text-3xl">
                🗝️
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                {isSinhala ? 'පවුලේ රහස් පදය!' : 'Family Password Check!'}
              </h3>
              <p className="text-sm font-bold text-slate-600">
                {isSinhala 
                  ? 'ඔබේ පවුලේ රහස් වචනය අසන්න:' 
                  : 'Ask for your secret family code:'} <br/>
                <span className="font-mono bg-amber-100 px-3 py-1 rounded-xl text-amber-900 font-black text-base inline-block mt-1">
                  "{familyPassword}"
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={enteredPass}
                onChange={(e) => {
                  setEnteredPass(e.target.value);
                  setPassError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && enteredPass.trim()) handleVerifyPassword();
                }}
                autoFocus
                aria-label={isSinhala ? 'පවුලේ රහස් වචනය' : 'Family password'}
                placeholder={isSinhala ? 'රහස් වචනය ටයිප් කරන්න' : 'Type the secret code'}
                className={`w-full py-3 px-4 rounded-2xl font-black text-center text-base border-3 outline-none transition-colors ${
                  passError
                    ? 'bg-rose-50 border-rose-400 text-rose-900 focus:border-rose-500'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-amber-400'
                }`}
              />

              {passError && (
                <p className="text-xs font-black text-rose-700 text-center">
                  {isSinhala
                    ? 'එය නිවැරදි නැත. නැවත උත්සාහ කරන්න!'
                    : "That's not the code. Try again!"}
                </p>
              )}

              <button
                onClick={() => {
                  setEnteredPass(familyPassword);
                  setPassError(false);
                }}
                type="button"
                className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-2xl text-xs font-black border-2 border-amber-300"
              >
                {isSinhala ? `මුරපදය පුරවන්න: ${familyPassword}` : `Fill in Family Code: ${familyPassword}`}
              </button>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClosePasscodeDialog}
                  className="flex-1 py-3 rounded-2xl font-black bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  {isSinhala ? 'අවලංගු' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyPassword}
                  disabled={!enteredPass.trim()}
                  className="flex-1 py-3 rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                >
                  {isSinhala ? 'තහවුරු කරන්න' : 'Confirm'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
