import React, { useState, useEffect } from 'react';
import {
  ShapAnalysis,
  PredictionResult,
  ShapContribution,
  ThemeMode,
  ModelInfo,
} from '../../types/credit';
import { fetchModelInfo } from '../../services/api';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Layers,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X,
  Scale,
  BrainCircuit,
} from 'lucide-react';

interface AIExplanationViewProps {
  shapAnalysis: ShapAnalysis;
  prediction: PredictionResult;
  theme: ThemeMode;
}

export const AIExplanationView: React.FC<AIExplanationViewProps> = ({
  shapAnalysis,
  prediction,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'local' | 'global'>('local');
  const [selectedFeature, setSelectedFeature] = useState<ShapContribution | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState<boolean>(false);

  const supporting = shapAnalysis.supporting_factors || [];
  const opposing = shapAnalysis.opposing_factors || [];
  const allContributions = shapAnalysis.all_contributions || [];

  // Load Global Model Metadata & Importances
  useEffect(() => {
    setIsLoadingGlobal(true);
    fetchModelInfo()
      .then((info) => setModelInfo(info))
      .catch((err) => console.warn('Could not load global model info:', err))
      .finally(() => setIsLoadingGlobal(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* 1. Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Game-Theoretic SHAP Engine</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Why did the model make this prediction?
            </h1>
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              See which financial and credit factors contributed most to the model's decision using exact Shapley additive explanations (TreeSHAP).
            </p>
          </div>

          {/* Local vs Global Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('local')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'local'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Local Explanation (This Application)</span>
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'global'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Global Explanation (Overall Model)</span>
            </button>
          </div>
        </div>

        {/* Prediction Summary Strip */}
        <div className={`mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs`}>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Application Outcome:</span>
            <span className={`font-bold ${prediction.is_approved ? 'text-emerald-600' : 'text-rose-600'}`}>
              {prediction.decision}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Approval Probability:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {prediction.approval_percentage}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Base Expected Value:</span>
            <span className="font-mono font-semibold text-slate-500">
              {shapAnalysis.base_value.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTENT */}
      {activeTab === 'local' ? (
        <div className="space-y-6">
          
          {/* Supporting vs Opposing Factors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 2A. Factors Supporting Approval */}
            <div className={`p-6 rounded-3xl border transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>Factors Supporting Prediction</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  +{supporting.length} Positive Drivers
                </span>
              </div>

              <div className="space-y-3">
                {supporting.map((item, idx) => {
                  const maxMag = Math.max(...allContributions.map((c) => c.magnitude), 0.01);
                  const barWidth = Math.min(100, Math.max(12, (item.magnitude / maxMag) * 100));
                  const isSelected = selectedFeature?.feature_id === item.feature_id;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedFeature(item)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40 dark:border-emerald-400'
                          : isDark
                          ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80'
                          : 'bg-slate-50/70 border-slate-200/70 hover:bg-emerald-50/40 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-normal">
                            Value: <strong className="text-slate-700 dark:text-slate-300">{item.display_val}</strong>
                          </span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            +{item.approval_contribution.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {supporting.length === 0 && (
                  <p className="text-xs text-slate-400 italic p-4 text-center">
                    No positive drivers observed for this credit profile.
                  </p>
                )}
              </div>
            </div>

            {/* 2B. Factors Working Against Approval */}
            <div className={`p-6 rounded-3xl border transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm uppercase tracking-wider">
                  <TrendingDown className="w-4 h-4" />
                  <span>Factors Working Against Prediction</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {opposing.length} Risk Factors
                </span>
              </div>

              <div className="space-y-3">
                {opposing.map((item, idx) => {
                  const maxMag = Math.max(...allContributions.map((c) => c.magnitude), 0.01);
                  const barWidth = Math.min(100, Math.max(12, (item.magnitude / maxMag) * 100));
                  const isSelected = selectedFeature?.feature_id === item.feature_id;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedFeature(item)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 dark:bg-rose-950/40 dark:border-rose-400'
                          : isDark
                          ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80'
                          : 'bg-slate-50/70 border-slate-200/70 hover:bg-rose-50/40 hover:border-rose-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-normal">
                            Value: <strong className="text-slate-700 dark:text-slate-300">{item.display_val}</strong>
                          </span>
                          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                            {item.approval_contribution.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {opposing.length === 0 && (
                  <p className="text-xs text-slate-400 italic p-4 text-center">
                    No negative risk drivers observed for this credit profile.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* 3. Interactive Feature Details Modal / Drawer */}
          {selectedFeature && (
            <div className={`p-6 rounded-3xl border transition-all animate-fadeIn ${
              isDark
                ? 'bg-slate-900 border-blue-500/40 shadow-2xl'
                : 'bg-blue-50/60 border-blue-300 shadow-lg shadow-blue-500/5'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-blue-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Feature Deep Dive: {selectedFeature.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                    Your Submitted Value
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {selectedFeature.display_val}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                    Model Contribution
                  </span>
                  <span className={`text-sm font-mono font-black ${
                    selectedFeature.approval_contribution > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {selectedFeature.approval_contribution > 0 ? '+' : ''}{selectedFeature.approval_contribution.toFixed(4)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                    Direction of Impact
                  </span>
                  <span className={`font-bold ${
                    selectedFeature.approval_contribution > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {selectedFeature.approval_contribution > 0 ? 'Supports Approval' : 'Increases Default Risk'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 sm:col-span-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                    SHAP Methodology
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    Shapley Feature Attribution
                  </span>
                </div>
              </div>

              {/* Data Science Causality Disclaimer */}
              <div className="mt-4 p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ℹ️ <strong>Data Science Note:</strong> The model assigned a {selectedFeature.approval_contribution > 0 ? 'positive' : 'negative'} contribution to <strong>{selectedFeature.label}</strong> for this specific loan application. <em>SHAP values explain mathematical model behavior across tree partitions, not real-world physical causality.</em>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* GLOBAL EXPLANATION VIEW */
        <div className="space-y-6 animate-fadeIn">
          <div className={`p-6 rounded-3xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className="space-y-1 mb-6">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Global Model Feature Importances
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                What factors generally influence the loan decision model across all applicants? Computed directly from the 491-tree Random Forest classifier.
              </p>
            </div>

            {modelInfo ? (
              <div className="space-y-3">
                {modelInfo.global_feature_importances.map((item, idx) => {
                  const maxImp = modelInfo.global_feature_importances[0].importance;
                  const barWidth = (item.importance / maxImp) * 100;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200/60'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">
                            {item.importance_percent}% relative weight
                          </span>
                          <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
                            {item.importance.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">Loading global model metrics...</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
