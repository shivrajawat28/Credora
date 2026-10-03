import React from 'react';
import { FinancialOrb } from '../3d/FinancialOrb';
import { ArrowRight, Sparkles, CheckCircle2, Cpu, BarChart3, HelpCircle } from 'lucide-react';

interface HeroSectionProps {
  onStartAssessment: () => void;
  onScrollToHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAssessment,
  onScrollToHowItWorks,
}) => {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Headline & Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6 shadow-sm shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Explainable AI Risk Engine (TreeSHAP)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300 font-mono">v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Understand Your Credit.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Powered by AI.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8 font-normal">
            Get an enterprise-grade calibrated assessment of your credit profile. Unlike legacy black-box credit models, CrediVantage breaks down <strong className="text-cyan-300 font-semibold">exact mathematical SHAP contributions</strong> for every single decision.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
            <button
              onClick={onStartAssessment}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Check My Credit Score</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onScrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 font-semibold text-sm sm:text-base hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Key Validation Points */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 w-full">
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>96.38% ROC-AUC Accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Calibrated Random Forest</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Real-Time TreeSHAP</span>
            </div>
          </div>

        </div>

        {/* Right 3D Visualizer Orb */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="w-full max-w-[420px] bg-slate-900/40 rounded-3xl border border-white/10 p-4 backdrop-blur-sm shadow-2xl relative group">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>MODEL ACTIVE</span>
            </div>
            
            <FinancialOrb />

            <div className="mt-2 text-center text-xs text-slate-400 font-medium">
              Hover & drag to interact with the multi-dimensional credit core
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
