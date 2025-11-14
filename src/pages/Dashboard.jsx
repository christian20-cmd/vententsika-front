import React, { useState, useEffect, useRef } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import { RefreshCwIcon, TrendingUp, CheckCircleIcon, XIcon } from 'lucide-react';

// Import des composants
import MetricCard from '../components/dashboard/MetricCard';
import ChartRenderer from '../components/dashboard/ChartRenderer';
import DonutChart from '../components/dashboard/DonutChart';
import ProductCard from '../components/dashboard/ProductCard';
import AlertCard from '../components/dashboard/AlertCard';
import StockStatsCard from '../components/dashboard/StockStatsCard';
import PeriodSelector from '../components/dashboard/PeriodSelector';
import ChartControls from '../components/dashboard/ChartControls';
import Profils from './Profils';

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [histogramLoading, setHistogramLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('revenue');
  const [graphView, setGraphView] = useState('area');
  const [showAlerts, setShowAlerts] = useState(false);
  
  const alertRef = useRef(null);

  // Fonction pour récupérer les données du dashboard
  const fetchAnalytics = async (period) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/analytics/dashboard?date_range=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
      } else {
        throw new Error(result.message || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
      console.error('Erreur analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les données de l'histogramme
  const fetchHistogramData = async (period) => {
    try {
      setHistogramLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/analytics/combined-histogram?date_range=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const fallbackResponse = await fetch(`http://localhost:8000/api/analytics/sales-histogram?date_range=${period}&view_type=daily`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!fallbackResponse.ok) {
          throw new Error('Erreur lors de la récupération de l\'histogramme');
        }
        
        const fallbackResult = await fallbackResponse.json();
        setHistogramData({ daily: fallbackResult.data, monthly: null });
      } else {
        const result = await response.json();
        if (result.success) {
          setHistogramData(result.data);
        } else {
          throw new Error(result.message || 'Erreur inconnue');
        }
      }
    } catch (err) {
      console.error('Erreur histogramme:', err);
    } finally {
      setHistogramLoading(false);
    }
  };

  // Fermer les alertes en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setShowAlerts(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchAnalytics(selectedPeriod),
        fetchHistogramData(selectedPeriod)
      ]);
    };
    loadData();
  }, [selectedPeriod]);

  // Fonction pour rafraîchir toutes les données
  const refreshAllData = async () => {
    setLoading(true);
    setHistogramLoading(true);
    await Promise.all([
      fetchAnalytics(selectedPeriod),
      fetchHistogramData(selectedPeriod)
    ]);
  };

  // Données simulées pour le développement
  const mockData = {
    periode: {
      date_debut: '2024-01-01',
      date_fin: '2024-01-31',
      periode_type: '30days'
    },
    metriques_principales: {
      chiffre_affaires: { valeur: 125430, croissance: 12.5, tendance: 'positive' },
      commandes_total: { valeur: 342, croissance: 8.2, tendance: 'positive' },
      clients_actifs: { valeur: 156, croissance: -2.1, tendance: 'negative' },
      produits_vendus: { valeur: 892, croissance: 15.7, tendance: 'positive' }
    },
    produits_performants: [
      { produit: 'Produit A', quantite_vendue: 45, revenu_total: 22500 },
      { produit: 'Produit B', quantite_vendue: 38, revenu_total: 19000 },
      { produit: 'Produit C', quantite_vendue: 32, revenu_total: 16000 },
      { produit: 'Produit D', quantite_vendue: 28, revenu_total: 14000 }
    ],
    alertes_stock: [
      { produit: 'PC Gamer Test', quantite_restante: 0, statut: 'rupture', type: 'rupture_stock', seuil_alerte: 5 },
      { produit: 'Cartables', quantite_restante: 0, statut: 'rupture', type: 'rupture_stock', seuil_alerte: 0 },
      { produit: 'Ordinateur', quantite_restante: 3, statut: 'faible', type: 'stock_faible', seuil_alerte: 5 }
    ],
    statistiques_stock_detaillees: {
      valeur_stocks_faibles: 14100000,
      valeur_stocks_rupture: 9150000,
      produits_en_alerte: [
        { produit: 'PC Gamer Test', statut: 'Rupture', quantite: 0, seuil_alerte: 5, valeur: 9150000, urgence: 'haute' },
        { produit: 'Cartables', statut: 'Rupture', quantite: 0, seuil_alerte: 0, valeur: 0, urgence: 'haute' },
        { produit: 'Ordinateur', statut: 'Faible', quantite: 3, seuil_alerte: 5, valeur: 14100000, urgence: 'moyenne' }
      ],
      total_produits_alerte: 3,
      impact_financier_total: 23250000
    }
  };

  // Données simulées pour l'histogramme
  const mockHistogramData = {
    daily: {
      ventes_quotidiennes: {
        labels: ["30/09", "01/10", "02/10", "03/10", "04/10", "05/10", "06/10", "07/10", "08/10", "09/10", "10/10", "11/10", "12/10", "13/10", "14/10", "15/10", "16/10", "17/10", "18/10", "19/10", "20/10", "21/10", "22/10", "23/10", "24/10", "25/10", "26/10", "27/10", "28/10", "29/10", "30/10", "31/10"],
        datasets: [{
          label: "Chiffre d'Affaires (€)",
          data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5500000,18700000,25850000,0,0],
          backgroundColor: "#3B82F6",
          borderColor: "#1D4ED8",
          borderWidth: 1
        }]
      },
      commandes_quotidiennes: {
        labels: ["30/09", "01/10", "02/10", "03/10", "04/10", "05/10", "06/10", "07/10", "08/10", "09/10", "10/10", "11/10", "12/10", "13/10", "14/10", "15/10", "16/10", "17/10", "18/10", "19/10", "20/10", "21/10", "22/10", "23/10", "24/10", "25/10", "26/10", "27/10", "28/10", "29/10", "30/10", "31/10"],
        datasets: [{
          label: "Nombre de Commandes",
          data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,1,0,0],
          backgroundColor: "#10B981",
          borderColor: "#047857",
          borderWidth: 1
        }]
      }
    },
    monthly: {
      ventes_mensuelles: {
        labels: ["Septembre 2025", "Octobre 2025"],
        datasets: [{
          label: "Chiffre d'Affaires (€)",
          data: [0, 50050000],
          backgroundColor: "#3B82F6",
          borderColor: "#1D4ED8",
          borderWidth: 1
        }]
      },
      commandes_mensuelles: {
        labels: ["Septembre 2025", "Octobre 2025"],
        datasets: [{
          label: "Nombre de Commandes",
          data: [0, 17],
          backgroundColor: "#10B981",
          borderColor: "#047857",
          borderWidth: 1
        }]
      }
    }
  };

  const data = analyticsData || mockData;
  const histogram = histogramData || mockHistogramData;

  // Skeleton Loading amélioré
  if (loading && !analyticsData) {
    return (
      <div className="min-h-screen">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar Skeleton */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl h-96 animate-pulse"></div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Period Selector Skeleton */}
            <div className="flex justify-end mb-4">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
                ))}
                <div className="h-10 w-28 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>

            {/* Metrics Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
              {/* 4 Metric Cards */}
              <div className="lg:col-span-2 xl:col-span-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl p-4 shadow-lg animate-pulse">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-lg"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Card Skeleton */}
              <div className="lg:col-span-1 xl:col-span-2">
                <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-3xl p-4 shadow-2xl h-full animate-pulse">
                  <div className="h-5 bg-blue-600 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-blue-600 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Skeleton */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-6 shadow-lg animate-pulse">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-2">
                      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32"></div>
                    </div>
                    <div className="w-40 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
                  </div>
                  <div className="h-80 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-2xl"></div>
                </div>
              </div>

              {/* Donut Chart Skeleton */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-4 shadow-lg animate-pulse flex-1">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex items-center justify-center h-64">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"></div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-purple-300 rounded"></div>
                        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button 
            onClick={() => fetchAnalytics(selectedPeriod)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const alertCount = data.alertes_stock ? data.alertes_stock.length : 0;

  return (
    <div className="">
      <div className='flex justify-between items-center'>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tableau de Bord Analytics</h1>
            <p className="text-gray-600">
              Période du {data.periode.date_debut} au {data.periode.date_fin}
            </p>
          </div>
        {/* Bouton de notification des alertes */}
            <div className="relative" ref={alertRef}>
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BellIcon className="w-6 h-6" />
                  {alertCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {alertCount}
                    </span>
                  )}
                </button>

                {/* Popup des alertes */}
                {showAlerts && (
                  <div className="absolute right-4 top-12 w-[30rem] bg-white  rounded-3xl shadow-2xl shadow-black z-50 max-h-[25rem] overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-semibold text-gray-900">Alertes Stock</h3>
                      

                        <button
                          onClick={() => setShowAlerts(false)}
                          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
                        
                        >
                          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
                        </button>
                      </div>
                       {/* Analyse des stocks */}
                        <div className="lg:col-span-3">
                          {data.statistiques_stock_detaillees && (
                            <StockStatsCard stats={data.statistiques_stock_detaillees} />
                          )}
                        </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alertCount} alerte{alertCount > 1 ? 's' : ''} active{alertCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {alertCount > 0 ? (
                        data.alertes_stock.map((alert, index) => (
                          <AlertCard
                            key={`${alert.produit}-${index}`}
                            product={alert.produit}
                            quantity={alert.quantite_restante}
                            statut={alert.statut}
                            type={alert.type}
                            seuil_alerte={alert.seuil_alerte}
                            index={index}
                          />
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-sm">Aucune alerte stock</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
          </div>
     
      {/* Layout principal avec sidebar Profils et contenu Dashboard */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        
        {/* Sidebar Profils */}
        <div className="lg:w-80 flex-shrink-0">
          <Profils />
        </div>

        {/* Contenu principal du Dashboard */}
        <div className="flex-1 min-w-0 ">
          
          {/* Header */}
          <div className="flex flex-col  place-self-end sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            

            <div className="flex items-center gap-4">
              {/* Sélecteur de période */}
              <PeriodSelector 
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                onRefresh={refreshAllData}
                loading={loading || histogramLoading}
              />
              
              
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
            {/* Métriques principales en 2 colonnes sur mobile, 3 sur desktop */}
            <div className="lg:col-span-2 xl:col-span-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Chiffre d'Affaires"
                  value={data.metriques_principales.chiffre_affaires.valeur}
                  growth={data.metriques_principales.chiffre_affaires.croissance}
                  trend={data.metriques_principales.chiffre_affaires.tendance}
                  icon={CurrencyDollarIcon}
                  format="currency"
                />
                <MetricCard
                  title="Commandes Total"
                  value={data.metriques_principales.commandes_total.valeur}
                  growth={data.metriques_principales.commandes_total.croissance}
                  trend={data.metriques_principales.commandes_total.tendance}
                  icon={ShoppingBagIcon}
                />
                <MetricCard
                  title="Clients Actifs"
                  value={data.metriques_principales.clients_actifs.valeur}
                  growth={data.metriques_principales.clients_actifs.croissance}
                  trend={data.metriques_principales.clients_actifs.tendance}
                  icon={UserGroupIcon}
                />
                <MetricCard
                  title="Produits Vendus"
                  value={data.metriques_principales.produits_vendus.valeur}
                  growth={data.metriques_principales.produits_vendus.croissance}
                  trend={data.metriques_principales.produits_vendus.tendance}
                  icon={ChartBarIcon}
                />
              </div>
            </div>

            {/* Performance Générale - Toujours visible à droite */}
            <div className="lg:col-span-1 xl:col-span-2">
              <div className=" shadow-2xl shadow-blue-800 bg-blue-800 rounded-3xl p-4 text-white h-full">
                <h3 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance Générale
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Période:</span>
                    <span className="capitalize">{selectedPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Données:</span>
                    <span>{analyticsData ? 'Live' : 'Mock'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière MAJ:</span>
                    <span>{new Date().toLocaleTimeString('fr-FR')}</span>
                  </div>
                  {data.statistiques_stock_detaillees && (
                    <div className="flex justify-between">
                      <span>Alertes actives:</span>
                      <span>{data.statistiques_stock_detaillees.total_produits_alerte || 0}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Produits analysés:</span>
                    <span>{data.produits_performants ? data.produits_performants.length : 0}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Section principale avec les 3 composants en une ligne */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Tendances des Ventes */}
            <div className="lg:col-span-2">
              <div className=" h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Tendances des Ventes</h2>
                    <p className="text-gray-600 text-sm">
                      {histogramLoading ? 'Chargement...' : 'Données en temps réel'}
                    </p>
                  </div>
                  
                  <ChartControls
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                    graphView={graphView}
                    onGraphViewChange={setGraphView}
                  />
                </div>
                
                {histogramLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <ChartRenderer 
                    data={histogram} 
                    type={chartType}
                    viewType={selectedPeriod === '30days' || selectedPeriod === '90days' ? 'daily' : 'monthly'}
                    graphView={graphView}
                  />
                )}
              </div>
            </div>

            {/* Répartition des Ventes */}
            <div className="flex flex-col gap-4 ">
              <div className="bg-white hover:bg-gradient-to-b from-blue-50 via-blue-100 to-blue-900 rounded-3xl p-4 shadow-lg h-full flex flex-col hover:transition-all duration-300">
                <h2 className="text-lg font-bold text-gray-900">Répartition des Ventes</h2>
                <div className="flex-1">
                  <DonutChart products={data.produits_performants} />
                </div>
              </div>

             
            </div>
          </div>

            
        </div>
      </div>
    </div>
  );
};

export default Dashboard;