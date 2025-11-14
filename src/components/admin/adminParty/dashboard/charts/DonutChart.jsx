import React from 'react';

const DonutChart = ({ data }) => {
  const rolesData = [
    { 
      role: 'Super Admin', 
      count: data?.repartition_roles?.administrateurs?.super_admin || 0,
      color: 'rgb(239, 68, 68)'
    },
    { 
      role: 'Admin', 
      count: data?.repartition_roles?.administrateurs?.admin || 0,
      color: 'rgb(59, 130, 246)'
    },
    { 
      role: 'Modérateur', 
      count: data?.repartition_roles?.administrateurs?.moderateur || 0,
      color: 'rgb(16, 185, 129)'
    }
  ];

  const total = rolesData.reduce((sum, role) => sum + role.count, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Aucune donnée d'administrateurs</p>
        </div>
      </div>
    );
  }

  let currentAngle = 0;
  const segments = rolesData.map((role, index) => {
    const percentage = (role.count / total) * 100;
    const angle = (percentage / 100) * 360;
    const segment = {
      role: role.role,
      count: role.count,
      percentage,
      color: role.color,
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
    <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Répartition des administrateurs
      </h3>
      
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
                  {segment.role}: {segment.count} ({segment.percentage.toFixed(1)}%)
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
            {total}
          </text>
        </svg>
      </div>
      
      {/* Légende */}
      <div className="mt-4 space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2" 
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="truncate flex-1">{segment.role}</span>
            </div>
            <div className="text-gray-600 font-medium">
              {segment.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;