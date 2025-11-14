import React from 'react';
import { X, AlertTriangle, Trash2, Package } from 'lucide-react';

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

export const ModalSuppression = ({ 
  commandeASupprimer, 
  setShowSuppressionModal, 
  setCommandeASupprimer,
  onConfirmSuppression,
  typeSuppression = 'normale' // 'normale' ou 'definitive'
}) => {
  if (!commandeASupprimer) return null;

  const isSuppressionDefinitive = typeSuppression === 'definitive';
  const titre = isSuppressionDefinitive ? 'Supprimer définitivement' : 'Supprimer la commande';
  const messageAction = isSuppressionDefinitive 
    ? 'Cette action est irréversible. La commande et toutes ses données seront définitivement effacées.' 
    : 'La commande sera annulée et les stocks seront libérés.';

  const handleConfirm = () => {
    onConfirmSuppression(commandeASupprimer, isSuppressionDefinitive);
  };

  const handleClose = () => {
    setShowSuppressionModal(false);
    setCommandeASupprimer(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full mx-auto transform transition-all duration-300 scale-95 hover:scale-100 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isSuppressionDefinitive ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                {isSuppressionDefinitive ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{titre}</h2>
                <p className="text-gray-600 text-sm">
                  Commande #{commandeASupprimer.numero_commande}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Informations commande */}
          <div className="mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {commandeASupprimer.client?.nom_prenom_client || 'Client inconnu'}
                </p>
                <p className="text-sm text-gray-600">
                  {commandeASupprimer.lignes_commande?.length || 0} produit(s) • 
                  Total: {formatPrix(commandeASupprimer.total_commande)}
                </p>
              </div>
            </div>
            
            {/* Produits */}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {commandeASupprimer.lignes_commande?.slice(0, 3).map((ligne, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 truncate flex-1">
                    {ligne.produit?.nom_produit || 'Produit inconnu'}
                  </span>
                  <span className="text-gray-600 ml-2 whitespace-nowrap">
                    {ligne.quantite} × {formatPrix(ligne.prix_unitaire)}
                  </span>
                </div>
              ))}
              
              {commandeASupprimer.lignes_commande?.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{commandeASupprimer.lignes_commande.length - 3} autre(s) produit(s)
                </p>
              )}
            </div>
          </div>

          {/* Message d'avertissement */}
          <div className={`p-4 rounded-2xl border-2 ${
            isSuppressionDefinitive 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-orange-50 border-orange-200 text-orange-800'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">
                  {isSuppressionDefinitive ? 'Attention ! Action irréversible' : 'Confirmer la suppression'}
                </p>
                <p className="text-sm">
                  {messageAction}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 rounded-b-3xl">
          <button
            onClick={handleClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-3 text-white rounded-2xl transition-all duration-200 hover:scale-105 ${
              isSuppressionDefinitive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {isSuppressionDefinitive ? 'Supprimer définitivement' : 'Confirmer la suppression'}
          </button>
        </div>
      </div>
    </div>
  );
};