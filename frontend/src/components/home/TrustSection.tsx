import React from 'react';
import { Check, X, ShieldAlert, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

export const TrustSection: React.FC<{ onStartAssessment: () => void }> = ({ onStartAssessment }) => {
  return (
    <section className="py-20 border-t border-white/5 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Explainable AI (XAI)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Don't just get a score. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Understand exactly why.
            </span>
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Most credit evaluation algorithms are opaque black boxes. CrediVantage uses game-theoretic TreeSHAP to provide absolute transparency.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Legacy Box */}
          <div className="rounded-3xl bg-slate-900/40 border border-red-500/20 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Legacy Black-Box Scoring</h3>
                  <p className="text-xs text-slate-500">Traditional Lending Algorithms</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Only returns a single arbitrary number without mathematical rationale.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>No actionable steps explaining how to improve or qualify for lower rates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Uncalibrated default probabilities that misrepresent actual statistical risk.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Susceptible to hidden proxy biases with zero explainability audits.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-slate-500 text-xs font-mono">
              STATUS: Opaque & High Uncertainty
            </div>
          </div>

          {/* CrediVantage Box */}
          <div className="rounded-3xl bg-gradient-to-b from-cyan-950/40 to-slate-900/80 border border-cyan-500/30 p-8 flex flex-col justify-between shadow-xl shadow-cyan-950/20 relative">
            
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
              RECOMMENDED
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">CrediVantage Calibrated SHAP</h3>
                  <p className="text-xs text-cyan-400">Auditable & Transparent AI Underwriting</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Granular TreeSHAP attributions:</strong> Discover exact delta (+/-) of each feature.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Live Sensitivity Simulator:</strong> Tweak salary or loan amount to see real-time score shifts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Platt Sigmoid Calibration:</strong> Probabilities align with true financial loss rates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dynamic Threshold Controller:</strong> Adjust underwriting risk tolerance ($0.05 - 0.95$).</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-cyan-500/20 flex items-center justify-between">
              <span className="text-cyan-300 text-xs font-mono font-semibold">STATUS: 100% Mathematically Transparent</span>
              <button
                onClick={onStartAssessment}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
              >
                Test Your Profile &rarr;
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
