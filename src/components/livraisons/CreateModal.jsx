import React, { useState } from 'react';
import { X, Calendar, FileText, CheckCircle, Package, MapPin } from 'lucide-react';
import { formatPrix } from './utils';
import LogoTB from '../../assets/LogoTB.png';

// Classes CSS réutilisables (même style que ProduitForm)
const inputContainerClasses = "relative mt-8";
const inputClasses = "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 peer";
const labelClasses = "absolute left-4 -top-2 px-2 bg-white text-gray-600 text-sm font-medium transition-all duration-200 peer-focus:text-blue-600";
const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

const CreateModal = ({ commandesDisponibles, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idCommande: '',
    notes_livraison: '',
    date_livraison_prevue: ''
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCommandeSelection = (commandeId) => {
    const selectedCommande = commandesDisponibles.find(c => c.idCommande === parseInt(commandeId));
    
    if (selectedCommande) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      const formattedDate = defaultDate.toISOString().split('T')[0];
      
      setFormData({
        ...formData,
        idCommande: commandeId,
        date_livraison_prevue: formattedDate
      });
    } else {
      setFormData({
        ...formData,
        idCommande: commandeId
      });
    }
  };

  const handleCreateLivraison = async (e) => {
    e.preventDefault();
    
    if (!formData.idCommande) {
      alert('Veuillez sélectionner une commande');
      return;
    }

    if (!formData.date_livraison_prevue) {
      alert('Veuillez sélectionner une date de livraison prévue');
      return;
    }

    const selectedDate = new Date(formData.date_livraison_prevue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('La date de livraison doit être aujourd\'hui ou dans le futur');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/livraisons', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCommande: parseInt(formData.idCommande),
          notes_livraison: formData.notes_livraison,
          date_livraison_prevue: formData.date_livraison_prevue
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Livraison créée avec succès! Numéro de suivi: ' + data.numero_suivi);
        setFormData({ 
          idCommande: '', 
          notes_livraison: '',
          date_livraison_prevue: ''
        });
        onSuccess();
      } else {
        alert('Erreur: ' + (data.message || 'Erreur lors de la création'));
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la livraison');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed -inset-6 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] pb-4 overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        
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
            Nouvelle Livraison
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Créer une nouvelle livraison
          </p>
        </div>

        {/* Content avec scroll */}
        <form onSubmit={handleCreateLivraison} className="px-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Information importante
                </p>
                <p className="text-xs text-yellow-700">
                  Le numéro de suivi sera généré automatiquement. 
                  Toutes les informations de la commande seront récupérées automatiquement.
                </p>
              </div>
            </div>
          </div>

          {/* Sélection de commande */}
          <div className={inputContainerClasses}>
            <div className="relative">
              <Package className={`${iconClasses} ${focusedFields.idCommande ? 'text-blue-500' : ''}`} size={20} />
              <select
                name="idCommande"
                required
                value={formData.idCommande}
                onChange={(e) => handleCommandeSelection(e.target.value)}
                className={`${inputClasses} pl-12 appearance-none cursor-pointer`}
                onFocus={() => handleFocus('idCommande')}
                onBlur={() => handleBlur('idCommande')}
              >
                <option value="">Sélectionner une commande</option>
                {commandesDisponibles.map((commande) => (
                  <option key={commande.idCommande} value={commande.idCommande}>
                    {commande.numero_commande} - {commande.client} ({formatPrix(commande.total_commande)})
                  </option>
                ))}
              </select>
              <label className={`${labelClasses} ${focusedFields.idCommande ? 'text-blue-600' : ''}`}>
                Commande disponible *
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-4">
              {commandesDisponibles.length} commande(s) disponible(s)
            </p>
          </div>

          {/* Date de livraison prévue */}
          <div className={inputContainerClasses}>
            <div className="relative">
              <Calendar className={`${iconClasses} ${focusedFields.date_livraison_prevue ? 'text-blue-500' : ''}`} size={20} />
              <input
                type="date"
                name="date_livraison_prevue"
                required
                value={formData.date_livraison_prevue}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`${inputClasses} pl-12 cursor-pointer`}
                onFocus={() => handleFocus('date_livraison_prevue')}
                onBlur={() => handleBlur('date_livraison_prevue')}
                title="Sélectionnez la date prévue de livraison"
              />
              <label className={`${labelClasses} ${focusedFields.date_livraison_prevue ? 'text-blue-600' : ''}`}>
                Date de livraison prévue *
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-4">
              La date doit être aujourd'hui ou dans le futur
            </p>
          </div>
          
          {/* Notes de livraison */}
          <div className={inputContainerClasses}>
            <div className="relative">
              <FileText className={`absolute left-4 top-4 h-5 w-5 ${focusedFields.notes_livraison ? 'text-blue-500' : 'text-gray-400'}`} />
              <textarea
                name="notes_livraison"
                value={formData.notes_livraison}
                onChange={handleChange}
                rows="3"
                className={`${inputClasses} pl-12 resize-none`}
                placeholder=" "
                onFocus={() => handleFocus('notes_livraison')}
                onBlur={() => handleBlur('notes_livraison')}
              />
              <label className={`${labelClasses} ${focusedFields.notes_livraison ? 'text-blue-600' : ''}`}>
                Notes de livraison (optionnel)
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
              onClick={handleCreateLivraison}
              disabled={loading || !formData.idCommande || !formData.date_livraison_prevue}
              className="flex-1 px-6 py-3 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <CheckCircle size={18} />
              )}
              {loading ? 'Création...' : 'Créer la livraison'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;