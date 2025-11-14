/**
 * Utilitaire centralisé pour la gestion de l'authentification et des tokens JWT
 */

export const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') return false;
  if (token === 'null' || token === 'undefined') return false;
  
  // 🔥 SUPPORT POUR SANCTUM TOKENS (format: "user_id|token_plain_text")
  if (token.includes('|')) {
    console.log('🔐 Token Sanctum détecté, validation simplifiée');
    return token.length > 10; // Validation basique pour Sanctum
  }
  
  // Validation pour JWT standard (3 parties séparées par des points)
  const parts = token.split('.');
  return parts.length === 3;
};

export const setAuthToken = (token) => {
  if (!token || typeof token !== 'string') {
    console.error('Tentative de stockage d\'un token invalide:', token);
    return false;
  }
  
  clearAuthTokens();
  
  // 🔥 TOUJOURS utiliser localStorage
  localStorage.setItem('auth_token', token);
  localStorage.setItem('token', token);
  
  console.log('✅ Token stocké dans localStorage');
  return true;
};

// 🔥 AJOUTER une fonction spécifique pour vérifier les tokens Sanctum
export const isSanctumToken = (token) => {
  return token && typeof token === 'string' && token.includes('|');
};

// 🔥 MODIFIER decodeJWT pour gérer les tokens Sanctum
export const decodeJWT = (token) => {
  try {
    if (!isValidJWT(token)) return null;
    
    // Si c'est un token Sanctum, retourner des informations basiques
    if (isSanctumToken(token)) {
      const parts = token.split('|');
      return {
        user_id: parts[0],
        token_type: 'sanctum',
        exp: null // Les tokens Sanctum n'ont pas d'expiration par défaut
      };
    }
    
    // Pour les vrais JWT, garder le décodage original
    const parts = token.split('.');
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};

// 🔥 MODIFIER isTokenExpired pour les tokens Sanctum
export const isTokenExpired = (token) => {
  try {
    const payload = decodeJWT(token);
    if (!payload) return true;
    
    // Les tokens Sanctum n'ont pas d'expiration par défaut
    if (payload.token_type === 'sanctum') {
      return false; // On considère qu'ils ne expirent pas
    }
    
    if (!payload.exp) return true;
    
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Erreur lors de la vérification d\'expiration:', error);
    return true;
  }
};

export const getAuthToken = () => {
  const tokenSources = [
    localStorage.getItem('auth_token'),
    localStorage.getItem('token'),
    sessionStorage.getItem('auth_token'),
    sessionStorage.getItem('token')
  ];
  
  const token = tokenSources.find(t => {
    if (!t || t === 'null' || t === 'undefined') return false;
    return true;
  });
  
  if (!token) {
    console.warn('Aucun token valide trouvé dans le stockage');
    return null;
  }
  
  console.log('🔑 Token récupéré:', token.substring(0, 20) + '...');
  return token;
};

export const clearAuthTokens = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_data');
  localStorage.removeItem('user_role');
  localStorage.removeItem('token');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('token');
};

// authUtils.jsx - VERSION CORRIGÉE
export const checkAuthentication = () => {
  const token = getAuthToken();
  
  if (!token) {
    return {
      isValid: false,
      token: null,
      error: 'Token manquant'
    };
  }
  
  // Vérifier l'expiration seulement pour les JWT standards
  if (!isSanctumToken(token) && isTokenExpired(token)) {
    console.warn('Token expiré');
    clearAuthTokens();
    return {
      isValid: false,
      token: null,
      error: 'Token expiré'
    };
  }
  
  // 🔥 CRITIQUE: Ne pas bloquer si le token est valide mais userData manquant
  const userData = getCurrentUser();
  const userRole = localStorage.getItem('user_role');
  
  // Token valide = accès autorisé, même si userData est incomplet
  return {
    isValid: true,
    token: token,
    user: userData,
    role: userRole,
    error: null
  };
};

export const redirectToLogin = (delay = 1000) => {
  console.log('Redirection vers la page de connexion...');
  clearAuthTokens();
  
  setTimeout(() => {
    if (!window.location.pathname.includes('/connexion')) {
      window.location.href = '/connexion';
    }
  }, delay);
};

// 🔥 CORRECTION: Récupérer l'utilisateur de manière plus flexible
export const getCurrentUser = () => {
  try {
    // Essayer d'abord user_data (stocké par AdminLoginForm)
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    
    // Ensuite essayer user (stocké par d'autres formulaires)
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos utilisateur:', error);
    return null;
  }
};

// 🔥 CORRECTION: Stocker l'utilisateur de manière standardisée
export const setCurrentUser = (user) => {
  try {
    // Stocker dans les deux formats pour compatibilité
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Erreur lors du stockage des infos utilisateur:', error);
  }
};

export const logout = () => {
  clearAuthTokens();
  window.location.href = '/connexion';
};

// 🔥 NOUVEAU: Fonction pour vérifier si l'utilisateur est admin
export const isAdmin = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole === 'admin';
};

// 🔥 NOUVEAU: Fonction pour vérifier si l'utilisateur est vendeur
export const isVendeur = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole === 'vendeur' || !userRole; // Par défaut si pas de rôle
};