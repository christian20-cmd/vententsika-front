import React from 'react';
import { AreaChart, BarChart3, TrendingUpIcon } from 'lucide-react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const ChartControls = ({ chartType, onChartTypeChange, graphView, onGraphViewChange }) => {
  return (
    <div className="flex bg-white rounded-lg px-2 py-1 shadow-sm border">
      {/* Sélecteur de type de données */}
      <div className="flex flex-col space-y-2">
        
        <div className="flex space-x-2">
          <button
            onClick={() => onChartTypeChange('revenue')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
              chartType === 'revenue'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            <TrendingUpIcon className="w-4 h-4 mr-2" />
            
          </button>
          <button
            onClick={() => onChartTypeChange('orders')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
              chartType === 'orders'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            <ShoppingBagIcon className="w-4 h-4 mr-2" />
          </button>
        </div>
      </div>
      
      {/* Sélecteur de type de graphique */}
      <div className="flex flex-col space-y-2">
        
        <div className="flex space-x-2">
          <button
            onClick={() => onGraphViewChange('area')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
              graphView === 'area'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
            title="Graphique de zone"
          >
            <AreaChart className="w-4 h-4 mr-2" />
            
          </button>
          <button
            onClick={() => onGraphViewChange('bars')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
              graphView === 'bars'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
            title="Histogramme"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartControls;