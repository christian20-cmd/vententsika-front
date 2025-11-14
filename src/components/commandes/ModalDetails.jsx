import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Package, CreditCard, CheckCheckIcon, DollarSign, Ban, Copy, RotateCcw } from 'lucide-react';
import LogoTB from '../../assets/LogoTB.png';

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getCouleurStatut = (statut) => {
  const couleurs = {
    'attente_validation': 'bg-yellow-500',
    'validee': 'bg-blue-600',
    'en_preparation': 'bg-orange-500',
    'expediee': 'bg-purple-600',
    'livree': 'bg-green-600',
    'annulee': 'bg-red-600'
  };
  return couleurs[statut] || 'bg-gray-500';
};

const getLibelleStatut = (statut) => {
  const libelles = {
    'attente_validation': 'En attente',
    'validee': 'Validée',
    'en_preparation': 'En préparation',
    'expediee': 'Expédiée',
    'livree': 'Livrée',
    'annulee': 'Annulée'
  };
  return libelles[statut] || statut;
};

export const ModalDetails = ({ 
  selectedCommande, 
  setShowModal, 
  dupliquerCommande,
  restaurerCommande,
  ouvrirModalPaiement 
}) => {
  if (!selectedCommande) return null;

  const totalProduitsModal = selectedCommande.lignes_commande?.reduce((total, ligne) => {
    const quantite = parseInt(ligne.quantite) || 0;
    return total + quantite;
  }, 0) || 0;

  // Informations de paiement
  const totalCommande = selectedCommande.total_commande || 0;
  const montantDejaPaye = selectedCommande.paiements && selectedCommande.paiements.length > 0 
    ? selectedCommande.paiements.reduce((total, paiement) => total + (parseFloat(paiement.montant) || 0), 0)
    : 0;
  const resteAPayer = totalCommande - montantDejaPaye;
  const estTotalementPayee = Math.abs(montantDejaPaye - totalCommande) < 0.01;
  const estPartiellementPayee = montantDejaPaye > 0 && !estTotalementPayee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Bouton fermeture */}
        <button
          onClick={() => setShowModal(false)}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>

        {/* En-tête */}
        <div className='text-center px-6'>
          <h2 className="text-xl font-bold">Détails de la Commande</h2>
          <p className="text-gray-500">
            #{selectedCommande.numero_commande}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Statut */}
          <div className="text-center">
            <span className={`px-4 py-2 text-white rounded-2xl text-sm font-medium ${getCouleurStatut(selectedCommande.statut)}`}>
              {getLibelleStatut(selectedCommande.statut)}
            </span>
          </div>

          {/* Informations commande */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Informations commande</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date création:</span>
                <span className="font-medium">{formatDate(selectedCommande.created_at)}</span>
              </div>
              {selectedCommande.date_livraison && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date livraison:</span>
                  <span className="font-medium">{formatDate(selectedCommande.date_livraison)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium text-blue-800">{formatPrix(selectedCommande.total_commande)}</span>
              </div>
            </div>
          </div>

          {/* Informations client */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Informations client</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Nom:</span>
                <p className="font-medium">{selectedCommande.client?.nom_prenom_client || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{selectedCommande.client?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Téléphone:</span>
                <p className="font-medium">{selectedCommande.client?.telephone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Adresse livraison:</span>
                <p className="font-medium">{selectedCommande.adresse_livraison || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="space-y-4 bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Paiement</h3>
            
            <div className="text-center mb-4">
              {estTotalementPayee && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCheckIcon size={20} />
                  <span className="font-semibold">Entièrement payée</span>
                </div>
              )}
              {estPartiellementPayee && (
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <DollarSign size={20} />
                  <span className="font-semibold">Acompte versé</span>
                </div>
              )}
              {!estTotalementPayee && !estPartiellementPayee && (
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <Ban size={20} />
                  <span className="font-semibold">En attente</span>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payé:</span>
                <span className="font-medium text-green-600">{formatPrix(montantDejaPaye)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reste à payer:</span>
                <span className="font-medium text-orange-600">{formatPrix(resteAPayer)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-semibold">Total:</span>
                <span className="font-bold text-blue-600">{formatPrix(totalCommande)}</span>
              </div>
            </div>

            {estPartiellementPayee && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{Math.round((montantDejaPaye / totalCommande) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(montantDejaPaye / totalCommande) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {resteAPayer > 0 && (
              <button
                onClick={ouvrirModalPaiement}
                className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <CreditCard size={16} />
                <span>Enregistrer un paiement</span>
              </button>
            )}
          </div>

          {/* Produits */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">
              Produits ({totalProduitsModal} article{totalProduitsModal !== 1 ? 's' : ''})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedCommande.lignes_commande?.map((ligne, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
                  {ligne.produit?.medias?.[0] ? (
                    <img
                      src={`http://localhost:8000/storage/${ligne.produit.medias[0].chemin_fichier}`}
                      alt={ligne.produit.nom_produit}
                      className="w-12 h-12 object-cover rounded-2xl border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{ligne.produit?.nom_produit || 'Produit inconnu'}</p>
                    <p className="text-sm text-gray-500">Réf: {ligne.produit?.reference || 'N/A'}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-600">Qty: {ligne.quantite}</span>
                      <span className="text-sm font-medium">{formatPrix(ligne.sous_total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {selectedCommande.notes && (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
              <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Notes:</h4>
              <p className="text-yellow-700 text-sm">{selectedCommande.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-3 pt-4">
            {selectedCommande.statut === 'annulee' && (
              <>
                <button
                  onClick={dupliquerCommande}
                  className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Copy size={16} />
                  <span>Dupliquer la commande</span>
                </button>
                <button
                  onClick={restaurerCommande}
                  className="w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={16} />
                  <span>Restaurer la commande</span>
                </button>
              </>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-6 py-3 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-200 hover:scale-105"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};