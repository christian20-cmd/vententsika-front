import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  badge, 
  index,
  hoveredCard,
  setHoveredCard 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
  };

  return (
    <div 
      className={`${colorClasses[color]} rounded-3xl bg-white shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHoveredCard && setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard && setHoveredCard(null)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <div className="flex items-center space-x-2 text-sm mt-2">
              {subtitle}
            </div>
          )}
          {badge && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gray-200 shadow-md transition-all duration-300 ${hoveredCard === title ? 'scale-110' : 'scale-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;