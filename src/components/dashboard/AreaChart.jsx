import React from 'react';

const AreaChart = ({ data, type = 'revenue' }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Aucune donnée disponible pour le graphique</p>
      </div>
    );
  }

  const chartData = data.datasets[0].data;
  const labels = data.labels;
  const maxValue = Math.max(...chartData);

  const formatValue = (value) => {
    if (type === 'revenue') {
      if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
      return `€${value}`;
    }
    return value;
  };

  const points = chartData.map((value, index) => {
    const x = (index / (chartData.length - 1)) * 100;
    const y = maxValue > 0 ? 100 - (value / maxValue) * 100 : 100;
    return `${x},${y}`;
  });

  const areaPath = `M ${points.join(' L ')} L 100,100 L 0,100 Z`;

  return (
    <div className="w-full h-80 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <path d={areaPath} fill="url(#areaGradient)" />
        
        <path 
          d={`M ${points.join(' L ')}`} 
          fill="none" 
          stroke="#1E40AF" 
          strokeWidth="0.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {points.map((point, index) => {
          const [x, y] = point.split(',').map(Number);
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                
                r={0.5}
                fill="#1E40AF"
                className="hover:r-4 transition-all duration-200 cursor-pointer"
              />
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                fontSize="6"
                fill="#1E40AF"
                className="hidden group-hover:block"
              >
                {formatValue(chartData[index])}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-black px-2">
        {labels.map((label, index) => (
          <div key={index} className="text-center truncate" style={{ width: `${100 / labels.length}%` }}>
            {label}
          </div>
        ))}
      </div>
      
      <div className="absolute top-2 left-2 text-sm font-medium text-gray-700">
        {type === 'revenue' ? "Chiffre d'Affaires (€)" : 'Nombre de Commandes'}
      </div>
    </div>
  );
};

export default AreaChart;