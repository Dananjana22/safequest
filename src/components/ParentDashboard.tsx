import React, { useState } from 'react';
import { UserProfile, ProgressState, SafetyCategory, AgeTrack, LanguageCode } from '../types';
import { CATEGORY_INFO, AVATAR_CHARACTERS, GUARDIAN_ROLES, THEME_PREFERENCES } from '../data/curriculumData';
import { CharacterAvatar } from './CharacterAvatars';
import { 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  MessageSquareHeart, 
  FileText, 
  Lock, 
  Sparkles, 
  Volume2, 
  Check, 
  AlertTriangle, 
  RotateCcw,
  BookOpen,
  HelpCircle,
  Award
} from 'lucide-react';
import { ParentInstructionsModal } from './ParentInstructionsModal';

interface ParentDashboardProps {
  profile: UserProfile;
  progress: ProgressState;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  progress,
  onUpdateProfile,
  onResetProgress,
  onClose
}) => {
  const isSinhala = profile.language === 'si';
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Safe math gate for parent verification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mathQuestion] = useState(() => {
    const a = Math.floor(Math.random() * 6) + 4;
    const b = Math.floor(Math.random() * 6) + 3;
    return { a, b, answer: a + b };
  });
  const [parentInput, setParentInput] = useState('');
  const [gateError, setGateError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'logs' | 'starters' | 'settings'>('analytics');

  // Profile edit state
  const [editProfile, setEditProfile] = useState<UserProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(parentInput.trim(), 10) === mathQuestion.answer) {
      setIsAuthenticated(true);
      setGateError(false);
    } else {
      setGateError(true);
    }
  };

  const handleSaveSettings = () => {
    onUpdateProfile(editProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Category statistics calculation
  const categoryStats = (Object.keys(CATEGORY_INFO) as SafetyCategory[]).map((cat) => {
    const logsForCat = progress.logs.filter(l => l.category === cat);
    const totalAttempted = logsForCat.length;
    const safeCount = logsForCat.filter(l => l.isSafe).length;
    const trapCount = logsForCat.filter(l => l.isTrap).length;
    const accuracy = totalAttempted > 0 ? Math.round((safeCount / totalAttempted) * 100) : 100;

    return {
      category: cat,
      meta: CATEGORY_INFO[cat],
      totalAttempted,
      safeCount,
      trapCount,
      accuracy,
      mastered: accuracy >= 75 && totalAttempted >= 3
    };
  });

  const totalLogs = progress.logs.length;
  const totalSafe = progress.logs.filter(l => l.isSafe).length;
  const overallAccuracy = totalLogs > 0 ? Math.round((totalSafe / totalLogs) * 100) : 100;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-indigo-400 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl mx-auto flex items-center justify-center border-2 border-indigo-300">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              {isSinhala ? 'දෙමාපිය සහ භාරකාර පිවිසුම' : 'Parents & Guardians Area'}
            </h2>
            <p className="text-xs font-semibold text-slate-600">
              {isSinhala 
                ? 'ළමයින් ආරක්ෂිත ක්‍රීඩා අවකාශයේ තබා ගැනීමට, කරුණාකර මෙම ගණිත ගැටලුව විසඳන්න:' 
                : 'To keep children in safe play mode, please answer this quick math check:'}
            </p>
          </div>

          <form onSubmit={handleVerifyGate} className="space-y-4">
            <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200 text-center">
              <span className="text-2xl font-black text-indigo-950 font-mono">
                {mathQuestion.a} + {mathQuestion.b} = ?
              </span>
            </div>

            <input
              type="number"
              value={parentInput}
              onChange={(e) => setParentInput(e.target.value)}
              placeholder={isSinhala ? 'පිළිතුර ඇතුළත් කරන්න' : 'Enter answer'}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 font-bold text-center text-xl outline-none"
            />

            {gateError && (
              <p className="text-xs font-bold text-rose-600 text-center">
                {isSinhala ? 'වැරදි පිළිතුරකි. නැවත උත්සාහ කරන්න.' : 'Incorrect answer. Please try again.'}
              </p>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                {isSinhala ? 'ක්‍රීඩාවට ආපසු' : 'Back to Game'}
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow"
              >
                {isSinhala ? 'ද්වාරය විවෘත කරන්න' : 'Unlock Portal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl my-auto shadow-2xl border-4 border-indigo-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow">
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-700/80 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {isSinhala ? 'දෙමාපිය විශ්ලේෂණ සහ සැකසුම්' : 'Parent Analytics & Setup'}
                </span>
                <span className="text-xs text-indigo-200 font-semibold">
                  {isSinhala ? `දරුවා: ${profile.childName} (වයස ${profile.age})` : `Child: ${profile.childName} (Age ${profile.age})`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif]">
                {isSinhala ? 'SafeQuest භාරකාර පාලක පුවරුව' : 'SafeQuest Guardian Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGuideModal(true)}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-black transition shadow flex items-center space-x-1.5 cursor-pointer"
              title={isSinhala ? 'ක්‍රීඩා මඟපෙන්වීම (පියවර 4)' : 'Parent Quick Guide (4 Steps)'}
            >
              <HelpCircle className="w-4 h-4 text-amber-950" />
              <span>{isSinhala ? 'මඟපෙන්වීම' : 'Parent Guide'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 cursor-pointer"
            >
              {isSinhala ? 'වසන්න සහ ක්‍රීඩාවට යන්න' : 'Close & Back to Game'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {/* Tabs wrap onto multiple rows rather than scrolling: at ~917px of
            labels they overflow any viewport narrower than the 1024px modal,
            and a horizontal scroll area leaves the last tabs unreachable. */}
        <div className="flex flex-wrap flex-shrink-0 border-b border-slate-200 bg-slate-50 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 flex flex-shrink-0 items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isSinhala ? 'කාණ්ඩ ප්‍රවීණතාව' : 'Category Mastery'}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 flex flex-shrink-0 items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'logs'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isSinhala ? `තීරණ සටහන් (${progress.logs.length})` : `Session Logs (${progress.logs.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('starters')}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 flex flex-shrink-0 items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'starters'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>{isSinhala ? 'සංවාද ආරම්භක' : 'Parent Conversation Starters'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 flex flex-shrink-0 items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isSinhala ? 'පැතිකඩ සහ සැකසුම්' : 'Personalization & Settings'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* ========================================================= */}
          {/* TAB 1: CATEGORY MASTERY & ANALYTICS */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {isSinhala ? 'සමස්ත ආරක්ෂක සාර්ථකත්වය' : 'Overall Safety Accuracy'}
                  </span>
                  <div className="text-3xl font-black text-indigo-900 font-['Fredoka',sans-serif]">
                    {overallAccuracy}%
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    {isSinhala 
                      ? `ප්‍රශ්න ${totalLogs} න් ආරක්ෂිත තේරීම් ${totalSafe} ක්` 
                      : `${totalSafe} safe decisions of ${totalLogs} total questions`}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {isSinhala ? 'වත්මන් වයස් විෂයමාලාව' : 'Current Age Curriculum'}
                  </span>
                  <div className="text-3xl font-black text-indigo-900 font-['Fredoka',sans-serif]">
                    {isSinhala ? `වයස ${profile.age} මට්ටම්` : `Age ${profile.age} Track`}
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    {isSinhala ? 'ළමා ආරක්ෂණ මොඩියුල 5 ක්' : '5 calibrated child-safety modules'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {isSinhala ? 'පවුලේ රහස් මුරපදය' : 'Active Family Password'}
                  </span>
                  <div className="text-xl font-mono font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-lg inline-block">
                    {profile.familyPassword}
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    {isSinhala ? 'මට්ටම් අවස්ථාවන්හිදී පරීක්ෂා කෙරේ' : 'Tested in Level scenarios'}
                  </p>
                </div>
              </div>

              {/* 5 Core Safety Categories Breakdown */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-800 font-['Fredoka',sans-serif]">
                  {isSinhala ? 'මූලික ආරක්ෂක කාණ්ඩ 5 විශ්ලේෂණය' : '5 Core Category Breakdown'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryStats.map((stat) => (
                    <div
                      key={stat.category}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${stat.meta.bgLight}`}>
                            {isSinhala ? stat.meta.titleSi : stat.meta.title}
                          </span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-800">
                          {stat.accuracy}% {isSinhala ? 'ආරක්ෂිතයි' : 'Safe'}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            stat.accuracy >= 80 ? 'bg-emerald-500' : stat.accuracy >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                          style={{ width: `${stat.totalAttempted === 0 ? 100 : stat.accuracy}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>
                          {stat.totalAttempted === 0 
                            ? (isSinhala ? 'තවම උත්සාහ කර නැත' : 'Not yet attempted') 
                            : (isSinhala ? `${stat.totalAttempted} න් ${stat.safeCount} ක් නිවැරදියි` : `${stat.safeCount} correct of ${stat.totalAttempted}`)}
                        </span>
                        {stat.trapCount > 0 && (
                          <span className="text-amber-700 font-bold">
                            ⚠️ {isSinhala ? `උපක්‍රමශීලී උගුල් ${stat.trapCount} කට හසුවිය` : `${stat.trapCount} distractor traps triggered`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: DETAILED SESSION LOGS */}
          {/* ========================================================= */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800 font-['Fredoka',sans-serif]">
                  {isSinhala ? 'සැබෑ කාලීන තීරණ සටහන්' : 'Real-Time Decision Logs'}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {isSinhala ? `සටහන් කළ අන්තර්ක්‍රියා ${progress.logs.length} ක්` : `${progress.logs.length} logged child interactions`}
                </span>
              </div>

              {progress.logs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    {isSinhala ? 'තවම ක්‍රීඩා සටහන් කිසිවක් නොමැත' : 'No gameplay logs recorded yet'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isSinhala 
                      ? 'ඔබේ දරුවා මට්ටම් ක්‍රීඩා කරන විට, ඔවුන් ගන්නා ආරක්ෂක තීරණ මෙහි සටහන් වේ.' 
                      : 'As your child plays levels, their safe choices and distractor responses will be logged here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {progress.logs.slice().reverse().map((log) => (
                    <div
                      key={log.id}
                      className={`p-4 rounded-2xl border bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        log.isSafe ? 'border-emerald-200' : log.isTrap ? 'border-amber-300 bg-amber-50/40' : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-slate-400 font-mono">
                            {log.timestamp}
                          </span>
                          <span className="text-xs font-black uppercase text-indigo-700">
                            {log.levelTitle} (Q{log.questionIndex})
                          </span>
                          {log.isSafe ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                              {isSinhala ? 'ආරක්ෂිත තේරීමක්' : 'Safe Choice'}
                            </span>
                          ) : log.isTrap ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                              {isSinhala ? 'උපක්‍රමශීලී උගුලකට හසුවිය' : 'Fell for Distractor Trap'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                              {isSinhala ? 'අනාරක්ෂිත තේරීමක්' : 'Unsafe Choice'}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-bold text-slate-800">
                          {isSinhala ? 'අවස්ථාව:' : 'Scenario:'} "{log.scenarioTitle}"
                        </p>
                        <p className="text-xs text-slate-600">
                          {isSinhala ? 'දරුවා තෝරාගත්තේ:' : 'Child chose:'} <strong className="text-slate-900">"{log.chosenLabel}"</strong>
                        </p>
                        <p className="text-xs italic text-indigo-900 bg-indigo-50/80 p-1.5 rounded-lg border border-indigo-100">
                          {isSinhala ? 'ලැබුණු උපදෙස:' : 'Guardian response:'} "{log.feedbackGiven}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CONVERSATION STARTERS FOR PARENTS */}
          {/* ========================================================= */}
          {activeTab === 'starters' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 font-['Fredoka',sans-serif]">
                  {isSinhala ? 'නිවසේ පුහුණුව සහ සාකච්ඡා මාර්ගෝපදේශ' : 'Home Practice & Discussion Guides'}
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  {isSinhala 
                    ? 'විෂයමාලා මාතෘකා මත පදනම් වූ විශේෂඥ ළමා ආරක්ෂණ සංවාද ආරම්භක.' 
                    : 'Expert child-safety conversation starters based on curriculum topics.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>{isSinhala ? 'පවුලේ රහස් මුරපදය පුහුණු වීම' : 'Practicing the Family Password'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isSinhala 
                      ? `යමෙකු "ඔයාව ගන්න අම්මා කිව්වා" යැයි පැවසුවහොත්, සැමවිටම පවුලේ රහස් වචනය: "${profile.familyPassword}" අසන ලෙස ඔබේ දරුවාට කියා දෙන්න. මෙය කෑම මේසයේදී පුහුණු වන්න!`
                      : `Explain to your child that if someone ever claims "Mum/Dad sent me to pick you up", they must always ask for the secret family word: "${profile.familyPassword}". Roleplay this at the dinner table!`}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-sky-700 font-extrabold text-sm">
                    <BookOpen className="w-5 h-5" />
                    <span>{isSinhala ? 'පුදුම කිරීම් සහ අනාරක්ෂිත රහස්' : 'Surprises vs Unsafe Secrets'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isSinhala
                      ? 'පුදුම කිරීම් (Surprises) යනු උපන්දින කේක් වැනි සැමට සතුට ගෙන දෙන දේවල් වන අතර, අනාරක්ෂිත රහස් යනු බියක් හෝ අපහසුතාවයක් ඇති කරන දේ බවත්, ඒවා වහාම දෙමාපියන්ට පැවසිය යුතු බවත් කියා දෙන්න.'
                      : 'Teach that Surprises are happy things that everyone finds out soon, while Unsafe Secrets make your tummy feel weird and must always be told to parents right away.'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-purple-700 font-extrabold text-sm">
                    <Sparkles className="w-5 h-5" />
                    <span>{isSinhala ? 'පොදු ස්ථානවල ආරක්ෂිත උපකාරකයින් හඳුනා ගැනීම' : 'Identifying Safe Helpers in Public'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isSinhala
                      ? 'සුපිරි වෙළඳසැලකට හෝ දුම්රිය ස්ථානයකට ගිය විට, නිල ලාංඡන සහිත කාර්යමණ්ඩලය, මුදල් අයකැමිවරුන් සහ ආරක්ෂක නිලධාරීන් පෙන්වා දීමට දරුවාට පුහුණු කරන්න.'
                      : 'When visiting the grocery store or train station, have your child point out the helpers: store staff with name badges, cashiers at checkout registers, and transit police.'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-sm">
                    <MessageSquareHeart className="w-5 h-5" />
                    <span>{isSinhala ? 'ඩිජිටල් සීමාවන් සහ ඔන්ලයින් මිතුරන්' : 'Digital Boundaries & Online Friends'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isSinhala
                      ? 'අන්තර්ජාලයේ මිතුරන් ඔවුන් පවසන අය නොවිය හැකි බව මතක් කරන්න. වෙබ්කැමරා, ඡායාරූප සහ සැබෑ පාසලේ හෝ නගරයේ තොරතුරු කිසිවිටෙකත් ඔන්ලයින් නොබෙදා ගැනීමට නීතියක් පනවන්න.'
                      : 'Remind your child that online gamers might not be who they claim. Set a rule that webcams, photos, and real school/town locations are never shared with online players.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PERSONALIZATION & SETUP */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Layer 1: Visual Identity */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-base font-black text-indigo-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
                  <span>{isSinhala ? 'ළමා පැතිකඩ සහ චරිතය' : 'Child Profile & Hero Avatar'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {isSinhala ? 'දරුවාගේ නම' : 'Child Name'}
                    </label>
                    <input
                      type="text"
                      value={editProfile.childName}
                      onChange={(e) => setEditProfile({ ...editProfile, childName: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {isSinhala ? 'වයස් කාණ්ඩය' : 'Age Track'}
                    </label>
                    <select
                      value={editProfile.age}
                      onChange={(e) => setEditProfile({ ...editProfile, age: parseInt(e.target.value, 10) as AgeTrack })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                    >
                      <option value={6}>{isSinhala ? 'වයස 6 (මූලික ළමා ආරක්ෂාව)' : 'Age 6 (Early childhood safety)'}</option>
                      <option value={7}>{isSinhala ? 'වයස 7 (ආගන්තුක උගුල් සහ සීමා ක්‍රීඩා)' : 'Age 7 (Stranger traps & boundary games)'}</option>
                      <option value={8}>{isSinhala ? 'වයස 8 (ප්‍රවාහන සහ ඩිජිටල් පණිවිඩ)' : 'Age 8 (Transit & digital messaging)'}</option>
                      <option value={9}>{isSinhala ? 'වයස 9 (සයිබර් රැවටීම් සහ ස්වාධීනත්වය)' : 'Age 9 (Grooming defense & independence)'}</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Selection (Kai, Mira, Leo, Zara) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">
                    {isSinhala ? 'වීර චරිතය තෝරන්න:' : 'Choose Hero Character:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {AVATAR_CHARACTERS.map((char) => {
                      const isSelected = editProfile.avatarId === char.id;
                      return (
                        <button
                          key={char.id}
                          type="button"
                          onClick={() => setEditProfile({ ...editProfile, avatarId: char.id as any })}
                          className={`p-3 rounded-2xl border-2 flex flex-col items-center space-y-2 transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <CharacterAvatar id={char.id} size="lg" />
                          <div className="text-center">
                            <div className="font-extrabold text-sm text-slate-800">{char.name}</div>
                            <div className="text-[10px] text-slate-500">{char.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Guardian Coach Setup */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-base font-black text-indigo-900 font-['Fredoka',sans-serif]">
                  {isSinhala ? 'භාරකරු සහ පවුලේ මුරපදය' : 'Guardian Coach & Family Password'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {isSinhala ? 'භාරකරුගේ භූමිකාව' : 'Guardian Role'}
                    </label>
                    <select
                      value={editProfile.guardianRole}
                      onChange={(e) => setEditProfile({ ...editProfile, guardianRole: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                    >
                      {GUARDIAN_ROLES.map((g) => (
                        <option key={g.role} value={g.role}>
                          {isSinhala ? (g.role === 'Mum' ? 'අම්මා' : g.role === 'Dad' ? 'තාත්තා' : g.role === 'Grandma' ? 'ආච්චි' : g.role === 'Teacher' ? 'ගුරුතුමිය' : 'පුහුණුකරු') : g.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {isSinhala ? 'පවුලේ ආරක්ෂක මුරපදය' : 'Family Safety Password'}
                    </label>
                    <input
                      type="text"
                      value={editProfile.familyPassword}
                      onChange={(e) => setEditProfile({ ...editProfile, familyPassword: e.target.value })}
                      placeholder="e.g. StarTiger77"
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 font-bold text-amber-950"
                    />
                  </div>
                </div>
              </div>

              {/* Language & Sound Options */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-base font-black text-indigo-900 font-['Fredoka',sans-serif]">
                  {isSinhala ? 'භාෂාව සහ හඬ සැකසුම්' : 'Language & Accessibility (HCI Voice-Led)'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase">
                      {isSinhala ? 'ක්‍රීඩා භාෂාව' : 'Curriculum Language'}
                    </label>
                    <select
                      value={editProfile.language}
                      onChange={(e) => setEditProfile({ ...editProfile, language: e.target.value as LanguageCode })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                    >
                      <option value="en">English (Voice & Text)</option>
                      <option value="si">සිංහල (Sinhala Voice & Text)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-6 pt-5">
                    <label className="flex items-center space-x-2 cursor-pointer font-bold text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={editProfile.voiceEnabled}
                        onChange={(e) => setEditProfile({ ...editProfile, voiceEnabled: e.target.checked })}
                        className="w-5 h-5 rounded text-indigo-600"
                      />
                      <span>{isSinhala ? 'හඬ විස්තරය' : 'Voice Narration'}</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer font-bold text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={editProfile.soundEnabled}
                        onChange={(e) => setEditProfile({ ...editProfile, soundEnabled: e.target.checked })}
                        className="w-5 h-5 rounded text-indigo-600"
                      />
                      <span>{isSinhala ? 'ශබ්ද ප්‍රයෝග' : 'Sound Effects'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save & Reset Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={onResetProgress}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                >
                  {isSinhala ? 'ක්‍රීඩා ප්‍රගතිය මුල සිට සකසන්න' : 'Reset Game Progress'}
                </button>

                <div className="flex items-center space-x-3">
                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center">
                      <Check className="w-4 h-4 mr-1" /> {isSinhala ? 'සැකසුම් සුරකින ලදි!' : 'Settings Saved!'}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="py-3 px-6 rounded-xl font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition hover:scale-102"
                  >
                    {isSinhala ? 'වෙනස්කම් සුරකින්න' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Parent Instructions Pop-Up Modal */}
      <ParentInstructionsModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onStartGame={onClose}
        onOpenSetup={() => {
          setShowGuideModal(false);
          setActiveTab('settings');
        }}
        isSinhala={isSinhala}
      />
    </div>
  );
};
