// components/commandes/SkeletonOnglets.jsx
import React from 'react';

export const SkeletonOnglets = () => (
  <div className="flex space-x-2 mb-6 bg-gradient-to-r from-gray-200 to-gray-300 p-2 rounded-2xl animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div key={item} className="flex-1 py-3 text-center">
        <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl mx-auto w-24 animate-pulse"></div>
      </div>
    ))}
  </div>
);