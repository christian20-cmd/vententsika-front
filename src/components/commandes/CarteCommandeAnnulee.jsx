import React from 'react';
import { Package, Trash2, Copy, RotateCcw } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Date non disponible';
  
  try {
    let date;
    
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      date = parseISO(dateString);
    } else if (typeof dateString === 'number') {
      date = new Date(dateString);
    } else {
      return 'Date non disponible';
    }
    
    if (!date || !isValid(date)) {
      return 'Date non disponible';
    }
    
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
  } catch (error) {
    console.error('Erreur formatage date:', error);
    return 'Date non disponible';
  }
};

export const CarteCommandeAnnulee = ({
  commande,
  setSelectedCommande,
  setShowModal,
  setModalType,
  dupliquerCommande,
  restaurerCommande,
  ouvrirModalSuppressionDefinitive
}) => {
  const getTotalProduits = () => {
    if (!commande.lignes_commande || commande.lignes_commande.length === 0) {
      return 0;
    }
    return commande.lignes_commande.reduce((total, ligne) => {
      const quantite = parseInt(ligne.quantite) || 0;
      return total + quantite;
    }, 0);
  };

  const totalProduits = getTotalProduits();
  const nombreLignes = commande.lignes_commande?.length || 0;

  const totalCommande = parseFloat(commande.total_commande) || 0;
  const montantDejaPaye = parseFloat(commande.montant_deja_paye) || 0;

  // Fonction pour obtenir la date à afficher
  const getDateAAfficher = () => {
    return commande.date_creation || commande.created_at_iso || commande.created_at;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-600 p-6 hover:shadow-xl transition-all duration-300 group border-2 border-red-200 bg-red-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="font-bold text-red-800 text-lg">
              Commande <br /> #{commande.numero_commande}
            </h3>
            <span className="px-3 py-1 text-xs text-white rounded-2xl bg-red-600">
              Annulée
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Client:</span> {commande.client?.nom_prenom_client || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span> {formatDate(getDateAAfficher())}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-red-800">
            {formatPrix(totalCommande)}
          </p>
          <p className="text-sm text-gray-600">
            {totalProduits} produit(s) • {nombreLignes} ligne(s)
          </p>
        </div>
      </div>

      {/* Section Paiement */}
      {montantDejaPaye > 0 && (
        <div className="mb-4 p-3 bg-red-100 rounded-2xl border border-red-200">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-red-800">
              Montant déjà payé: {formatPrix(montantDejaPaye)}
            </p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Produits ({totalProduits} article{totalProduits !== 1 ? 's' : ''}):
        </p>
        
        {commande.lignes_commande && commande.lignes_commande.length > 0 ? (
          <div className="space-y-3">
            {commande.lignes_commande.slice(0, 3).map((ligne, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-red-100 last:border-b-0">
                <div className="flex items-center space-x-3 flex-1">
                  {ligne.produit?.medias?.[0] ? (
                    <img
                      src={`http://localhost:8000/storage/${ligne.produit.medias[0].chemin_fichier}`}
                      alt={ligne.produit.nom_produit}
                      className="w-12 h-12 object-cover rounded-2xl border border-red-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-red-100 rounded-2xl border border-red-200 flex items-center justify-center">
                      <Package className="w-6 h-6 text-red-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ligne.produit?.nom_produit || 'Produit inconnu'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Quantité: {ligne.quantite} × {formatPrix(ligne.prix_unitaire)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-red-800 whitespace-nowrap ml-2">
                  {formatPrix(ligne.sous_total)}
                </p>
              </div>
            ))}
            
            {commande.lignes_commande.length > 3 && (
              <p className="text-xs text-gray-500 text-center mt-2 bg-red-100 py-2 rounded-2xl">
                +{commande.lignes_commande.length - 3} autre{commande.lignes_commande.length - 3 > 1 ? 's' : ''} produit{commande.lignes_commande.length - 3 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4 bg-red-100 rounded-2xl">
            Aucun produit dans cette commande
          </p>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-red-200">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedCommande(commande);
              setShowModal(true);
              setModalType('details');
            }}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            Détails
          </button>
          
          <button
            onClick={() => dupliquerCommande(commande)}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center space-x-1"
            title="Dupliquer la commande"
          >
            <Copy size={14} />
            <span>Dupliquer</span>
          </button>
          
          <button
            onClick={() => restaurerCommande(commande)}
            className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center space-x-1"
            title="Restaurer la commande"
          >
            <RotateCcw size={14} />
            <span>Restaurer</span>
          </button>
        </div>
        
        {/* Bouton Supprimer définitivement */}
        <button
          onClick={() => ouvrirModalSuppressionDefinitive(commande)}
          className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center space-x-1"
          title="Supprimer définitivement"
        >
          <Trash2 size={14} />
          <span>Supprimer</span>
        </button>
      </div>
    </div>
  );
};

export default CarteCommandeAnnulee;