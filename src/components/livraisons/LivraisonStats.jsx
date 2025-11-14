import React from 'react';
import { Users, Package, ShoppingCart, DollarSign, Truck, CheckCircle, Clock, Send, XCircle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
    red: 'bg-red-50 border border-red-200',
  };

  const iconComponents = {
    'users': Users,
    'package': Package,
    'shopping-cart': ShoppingCart,
    'dollar-sign': DollarSign,
    'truck': Truck,
    'check-circle': CheckCircle,
    'clock': Clock,
    'send': Send,
    'x-circle': XCircle
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

const LivraisonStats = ({ statistiques }) => {
  if (!statistiques) return null;

  // Calcul des valeurs
  const totalLivraisons = statistiques.total_livraisons;
  const livrees = statistiques.statuts?.livrees || 0;
  const enCours = (statistiques.statuts?.en_attente || 0) + (statistiques.statuts?.en_preparation || 0);
  const expediees = (statistiques.statuts?.expediees || 0) + (statistiques.statuts?.en_transit || 0);
  const annulees = statistiques.statuts?.annulees || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCard 
        title="Total Livraisons" 
        value={totalLivraisons} 
        icon="truck" 
        color="blue" 
      />
      <StatCard 
        title="Livrées" 
        value={livrees} 
        icon="check-circle" 
        color="green" 
      />
      <StatCard 
        title="En cours" 
        value={enCours} 
        icon="clock" 
        color="orange" 
      />
      <StatCard 
        title="Expédiées" 
        value={expediees} 
        icon="send" 
        color="purple" 
      />
      <StatCard 
        title="Annulées" 
        value={annulees} 
        icon="x-circle" 
        color="red" 
      />
    </div>
  );
};

export default LivraisonStats;