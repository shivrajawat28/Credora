import React from 'react';
import { ShieldCheck, BrainCircuit, FileSpreadsheet, Info, Activity } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'assessment' | 'results';
  setCurrentView: (view: 'home' | 'assessment' | 'results') => void;
  openBatchModal: () => void;
  openTransparencyModal: () => void;
  hasResults: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openBatchModal,
  openTransparencyModal,
  hasResults,
}) => {
  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-4">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                CrediVantage
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                AI 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Calibrated Credit Scoring & SHAP Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              currentView === 'home'
                ? 'bg-white/10 text-cyan-400 shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setCurrentView('assessment')}
            className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'assessment'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Credit Check</span>
          </button>

          {hasResults && (
            <button
              onClick={() => setCurrentView('results')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'results'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Results & SHAP</span>
            </button>
          )}

          <div className="h-5 w-px bg-white/10 mx-1 hidden md:block" />

          {/* Batch Portfolio Modal trigger */}
          <button
            onClick={openBatchModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-all"
            title="Upload CSV dataset for batch scoring"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Batch CSV</span>
          </button>

          {/* Model Transparency Modal trigger */}
          <button
            onClick={openTransparencyModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-all"
            title="Model Architecture & Calibration Insights"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Model Info</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
