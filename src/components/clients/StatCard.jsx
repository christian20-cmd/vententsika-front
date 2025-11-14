import React from 'react';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
  };

  const iconComponents = {
    'users': Users,
    'package': Package,
    'shopping-cart': ShoppingCart,
    'dollar-sign': DollarSign
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

export default StatCard;