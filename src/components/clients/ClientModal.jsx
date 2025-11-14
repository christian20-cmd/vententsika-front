import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import LogoTB from '../../assets/LogoTB.png';
import ClientInfoTab from './ClientTabs/ClientInfoTab';
import CommandesTab from './ClientTabs/CommandesTab';

const ClientModal = ({ client, onClose }) => {
  const [activeTab, setActiveTab] = useState('infos');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>
        <div className='text-center '>
          <h2 className="text-xl font-bold">{client.nom_prenom_client}</h2>
          <p className="text-gray-500">Détails du client</p>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mt-4">
          <nav className="flex space-x-8 px-6">
            {['infos', 'commandes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'infos' && 'Informations Personnelles'}
                
                {tab === 'commandes' && `Commandes (${client.commandes_count || 0})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'infos' && <ClientInfoTab client={client} />}
       
          {activeTab === 'commandes' && <CommandesTab client={client} />}
        </div>

        
      </div>
    </div>
  );
};

export default ClientModal;