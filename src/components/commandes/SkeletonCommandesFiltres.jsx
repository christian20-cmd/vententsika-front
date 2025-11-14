// components/commandes/SkeletonCommandesFiltres.jsx
import React from 'react';

export const SkeletonCommandesFiltres = () => {
  return (
    <div className="transition-all duration-300 mb-6">
      {/* Barre principale skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 flex items-center gap-4">
          {/* Barre de recherche skeleton */}
          <div className="flex items-center w-96 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse border border-gray-300"></div>
          
          {/* Bouton Filtres skeleton */}
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-32 animate-pulse border border-gray-300"></div>
        </div>
        
        {/* Bouton Actualiser skeleton */}
        <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse border border-gray-300"></div>
      </div>

      {/* Filtres avancés skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse border border-gray-300">
        {/* Filtre Statut */}
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-40 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-24 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Tri */}
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-24 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-28 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};