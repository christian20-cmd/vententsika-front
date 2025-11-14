// pages/admin/ParametresPage.jsx
import React from 'react';
import DashboardAdminLayout from '../../components/admin/DashboardAdminLayout';

const ParametresPage = () => {
  return (
    <DashboardAdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres de la Plateforme</h1>
          <p className="text-gray-600 mt-2">Configurez les paramètres généraux de votre système</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Configuration</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Paramètres Généraux</h3>
              <div className="text-gray-500">
                <p>Configuration des paramètres système en cours de développement</p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sécurité</h3>
              <div className="text-gray-500">
                <p>Paramètres de sécurité et permissions en cours de développement</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
              <div className="text-gray-500">
                <p>Configuration des notifications en cours de développement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
};

export default ParametresPage;