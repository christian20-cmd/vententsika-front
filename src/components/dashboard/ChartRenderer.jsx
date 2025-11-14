import React from 'react';
import AreaChart from './AreaChart';
import BarChart from './BarChart';

const ChartRenderer = ({ data, type, viewType, graphView }) => {
  const chartData = type === 'revenue' 
    ? (viewType === 'daily' ? data.daily?.ventes_quotidiennes : data.monthly?.ventes_mensuelles)
    : (viewType === 'daily' ? data.daily?.commandes_quotidiennes : data.monthly?.commandes_mensuelles);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Données non disponibles</p>
      </div>
    );
  }

  switch (graphView) {
    case 'area':
      return <AreaChart data={chartData} type={type} />;
    case 'bars':
      return <BarChart data={chartData} type={type} />;
    default:
      return <AreaChart data={chartData} type={type} />;
  }
};

export default ChartRenderer;