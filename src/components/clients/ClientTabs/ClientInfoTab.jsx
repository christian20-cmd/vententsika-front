import React from 'react';
import { IdCard, MapPin, Mail } from 'lucide-react';

const InfoField = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

const ClientInfoTab = ({ client }) => {
  return (
    <div className=" gap-4">
      <div className="">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              Informations Personnelles
            </div>
          </label>
          <div className="space-y-3">
            <InfoField label="Nom Complet" value={client.nom_prenom_client} />
            <InfoField label="CIN" value={client.cin_client} />
            <InfoField label="Téléphone" value={client.telephone_client} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </div>
          </label>
          <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <p className="text-sm text-gray-900">{client.adresse_client}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </div>
          </label>
          <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <p className="text-sm text-gray-900">{client.email_client}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoTab;