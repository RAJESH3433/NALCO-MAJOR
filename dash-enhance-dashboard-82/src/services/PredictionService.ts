import { toast } from "@/hooks/use-toast";

export interface PredictionInput {
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
  rodQuenchWaterPressure: number;
}

export interface PredictionResult {
  uts: number;
  elongation: number;
  conductivity: number;
  timestamp: string;
  model_version: string;
}

const BASE_URL = "http://localhost:8000"; // ✅ Your API base URL

export const PredictionService = {
  async predict(input: PredictionInput): Promise<PredictionResult> {
    try {
      const response = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  },

  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Health check error:", error);
      return { status: "unavailable" };
    }
  }
};
