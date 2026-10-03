import React from 'react';
import { Shield, Sparkles, Cpu, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-md mt-24 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs">
        
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-200">CrediVantage Financial Intelligence</p>
            <p className="text-slate-500">Calibrated Random Forest (Sigmoid) • TreeSHAP Explainability</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>96.38% ROC-AUC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exact Local Attribution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Client-side Privacy Preserved</span>
          </div>
        </div>

        <p className="text-slate-500 text-center md:text-right">
          Built for explainable AI credit underwriting & paired decision making.
        </p>

      </div>
    </footer>
  );
};
