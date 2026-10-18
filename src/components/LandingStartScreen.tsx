import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, ProgressState } from '../types';
import { CharacterAvatar } from './CharacterAvatars';
import { playSoundEffect } from '../utils/audio';
import { Play, Shield, Sparkles, Settings, Star, Volume2, Globe, HelpCircle } from 'lucide-react';
import { ParentInstructionsModal } from './ParentInstructionsModal';

interface LandingStartScreenProps {
  profile: UserProfile;
  progress: ProgressState;
  onStartGame: () => void;
  onOpenSetup: () => void;
  onOpenParentPortal: () => void;
  onChangeLanguage: (lang: 'en' | 'si') => void;
  onToggleVoice: () => void;
}

export const LandingStartScreen: React.FC<LandingStartScreenProps> = ({
  profile,
  progress,
  onStartGame,
  onOpenSetup,
  onOpenParentPortal,
  onChangeLanguage,
  onToggleVoice
}) => {
  const isSinhala = profile.language === 'si';
  const totalStars = Object.values(progress.completedLevels).reduce((acc: number, curr: any) => acc + (curr?.stars || 0), 0);
  const [showInstructions, setShowInstructions] = useState(false);

  const handlePlayGameClick = () => {
    const hideGuide = localStorage.getItem('safequest_hide_parent_guide');
    if (hideGuide === 'true') {
      playSoundEffect('celebrate');
      onStartGame();
    } else {
      playSoundEffect('pop');
      setShowInstructions(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-sky-400 via-indigo-400 to-purple-600 overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Sun & Sky Particles */}
      <div className="absolute top-4 right-10 w-28 h-28 rounded-full bg-amber-300 ring-20 ring-amber-200/50 shadow-2xl animate-pulse pointer-events-none" />

      {/* Drifting Clouds */}
      <motion.div
        animate={{ x: [-30, 30, -30] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        className="absolute top-10 left-12 w-48 h-16 rounded-full bg-white/80 filter blur-[0.5px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [20, -20, 20] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="absolute top-28 right-24 w-60 h-20 rounded-full bg-white/70 filter blur-[0.5px] pointer-events-none"
      />

      {/* Top Bar HUD */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between">
        {/* Language Switcher */}
        <div className="flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border-2 border-white">
          <Globe className="w-4 h-4 text-indigo-600" />
          <button
            onClick={() => {
              playSoundEffect('click');
              onChangeLanguage('en');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${profile.language === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-indigo-600'
              }`}
          >
            EN
          </button>
          <button
            onClick={() => {
              playSoundEffect('click');
              onChangeLanguage('si');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${profile.language === 'si' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-indigo-600'
              }`}
          >
            සිංහල
          </button>
        </div>

        {/* Right Controls (Voice Toggle, Parent Guide & Parent Portal) */}
        <div className="flex items-center space-x-2">
          {/* Parent Instructions Guide Button */}
          <button
            onClick={() => {
              playSoundEffect('click');
              setShowInstructions(true);
            }}
            className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 px-3 py-2 rounded-2xl font-black shadow-lg border-2 border-white transition-all hover:scale-105 active:scale-95"
            title={isSinhala ? 'දෙමාපිය මඟපෙන්වීම (පියවර 4)' : 'Parent Guide (4 Steps)'}
          >
            <HelpCircle className="w-4 h-4 text-amber-950" />
            <span className="text-xs">{isSinhala ? 'මඟපෙන්වීම' : 'Guide'}</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('click');
              onToggleVoice();
            }}
            className={`p-2.5 rounded-2xl font-bold transition-all shadow-lg border-2 border-white ${profile.voiceEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            title="Voice Narration"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              playSoundEffect('click');
              onOpenParentPortal();
            }}
            className="flex items-center space-x-1.5 bg-slate-900 text-white hover:bg-slate-950 px-4 py-2.5 rounded-2xl font-black shadow-xl border-2 border-slate-700 transition-all hover:scale-105"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="text-xs">{isSinhala ? 'දෙමාපිය ද්වාරය' : 'Parent Portal'}</span>
          </button>
        </div>
      </header>

      {/* Hero Center Presentation: Characters + Game Title + Start Action */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center text-center space-y-6">
        {/* Animated Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center space-x-2 bg-white/95 px-5 py-2 rounded-full shadow-2xl border-2 border-amber-300"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="font-black text-sm text-slate-800 tracking-wide uppercase">
            {isSinhala ? 'ළමා ආරක්ෂණ වික්‍රමය' : 'Child Safety Adventure'}
          </span>
        </motion.div>

        {/* Game Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)] tracking-tight">
            SafeQuest
          </h1>
          <p className="text-base sm:text-xl font-bold text-amber-200 drop-shadow-md max-w-lg mx-auto">
            {isSinhala
              ? 'විශ්වාසයෙන් සහ සතුටින් ආරක්ෂක තීරණ ගන්නා වික්‍රමය!'
              : 'Learn real-world safety skills through interactive story quests!'}
          </p>
        </motion.div>

        {/* Full-Body Characters Spotlight */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-end justify-center space-x-4 sm:space-x-8 py-2"
        >
          {/* Child Hero */}
          <div className="flex flex-col items-center">
            <CharacterAvatar id={profile.avatarId} size="xl" action="happy" showBadge />
          </div>

          {/* Guardian (Inspired by ddd.jpg) */}
          <div className="flex flex-col items-center">
            <CharacterAvatar id="guardian" size="2xl" guardianRole={profile.guardianRole} guardianFeatures={profile.guardianFeatures} action="wave" showBadge />
          </div>
        </motion.div>

        {/* Profile Details Tag */}
        <div className="bg-slate-900/80 backdrop-blur-md px-5 py-2 rounded-2xl border-2 border-purple-400/50 text-white flex items-center space-x-4 shadow-xl">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-amber-300 font-bold uppercase">{isSinhala ? 'වීරයා:' : 'Hero:'}</span>
            <span className="font-black text-sm">{profile.childName}</span>
          </div>
          <div className="w-1 h-4 bg-purple-400/40" />
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-amber-300 font-bold uppercase">{isSinhala ? 'වයස:' : 'Age:'}</span>
            <span className="font-black text-sm">{profile.age} {isSinhala ? 'වසර' : 'Years'}</span>
          </div>
          <div className="w-1 h-4 bg-purple-400/40" />
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-black text-sm">{totalStars}</span>
          </div>
        </div>

        {/* Big Play Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePlayGameClick}
            className="w-full sm:flex-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black py-4 px-8 rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center space-x-3 text-xl tracking-wide cursor-pointer"
          >
            <Play className="w-7 h-7 fill-slate-950" />
            <span>{isSinhala ? 'ක්‍රීඩා කරන්න!' : 'PLAY GAME'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              playSoundEffect('click');
              onOpenSetup();
            }}
            className="w-full sm:w-auto bg-white/95 hover:bg-white text-slate-800 font-black py-4 px-6 rounded-3xl shadow-xl border-4 border-white flex items-center justify-center space-x-2 text-base cursor-pointer"
          >
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>{isSinhala ? 'පැතිකඩ සකසන්න' : 'Setup Profile'}</span>
          </motion.button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-xs font-bold text-white/80 py-2">
        {isSinhala 
          ? '🛡️ SafeQuest • ළමා ආරක්ෂණ සහ අපයෝජන වැළැක්වීමේ අධ්‍යාපනික පද්ධතිය' 
          : '🛡️ SafeQuest • Personalized Child Safety & Abuse Prevention Engine'}
      </footer>

      {/* Parent Instructions Pop-Up (4 Steps Quick Guide before Play) */}
      <ParentInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        onStartGame={onStartGame}
        onOpenSetup={onOpenSetup}
        isSinhala={isSinhala}
      />
    </div>
  );
};
