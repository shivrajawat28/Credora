import {
  ApplicantData,
  PredictionResponse,
  DemoProfile,
  BatchResponse,
  ModelHealth,
  ModelInfo,
} from '../types/credit';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchHealth(): Promise<ModelHealth> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error('Backend health check failed');
  }
  return res.json();
}

export async function fetchModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API_BASE}/model_info`);
  if (!res.ok) {
    throw new Error('Failed to load model performance metadata');
  }
  return res.json();
}

export async function fetchDemoProfiles(): Promise<DemoProfile[]> {
  const res = await fetch(`${API_BASE}/demo_profiles`);
  if (!res.ok) {
    throw new Error('Failed to load demo profiles');
  }
  return res.json();
}

export async function predictCreditRisk(
  data: ApplicantData
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prediction request failed. Please verify your inputs.');
  }

  return res.json();
}

export async function batchPredict(
  file: File,
  threshold: number = 0.322
): Promise<BatchResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/batch_predict?threshold=${threshold}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Batch prediction failed.');
  }

  return res.json();
}
