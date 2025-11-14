// components/stocks/StatisticsSkeleton.jsx
import React from 'react';

const StatisticsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-20 shimmer"></div>
              <div className="h-6 bg-gray-300 rounded w-16 shimmer"></div>
            </div>
            <div className="h-12 w-12 bg-gray-300 rounded-full shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsSkeleton;