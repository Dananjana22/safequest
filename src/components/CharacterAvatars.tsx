import React from 'react';
import { motion } from 'motion/react';
import type { GuardianFeatures } from '../types';
import { GuardianClayAvatar } from './GuardianClayAvatar';

export type CharacterAction = 'idle' | 'happy' | 'think' | 'alert' | 'celebrate' | 'point' | 'wave';

interface FullBodyCharacterProps {
  id: 'kai' | 'mira' | 'leo' | 'zara' | 'guardian' | string;
  action?: CharacterAction;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  isSpeaking?: boolean;
  className?: string;
  guardianRole?: string;
  showBadge?: boolean;
  direction?: 'left' | 'right' | 'front';
  /**
   * When set on id="guardian", renders the parametric clay avatar
   * (GuardianClayAvatar) driven by these features instead of the fixed
   * auburn/glasses/yellow-jacket design below. Omit to keep the original
   * hardcoded guardian look unchanged.
   */
  guardianFeatures?: GuardianFeatures;
}

export const CharacterAvatar: React.FC<FullBodyCharacterProps> = ({
  id,
  action = 'idle',
  size = 'md',
  isSpeaking = false,
  className = '',
  guardianRole = 'Mum',
  showBadge = false,
  direction = 'front',
  guardianFeatures
}) => {
  const sizeMap = {
    sm: 'w-16 h-28',
    md: 'w-24 h-40',
    lg: 'w-36 h-56',
    xl: 'w-48 h-72',
    '2xl': 'w-60 h-88',
    hero: 'w-72 h-[26rem]'
  };

  // Animation variants for living game character feel
  const getMotionAnimation = () => {
    switch (action) {
      case 'happy':
      case 'celebrate':
        return {
          y: [0, -14, 0, -8, 0],
          rotate: [0, -3, 3, -2, 0],
          transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
        };
      case 'think':
        return {
          rotate: [0, 4, 0],
          y: [0, -2, 0],
          transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
        };
      case 'alert':
        return {
          scale: [1, 1.04, 1],
          transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
        };
      case 'wave':
        return {
          y: [0, -4, 0],
          transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        };
      case 'idle':
      default:
        return {
          y: [0, -5, 0],
          transition: { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
        };
    }
  };

  // SVG 3D clay-render styled vectors for full-body characters
  const renderFullBodySvg = () => {
    switch (id) {
      case 'guardian':
        if (guardianFeatures) {
          return (
            <GuardianClayAvatar
              features={guardianFeatures}
              action={action}
              isSpeaking={isSpeaking}
            />
          );
        }
        // Inspired by ddd.jpg: 3D cute guardian with auburn bun, round glasses, yellow jacket, turtleneck
        return (
          <svg viewBox="0 0 160 260" className="w-full h-full drop-shadow-xl select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9a3412" />
                <stop offset="50%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffedd5" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
              <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Ground Contact Shadow */}
            <ellipse cx="80" cy="245" rx="46" ry="10" fill="#000000" opacity="0.18" />

            {/* Legs & Shoes */}
            <g id="legs">
              {/* Left Leg */}
              <rect x="54" y="155" width="20" height="75" rx="8" fill="url(#pantsGrad)" />
              {/* Right Leg */}
              <rect x="86" y="155" width="20" height="75" rx="8" fill="url(#pantsGrad)" />
              {/* Left Boot (3D Clay Red/White sneakers) */}
              <rect x="48" y="222" width="28" height="18" rx="8" fill="#e11d48" />
              <rect x="46" y="234" width="32" height="7" rx="3" fill="#ffffff" />
              {/* Right Boot */}
              <rect x="84" y="222" width="28" height="18" rx="8" fill="#e11d48" />
              <rect x="82" y="234" width="32" height="7" rx="3" fill="#ffffff" />
            </g>

            {/* Torso: Yellow Puffer/Tailored Jacket over Knit Turtleneck */}
            <g id="torso">
              {/* White turtleneck inner */}
              <rect x="66" y="80" width="28" height="24" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="68" y1="88" x2="92" y2="88" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="68" y1="94" x2="92" y2="94" stroke="#cbd5e1" strokeWidth="1" />

              {/* Yellow Coat Body */}
              <path d="M42 98 C42 90, 118 90, 118 98 L124 165 C124 172, 36 172, 36 165 Z" fill="url(#jacketGrad)" filter="url(#softShadow)" />
              {/* Coat Collar */}
              <path d="M52 95 L80 120 L108 95 L96 90 L80 102 L64 90 Z" fill="#eab308" />
              {/* Coat Buttons & Seam */}
              <line x1="80" y1="120" x2="80" y2="166" stroke="#ca8a04" strokeWidth="2.5" strokeDasharray="4 2" />
              <circle cx="80" cy="132" r="3" fill="#854d0e" />
              <circle cx="80" cy="148" r="3" fill="#854d0e" />

              {/* Safety Badge on Left Chest */}
              <g transform="translate(56, 110)">
                <path d="M0 0 L14 0 L14 10 C14 16, 7 20, 7 20 C7 20, 0 16, 0 10 Z" fill="url(#shieldGold)" stroke="#ca8a04" strokeWidth="1" />
                <path d="M7 4 L9 8 L13 8 L10 11 L11 15 L7 12 L3 15 L4 11 L1 8 L5 8 Z" fill="#ffffff" transform="scale(0.55) translate(2, 2)" />
              </g>
            </g>

            {/* Arms & Hands */}
            <g id="arms">
              {/* Left Arm (Relaxed / Pocket) */}
              <path d="M44 98 C30 115, 30 140, 42 152" stroke="url(#jacketGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
              <circle cx="44" cy="154" r="8" fill="url(#skinGrad)" />

              {/* Right Arm: Friendly Wave or Point */}
              {action === 'wave' || action === 'happy' || isSpeaking ? (
                <g>
                  {/* Raised waving arm */}
                  <path d="M116 98 C132 85, 142 65, 138 48" stroke="url(#jacketGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
                  <circle cx="138" cy="42" r="10" fill="url(#skinGrad)" />
                  {/* Friendly open palm */}
                  <circle cx="140" cy="38" r="4" fill="url(#skinGrad)" />
                  <circle cx="145" cy="42" r="3.5" fill="url(#skinGrad)" />
                  <circle cx="134" cy="42" r="3.5" fill="url(#skinGrad)" />
                  {/* Wave sparkles */}
                  <path d="M148 28 L152 24 M154 36 L160 36 M146 48 L152 52" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  {/* Natural standing arm */}
                  <path d="M116 98 C130 115, 130 140, 118 152" stroke="url(#jacketGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
                  <circle cx="116" cy="154" r="8" fill="url(#skinGrad)" />
                </g>
              )}
            </g>

            {/* Head & Hair (Auburn Bun, Round Dark Glasses - matching ddd.jpg) */}
            <g id="head">
              {/* Neck */}
              <rect x="73" y="68" width="14" height="16" rx="4" fill="url(#skinGrad)" />

              {/* High Auburn Bun */}
              <circle cx="80" cy="18" r="18" fill="url(#hairGrad)" filter="url(#softShadow)" />
              {/* Cute Gold Hair Pin */}
              <line x1="62" y1="16" x2="98" y2="16" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="62" cy="16" r="3.5" fill="#f59e0b" />

              {/* Main Hair Base */}
              <circle cx="80" cy="46" r="30" fill="url(#hairGrad)" />
              {/* Face Shape (Soft Clay Oval) */}
              <ellipse cx="80" cy="52" rx="22" ry="24" fill="url(#skinGrad)" />
              {/* Hair Bangs / Curtain Fringe */}
              <path d="M58 42 C64 30, 96 30, 102 42 C92 36, 68 36, 58 42 Z" fill="url(#hairGrad)" />
              <path d="M58 42 C62 52, 64 64, 62 70 C60 62, 60 48, 58 42 Z" fill="url(#hairGrad)" />
              <path d="M102 42 C98 52, 96 64, 98 70 C100 62, 100 48, 102 42 Z" fill="url(#hairGrad)" />

              {/* Round Black Glasses (Iconic ddd.jpg style) */}
              <circle cx="70" cy="50" r="9" fill="#0f172a" stroke="#000000" strokeWidth="2" opacity="0.9" />
              <circle cx="90" cy="50" r="9" fill="#0f172a" stroke="#000000" strokeWidth="2" opacity="0.9" />
              <line x1="79" y1="50" x2="81" y2="50" stroke="#0f172a" strokeWidth="3" />
              {/* Lens Glint / Highlight */}
              <ellipse cx="68" cy="47" rx="3" ry="1.5" fill="#ffffff" opacity="0.75" />
              <ellipse cx="88" cy="47" rx="3" ry="1.5" fill="#ffffff" opacity="0.75" />

              {/* Cheeks Blush */}
              <circle cx="63" cy="58" r="4.5" fill="#f43f5e" opacity="0.25" />
              <circle cx="97" cy="58" r="4.5" fill="#f43f5e" opacity="0.25" />

              {/* Warm Smile */}
              {isSpeaking ? (
                <ellipse cx="80" cy="65" rx="6" ry="4" fill="#e11d48" />
              ) : (
                <path d="M73 63 Q80 70 87 63" stroke="#be123c" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              )}
            </g>
          </svg>
        );

      case 'kai':
        // Kai: Full body cool teal hoodie kid, sneakers, confident friendly posture
        return (
          <svg viewBox="0 0 160 250" className="w-full h-full drop-shadow-xl select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="kaiHoodie" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>
              <linearGradient id="kaiSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffedd5" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
            </defs>
            <ellipse cx="80" cy="238" rx="42" ry="9" fill="#000000" opacity="0.18" />

            {/* Legs */}
            <rect x="56" y="150" width="18" height="68" rx="6" fill="#1e293b" />
            <rect x="86" y="150" width="18" height="68" rx="6" fill="#1e293b" />
            <rect x="50" y="212" width="26" height="16" rx="6" fill="#0284c7" />
            <rect x="48" y="222" width="30" height="7" rx="3" fill="#ffffff" />
            <rect x="84" y="212" width="26" height="16" rx="6" fill="#0284c7" />
            <rect x="82" y="222" width="30" height="7" rx="3" fill="#ffffff" />

            {/* Hoodie Body */}
            <path d="M44 95 C44 86, 116 86, 116 95 L120 156 C120 164, 40 164, 40 156 Z" fill="url(#kaiHoodie)" />
            {/* Front Pocket */}
            <path d="M55 130 Q80 126 105 130 L100 154 L60 154 Z" fill="#0d9488" />
            {/* Drawstrings */}
            <line x1="74" y1="96" x2="74" y2="116" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="86" y1="96" x2="86" y2="116" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

            {/* Arms */}
            <path d="M46 96 C30 115, 30 138, 45 146" stroke="url(#kaiHoodie)" strokeWidth="15" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="148" r="7" fill="url(#kaiSkin)" />
            <path d="M114 96 C130 115, 130 138, 115 146" stroke="url(#kaiHoodie)" strokeWidth="15" strokeLinecap="round" fill="none" />
            <circle cx="114" cy="148" r="7" fill="url(#kaiSkin)" />

            {/* Head */}
            <ellipse cx="80" cy="52" rx="24" ry="25" fill="url(#kaiSkin)" />
            {/* Spiky hair */}
            <path d="M52 48 C50 20, 110 20, 108 48 C102 36, 88 32, 80 34 C72 32, 58 36, 52 48 Z" fill="#0f172a" />
            <polygon points="68,24 80,12 88,24" fill="#0f172a" />
            <polygon points="56,32 66,18 74,30" fill="#0f172a" />
            <polygon points="86,30 96,20 102,34" fill="#0f172a" />

            {/* Eyes & Eyebrows */}
            <circle cx="71" cy="50" r="4.5" fill="#0f172a" />
            <circle cx="89" cy="50" r="4.5" fill="#0f172a" />
            <circle cx="72.5" cy="48.5" r="1.5" fill="#ffffff" />
            <circle cx="90.5" cy="48.5" r="1.5" fill="#ffffff" />
            <path d="M66 43 Q71 40 76 43" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M84 43 Q89 40 94 43" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Smile */}
            <path d="M72 63 Q80 70 88 63" stroke="#be123c" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'mira':
        // Mira: Full body purple overalls girl, round purple glasses, smart & cute
        return (
          <svg viewBox="0 0 160 250" className="w-full h-full drop-shadow-xl select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="miraOveralls" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="miraSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
            </defs>
            <ellipse cx="80" cy="238" rx="42" ry="9" fill="#000000" opacity="0.18" />

            {/* Legs */}
            <rect x="56" y="155" width="18" height="65" rx="6" fill="#1d4ed8" />
            <rect x="86" y="155" width="18" height="65" rx="6" fill="#1d4ed8" />
            <rect x="50" y="214" width="26" height="16" rx="6" fill="#ec4899" />
            <rect x="48" y="224" width="30" height="7" rx="3" fill="#ffffff" />
            <rect x="84" y="214" width="26" height="16" rx="6" fill="#ec4899" />
            <rect x="82" y="224" width="30" height="7" rx="3" fill="#ffffff" />

            {/* Striped Shirt & Denim Overalls */}
            <rect x="46" y="92" width="68" height="65" rx="10" fill="#a855f7" />
            <path d="M52 105 L108 105 L108 160 L52 160 Z" fill="url(#miraOveralls)" />
            {/* Straps */}
            <rect x="56" y="92" width="10" height="30" rx="3" fill="#1e40af" />
            <circle cx="61" cy="116" r="2.5" fill="#facc15" />
            <rect x="94" y="92" width="10" height="30" rx="3" fill="#1e40af" />
            <circle cx="99" cy="116" r="2.5" fill="#facc15" />

            {/* Arms */}
            <path d="M46 96 C30 115, 32 135, 44 146" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="45" cy="148" r="7" fill="url(#miraSkin)" />
            <path d="M114 96 C130 115, 128 135, 116 146" stroke="#a855f7" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="115" cy="148" r="7" fill="url(#miraSkin)" />

            {/* Head & Bob Hair with Purple Band */}
            <ellipse cx="80" cy="52" rx="23" ry="24" fill="url(#miraSkin)" />
            <path d="M50 56 C46 22, 114 22, 110 56 C112 70, 102 72, 100 58 C96 38, 64 38, 60 58 C58 72, 48 70, 50 56 Z" fill="#18181b" />
            <path d="M52 42 Q80 26 108 42" stroke="#9333ea" strokeWidth="5" strokeLinecap="round" fill="none" />

            {/* Round Purple Glasses */}
            <circle cx="70" cy="52" r="8.5" stroke="#7e22ce" strokeWidth="2.5" fill="#faf5ff" fillOpacity="0.4" />
            <circle cx="90" cy="52" r="8.5" stroke="#7e22ce" strokeWidth="2.5" fill="#faf5ff" fillOpacity="0.4" />
            <line x1="78.5" y1="52" x2="81.5" y2="52" stroke="#7e22ce" strokeWidth="2.5" />
            <circle cx="70" cy="52" r="3.5" fill="#1e1b4b" />
            <circle cx="90" cy="52" r="3.5" fill="#1e1b4b" />

            {/* Smile */}
            <path d="M73 64 Q80 70 87 64" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'leo':
        // Leo: Full body orange lion tee boy, lively sneakers, adventurous
        return (
          <svg viewBox="0 0 160 250" className="w-full h-full drop-shadow-xl select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="leoShirt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <ellipse cx="80" cy="238" rx="42" ry="9" fill="#000000" opacity="0.18" />

            {/* Shorts & Legs */}
            <rect x="52" y="140" width="56" height="30" rx="4" fill="#0284c7" />
            <rect x="58" y="165" width="14" height="50" rx="5" fill="#fed7aa" />
            <rect x="88" y="165" width="14" height="50" rx="5" fill="#fed7aa" />
            <rect x="52" y="210" width="24" height="16" rx="5" fill="#16a34a" />
            <rect x="50" y="220" width="28" height="7" rx="3" fill="#ffffff" />
            <rect x="84" y="210" width="24" height="16" rx="5" fill="#16a34a" />
            <rect x="82" y="220" width="28" height="7" rx="3" fill="#ffffff" />

            {/* Orange Shirt with Lion Emblem */}
            <path d="M46 95 C46 88, 114 88, 114 95 L118 145 C118 152, 42 152, 42 145 Z" fill="url(#leoShirt)" />
            <circle cx="80" cy="120" r="12" fill="#fef08a" />
            <circle cx="76" cy="118" r="2" fill="#78350f" />
            <circle cx="84" cy="118" r="2" fill="#78350f" />
            <path d="M78 123 Q80 126 82 123" stroke="#78350f" strokeWidth="1.5" fill="none" />

            {/* Arms */}
            <path d="M46 96 C30 115, 30 135, 45 144" stroke="url(#leoShirt)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="146" r="7" fill="#fed7aa" />
            <path d="M114 96 C130 115, 130 135, 115 144" stroke="url(#leoShirt)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="114" cy="146" r="7" fill="#fed7aa" />

            {/* Head & Tousled Brown Hair */}
            <ellipse cx="80" cy="52" rx="23" ry="24" fill="#fed7aa" />
            <path d="M52 46 C50 18, 110 18, 108 46 C98 30, 80 26, 68 28 C58 30, 52 38, 52 46 Z" fill="#78350f" />
            {/* Green Eyes & Freckles */}
            <circle cx="71" cy="50" r="4.2" fill="#15803d" />
            <circle cx="89" cy="50" r="4.2" fill="#15803d" />
            <circle cx="65" cy="56" r="1" fill="#b45309" />
            <circle cx="67" cy="58" r="1" fill="#b45309" />
            <circle cx="93" cy="58" r="1" fill="#b45309" />
            <circle cx="95" cy="56" r="1" fill="#b45309" />
            <path d="M72 63 Q80 70 88 63" stroke="#be123c" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'zara':
        // Zara: Full body double bun girl, floral pink dress, sweet & warm
        return (
          <svg viewBox="0 0 160 250" className="w-full h-full drop-shadow-xl select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="zaraDress" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
            <ellipse cx="80" cy="238" rx="42" ry="9" fill="#000000" opacity="0.18" />

            {/* Legs */}
            <rect x="58" y="165" width="14" height="50" rx="5" fill="#a16207" />
            <rect x="88" y="165" width="14" height="50" rx="5" fill="#a16207" />
            <rect x="52" y="210" width="24" height="16" rx="5" fill="#fbbf24" />
            <rect x="50" y="220" width="28" height="7" rx="3" fill="#ffffff" />
            <rect x="84" y="210" width="24" height="16" rx="5" fill="#fbbf24" />
            <rect x="82" y="220" width="28" height="7" rx="3" fill="#ffffff" />

            {/* Pink Flare Dress */}
            <path d="M52 95 C52 88, 108 88, 108 95 L125 168 C125 174, 35 174, 35 168 Z" fill="url(#zaraDress)" />
            <circle cx="60" cy="140" r="3.5" fill="#fbcfe8" />
            <circle cx="80" cy="145" r="3.5" fill="#fbcfe8" />
            <circle cx="100" cy="140" r="3.5" fill="#fbcfe8" />

            {/* Arms */}
            <path d="M48 96 C32 115, 32 135, 45 144" stroke="#f472b6" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="146" r="7" fill="#a16207" />
            <path d="M112 96 C128 115, 128 135, 115 144" stroke="#f472b6" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="114" cy="146" r="7" fill="#a16207" />

            {/* Double Buns & Head */}
            <circle cx="48" cy="28" r="14" fill="#1c1917" />
            <circle cx="112" cy="28" r="14" fill="#1c1917" />
            <circle cx="48" cy="38" r="4" fill="#f43f5e" />
            <circle cx="112" cy="38" r="4" fill="#f43f5e" />

            <ellipse cx="80" cy="52" rx="23" ry="24" fill="#a16207" />
            <path d="M54 44 C60 28, 100 28, 106 44 C96 36, 64 36, 54 44 Z" fill="#1c1917" />

            {/* Big Bright Eyes */}
            <circle cx="71" cy="50" r="4.8" fill="#0c0a09" />
            <circle cx="89" cy="50" r="4.8" fill="#0c0a09" />
            <circle cx="73" cy="48" r="1.6" fill="#ffffff" />
            <circle cx="91" cy="48" r="1.6" fill="#ffffff" />
            <path d="M72 63 Q80 70 88 63" stroke="#fecdd3" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      animate={getMotionAnimation()}
    >
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        {renderFullBodySvg()}

        {/* Audio Speech Wave indicator */}
        {isSpeaking && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-3 right-0 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-white flex items-center space-x-1"
          >
            <span className="animate-pulse">🔊</span>
            <span className="text-[10px] tracking-wider uppercase font-bold">Speaking</span>
          </motion.div>
        )}
      </div>

      {showBadge && (
        <span className="mt-1 px-3 py-1 rounded-full text-xs font-black bg-white/95 text-slate-800 shadow-md border-2 border-amber-300">
          {id === 'guardian' ? guardianRole : id.toUpperCase()}
        </span>
      )}
    </motion.div>
  );
};
