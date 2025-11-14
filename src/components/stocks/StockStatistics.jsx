import React from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
    red: 'bg-red-50 border border-red-200',
    yellow: 'bg-yellow-50 border border-yellow-200',
  };

  const iconComponents = {
    'package': Package,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'alert-triangle': AlertTriangle,
    'users': Package,
    'shopping-cart': Package,
    'dollar-sign': TrendingUp
  };

  const IconComponent = iconComponents[icon];

  return (
    <div className={`${colorClasses[color]} rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white shadow-md">
          <IconComponent className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

const StockStatistics = ({ statistics }) => {
  if (!statistics) return null;

  // Fonction pour formater la valeur en Ariary
  const formatAriary = (value) => {
    return `${value?.toLocaleString('fr-FR')} Ar`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Stocks" 
        value={statistics.total_stocks} 
        icon="package" 
        color="blue" 
      />

      <StatCard 
        title="Valeur Totale" 
        value={formatAriary(statistics.valeur_totale_stock)} 
        icon="trending-up" 
        color="green" 
      />

      <StatCard 
        title="En Alerte" 
        value={statistics.stocks_en_alerte} 
        icon="alert-triangle" 
        color="yellow" 
      />

      <StatCard 
        title="En Rupture" 
        value={statistics.stocks_en_rupture} 
        icon="trending-down" 
        color="red" 
      />
    </div>
  );
};

export default StockStatistics;