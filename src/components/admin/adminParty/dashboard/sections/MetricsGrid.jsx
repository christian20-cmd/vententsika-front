import React from 'react';
import MetricCard from '../cards/MetricCard';

const MetricsGrid = ({ data, hoveredCard, setHoveredCard }) => {
  const metrics = [
    {
      title: "Administrateurs",
      value: data?.metriques_principales?.administrateurs?.total || 0,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "#3B82F6",
      subtitle: (
        <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">
          {data?.metriques_principales?.administrateurs?.en_ligne || 0} en ligne
        </span>
      ),
      badge: {
        text: `${data?.metriques_principales?.administrateurs?.nouveaux_7j || 0} nouveaux`,
        color: 'bg-blue-100 text-blue-800'
      }
    },
    {
      title: "Vendeurs",
      value: data?.metriques_principales?.vendeurs?.total || 0,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "#10B981",
      badge: {
        text: `${data?.metriques_principales?.vendeurs?.taux_activation || 0}% actifs`,
        color: 'bg-green-100 text-green-800'
      }
    },
    {
      title: "Performance",
      value: `${data?.performance_systeme?.performance?.temps_reponse_moyen || 0}ms`,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "#8B5CF6",
      badge: {
        text: data?.performance_systeme?.performance?.statut || 'N/A',
        color: data?.performance_systeme?.performance?.statut === 'optimal' 
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }
    },
    {
      title: "En attente",
      value: data?.demandes_attente?.total_demandes || 0,
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "#F59E0B",
      subtitle: (
        <div className="flex space-x-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">
            {data?.demandes_attente?.admins?.length || 0} admins
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
            {data?.demandes_attente?.vendeurs?.length || 0} vendeurs
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          {...metric}
          index={index}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />
      ))}
    </div>
  );
};

export default MetricsGrid;