import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { LandingHeroView } from './components/home/LandingHeroView';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { AssessmentWizard } from './components/assessment/AssessmentWizard';
import { LoadingAnalysisState } from './components/assessment/LoadingAnalysisState';
import { AIExplanationView } from './components/explanation/AIExplanationView';
import { FinancialProfileView } from './components/profile/FinancialProfileView';
import { ScoreHistoryView } from './components/history/ScoreHistoryView';
import { ModelTransparencyView } from './components/transparency/ModelTransparencyView';
import { CreditEducationView } from './components/education/CreditEducationView';
import { fetchDemoProfiles, predictCreditRisk, fetchHealth } from './services/api';
import {
  ApplicantData,
  PredictionResponse,
  DemoProfile,
  NavTab,
  ThemeMode,
  ScoreHistoryItem,
} from './types/credit';
import { AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<ThemeMode>('light'); // LIGHT MODE AS DEFAULT
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [demoProfiles, setDemoProfiles] = useState<DemoProfile[]>([]);
  const [optimalThreshold, setOptimalThreshold] = useState<number>(0.322);

  const [applicantData, setApplicantData] = useState<ApplicantData>({
    person_age: 34,
    person_income: 95000,
    person_home_ownership: 'OWN',
    person_emp_length: 8.0,
    loan_intent: 'HOMEIMPROVEMENT',
    loan_grade: 'A',
    loan_amnt: 12000,
    loan_int_rate: 7.49,
    loan_percent_income: 0.13,
    cb_person_default_on_file: 'N',
    cb_person_cred_hist_length: 9,
    custom_threshold: 0.322,
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScoreHistoryItem[]>([]);

  // Apply Theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Initial load: Fetch health, demo profiles & compute baseline prediction
  useEffect(() => {
    fetchHealth()
      .then((h) => {
        if (h.optimal_threshold) setOptimalThreshold(h.optimal_threshold);
      })
      .catch((err) => console.warn('Health check warning:', err));

    fetchDemoProfiles()
      .then((profiles) => {
        setDemoProfiles(profiles);
        if (profiles.length > 0) {
          const defaultProf = profiles[0].data;
          setApplicantData(defaultProf);
          // Run baseline prediction
          predictCreditRisk(defaultProf)
            .then((res) => {
              setPredictionResult(res);
              const initItem: ScoreHistoryItem = {
                id: 'eval-init',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
                is_approved: res.prediction.is_approved,
                decision: res.prediction.decision,
                risk_tier: res.prediction.risk_tier,
                loan_amnt: defaultProf.loan_amnt,
                income: defaultProf.person_income,
                approval_percentage: res.prediction.approval_percentage,
                applicant_data: defaultProf,
              };
              setHistory([initItem]);
            })
            .catch((err) => console.error('Baseline prediction failed:', err));
        }
      })
      .catch((err) => console.error('Failed to fetch demo profiles:', err));
  }, []);

  const handleRunAssessment = async (data: ApplicantData) => {
    setApplicantData(data);
    setIsEvaluating(true);
    setGlobalError(null);

    try {
      const [res] = await Promise.all([
        predictCreditRisk(data),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      setPredictionResult(res);
      setCurrentTab('dashboard');

      // Add to history
      const newHistoryItem: ScoreHistoryItem = {
        id: `eval-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
        is_approved: res.prediction.is_approved,
        decision: res.prediction.decision,
        risk_tier: res.prediction.risk_tier,
        loan_amnt: data.loan_amnt,
        income: data.person_income,
        approval_percentage: res.prediction.approval_percentage,
        applicant_data: data,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);

      // Confetti for Prime approved loan
      if (res.prediction.is_approved && res.prediction.approval_percentage >= 75) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#3b82f6', '#14b8a6'],
        });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setGlobalError(err.message || 'Loan assessment failed. Please verify your inputs.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectDemoProfile = (profile: DemoProfile) => {
    handleRunAssessment(profile.data);
  };

  const handleSelectHistoryItem = (item: ScoreHistoryItem) => {
    setApplicantData(item.applicant_data);
    handleRunAssessment(item.applicant_data);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      isDark ? 'bg-[#0b1120] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        theme={theme}
        optimalThreshold={optimalThreshold}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        
        {/* Top Navigation Bar */}
        <TopNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          demoProfiles={demoProfiles}
          onSelectDemoProfile={handleSelectDemoProfile}
          hasPrediction={predictionResult !== null}
          approvalPercentage={predictionResult?.prediction.approval_percentage}
        />

        {/* Global Error Banner */}
        {globalError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{globalError}</span>
              </div>
              <button
                onClick={() => setGlobalError(null)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main View Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          
          {isEvaluating ? (
            <div className="py-12">
              <LoadingAnalysisState />
            </div>
          ) : (
            <>
              {/* TAB 1: HOME / LANDING PAGE */}
              {currentTab === 'home' && (
                <LandingHeroView
                  theme={theme}
                  onNavigateTab={(tab) => {
                    setCurrentTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {/* TAB 2: MAIN DASHBOARD */}
              {currentTab === 'dashboard' && predictionResult && (
                <MainDashboard
                  predictionResponse={predictionResult}
                  applicantData={applicantData}
                  theme={theme}
                  onStartNewAssessment={() => setCurrentTab('assessment')}
                  onNavigateToExplanation={() => setCurrentTab('explanation')}
                  onNavigateToProfile={() => setCurrentTab('profile')}
                />
              )}

              {/* TAB 3: 5-STEP LOAN ASSESSMENT WIZARD */}
              {currentTab === 'assessment' && (
                <AssessmentWizard
                  initialData={applicantData}
                  demoProfiles={demoProfiles}
                  onSubmit={handleRunAssessment}
                  isEvaluating={isEvaluating}
                  theme={theme}
                />
              )}

              {/* TAB 4: AI EXPLANATION & SHAP */}
              {currentTab === 'explanation' && predictionResult && (
                <AIExplanationView
                  shapAnalysis={predictionResult.shap_analysis}
                  prediction={predictionResult.prediction}
                  theme={theme}
                />
              )}

              {/* TAB 5: FINANCIAL PROFILE */}
              {currentTab === 'profile' && predictionResult && (
                <FinancialProfileView
                  applicantData={applicantData}
                  prediction={predictionResult.prediction}
                  theme={theme}
                  onEditProfile={() => setCurrentTab('assessment')}
                />
              )}

              {/* TAB 6: PREDICTION HISTORY */}
              {currentTab === 'history' && (
                <ScoreHistoryView
                  history={history}
                  theme={theme}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  onStartNewAssessment={() => setCurrentTab('assessment')}
                />
              )}

              {/* TAB 7: MODEL TRANSPARENCY */}
              {currentTab === 'transparency' && (
                <ModelTransparencyView
                  theme={theme}
                  optimalThreshold={optimalThreshold}
                />
              )}

              {/* TAB 8: CREDIT EDUCATION */}
              {currentTab === 'education' && (
                <CreditEducationView
                  theme={theme}
                  onStartAssessment={() => setCurrentTab('assessment')}
                />
              )}
            </>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;
