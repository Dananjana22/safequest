import React from 'react';
import { LevelData, UserProfile, AgeTrack, ProgressState } from '../types';
import { LEVELS_DATA, CATEGORY_INFO } from '../data/curriculumData';
import { IconHelper } from './IconHelper';
import { CharacterAvatar } from './CharacterAvatars';
import { Star, Lock, Play, CheckCircle2, Shield, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface LevelSelectorProps {
  profile: UserProfile;
  progress: ProgressState;
  selectedAgeTrack: AgeTrack;
  onSelectAgeTrack: (age: AgeTrack) => void;
  onStartLevel: (level: LevelData) => void;
  onOpenSettings: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  profile,
  progress,
  selectedAgeTrack,
  onSelectAgeTrack,
  onStartLevel,
  onOpenSettings
}) => {
  const isSinhala = profile.language === 'si';

  // Filter levels by the selected age track
  const currentTrackLevels = LEVELS_DATA.filter(l => l.ageTrack === selectedAgeTrack);

  const totalStarsInTrack = currentTrackLevels.reduce((acc, level) => {
    const result = progress.completedLevels[level.id];
    return acc + (result ? result.stars : 0);
  }, 0);

  const maxStarsInTrack = currentTrackLevels.length * 3;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-300 p-6 sm:p-8 shadow-md border-4 border-amber-200">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <CharacterAvatar id={profile.avatarId} size="xl" className="drop-shadow-lg" />
              <button
                onClick={onOpenSettings}
                className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-white text-[11px] font-bold text-slate-700 shadow border hover:bg-slate-50"
                title={isSinhala ? 'චරිතය හෝ භාරකරු වෙනස් කරන්න' : 'Change Character or Guardian'}
              >
                {isSinhala ? 'සකසන්න' : 'Edit'}
              </button>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/80 text-amber-900 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isSinhala ? 'SafeQuest වීර වික්‍රමය' : 'SafeQuest Hero Adventure'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Fredoka',sans-serif]">
                {isSinhala ? `නැවත සාදරයෙන් පිළිගනිමු, ${profile.childName}!` : `Welcome back, ${profile.childName}!`}
              </h1>
              <p className="text-sm font-semibold text-slate-800">
                {isSinhala ? 'භාරකරු: ' : 'Guardian: '}
                <span className="font-bold">
                  {isSinhala ? (profile.guardianRole === 'Mum' ? 'අම්මා' : profile.guardianRole === 'Dad' ? 'තාත්තා' : profile.guardianRole === 'Grandma' ? 'ආච්චි' : profile.guardianRole === 'Teacher' ? 'ගුරුතුමිය' : 'පුහුණුකරු') : profile.guardianRole}
                </span>
              </p>
            </div>
          </div>

          {/* Stars & Progress Badge */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-amber-300 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow">
              ⭐
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase text-slate-500">
                {isSinhala ? 'තරු එකතුව' : 'Track Stars'}
              </div>
              <div className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif]">
                {totalStarsInTrack} / {maxStarsInTrack}
              </div>
              <div className="text-[11px] font-bold text-emerald-700">
                {isSinhala ? 'සමත් වීම: 3 න් 2ක්' : 'Pass Rule: 2/3 First Try'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Age-Track Switcher Tabs (6, 7, 8, 9) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {isSinhala ? 'වයස් කාණ්ඩය තෝරන්න' : 'Select Age Track (4 × 5 Structure)'}
          </span>
          <span className="text-xs font-bold text-amber-700">
            {isSinhala ? `${profile.childName} සඳහා නිර්දේශිත: වයස ${profile.age}` : `Recommended for ${profile.childName}: Age ${profile.age}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {([6, 7, 8, 9] as AgeTrack[]).map((age) => {
            const isSelected = selectedAgeTrack === age;
            const isChildAge = profile.age === age;

            return (
              <button
                key={age}
                onClick={() => onSelectAgeTrack(age)}
                id={`age-track-btn-${age}`}
                className={`py-3 px-4 rounded-2xl font-black text-base transition-all duration-200 flex flex-col items-center justify-center space-y-0.5 border-2 ${
                  isSelected
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-4 ring-amber-200 scale-102 font-[\'Fredoka\',sans-serif]'
                    : 'bg-white hover:bg-amber-50/60 text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Shield className={`w-4 h-4 ${isSelected ? 'text-amber-950' : 'text-slate-400'}`} />
                  <span className="text-lg">{isSinhala ? `වයස ${age}` : `Track: Age ${age}`}</span>
                </div>
                <span className="text-[11px] font-bold opacity-80">
                  {isChildAge ? (isSinhala ? '⭐ වත්මන් පැතිකඩ' : '⭐ Current Profile') : (isSinhala ? 'මට්ටම් 5ක්' : '5 Core Levels')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Levels List for Selected Track */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif] flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>{isSinhala ? `වයස ${selectedAgeTrack} ආරක්ෂණ මට්ටම්` : `Age ${selectedAgeTrack} Safety Levels`}</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {isSinhala ? 'ආරක්ෂක කාණ්ඩ 5' : '5 Safety Categories'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTrackLevels.map((level, idx) => {
            const categoryMeta = CATEGORY_INFO[level.category];
            const levelResult = progress.completedLevels[level.id];
            const isCompleted = !!levelResult && levelResult.passed;
            const stars = levelResult ? levelResult.stars : 0;

            const prevLevel = currentTrackLevels[idx - 1];
            const isUnlocked = 
              idx === 0 || 
              progress.unlockedLevels.includes(level.id) || 
              (prevLevel && progress.completedLevels[prevLevel.id]?.passed);

            return (
              <motion.div
                key={level.id}
                whileHover={isUnlocked ? { y: -4 } : {}}
                className={`relative rounded-3xl p-5 border-3 transition-all duration-200 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/90 border-emerald-300 shadow-sm'
                    : isUnlocked
                    ? 'bg-white border-amber-300/80 shadow-md hover:shadow-lg'
                    : 'bg-slate-100/80 border-slate-200 opacity-75'
                }`}
              >
                {/* Top Category Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${categoryMeta.bgLight}`}>
                      {isSinhala ? `මට්ටම ${level.levelNumber} • ${categoryMeta.titleSi}` : `L${level.levelNumber} • ${categoryMeta.title}`}
                    </span>

                    {/* Star Rating Display */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= stars
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-lg font-black text-slate-800 font-['Fredoka',sans-serif] leading-snug">
                      {isSinhala ? (level.titleSi || level.title) : level.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1 line-clamp-2">
                      {isSinhala ? (level.summarySi || level.summary) : level.summary}
                    </p>
                  </div>
                </div>

                {/* Bottom Meta & Play Button */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-500">
                    ⏱️ {level.estimatedPlaytime} • {isSinhala ? 'ප්‍රශ්න 3ක්' : '3 Questions'}
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => onStartLevel(level)}
                      id={`start-level-btn-${level.id}`}
                      className={`px-4 py-2 rounded-xl font-extrabold text-sm flex items-center space-x-1.5 transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'
                          : 'bg-amber-400 hover:bg-amber-500 text-amber-950 hover:scale-105 ring-2 ring-amber-300'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isSinhala ? 'නැවත' : 'Replay'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isSinhala ? 'ක්‍රීඩා' : 'Play'}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isSinhala ? 'අගුලු දමා ඇත' : 'Locked'}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
