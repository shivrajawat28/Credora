import React from 'react';
import {
  LayoutDashboard,
  BrainCircuit,
  Sparkles,
  UserCheck,
  History,
  Cpu,
  BookOpen,
  ShieldCheck,
  X,
  Home,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { NavTab, ThemeMode } from '../../types/credit';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  theme: ThemeMode;
  optimalThreshold: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpenMobile,
  onCloseMobile,
  theme,
  optimalThreshold,
}) => {
  const isDark = theme === 'dark';

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home / Overview', icon: Home },
    { id: 'dashboard', label: 'Loan Dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'Loan Assessment', icon: BrainCircuit, badge: '5-Step' },
    { id: 'explanation', label: 'AI Explanation (SHAP)', icon: Sparkles },
    { id: 'profile', label: 'Financial Profile', icon: UserCheck },
    { id: 'history', label: 'Prediction History', icon: History },
    { id: 'transparency', label: 'Model Transparency', icon: Cpu },
    { id: 'education', label: 'Credit Education', icon: BookOpen },
  ];

  const handleNavClick = (tab: NavTab) => {
    setCurrentTab(tab);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] flex flex-col justify-between transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark
            ? 'bg-slate-900 border-r border-slate-800 text-slate-300'
            : 'bg-white border-r border-slate-200 text-slate-700 shadow-sm'
        }`}
      >
        {/* Top Brand Logo Area */}
        <div className="p-5 border-b border-inherit">
          <div className="flex items-center justify-between">
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-extrabold text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Credora
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-cyan-400 dark:border-blue-800">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Loan Intelligence Platform
                </p>
              </div>
            </div>

            {/* Close Button for Mobile */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Middle Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-cyan-300 font-bold shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Status Box */}
        <div className="p-4 border-t border-inherit">
          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Model Status
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Random Forest (Calibrated)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Threshold: {optimalThreshold} (Optimal F1)
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
