import React from 'react';

const SkeletonStatCard = () => {
  return (
    <div className="bg-gray-200 rounded-3xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-6 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="p-3 rounded-full bg-gray-300">
          <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>
  );
};

export default SkeletonStats;