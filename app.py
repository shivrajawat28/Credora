import os
import joblib
import pandas as pd
import numpy as np
import shap
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import io

# Initialize FastAPI
app = FastAPI(
    title="Credit Risk & Score Assessment System",
    description="AI-powered Credit Risk Prediction and SHAP Explainability Engine",
    version="2.0.0"
)

frontend_url = os.getenv("FRONTEND_URL", "*")
allow_origins = ["*", "http://localhost:5173", "http://localhost:8000"]
if frontend_url and frontend_url != "*":
    allow_origins.append(frontend_url)

allow_origins = list(set(allow_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model and Artifacts
MODEL_PATH = "credit_risk_model.pkl"
THRESHOLD_PATH = "best_threshold.pkl"

model = None
base_pipeline = None
preprocessor = None
rf_classifier = None
feature_names = []
explainer = None
saved_threshold = 0.5
optimal_threshold = 0.3222  # Optimal F1 threshold calculated on calibrated model test split

def load_artifacts():
    global model, base_pipeline, preprocessor, rf_classifier, feature_names, explainer, saved_threshold
    try:
        model = joblib.load(MODEL_PATH)
        base_pipeline = model.calibrated_classifiers_[0].estimator
        preprocessor = base_pipeline.named_steps["preprocessor"]
        rf_classifier = base_pipeline.named_steps["classifier"]
        feature_names = list(preprocessor.get_feature_names_out())
        explainer = shap.TreeExplainer(rf_classifier)
        
        try:
            saved_threshold = float(joblib.load(THRESHOLD_PATH))
        except Exception:
            saved_threshold = 0.5
        print(f"Artifacts loaded successfully. Features: {len(feature_names)}, Saved Threshold: {saved_threshold}")
    except Exception as e:
        print(f"Error loading artifacts: {e}")

load_artifacts()

# Pydantic Schema for Loan Applicant
class ApplicantData(BaseModel):
    person_age: int = Field(..., ge=18, le=100, example=25, description="Age in years")
    person_income: float = Field(..., ge=0, example=65000, description="Annual Income ($)")
    person_home_ownership: str = Field(..., example="RENT", description="RENT, OWN, MORTGAGE, OTHER")
    person_emp_length: float = Field(..., ge=0, le=60, example=4.0, description="Employment length in years")
    loan_intent: str = Field(..., example="PERSONAL", description="PERSONAL, EDUCATION, MEDICAL, VENTURE, HOMEIMPROVEMENT, DEBTCONSOLIDATION")
    loan_grade: str = Field(..., example="B", description="A, B, C, D, E, F, G")
    loan_amnt: float = Field(..., ge=500, example=10000, description="Requested Loan Amount ($)")
    loan_int_rate: float = Field(..., ge=1.0, le=40.0, example=11.5, description="Interest rate (%)")
    loan_percent_income: Optional[float] = Field(None, ge=0.0, le=1.5, description="Ratio of loan amount to income (auto-calculated if omitted)")
    cb_person_default_on_file: str = Field(..., example="N", description="Historical Default on File: Y or N")
    cb_person_cred_hist_length: int = Field(..., ge=0, le=50, example=4, description="Credit History Length in years")
    custom_threshold: Optional[float] = Field(None, ge=0.01, le=0.99, description="Optional custom decision threshold")

# Feature humanized mapping
FEATURE_LABELS = {
    "num__person_age": "Applicant Age",
    "num__person_income": "Annual Income",
    "num__person_emp_length": "Employment Duration",
    "num__loan_amnt": "Loan Amount",
    "num__loan_int_rate": "Interest Rate",
    "num__loan_percent_income": "Loan-to-Income Ratio",
    "num__cb_person_cred_hist_length": "Credit History Length",
    "cat__person_home_ownership_MORTGAGE": "Home Ownership: Mortgage",
    "cat__person_home_ownership_OTHER": "Home Ownership: Other",
    "cat__person_home_ownership_OWN": "Home Ownership: Own",
    "cat__person_home_ownership_RENT": "Home Ownership: Rent",
    "cat__loan_intent_DEBTCONSOLIDATION": "Intent: Debt Consolidation",
    "cat__loan_intent_EDUCATION": "Intent: Education",
    "cat__loan_intent_HOMEIMPROVEMENT": "Intent: Home Improvement",
    "cat__loan_intent_MEDICAL": "Intent: Medical",
    "cat__loan_intent_PERSONAL": "Intent: Personal",
    "cat__loan_intent_VENTURE": "Intent: Venture",
    "cat__loan_grade_A": "Loan Grade: A",
    "cat__loan_grade_B": "Loan Grade: B",
    "cat__loan_grade_C": "Loan Grade: C",
    "cat__loan_grade_D": "Loan Grade: D",
    "cat__loan_grade_E": "Loan Grade: E",
    "cat__loan_grade_F": "Loan Grade: F",
    "cat__loan_grade_G": "Loan Grade: G",
    "cat__cb_person_default_on_file_N": "Past Default Record: No",
    "cat__cb_person_default_on_file_Y": "Past Default Record: Yes"
}

def calculate_credit_score(default_prob: float) -> int:
    """Maps default probability to standard FICO-like credit score (300 - 850)."""
    # 0% default prob -> ~850 score, 100% default prob -> ~300 score
    score = 850 - int(default_prob * 550)
    return max(300, min(850, score))

def get_risk_tier(default_prob: float, threshold: float):
    if default_prob >= threshold:
        if default_prob > 0.65:
            return {
                "tier": "High Risk / Declined",
                "color": "#dc2626",
                "badge": "LIKELY NOT APPROVED",
                "decision": "Model Prediction: Likely Not Approved",
                "recommendation": "Elevated statistical default risk based on loan-to-income ratio or credit profile. Secondary collateral or guarantor may be required."
            }
        else:
            return {
                "tier": "Elevated Risk",
                "color": "#ea580c",
                "badge": "BORDERLINE / NOT APPROVED",
                "decision": "Model Prediction: Likely Not Approved",
                "recommendation": "Calculated default probability exceeds the risk policy threshold. Consider lowering the requested loan amount to improve approval likelihood."
            }
    elif default_prob >= threshold * 0.70:
        return {
            "tier": "Moderate Risk",
            "color": "#d97706",
            "badge": "CONDITIONAL APPROVAL",
            "decision": "Model Prediction: Likely Approved (Conditional)",
            "recommendation": "Moderate risk profile within acceptable underwriting tolerance. Standard documentation and income verification required."
        }
    else:
        return {
            "tier": "Prime Low Risk",
            "color": "#16a34a",
            "badge": "LIKELY APPROVED",
            "decision": "Model Prediction: Likely Approved",
            "recommendation": "Prime applicant profile with strong repayment buffer and favorable credit characteristics. Eligible for expedited processing."
        }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "feature_count": len(feature_names),
        "optimal_threshold": optimal_threshold,
        "saved_threshold": saved_threshold
    }

@app.get("/api/model_info")
def get_model_info():
    """Returns exact machine learning architecture, hyperparameters, and test evaluation metrics."""
    global_importances = []
    if rf_classifier is not None and feature_names:
        for fname, imp in zip(feature_names, rf_classifier.feature_importances_):
            global_importances.append({
                "feature_id": fname,
                "label": FEATURE_LABELS.get(fname, fname),
                "importance": round(float(imp), 4),
                "importance_percent": round(float(imp) * 100, 2)
            })
        global_importances.sort(key=lambda x: x["importance"], reverse=True)

    return {
        "model_type": "Calibrated Random Forest Classifier",
        "hyperparameters": {
            "n_estimators": 491,
            "max_depth": 14,
            "min_samples_leaf": 3,
            "min_samples_split": 18,
            "max_features": None,
            "class_weight": "balanced",
            "random_state": 42
        },
        "evaluation_metrics": {
            "accuracy": 0.931,
            "precision": 0.908,
            "recall": 0.729,
            "f1_score": 0.809,
            "roc_auc": 0.925
        },
        "optimal_threshold": optimal_threshold,
        "global_feature_importances": global_importances[:15]
    }

@app.get("/api/demo_profiles")
def get_demo_profiles():
    return [
        {
            "id": "prime",
            "name": "Prime Low-Risk Applicant",
            "subtitle": "High income, Owns home, Grade A loan",
            "data": {
                "person_age": 34,
                "person_income": 95000,
                "person_home_ownership": "OWN",
                "person_emp_length": 8.0,
                "loan_intent": "HOMEIMPROVEMENT",
                "loan_grade": "A",
                "loan_amnt": 12000,
                "loan_int_rate": 7.49,
                "loan_percent_income": 0.13,
                "cb_person_default_on_file": "N",
                "cb_person_cred_hist_length": 9
            }
        },
        {
            "id": "moderate",
            "name": "Moderate Risk / Mid-Career",
            "subtitle": "Average income, Renting, Grade C loan",
            "data": {
                "person_age": 28,
                "person_income": 52000,
                "person_home_ownership": "RENT",
                "person_emp_length": 3.5,
                "loan_intent": "PERSONAL",
                "loan_grade": "C",
                "loan_amnt": 14000,
                "loan_int_rate": 13.48,
                "loan_percent_income": 0.27,
                "cb_person_default_on_file": "N",
                "cb_person_cred_hist_length": 4
            }
        },
        {
            "id": "high_ratio",
            "name": "High Debt-to-Income Burden",
            "subtitle": "High loan ratio (49% of salary), Grade D",
            "data": {
                "person_age": 23,
                "person_income": 35000,
                "person_home_ownership": "RENT",
                "person_emp_length": 1.0,
                "loan_intent": "DEBTCONSOLIDATION",
                "loan_grade": "D",
                "loan_amnt": 17000,
                "loan_int_rate": 16.29,
                "loan_percent_income": 0.49,
                "cb_person_default_on_file": "N",
                "cb_person_cred_hist_length": 2
            }
        },
        {
            "id": "past_default",
            "name": "Historical Default Case",
            "subtitle": "Prior default on file, Grade E loan",
            "data": {
                "person_age": 31,
                "person_income": 40000,
                "person_home_ownership": "RENT",
                "person_emp_length": 2.0,
                "loan_intent": "MEDICAL",
                "loan_grade": "E",
                "loan_amnt": 18000,
                "loan_int_rate": 18.53,
                "loan_percent_income": 0.45,
                "cb_person_default_on_file": "Y",
                "cb_person_cred_hist_length": 5
            }
        }
    ]

@app.post("/api/predict")
def predict_risk(applicant: ApplicantData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model artifacts are not loaded.")

    # Calculate loan_percent_income if not provided or to ensure precision
    loan_percent_income = applicant.loan_percent_income
    if loan_percent_income is None:
        loan_percent_income = round(applicant.loan_amnt / max(applicant.person_income, 1.0), 4)

    input_dict = {
        "person_age": applicant.person_age,
        "person_income": applicant.person_income,
        "person_home_ownership": applicant.person_home_ownership,
        "person_emp_length": applicant.person_emp_length,
        "loan_intent": applicant.loan_intent,
        "loan_grade": applicant.loan_grade,
        "loan_amnt": applicant.loan_amnt,
        "loan_int_rate": applicant.loan_int_rate,
        "loan_percent_income": loan_percent_income,
        "cb_person_default_on_file": applicant.cb_person_default_on_file,
        "cb_person_cred_hist_length": applicant.cb_person_cred_hist_length
    }

    df_single = pd.DataFrame([input_dict])

    try:
        # 1. Calibrated Probability from actual model
        probs = model.predict_proba(df_single)[0]
        approval_prob = float(probs[0])   # class 0: Non-default / Approved
        default_prob = float(probs[1])    # class 1: Default / Declined

        # Active decision threshold (optimal calibrated threshold is 0.3222)
        threshold = applicant.custom_threshold if applicant.custom_threshold is not None else optimal_threshold

        is_approved = bool(default_prob < threshold)
        risk_info = get_risk_tier(default_prob, threshold)

        # 2. SHAP Explanation for Tree Classifier
        X_trans = preprocessor.transform(df_single)
        df_trans = pd.DataFrame(X_trans, columns=feature_names)
        shap_res = explainer.shap_values(df_trans)

        if isinstance(shap_res, list):
            shap_vals_class1 = shap_res[1][0]
            base_val = explainer.expected_value[1] if isinstance(explainer.expected_value, (list, np.ndarray)) else explainer.expected_value
        elif len(shap_res.shape) == 3:
            shap_vals_class1 = shap_res[0, :, 1]
            base_val = explainer.expected_value[1]
        else:
            shap_vals_class1 = shap_res[0]
            base_val = explainer.expected_value

        # Format feature contributions
        # Note: positive shap_val for class 1 increases default risk (works AGAINST approval)
        # negative shap_val for class 1 decreases default risk (SUPPORTS approval)
        contributions = []
        for i, f_name in enumerate(feature_names):
            val = float(df_trans.iloc[0, i])
            shap_v = float(shap_vals_class1[i])
            label = FEATURE_LABELS.get(f_name, f_name)
            
            # Show original input representation if relevant
            display_val = str(val)
            if f_name.startswith("num__"):
                raw_key = f_name.replace("num__", "")
                display_val = f"{input_dict.get(raw_key, val)}"
                if raw_key == "loan_int_rate":
                    display_val = f"{display_val}%"
                elif raw_key == "loan_percent_income":
                    display_val = f"{round(float(display_val) * 100, 1)}%"
                elif raw_key in ["person_age", "cb_person_cred_hist_length"]:
                    display_val = f"{display_val} yrs"
                elif raw_key == "person_emp_length":
                    display_val = f"{display_val} yrs"
            elif f_name.startswith("cat__"):
                display_val = "Active" if val == 1.0 else "Inactive"

            # Model contribution from perspective of approval prediction:
            # If shap_v < 0: this feature reduces default probability, supporting approval (+contribution to approval)
            # If shap_v > 0: this feature increases default probability, working against approval (-contribution to approval)
            approval_contribution = -shap_v

            contributions.append({
                "feature_id": f_name,
                "label": label,
                "shap_value": round(shap_v, 4),
                "approval_contribution": round(approval_contribution, 4),
                "impact": "SUPPORTS_APPROVAL" if approval_contribution > 0 else "WORKS_AGAINST_APPROVAL",
                "magnitude": round(abs(shap_v), 4),
                "display_val": display_val,
                "raw_val": val,
                "explanation": "The model assigned a positive contribution to this feature, supporting loan approval." if approval_contribution > 0 else "The model assigned a negative contribution to this feature, indicating elevated risk."
            })

        # Sort by magnitude of impact
        contributions.sort(key=lambda x: x["magnitude"], reverse=True)

        # Separate top drivers
        supporting_factors = [c for c in contributions if c["approval_contribution"] > 0]
        opposing_factors = [c for c in contributions if c["approval_contribution"] < 0]

        # Key natural language takeaway insights
        insights = []
        if applicant.cb_person_default_on_file == 'Y':
            insights.append("⚠️ Historical default record on file is heavily increasing default risk.")
        if loan_percent_income > 0.35:
            insights.append(f"⚠️ Requested loan represents {round(loan_percent_income*100, 1)}% of annual income, creating high leverage burden.")
        elif loan_percent_income < 0.15:
            insights.append(f"✅ Conservative loan-to-income ratio ({round(loan_percent_income*100, 1)}%) provides a strong repayment buffer.")
        
        if applicant.loan_grade in ['A', 'B']:
            insights.append(f"✅ Prime loan grade '{applicant.loan_grade}' with favorable interest rate ({applicant.loan_int_rate}%).")
        elif applicant.loan_grade in ['E', 'F', 'G']:
            insights.append(f"⚠️ Subprime loan grade '{applicant.loan_grade}' carries elevated interest expense ({applicant.loan_int_rate}%).")

        if applicant.person_home_ownership == 'OWN':
            insights.append("✅ Outright home ownership demonstrates substantial asset stability.")

        return {
            "prediction": {
                "decision": risk_info["decision"],
                "badge": risk_info["badge"],
                "badge_color": risk_info["color"],
                "risk_tier": risk_info["tier"],
                "is_approved": is_approved,
                "loan_status": 0 if is_approved else 1,
                "approval_probability": round(approval_prob, 4),
                "approval_percentage": round(approval_prob * 100, 1),
                "default_probability": round(default_prob, 4),
                "default_percentage": round(default_prob * 100, 1),
                "threshold_used": round(threshold, 4),
                "recommendation": risk_info["recommendation"],
                "insights": insights,
                "disclaimer": "This result is generated by the predictive machine-learning model and does not guarantee a lender's final decision."
            },
            "applicant_summary": {
                "person_age": applicant.person_age,
                "person_income": applicant.person_income,
                "person_home_ownership": applicant.person_home_ownership,
                "person_emp_length": applicant.person_emp_length,
                "loan_intent": applicant.loan_intent,
                "loan_grade": applicant.loan_grade,
                "loan_amnt": applicant.loan_amnt,
                "loan_int_rate": applicant.loan_int_rate,
                "loan_percent_income": loan_percent_income,
                "cb_person_default_on_file": applicant.cb_person_default_on_file,
                "cb_person_cred_hist_length": applicant.cb_person_cred_hist_length
            },
            "shap_analysis": {
                "base_value": round(float(base_val), 4),
                "supporting_factors": supporting_factors[:6],
                "opposing_factors": opposing_factors[:6],
                "all_contributions": contributions[:15]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/api/batch_predict")
async def batch_predict(file: UploadFile = File(...), threshold: float = 0.3222):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        
        required_cols = [
            'person_age', 'person_income', 'person_home_ownership',
            'person_emp_length', 'loan_intent', 'loan_grade', 'loan_amnt',
            'loan_int_rate', 'loan_percent_income', 'cb_person_default_on_file',
            'cb_person_cred_hist_length'
        ]
        
        missing = [c for c in required_cols if c not in df.columns]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing columns in CSV: {missing}")

        # Limit to 500 rows for real-time safety
        df_eval = df[required_cols].head(500)
        probs = model.predict_proba(df_eval)[:, 1]

        results = []
        approved_count = 0
        rejected_count = 0

        for i, row in df_eval.iterrows():
            prob = float(probs[i])
            is_def = prob >= threshold
            if is_def:
                rejected_count += 1
            else:
                approved_count += 1

            results.append({
                "row_index": int(i) + 1,
                "age": int(row['person_age']),
                "income": float(row['person_income']),
                "loan_amnt": float(row['loan_amnt']),
                "grade": str(row['loan_grade']),
                "default_probability": round(prob, 4),
                "credit_score": calculate_credit_score(prob),
                "decision": "REJECTED" if is_def else "APPROVED",
                "risk_tier": "High Risk" if is_def else "Low/Moderate Risk"
            })

        return {
            "total_records": len(results),
            "approved_count": approved_count,
            "rejected_count": rejected_count,
            "approval_rate": round((approved_count / len(results)) * 100, 2) if results else 0,
            "threshold_used": threshold,
            "sample_results": results
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Batch error: {str(e)}")

# Mount static folder
os.makedirs("static", exist_ok=True)
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
