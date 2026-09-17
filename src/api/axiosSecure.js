import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://etutionbdserver.vercel.app/api';

export const axiosSecure = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT authorization token to outgoing requests
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 & 403 authorization failures
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('AxiosSecure encountered authorization error:', error.response.status);
      // Optional: Clear expired token
    }
    return Promise.reject(error);
  }
);
