import React from 'react';
import { ApplicantData, PredictionResult, ThemeMode } from '../../types/credit';
import {
  User,
  DollarSign,
  Briefcase,
  Home,
  Tag,
  Percent,
  History,
  ShieldCheck,
  Edit3,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';

interface FinancialProfileViewProps {
  applicantData: ApplicantData;
  prediction: PredictionResult;
  theme: ThemeMode;
  onEditProfile: () => void;
}

export const FinancialProfileView: React.FC<FinancialProfileViewProps> = ({
  applicantData,
  prediction,
  theme,
  onEditProfile,
}) => {
  const isDark = theme === 'dark';
  const monthlyIncome = applicantData.person_income / 12;
  const loanToIncome = applicantData.person_income > 0
    ? (applicantData.loan_amnt / applicantData.person_income) * 100
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400 mb-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Verified Financial Dossier</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Applicant Financial Profile
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Detailed breakdown of active debt-to-income leverage, credit bureau tenure, and employment stability.
            </p>
          </div>

          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Financial Data</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Personal & Demographic Stability */}
        <div className={`p-6 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Home className="w-4 h-4" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Demographic & Housing
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Applicant Age</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{applicantData.person_age} years old</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Home Ownership</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{applicantData.person_home_ownership}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Housing Risk Tier</span>
              <span className={`font-semibold ${applicantData.person_home_ownership === 'OWN' ? 'text-emerald-600' : 'text-blue-600'}`}>
                {applicantData.person_home_ownership === 'OWN' ? 'Prime Asset Stability' : 'Standard Tenancy'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Income & Employment Capacity */}
        <div className={`p-6 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Income & Employment Capacity
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Annual Gross Income</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">${applicantData.person_income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Estimated Monthly Income</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">${Math.round(monthlyIncome).toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Employment Tenure</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{applicantData.person_emp_length} years continuous</span>
            </div>
          </div>
        </div>

        {/* 3. Loan Facility & Leverage */}
        <div className={`p-6 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Loan Facility & Leverage
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Requested Principal</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">${applicantData.loan_amnt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Loan Interest Rate</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{applicantData.loan_int_rate}% APR</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Loan-to-Income Ratio</span>
              <span className={`font-black ${loanToIncome > 35 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {loanToIncome.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Loan Purpose / Grade</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{applicantData.loan_intent} (Grade {applicantData.loan_grade})</span>
            </div>
          </div>
        </div>

        {/* 4. Credit Bureau Track Record */}
        <div className={`p-6 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Credit Bureau Record
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Credit History Tenure</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{applicantData.cb_person_cred_hist_length} years</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-400">Historical Default On File</span>
              <span className={`font-bold flex items-center gap-1 ${applicantData.cb_person_default_on_file === 'Y' ? 'text-rose-600' : 'text-emerald-600'}`}>
                {applicantData.cb_person_default_on_file === 'Y' ? (
                  <>
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Yes (Derogatory Mark)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>No (Clean File)</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Model Decision Tier</span>
              <span className={`font-bold ${prediction.is_approved ? 'text-emerald-600' : 'text-rose-600'}`}>
                {prediction.risk_tier}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
