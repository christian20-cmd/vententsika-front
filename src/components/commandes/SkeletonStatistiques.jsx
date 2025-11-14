// components/commandes/SkeletonStatistiques.jsx
import React from 'react';

export const SkeletonStatistiques = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    {[1, 2, 3, 4].map((item) => (
      <div key={item} className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl shadow-lg p-6 animate-pulse border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-12 animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);