import React from 'react';

const SkeletonRow = () => {
  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors duration-200">
      {/* Numéro de suivi */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="ml-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>
        </div>
      </td>

      {/* Numéro de commande */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </td>

      {/* Client */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </td>

      {/* Adresse */}
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-gray-300 rounded mr-1 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
        </div>
      </td>

      {/* Montants */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-14 animate-pulse"></div>
          </div>
        </div>
      </td>

      {/* Statut */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-300 rounded-full w-24 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-20 mt-1 animate-pulse"></div>
      </td>

      {/* Date prévue */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-300 rounded mr-1 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-300 rounded mr-1 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-300 rounded w-8 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-8 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-8 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-8 animate-pulse"></div>
        </div>
      </td>
    </tr>
  );
};

const SkeletonTable = ({ rowCount = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* En-tête du tableau */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                'N° Suivi',
                'N° Commande', 
                'Client',
                'Adresse Livraison',
                'Montants',
                'Statut',
                'Date Prévue',
                'Actions'
              ].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rowCount }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;