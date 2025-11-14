// pages/admin/ClientsPage.jsx
import React from 'react';
import DashboardAdminLayout from '../../components/admin/DashboardAdminLayout';

const ClientsPage = () => {
  return (
    <DashboardAdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600 mt-2">Consultez et gérez la base de données clients</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Base de Données Clients</h2>
          
          <div className="text-center py-12 text-gray-500">
            <p>Interface de gestion des clients en cours de développement</p>
            <p className="text-sm mt-2">Les données seront chargées depuis l'API</p>
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
};

export default ClientsPage;