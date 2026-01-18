// API Configuration
// Automatically detects environment and uses appropriate backend URL

export const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://my-backend-zhh0.onrender.com"; 
