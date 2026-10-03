import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const LoadingAnalysisState: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<number>(0);

  const stages = [
    { title: 'Reviewing financial profile', desc: 'Validating income, employment tenure, and housing stability...' },
    { title: 'Evaluating loan characteristics', desc: 'Analyzing requested amount, interest rate, and debt-to-income leverage...' },
    { title: 'Running ML prediction', desc: 'Executing 491-tree Calibrated Random Forest model...' },
    { title: 'Generating SHAP explanation', desc: 'Computing game-theoretic Shapley feature attributions...' },
    { title: 'Preparing your result', desc: 'Synthesizing decision tier and transparent factor breakdown...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-8 animate-fadeIn">
      
      {/* Animated Center Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
          <BrainCircuit className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Underwriting Engine In Progress</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Analyzing Your Loan Application
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Please wait while our explainable AI evaluates your credit profile against historical underwriting models.
        </p>
      </div>

      {/* Progressive Stage List */}
      <div className="space-y-3 text-left max-w-md mx-auto">
        {stages.map((stage, idx) => {
          const isDone = currentStage > idx;
          const isCurrent = currentStage === idx;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                isCurrent
                  ? 'bg-blue-50/80 border-blue-500/40 dark:bg-blue-950/40 dark:border-blue-500/40'
                  : isDone
                  ? 'bg-slate-50/60 border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800'
                  : 'opacity-40 border-transparent'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className={`text-xs font-bold ${
                  isCurrent
                    ? 'text-blue-900 dark:text-cyan-300'
                    : isDone
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400'
                }`}>
                  {stage.title}
                </div>
                {isCurrent && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 animate-fadeIn">
                    {stage.desc}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
        />
      </div>

    </div>
  );
};
