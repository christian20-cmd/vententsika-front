import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const StockStatsCard = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-gray-200 p-4 rounded-2xl">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
        Analyse des Stocks
      </h3>
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.total_produits_alerte || 0}</div>
          <div className="text-sm text-gray-600">Produits en alerte</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-800">
            €{(stats.impact_financier_total || 0).toLocaleString('fr-FR')}
          </div>
          <div className="text-sm text-gray-600">Impact financier</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-orange-600">Stocks faibles:</span>
          <span className="font-semibold">€{(stats.valeur_stocks_faibles || 0).toLocaleString('fr-FR')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-red-600">Stocks rupture:</span>
          <span className="font-semibold">€{(stats.valeur_stocks_rupture || 0).toLocaleString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
};

export default StockStatsCard;