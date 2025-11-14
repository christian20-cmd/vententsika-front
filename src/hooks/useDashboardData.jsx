import { useState, useEffect } from 'react';
import api from '../../../utils/axiosConfig';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token') || 
                   localStorage.getItem('admin_token') || 
                   localStorage.getItem('token');

      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé');
      }

      console.log('🔐 Token utilisé:', token);

      // 🔥 CORRECTION : Retirer withCredentials si vous utilisez des tokens dans les headers
      const response = await api.get('/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
        // 🔥 RETIRER avecCredentials si vous utilisez Authorization header
        // withCredentials: true // ← COMMENTEZ ou RETIREZ cette ligne
      });

      if (response.data.success) {
        console.log('🎉 Dashboard chargé avec succès', response.data.data);
        setDashboardData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erreur inconnue');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error('❌ Erreur dashboard:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        window.location.href = '/admin/connexion';
      }
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