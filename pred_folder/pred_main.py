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
MODEL_PATH = os.getenv("MODEL_PATH", "Nalco/backend/optimized_random_forest_model.pkl")
SCALER_PATH = os.getenv("SCALER_PATH", "Nalco/backend/random_forest_scaler.pkl")

# Global variables to hold loaded models
model = None
scaler = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for resource management"""
    global model, scaler

    # Load model and scaler at startup
    try:
        logger.info("Loading model and scaler...")
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        logger.info("Model and scaler loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model or scaler: {str(e)}")
        raise

    yield

    # Clean up resources at shutdown
    logger.info("Shutting down application...")
    # No explicit cleanup needed for joblib models

app = FastAPI(
    title="Nalco Material Properties Prediction API",
    description="API for predicting material properties (UTS, Elongation, Conductivity) based on production parameters",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Prometheus instrumentation
Instrumentator().instrument(app).expose(app)

# Input validation model (no ranges now)
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

# Set IST timezone
IST = timezone(timedelta(hours=5, minutes=30))

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(data: InputData):
    """
    Predict material properties (UTS, Elongation, Conductivity) based on input parameters.

    Args:
        data: Input parameters for the prediction model

    Returns:
        Prediction results including UTS, Elongation, and Conductivity
    """
    try:
        if model is None or scaler is None:
            logger.error("Model or scaler not loaded")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model not loaded"
            )

        logger.info(f"Received prediction request: {data.dict()}")

        # Convert input to numpy array
        X = np.array([[
            data.si, data.fe, data.metalTemp, data.castingWheelRpm,
            data.coolingWaterPressure, data.coolingWaterTemp, data.castBarEntryTemp,
            data.rollingMillRpm, data.emulsionTemp, data.emulsionPressure,
            data.rodQuenchWaterPressure
        ]])

        # Scale the input
        X_scaled = scaler.transform(X)

        # Predict
        prediction = model.predict(X_scaled)

        # If your model predicts 3 values (UTS, Elongation, Conductivity)
        uts, elongation, conductivity = prediction[0]

        logger.info(f"Prediction successful: UTS={uts}, Elongation={elongation}, Conductivity={conductivity}")

        return {
            "uts": float(uts),
            "elongation": float(elongation),
            "conductivity": float(conductivity),
            "timestamp": datetime.now(IST).isoformat(),  # Local IST time
            "model_version": "1.0.0"
        }

    except ValueError as e:
        logger.error(f"Value error during prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error during prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_config=None,  # Use default logging config
        access_log=True,
        timeout_keep_alive=60,
    )
