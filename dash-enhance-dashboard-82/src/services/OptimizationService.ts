
import { API_CONFIG } from "@/config/api";

export interface OptimizationParams {
  uts: number;
  elongation: number;
  conductivity: number;
}

export interface OptimizationState {
  status: string;
  current_parameters: Record<string, number>;
  original_value: number[];
  actual_prediction: {
    UTS: number;
    Elongation: number;
    Conductivity: number;
  };
  optimizable_parameters: { name: string; current_value: number }[];
  history_length: number;
}

export interface OptimizationResult {
  status: string;
  optimized_parameter: string;
  error_metrics: {
    original_error: number;
    optimized_error: number;
    error_reduction: number;
  };
  predictions: {
    before_optimization: {
      uts: number;
      elongation: number;
      conductivity: number;
    };
    after_optimization: {
      uts: number;
      elongation: number;
      conductivity: number;
    };
  };
  parameter_changes: {
    [key: string]: {
      original_value: number;
      optimized_value: number;
      absolute_change: number;
      percentage_change: number;
    };
  };
  all_parameters: Record<string, number>;
}

const OPTIMIZATION_API_URL = 'http://127.0.0.1:8002';

export const OptimizationService = {
  async getCurrentState(): Promise<OptimizationState> {
    try {
      const response = await fetch(`${OPTIMIZATION_API_URL}/api/current_state`);
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to get current state:", error);
      throw error;
    }
  },

  async setDesiredValues(values: OptimizationParams): Promise<{ message: string; desired_values: number[] }> {
    try {
      const response = await fetch(`${OPTIMIZATION_API_URL}/api/set_desired`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to set desired values:", error);
      throw error;
    }
  },

  async optimize(parameter: string): Promise<OptimizationResult> {
    try {
      const response = await fetch(`${OPTIMIZATION_API_URL}/api/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parameter }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to optimize:", error);
      throw error;
    }
  },

  async undo(): Promise<{ message: string; current_parameters: Record<string, number> }> {
    try {
      const response = await fetch(`${OPTIMIZATION_API_URL}/api/undo`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to undo:", error);
      throw error;
    }
  },

  async reset(): Promise<{ message: string; parameters: Record<string, number> }> {
    try {
      const response = await fetch(`${OPTIMIZATION_API_URL}/api/reset`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to reset:", error);
      throw error;
    }
  },

  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${OPTIMIZATION_API_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to check API health:", error);
      throw error;
    }
  }
};