import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig, AxiosError } from 'axios';

// -----------------------------------------------------------------------------
// 1. Configuration
// -----------------------------------------------------------------------------

// Define the base URL for your backend API
// Use environment variables for production readiness (e.g., VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// -----------------------------------------------------------------------------
// 2. Create the Axios Instance
// -----------------------------------------------------------------------------

const axiosService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Request timeout (10 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------------------
// 3. Interceptors (Optional but highly recommended)
// -----------------------------------------------------------------------------

// --- Request Interceptor ---
// Use this to modify requests globally (e.g., adding an Authorization token)
axiosService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example: Add an Authorization header if a token exists in local storage
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors (e.g., network issues)
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Use this to handle responses globally (e.g., refreshing tokens, handling 401 errors)
axiosService.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lies within the range of 2xx cause this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);

      // Example: Global handler for unauthorized requests
      // if (error.response.status === 401) {
      //   // Redirect to login or refresh token
      //   console.log('Unauthorized - redirecting...');
      // }
    } else if (error.request) {
      // The request was made but no response was received (e.g., timeout, network down)
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error in request setup:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosService;
