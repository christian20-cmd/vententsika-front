import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const MetricCard = ({ title, value, icon: Icon, format = 'number' }) => {
  const formattedValue = format === 'currency' 
    ? `€${value.toLocaleString('fr-FR')}` 
    : value.toLocaleString('fr-FR');

  


  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        
      </div>
      <div className='flex items-baseline justify-between'>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
      </div>
      
    </div>
  );
};

export default MetricCard;