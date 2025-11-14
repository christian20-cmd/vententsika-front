// components/commandes/SkeletonCarteCommande.jsx
import React from 'react';

export const SkeletonCarteCommande = () => (
  <div className="bg-white rounded-3xl shadow-2xl shadow-gray-600 p-4 w-full animate-pulse">
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-32 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40 animate-pulse"></div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-24 ml-auto animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-20 ml-auto animate-pulse"></div>
        </div>
      </div>

      {/* Informations client et date */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse"></div>
        </div>
      </div>

      {/* Section paiement */}
      <div className="p-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-16 animate-pulse"></div>
        </div>
        <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-16 mt-2 animate-pulse"></div>
      </div>

      {/* Produits */}
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-24 animate-pulse"></div>
        {[1, 2].map((item) => (
          <div key={item} className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl animate-pulse"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-16 animate-pulse"></div>
          <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-16 animate-pulse"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-20 animate-pulse"></div>
          <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);