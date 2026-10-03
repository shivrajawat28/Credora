import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { NavTab, ThemeMode, DemoProfile } from '../../types/credit';

interface TopNavProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  onOpenMobileSidebar: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  demoProfiles: DemoProfile[];
  onSelectDemoProfile: (profile: DemoProfile) => void;
  hasPrediction: boolean;
  approvalPercentage?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenMobileSidebar,
  theme,
  onToggleTheme,
  demoProfiles,
  onSelectDemoProfile,
  hasPrediction,
  approvalPercentage,
}) => {
  const isDark = theme === 'dark';
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  const getPageTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'Home & Product Vision';
      case 'dashboard':
        return 'Loan Assessment Dashboard';
      case 'assessment':
        return 'Loan Assessment Form';
      case 'application':
        return 'Application Review';
      case 'explanation':
        return 'Explainable AI & SHAP';
      case 'profile':
        return 'Applicant Financial Profile';
      case 'history':
        return 'Prediction History';
      case 'transparency':
        return 'Model Transparency & Performance';
      case 'education':
        return 'Credit Education & Guide';
      default:
        return 'Loan Intelligence Portal';
    }
  };

  return (
    <header className={`sticky top-0 z-30 h-16 border-b backdrop-blur-md transition-colors ${
      isDark
        ? 'bg-slate-900/90 border-slate-800 text-slate-100'
        : 'bg-white/90 border-slate-200 text-slate-800'
    }`}>
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight">
              {getPageTitle()}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <span>Credora Banking</span>
              <span>/</span>
              <span className="capitalize">{currentTab}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Demo Profiles Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">Demo Profiles</span>
              <span className="sm:hidden">Profiles</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isDemoDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl p-2 z-50 animate-fadeIn ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-inherit mb-1">
                  Load Preset Applicant
                </div>
                {demoProfiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectDemoProfile(p);
                      setIsDemoDropdownOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-800 dark:text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.subtitle}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Probability Indicator Pill (if assessed) */}
          {hasPrediction && approvalPercentage !== undefined && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-cyan-300 dark:border-blue-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{approvalPercentage}% Approval Est.</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={isDark ? 'Switch to Light Banking Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Officer Profile Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold leading-none text-slate-800 dark:text-slate-200">
                Loan Officer
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                Underwriting Desk
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
