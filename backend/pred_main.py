import logging
from typing import Dict
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import json
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

# Join with the filenames to build absolute paths
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(BASE_DIR, "optimized_random_forest_model.pkl"))
SCALER_PATH = os.getenv("SCALER_PATH", os.path.join(BASE_DIR, "random_forest_scaler.pkl"))
LAST_PREDICTION_PATH = os.path.join(BASE_DIR, "last_prediction.json")  # you can keep it relative too if preferred


# Global variables
model = None
scaler = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, scaler
    try:
        logger.info("Loading model and scaler...")
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        logger.info("Model and scaler loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model or scaler: {str(e)}")
        raise
    yield
    logger.info("Shutting down application...")

app = FastAPI(
    title="Nalco Material Properties Prediction API",
    description="API for predicting material properties (UTS, Elongation, Conductivity) based on production parameters",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus
Instrumentator().instrument(app).expose(app)

# Timezone
IST = timezone(timedelta(hours=5, minutes=30))

# Schemas
class InputData(BaseModel):
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
    rodQuenchWaterPressure: float

class PredictionResponse(BaseModel):
    uts: float
    elongation: float
    conductivity: float
    timestamp: str
    model_version: str

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, str]:
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(data: InputData):
    try:
        if model is None or scaler is None:
            logger.error("Model or scaler not loaded")
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Model not loaded")

        logger.info(f"Received prediction request: {data.dict()}")

        # Preprocess input
        X = np.array([[
            data.si, data.fe, data.metalTemp, data.castingWheelRpm,
            data.coolingWaterPressure, data.coolingWaterTemp, data.castBarEntryTemp,
            data.rollingMillRpm, data.emulsionTemp, data.emulsionPressure,
            data.rodQuenchWaterPressure
        ]])
        X_scaled = scaler.transform(X)

        # Predict
        prediction = model.predict(X_scaled)
        uts, elongation, conductivity = prediction[0]
        timestamp = datetime.now(IST).isoformat()

        response = {
            "uts": float(uts),
            "elongation": float(elongation),
            "conductivity": float(conductivity),
            "timestamp": timestamp,
            "model_version": "1.0.0"
        }

        logger.info(f"Prediction successful: {response}")

        # Save input and prediction to JSON
        try:
            result = {
                "input": data.dict(),
                "prediction": response
            }
            with open(LAST_PREDICTION_PATH, "w") as f:
                json.dump(result, f, indent=4)
            logger.info(f"Saved input and prediction to {LAST_PREDICTION_PATH}")
        except Exception as e:
            logger.error(f"Failed to save prediction to file: {str(e)}")

        return response

    except ValueError as e:
        logger.error(f"Value error during prediction: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    except Exception as e:
        logger.error(f"Unexpected error during prediction: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_config=None,
        access_log=True,
        timeout_keep_alive=60,
    )
