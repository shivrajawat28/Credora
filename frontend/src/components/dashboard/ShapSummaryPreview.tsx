import React from 'react';
import { ShapAnalysis, ThemeMode } from '../../types/credit';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface ShapSummaryPreviewProps {
  shapAnalysis: ShapAnalysis;
  theme: ThemeMode;
  onViewFullExplanation: () => void;
}

export const ShapSummaryPreview: React.FC<ShapSummaryPreviewProps> = ({
  shapAnalysis,
  theme,
  onViewFullExplanation,
}) => {
  const isDark = theme === 'dark';
  const supporting = shapAnalysis.supporting_factors || [];
  const opposing = shapAnalysis.opposing_factors || [];

  return (
    <div className={`p-6 rounded-3xl border transition-all ${
      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
    }`}>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable AI Attribution</span>
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why did the model make this prediction?
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Overview of the strongest factors influencing your loan approval likelihood.
          </p>
        </div>

        <button
          onClick={onViewFullExplanation}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
        >
          <span>Explore Interactive SHAP Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Factors Supporting Approval */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Factors Supporting Approval</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-600">
              +{supporting.length} Drivers
            </span>
          </div>

          <div className="space-y-2.5">
            {supporting.slice(0, 3).map((item, idx) => {
              const barWidth = Math.min(100, Math.max(15, item.magnitude * 500));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>
                      {item.label} <span className="text-slate-400">({item.display_val})</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +{item.approval_contribution.toFixed(4)}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {supporting.length === 0 && (
              <p className="text-xs text-slate-400 italic">No significant positive factors detected.</p>
            )}
          </div>
        </div>

        {/* Factors Working Against Approval */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-rose-950/20 border-rose-500/20' : 'bg-rose-50/50 border-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>Factors Working Against Approval</span>
            </span>
            <span className="text-[11px] font-bold text-rose-600">
              {opposing.length} Risk Drivers
            </span>
          </div>

          <div className="space-y-2.5">
            {opposing.slice(0, 3).map((item, idx) => {
              const barWidth = Math.min(100, Math.max(15, item.magnitude * 500));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>
                      {item.label} <span className="text-slate-400">({item.display_val})</span>
                    </span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {item.approval_contribution.toFixed(4)}
                    </span>
                  </div>
                  <div className="w-full bg-rose-200/50 dark:bg-rose-900/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {opposing.length === 0 && (
              <p className="text-xs text-slate-400 italic">No significant negative factors detected.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
