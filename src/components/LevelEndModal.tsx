import React, { useEffect } from 'react';
import { LevelData, UserProfile } from '../types';
import { CharacterAvatar } from './CharacterAvatars';
import { playSoundEffect } from '../utils/audio';
import { Star, Award, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface LevelEndModalProps {
  level: LevelData;
  profile: UserProfile;
  stars: number;
  score: number;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onBackToMap: () => void;
}

export const LevelEndModal: React.FC<LevelEndModalProps> = ({
  level,
  profile,
  stars,
  score,
  onNextLevel,
  onReplayLevel,
  onBackToMap
}) => {
  const isPassed = score >= 2;
  const isSinhala = profile.language === 'si';

  useEffect(() => {
    if (isPassed) {
      playSoundEffect('celebrate');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      playSoundEffect('retry');
    }
  }, [isPassed]);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-400 text-center space-y-6 relative overflow-hidden"
      >
        {/* Glow FX */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-300/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-emerald-300/40 blur-2xl pointer-events-none" />

        {/* Character Celebration Row */}
        <div className="flex justify-center items-center space-x-6">
          <CharacterAvatar id={profile.avatarId} size="lg" action="celebrate" />
          <CharacterAvatar id="guardian" guardianRole={profile.guardianRole} guardianFeatures={profile.guardianFeatures} size="md" action="happy" />
        </div>

        {/* Title & Star Rating */}
        <div className="space-y-2">
          {isPassed ? (
            <div className="inline-flex items-center space-x-1.5 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isSinhala ? 'මට්ටම ජයග්‍රහණය කළා!' : 'Level Mastered!'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
              <span>{isSinhala ? 'නැවත පුහුණු වෙමු!' : 'Practice Makes Safe!'}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
            {isPassed 
              ? (isSinhala ? 'විශිෂ්ට ආරක්ෂක තීරණ!' : 'Safety Quest Mastered!') 
              : (isSinhala ? 'නැවත උත්සාහ කරන්න!' : 'Great Effort! Try Again')}
          </h2>

          <p className="text-sm font-bold text-slate-600 max-w-xs mx-auto">
            {isPassed
              ? (isSinhala ? `ඔබ සාර්ථකව ආරක්ෂක තේරීම් කළා!` : `You made smart safety choices in "${level.title}"!`)
              : (isSinhala ? `ප්‍රශ්න 3 න් ${score} ක් නිවැරදියි.` : `You got ${score} of 3 safe. Let's try again!`)}
          </p>
        </div>

        {/* 3 Animated Stars */}
        <div className="flex justify-center items-center space-x-3 py-1">
          {[1, 2, 3].map((starNum) => {
            const hasStar = isPassed && starNum <= stars;
            return (
              <motion.div
                key={starNum}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: starNum * 0.15, type: 'spring' }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-3 transition-all ${
                  hasStar
                    ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-xl scale-110'
                    : 'bg-slate-100 border-slate-300 text-slate-300'
                }`}
              >
                <Star className={`w-8 h-8 ${hasStar ? 'fill-amber-950 stroke-amber-950' : 'stroke-slate-300'}`} />
              </motion.div>
            );
          })}
        </div>

        {/* Guardian Advice Quote Box */}
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 text-left flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-200 text-amber-900 flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-900 uppercase">
              {isSinhala 
                ? (profile.guardianRole === 'Mum' ? 'අම්මා' : profile.guardianRole === 'Dad' ? 'තාත්තා' : profile.guardianRole === 'Grandma' ? 'ආච්චි' : profile.guardianRole === 'Teacher' ? 'ගුරුතුමිය' : profile.guardianRole === 'Coach' ? 'පුහුණුකරු' : 'භාරකරු')
                : (profile.guardianRole || 'Guardian')}
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
              {isPassed
                ? (isSinhala 
                    ? `"${profile.childName}, ඔබ ඉතා හොඳින් ආරක්ෂක නීති පිළිපැද්දා! මීළඟ අභියෝගයට සූදානම්ද?"`
                    : `"You're doing great, ${profile.childName}! Ready for the next safety quest?"`)
                : (isSinhala
                    ? `"${profile.childName}, පවුලේ මුරපදය සහ විශ්වාසවන්ත වැඩිහිටියන් මතක තබාගන්න!"`
                    : `"Let's practice again together, ${profile.childName}. Remember your family password and trusted helpers!"`)}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={() => {
              playSoundEffect('click');
              onBackToMap();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <span>{isSinhala ? 'ගම්මානයේ සිතියම' : 'Village Map'}</span>
          </button>

          {!isPassed ? (
            <button
              onClick={() => {
                playSoundEffect('click');
                onReplayLevel();
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl font-black bg-amber-400 hover:bg-amber-500 text-slate-950 transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isSinhala ? 'නැවත උත්සාහ කරන්න' : 'Try Again'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playSoundEffect('click');
                onNextLevel();
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center space-x-2 shadow-xl"
            >
              <span>{isSinhala ? 'මීළඟ මෙහෙයුම' : 'Next Quest'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
