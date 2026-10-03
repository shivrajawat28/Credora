import React, { useState, useEffect } from 'react';
import { ModelInfo, ThemeMode } from '../../types/credit';
import { fetchModelInfo } from '../../services/api';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Award,
  Layers,
  Scale,
  BrainCircuit,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface ModelTransparencyViewProps {
  theme: ThemeMode;
  optimalThreshold: number;
}

export const ModelTransparencyView: React.FC<ModelTransparencyViewProps> = ({
  theme,
  optimalThreshold,
}) => {
  const isDark = theme === 'dark';
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    fetchModelInfo()
      .then((info) => setModelInfo(info))
      .catch((err) => console.warn('Could not fetch model info:', err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Underwriting Model Governance & Architecture</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Machine Learning Model Transparency
          </h1>
          <p className={`text-xs sm:text-sm max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Comprehensive architectural specifications, calibrated evaluation metrics on the project benchmark test set, and hyperparameters.
          </p>
        </div>
      </div>

      {/* 1. Evaluation Metrics Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Model Evaluation Metrics (Test Set)
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            Calibrated on Hold-Out Split
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Accuracy', value: '93.1%', desc: 'Overall prediction correctness', sub: '~0.931 on test split' },
            { label: 'Precision', value: '90.8%', desc: 'High approval validity', sub: '~0.908 on positive calls' },
            { label: 'Recall', value: '72.9%', desc: 'Default capture coverage', sub: '~0.729 risk sensitivity' },
            { label: 'F1 Score', value: '0.809', desc: 'Harmonic balance metric', sub: '~0.809 balanced F1' },
          ].map((m, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 tracking-tight">
                {m.value}
              </div>
              <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {m.label}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
              <div className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Model Architecture & Hyperparameters */}
      <section className={`p-6 sm:p-8 rounded-3xl border ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="space-y-1 mb-6">
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Model Architecture & Tuned Hyperparameters
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Tuned Random Forest with probability calibration applied via CalibratedClassifierCV.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {[
            { param: 'Model Estimator', val: 'RandomForestClassifier' },
            { param: 'n_estimators', val: '491 trees' },
            { param: 'max_depth', val: '14' },
            { param: 'min_samples_leaf', val: '3' },
            { param: 'min_samples_split', val: '18' },
            { param: 'max_features', val: 'None (all features)' },
            { param: 'class_weight', val: 'balanced' },
            { param: 'Calibration', val: 'Sigmoid / Isotonic' },
            { param: 'Decision Threshold', val: `${optimalThreshold} (Optimal F1)` },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-slate-400 font-sans text-xs">{item.param}:</span>
              <span className="font-bold text-blue-600 dark:text-cyan-400">{item.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Global Top 10 Feature Importances */}
      {modelInfo && modelInfo.global_feature_importances && (
        <section className={`p-6 sm:p-8 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="space-y-1 mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Global Gini Feature Importances
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Average reduction in impurity across all 491 decision trees.
            </p>
          </div>

          <div className="space-y-3">
            {modelInfo.global_feature_importances.slice(0, 8).map((feat, idx) => {
              const maxVal = modelInfo.global_feature_importances[0].importance;
              const barWidth = (feat.importance / maxVal) * 100;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-800/40 border-slate-700/40' : 'bg-slate-50 border-slate-200/60'
                  }`}
                >
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                      {feat.label}
                    </span>
                    <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">
                      {feat.importance_percent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Model Governance & Compliance */}
      <section className={`p-6 rounded-3xl border flex items-start gap-4 ${
        isDark ? 'bg-blue-950/20 border-blue-800/40 text-slate-300' : 'bg-blue-50/70 border-blue-200 text-blue-900'
      }`}>
        <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold">Algorithmic Governance & Responsible Lending</h4>
          <p className="leading-relaxed">
            This model adheres to fair lending transparency standards by exposing exact Shapley additive explanations for every score. The evaluation metrics represent historical benchmark testing and do not substitute human underwriting oversight or official credit bureau reporting.
          </p>
        </div>
      </section>

    </div>
  );
};
