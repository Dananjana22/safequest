import React from 'react';
import { motion } from 'motion/react';

interface SceneProps {
  type: 'park' | 'home' | 'school' | 'street' | 'store' | 'computer' | 'bus';
  className?: string;
  theme?: string;
  feedbackState?: 'safe' | 'caution' | 'warning' | 'recovery' | null;
}

export const SceneIllustration: React.FC<SceneProps> = ({ 
  type, 
  className = '', 
  feedbackState = null 
}) => {
  // Environmental state overlay filters
  const getFilterStyle = () => {
    switch (feedbackState) {
      case 'safe':
      case 'recovery':
        return 'brightness-105 saturate-110';
      case 'caution':
      case 'warning':
        return 'brightness-90 saturate-75';
      default:
        return 'brightness-100 saturate-100';
    }
  };

  return (
    <div className={`relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 transition-all duration-500 ${getFilterStyle()} ${className}`}>
      {/* 3D Scene Layers */}
      {renderScene(type)}

      {/* Reactive Environmental FX */}
      {feedbackState === 'safe' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-t from-emerald-400/40 via-amber-300/30 to-transparent pointer-events-none"
        />
      )}

      {feedbackState === 'warning' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.45, 0.2] }}
          className="absolute inset-0 bg-slate-900/30 pointer-events-none backdrop-blur-[0.5px]"
        />
      )}
    </div>
  );
};

function renderScene(type: string) {
  switch (type) {
    case 'park':
      // 3D Stylized Sunny Playground Park
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-300">
          {/* 3D Sun with soft glow rays */}
          <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-amber-300 ring-8 ring-amber-200/60 shadow-2xl animate-pulse" />
          
          {/* Fluffy 3D Clouds */}
          <motion.div 
            animate={{ x: [-20, 20, -20] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            className="absolute top-5 left-12 w-24 h-9 rounded-full bg-white/90 shadow-md blur-[0.3px]"
          />
          <motion.div 
            animate={{ x: [15, -15, 15] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute top-10 left-36 w-16 h-7 rounded-full bg-white/80 shadow"
          />

          {/* Rolling Lush 3D Grass Hills */}
          <div className="absolute -bottom-16 -left-12 w-[34rem] h-48 rounded-full bg-emerald-400 shadow-inner" />
          <div className="absolute -bottom-20 -right-16 w-[38rem] h-56 rounded-full bg-emerald-500 shadow-2xl" />
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-emerald-600 to-emerald-400" />

          {/* Playground Structures (3D Red Slide, Swing Set, Flowers) */}
          <svg viewBox="0 0 500 200" className="absolute bottom-0 inset-x-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="slideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <linearGradient id="tubeBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Tree with 3D Canopy */}
            <rect x="25" y="70" width="16" height="80" fill="#78350f" rx="4" />
            <circle cx="33" cy="65" r="38" fill="#15803d" />
            <circle cx="48" cy="50" r="28" fill="#22c55e" />
            <circle cx="20" cy="55" r="24" fill="#16a34a" />

            {/* 3D Curved Kids Slide on Left */}
            <line x1="100" y1="80" x2="80" y2="180" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="80" x2="100" y2="180" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            <line x1="84" y1="110" x2="100" y2="110" stroke="#94a3b8" strokeWidth="3" />
            <line x1="88" y1="135" x2="100" y2="135" stroke="#94a3b8" strokeWidth="3" />
            <line x1="92" y1="160" x2="100" y2="160" stroke="#94a3b8" strokeWidth="3" />
            {/* Slide chute */}
            <path d="M100 80 Q140 100 170 180" stroke="url(#slideGrad)" strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M100 76 Q140 96 170 176" stroke="#fbcfe8" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* 3D Swing Set in Center-Right */}
            <line x1="260" y1="65" x2="230" y2="185" stroke="url(#tubeBlue)" strokeWidth="6" strokeLinecap="round" />
            <line x1="260" y1="65" x2="290" y2="185" stroke="url(#tubeBlue)" strokeWidth="6" strokeLinecap="round" />
            <line x1="260" y1="65" x2="370" y2="65" stroke="url(#tubeBlue)" strokeWidth="7" strokeLinecap="round" />
            <line x1="370" y1="65" x2="340" y2="185" stroke="url(#tubeBlue)" strokeWidth="6" strokeLinecap="round" />
            <line x1="370" y1="65" x2="400" y2="185" stroke="url(#tubeBlue)" strokeWidth="6" strokeLinecap="round" />
            {/* Ropes & swing */}
            <line x1="295" y1="65" x2="290" y2="140" stroke="#475569" strokeWidth="2.5" />
            <line x1="335" y1="65" x2="330" y2="140" stroke="#475569" strokeWidth="2.5" />
            <rect x="280" y="140" width="60" height="8" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Colorful Park Flowers */}
            <circle cx="70" cy="180" r="6" fill="#f43f5e" />
            <circle cx="70" cy="180" r="2.5" fill="#fef08a" />
            <circle cx="210" cy="185" r="7" fill="#ec4899" />
            <circle cx="210" cy="185" r="3" fill="#ffffff" />
            <circle cx="430" cy="180" r="6" fill="#fbbf24" />
            <circle cx="430" cy="180" r="2.5" fill="#78350f" />
          </svg>
        </div>
      );

    case 'store':
      // 3D Stylized Modern Supermarket & Mall Interior
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-sky-100 via-teal-50 to-emerald-100">
          {/* Ceiling Lights */}
          <div className="absolute top-2 inset-x-8 flex justify-around">
            <div className="w-20 h-2 bg-white rounded-full shadow-lg" />
            <div className="w-20 h-2 bg-white rounded-full shadow-lg" />
            <div className="w-20 h-2 bg-white rounded-full shadow-lg" />
          </div>

          {/* Supermarket Shelves & Toy Displays */}
          <div className="absolute top-8 inset-x-6 h-28 bg-white/90 rounded-2xl border-2 border-emerald-200 shadow-md flex flex-col justify-around p-2">
            <div className="flex justify-around items-center">
              <span className="text-xl">🧸</span>
              <span className="text-xl">🚀</span>
              <span className="text-xl">🎨</span>
              <span className="text-xl">🧃</span>
              <span className="text-xl">🍎</span>
              <span className="text-xl">⚽</span>
            </div>
            <div className="w-full h-1.5 bg-amber-400 rounded-full" />
            <div className="flex justify-around items-center">
              <span className="text-xl">🍪</span>
              <span className="text-xl">🎮</span>
              <span className="text-xl">📚</span>
              <span className="text-xl">🍌</span>
              <span className="text-xl">🥛</span>
              <span className="text-xl">🎁</span>
            </div>
          </div>

          {/* Tiled Floor & Cashier Help Counter */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-emerald-800 to-emerald-600 border-t-4 border-emerald-500 flex items-center justify-between px-6">
            <div className="bg-amber-300 text-amber-950 font-black px-4 py-1.5 rounded-xl text-xs shadow-lg border-2 border-amber-400 flex items-center space-x-1.5">
              <span>🏪</span>
              <span>CUSTOMER SERVICE / CASHIER DESK</span>
            </div>
            <div className="bg-slate-900 text-emerald-300 font-mono text-xs px-3 py-1 rounded-lg border border-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>STAFF ON DUTY</span>
            </div>
          </div>
        </div>
      );

    case 'computer':
      // 3D Stylized Online Tablet & Cyber Room
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white">
          {/* Floating Neon Cyber Stars */}
          <div className="absolute top-4 left-8 text-amber-300 text-lg animate-bounce">✨</div>
          <div className="absolute top-6 right-10 text-cyan-300 text-base animate-pulse">⭐</div>

          {/* Glowing Tablet Device Screen in Center */}
          <div className="absolute inset-x-6 top-6 bottom-4 bg-slate-900/90 rounded-2xl border-2 border-purple-500/50 shadow-2xl p-3 flex flex-col justify-between backdrop-blur-md">
            {/* App Header */}
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-black text-purple-200 ml-2">📱 SafeQuest Messenger</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500">
                🔒 Privacy Protected
              </span>
            </div>

            {/* Interactive Chat Bubble Visuals */}
            <div className="space-y-2 my-auto px-2">
              <div className="bg-slate-800/95 text-purple-100 text-xs px-3 py-2 rounded-xl max-w-[85%] border border-slate-700 shadow-md">
                💬 <span className="font-bold text-amber-300">Online Friend:</span> "Hey! Let's play together! What's your home address?"
              </div>
              <div className="bg-indigo-900/90 text-cyan-200 text-xs px-3 py-2 rounded-xl max-w-[90%] ml-auto border border-cyan-500/40 shadow-md flex items-center space-x-2">
                <span className="text-base">🛡️</span>
                <span className="font-bold text-emerald-300">Safety Rule: Never share personal details online!</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'street':
      // 3D Stylized Pedestrian Street & Safe Crosswalk
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-sky-300 via-sky-100 to-slate-200">
          {/* Shopfronts in background */}
          <div className="absolute top-4 left-6 w-32 h-32 bg-amber-100 rounded-t-xl border-2 border-amber-300 shadow">
            <div className="bg-rose-500 text-white font-black text-[10px] py-1 text-center rounded-t-lg">
              BAKERY & SAFE SHOP
            </div>
            <div className="grid grid-cols-2 gap-2 p-2">
              <div className="h-6 bg-sky-200 rounded" />
              <div className="h-6 bg-sky-200 rounded" />
            </div>
          </div>

          <div className="absolute top-6 right-8 w-28 h-32 bg-indigo-100 rounded-t-xl border-2 border-indigo-300 shadow">
            <div className="bg-indigo-600 text-white font-black text-[10px] py-1 text-center rounded-t-lg">
              PHARMACY / CLINIC
            </div>
            <div className="p-2 text-center text-xs">🏥</div>
          </div>

          {/* Road & Crosswalk Stripes */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-slate-800 border-t-4 border-slate-500">
            <div className="flex justify-around items-center h-full px-8">
              <div className="w-12 h-3.5 bg-white rounded-sm shadow" />
              <div className="w-12 h-3.5 bg-white rounded-sm shadow" />
              <div className="w-12 h-3.5 bg-white rounded-sm shadow" />
              <div className="w-12 h-3.5 bg-white rounded-sm shadow" />
            </div>
          </div>
        </div>
      );

    case 'bus':
      // 3D Stylized Transit Bus Station & Public Bus
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-sky-300 via-indigo-50 to-slate-200">
          {/* Bus Stop Pole */}
          <div className="absolute top-4 left-6 flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-amber-400 border-3 border-amber-600 flex items-center justify-center font-black text-amber-950 text-base shadow-lg">
              🚏
            </div>
            <div className="w-2 h-32 bg-slate-600 rounded-b" />
          </div>

          {/* Yellow 3D Transit Bus */}
          <div className="absolute bottom-3 right-4 w-60 h-32 bg-amber-400 rounded-2xl border-4 border-amber-600 shadow-2xl flex flex-col justify-between p-3">
            <div className="flex space-x-2">
              <div className="w-14 h-10 bg-sky-200 border-2 border-amber-600 rounded-lg shadow-inner" />
              <div className="w-14 h-10 bg-sky-200 border-2 border-amber-600 rounded-lg shadow-inner" />
              <div className="w-14 h-10 bg-sky-200 border-2 border-amber-600 rounded-lg shadow-inner" />
            </div>
            <div className="flex justify-between items-center px-1">
              <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-300 shadow" />
              <span className="text-[11px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md border border-amber-400">
                TRANSIT COACH #12
              </span>
              <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-300 shadow" />
            </div>
          </div>
        </div>
      );

    case 'home':
    default:
      // 3D Stylized Cozy Living Room Safe Haven
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200">
          {/* Window to Sunny Outside */}
          <div className="absolute top-4 left-6 w-24 h-28 rounded-2xl bg-sky-300 border-4 border-white shadow-md overflow-hidden flex flex-col justify-between">
            <div className="w-full h-1/2 border-b-2 border-white" />
            <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center">
              <div className="w-1 h-full bg-white" />
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-amber-300 opacity-80 animate-pulse" />
          </div>

          {/* Cozy 3D Sofa */}
          <div className="absolute bottom-3 right-8 w-56 h-28 bg-sky-600 rounded-2xl border-4 border-sky-700 shadow-xl flex items-center justify-around px-3">
            <div className="w-12 h-12 rounded-xl bg-amber-300 border-2 border-amber-400 shadow-sm flex items-center justify-center text-lg">
              ⭐
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-400 border-2 border-rose-500 shadow-sm flex items-center justify-center text-lg">
              ❤️
            </div>
          </div>
        </div>
      );
  }
}
