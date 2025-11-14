import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, TrendingUp, Activity, UserCheck, Clock, AlertCircle, Check, X, RefreshCw, Database, Shield, Zap, BarChart3 } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import api from '../../api/axios';
import DashboardAdminLayout from '../../components/admin/DashboardAdminLayout';

const DashboardAdmin = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les données du dashboard principal
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/admin/dashboard');
      
      if (response.data.success) {
        setDashboardData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Charger les statistiques détaillées avec l'histogramme
  const fetchDetailedStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/statistiques-detaillees');
      if (response.data.success) {
        setDetailedStats(response.data.data);
      }
    } catch (err) {
      console.error('Erreur chargement stats détaillées:', err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchDashboardData(),
        fetchDetailedStats()
      ]);
    };

    loadAllData();
    
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour rafraîchir toutes les données
  const refreshAllData = () => {
    fetchDashboardData();
    fetchDetailedStats();
  };

  if (loading) {
    return (
      <DashboardAdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement du dashboard...</p>
          </div>
        </div>
      </DashboardAdminLayout>
    );
  }

  if (error) {
    return (
      <DashboardAdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refreshAllData}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Réessayer
          </button>
        </div>
      </DashboardAdminLayout>
    );
  }

  const { 
    metriques_principales, 
    activite_temps_reel, 
    repartition_roles,
    demandes_attente,
    performance_systeme,
    admin_connecte
  } = dashboardData;

  // Données pour l'histogramme (12 derniers mois)
  const histogramData = detailedStats?.histogramme_inscriptions || [];

  // Données pour l'Area Chart basées sur les statistiques 7 derniers jours
  // Utilisation des données des métriques principales pour les 7 derniers jours
  const evolutionData = [
    { jour: 'J-6', admins: metriques_principales?.administrateurs?.nouveaux_7j || 0, vendeurs: metriques_principales?.vendeurs?.nouveaux_7j || 0 },
    { jour: 'J-5', admins: Math.round((metriques_principales?.administrateurs?.nouveaux_7j || 0) * 0.7), vendeurs: Math.round((metriques_principales?.vendeurs?.nouveaux_7j || 0) * 0.8) },
    { jour: 'J-4', admins: Math.round((metriques_principales?.administrateurs?.nouveaux_7j || 0) * 0.5), vendeurs: Math.round((metriques_principales?.vendeurs?.nouveaux_7j || 0) * 0.6) },
    { jour: 'J-3', admins: Math.round((metriques_principales?.administrateurs?.nouveaux_7j || 0) * 0.3), vendeurs: Math.round((metriques_principales?.vendeurs?.nouveaux_7j || 0) * 0.4) },
    { jour: 'J-2', admins: Math.round((metriques_principales?.administrateurs?.nouveaux_7j || 0) * 0.2), vendeurs: Math.round((metriques_principales?.vendeurs?.nouveaux_7j || 0) * 0.3) },
    { jour: 'J-1', admins: Math.round((metriques_principales?.administrateurs?.nouveaux_7j || 0) * 0.1), vendeurs: Math.round((metriques_principales?.vendeurs?.nouveaux_7j || 0) * 0.2) },
    { jour: 'Auj.', admins: Math.round((metriques_principales?.administrateurs?.nouveaux_7j || 0) * 0.05), vendeurs: Math.round((metriques_principales?.vendeurs?.nouveaux_7j || 0) * 0.1) }
  ];

  // Données pour le Donut Chart basées sur la répartition réelle
  const donutDataAdmins = [
    { 
      name: 'Super Admin', 
      value: repartition_roles?.administrateurs?.super_admin || 0, 
      color: '#ef4444' 
    },
    { 
      name: 'Admin', 
      value: repartition_roles?.administrateurs?.admin || 0, 
      color: '#3b82f6' 
    },
    { 
      name: 'Modérateur', 
      value: repartition_roles?.administrateurs?.moderateur || 0, 
      color: '#10b981' 
    }
  ];

  const donutDataVendeurs = [
    { 
      name: 'Validés', 
      value: repartition_roles?.vendeurs?.valides || 0, 
      color: '#10b981' 
    },
    { 
      name: 'En attente', 
      value: repartition_roles?.vendeurs?.en_attente || 0, 
      color: '#f59e0b' 
    },
    { 
      name: 'Rejetés', 
      value: repartition_roles?.vendeurs?.rejetes || 0, 
      color: '#ef4444' 
    }
  ];

  // Fonctions pour gérer les actions sur les demandes
  const handleApproveDemande = async (id, type) => {
    try {
      await api.post(`/admin/demandes/${id}/valider`);
      refreshAllData(); // Recharger toutes les données
    } catch (err) {
      console.error('Erreur validation:', err);
      alert('Erreur lors de la validation');
    }
  };

  const handleRejectDemande = async (id, type) => {
    try {
      await api.post(`/admin/demandes/${id}/rejeter`);
      refreshAllData(); // Recharger toutes les données
    } catch (err) {
      console.error('Erreur rejet:', err);
      alert('Erreur lors du rejet');
    }
  };

  return (
    <DashboardAdminLayout>
      <div className="space-y-6">
        {/* En-tête avec info admin */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrateur</h1>
            <p className="text-gray-600 mt-1">
              Bienvenue, <span className="font-semibold">{admin_connecte?.nom_complet || 'Administrateur'}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {admin_connecte?.niveau_acces || 'Admin'}
              </span>
            </p>
          </div>
          <button
            onClick={refreshAllData}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Administrateurs */}
          <MetricCard
            title="Administrateurs"
            value={metriques_principales?.administrateurs?.total || 0}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            stats={[
              { 
                label: 'En ligne', 
                value: metriques_principales?.administrateurs?.en_ligne || 0 
              },
              { 
                label: 'Nouveaux (7j)', 
                value: metriques_principales?.administrateurs?.nouveaux_7j || 0 
              },
              { 
                label: 'Taux activation', 
                value: `${metriques_principales?.administrateurs?.taux_activation || 0}%` 
              }
            ]}
            variation={metriques_principales?.administrateurs?.variation || 0}
          />

          {/* Vendeurs */}
          <MetricCard
            title="Vendeurs"
            value={metriques_principales?.vendeurs?.total || 0}
            icon={<ShoppingBag className="w-6 h-6" />}
            color="green"
            stats={[
              { 
                label: 'En ligne', 
                value: metriques_principales?.vendeurs?.en_ligne || 0 
              },
              { 
                label: 'Nouveaux (7j)', 
                value: metriques_principales?.vendeurs?.nouveaux_7j || 0 
              },
              { 
                label: 'Taux activation', 
                value: `${metriques_principales?.vendeurs?.taux_activation || 0}%` 
              }
            ]}
            variation={metriques_principales?.vendeurs?.variation || 0}
          />

          {/* Demandes en attente */}
          <MetricCard
            title="Demandes en attente"
            value={demandes_attente?.total_demandes || 0}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
            stats={[
              { 
                label: 'Admins', 
                value: demandes_attente?.admins?.length || 0 
              },
              { 
                label: 'Vendeurs', 
                value: demandes_attente?.vendeurs?.length || 0 
              }
            ]}
            alert={(demandes_attente?.total_demandes || 0) > 5}
          />

          {/* Performance système */}
          <MetricCard
            title="Performance système"
            value={`${performance_systeme?.performance?.temps_reponse_moyen || 0}ms`}
            icon={<Zap className="w-6 h-6" />}
            color="purple"
            stats={[
              { 
                label: 'Statut', 
                value: performance_systeme?.performance?.statut || 'N/A' 
              },
              { 
                label: 'BDD', 
                value: performance_systeme?.base_donnees?.taille_totale || 'N/A' 
              }
            ]}
          />
        </div>

        {/* Graphiques - Évolution et Histogramme */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart - Évolution des 7 derniers jours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Activité récente (7 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorAdmins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorVendeurs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="jour" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="admins" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorAdmins)" 
                  name="Admins"
                />
                <Area 
                  type="monotone" 
                  dataKey="vendeurs" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorVendeurs)" 
                  name="Vendeurs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Histogramme 12 mois */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Évolution des inscriptions (12 mois)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="mois" 
                  stroke="#6b7280" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="admins" 
                  name="Administrateurs" 
                  fill="#3b82f6" 
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="vendeurs" 
                  name="Vendeurs" 
                  fill="#10b981" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Charts - Répartition des rôles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Répartition Administrateurs
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donutDataAdmins}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {donutDataAdmins.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {donutDataAdmins.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Statut Vendeurs
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donutDataVendeurs}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {donutDataVendeurs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {donutDataVendeurs.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Avec produits:</span>
                  <span className="font-semibold">{repartition_roles?.vendeurs?.avec_produits || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sans produits:</span>
                  <span className="font-semibold">{repartition_roles?.vendeurs?.sans_produits || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demandes en attente - Liste détaillée */}
        {(demandes_attente?.total_demandes || 0) > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Demandes nécessitant une action ({demandes_attente.total_demandes})
            </h3>
            
            {demandes_attente?.admins?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Demandes Admin</h4>
                <div className="space-y-2">
                  {demandes_attente.admins.map((demande) => (
                    <div key={demande.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{demande.nom_candidat}</p>
                        <p className="text-sm text-gray-600">{demande.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Niveau: {demande.niveau_acces} • {demande.date_demande}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveDemande(demande.id, 'admin')}
                          className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRejectDemande(demande.id, 'admin')}
                          className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demandes_attente?.vendeurs?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Demandes Vendeur</h4>
                <div className="space-y-2">
                  {demandes_attente.vendeurs.map((vendeur) => (
                    <div key={vendeur.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{vendeur.nom_entreprise}</p>
                        <p className="text-sm text-gray-600">{vendeur.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tél: {vendeur.telephone} • {vendeur.date_demande}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveDemande(vendeur.id, 'vendeur')}
                          className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRejectDemande(vendeur.id, 'vendeur')}
                          className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        

        {/* Sécurité système */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Base de données</h3>
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{performance_systeme?.base_donnees?.nombre_tables || 0}</p>
            <p className="text-sm text-gray-600">Tables actives</p>
            <p className="text-xs text-gray-500 mt-2">Taille: {performance_systeme?.base_donnees?.taille_totale || 'N/A'}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Sécurité</h3>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{performance_systeme?.securite?.tentatives_echouees_24h || 0}</p>
            <p className="text-sm text-gray-600">Tentatives échouées (24h)</p>
            <p className="text-xs text-green-600 mt-2 font-medium">
              Niveau: {performance_systeme?.securite?.niveau_alerte || 'faible'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Activités suspectes</h3>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{performance_systeme?.securite?.activites_suspectes || 0}</p>
            <p className="text-sm text-gray-600">Alertes détectées</p>
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
};

// Composant pour les cartes de métrique
const MetricCard = ({ title, value, icon, color, stats, variation, alert }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${alert ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {variation !== undefined && (
          <span className={`text-sm font-semibold ${variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {variation >= 0 ? '+' : ''}{variation}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-3">{value}</p>
      {stats && (
        <div className="space-y-1 text-sm text-gray-600">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between">
              <span>{stat.label}:</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;