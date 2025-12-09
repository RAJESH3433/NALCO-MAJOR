
// API Configuration

// Base URL for the prediction API
export const API_CONFIG = {
  // Change this URL to match your actual API endpoint
  BASE_URL: "http://localhost",
  
  // API endpoints
  ENDPOINTS: {
    PREDICT: "/predict",
    REVERSE_PREDICT: "/reverse-predict",
    HEALTH: "/health"
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000
};