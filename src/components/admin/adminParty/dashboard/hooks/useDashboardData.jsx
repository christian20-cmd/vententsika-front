import { useState, useEffect } from 'react';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // DEBUG: Vérifiez tous les tokens disponibles
      const tokens = {
        auth_token: localStorage.getItem('auth_token'),
        admin_token: localStorage.getItem('admin_token'),
        token: localStorage.getItem('token'),
      };
      console.log('🔍 Tokens disponibles:', tokens);

      const token = tokens.auth_token || tokens.admin_token || tokens.token;

      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé');
      }

      console.log('🔐 Token utilisé:', token);

      // Utilisez fetch mais avec la même configuration que curl
      const response = await fetch('http://localhost:8000/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // 'Content-Type': 'application/json', // Peut causer des problèmes CORS
        },
        credentials: 'include' // Important pour les cookies de session
      });

      console.log('📊 Dashboard response status:', response.status);
      console.log('📊 Dashboard response headers:', response.headers);

      if (response.status === 401) {
        localStorage.clear();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Réponse erreur:', errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('📦 Données reçues:', result);

      if (result.success) {
        console.log('🎉 Dashboard chargé avec succès');
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur dashboard complète:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { 
    dashboardData, 
    loading, 
    error, 
    refetch: fetchDashboardData 
  };
};