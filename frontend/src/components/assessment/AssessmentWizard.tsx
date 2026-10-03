import React, { useState } from 'react';
import {
  ApplicantData,
  DemoProfile,
  ThemeMode,
} from '../../types/credit';
import {
  User,
  Building2,
  Briefcase,
  DollarSign,
  Landmark,
  Percent,
  History,
  AlertOctagon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Edit3,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AssessmentWizardProps {
  initialData: ApplicantData;
  demoProfiles: DemoProfile[];
  onSubmit: (data: ApplicantData) => void;
  isEvaluating: boolean;
  theme: ThemeMode;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  initialData,
  demoProfiles,
  onSubmit,
  isEvaluating,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<ApplicantData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamically calculate Loan-to-Income ratio
  const computedRatio = formData.person_income > 0
    ? Number((formData.loan_amnt / formData.person_income).toFixed(4))
    : 0;

  const handleChange = (field: keyof ApplicantData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Keep loan_percent_income in sync
      if (field === 'loan_amnt' || field === 'person_income') {
        const inc = field === 'person_income' ? Number(value) : prev.person_income;
        const amnt = field === 'loan_amnt' ? Number(value) : prev.loan_amnt;
        updated.loan_percent_income = inc > 0 ? Number((amnt / inc).toFixed(4)) : 0;
      }
      return updated;
    });

    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.person_age || formData.person_age < 18 || formData.person_age > 100) {
        newErrors.person_age = 'Age must be between 18 and 100 years.';
      }
      if (!formData.person_home_ownership) {
        newErrors.person_home_ownership = 'Please select your home ownership status.';
      }
    }

    if (currentStep === 2) {
      if (formData.person_income === undefined || formData.person_income <= 0) {
        newErrors.person_income = 'Annual income must be greater than 0.';
      }
      if (formData.person_emp_length === undefined || formData.person_emp_length < 0 || formData.person_emp_length > 60) {
        newErrors.person_emp_length = 'Employment length must be between 0 and 60 years.';
      }
    }

    if (currentStep === 3) {
      if (!formData.loan_amnt || formData.loan_amnt < 500) {
        newErrors.loan_amnt = 'Loan amount must be at least $500 (or equivalent).';
      }
      if (!formData.loan_int_rate || formData.loan_int_rate < 1 || formData.loan_int_rate > 40) {
        newErrors.loan_int_rate = 'Interest rate must be between 1.0% and 40.0%.';
      }
      if (!formData.loan_intent) {
        newErrors.loan_intent = 'Please specify the loan purpose.';
      }
      if (!formData.loan_grade) {
        newErrors.loan_grade = 'Please select the loan grade.';
      }
    }

    if (currentStep === 4) {
      if (formData.cb_person_cred_hist_length === undefined || formData.cb_person_cred_hist_length < 0 || formData.cb_person_cred_hist_length > 50) {
        newErrors.cb_person_cred_hist_length = 'Credit history length must be between 0 and 50 years.';
      }
      if (!formData.cb_person_default_on_file) {
        newErrors.cb_person_default_on_file = 'Please indicate default status.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4)) {
      const submissionData: ApplicantData = {
        ...formData,
        loan_percent_income: computedRatio,
      };
      onSubmit(submissionData);
    }
  };

  const loadDemo = (profile: DemoProfile) => {
    setFormData(profile.data);
    setErrors({});
  };

  const stepsHeader = [
    { num: 1, title: 'Personal Info', desc: 'Age & Housing' },
    { num: 2, title: 'Income & Work', desc: 'Salary & Tenure' },
    { num: 3, title: 'Loan Details', desc: 'Amount, Rate & Purpose' },
    { num: 4, title: 'Credit History', desc: 'Length & Records' },
    { num: 5, title: 'Review & Submit', desc: 'Application Summary' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Top Banner & Quick Presets */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 text-slate-200'
          : 'bg-white border-slate-200/80 shadow-sm text-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Lending Underwriting Form</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Loan Assessment Application
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Complete the verified 4-step financial parameters to calculate your model-predicted loan approval likelihood.
            </p>
          </div>

          {/* Quick Preset Profiles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Presets:</span>
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadDemo(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  formData.person_income === p.data.person_income && formData.loan_amnt === p.data.loan_amnt
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-5 gap-2">
            {stepsHeader.map((s) => {
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div
                  key={s.num}
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  className={`flex flex-col items-center text-center cursor-pointer group transition-all`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isDark
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 hidden sm:block ${
                    isActive ? (isDark ? 'text-white' : 'text-blue-700') : isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {s.title}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden md:block">
                    {s.desc}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit}>
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          
          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Step 1: Personal Information
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Provide demographic and housing stability details required by the credit underwriting pipeline.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Age */}
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={18}
                      max={100}
                      value={formData.person_age || ''}
                      onChange={(e) => handleChange('person_age', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 34"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                        errors.person_age
                          ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-500/20'
                          : isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-50/70 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      years
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Applicant's age in completed years (18–100).</p>
                  {errors.person_age && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.person_age}
                    </p>
                  )}
                </div>

                {/* Home Ownership */}
                <div className="space-y-2 sm:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Home Ownership Status <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'OWN', title: 'Own Outright', desc: 'No active mortgage loan' },
                      { id: 'MORTGAGE', title: 'Mortgage', desc: 'Financed property' },
                      { id: 'RENT', title: 'Rent', desc: 'Tenancy / Lease contract' },
                      { id: 'OTHER', title: 'Other', desc: 'Living with relatives / co-living' },
                    ].map((opt) => {
                      const isSelected = formData.person_home_ownership === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleChange('person_home_ownership', opt.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950/60 dark:border-blue-500 dark:text-cyan-300 ring-2 ring-blue-500/20'
                              : isDark
                              ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                              : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{opt.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.person_home_ownership && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.person_home_ownership}
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: EMPLOYMENT & INCOME */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Step 2: Employment & Income
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Enter verified gross annual earnings and continuous employment tenure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Annual Income */}
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Annual Income ($ / ₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={formData.person_income || ''}
                      onChange={(e) => handleChange('person_income', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 85000"
                      className={`w-full pl-8 pr-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                        errors.person_income
                          ? 'border-rose-500 bg-rose-50/20'
                          : isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-50/70 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Total gross yearly earnings before taxes.</p>
                  {errors.person_income && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.person_income}
                    </p>
                  )}
                </div>

                {/* Employment Length */}
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Employment Length <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={60}
                      step={0.5}
                      value={formData.person_emp_length !== undefined ? formData.person_emp_length : ''}
                      onChange={(e) => handleChange('person_emp_length', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 5.0"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                        errors.person_emp_length
                          ? 'border-rose-500 bg-rose-50/20'
                          : isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-50/70 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      years
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Continuous employment or self-employment tenure.</p>
                  {errors.person_emp_length && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.person_emp_length}
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: LOAN DETAILS */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Step 3: Loan Details
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Specify requested loan amount, rate, loan purpose, and grade classification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Loan Amount */}
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Requested Loan Amount <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={formData.loan_amnt || ''}
                      onChange={(e) => handleChange('loan_amnt', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 15000"
                      className={`w-full pl-8 pr-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                        errors.loan_amnt
                          ? 'border-rose-500 bg-rose-50/20'
                          : isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-50/70 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Total principal credit amount requested.</p>
                  {errors.loan_amnt && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.loan_amnt}
                    </p>
                  )}
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Loan Interest Rate (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={40}
                      step={0.1}
                      value={formData.loan_int_rate || ''}
                      onChange={(e) => handleChange('loan_int_rate', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 11.5"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                        errors.loan_int_rate
                          ? 'border-rose-500 bg-rose-50/20'
                          : isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-50/70 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      % APR
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Annual percentage interest rate on the loan.</p>
                  {errors.loan_int_rate && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.loan_int_rate}
                    </p>
                  )}
                </div>

                {/* Auto-computed Loan-to-Income Indicator Box */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-blue-900 dark:text-cyan-300 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5" />
                      <span>Loan-to-Income Ratio (Auto-Calculated)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Percentage of annual income represented by the requested loan amount.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${
                      computedRatio > 0.40 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-cyan-400'
                    }`}>
                      {(computedRatio * 100).toFixed(1)}%
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {computedRatio > 0.40 ? '⚠️ High Leverage' : '✅ Moderate / Healthy'}
                    </span>
                  </div>
                </div>

                {/* Loan Purpose / Intent */}
                <div className="space-y-2 sm:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Loan Purpose <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'PERSONAL', label: 'Personal', desc: 'General expenses' },
                      { id: 'EDUCATION', label: 'Education', desc: 'Tuition & training' },
                      { id: 'MEDICAL', label: 'Medical', desc: 'Healthcare & treatments' },
                      { id: 'VENTURE', label: 'Venture', desc: 'Business investment' },
                      { id: 'HOMEIMPROVEMENT', label: 'Home Improvement', desc: 'Renovations & repairs' },
                      { id: 'DEBTCONSOLIDATION', label: 'Debt Consolidation', desc: 'Refinancing' },
                    ].map((opt) => {
                      const isSelected = formData.loan_intent === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleChange('loan_intent', opt.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950/60 dark:border-blue-500 dark:text-cyan-300 ring-2 ring-blue-500/20'
                              : isDark
                              ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                              : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Loan Grade */}
                <div className="space-y-2 sm:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Loan Grade Classification <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {(['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const).map((grade) => {
                      const isSelected = formData.loan_grade === grade;
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => handleChange('loan_grade', grade)}
                          className={`py-3 rounded-xl font-black text-sm border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                              : isDark
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {grade}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 px-1">
                    <span>Grade A (Lowest Risk)</span>
                    <span>Grade G (Subprime)</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: CREDIT HISTORY */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Step 4: Credit History
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Credit file longevity and historical credit bureau default records.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Credit History Length */}
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Credit History Length <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={formData.cb_person_cred_hist_length !== undefined ? formData.cb_person_cred_hist_length : ''}
                      onChange={(e) => handleChange('cb_person_cred_hist_length', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 7"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                        errors.cb_person_cred_hist_length
                          ? 'border-rose-500 bg-rose-50/20'
                          : isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-50/70 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      years
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Years elapsed since the earliest opened credit line.</p>
                  {errors.cb_person_cred_hist_length && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.cb_person_cred_hist_length}
                    </p>
                  )}
                </div>

                {/* Default on File */}
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Previous Default Record <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => handleChange('cb_person_default_on_file', 'N')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.cb_person_default_on_file === 'N'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-500 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                          : isDark
                          ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>No Default (Clean)</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Zero derogatory marks on file</div>
                    </div>

                    <div
                      onClick={() => handleChange('cb_person_default_on_file', 'Y')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.cb_person_default_on_file === 'Y'
                          ? 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/50 dark:border-rose-500 dark:text-rose-300 ring-2 ring-rose-500/20'
                          : isDark
                          ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Has Prior Default</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Past 90+ days delinquency record</div>
                    </div>
                  </div>
                  {errors.cb_person_default_on_file && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.cb_person_default_on_file}
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* STEP 5: APPLICATION REVIEW */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pre-Submission Review</span>
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Review Your Loan Application
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Confirm all entered applicant characteristics before initiating TreeSHAP machine learning assessment.
                </p>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Personal & Housing */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Personal & Housing
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Age:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formData.person_age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Home Ownership:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formData.person_home_ownership}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Employment & Income */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Income & Work
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Income:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">${formData.person_income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Employment Length:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formData.person_emp_length} years</span>
                    </div>
                  </div>
                </div>

                {/* 3. Loan Details */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Loan Characteristics
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Requested Amount:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">${formData.loan_amnt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Interest Rate:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formData.loan_int_rate}% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loan-to-Income:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{(computedRatio * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loan Purpose:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formData.loan_intent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loan Grade:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Grade {formData.loan_grade}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Credit History */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Credit Bureau History
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credit History Length:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formData.cb_person_cred_hist_length} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Historical Default Record:</span>
                      <span className={`font-bold ${formData.cb_person_default_on_file === 'Y' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formData.cb_person_default_on_file === 'Y' ? 'Yes (Derogatory on File)' : 'No (Clean Record)'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Disclaimer reminder */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-cyan-300 leading-relaxed">
                ℹ️ <strong>Model Inference Notice:</strong> Submitting this form runs our actual Calibrated Random Forest model trained on historical lending portfolios. The result is an estimated likelihood prediction and not a guaranteed lender commitment.
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isEvaluating}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isEvaluating}
                className="px-7 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>{isEvaluating ? 'Running Model...' : 'Analyze Application'}</span>
              </button>
            )}
          </div>

        </div>
      </form>

    </div>
  );
};
