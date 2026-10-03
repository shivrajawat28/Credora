#!/bin/bash
# Start script for Credora AI Lending Intelligence & SHAP Application

echo "========================================================"
echo "🚀 Starting Credora AI Web Server (FastAPI + UI)..."
echo "========================================================"

cd "$(dirname "$0")"

# Run Uvicorn Server
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
