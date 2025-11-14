import React from 'react';
import { RefreshCwIcon } from 'lucide-react';

const PeriodSelector = ({ selectedPeriod, onPeriodChange, onRefresh, loading }) => {
  const periods = [
    { value: '30days', label: '30j', icon: '📅' },
    { value: '90days', label: '90j', icon: '📊' },
    { value: '6months', label: '6 mois', icon: '🗓️' },
    { value: '1year', label: '1 an', icon: '🎯' },
    { value: '2years', label: '2 ans', icon: '🚀' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            className={`px-2 py-1 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
              selectedPeriod === period.value
                ? 'bg-blue-800 text-white shadow-lg'
                : 'text-black hover:bg-gray-200'
            }`}
          >
            <span>{period.icon}</span>
            <span>{period.label}</span>
          </button>
        ))}
      </div>
      
      <button
        onClick={onRefresh}
        disabled={loading}
        className="bg-blue-800 font-bold text-white px-4 py-2 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <RefreshCwIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        <span>Actualiser</span>
      </button>
    </div>
  );
};

export default PeriodSelector;