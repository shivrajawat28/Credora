export type NavTab = 
  | 'home'
  | 'dashboard' 
  | 'assessment' 
  | 'application' 
  | 'explanation' 
  | 'profile' 
  | 'history' 
  | 'transparency' 
  | 'education';

export type ThemeMode = 'light' | 'dark';

export interface ApplicantData {
  person_age: number;
  person_income: number;
  person_home_ownership: 'RENT' | 'OWN' | 'MORTGAGE' | 'OTHER';
  person_emp_length: number;
  loan_intent: 'PERSONAL' | 'EDUCATION' | 'MEDICAL' | 'VENTURE' | 'HOMEIMPROVEMENT' | 'DEBTCONSOLIDATION';
  loan_grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  loan_amnt: number;
  loan_int_rate: number;
  loan_percent_income?: number;
  cb_person_default_on_file: 'Y' | 'N';
  cb_person_cred_hist_length: number;
  custom_threshold?: number;
}

export interface ShapContribution {
  feature_id: string;
  label: string;
  shap_value: number;
  approval_contribution: number;
  impact: 'SUPPORTS_APPROVAL' | 'WORKS_AGAINST_APPROVAL';
  magnitude: number;
  display_val: string;
  raw_val: number;
  explanation: string;
}

export interface PredictionResult {
  decision: string;
  badge: string;
  badge_color: string;
  risk_tier: string;
  is_approved: boolean;
  loan_status: 0 | 1;
  approval_probability: number;
  approval_percentage: number;
  default_probability: number;
  default_percentage: number;
  threshold_used: number;
  recommendation: string;
  insights: string[];
  disclaimer: string;
}

export interface ApplicantSummary {
  person_age: number;
  person_income: number;
  person_home_ownership: string;
  person_emp_length: number;
  loan_intent: string;
  loan_grade: string;
  loan_amnt: number;
  loan_int_rate: number;
  loan_percent_income: number;
  cb_person_default_on_file: string;
  cb_person_cred_hist_length: number;
}

export interface ShapAnalysis {
  base_value: number;
  supporting_factors: ShapContribution[];
  opposing_factors: ShapContribution[];
  all_contributions: ShapContribution[];
}

export interface PredictionResponse {
  prediction: PredictionResult;
  applicant_summary: ApplicantSummary;
  shap_analysis: ShapAnalysis;
}

export interface DemoProfile {
  id: string;
  name: string;
  subtitle: string;
  data: ApplicantData;
}

export interface ScoreHistoryItem {
  id: string;
  timestamp: string;
  is_approved: boolean;
  decision: string;
  risk_tier: string;
  loan_amnt: number;
  income: number;
  approval_percentage: number;
  applicant_data: ApplicantData;
}

export interface GlobalFeatureImportance {
  feature_id: string;
  label: string;
  importance: number;
  importance_percent: number;
}

export interface ModelInfo {
  model_type: string;
  hyperparameters: {
    n_estimators: number;
    max_depth: number;
    min_samples_leaf: number;
    min_samples_split: number;
    max_features: string | null;
    class_weight: string;
    random_state: number;
  };
  evaluation_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
  };
  optimal_threshold: number;
  global_feature_importances: GlobalFeatureImportance[];
}

export interface BatchItemResult {
  row_index: number;
  age: number;
  income: number;
  loan_amnt: number;
  grade: string;
  default_probability: number;
  decision: 'APPROVED' | 'REJECTED';
  risk_tier: string;
}

export interface BatchResponse {
  total_records: number;
  approved_count: number;
  rejected_count: number;
  approval_rate: number;
  threshold_used: number;
  sample_results: BatchItemResult[];
}

export interface ModelHealth {
  status: string;
  model_loaded: boolean;
  feature_count: number;
  optimal_threshold: number;
  saved_threshold: number;
}
