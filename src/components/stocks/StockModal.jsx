import React from 'react';
import { X, Package, Edit3, Bell, Truck, Plus, Minus, Settings } from 'lucide-react';
import LogoTB from '../../assets/LogoTB.png';
import { XMarkIcon } from '@heroicons/react/24/outline';

const StockModal = ({
  modalType,
  selectedStock,
  formData,
  onFormDataChange,
  onClose,
  onSubmit,
  error
}) => {
  const getModalConfig = () => {
    const configs = {
      create: {
        title: 'Créer un Stock',
        icon: <Package className="text-blue-600" size={24} />,
        color: 'blue',
        submitText: 'Créer'
      },
      update: {
        title: 'Modifier le Stock',
        icon: <Edit3 className="text-blue-600" size={24} />,
        color: 'blue',
        submitText: 'Mettre à jour'
      },
      reserver: {
        title: 'Réserver des Produits',
        icon: <Bell className="text-yellow-600" size={24} />,
        color: 'blue',
        submitText: 'Réserver'
      },
      livrer: {
        title: 'Livrer des Produits',
        icon: <Truck className="text-purple-600" size={24} />,
        color: 'blue',
        submitText: 'Livrer'
      }
    };
    return configs[modalType] || configs.create;
  };

  const modalConfig = getModalConfig();
  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      button: 'bg-blue-800 hover:bg-blue-900',
      icon: 'text-blue-600'
    }
  };

  const currentColor = colorClasses[modalConfig.color];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">

        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-4 top-4 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>
        
        {/* Header */}
        <div className="pb-4 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {modalConfig.title}
          </h2>
          {selectedStock && (
            <p className="text-sm text-gray-600 mt-1">
              Code: <strong>{selectedStock.code_stock}</strong>
            </p>
          )}
        </div>

        {/* Content avec scroll */}
        <div className="px-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-3 transition-all duration-300 hover:shadow-md">
              <X size={20} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            {modalType === 'create' && (
              <CreateStockForm formData={formData} onFormDataChange={onFormDataChange} />
            )}

            {modalType === 'update' && (
              <UpdateStockForm 
                formData={formData} 
                onFormDataChange={onFormDataChange} 
                selectedStock={selectedStock} 
              />
            )}

            {(modalType === 'reserver' || modalType === 'livrer') && (
              <ReserveLivrerForm 
                modalType={modalType}
                formData={formData}
                onFormDataChange={onFormDataChange}
                selectedStock={selectedStock}
              />
            )}
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="p-6 ">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <X size={18} />
              Annuler
            </button>
            <button
              onClick={onSubmit}
              className={`flex-1 px-6 py-3 text-white rounded-2xl transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105 ${currentColor.button}`}
            >
              <Edit3 size={18} />
              {modalConfig.submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Classes CSS réutilisables (style ProduitForm)
const inputContainerClasses = "relative mt-8";
const inputClasses = "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 peer";
const labelClasses = "absolute left-4 -top-2 px-2 bg-white text-gray-600 text-sm font-medium transition-all duration-200 peer-focus:text-blue-600";
const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

// Sous-composants pour les différents formulaires
const CreateStockForm = ({ formData, onFormDataChange }) => (
  <>
    <div className={inputContainerClasses}>
      <div className="relative">
        <Package className={iconClasses} size={20} />
        <input
          type="text"
          value={formData.nom_produit || ''}
          onChange={(e) => onFormDataChange({...formData, nom_produit: e.target.value})}
          className={`${inputClasses} pl-12`}
          placeholder=" "
          required
        />
        <label className={labelClasses}>
          Nom du Produit *
        </label>
      </div>
    </div>
    
    <div className={inputContainerClasses}>
      <div className="relative">
        <Settings className={iconClasses} size={20} />
        <input
          type="text"
          value={formData.categorie || ''}
          onChange={(e) => onFormDataChange({...formData, categorie: e.target.value})}
          className={`${inputClasses} pl-12`}
          placeholder=" "
          required
        />
        <label className={labelClasses}>
          Catégorie *
        </label>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className={inputContainerClasses}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">💰</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.prix_unitaire || ''}
            onChange={(e) => onFormDataChange({...formData, prix_unitaire: e.target.value})}
            className={`${inputClasses} pl-12`}
            placeholder=" "
            required
          />
          <label className={labelClasses}>
            Prix Unitaire (Ar) *
          </label>
        </div>
      </div>
      
      <div className={inputContainerClasses}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">📦</span>
          <input
            type="number"
            min="0"
            value={formData.quantite_disponible || ''}
            onChange={(e) => onFormDataChange({...formData, quantite_disponible: e.target.value})}
            className={`${inputClasses} pl-12`}
            placeholder=" "
            required
          />
          <label className={labelClasses}>
            Quantité *
          </label>
        </div>
      </div>
    </div>
  </>
);

const UpdateStockForm = ({ formData, onFormDataChange, selectedStock }) => (
  <>
    <div className={inputContainerClasses}>
      <div className="relative">
        <Package className={iconClasses} size={20} />
        <input
          type="text"
          value={formData.nom_produit || selectedStock?.nom_produit || ''}
          onChange={(e) => onFormDataChange({...formData, nom_produit: e.target.value})}
          className={`${inputClasses} pl-12`}
          placeholder=" "
          required
        />
        <label className={labelClasses}>
          Nom du Produit *
        </label>
      </div>
    </div>
    
    <div className={inputContainerClasses}>
      <div className="relative">
        <Settings className={iconClasses} size={20} />
        <input
          type="text"
          value={formData.categorie || selectedStock?.categorie || ''}
          onChange={(e) => onFormDataChange({...formData, categorie: e.target.value})}
          className={`${inputClasses} pl-12`}
          placeholder=" "
          required
        />
        <label className={labelClasses}>
          Catégorie *
        </label>
      </div>
    </div>
    
    <div className={inputContainerClasses}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">💰</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.prix_unitaire || selectedStock?.prix_unitaire || ''}
          onChange={(e) => onFormDataChange({...formData, prix_unitaire: e.target.value})}
          className={`${inputClasses} pl-12`}
          placeholder=" "
          required
        />
        <label className={labelClasses}>
          Prix (Ar) *
        </label>
      </div>
    </div>

    <div className="border-t-2 border-gray-200 pt-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Settings size={20} />
        Gestion du Stock
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className={inputContainerClasses}>
          <div className="relative">
            <Edit3 className={iconClasses} size={20} />
            <select
              value={formData.operation || 'ajouter'}
              onChange={(e) => onFormDataChange({...formData, operation: e.target.value})}
              className={`${inputClasses} pl-12`}
              required
            >
              <option value="ajouter">Ajouter</option>
              <option value="retirer">Retirer</option>
              <option value="definir">Définir</option>
            </select>
            <label className={labelClasses}>
              Opération *
            </label>
          </div>
        </div>
        
        <div className={inputContainerClasses}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">📦</span>
            <input
              type="number"
              min="1"
              value={formData.quantite || ''}
              onChange={(e) => onFormDataChange({...formData, quantite: e.target.value})}
              className={`${inputClasses} pl-12`}
              placeholder=" "
              required
            />
            <label className={labelClasses}>
              Quantité *
            </label>
          </div>
        </div>
      </div>
    </div>
  </>
);

const ReserveLivrerForm = ({ modalType, formData, onFormDataChange, selectedStock }) => {
  const isReservation = modalType === 'reserver';
  const available = isReservation 
    ? selectedStock?.quantite_reellement_disponible || 0
    : selectedStock?.quantite_reservee || 0;

  return (
    <div>
      <div className="p-6 bg-gray-200 rounded-2xl mb-6 text-center transition-all duration-300 hover:shadow-md">
        <div className="text-3xl font-bold text-gray-800 mb-2">
          {available}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {isReservation ? 'unités disponibles' : 'unités réservées'}
        </div>
      </div>

      <div className={inputContainerClasses}>
        <div className="relative">
          {isReservation ? (
            <Bell className={iconClasses} size={20} />
          ) : (
            <Truck className={iconClasses} size={20} />
          )}
          <input
            type="number"
            min="1"
            max={available}
            value={formData.quantite || ''}
            onChange={(e) => onFormDataChange({...formData, quantite: e.target.value})}
            className={`${inputClasses} pl-12`}
            placeholder=" "
            required
          />
          <label className={labelClasses}>
            Quantité à {isReservation ? 'réserver' : 'livrer'} *
          </label>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 ml-4">
          <span>Min: 1</span>
          <span>Max: {available}</span>
        </div>
      </div>

      {formData.quantite && parseInt(formData.quantite) > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl transition-all duration-300 hover:shadow-md">
          <div className="text-sm font-semibold text-blue-800 mb-2">
            Après l'opération :
          </div>
          <div className="text-sm text-blue-600">
            {isReservation 
              ? `Disponible: ${available - (parseInt(formData.quantite) || 0)} unités`
              : `Réservé: ${available - (parseInt(formData.quantite) || 0)} unités`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default StockModal;