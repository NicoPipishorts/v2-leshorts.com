import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  withCredentials: true,
});

// Optional interceptors
api.interceptors.request.use((config) => {
  // Attach auth tokens, etc.
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Centralized error handling
    return Promise.reject(err);
  },
);
