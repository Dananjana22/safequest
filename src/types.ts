export type AgeTrack = 6 | 7 | 8 | 9;

export type SafetyCategory = 
  | 'stranger' 
  | 'body_safety' 
  | 'secrets' 
  | 'public_safety' 
  | 'digital_safety';

export type QuestionFormat = 
  | 'best_choice' 
  | 'tap_unsafe' 
  | 'drag_order' 
  | 'trusted_adult' 
  | 'yes_no' 
  | 'family_password';

export type LanguageCode = 'en' | 'si';

export interface OptionItem {
  id: string;
  label: string;
  labelSi?: string;
  iconName: string;
  type: 'safe' | 'unsafe' | 'trap';
  feedback: string;
  feedbackSi?: string;
  feedbackAudio?: {
    en: string;
    si: string;
  };
  isCorrect: boolean;
  // Opens the Family Password check dialog when chosen. Set this only on options
  // whose action IS asking for the family password — never infer it from the
  // label or icon, since options that merely mention passwords (e.g. "NEVER
  // share passwords with anyone") must not prompt for one.
  triggersFamilyPasswordCheck?: boolean;
}

export interface QuestionData {
  id: string;
  stepNumber: 1 | 2 | 3;
  optionCount: 2 | 3 | 4;
  format: QuestionFormat;
  sceneType: 'park' | 'home' | 'school' | 'street' | 'store' | 'computer' | 'bus';
  sceneDescription: string;
  sceneDescriptionSi?: string;
  onScreenText: string; // Max 10 words per HCI guideline
  onScreenTextSi?: string;
  voiceOverText: {
    en: string;
    si: string;
    ta?: string;
  };
  options: OptionItem[];
  scenarioVariantTag?: string;
}

export interface LevelData {
  id: string;
  levelNumber: number; // 1 to 5
  category: SafetyCategory;
  ageTrack: AgeTrack;
  title: string;
  titleSi?: string;
  categoryTitle: string;
  categoryTitleSi?: string;
  estimatedPlaytime: string;
  iconName: string;
  summary: string;
  summarySi?: string;
  questions: QuestionData[];
  variants?: Record<string, QuestionData[]>;
}

export type SkinTone =
  | 'light'
  | 'light-medium'
  | 'medium'
  | 'medium-dark'
  | 'dark';

export type HairColor =
  | 'black'
  | 'dark-brown'
  | 'brown'
  | 'light-brown'
  | 'blonde'
  | 'auburn'
  | 'grey'
  | 'other';

export type HairLength = 'short' | 'medium' | 'long';

export type HairStyle =
  | 'short-crop'
  | 'side-part'
  | 'curly-volume'
  | 'classic-bob'
  | 'long-waves'
  | 'high-bun'
  | 'ponytail';

export type FaceShape = 'round' | 'oval' | 'square' | 'heart' | 'long';

export type GuardianStyle = 'feminine' | 'masculine' | 'neutral';

export type ClothingStyle =
  | 'casual-tee'
  | 'knit-sweater'
  | 'yellow-jacket'
  | 'polo-shirt'
  | 'casual-hoodie'
  | 'cardigan';

export type ClothingColor =
  | 'yellow'
  | 'navy'
  | 'emerald'
  | 'rose'
  | 'purple'
  | 'teal'
  | 'coral'
  | 'slate';

export type GlassesStyle = 'none' | 'round-dark' | 'square-modern' | 'wireframe';

export interface GuardianFeatures {
  skinTone: SkinTone;
  hairColor: HairColor;
  hairLength: HairLength;
  hairStyle: HairStyle;
  faceShape: FaceShape;
  glasses: boolean;
  glassesStyle?: GlassesStyle;
  guardianStyle: GuardianStyle;
  clothingStyle: ClothingStyle;
  clothingColor: ClothingColor;
  hasFacialHair?: boolean;
}

export interface UserProfile {
  childName: string;
  age: AgeTrack;
  avatarId: 'kai' | 'mira' | 'leo' | 'zara';
  customAvatarUrl?: string;
  guardianName?: string;
  guardianRole: string; // "Mum", "Dad", "Grandma", "Coach", "Teacher"
  guardianPhotoUrl?: string;
  guardianStyle?: 'auburn_glasses' | 'panda' | 'detective';
  guardianFeatures?: GuardianFeatures;
  familyPassword: string;
  language: LanguageCode;
  themePreference: 'emerald' | 'sky' | 'amber' | 'purple' | 'coral';
  soundEnabled: boolean;
  voiceEnabled: boolean;
  isConfigured: boolean;
}

export interface LevelResult {
  levelId: string;
  stars: number; // 1, 2, or 3
  firstTryScore: number; // out of 3
  date: string;
  passed: boolean;
}

export interface SafetyLogEntry {
  id: string;
  timestamp: string;
  levelId: string;
  levelTitle: string;
  category: SafetyCategory;
  questionIndex: number;
  scenarioTitle: string;
  chosenLabel: string;
  isSafe: boolean;
  isTrap: boolean;
  feedbackGiven: string;
}

export interface ProgressState {
  completedLevels: Record<string, LevelResult>;
  unlockedLevels: string[];
  logs: SafetyLogEntry[];
}

export type GameScreen = 
  | 'landing' 
  | 'onboarding_gate' 
  | 'onboarding_family' 
  | 'onboarding_child' 
  | 'village_map' 
  | 'game_level' 
  | 'parent_dashboard';

