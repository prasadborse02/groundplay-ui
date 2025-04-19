import axios from 'axios';

// Define base URL - can be updated based on environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration or unauthorized access
    if (error.response) {
      // Log detailed error information in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.group('API Error');
        console.error('Status:', error.response.status);
        console.error('URL:', error.config.url);
        console.error('Method:', error.config.method.toUpperCase());
        
        if (error.response.data) {
          console.error('Error Code:', error.response.data.code || 'N/A');
          console.error('Error Message:', error.response.data.message || 'N/A');
        }
        
        console.error('Full Response:', error.response);
        console.groupEnd();
      }
      
      // Handle authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('playerId');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;