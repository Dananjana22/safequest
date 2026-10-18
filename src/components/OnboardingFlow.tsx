import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, AgeTrack, LanguageCode, GuardianFeatures } from '../types';
import { CharacterAvatar } from './CharacterAvatars';
import { playSoundEffect } from '../utils/audio';
import { NoFaceDetectedError } from '../ml/faceAnalysis';
import { analyzeGuardianImage, warmUpGuardianAnalysis } from '../ml/guardianAnalysisClient';
import { Shield, Sparkles, Check, ArrowRight, Lock, Key, Heart, Star, Camera, Loader2 } from 'lucide-react';

const DEFAULT_GUARDIAN_FEATURES: GuardianFeatures = {
  skinTone: 'medium',
  hairColor: 'brown',
  hairLength: 'medium',
  hairStyle: 'long-waves',
  faceShape: 'oval',
  glasses: false,
  glassesStyle: 'round-dark',
  guardianStyle: 'neutral',
  clothingStyle: 'yellow-jacket',
  clothingColor: 'yellow',
};

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
  isFirstTime?: boolean;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onComplete,
  onCancel,
  isFirstTime = true
}) => {
  // Step state: 1 = Parent Gate, 2 = Family Account, 3 = Child Profile
  const [step, setStep] = useState<number>(isFirstTime ? 1 : 2);

  // Math Parent Gate
  const [mathProblem] = useState(() => {
    const num1 = Math.floor(Math.random() * 7) + 3;
    const num2 = Math.floor(Math.random() * 7) + 2;
    return { num1, num2, answer: num1 * num2 };
  });
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);

  // Form profile state
  const [profile, setProfile] = useState<UserProfile>({
    ...initialProfile,
    childName: initialProfile.childName || 'Sam',
    age: initialProfile.age || 6,
    avatarId: initialProfile.avatarId || 'kai',
    guardianName: initialProfile.guardianName || 'Sarah',
    guardianRole: initialProfile.guardianRole || 'Mum',
    familyPassword: initialProfile.familyPassword || 'StarTiger77',
    language: initialProfile.language || 'en',
    themePreference: initialProfile.themePreference || 'emerald',
    soundEnabled: true,
    voiceEnabled: true,
    isConfigured: true
  });

  const isSinhala = profile.language === 'si';

  // Guardian photo -> auto-generated clay character (skin tone + hair color
  // detected via ml/faceAnalysis.ts, masculine/feminine style via
  // ml/guardianClassifier.ts's guardian_style.onnx). Both run entirely in
  // the browser - the photo itself is never uploaded anywhere.
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'analyzing' | 'done' | 'error'>('idle');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [guardianPhotoPreview, setGuardianPhotoPreview] = useState<string | null>(null);

  // The worker's OpenCV + ONNX runtimes are ~20MB and take seconds to
  // initialize. Start that as soon as the parent reaches the guardian step
  // so it overlaps with them picking a role and typing a password, rather
  // than stalling the first photo they upload.
  useEffect(() => {
    if (step === 2) warmUpGuardianAnalysis();
  }, [step]);

  const handleGuardianPhoto = useCallback(async (file: File) => {
    setPhotoStatus('analyzing');
    setPhotoError(null);

    const url = URL.createObjectURL(file);
    setGuardianPhotoPreview(url);

    const img = new Image();
    img.onload = async () => {
      try {
        // Runs in a Web Worker - the OpenCV/ONNX runtimes are heavy enough
        // to freeze the page if initialized on the main thread.
        const analysis = await analyzeGuardianImage(img);
        setProfile((p) => {
          const base = p.guardianFeatures ?? DEFAULT_GUARDIAN_FEATURES;
          return {
            ...p,
            guardianPhotoUrl: url,
            guardianFeatures: {
              ...base,
              skinTone: analysis.skinTone,
              hairColor: analysis.hairColor,
              guardianStyle: analysis.guardianStyle,
              hairLength: analysis.hairLength,
              hairStyle: analysis.hairStyle,
              faceShape: analysis.faceShape,
              glasses: analysis.glasses,
              glassesStyle: analysis.glassesStyle,
              hasFacialHair: analysis.hasFacialHair,
              // Null means the photo was cropped too tightly to show clothing;
              // keep whatever is already set rather than inventing a colour.
              clothingColor: analysis.clothingColor ?? base.clothingColor,
            },
          };
        });
        playSoundEffect('correct');
        setPhotoStatus('done');
      } catch (err) {
        playSoundEffect('retry');

        if (err instanceof NoFaceDetectedError) {
          setPhotoError(
            isSinhala
              ? 'මුහුණක් හඳුනාගත නොහැක. පැහැදිලි ඡායාරූපයක් උත්සාහ කරන්න.'
              : err.message
          );
        } else {
          // Anything else is a bug, not something the parent did wrong. The
          // parent gets a plain message; the real error - carrying the
          // worker-side stack - goes to the console, since a generic string
          // alone makes this undiagnosable from a screenshot.
          console.error('[SafeQuest] Guardian photo analysis failed:', err);
          setPhotoError(
            isSinhala
              ? 'ඡායාරූපය විශ්ලේෂණය කිරීමේදී දෝෂයක් ඇතිවිය.'
              : 'Something went wrong analyzing that photo.'
          );
        }
        setPhotoStatus('error');
      }
    };
    img.onerror = () => {
      setPhotoError(isSinhala ? 'ඡායාරූපය පූරණය කළ නොහැක.' : 'Could not load that image file.');
      setPhotoStatus('error');
    };
    img.src = url;
  }, [isSinhala]);

  // Verify Parent Gate
  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateInput, 10) === mathProblem.answer) {
      playSoundEffect('correct');
      setGateError(false);
      setStep(2);
    } else {
      playSoundEffect('retry');
      setGateError(true);
      setGateInput('');
    }
  };

  const handleFinish = () => {
    playSoundEffect('celebrate');
    onComplete(profile);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 text-white flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* 3D Floating Cyber/Cosmic Glow Particles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-pink-500/10 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-500/10 filter blur-3xl pointer-events-none" />

      {/* Main Glassmorphic 3D Setup Pod */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border-4 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Top Progress Track */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <span className="font-black text-lg text-white">SafeQuest Onboarding</span>
          </div>

          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all ${step === s ? 'bg-amber-400 scale-125 ring-4 ring-amber-400/30' : step > s ? 'bg-emerald-400' : 'bg-slate-700'
                  }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: PARENT GATE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl border-2 border-amber-400 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  {isSinhala ? 'දෙමාපිය ආරක්ෂණ දොරටුව' : 'Parent Security Gate'}
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  {isSinhala
                    ? 'වැඩිහිටියෙකු බව තහවුරු කිරීමට කරුණාකර පහත ගණිත ගැටලුව විසඳන්න:'
                    : 'Please solve this math check to configure your family safety account:'}
                </p>
              </div>

              <form onSubmit={handleVerifyGate} className="space-y-4 max-w-xs mx-auto">
                <div className="text-3xl font-black text-amber-300 py-3 bg-slate-800/80 rounded-2xl border-2 border-slate-700 shadow-inner">
                  {mathProblem.num1} × {mathProblem.num2} = ?
                </div>

                <input
                  type="number"
                  pattern="[0-9]*"
                  value={gateInput}
                  onChange={(e) => setGateInput(e.target.value)}
                  placeholder={isSinhala ? 'පිළිතුර' : 'Answer'}
                  className="w-full text-center text-2xl font-black py-3 rounded-2xl bg-slate-800 text-white border-2 border-purple-400 focus:border-amber-400 focus:outline-none"
                  autoFocus
                />

                {gateError && (
                  <div className="text-xs text-rose-400 font-bold animate-bounce">
                    {isSinhala ? 'වැරදි පිළිතුරකි. නැවත උත්සාහ කරන්න.' : 'Incorrect answer. Please try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>{isSinhala ? 'තහවුරු කරන්න' : 'Verify & Continue'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: FAMILY ACCOUNT & GUARDIAN */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black text-white flex items-center justify-center space-x-2">
                  <Key className="w-6 h-6 text-amber-400" />
                  <span>{isSinhala ? 'පවුලේ ගිණුම සහ රහස් පදය' : 'Family Account & Password'}</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {isSinhala ? 'හදිසි අවස්ථා සහ ආරක්ෂක පරීක්ෂණ සඳහා පවුලේ මුරපදය සකසන්න.' : 'Set your official family safety password and trusted guardian role.'}
                </p>
              </div>

              {/* Guardian Avatar Preview & Role */}
              <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-2xl border-2 border-slate-700">
                <CharacterAvatar
                  id="guardian"
                  size="md"
                  guardianRole={profile.guardianRole}
                  action="wave"
                  guardianFeatures={profile.guardianFeatures}
                />
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    {isSinhala ? 'භාරකරුගේ භූමිකාව' : 'Guardian Role'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mum', 'Dad', 'Grandma', 'Teacher', 'Coach'].map((role) => {
                      const label = isSinhala
                        ? (role === 'Mum' ? 'අම්මා' : role === 'Dad' ? 'තාත්තා' : role === 'Grandma' ? 'ආච්චි' : role === 'Teacher' ? 'ගුරුතුමිය' : 'පුහුණුකරු')
                        : role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            playSoundEffect('click');
                            setProfile({ ...profile, guardianRole: role });
                          }}
                          className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all ${profile.guardianRole === role
                              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-white'
                              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Guardian Photo -> Auto-Generated Character */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border-2 border-slate-700 space-y-2">
                <label className="text-xs font-bold text-amber-300 uppercase flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span>
                    {isSinhala
                      ? 'ඡායාරූපයකින් චරිතය සාදන්න'
                      : 'Generate Character From Photo'}
                  </span>
                </label>
                <p className="text-[10px] text-slate-400">
                  {isSinhala
                    ? 'සම් වර්ණය සහ කෙස් වර්ණය ස්වයංක්‍රීයව හඳුනාගනී. ඡායාරූපය කිසි විටෙකත් උඩුගත නොකෙරේ.'
                    : "Skin tone and hair color are detected automatically. Your photo is never uploaded anywhere - it's analyzed on this device."}
                </p>

                <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition cursor-pointer">
                  {photoStatus === 'analyzing' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isSinhala ? 'විශ්ලේෂණය කරමින්...' : 'Analyzing photo...'}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>
                        {guardianPhotoPreview
                          ? isSinhala ? 'වෙනත් ඡායාරූපයක් උත්සාහ කරන්න' : 'Try a different photo'
                          : isSinhala ? 'ඡායාරූපයක් උඩුගත කරන්න' : 'Upload a photo'}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={photoStatus === 'analyzing'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleGuardianPhoto(file);
                    }}
                  />
                </label>

                {photoStatus === 'error' && photoError && (
                  <p className="text-rose-400 text-xs font-bold text-center">{photoError}</p>
                )}
                {photoStatus === 'done' && (
                  <p className="text-emerald-400 text-xs font-bold text-center">
                    {isSinhala ? 'චරිතය සාදන ලදී!' : 'Character generated above!'}
                  </p>
                )}
              </div>

              {/* Family Secret Password */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border-2 border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 uppercase flex items-center space-x-1">
                    <Key className="w-4 h-4" />
                    <span>{isSinhala ? 'පවුලේ රහස් මුරපදය' : 'Family Safety Password'}</span>
                  </label>
                  <span className="text-[10px] text-slate-400">e.g. StarTiger77</span>
                </div>
                <input
                  type="text"
                  value={profile.familyPassword}
                  onChange={(e) => setProfile({ ...profile, familyPassword: e.target.value })}
                  placeholder="e.g. StarTiger77"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono font-bold text-lg border-2 border-purple-500/50 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  {isSinhala ? 'භාෂාව තෝරන්න' : 'Game Language'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playSoundEffect('click');
                      setProfile({ ...profile, language: 'en' });
                    }}
                    className={`py-2.5 rounded-2xl font-black text-sm transition-all border-2 ${profile.language === 'en'
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-white shadow-lg'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                  >
                    🇬🇧 English
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSoundEffect('click');
                      setProfile({ ...profile, language: 'si' });
                    }}
                    className={`py-2.5 rounded-2xl font-black text-sm transition-all border-2 ${profile.language === 'si'
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-white shadow-lg'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                  >
                    🇱🇰 සිංහල (Sinhala)
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  setStep(3);
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{isSinhala ? 'මීළඟ: ළමා පැතිකඩ' : 'Next: Child Profile'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 3: CHILD PROFILE (AGE RESTRICTION, AVATAR, NAME) */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black text-white">
                  {isSinhala ? 'ඔබේ කුඩා වීරයා' : 'Create Child Hero'}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {isSinhala
                    ? 'වයස තෝරාගත් විට එම වයසට අදාළ මට්ටම් පමණක් විවෘත වේ.'
                    : 'Selecting an age strictly unlocks the exact curated levels for that age track.'}
                </p>
              </div>

              {/* Child Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">
                  {isSinhala ? 'දරුවාගේ නම' : 'Child Name'}
                </label>
                <input
                  type="text"
                  value={profile.childName}
                  onChange={(e) => setProfile({ ...profile, childName: e.target.value })}
                  placeholder="e.g. Sam"
                  className="w-full px-4 py-2.5 mt-1 rounded-xl bg-slate-800 text-white font-black text-base border-2 border-slate-700 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* STRICT AGE SELECTION (6, 7, 8, 9) */}
              <div>
                <label className="text-xs font-bold text-amber-300 uppercase flex items-center justify-between">
                  <span>{isSinhala ? 'වයස් කාණ්ඩය (තෝරන්න)' : 'Age Track (Strict Single-Age)'}</span>
                  <span className="text-slate-400 text-[10px]">Required</span>
                </label>
                <div className="grid grid-cols-4 gap-2.5 mt-1.5">
                  {([6, 7, 8, 9] as AgeTrack[]).map((ageNum) => (
                    <button
                      key={ageNum}
                      type="button"
                      onClick={() => {
                        playSoundEffect('click');
                        setProfile({ ...profile, age: ageNum });
                      }}
                      className={`py-3 rounded-2xl font-black transition-all border-2 flex flex-col items-center justify-center ${profile.age === ageNum
                          ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-slate-950 border-white shadow-xl scale-105 ring-4 ring-amber-400/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                    >
                      <span className="text-xl leading-none">{ageNum}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {isSinhala ? 'වසර' : 'YRS'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Character Avatar Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">
                  {isSinhala ? 'චරිතය තෝරන්න' : 'Choose 3D Hero'}
                </label>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
                  {(['kai', 'mira', 'leo', 'zara'] as const).map((avatarId) => (
                    <button
                      key={avatarId}
                      type="button"
                      onClick={() => {
                        playSoundEffect('click');
                        setProfile({ ...profile, avatarId });
                      }}
                      className={`p-2 rounded-2xl transition-all border-2 flex flex-col items-center ${profile.avatarId === avatarId
                          ? 'bg-purple-600/80 border-amber-400 shadow-xl ring-2 ring-white scale-105'
                          : 'bg-slate-800/80 border-slate-700 hover:bg-slate-700'
                        }`}
                    >
                      <CharacterAvatar id={avatarId} size="sm" />
                      <span className="text-[10px] font-black uppercase text-white mt-1">
                        {avatarId}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete Onboarding Button */}
              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black py-4 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{isSinhala ? 'ආරක්ෂක ගමන අරඹන්න!' : 'Start SafeQuest Adventure!'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
