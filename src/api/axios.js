import axios from 'axios';
import { getAuthToken, redirectToLogin } from '../utils/authUtils';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['Accept'] = 'application/json';
    
    // 🔥 NE PAS FORCER Content-Type - Laisser Axios le définir automatiquement
    // Axios définira automatiquement 'multipart/form-data' pour FormData
    // et 'application/json' pour les objets JavaScript
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Erreur 401 - Redirection vers la connexion');
      redirectToLogin(1000);
    }
    return Promise.reject(error);
  }
);

export default api;