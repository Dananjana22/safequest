import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LevelData, UserProfile, ProgressState, LanguageCode } from '../types';
import { CharacterAvatar } from './CharacterAvatars';
import { playSoundEffect } from '../utils/audio';
import { LEVELS_DATA } from '../data/curriculumData';
import { Shield, Sparkles, Star, Lock, Play, Volume2, Settings, ArrowLeft, Globe, HelpCircle } from 'lucide-react';
import { ChildInstructionsModal } from './ChildInstructionsModal';

interface VillageMapProps {
  levels?: LevelData[];
  profile: UserProfile;
  progress: ProgressState;
  onSelectLevel: (level: LevelData) => void;
  onOpenParentPortal?: () => void;
  onOpenParentGate?: () => void;
  onBackToLanding?: () => void;
  onChangeLanguage?: (lang: LanguageCode) => void;
  onToggleVoice: () => void;
}

export const VillageMap: React.FC<VillageMapProps> = ({
  levels,
  profile,
  progress,
  onSelectLevel,
  onOpenParentPortal,
  onOpenParentGate,
  onBackToLanding,
  onChangeLanguage,
  onToggleVoice
}) => {
  const activeProfile = profile || {
    id: 'default',
    childName: 'Adventurer',
    age: 6,
    avatarId: 'kai',
    guardianName: 'Parent',
    guardianRole: 'Mom',
    familyPassword: 'StarTiger77',
    trustedAdults: [],
    language: 'en',
    voiceEnabled: true,
    createdDate: new Date().toISOString()
  };

  const isSinhala = activeProfile.language === 'si';
  const [showChildGuide, setShowChildGuide] = useState(false);
  
  // Filter levels for the child's age track
  const mapLevels = (levels || LEVELS_DATA).filter(l => l.ageTrack === activeProfile.age);

  // Calculate total stars collected
  const totalStars = Object.values(progress?.completedLevels || {}).reduce((acc: number, curr: any) => acc + (curr?.stars || 0), 0);
  const maxPossibleStars = mapLevels.length * 3;

  const handleOpenParent = () => {
    if (onOpenParentPortal) {
      onOpenParentPortal();
    } else if (onOpenParentGate) {
      onOpenParentGate();
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'stranger':
        return {
          bgGrad: 'from-emerald-400 via-teal-500 to-emerald-700',
          border: 'border-emerald-300',
          ring: 'ring-emerald-400',
          zoneName: isSinhala ? 'ක්‍රීඩා පිටිය' : 'Sunny Park',
          icon: '🎡'
        };
      case 'body_safety':
        return {
          bgGrad: 'from-sky-400 via-blue-500 to-indigo-600',
          border: 'border-sky-300',
          ring: 'ring-sky-400',
          zoneName: isSinhala ? 'ආරක්ෂිත නිවස' : 'Safe Haven',
          icon: '🏠'
        };
      case 'secrets':
        return {
          bgGrad: 'from-amber-400 via-orange-500 to-amber-700',
          border: 'border-amber-300',
          ring: 'ring-amber-400',
          zoneName: isSinhala ? 'රහස් සහ සීමා' : 'Secrets Tower',
          icon: '🗝️'
        };
      case 'public_safety':
        return {
          bgGrad: 'from-indigo-400 via-purple-500 to-indigo-700',
          border: 'border-indigo-300',
          ring: 'ring-indigo-400',
          zoneName: isSinhala ? 'සුපිරි වෙළඳසැල' : 'City Plaza',
          icon: '🛒'
        };
      case 'digital_safety':
      default:
        return {
          bgGrad: 'from-purple-400 via-fuchsia-500 to-purple-800',
          border: 'border-purple-300',
          ring: 'ring-purple-400',
          zoneName: isSinhala ? 'ඩිජිටල් කාමරය' : 'Cyber Room',
          icon: '📱'
        };
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-sky-400 via-teal-300 to-emerald-400 overflow-hidden flex flex-col justify-between">
      {/* 3D Atmosphere Background FX: Sun, Animated Floating Clouds, Sparkles */}
      <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-amber-300 ring-16 ring-amber-200/50 shadow-2xl animate-pulse pointer-events-none" />
      
      {/* Drifting 3D Clouds */}
      <motion.div 
        animate={{ x: [-40, 40, -40] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        className="absolute top-8 left-10 w-44 h-14 rounded-full bg-white/80 filter blur-[1px] pointer-events-none"
      />
      <motion.div 
        animate={{ x: [30, -30, 30] }}
        transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
        className="absolute top-24 right-20 w-56 h-16 rounded-full bg-white/70 filter blur-[1px] pointer-events-none"
      />

      {/* Top 3D Game HUD Header */}
      <header className="relative z-20 w-full max-w-5xl mx-auto pt-4 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Back to Home + Child Avatar & Name Pill */}
        <div className="flex items-center space-x-2">
          {onBackToLanding && (
            <button
              onClick={() => {
                playSoundEffect('click');
                onBackToLanding();
              }}
              className="p-2.5 rounded-2xl bg-white/95 text-slate-700 hover:bg-amber-100 hover:text-slate-900 transition-all shadow-xl border-2 border-white"
              title={isSinhala ? 'මුල් පිටුවට' : 'Back to Home'}
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          <motion.div 
            whileHover={{ scale: 1.04 }}
            className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border-2 border-white"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 ring-2 ring-amber-400">
              <CharacterAvatar id={activeProfile.avatarId} size="sm" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {isSinhala ? 'වීරයා' : 'HERO'} • {isSinhala ? `වයස ${activeProfile.age}` : `AGE ${activeProfile.age}`}
              </div>
              <div className="text-sm sm:text-base font-black text-slate-800 leading-none">
                {activeProfile.childName || (isSinhala ? 'වීරයා' : 'Adventurer')}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center: Star Energy Counter */}
        <div className="flex items-center space-x-2 bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-2xl shadow-xl border-2 border-yellow-200">
          <Star className="w-5 h-5 fill-amber-950" />
          <span className="text-lg">{totalStars} / {maxPossibleStars}</span>
          <span className="text-xs uppercase bg-amber-200 px-2 py-0.5 rounded-full font-bold">
            {isSinhala ? 'තරු' : 'STARS'}
          </span>
        </div>

        {/* Right: Controls (Language, Voice, Parent Gate) */}
        <div className="flex items-center space-x-2">
          {onChangeLanguage && (
            <div className="flex items-center bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-lg border-2 border-white">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  onChangeLanguage('en');
                }}
                className={`px-2 py-1 rounded-xl text-xs font-black transition-all ${
                  activeProfile.language === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  playSoundEffect('click');
                  onChangeLanguage('si');
                }}
                className={`px-2 py-1 rounded-xl text-xs font-black transition-all ${
                  activeProfile.language === 'si' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                සිංහල
              </button>
            </div>
          )}

          {/* How to Play Guide Button for Kids */}
          <button
            onClick={() => {
              playSoundEffect('click');
              setShowChildGuide(true);
            }}
            className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 px-3 py-2 rounded-2xl font-black shadow-lg border-2 border-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isSinhala ? 'ක්‍රීඩා උපදෙස්' : 'How to Play'}
          >
            <HelpCircle className="w-4 h-4 text-amber-950" />
            <span className="text-xs font-black">{isSinhala ? 'උපදෙස්' : 'Guide'}</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('click');
              onToggleVoice();
            }}
            className={`p-2.5 rounded-2xl font-bold transition-all shadow-lg border-2 border-white ${
              activeProfile.voiceEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}
            title="Voice Narration"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              playSoundEffect('click');
              handleOpenParent();
            }}
            className="flex items-center space-x-1.5 bg-slate-900/90 text-white hover:bg-slate-950 px-3.5 py-2.5 rounded-2xl font-bold shadow-xl border-2 border-slate-700 transition-all hover:scale-105"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black">{isSinhala ? 'දෙමාපියන්' : 'PARENTS'}</span>
          </button>
        </div>
      </header>

      {/* Main 3D Floating Island Map */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center">
        {/* Title Banner */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center space-x-2 bg-white/90 text-slate-800 font-black px-4 py-1.5 rounded-full text-xs shadow-md border border-white mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isSinhala ? `ආරක්ෂිත ගම්මානය • වයස ${activeProfile.age} මට්ටම්` : `SAFE VILLAGE • AGE ${activeProfile.age} ADVENTURES`}</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md tracking-tight">
            {isSinhala ? 'ඔබේ ආරක්ෂක මෙහෙයුම තෝරන්න' : 'Choose Your Safety Quest'}
          </h1>
        </motion.div>

        {/* 3D Floating Level Nodes Pathway */}
        <div className="relative w-full max-w-3xl flex flex-col items-center space-y-6 sm:space-y-8 my-auto">
          {mapLevels.map((lvl, index) => {
            const result = progress?.completedLevels?.[lvl.id];
            const isCompleted = !!result;
            const stars = result ? result.stars : 0;
            const isUnlocked = progress?.unlockedLevels?.includes(lvl.id) || index === 0;
            const theme = getCategoryTheme(lvl.category);

            // Alternate zigzag alignment for natural adventure path feel
            const alignment = index % 2 === 0 ? 'sm:self-start sm:ml-12' : 'sm:self-end sm:mr-12';

            return (
              <motion.div
                key={lvl.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={isUnlocked ? { scale: 1.04, y: -4 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                className={`relative ${alignment} w-full sm:w-80`}
              >
                {/* Connector Bridge line to next node */}
                {index < mapLevels.length - 1 && (
                  <div className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 w-2 h-8 bg-white/60 border-l-2 border-r-2 border-amber-300 border-dashed z-0" />
                )}

                {/* 3D Card Pod */}
                <div
                  onClick={() => {
                    if (isUnlocked) {
                      playSoundEffect('click');
                      onSelectLevel(lvl);
                    } else {
                      playSoundEffect('retry');
                    }
                  }}
                  className={`relative z-10 cursor-pointer rounded-3xl p-4 sm:p-5 text-white shadow-2xl transition-all border-4 ${
                    isUnlocked
                      ? `bg-gradient-to-r ${theme.bgGrad} ${theme.border} hover:shadow-cyan-400/40`
                      : 'bg-slate-700/90 border-slate-600 opacity-75 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Level Number & Icon Badge */}
                    <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border-2 border-white/40">
                      {theme.icon}
                      {/* Star Badge */}
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 rounded-full p-1 shadow-md border-2 border-white">
                          <Star className="w-3.5 h-3.5 fill-amber-950" />
                        </div>
                      )}
                    </div>

                    {/* Level Title & Zone */}
                    <div className="flex-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-amber-200">
                        {theme.zoneName}
                      </div>
                      <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow-sm">
                        {isSinhala ? (lvl.titleSi || lvl.title) : lvl.title}
                      </h3>
                      
                      {/* Star Rating Row */}
                      <div className="flex items-center space-x-1 mt-1.5">
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            className={`w-4 h-4 ${
                              starNum <= stars
                                ? 'text-amber-300 fill-amber-300 drop-shadow'
                                : 'text-white/30 fill-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Icon (Play or Lock) */}
                    <div className="pl-1">
                      {isUnlocked ? (
                        <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg font-black">
                          <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center">
                          <Lock className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Floating Guardian Character in Bottom-Right Corner cheering child on */}
      <div className="fixed bottom-3 right-4 sm:right-8 z-30 pointer-events-none hidden sm:block">
        <CharacterAvatar id="guardian" size="lg" guardianRole={activeProfile.guardianRole} guardianFeatures={activeProfile.guardianFeatures} action="wave" />
      </div>

      {/* Bottom Footer Safety Shield Badge */}
      <footer className="relative z-20 w-full py-3 text-center text-xs font-bold text-white/90 drop-shadow">
        {isSinhala 
          ? '🛡️ SafeQuest • අන්තර්ක්‍රියාකාරී ළමා ආරක්ෂණ පද්ධතිය' 
          : '🛡️ SafeQuest • Interactive Child Safety Engine'}
      </footer>

      {/* Child Instructions Pop-Up Modal */}
      <ChildInstructionsModal
        isOpen={showChildGuide}
        onClose={() => setShowChildGuide(false)}
        avatarId={activeProfile.avatarId}
        isSinhala={isSinhala}
        voiceEnabled={activeProfile.voiceEnabled}
      />
    </div>
  );
};
