// hooks/useHistogramData.js
import { useState, useEffect } from 'react';

export const useHistogramData = (period = '30days') => {
  const [histogramData, setHistogramData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistogramData = async (selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8000/api/analytics/sales-histogram?date_range=${selectedPeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données histogramme');
      }

      const result = await response.json();
      
      if (result.success) {
        setHistogramData(result.data);
      } else {
        throw new Error(result.message || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur histogramme:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistogramData(period);
  }, [period]);

  return { histogramData, loading, error, refetch: fetchHistogramData };
};