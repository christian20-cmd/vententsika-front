// components/commandes/SkeletonCarteCommandeAnnulee.jsx
import React from 'react';

export const SkeletonCarteCommandeAnnulee = () => (
  <div className="bg-white rounded-3xl shadow-2xl shadow-gray-600 p-4 w-full animate-pulse border border-red-200">
    <div className="space-y-4">
      {/* Header avec badge annulé */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-32 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40 animate-pulse"></div>
        </div>
        <div className="h-6 bg-gradient-to-r from-red-300 to-red-400 rounded-2xl w-20 animate-pulse"></div>
      </div>

      {/* Informations */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-28 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-36 animate-pulse"></div>
        </div>
      </div>

      {/* Motif annulation */}
      <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl animate-pulse">
        <div className="h-4 bg-gradient-to-r from-red-300 to-red-400 rounded w-24 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-red-200 to-red-300 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-red-200 to-red-300 rounded w-3/4 mt-1 animate-pulse"></div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-16 animate-pulse"></div>
        <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-20 animate-pulse"></div>
      </div>

      {/* Actions spécifiques aux commandes annulées */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-20 animate-pulse"></div>
          <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-24 animate-pulse"></div>
        </div>
        <div className="h-8 bg-gradient-to-r from-red-300 to-red-400 rounded-2xl w-16 animate-pulse"></div>
      </div>
    </div>
  </div>
);