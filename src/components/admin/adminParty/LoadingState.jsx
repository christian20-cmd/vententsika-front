// components/admin/adminParty/LoadingState.jsx
import React from 'react';
import DashboardAdminLayout from '../DashboardAdminLayout';

const LoadingState = () => {
  // Composant de ligne de tableau réutilisable
  const TableRowSkeleton = () => (
    <tr className="animate-pulse">
      {/* Administrateur */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="ml-4 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </td>
      
      {/* Contact */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
        </div>
      </td>
      
      {/* Niveau d'accès */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24 animate-pulse"></div>
      </td>
      
      {/* Statut */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
        </div>
      </td>
      
      {/* Dernière connexion */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-28 animate-pulse"></div>
      </td>
      
      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </td>
    </tr>
  );

  // Composant de carte de stats réutilisable
  const StatCardSkeleton = () => (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-6 animate-pulse border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-12 animate-pulse"></div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <DashboardAdminLayout>
      <div className="space-y-6">
        {/* Header avec animation améliorée */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-64 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-48 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-48 animate-pulse"></div>
        </div>

        {/* Filtres avec structure claire */}
        <div className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse border border-gray-300">
            {/* Filtre Niveau */}
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-40 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-24 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Tri */}
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-24 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-28 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {/* En-tête du tableau */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300">
            <div className="grid grid-cols-6 gap-4">
              {[
                'Administrateur',
                'Contact', 
                'Niveau d\'accès',
                'Statut',
                'Dernière connexion',
                'Actions'
              ].map((title, index) => (
                <div 
                  key={index}
                  className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          
          {/* Corps du tableau */}
          <table className="w-full">
            <tbody className="divide-y divide-gray-300">
              {[...Array(6)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </tbody>
          </table>
        </div>

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
    </DashboardAdminLayout>
  );
};

export default LoadingState;