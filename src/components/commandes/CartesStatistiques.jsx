import React from 'react';
import { ShoppingCart, CheckCircle, Truck, Euro } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
    red: 'bg-red-50 border border-red-200',
  };

  const iconComponents = {
    'shopping-cart': ShoppingCart,
    'check-circle': CheckCircle,
    'truck': Truck,
    'euro': Euro,
    'users': ShoppingCart,
    'package': Truck,
    'dollar-sign': Euro
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

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

export const CartesStatistiques = ({ statistiques }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    <StatCard 
      title="Total Commandes" 
      value={statistiques?.total_commandes || 0} 
      icon="shopping-cart" 
      color="blue" 
    />
    
    <StatCard 
      title="Commandes Validées" 
      value={statistiques?.commandes_validees || 0} 
      icon="check-circle" 
      color="green" 
    />
    
    <StatCard 
      title="Commandes Livrées" 
      value={statistiques?.commandes_livrees || 0} 
      icon="truck" 
      color="purple" 
    />
    
    <StatCard 
      title="Chiffre d'Affaires" 
      value={formatPrix(statistiques?.chiffre_affaires || 0)} 
      icon="euro" 
      color="blue" 
    />
  </div>
);