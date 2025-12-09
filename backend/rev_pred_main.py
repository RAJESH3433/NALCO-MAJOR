# reverse_prediction_api.py

import logging
from typing import Dict
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
from prometheus_fastapi_instrumentator import Instrumentator
import uvicorn
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Constants
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define paths relative to the script's location
MODEL_PATH = os.getenv("REV_MODEL_PATH", os.path.join(BASE_DIR, "rev_optimized_random_forest_model.pkl"))
SCALER_PATH = os.getenv("REV_SCALER_PATH", os.path.join(BASE_DIR, "rev_random_forest_scaler.pkl"))
# Global model objects
model = None
scaler = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, scaler
    try:
        logger.info("Loading reverse prediction model and scaler...")
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        logger.info("Reverse model and scaler loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model/scaler: {str(e)}")
        raise
    yield
    logger.info("Shutting down application...")

# Initialize FastAPI
app = FastAPI(
    title="Nalco Reverse Prediction API",
    description="Predict manufacturing parameters from material properties (UTS, Elongation, Conductivity)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus monitoring
Instrumentator().instrument(app).expose(app)

# Pydantic request/response schemas
class ReverseInput(BaseModel):
    uts: float
    elongation: float
    conductivity: float

class ReversePredictionResponse(BaseModel):
    si: float
    fe: float
    metalTemp: float
    castingWheelRpm: float
    coolingWaterPressure: float
    coolingWaterTemp: float
    castBarEntryTemp: float
    rollingMillRpm: float
    emulsionTemp: float
    emulsionPressure: float
    # rodQuenchWaterPressure: float
    timestamp: str
    model_version: str

IST = timezone(timedelta(hours=5, minutes=30))

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, str]:
    return {"status": "healthy"}

@app.post("/reverse-predict", response_model=ReversePredictionResponse)
async def reverse_predict(data: ReverseInput):
    try:
        if model is None or scaler is None:
            logger.error("Model or scaler not loaded")
            raise HTTPException(status_code=503, detail="Model not loaded")

        logger.info(f"Received reverse prediction request: {data.dict()}")

        X_input = np.array([[data.uts, data.elongation, data.conductivity]])
        X_scaled = scaler.transform(X_input)

        prediction = model.predict(X_scaled)[0]
        logger.info(f"Prediction successful: {prediction.tolist()}")

        return {
            "si": float(prediction[0]),
            "fe": float(prediction[1]),
            "metalTemp": float(prediction[2]),
            "castingWheelRpm": float(prediction[3]),
            "coolingWaterPressure": float(prediction[4]),
            "coolingWaterTemp": float(prediction[5]),
            "castBarEntryTemp": float(prediction[6]),
            "rollingMillRpm": float(prediction[7]),
            "emulsionTemp": float(prediction[8]),
            "emulsionPressure": float(prediction[9]),
            # "rodQuenchWaterPressure": float(prediction[10]),
            "timestamp": datetime.now(IST).isoformat(),
            "model_version": "1.0.0"
        }

    except Exception as e:
        logger.error(f"Error in reverse prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction failed due to internal error")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
