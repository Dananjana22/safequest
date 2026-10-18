import React, { useState, useEffect } from 'react';
import { LevelData, UserProfile, OptionItem, QuestionData, SafetyLogEntry } from '../types';
import { SceneIllustration } from './SceneIllustrations';
import { CharacterAvatar, CharacterAction } from './CharacterAvatars';
import { QuestionCard } from './QuestionCard';
import { CATEGORY_INFO } from '../data/curriculumData';
import { narrate, stopVoiceNarrator, playSoundEffect } from '../utils/audio';
import { questionClipId, feedbackClipId, clipUrl } from '../utils/narrationClips';
import { ArrowLeft, Volume2, Sparkles, Shield, Star, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { ChildInstructionsModal } from './ChildInstructionsModal';

interface GameCanvasProps {
  level: LevelData;
  profile: UserProfile;
  onExit: () => void;
  onCompleteLevel: (stars: number, score: number, logs: SafetyLogEntry[]) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  profile,
  onExit,
  onCompleteLevel
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<OptionItem | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState<number>(0);
  const [sessionLogs, setSessionLogs] = useState<SafetyLogEntry[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [envFeedback, setEnvFeedback] = useState<'safe' | 'caution' | 'warning' | 'recovery' | null>(null);
  const [heroAction, setHeroAction] = useState<CharacterAction>('idle');
  const [guardianAction, setGuardianAction] = useState<CharacterAction>('idle');
  const [showChildInstructions, setShowChildInstructions] = useState<boolean>(() => {
    try {
      return localStorage.getItem('safequest_hide_child_guide') !== 'true';
    } catch {
      return true;
    }
  });

  const isSinhala = profile.language === 'si';
  const currentQuestion: QuestionData = level.questions[currentQuestionIndex] || level.questions[0];
  const categoryMeta = CATEGORY_INFO[level.category];

  // Trigger voice narration. Plays a pre-generated clip when one exists for
  // this line, otherwise falls back to browser speech synthesis.
  const triggerVoiceNarration = (custom?: { text: string; clipId: string }) => {
    if (!profile.voiceEnabled) return;

    const voiceLang = profile.language;
    const text =
      custom?.text ??
      (isSinhala ? currentQuestion.voiceOverText.si : currentQuestion.voiceOverText.en);
    const clipId =
      custom?.clipId ?? questionClipId(level.id, currentQuestionIndex);

    setIsSpeaking(true);
    narrate({
      text,
      lang: voiceLang,
      clipUrl: clipUrl(voiceLang, clipId),
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setEnvFeedback(null);
    setHeroAction('idle');
    setGuardianAction('wave');

    // Only auto-narrate question when child instructions modal is not active
    if (!showChildInstructions) {
      const timer = setTimeout(() => {
        triggerVoiceNarration();
      }, 350);

      return () => {
        clearTimeout(timer);
        stopVoiceNarrator();
        setIsSpeaking(false);
      };
    }
  }, [currentQuestionIndex, level.id, showChildInstructions]);

  const handleCloseInstructions = () => {
    setShowChildInstructions(false);
    setTimeout(() => {
      triggerVoiceNarration();
    }, 400);
  };

  const handleSelectOption = (option: OptionItem) => {
    setSelectedOption(option);
    setHasAnswered(true);

    const isCorrect = option.type === 'safe';

    if (isCorrect) {
      setFirstTryCorrectCount(prev => prev + 1);
      setEnvFeedback('safe');
      setHeroAction('celebrate');
      setGuardianAction('happy');

      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setEnvFeedback(option.type === 'trap' ? 'caution' : 'warning');
      setHeroAction('think');
      setGuardianAction('point');
    }

    const logEntry: SafetyLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      levelId: level.id,
      levelTitle: level.title,
      category: level.category,
      questionIndex: currentQuestionIndex + 1,
      scenarioTitle: currentQuestion.onScreenText,
      chosenLabel: option.label,
      isSafe: isCorrect,
      isTrap: option.type === 'trap',
      feedbackGiven: option.feedback
    };

    setSessionLogs(prev => [...prev, logEntry]);

    const feedbackText = isSinhala ? (option.feedbackSi || option.feedback) : option.feedback;
    if (profile.voiceEnabled) {
      triggerVoiceNarration({
        text: feedbackText,
        clipId: feedbackClipId(level.id, currentQuestionIndex, option.id)
      });
    }
  };

  const handleContinue = () => {
    stopVoiceNarrator();

    if (currentQuestionIndex < level.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let starsEarned = 1;
      if (firstTryCorrectCount === 3) {
        starsEarned = 3;
      } else if (firstTryCorrectCount >= 2) {
        starsEarned = 2;
      }

      onCompleteLevel(starsEarned, firstTryCorrectCount, sessionLogs);
    }
  };

  const sceneDescription = isSinhala 
    ? (currentQuestion.sceneDescriptionSi || currentQuestion.sceneDescription) 
    : currentQuestion.sceneDescription;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-400 via-teal-200 to-emerald-300 py-4 px-3 sm:px-6 flex flex-col justify-between select-none relative overflow-hidden">
      {/* 3D Sun Glow */}
      <div className="absolute top-2 right-6 w-20 h-20 rounded-full bg-amber-300 ring-12 ring-amber-200/50 shadow-2xl pointer-events-none" />

      {/* Top 3D Game HUD */}
      <header className="max-w-5xl mx-auto w-full z-20 flex items-center justify-between bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              playSoundEffect('click');
              onExit();
            }}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-amber-100 text-slate-800 transition-all border-2 border-slate-200 hover:scale-105"
            title="Return to Map"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                {isSinhala ? `මට්ටම ${level.levelNumber}` : `Level ${level.levelNumber}`}
              </span>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                {isSinhala ? `වයස ${level.ageTrack}` : `Age ${level.ageTrack}`}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
              {isSinhala ? (level.titleSi || level.title) : level.title}
            </h2>
          </div>
        </div>

        {/* Step Indicator (1 -> 2 -> 3) & Instructions Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              playSoundEffect('click');
              setShowChildInstructions(true);
            }}
            className="px-3 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-md border-2 border-white flex items-center space-x-1 transition-all hover:scale-105 active:scale-95 cursor-pointer mr-1"
            title={isSinhala ? 'ක්‍රීඩා උපදෙස්' : 'Instructions'}
          >
            <HelpCircle className="w-4 h-4 text-amber-950" />
            <span className="hidden sm:inline">{isSinhala ? 'උපදෙස්' : 'Help'}</span>
          </button>

          {level.questions.map((q, idx) => {
            const isDone = idx < currentQuestionIndex;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <div
                key={q.id}
                className={`w-9 h-9 rounded-2xl font-black text-xs flex items-center justify-center transition-all border-2 ${
                  isDone
                    ? 'bg-emerald-500 text-white border-emerald-300 shadow-md'
                    : isCurrent
                    ? 'bg-amber-400 text-amber-950 border-white scale-110 shadow-lg ring-4 ring-amber-300/60'
                    : 'bg-slate-200 text-slate-400 border-slate-300'
                }`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Game Stage Area */}
      <main className="max-w-6xl mx-auto w-full z-10 my-auto py-2 sm:py-3 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
        {/* Left Side: 3D Scene Viewport + Full-Body Characters */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <SceneIllustration 
              type={currentQuestion.sceneType} 
              feedbackState={envFeedback}
            />

            {/* Full-Body 3D Hero on Stage */}
            <div className="absolute bottom-1 left-4 z-10">
              <CharacterAvatar
                id={profile.avatarId}
                size="lg"
                action={heroAction}
                className="drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Guardian Coach Speech Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-4 border-amber-200 flex items-center space-x-4">
            <CharacterAvatar
              id="guardian"
              guardianRole={profile.guardianRole}
              guardianFeatures={profile.guardianFeatures}
              size="md"
              action={guardianAction}
              isSpeaking={isSpeaking}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-800 uppercase tracking-wider">
                  {isSinhala 
                    ? (profile.guardianRole === 'Mum' ? 'අම්මා' : profile.guardianRole === 'Dad' ? 'තාත්තා' : profile.guardianRole === 'Grandma' ? 'ආච්චි' : profile.guardianRole === 'Teacher' ? 'ගුරුතුමිය' : profile.guardianRole === 'Coach' ? 'පුහුණුකරු' : 'භාරකරු')
                    : (profile.guardianRole || 'Guardian')}
                </span>
                {isSpeaking && (
                  <span className="text-[11px] font-black text-amber-600 animate-pulse flex items-center">
                    <Volume2 className="w-3.5 h-3.5 mr-1" />
                    {isSinhala ? 'කතා කරයි...' : 'Speaking...'}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug mt-0.5">
                "{sceneDescription}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Decision Cards */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <QuestionCard
            question={currentQuestion}
            language={profile.language}
            familyPassword={profile.familyPassword}
            onSelectOption={handleSelectOption}
            onContinue={handleContinue}
            selectedOption={selectedOption}
            hasAnswered={hasAnswered}
            onSpeak={() => triggerVoiceNarration()}
            isSpeaking={isSpeaking}
          />
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="z-10 text-center text-xs font-bold text-slate-700/80">
        {isSinhala 
          ? '🛡️ SafeQuest • සැබෑ කාලීන අන්තර්ක්‍රියාකාරී ළමා ආරක්ෂණ පද්ධතිය' 
          : '🛡️ SafeQuest • Real-Time Interactive Safety Engine'}
      </footer>

      {/* Child Instructions Pop-Up Modal (Before Play Game) */}
      <ChildInstructionsModal
        isOpen={showChildInstructions}
        onClose={handleCloseInstructions}
        avatarId={profile.avatarId}
        isSinhala={isSinhala}
        voiceEnabled={profile.voiceEnabled}
      />
    </div>
  );
};
