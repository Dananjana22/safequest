import React from 'react';
import { Shield, Sparkles, Check, ArrowRight, Star, Heart } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatars';

interface HelpModalProps {
  onClose: () => void;
  isSinhala?: boolean;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose, isSinhala = false }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-300 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center border-2 border-amber-300">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
            {isSinhala ? 'SafeQuest ක්‍රීඩා කරන ආකාරය!' : 'How to Play SafeQuest!'}
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isSinhala ? 'ආරක්ෂිතව සිටීමට ඔබේ සුපිරි බල 3' : 'Your 3 Superpowers for Staying Safe'}
          </p>
        </div>

        {/* 3 Golden Safety Rules */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-sm shadow">
              1. NO
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-rose-950 font-['Fredoka',sans-serif]">
                {isSinhala ? 'දැඩිව "එපා" කියන්න!' : 'Say NO firmly!'}
              </h4>
              <p className="text-xs font-semibold text-rose-800">
                {isSinhala 
                  ? 'අනාරක්ෂිත ස්පර්ශ, අනවශ්‍ය ගමන් හෝ නරක රහස් සඳහා "එපා" කීමට ඔබට පූර්ණ අයිතිය ඇත.' 
                  : 'You have the right to say NO to unsafe touches, rides, or bad secrets.'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow">
              2. GO
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-950 font-['Fredoka',sans-serif]">
                {isSinhala ? 'ආරක්ෂිත උපකාරකයෙකු ළඟට යන්න!' : 'Get to a Safe Helper!'}
              </h4>
              <p className="text-xs font-semibold text-amber-800">
                {isSinhala 
                  ? 'ආලෝකමත් වෙළඳසැලකට, මුදල් අයකැමි, පොලිස් නිලධාරියෙකු හෝ ගුරුවරයෙකු ළඟට ඉක්මනින් යන්න.' 
                  : 'Walk away quickly to a well-lit store, cashier, police officer, or teacher.'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-sm shadow">
              3. TELL
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-emerald-950 font-['Fredoka',sans-serif]">
                {isSinhala ? 'විශ්වාසවන්ත වැඩිහිටියෙකුට කියන්න!' : 'Tell Your Trusted Adult!'}
              </h4>
              <p className="text-xs font-semibold text-emerald-800">
                {isSinhala 
                  ? 'අම්මා, තාත්තා හෝ ගුරුතුමියට කියන්න. ඇත්ත පැවසීම ගැන ඔබට කිසිදා දඬුවම් නොලැබේ.' 
                  : 'Tell Mum, Dad, or Teacher. You are NEVER in trouble for telling the truth.'}
              </p>
            </div>
          </div>
        </div>

        {/* How Questions Work: 2 -> 3 -> 4 Rule */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-left">
          <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-700 uppercase">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{isSinhala ? 'මට්ටම් ක්‍රියා කරන ආකාරය' : 'How Levels Work'}</span>
          </div>
          <ul className="text-xs font-semibold text-slate-600 space-y-1.5 pl-4 list-disc">
            <li><strong>{isSinhala ? 'ප්‍රශ්නය 1 (ආරම්භය):' : 'Q1 Warm-Up:'}</strong> {isSinhala ? 'තේරීම් 2ක් (ආරක්ෂිත සහ අනාරක්ෂිත).' : '2 choices (Safe vs Unsafe).'}</li>
            <li><strong>{isSinhala ? 'ප්‍රශ්නය 2 (මධ්‍යම):' : 'Q2 Step-Up:'}</strong> {isSinhala ? 'තේරීම් 3ක් (උපක්‍රමශීලී උගුල් ගැන විමසිලිමත් වන්න!).' : '3 choices (watch out for sneaky traps!).'}</li>
            <li><strong>{isSinhala ? 'ප්‍රශ්නය 3 (තීරණාත්මක):' : 'Q3 Reasoning:'}</strong> {isSinhala ? 'තේරීම් 4ක් (පවුලේ මුරපදය භාවිතා කරන්න හෝ උපකාරකයෙකු සොයන්න).' : '4 choices (use your Family Password or find a helper).'}</li>
            <li>{isSinhala ? 'තරු දිනා මීළඟ මට්ටම විවෘත කිරීමට පළමු උත්සාහයෙන්ම ප්‍රශ්න 3න් 2ක් නිවැරදිව තෝරන්න!' : 'Score 2 of 3 correct on first try to earn stars and unlock the next level!'}</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl font-extrabold bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md transition hover:scale-102"
        >
          {isSinhala ? 'ක්‍රීඩා කර ආරක්ෂිතව සිටිමු!' : "Let's Play & Stay Safe!"}
        </button>
      </div>
    </div>
  );
};
