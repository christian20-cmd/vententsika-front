import React, { useState } from 'react';
import { X, Calendar, MapPin, Package, FileText, CheckCircle } from 'lucide-react';
import { formatDate } from './utils';
import LogoTB from '../../assets/LogoTB.png';

// Classes CSS réutilisables (même style que ProduitForm)
const inputContainerClasses = "relative mt-8";
const inputClasses = "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 peer";
const labelClasses = "absolute left-4 -top-2 px-2 bg-white text-gray-600 text-sm font-medium transition-all duration-200 peer-focus:text-blue-600";
const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

// ==================== EDIT MODAL ====================
const EditModal = ({ livraison, onClose, onSuccess }) => {
  const [editData, setEditData] = useState({
    notes_livraison: livraison.notes_livraison || '',
    date_livraison_prevue: livraison.date_livraison_prevue ? 
      new Date(livraison.date_livraison_prevue).toISOString().split('T')[0] : '',
    adresse_livraison: livraison.adresse_livraison || '',
    numero_suivi: livraison.numero_suivi || ''
  });

  const [focusedFields, setFocusedFields] = useState({});

  // Gestion du focus pour les inputs
  const handleFocus = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModifierLivraison = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/livraisons/${livraison.idLivraison}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Livraison modifiée avec succès!');
        onSuccess();
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    }
  };

  return (
    <div className="fixed -inset-6 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          type="button"
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-4 top-4 z-10"
        >
          <X className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>

        {/* Header */}
        <div className="pb-4 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Modifier la Livraison
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            N° {livraison.numero_suivi}
          </p>
        </div>

        {/* Content avec scroll */}
        <form onSubmit={handleModifierLivraison} className="px-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Informations de la livraison */}
          <div className="bg-gray-200 rounded-2xl p-4 mb-6 transition-all duration-300 hover:shadow-md">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informations actuelles
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Client:</span>
                <strong>{livraison.nom_client}</strong>
              </div>
              <div className="flex justify-between">
                <span>Statut:</span>
                <strong>{livraison.status_livraison}</strong>
              </div>
              <div className="flex justify-between">
                <span>Créée le:</span>
                <strong>{formatDate(livraison.date_creation)}</strong>
              </div>
            </div>
          </div>

          {/* Date de livraison prévue */}
          <div className={inputContainerClasses}>
            <div className="relative">
              <Calendar className={`${iconClasses} ${focusedFields.date_livraison_prevue ? 'text-blue-500' : ''}`} size={20} />
              <input
                type="date"
                name="date_livraison_prevue"
                value={editData.date_livraison_prevue}
                onChange={handleChange}
                className={`${inputClasses} pl-12`}
                placeholder=" "
                onFocus={() => handleFocus('date_livraison_prevue')}
                onBlur={() => handleBlur('date_livraison_prevue')}
              />
              <label className={`${labelClasses} ${focusedFields.date_livraison_prevue ? 'text-blue-600' : ''}`}>
                Date de livraison prévue
              </label>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className={inputContainerClasses}>
            <div className="relative">
              <MapPin className={`${iconClasses} ${focusedFields.adresse_livraison ? 'text-blue-500' : ''}`} size={20} />
              <input
                type="text"
                name="adresse_livraison"
                value={editData.adresse_livraison}
                onChange={handleChange}
                className={`${inputClasses} pl-12`}
                placeholder=" "
                onFocus={() => handleFocus('adresse_livraison')}
                onBlur={() => handleBlur('adresse_livraison')}
              />
              <label className={`${labelClasses} ${focusedFields.adresse_livraison ? 'text-blue-600' : ''}`}>
                Adresse de livraison
              </label>
            </div>
          </div>

          {/* Numéro de suivi */}
          <div className={inputContainerClasses}>
            <div className="relative">
              <Package className={`${iconClasses} ${focusedFields.numero_suivi ? 'text-blue-500' : ''}`} size={20} />
              <input
                type="text"
                name="numero_suivi"
                value={editData.numero_suivi}
                onChange={handleChange}
                className={`${inputClasses} pl-12`}
                placeholder=" "
                onFocus={() => handleFocus('numero_suivi')}
                onBlur={() => handleBlur('numero_suivi')}
              />
              <label className={`${labelClasses} ${focusedFields.numero_suivi ? 'text-blue-600' : ''}`}>
                Numéro de suivi
              </label>
            </div>
          </div>

          {/* Notes de livraison */}
          <div className={inputContainerClasses}>
            <div className="relative">
              <FileText className={`absolute left-4 top-4 h-5 w-5 ${focusedFields.notes_livraison ? 'text-blue-500' : 'text-gray-400'}`} />
              <textarea
                name="notes_livraison"
                value={editData.notes_livraison}
                onChange={handleChange}
                rows="3"
                className={`${inputClasses} pl-12 resize-none`}
                placeholder=" "
                onFocus={() => handleFocus('notes_livraison')}
                onBlur={() => handleBlur('notes_livraison')}
              />
              <label className={`${labelClasses} ${focusedFields.notes_livraison ? 'text-blue-600' : ''}`}>
                Notes de livraison
              </label>
            </div>
          </div>
        </form>

        {/* Footer - Actions */}
        <div className="p-4 mt-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <X size={18} />
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleModifierLivraison}
              className="flex-1 px-6 py-3 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105"
            >
              <CheckCircle size={18} />
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;