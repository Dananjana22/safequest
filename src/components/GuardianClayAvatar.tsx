import React, { useId } from 'react';
import type {
  GuardianFeatures,
  SkinTone,
  HairColor,
  HairStyle,
  FaceShape,
  GlassesStyle,
  ClothingStyle,
  ClothingColor,
} from '../types';
import type { CharacterAction } from './CharacterAvatars';

/**
 * Parametric "clay" guardian renderer. Extends the character system
 * (CharacterAvatar's hardcoded 'guardian' SVG in CharacterAvatars.tsx stays
 * exactly as-is for every existing call site) with a variant driven by
 * GuardianFeatures, for previewing the photo -> features pipeline
 * (guardian_pipeline.py classifier + extract_colors.py skin/hair matching)
 * before that pipeline is wired up. See GuardianAvatarLab.tsx for the test
 * harness that exercises every combination.
 */

const SKIN_TONES: Record<SkinTone, { light: string; dark: string }> = {
  light: { light: '#fef3e7', dark: '#fde3c8' },
  'light-medium': { light: '#ffedd5', dark: '#fed7aa' },
  medium: { light: '#f3c99b', dark: '#d8a670' },
  'medium-dark': { light: '#c68a5c', dark: '#a56b3e' },
  dark: { light: '#8a5a3a', dark: '#6b4226' },
};

const HAIR_COLORS: Record<HairColor, { light: string; dark: string }> = {
  black: { light: '#3f3f46', dark: '#18181b' },
  'dark-brown': { light: '#78350f', dark: '#451a03' },
  brown: { light: '#92621b', dark: '#57340a' },
  'light-brown': { light: '#a8702e', dark: '#7c4a1e' },
  blonde: { light: '#fde68a', dark: '#eab308' },
  auburn: { light: '#c2410c', dark: '#7c2d12' },
  grey: { light: '#cbd5e1', dark: '#94a3b8' },
  other: { light: '#ec4899', dark: '#a855f7' },
};

const CLOTHING_COLORS: Record<ClothingColor, { light: string; dark: string }> = {
  yellow: { light: '#fde047', dark: '#ca8a04' },
  navy: { light: '#3b82f6', dark: '#1e3a8a' },
  emerald: { light: '#34d399', dark: '#047857' },
  rose: { light: '#fb7185', dark: '#be123c' },
  purple: { light: '#a78bfa', dark: '#6d28d9' },
  teal: { light: '#2dd4bf', dark: '#0f766e' },
  coral: { light: '#fb923c', dark: '#c2410c' },
  slate: { light: '#94a3b8', dark: '#475569' },
};

const FACE_SHAPE_RATIO: Record<FaceShape, { rx: number; ry: number; jaw: number }> = {
  round: { rx: 24, ry: 23, jaw: 1 },
  oval: { rx: 22, ry: 26, jaw: 0.85 },
  square: { rx: 23, ry: 24, jaw: 0.35 },
  heart: { rx: 23, ry: 25, jaw: 1.6 },
  long: { rx: 20, ry: 28, jaw: 0.7 },
};

export interface GuardianClayAvatarProps {
  features: GuardianFeatures;
  action?: CharacterAction;
  isSpeaking?: boolean;
}

function HairBack({
  style,
  hair,
  uid,
}: {
  style: HairStyle;
  hair: { light: string; dark: string };
  uid: string;
}) {
  const fill = `url(#gcHair-${uid})`;
  switch (style) {
    case 'long-waves':
      return (
        <path
          d="M50 46 C46 18, 114 18, 110 46 C118 80, 122 130, 110 156 C104 140, 102 100, 96 60
             C88 40, 72 40, 64 60 C58 100, 56 140, 50 156 C38 130, 42 80, 50 46 Z"
          fill={fill}
        />
      );
    case 'classic-bob':
      return (
        <path
          d="M50 46 C46 18, 114 18, 110 46 C114 66, 112 88, 106 96 C108 74, 100 56, 80 56
             C60 56, 52 74, 54 96 C48 88, 46 66, 50 46 Z"
          fill={fill}
        />
      );
    case 'high-bun':
      return (
        <>
          <circle cx="80" cy="16" r="15" fill={fill} />
          <line x1="63" y1="14" x2="97" y2="14" stroke={hair.dark} strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="46" r="30" fill={fill} />
        </>
      );
    case 'ponytail':
      return (
        <>
          <path d="M102 34 C118 34, 124 60, 112 84 C108 66, 106 50, 96 40 Z" fill={fill} />
          <circle cx="80" cy="46" r="29" fill={fill} />
        </>
      );
    case 'curly-volume':
      return (
        <g fill={fill}>
          <circle cx="80" cy="42" r="31" />
          <circle cx="52" cy="34" r="12" />
          <circle cx="108" cy="34" r="12" />
          <circle cx="46" cy="52" r="10" />
          <circle cx="114" cy="52" r="10" />
          <circle cx="58" cy="20" r="10" />
          <circle cx="102" cy="20" r="10" />
        </g>
      );
    case 'side-part':
      return <ellipse cx="80" cy="44" rx="29" ry="27" fill={fill} />;
    case 'short-crop':
    default:
      return <ellipse cx="80" cy="42" rx="27" ry="24" fill={fill} />;
  }
}

function HairFront({ style, hair, uid }: { style: HairStyle; hair: { light: string; dark: string }; uid: string }) {
  const fill = `url(#gcHair-${uid})`;
  switch (style) {
    case 'side-part':
      return (
        <path
          d="M54 40 C58 26, 72 22, 80 24 C64 28, 60 36, 60 44 C68 38, 96 36, 104 46
             C102 32, 92 24, 80 24 C92 22, 106 28, 108 42 C110 32, 104 20, 80 18 C56 20, 50 30, 54 40 Z"
          fill={fill}
        />
      );
    case 'short-crop':
      return <path d="M56 36 C60 24, 100 24, 104 36 C92 30, 68 30, 56 36 Z" fill={fill} />;
    case 'curly-volume':
      return null;
    case 'classic-bob':
    case 'long-waves':
      return <path d="M58 40 C64 30, 96 30, 102 40 C90 34, 70 34, 58 40 Z" fill={fill} />;
    default:
      return <path d="M58 42 C64 30, 96 30, 102 42 C92 36, 68 36, 58 42 Z" fill={hair.dark} />;
  }
}

function Glasses({ style, uid }: { style: GlassesStyle; uid: string }) {
  if (!style || style === 'none') return null;
  if (style === 'wireframe') {
    return (
      <g>
        <circle cx="70" cy="50" r="9" fill="none" stroke="#475569" strokeWidth="1.5" />
        <circle cx="90" cy="50" r="9" fill="none" stroke="#475569" strokeWidth="1.5" />
        <line x1="79" y1="50" x2="81" y2="50" stroke="#475569" strokeWidth="1.5" />
      </g>
    );
  }
  if (style === 'square-modern') {
    return (
      <g>
        <rect x="62" y="43" width="16" height="13" rx="3" fill="#0f172a" opacity={0.92} />
        <rect x="82" y="43" width="16" height="13" rx="3" fill="#0f172a" opacity={0.92} />
        <line x1="78" y1="49" x2="82" y2="49" stroke="#0f172a" strokeWidth="3" />
      </g>
    );
  }
  // round-dark (default)
  return (
    <g>
      <circle cx="70" cy="50" r="9" fill="#0f172a" stroke="#000000" strokeWidth="2" opacity={0.9} />
      <circle cx="90" cy="50" r="9" fill="#0f172a" stroke="#000000" strokeWidth="2" opacity={0.9} />
      <line x1="79" y1="50" x2="81" y2="50" stroke="#0f172a" strokeWidth="3" />
      <ellipse cx="68" cy="47" rx="3" ry="1.5" fill="#ffffff" opacity={0.75} />
      <ellipse cx="88" cy="47" rx="3" ry="1.5" fill="#ffffff" opacity={0.75} />
    </g>
  );
}

function Garment({
  style,
  color,
  uid,
  isSpeaking,
  action,
  skin,
}: {
  style: ClothingStyle;
  color: { light: string; dark: string };
  uid: string;
  isSpeaking: boolean;
  action: CharacterAction;
  skin: { light: string; dark: string };
}) {
  const fill = `url(#gcCloth-${uid})`;
  const skinFill = `url(#gcSkin-${uid})`;
  const armed = action === 'wave' || action === 'happy' || isSpeaking;

  const arms = (
    <g id="arms">
      <path d="M44 98 C30 115, 30 140, 42 152" stroke={fill} strokeWidth="16" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="154" r="8" fill={skinFill} />
      {armed ? (
        <>
          <path d="M116 98 C132 85, 142 65, 138 48" stroke={fill} strokeWidth="16" strokeLinecap="round" fill="none" />
          <circle cx="138" cy="42" r="10" fill={skinFill} />
        </>
      ) : (
        <>
          <path d="M116 98 C130 115, 130 140, 118 152" stroke={fill} strokeWidth="16" strokeLinecap="round" fill="none" />
          <circle cx="116" cy="154" r="8" fill={skinFill} />
        </>
      )}
    </g>
  );

  switch (style) {
    case 'casual-hoodie':
      return (
        <>
          <path d="M44 95 C44 86, 116 86, 116 95 L120 156 C120 164, 40 164, 40 156 Z" fill={fill} />
          <path d="M55 130 Q80 126 105 130 L100 154 L60 154 Z" fill={color.dark} opacity={0.5} />
          <line x1="74" y1="96" x2="74" y2="116" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="96" x2="86" y2="116" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          {arms}
        </>
      );
    case 'polo-shirt':
      return (
        <>
          <path d="M42 98 C42 90, 118 90, 118 98 L124 165 C124 172, 36 172, 36 165 Z" fill={fill} />
          <path d="M62 92 L80 108 L98 92 L88 90 L80 98 L72 90 Z" fill="#ffffff" opacity={0.85} />
          <circle cx="80" cy="106" r="1.6" fill={color.dark} />
          <circle cx="80" cy="112" r="1.6" fill={color.dark} />
          {arms}
        </>
      );
    case 'knit-sweater':
      return (
        <>
          <path d="M42 98 C42 90, 118 90, 118 98 L124 165 C124 172, 36 172, 36 165 Z" fill={fill} />
          {[108, 118, 128, 138, 148, 158].map((yy) => (
            <line key={yy} x1="40" y1={yy} x2="120" y2={yy} stroke={color.dark} strokeWidth="1.5" opacity={0.35} />
          ))}
          <rect x="66" y="86" width="28" height="16" rx="6" fill={color.dark} opacity={0.6} />
          {arms}
        </>
      );
    case 'cardigan':
      return (
        <>
          <path d="M42 98 C42 90, 118 90, 118 98 L124 165 C124 172, 36 172, 36 165 Z" fill={fill} />
          <line x1="80" y1="96" x2="80" y2="168" stroke={color.dark} strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="80" cy="118" r="2.4" fill={color.dark} />
          <circle cx="80" cy="134" r="2.4" fill={color.dark} />
          <circle cx="80" cy="150" r="2.4" fill={color.dark} />
          <rect x="66" y="86" width="28" height="14" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          {arms}
        </>
      );
    case 'yellow-jacket':
      return (
        <>
          <rect x="66" y="80" width="28" height="24" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M42 98 C42 90, 118 90, 118 98 L124 165 C124 172, 36 172, 36 165 Z" fill={fill} />
          <path d="M52 95 L80 120 L108 95 L96 90 L80 102 L64 90 Z" fill={color.dark} />
          <line x1="80" y1="120" x2="80" y2="166" stroke={color.dark} strokeWidth="2.5" strokeDasharray="4 2" />
          {arms}
        </>
      );
    case 'casual-tee':
    default:
      return (
        <>
          <path d="M46 98 C46 90, 114 90, 114 98 L118 160 C118 168, 42 168, 42 160 Z" fill={fill} />
          <path d="M64 92 Q80 104 96 92 L92 96 Q80 106 68 96 Z" fill="#ffffff" opacity={0.5} />
          {arms}
        </>
      );
  }
}

export const GuardianClayAvatar: React.FC<GuardianClayAvatarProps> = ({
  features,
  action = 'idle',
  isSpeaking = false,
}: GuardianClayAvatarProps) => {
  const uid = useId().replace(/[:]/g, '');
  const skin = SKIN_TONES[features.skinTone];
  const hair = HAIR_COLORS[features.hairColor];
  const cloth = CLOTHING_COLORS[features.clothingColor];
  const faceShape = FACE_SHAPE_RATIO[features.faceShape];
  const showFacialHair = Boolean(features.hasFacialHair);

  return (
    <svg viewBox="0 0 160 260" className="w-full h-full drop-shadow-xl select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`gcSkin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={skin.light} />
          <stop offset="100%" stopColor={skin.dark} />
        </linearGradient>
        <linearGradient id={`gcHair-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={hair.light} />
          <stop offset="100%" stopColor={hair.dark} />
        </linearGradient>
        <linearGradient id={`gcCloth-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={cloth.light} />
          <stop offset="100%" stopColor={cloth.dark} />
        </linearGradient>
        <filter id={`gcShadow-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      <ellipse cx="80" cy="245" rx="46" ry="10" fill="#000000" opacity={0.18} />

      <g id="legs">
        <rect x="54" y="155" width="20" height="75" rx="8" fill="#334155" />
        <rect x="86" y="155" width="20" height="75" rx="8" fill="#334155" />
        <rect x="48" y="222" width="28" height="18" rx="8" fill={cloth.dark} />
        <rect x="46" y="234" width="32" height="7" rx="3" fill="#ffffff" />
        <rect x="84" y="222" width="28" height="18" rx="8" fill={cloth.dark} />
        <rect x="82" y="234" width="32" height="7" rx="3" fill="#ffffff" />
      </g>

      <g id="torso" filter={`url(#gcShadow-${uid})`}>
        <Garment
          style={features.clothingStyle}
          color={cloth}
          uid={uid}
          isSpeaking={isSpeaking}
          action={action}
          skin={skin}
        />
      </g>

      <g id="head">
        <rect x="73" y="68" width="14" height="16" rx="4" fill={`url(#gcSkin-${uid})`} />

        <HairBack style={features.hairStyle} hair={hair} uid={uid} />

        <ellipse
          cx="80"
          cy="52"
          rx={faceShape.rx}
          ry={faceShape.ry}
          fill={`url(#gcSkin-${uid})`}
        />
        {features.faceShape === 'square' && (
          <rect x="58" y="62" width="44" height="14" rx="3" fill={`url(#gcSkin-${uid})`} />
        )}
        {features.faceShape === 'heart' && (
          <path d={`M66 68 Q80 ${68 + faceShape.jaw * 8} 94 68 Q80 74 66 68 Z`} fill={`url(#gcSkin-${uid})`} />
        )}

        <HairFront style={features.hairStyle} hair={hair} uid={uid} />

        <circle cx="71" cy="50" r="4.2" fill="#0f172a" />
        <circle cx="89" cy="50" r="4.2" fill="#0f172a" />
        <circle cx="72.5" cy="48.5" r="1.4" fill="#ffffff" />
        <circle cx="90.5" cy="48.5" r="1.4" fill="#ffffff" />
        <path
          d="M66 43 Q71 40 76 43"
          stroke="#334155"
          strokeWidth={features.guardianStyle === 'masculine' ? 2.6 : 2}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M84 43 Q89 40 94 43"
          stroke="#334155"
          strokeWidth={features.guardianStyle === 'masculine' ? 2.6 : 2}
          strokeLinecap="round"
          fill="none"
        />

        {features.glasses && <Glasses style={features.glassesStyle ?? 'round-dark'} uid={uid} />}

        <circle cx="63" cy="58" r="4.5" fill="#f43f5e" opacity={0.22} />
        <circle cx="97" cy="58" r="4.5" fill="#f43f5e" opacity={0.22} />

        {showFacialHair && (
          <path
            d="M62 62 C66 74, 94 74, 98 62 C96 70, 88 76, 80 76 C72 76, 64 70, 62 62 Z"
            fill={hair.dark}
            opacity={0.85}
          />
        )}

        {isSpeaking ? (
          <ellipse cx="80" cy="65" rx="6" ry="4" fill="#e11d48" />
        ) : (
          <path d="M73 63 Q80 70 87 63" stroke="#be123c" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  );
};
