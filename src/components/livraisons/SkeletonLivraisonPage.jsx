import React from 'react';
import SkeletonStats from './SkeletonStats';
import SkeletonFilterSystem from './SkeletonFilterSystem';
import SkeletonTable from './SkeletonTable';

const SkeletonLivraisonPage = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 rounded w-64"></div>
        <div className="h-10 bg-gray-300 rounded w-40"></div>
      </div>

      {/* Statistiques */}
      <SkeletonStats />

      {/* Système de filtres */}
      <SkeletonFilterSystem />

      {/* Tableau */}
      <SkeletonTable rowCount={6} />
    </div>
  );
};

export default SkeletonLivraisonPage;