import React, { useState, useEffect } from 'react';
import { UserProfile, ProgressState, LevelData, GameScreen, SafetyLogEntry, LanguageCode } from './types';
import { INITIAL_USER_PROFILE, LEVELS_DATA } from './data/curriculumData';
import { LandingStartScreen } from './components/LandingStartScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { VillageMap } from './components/VillageMap';
import { GameCanvas } from './components/GameCanvas';
import { LevelEndModal } from './components/LevelEndModal';
import { ParentDashboard } from './components/ParentDashboard';
import { HelpModal } from './components/HelpModal';

const PROFILE_STORAGE_KEY = 'safequest_profile_v2';
const PROGRESS_STORAGE_KEY = 'safequest_progress_v2';

export default function App() {
  // Load saved profile or fallback to initial configured profile with defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER_PROFILE,
          ...parsed,
          language: parsed.language || 'en'
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_USER_PROFILE;
  });

  // Load saved progress or fallback
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          completedLevels: parsed.completedLevels || {},
          unlockedLevels: parsed.unlockedLevels || ['age6_l1', 'age7_l1', 'age8_l1', 'age9_l1'],
          logs: parsed.logs || []
        };
      }
    } catch {
      // ignore
    }
    return {
      completedLevels: {},
      unlockedLevels: ['age6_l1', 'age7_l1', 'age8_l1', 'age9_l1'],
      logs: []
    };
  });

  // Game Screen Flow State
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('landing');
  const [activeLevel, setActiveLevel] = useState<LevelData | null>(null);
  const [showLevelEndModal, setShowLevelEndModal] = useState<boolean>(false);
  const [levelEndResults, setLevelEndResults] = useState<{ stars: number; score: number } | null>(null);
  const [showParentPortal, setShowParentPortal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [profile]);

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [progress]);

  // Start Level from Map
  const handleStartLevel = (level: LevelData) => {
    setActiveLevel(level);
    setShowLevelEndModal(false);
    setCurrentScreen('game_level');
  };

  // Level Completed Handler
  const handleCompleteLevel = (stars: number, score: number, newLogs: SafetyLogEntry[]) => {
    if (!activeLevel) return;

    const isPassed = score >= 2;

    setProgress((prev) => {
      const updatedCompleted = {
        ...prev.completedLevels,
        [activeLevel.id]: {
          levelId: activeLevel.id,
          stars: Math.max(stars, prev.completedLevels[activeLevel.id]?.stars || 0),
          firstTryScore: score,
          date: new Date().toISOString(),
          passed: isPassed || !!prev.completedLevels[activeLevel.id]?.passed
        }
      };

      const nextLevelIndex = activeLevel.levelNumber + 1;
      const nextLevel = LEVELS_DATA.find(
        (l) => l.ageTrack === activeLevel.ageTrack && l.levelNumber === nextLevelIndex
      );

      const updatedUnlocked = [...prev.unlockedLevels];
      if (isPassed && nextLevel && !updatedUnlocked.includes(nextLevel.id)) {
        updatedUnlocked.push(nextLevel.id);
      }

      return {
        completedLevels: updatedCompleted,
        unlockedLevels: updatedUnlocked,
        logs: [...prev.logs, ...newLogs]
      };
    });

    setLevelEndResults({ stars, score });
    setShowLevelEndModal(true);
  };

  // Replay Current Level
  const handleReplayCurrentLevel = () => {
    setShowLevelEndModal(false);
    if (activeLevel) {
      const current = { ...activeLevel };
      setActiveLevel(null);
      setTimeout(() => {
        setActiveLevel(current);
        setCurrentScreen('game_level');
      }, 50);
    }
  };

  // Advance to Next Level
  const handleNextLevel = () => {
    setShowLevelEndModal(false);
    if (!activeLevel) return;

    const nextIndex = activeLevel.levelNumber + 1;
    const nextLevel = LEVELS_DATA.find(
      (l) => l.ageTrack === activeLevel.ageTrack && l.levelNumber === nextIndex
    );

    if (nextLevel) {
      setActiveLevel(nextLevel);
      setCurrentScreen('game_level');
    } else {
      setActiveLevel(null);
      setCurrentScreen('village_map');
    }
  };

  // Return to Village Map
  const handleBackToMap = () => {
    setShowLevelEndModal(false);
    setActiveLevel(null);
    setCurrentScreen('village_map');
  };

  // Reset progress handler
  const handleResetProgress = () => {
    const fresh: ProgressState = {
      completedLevels: {},
      unlockedLevels: ['age6_l1', 'age7_l1', 'age8_l1', 'age9_l1'],
      logs: []
    };
    setProgress(fresh);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(fresh));
  };

  // Complete onboarding
  const handleFinishOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setCurrentScreen('village_map');
  };

  return (
    <div className="min-h-screen bg-slate-900 font-['Nunito',sans-serif] text-slate-800 antialiased select-none">
      {/* SCREEN 1: LANDING START SCREEN */}
      {currentScreen === 'landing' && (
        <LandingStartScreen
          profile={profile}
          progress={progress}
          onStartGame={() => setCurrentScreen('village_map')}
          onOpenSetup={() => setCurrentScreen('onboarding_gate')}
          onOpenParentPortal={() => setShowParentPortal(true)}
          onChangeLanguage={(lang: LanguageCode) => setProfile(p => ({ ...p, language: lang }))}
          onToggleVoice={() => setProfile(p => ({ ...p, voiceEnabled: !p.voiceEnabled }))}
        />
      )}

      {/* SCREEN 2: ONBOARDING WIZARD */}
      {(currentScreen === 'onboarding_gate' || currentScreen === 'onboarding_family' || currentScreen === 'onboarding_child') && (
        <OnboardingFlow
          initialProfile={profile}
          onComplete={handleFinishOnboarding}
          onCancel={() => setCurrentScreen('landing')}
        />
      )}

      {/* SCREEN 3: 3D INTERACTIVE VILLAGE MAP */}
      {currentScreen === 'village_map' && (
        <VillageMap
          profile={profile}
          progress={progress}
          onSelectLevel={handleStartLevel}
          onOpenParentPortal={() => setShowParentPortal(true)}
          onBackToLanding={() => setCurrentScreen('landing')}
          onChangeLanguage={(lang: LanguageCode) => setProfile(p => ({ ...p, language: lang }))}
          onToggleVoice={() => setProfile(p => ({ ...p, voiceEnabled: !p.voiceEnabled }))}
        />
      )}

      {/* SCREEN 4: 3D GAMEPLAY CANVAS */}
      {currentScreen === 'game_level' && activeLevel && (
        <GameCanvas
          level={activeLevel}
          profile={profile}
          onExit={handleBackToMap}
          onCompleteLevel={handleCompleteLevel}
        />
      )}

      {/* LEVEL END CELEBRATION MODAL */}
      {showLevelEndModal && activeLevel && levelEndResults && (
        <LevelEndModal
          level={activeLevel}
          profile={profile}
          stars={levelEndResults.stars}
          score={levelEndResults.score}
          onNextLevel={handleNextLevel}
          onReplayLevel={handleReplayCurrentLevel}
          onBackToMap={handleBackToMap}
        />
      )}

      {/* PARENT DASHBOARD & ANALYTICS PORTAL */}
      {showParentPortal && (
        <ParentDashboard
          profile={profile}
          progress={progress}
          onUpdateProfile={(updated) => setProfile(updated)}
          onResetProgress={handleResetProgress}
          onClose={() => setShowParentPortal(false)}
        />
      )}

      {/* HELP / SAFETY INSTRUCTIONS MODAL */}
      {showHelpModal && (
        <HelpModal 
          onClose={() => setShowHelpModal(false)} 
          isSinhala={profile.language === 'si'} 
        />
      )}
    </div>
  );
}
