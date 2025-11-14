import React from 'react';
import DashboardAdminLayout from '../../../DashboardAdminLayout';

const ErrorDisplay = ({ error, onRetry }) => (
  <DashboardAdminLayout>
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="bg-red-100 p-3 rounded-2xl mr-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-800">Erreur de chargement</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Réessayer</span>
            </div>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Actualiser la page
          </button>
        </div>
      </div>
    </div>
  </DashboardAdminLayout>
);

export default ErrorDisplay;