import React from 'react';
import { MdStore, MdCheckCircle, MdPending, MdBarChart } from 'react-icons/md';

const Statistics = ({ statistiques, loading }) => {
  const statCards = [
    {
      title: 'Total vendeurs',
      value: statistiques?.total_vendeurs || 0,
      icon: MdStore,
      color: 'purple'
    },
    {
      title: 'Vendeurs validés',
      value: statistiques?.statut_validation?.valides || 0,
      icon: MdCheckCircle,
      color: 'green'
    },
    {
      title: 'En attente',
      value: statistiques?.statut_validation?.en_attente || 0,
      icon: MdPending,
      color: 'orange'
    },
    {
      title: 'Total produits',
      value: statistiques?.produits?.total_produits || 0,
      icon: MdBarChart,
      color: 'blue'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={index}
            className={`${colorClasses[card.color]} rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className="p-3 rounded-full bg-white shadow-md">
                <IconComponent className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;