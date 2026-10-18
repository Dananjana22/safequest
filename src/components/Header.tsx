import React from 'react';
import { UserProfile, LanguageCode } from '../types';
import { CharacterAvatar } from './CharacterAvatars';
import { Shield, Lock, Volume2, VolumeX, Globe, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  onOpenParentPortal: () => void;
  onToggleVoice: () => void;
  onChangeLanguage: (lang: LanguageCode) => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenParentPortal,
  onToggleVoice,
  onChangeLanguage,
  onOpenHelp
}) => {
  const isSinhala = profile.language === 'si';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-amber-200/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Game Title & Shield Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center shadow-md border-2 border-amber-300 transform -rotate-3 hover:rotate-0 transition-transform">
            <Shield className="w-6 h-6 text-amber-950 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black text-slate-900 font-['Fredoka',sans-serif] tracking-tight">
                SafeQuest
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {isSinhala ? 'වයස 6–9' : 'Ages 6–9'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 hidden sm:block">
              {isSinhala 
                ? 'ළමා ආරක්ෂාව සහ අපයෝජන වැළැක්වීමේ අධ්‍යාපනික වික්‍රමය' 
                : 'Child Safety & Abuse Prevention Educational Adventure'}
            </span>
          </div>
        </div>

        {/* Action Controls & Profile Pill */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Hero Pill */}
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-300/80 px-2.5 py-1 rounded-2xl shadow-inner">
            <CharacterAvatar id={profile.avatarId} size="sm" />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-black text-slate-800 leading-tight">
                {profile.childName}
              </div>
              <div className="text-[10px] font-bold text-amber-800">
                {isSinhala ? `වයස: ${profile.age}` : `Track: Age ${profile.age}`}
              </div>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              onClick={() => onChangeLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                profile.language === 'en'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onChangeLanguage('si')}
              className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                profile.language === 'si'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="සිංහල (Sinhala)"
            >
              සිංහල
            </button>
          </div>

          {/* Voice Narrator Toggle */}
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-xl border transition-all ${
              profile.voiceEnabled
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={profile.voiceEnabled ? (isSinhala ? 'හඬ විස්තරය ක්‍රියාත්මකයි' : 'Voice Narration ON') : (isSinhala ? 'හඬ විස්තරය අක්‍රියයි' : 'Voice Narration OFF')}
          >
            {profile.voiceEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition"
            title={isSinhala ? 'ක්‍රීඩා කරන ආකාරය සහ උපදෙස්' : 'How to Play & Safety Guide'}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Parent Portal Access Button */}
          <button
            onClick={onOpenParentPortal}
            id="btn-parent-portal"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition hover:scale-102"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">{isSinhala ? 'දෙමාපියන්' : 'Parents'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
