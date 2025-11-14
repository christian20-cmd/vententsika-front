import React from 'react';

const DonutChart = ({ products, isMockData = false }) => {
  // Si pas de produits ou tableau vide
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Aucune donnée de vente</p>
        <p className="text-gray-400 text-sm mt-1">
          {isMockData ? 'Données de démonstration non disponibles' : 'Aucun produit vendu sur cette période'}
        </p>
      </div>
    );
  }

  // Vérifier que les produits ont la structure attendue
  const validProducts = products.filter(product => 
    product && 
    product.produit && 
    product.revenu_total !== undefined && 
    product.revenu_total > 0
  );

  if (validProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Données incomplètes</p>
        <p className="text-gray-400 text-sm mt-1">Les produits ne contiennent pas de données de revenus</p>
      </div>
    );
  }

  const totalRevenue = validProducts.reduce((sum, product) => sum + product.revenu_total, 0);
  
  // Si le total est 0, afficher un message
  if (totalRevenue === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Revenus nuls</p>
        <p className="text-gray-400 text-sm mt-1">Aucun revenu généré par les produits</p>
      </div>
    );
  }

  const colors = ['#1E40AF', '#c2410c', '#6b21a8', '#065f46', '#365314', '#9d174d', '#701a75', '#0f766e'];
  
  let currentAngle = 0;
  const segments = validProducts.map((product, index) => {
    const percentage = (product.revenu_total / totalRevenue) * 100;
    const angle = (percentage / 100) * 360;
    const segment = {
      product: product.produit,
      revenue: product.revenu_total,
      percentage,
      color: colors[index % colors.length],
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  // Fonction pour calculer les coordonnées du point sur le cercle
  const getCoordinates = (angle, radius) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 50 + radius * Math.cos(rad),
      y: 50 + radius * Math.sin(rad)
    };
  };

  // Fonction pour créer le chemin d'un segment
  const createSegmentPath = (segment, innerRadius = 30, outerRadius = 45) => {
    const startOuter = getCoordinates(segment.startAngle, outerRadius);
    const endOuter = getCoordinates(segment.endAngle, outerRadius);
    const startInner = getCoordinates(segment.startAngle, innerRadius);
    const endInner = getCoordinates(segment.endAngle, innerRadius);

    const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
      'Z'
    ].join(' ');
  };

  return (
    <div className="w-full">
      <div className="relative h-64">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={createSegmentPath(segment)}
                fill={segment.color}
                className="hover:opacity-80 cursor-pointer transition-opacity duration-200"
              >
                <title>
                  {segment.product}: €{segment.revenue.toLocaleString('fr-FR')} ({segment.percentage.toFixed(1)}%)
                </title>
              </path>
            </g>
          ))}
          
          {/* Centre du donut */}
          <circle cx="50" cy="50" r="25" fill="white" />
          <text x="50" y="48" textAnchor="middle" fontSize="8" fill="#374151" fontWeight="bold">
            Total
          </text>
          <text x="50" y="56" textAnchor="middle" fontSize="10" fill="#3B82F6" fontWeight="bold">
            €{totalRevenue.toLocaleString('fr-FR')}
          </text>
        </svg>
      </div>
      
      {/* Légende */}
      <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center min-w-0 flex-1">
              <div 
                className="w-3 h-3 rounded mr-2 flex-shrink-0" 
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="truncate">{segment.product}</span>
            </div>
            <div className="text-gray-600 font-medium ml-2 flex-shrink-0">
              {segment.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Indicateur de données mockées */}
      {isMockData && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs text-center">
            Données de démonstration
          </p>
        </div>
      )}
    </div>
  );
};

export default DonutChart;