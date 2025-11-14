import React from 'react';

const BarChart = ({ data, type = 'revenue' }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible pour l'histogramme</p>
      </div>
    );
  }

  const chartData = data.datasets[0].data;
  const labels = data.labels;
  const maxValue = Math.max(...chartData);

  const getBarColor = (value) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    if (percentage > 80) return 'from-green-500 to-emerald-500';
    if (percentage > 50) return 'from-blue-500 to-cyan-500';
    return 'from-purple-500 to-pink-500';
  };

  // Formater les valeurs
  const formatValue = (value) => {
    if (type === 'revenue') {
      if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
      return `€${value}`;
    }
    return value;
  };

  return (
    <div className="w-full h-64">
      <div className="flex items-end justify-between h-56 space-x-1 overflow-x-auto pb-4">
        {chartData.map((value, index) => {
          const percentage = maxValue > 0 ? (value / maxValue) * 80 : 0;
          const gradient = getBarColor(value);
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center flex-1 min-w-[30px] group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full flex justify-center">
                <div
                  className={`w-3/4 bg-gradient-to-t ${gradient} rounded-t-xl transition-all duration-500 ease-out hover:opacity-90 cursor-pointer group-hover:w-full hover:shadow-lg`}
                  style={{ 
                    height: `${percentage}%`, 
                    minHeight: '4px',
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10 shadow-lg">
                    {formatValue(value)}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                {labels[index]}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
        {type === 'revenue' ? "Chiffre d'Affaires (€)" : 'Nombre de Commandes'}
      </div>
    </div>
  );
};

export default BarChart;