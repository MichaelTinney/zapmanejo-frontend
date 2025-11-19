import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL,
});

// Attach Authorization header from localStorage for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 clear auth and dispatch a custom event so
// the app (AuthProvider) can handle logout and navigation in-app.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        // ignore localStorage errors
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:auth-logout', {
          detail: { reason: 'unauthorized' },
        }));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
