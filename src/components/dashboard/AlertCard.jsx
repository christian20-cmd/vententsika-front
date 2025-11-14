import React from 'react';
import { XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { AlertTriangleIcon } from 'lucide-react';

const AlertCard = ({ product, quantity, statut, seuil_alerte, index }) => {
  const getAlertConfig = () => {
    switch (statut) {
      case 'rupture':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: XCircleIcon,
          iconColor: 'text-red-500',
          badgeColor: 'bg-red-100 text-red-800',
          label: 'Rupture de Stock',
          message: 'Stock épuisé - Réapprovisionnement urgent'
        };
      case 'faible':
        return {
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-orange-500',
          badgeColor: 'bg-white text-orange-800',
          label: 'Stock Faible',
          message: `Seuil d'alerte: ${seuil_alerte} unités`
        };
      default:
        return {
          bgColor: 'bg-yellow-800',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: AlertTriangleIcon,
          iconColor: 'text-yellow-500',
          badgeColor: 'bg-yellow-800 text-yellow-800',
          label: 'Alerte Stock',
          message: 'Surveillance nécessaire'
        };
    }
  };

  const config = getAlertConfig();
  const Icon = config.icon;

  return (
    <div 
      className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-4 flex items-center justify-between`}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
        <div>
          <span className={`font-medium ${config.textColor}`}>{product}</span>
          <p className="text-xs opacity-80">{config.message}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs px-2 py-1 rounded-full ${config.badgeColor}`}>
          {config.label}
        </span>
        <span className={`text-xs  ${config.textColor}`}>
          {quantity} unité{quantity !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default AlertCard;