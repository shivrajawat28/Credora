import React from 'react';
import { ThemeMode } from '../../types/credit';
import {
  BookOpen,
  TrendingUp,
  Percent,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Scale,
  BrainCircuit,
} from 'lucide-react';

interface CreditEducationViewProps {
  theme: ThemeMode;
  onStartAssessment: () => void;
}

export const CreditEducationView: React.FC<CreditEducationViewProps> = ({
  theme,
  onStartAssessment,
}) => {
  const isDark = theme === 'dark';

  const topics = [
    {
      title: 'Loan-to-Income (LTI) Ratio',
      subtitle: 'The primary leverage indicator in underwriting',
      desc: 'LTI measures what proportion of your gross annual income the requested loan amount represents. Models strongly penalize loan amounts exceeding 35%–40% of annual salary due to debt servicing constraints.',
      icon: Percent,
      color: 'text-blue-600 dark:text-cyan-400',
    },
    {
      title: 'Loan Grades & Interest Rates',
      subtitle: 'How risk tiers dictate borrowing costs',
      desc: 'Prime grades (A & B) reflect established low-risk histories with lower default probability and rates under 10%. Subprime grades (E, F, G) reflect higher default rates and carry elevated interest expense.',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Credit History Longevity',
      subtitle: 'Why credit age provides underwriting reassurance',
      desc: 'A lengthy credit history (5+ years) demonstrates resilience across economic cycles. Machine learning models reward longer credit tenure because it establishes proven repayment behavior.',
      icon: Scale,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Explainable AI & Shapley Values',
      subtitle: 'Preventing opaque black-box credit decisions',
      desc: 'TreeSHAP guarantees fair mathematical attribution: every feature is assigned a numerical contribution showing whether it supported or opposed loan approval, fostering total algorithmic transparency.',
      icon: BrainCircuit,
      color: 'text-teal-600 dark:text-teal-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Borrower Financial Literacy & Underwriting Principles</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Credit Intelligence & Underwriting Guide
          </h1>
          <p className={`text-xs sm:text-sm max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Learn how machine learning models assess credit risk, evaluate loan-to-income ratios, and calculate approval likelihood.
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center font-bold">
                  <Icon className={`w-5 h-5 ${t.color}`} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {t.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {t.subtitle}
                  </span>
                </div>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Call to Action Box */}
      <div className={`p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/15'
      }`}>
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-bold text-white">
            Ready to test your loan eligibility?
          </h3>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            Run the 5-step assessment to receive an instant machine-learning prediction and detailed factor attribution.
          </p>
        </div>

        <button
          onClick={onStartAssessment}
          className="shrink-0 px-6 py-3.5 rounded-xl font-semibold text-xs bg-white text-blue-900 hover:bg-blue-50 transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
