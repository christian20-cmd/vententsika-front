import { useState } from 'react';

const Header = ({ onDateRangeChange }) => {
  const [dateRange, setDateRange] = useState('30days');

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    onDateRangeChange(range);
  };

  const dateRanges = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: '7days', label: '7 jours' },
    { value: '30days', label: '30 jours' },
    { value: '90days', label: '90 jours' },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Analytics</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de vos performances</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleDateRangeChange(range.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    dateRange === range.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;