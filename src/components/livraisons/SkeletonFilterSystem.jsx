import React from 'react';

const SkeletonFilterSystem = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Barre de recherche */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {/* Bouton de recherche */}
          <div className="h-10 w-10 bg-gray-300 rounded-lg animate-pulse"></div>
          
          {/* Champ de recherche */}
          <div className="flex-1 sm:w-64">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Boutons de filtre et rafraîchissement */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex space-x-2">
            <div className="h-10 w-24 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-10 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Filtres étendus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        {/* Filtre par statut */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Filtre par date */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Tri */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFilterSystem;