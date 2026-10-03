import React from 'react';
import {
  PredictionResponse,
  ApplicantData,
  ThemeMode,
} from '../../types/credit';
import { PredictionHeroCard } from './PredictionHeroCard';
import { FinancialIndicatorsCard } from './FinancialIndicatorsCard';
import { ShapSummaryPreview } from './ShapSummaryPreview';
import {
  PlusCircle,
  Sparkles,
  FileText,
  Sliders,
  History,
  ShieldCheck,
} from 'lucide-react';

interface MainDashboardProps {
  predictionResponse: PredictionResponse;
  applicantData: ApplicantData;
  theme: ThemeMode;
  onStartNewAssessment: () => void;
  onNavigateToExplanation: () => void;
  onNavigateToProfile: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  predictionResponse,
  applicantData,
  theme,
  onStartNewAssessment,
  onNavigateToExplanation,
  onNavigateToProfile,
}) => {
  const isDark = theme === 'dark';
  const { prediction, applicant_summary, shap_analysis } = predictionResponse;

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      
      {/* 1. Welcome Section & Quick Action Bar */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 text-slate-200'
          : 'bg-white border-slate-200/80 shadow-sm text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Loan Underwriting Portal
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs font-mono font-medium text-blue-600 dark:text-cyan-400">
                Ref: #APP-{applicantData.person_age}{applicantData.loan_amnt.toString().slice(0, 3)}
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Loan Assessment Overview
            </h1>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time model prediction, approval likelihood, and TreeSHAP explainability breakdown.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartNewAssessment}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Loan Application</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary Large Result Card */}
      <PredictionHeroCard
        prediction={prediction}
        theme={theme}
        onViewExplanation={onNavigateToExplanation}
        onNewAssessment={onStartNewAssessment}
      />

      {/* 3. Key Financial Indicators */}
      <FinancialIndicatorsCard
        summary={applicant_summary}
        theme={theme}
      />

      {/* 4. SHAP Summary Preview Section */}
      <ShapSummaryPreview
        shapAnalysis={shap_analysis}
        theme={theme}
        onViewFullExplanation={onNavigateToExplanation}
      />

    </div>
  );
};
