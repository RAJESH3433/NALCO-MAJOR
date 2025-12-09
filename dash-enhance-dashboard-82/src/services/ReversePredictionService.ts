import { API_CONFIG } from "@/config/api";

// Input parameters from the form
export interface ReversePredictionInput {
  uts: number;
  elongation: number;
  conductivity: number;
}

// Response from the API
export interface ReversePredictionResult {
  si: number;
  fe: number;
  metalTemp: number;
  castingWheelRpm: number;
  coolingWaterPressure: number;
  coolingWaterTemp: number;
  castBarEntryTemp: number;
  rollingMillRpm: number;
  emulsionTemp: number;
  emulsionPressure: number;
  timestamp: string;
  model_version: string;
}

const BASE_URL = "http://localhost:8001";

export class ReversePredictionService {
  // Check if the API is available
  static async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "unavailable" };
    }
  }

  // Make a reverse prediction request
  static async predict(input: ReversePredictionInput): Promise<ReversePredictionResult> {
    // Ensure inputs are treated as decimals (floats)
    const parsedInput: ReversePredictionInput = {
      uts: parseFloat(input.uts.toString()), // Make sure it is treated as a float
      elongation: parseFloat(input.elongation.toString()),
      conductivity: parseFloat(input.conductivity.toString())
    };

    const response = await fetch(`${BASE_URL}/reverse-predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedInput), // Send the parsed input as JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }

    return await response.json();
  }
}
