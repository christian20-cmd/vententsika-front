// hooks/useLogout.js
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async (userType = 'admin') => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      // Appel API de déconnexion avec timeout
      if (token) {
        const endpoint = userType === 'admin' 
          ? 'http://localhost:8000/api/admin/logout'
          : 'http://localhost:8000/api/logout';

        const logoutPromise = fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        await Promise.race([logoutPromise, timeoutPromise]);
      }

      // Nettoyage des données
      clearUserData();
      
      // Redirection
      const redirectPath = userType === 'admin' ? '/admin/connexion' : '/connexion';
      
      setTimeout(() => {
        navigate(redirectPath, { 
          replace: true,
          state: { fromLogout: true }
        });
      }, 200);

    } catch (error) {
      console.warn('Déconnexion forcée:', error);
      clearUserData();
      
      setTimeout(() => {
        navigate(userType === 'admin' ? '/admin/connexion' : '/connexion', { 
          replace: true,
          state: { fromLogout: true, error: 'forced' }
        });
      }, 200);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const clearUserData = () => {
    const itemsToRemove = [
      'auth_token',
      'user_data', 
      'user_role',
      'token',
      'admin_token',
      'last_activity',
      'vendeur_data'
    ];
    
    itemsToRemove.forEach(key => localStorage.removeItem(key));
    sessionStorage.clear();
  };

  return { logout, isLoggingOut };
};