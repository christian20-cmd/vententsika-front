import React, { useState } from 'react';

const ModernAreaChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSeries, setActiveSeries] = useState(['admins', 'vendeurs']);

  // --- Données ---
  const adminData = data?.statistiques_inscriptions?.mois?.admins?.map(i => i.count) || [50, 90, 40, 70, 110, 60];
  const vendorData = data?.statistiques_inscriptions?.mois?.vendeurs?.map(i => i.count) || [80, 60, 100, 40, 130, 90];
  const labels = data?.statistiques_inscriptions?.mois?.admins?.map(i => i.periode) || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];

  // --- Aucune donnée ---
  if (!adminData || adminData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-2xl">
        <p className="text-gray-500 font-medium">Aucune donnée disponible</p>
      </div>
    );
  }

  const maxValue = Math.max(...adminData, ...vendorData, 1);
  const gridLines = 4;

  // --- Active / Désactive une série ---
  const toggleSeries = (serie) => {
    setActiveSeries(prev =>
      prev.includes(serie)
        ? prev.filter(s => s !== serie)
        : [...prev, serie]
    );
  };

  // --- Courbes arrondies ---
  const createPath = (values) => {
    const points = values.map((v, i) => ({
      x: (i / (values.length - 1)) * 100,
      y: 100 - (v / maxValue) * 100
    }));
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      path += ` Q ${points[i].x},${points[i].y} ${xc},${yc}`;
    }
    path += ` L 100,100 L 0,100 Z`;
    return path;
  };

  // --- Tooltip dynamique ---
  const hoverData = hoveredIndex !== null ? {
    admin: adminData[hoveredIndex],
    vendor: vendorData[hoveredIndex],
    label: labels[hoveredIndex]
  } : null;

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
      {/* Titre */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Évolution des inscriptions</h3>
          <p className="text-gray-500 text-sm">Sur les 6 derniers mois</p>
        </div>

        {/* Légende */}
        <div className="flex gap-3">
          <button
            onClick={() => toggleSeries('admins')}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm border transition-all
              ${activeSeries.includes('admins')
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Admins
          </button>
          <button
            onClick={() => toggleSeries('vendeurs')}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm border transition-all
              ${activeSeries.includes('vendeurs')
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Vendeurs
          </button>
        </div>
      </div>

      {/* Graphique principal */}
      <div className="relative h-64">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIndex(null)}>
          
          <defs>
            {/* Dégradés */}
            <linearGradient id="gradAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="gradVendor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grille */}
          {Array.from({ length: gridLines + 1 }).map((_, i) => (
            <line key={i} x1="0" y1={(i / gridLines) * 100} x2="100" y2={(i / gridLines) * 100}
              stroke="#E5E7EB" strokeWidth="0.3" />
          ))}

          {/* Zones */}
          {activeSeries.includes('vendeurs') && (
            <path d={createPath(vendorData)} fill="url(#gradVendor)" />
          )}
          {activeSeries.includes('admins') && (
            <path d={createPath(adminData)} fill="url(#gradAdmin)" />
          )}

          {/* Lignes */}
          {activeSeries.includes('vendeurs') && (
            <path d={createPath(vendorData).replace(/L 100,100 L 0,100 Z/, '')}
              fill="none" stroke="#10B981" strokeWidth="0.8" />
          )}
          {activeSeries.includes('admins') && (
            <path d={createPath(adminData).replace(/L 100,100 L 0,100 Z/, '')}
              fill="none" stroke="#3B82F6" strokeWidth="0.8" />
          )}
        </svg>

        {/* Axe Y */}
        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-400 py-2">
          {Array.from({ length: gridLines + 1 }).map((_, i) => (
            <div key={i}>{Math.round(maxValue - (i / gridLines) * maxValue)}</div>
          ))}
        </div>
      </div>

      {/* Axe X */}
      <div className="flex justify-between mt-3 px-4">
        {labels.map((label, i) => (
          <span key={i} className={`text-sm ${hoveredIndex === i ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
            onMouseEnter={() => setHoveredIndex(i)}>
            {label}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      {hoverData && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl p-3 w-48 text-sm">
          <div className="text-center font-semibold text-gray-700 mb-1">{hoverData.label}</div>
          {activeSeries.includes('admins') && (
            <div className="flex justify-between text-blue-600">
              <span>Admins :</span> <span>{hoverData.admin}</span>
            </div>
          )}
          {activeSeries.includes('vendeurs') && (
            <div className="flex justify-between text-emerald-600">
              <span>Vendeurs :</span> <span>{hoverData.vendor}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModernAreaChart;
