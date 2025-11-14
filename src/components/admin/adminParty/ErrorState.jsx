import React from 'react';
import { MdRefresh } from 'react-icons/md';
import DashboardAdminLayout from '../DashboardAdminLayout';

const ErrorState = ({ error, onRetry }) => {
  return (
    <DashboardAdminLayout>
      <div className="">
        <div className="">
          <h1 className="text-xl font-bold text-gray-900">Gestion des Administrateurs</h1>
          <p className="text-gray-600 mt-2">Gérez les comptes administrateurs de votre plateforme</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onRetry}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto"
            >
              <MdRefresh className="mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
};

export default ErrorState;