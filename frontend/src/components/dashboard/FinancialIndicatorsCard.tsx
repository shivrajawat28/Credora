import React from 'react';
import { ApplicantSummary, ThemeMode } from '../../types/credit';
import {
  DollarSign,
  TrendingUp,
  Percent,
  History,
  Briefcase,
  Home,
  Tag,
  Award,
} from 'lucide-react';

interface FinancialIndicatorsCardProps {
  summary: ApplicantSummary;
  theme: ThemeMode;
}

export const FinancialIndicatorsCard: React.FC<FinancialIndicatorsCardProps> = ({
  summary,
  theme,
}) => {
  const isDark = theme === 'dark';

  const indicators = [
    {
      label: 'Annual Income',
      value: `$${summary.person_income.toLocaleString()}`,
      sub: 'Gross earned income',
      icon: DollarSign,
      color: 'text-blue-600 dark:text-cyan-400',
    },
    {
      label: 'Requested Loan',
      value: `$${summary.loan_amnt.toLocaleString()}`,
      sub: `Grade ${summary.loan_grade} credit facility`,
      icon: Tag,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Interest Rate',
      value: `${summary.loan_int_rate}%`,
      sub: 'Annual APR percentage',
      icon: Percent,
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Loan-to-Income',
      value: `${(summary.loan_percent_income * 100).toFixed(1)}%`,
      sub: summary.loan_percent_income > 0.35 ? 'Elevated leverage' : 'Conservative ratio',
      icon: TrendingUp,
      color: summary.loan_percent_income > 0.35 ? 'text-rose-600' : 'text-emerald-600',
    },
    {
      label: 'Credit History',
      value: `${summary.cb_person_cred_hist_length} yrs`,
      sub: summary.cb_person_default_on_file === 'Y' ? '⚠️ Derogatory on file' : '✅ Clean bureau record',
      icon: History,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Employment',
      value: `${summary.person_emp_length} yrs`,
      sub: `${summary.person_home_ownership} property status`,
      icon: Briefcase,
      color: 'text-sky-600 dark:text-sky-400',
    },
  ];

  return (
    <div className={`p-6 rounded-3xl border transition-all ${
      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Key Financial Indicators
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Actual submitted applicant parameters processed by the predictive pipeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {indicators.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <div className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {item.value}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {item.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
