// pages/admin/CommandesPage.jsx
import React from 'react';
import DashboardAdminLayout from '../../components/admin/DashboardAdminLayout';

const CommandesPage = () => {
  return (
    <DashboardAdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-2">Supervisez toutes les commandes de la plateforme</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Historique des Commandes</h2>
            <div className="flex space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option>Toutes les commandes</option>
                <option>En attente</option>
                <option>Validées</option>
                <option>Livrées</option>
              </select>
            </div>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            <p>Interface de gestion des commandes en cours de développement</p>
            <p className="text-sm mt-2">Les données seront chargées depuis l'API</p>
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
};

export default CommandesPage;