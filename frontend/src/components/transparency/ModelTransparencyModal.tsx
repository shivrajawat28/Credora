import React from 'react';
import { X, Brain, CheckCircle2, Sliders, LineChart, Sparkles, Cpu } from 'lucide-react';

interface ModelTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelTransparencyModal: React.FC<ModelTransparencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Model Architecture & Explainability</h2>
              <p className="text-xs text-slate-400">Tuned Random Forest + Platt Sigmoid Calibration + TreeSHAP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-6 space-y-6 text-xs sm:text-sm text-slate-300 flex-1">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">ROC-AUC Score</span>
              <strong className="text-xl font-mono text-cyan-300">96.38%</strong>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Optimal F1</span>
              <strong className="text-xl font-mono text-emerald-400">84.75%</strong>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Accuracy</span>
              <strong className="text-xl font-mono text-indigo-300">93.20%</strong>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Inference Time</span>
              <strong className="text-xl font-mono text-amber-300">~16 ms</strong>
            </div>
          </div>

          {/* Pipeline Step Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">
              End-to-End Pipeline
            </h4>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <strong className="text-white block">Feature Preprocessing (ColumnTransformer)</strong>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Median imputation for 7 numerical features and constant imputation + one-hot encoding for 4 categorical columns resulting in 26 transformed dimensions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <strong className="text-white block">Ensemble Learning (RandomForestClassifier)</strong>
                  <p className="text-slate-400 text-xs mt-0.5">
                    491 decision trees tuned with <code>max_depth=14</code>, <code>min_samples_split=18</code>, and balanced class weights to penalize default misclassifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <strong className="text-white block">Platt Sigmoid Calibration (CalibratedClassifierCV)</strong>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Standard random forests often predict overconfident probabilities. Sigmoid calibration with 5-fold cross validation aligns probabilities with true statistical loss likelihoods.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <div>
                  <strong className="text-white block">Explainability Engine (TreeSHAP)</strong>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Computes exact Shapley additive explanations in polynomial time, quantifying how each feature pushed the baseline risk higher (+) or lower (-).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FICO Mapping Formula */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
            <strong className="text-white block mb-1">Credit Score Calibration Formula:</strong>
            <code>Credit Score = 850 - int(Default_Probability * 550)</code> clamped to [300, 850].
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
