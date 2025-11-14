import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Save, MapPin, FileText, Edit3 } from 'lucide-react';
import LogoTB from '../../assets/LogoTB.png';

export const ModalModification = ({ 
  commandeAModifier, 
  setShowModificationModal, 
  setCommandeAModifier,
  onConfirmModification
}) => {
  const [formData, setFormData] = useState({
    adresse_livraison: commandeAModifier?.adresse_livraison || '',
    notes: commandeAModifier?.notes || ''
  });
  const [loading, setLoading] = useState(false);

  // Classes CSS identiques au modal client
  const inputClasses = "w-full px-4 py-3 border-2 border-gray-400 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 absolute -mt-3 ml-6 bg-white px-2";

  if (!commandeAModifier) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onConfirmModification(commandeAModifier.idCommande, formData);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModificationModal(false);
    setCommandeAModifier(null);
  };

  const hasChanges = 
    formData.adresse_livraison !== commandeAModifier.adresse_livraison ||
    formData.notes !== commandeAModifier.notes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Bouton fermeture */}
        <button
          onClick={handleClose}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
          disabled={loading}
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>

        {/* En-tête */}
        <div className='text-center'>
          <h2 className="text-xl font-bold">Modifier la Commande</h2>
          <p className="text-gray-500">
            Commande #{commandeAModifier.numero_commande}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Adresse de livraison */}
          <div className="relative">
            <label className={labelClasses}>
              <MapPin className="h-4 w-4" />
              Adresse de livraison *
            </label>
            <textarea
              value={formData.adresse_livraison}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                adresse_livraison: e.target.value
              }))}
              required
              rows="3"
              className={inputClasses}
              placeholder="Saisissez l'adresse de livraison..."
              disabled={loading}
            />
          </div>

          {/* Notes */}
          <div className="relative">
            <label className={labelClasses}>
              <FileText className="h-4 w-4" />
              Notes (optionnel)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              rows="3"
              className={inputClasses}
              placeholder="Ajoutez des notes pour cette commande..."
              disabled={loading}
            />
          </div>

          {/* Avertissement */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Seules l'adresse de livraison et les notes peuvent être modifiées.
              Pour modifier les produits, veuillez annuler et recréer la commande.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-2  gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-10 py-2 bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className="flex items-center gap-2 px-10 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-800/60 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Modification...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Modifier</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};