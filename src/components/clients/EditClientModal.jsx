import React from 'react';
import { Save } from 'lucide-react';
import LogoTB from '../../assets/LogoTB.png';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditClientModal = ({ client, onChange, onSave, onClose }) => {
  const inputClasses = "w-full px-4 py-3 border-2 border-gray-400 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 absolute -mt-3 ml-6 bg-white px-2";

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
          <h2 className="text-xl font-bold">Modifier le Client</h2>
          <p className="text-gray-500">Modifiez les informations du client</p>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className={labelClasses}>
              Nom et Prénom *
            </label>
            <input
              type="text"
              required
              value={client.nom_prenom_client}
              onChange={(e) => onChange({...client, nom_prenom_client: e.target.value})}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Email *
            </label>
            <input
              type="email"
              required
              value={client.email_client}
              onChange={(e) => onChange({...client, email_client: e.target.value})}
              className={inputClasses}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className={labelClasses}>
              CIN *
            </label>
            <input
              type="text"
              required
              value={client.cin_client}
              onChange={(e) => onChange({...client, cin_client: e.target.value})}
              className={inputClasses}
              placeholder="123456789012"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Téléphone *
            </label>
            <input
              type="tel"
              required
              value={client.telephone_client}
              onChange={(e) => onChange({...client, telephone_client: e.target.value})}
              className={inputClasses}
              placeholder="+261 34 12 345 67"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Adresse *
            </label>
            <textarea
              required
              value={client.adresse_client}
              onChange={(e) => onChange({...client, adresse_client: e.target.value})}
              rows="3"
              className={inputClasses}
              placeholder="Adresse complète du client"
            />
          </div>

          {/* SUPPRIMER la section mot de passe */}
        </form>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={onClose}
            className="px-10 py-2 bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-all duration-200 hover:scale-105"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-10 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-800/60 transition-all duration-200 hover:scale-105"
          >
            <Save className="h-4 w-4" />
            <span>Modifier le Client</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;