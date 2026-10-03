import React, { useState, useEffect } from 'react';
import { PredictionResult, ThemeMode } from '../../types/credit';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  Percent,
  TrendingUp,
} from 'lucide-react';

interface PredictionHeroCardProps {
  prediction: PredictionResult;
  theme: ThemeMode;
  onViewExplanation: () => void;
  onNewAssessment: () => void;
}

export const PredictionHeroCard: React.FC<PredictionHeroCardProps> = ({
  prediction,
  theme,
  onViewExplanation,
  onNewAssessment,
}) => {
  const isDark = theme === 'dark';
  const isApproved = prediction.is_approved;
  const approvalPercent = prediction.approval_percentage;
  const defaultPercent = prediction.default_percentage;

  // Animated Count-up for Probability
  const [animatedProb, setAnimatedProb] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedProb(Number((start + (approvalPercent - start) * ease).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [approvalPercent]);

  // Semicircle stroke calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Semicircle arc is half of circumference
  const arcLength = circumference / 2;
  const strokeDashoffset = arcLength - (arcLength * (animatedProb / 100));

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all relative overflow-hidden ${
      isDark
        ? isApproved
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/30 shadow-2xl'
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border-rose-500/30 shadow-2xl'
        : isApproved
        ? 'bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 border-emerald-200 shadow-xl shadow-emerald-500/5'
        : 'bg-gradient-to-br from-white via-slate-50 to-rose-50/40 border-rose-200 shadow-xl shadow-rose-500/5'
    }`}>
      
      {/* Top Header Tag & Decision Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calibrated Random Forest Evaluation</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>{prediction.decision}</span>
            {isApproved ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
          </h2>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase border shadow-sm ${
            isApproved
              ? 'bg-emerald-500 text-white border-emerald-400'
              : 'bg-rose-500 text-white border-rose-400'
          }`}>
            {prediction.badge}
          </span>
        </div>
      </div>

      {/* Center Body: Radial Gauge & Metrics Breakdown */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Radial Probability Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            
            {/* SVG Semicircle / Circular Progress */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`stroke-current ${isDark ? 'text-slate-800' : 'text-slate-200'}`}
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`transition-all duration-700 ${isApproved ? 'text-emerald-500' : 'text-rose-500'}`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * (animatedProb / 100))}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-black tracking-tight ${
                isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {animatedProb}%
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                Approval Likelihood
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold mt-2">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Safe: {approvalPercent}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Default Risk: {defaultPercent}%</span>
            </div>
          </div>
        </div>

        {/* Right Underwriting Decision & Recommendation */}
        <div className="md:col-span-7 space-y-4">
          
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Risk Classification</span>
              <span className={`font-bold ${isApproved ? 'text-emerald-600' : 'text-rose-600'}`}>
                {prediction.risk_tier}
              </span>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {prediction.recommendation}
            </p>
          </div>

          {/* Model Natural Language Insights */}
          {prediction.insights && prediction.insights.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Key Contributing Insights:
              </span>
              <div className="space-y-1.5">
                {prediction.insights.map((insight, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                      isDark ? 'bg-slate-800/40 border-slate-700/40 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onViewExplanation}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Why did the model predict this?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onNewAssessment}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Assessment</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mandatory Disclaimer Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Model Notice:</strong> {prediction.disclaimer}
        </p>
      </div>

    </div>
  );
};
