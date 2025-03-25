import axios from 'axios';

// Create an instance of axios with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const { token } = JSON.parse(adminInfo);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Fix URL path to ensure it includes /api for admin routes
    // This is critical because the backend routes are configured at /api/admin/*
    if (config.url.startsWith('/admin') && !config.url.startsWith('/api/admin')) {
      config.url = '/api' + config.url;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If error is 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Handle token expiration or auth issues
      localStorage.removeItem('adminInfo');
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api;
