// components/admin/vendeurs/SkeletonLoader.jsx
import React from 'react';

const LoadingState = () => {
  // Skeleton pour les cartes de statistiques
  const StatisticsSkeleton = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-6 animate-pulse border border-gray-200">
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
  };

  // Skeleton pour les cartes de vendeurs
  const VendeurCardSkeleton = () => {
    return (
      <div className="flex items-start justify-start">
        <div className="bg-white rounded-3xl shadow-2xl p-4 pt-0 w-full max-w-sm border border-gray-200">
          {/* Section image de profil skeleton */}
          <div className="flex justify-center -mt-24 mb-4">
            <div className="relative">
              <div className="w-60 h-60 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full border-8 border-white animate-pulse"></div>
              
              {/* Boutons d'action skeleton */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Section principale skeleton */}
          <div className="flex flex-col md:flex-row gap-4 pb-6 border-b border-gray-300">
            {/* Logo, Nom et Titre skeleton */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                {/* Logo réduit skeleton */}
                <div className="mb-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                </div>
                
                {/* Nom skeleton */}
                <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-32 mb-2 animate-pulse"></div>
                {/* Titre skeleton */}
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mb-2 animate-pulse"></div>
                {/* Statut skeleton */}
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Informations de contact skeleton */}
            <div className="flex-1 space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Description skeleton */}
          <div className="flex items-start space-x-3 pt-4 mt-4 border-t border-gray-200">
            <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mt-1 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mb-2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Section statistiques skeleton */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 mt-4 animate-pulse">
            <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-32 mb-3 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mx-auto mb-2 animate-pulse"></div>
                <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-8 mx-auto animate-pulse"></div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-10 mx-auto mb-2 animate-pulse"></div>
                <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-16 mx-auto animate-pulse"></div>
              </div>
            </div>
            {/* Bouton validation skeleton */}
            <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg mt-4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };

  // Skeleton pour la liste des vendeurs
  const VendeursListSkeleton = () => {
    return (
      <div className="mt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <VendeurCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  };

  // Skeleton pour les filtres
  const FiltersSkeleton = () => {
    return (
      <div className="space-y-4 mb-6">
        {/* Barre de recherche et boutons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Barre de recherche */}
            <div className="flex items-center w-96 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse border border-gray-300"></div>
            
            {/* Bouton Filtres */}
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-32 animate-pulse border border-gray-300"></div>
          </div>
          
          {/* Bouton Actualiser */}
          <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse border border-gray-300"></div>
        </div>

        {/* Filtres avancés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse border border-gray-300">
          {/* Filtre Statut */}
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-24 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-20 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Filtre Catégorie */}
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-32 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-24 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Filtre Date */}
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-28 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-28 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-20 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-24 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec animation améliorée */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-64 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-48 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-48 animate-pulse"></div>
      </div>

      {/* Filtres skeleton */}
      <FiltersSkeleton />

      {/* Statistiques skeleton */}
      <StatisticsSkeleton />

      {/* Liste des vendeurs skeleton */}
      <VendeursListSkeleton />

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Styles d'animation personnalisés */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .bg-gradient-to-r {
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default LoadingState;