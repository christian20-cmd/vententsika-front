import React from 'react';

const SkeletonLoading = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="">
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-96 shimmer"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-40 shimmer"></div>
          </div>
        </div>
      </div>

      {/* Contenu principal skeleton */}
      <div className="">
        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3 shimmer"></div>
              <div className="h-8 bg-gray-200 rounded w-16 shimmer"></div>
            </div>
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center w-14 bg-gray-200 rounded-2xl border border-gray-300">
                <div className="p-3 text-gray-500 flex-shrink-0 shimmer"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl shimmer w-32"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl shimmer w-24"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(6)].map((_, index) => (
                    <th key={index} className="px-6 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {[...Array(6)].map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {colIndex === 0 && (
                            <>
                              <div className="h-10 w-10 bg-gray-200 rounded-full shimmer mr-4"></div>
                              <div>
                                <div className="h-4 bg-gray-200 rounded w-32 mb-1 shimmer"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 shimmer"></div>
                              </div>
                            </>
                          )}
                          {colIndex === 1 && (
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-40 mb-1 shimmer"></div>
                              <div className="h-3 bg-gray-200 rounded w-32 shimmer"></div>
                            </div>
                          )}
                          {colIndex === 2 && (
                            <div className="h-4 bg-gray-200 rounded w-48 shimmer"></div>
                          )}
                          {colIndex === 3 && (
                            <div className="flex gap-4">
                              {[...Array(3)].map((_, statIndex) => (
                                <div key={statIndex} className="text-center">
                                  <div className="h-4 bg-gray-200 rounded w-8 mb-1 shimmer"></div>
                                  <div className="h-3 bg-gray-200 rounded w-12 shimmer"></div>
                                </div>
                              ))}
                            </div>
                          )}
                          {colIndex === 4 && (
                            <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
                          )}
                          {colIndex === 5 && (
                            <div className="flex gap-3">
                              {[...Array(4)].map((_, actionIndex) => (
                                <div key={actionIndex} className="h-6 w-6 bg-gray-200 rounded shimmer"></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shimmer Animation CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoading;