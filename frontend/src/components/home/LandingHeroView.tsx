import React from 'react';
import {
  ShieldCheck,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Sliders,
  Scale,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ThemeMode, NavTab } from '../../types/credit';
import { BankingHeroVisual } from '../3d/BankingHeroVisual';

interface LandingHeroViewProps {
  theme: ThemeMode;
  onNavigateTab: (tab: NavTab) => void;
}

export const LandingHeroView: React.FC<LandingHeroViewProps> = ({
  theme,
  onNavigateTab,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-16 pb-16 animate-fadeIn">
      
      {/* 1. HERO SECTION */}
      <section className={`relative overflow-hidden rounded-3xl border transition-all ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800 shadow-2xl'
          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/50 border-slate-200/80 shadow-xl shadow-slate-200/40'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
              isDark
                ? 'bg-blue-500/10 text-cyan-400 border-blue-500/20'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Next-Gen Machine Learning Underwriting</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Smarter Loan Decisions,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">
                Powered by AI.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Understand your loan approval prediction and the financial factors influencing the model's decision with game-theoretic SHAP explainability.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateTab('assessment')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Check Loan Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
                }`}
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Micro Feature Bullets */}
            <div className={`pt-4 border-t grid grid-cols-3 gap-4 text-xs font-medium ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Calibrated Random Forest</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>TreeSHAP Attribution</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Fake Scoring</span>
              </div>
            </div>

          </div>

          {/* Right 3D Visual Column */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <BankingHeroVisual theme={theme} />
          </div>

        </div>
      </section>

      {/* 2. STATS / MODEL METRICS SUMMARY BANNER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Model Test Accuracy', value: '93.1%', desc: 'Tuned Random Forest on test split' },
          { label: 'Precision Rating', value: '90.8%', desc: 'High confidence on approval calls' },
          { label: 'Evaluation F1-Score', value: '0.809', desc: 'Balanced risk-weighted metric' },
          { label: 'XAI Explainability', value: '100% SHAP', desc: 'Exact mathematical feature attribution' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-white border-slate-200/80 shadow-sm'
            }`}
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-cyan-400 tracking-tight">
              {stat.value}
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {stat.label}
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {stat.desc}
            </div>
          </div>
        ))}
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            <span>Rigorous Decision Architecture</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How the Lending Intelligence Engine Works
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Our multi-step evaluation combines calibrated statistical modeling with local and global explainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Enter Financial Profile',
              desc: 'Provide your verified annual income, employment tenure, requested loan amount, interest rate, and credit history length.',
              icon: Sliders,
            },
            {
              step: '02',
              title: 'Calibrated RF Prediction',
              desc: 'Our 491-tree Random Forest classifier evaluates multi-dimensional risk interactions against the project benchmark dataset.',
              icon: BrainCircuit,
            },
            {
              step: '03',
              title: 'TreeSHAP Attribution',
              desc: 'Shapley values quantify the exact numerical contribution of each feature towards the model prediction.',
              icon: TrendingUp,
            },
            {
              step: '04',
              title: 'Transparent Decision',
              desc: 'Receive your predicted approval likelihood, application summary, and interactive factor-by-factor breakdown.',
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`relative p-6 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-800">
                    {item.step}
                  </span>
                </div>
                <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TRUST & SECURITY CALLOUT */}
      <section className={`p-8 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-6 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-200'
          : 'bg-blue-900 text-white shadow-xl shadow-blue-900/20'
      }`}>
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-wider uppercase">
            <Lock className="w-4 h-4" />
            <span>Institutional Financial Ethics & Compliance</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Transparent AI Without Black-Box Ambiguity
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
            Every prediction is supported by mathematical Shapley feature attributions. We clearly disclose that model predictions reflect statistical likelihoods and do not guarantee final lending commitments.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('assessment')}
          className="shrink-0 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white text-blue-900 hover:bg-blue-50 transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <span>Start Assessment</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
