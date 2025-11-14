import axios from 'axios';

// 🔥 CORRECTION : URL dynamique selon l'environnement
const getBaseURL = () => {
  // En développement
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api';
  }
  // En production - utilise la variable d'environnement
  return import.meta.env.VITE_API_URL || 'https://votre-backend.herokuapp.com/api';
};

// Configuration de base d'axios
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: true, // Important pour les cookies de session
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    // Chercher dans tous les storage possibles
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('token') ||
                  sessionStorage.getItem('auth_token') ||
                  sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token ajouté aux headers:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ Aucun token trouvé pour la requête API');
    }
    
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    
    return config;
  },
  (error) => {
    console.error('❌ Erreur intercepteur request:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour mieux gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API reçue:', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    // Gestion spécifique des erreurs CORS et réseau
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error('🌐 Erreur réseau - Vérifiez la connexion et l\'URL du backend');
    }
    
    return Promise.reject(error);
  }
);

export default api;