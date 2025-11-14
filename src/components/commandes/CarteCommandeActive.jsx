import React from 'react';
import { Package, CreditCard, CheckCheckIcon, DollarSign, Ban, Edit3, Trash2, MapPin, Database, Calendar, User2 } from 'lucide-react';
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
    
    // Si c'est déjà un objet Date
    if (dateString instanceof Date) {
      date = dateString;
    } 
    // Si c'est une string ISO
    else if (typeof dateString === 'string') {
      date = parseISO(dateString);
    }
    // Si c'est un timestamp
    else if (typeof dateString === 'number') {
      date = new Date(dateString);
    } else {
      // Si c'est undefined ou null
      return 'Date non disponible';
    }
    
    if (!date || !isValid(date)) {
      console.warn('Date invalide:', dateString);
      return 'Date non disponible';
    }
    
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
  } catch (error) {
    console.error('Erreur formatage date:', error, dateString);
    return 'Date non disponible';
  }
};

const getCouleurStatut = (statut) => {
  const couleurs = {
    'attente_validation': 'bg-yellow-500',
    'validee': 'bg-green-600',
    'annulee': 'bg-red-600',
    'panier': 'bg-gray-500',
    'en_preparation': 'bg-blue-500',
    'expediee': 'bg-purple-500',
    'livree': 'bg-green-700'
  };
  return couleurs[statut] || 'bg-gray-500';
};

const getLibelleStatut = (statut) => {
  const libelles = {
    'attente_validation': 'En attente',
    'validee': 'Validée',
    'annulee': 'Annulée',
    'panier': 'Panier',
    'en_preparation': 'En préparation',
    'expediee': 'Expédiée',
    'livree': 'Livrée'
  };
  return libelles[statut] || statut;
};

const getCouleurStatutPaiement = (statutPaiement) => {
  const couleurs = {
    'paye': 'bg-green-100 text-green-800 border-green-200',
    'acompte': 'bg-orange-100 text-orange-800 border-orange-200',
    'impaye': 'bg-red-100 text-red-800 border-red-200'
  };
  return couleurs[statutPaiement] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getLibelleStatutPaiement = (statutPaiement) => {
  const libelles = {
    'paye': 'Payée',
    'acompte': 'Acompte',
    'impaye': 'Non payée'
  };
  return libelles[statutPaiement] || statutPaiement;
};

// Fonction pour tronquer l'adresse si elle est trop longue
const tronquerAdresse = (adresse, maxLength = 40) => {
  if (!adresse) return 'Adresse non spécifiée';
  if (adresse.length <= maxLength) return adresse;
  return adresse.substring(0, maxLength) + '...';
};

export const CarteCommandeActive = ({
  commande,
  setSelectedCommande,
  setShowModal,
  setModalType,
  updateStatutCommande,
  genererFacture,
  ouvrirModalAnnulation,
  ouvrirModalPaiement,
  ouvrirModalModification,
  ouvrirModalSuppression
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
  const montantRestePayer = parseFloat(commande.montant_reste_payer) || 0;
  
  const statutPaiement = commande.statut_paiement || 'impaye';
  const estTotalementPayee = statutPaiement === 'paye';
  const estPartiellementPayee = statutPaiement === 'acompte';
  const estNonPayee = statutPaiement === 'impaye';

  const pourcentagePaiement = totalCommande > 0 ? (montantDejaPaye / totalCommande) * 100 : 0;

  // Fonction pour obtenir la date à afficher
  const getDateAAfficher = () => {
    return commande.date_creation || commande.created_at_iso || commande.created_at;
  };

  // Vérifier si la commande peut être modifiée/supprimée
  const peutModifier = commande.statut === 'attente_validation' || commande.statut === 'panier' || commande.statut === 'validee';
  const peutSupprimer = commande.statut === 'attente_validation' || commande.statut === 'panier' || commande.statut === 'validee';
  const peutValider = commande.statut === 'attente_validation';

  // ⭐⭐ MODIFICATION: Le bouton Annuler ne s'affiche plus pour les commandes livrées ou en préparation
  const peutAnnuler = commande.statut === 'attente_validation';

  // Adresse de livraison
  const adresseLivraison = commande.adresse_livraison || 'Adresse à préciser';
  const adresseTronquee = tronquerAdresse(adresseLivraison);

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-gray-600 p-4 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="font-bold text-black">
              Commande <br /> {commande.numero_commande}
            </h3>
            <span className={`px-3 py-1 text-xs text-white rounded-2xl ${getCouleurStatut(commande.statut)}`}>
              {getLibelleStatut(commande.statut)}
            </span>
          </div>
          <div className="">

            <div className="flex items-baseline">
              <User2 size={10} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                <span className="font-medium">Client:</span> {commande.client?.nom_prenom_client || 'N/A'}
              </p>
            </div>

            <div className="flex items-baseline">
              <Calendar size={10} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                <span className="font-medium">Date:</span> {formatDate(getDateAAfficher())}
              </p>
            </div>
            
            
            {/* ⭐⭐ AJOUT: Adresse de livraison */}
            <div className="flex items-baseline">
              <MapPin size={10} className="text-gray-500 mt-0.5 flex-shrink-0" />
              
                <p className="text-xs font-medium text-gray-700">Adresse de livraison:   {adresseTronquee}</p>
               
                 
                
             
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-blue-800">
            {formatPrix(totalCommande)}
          </p>
          <p className="text-sm text-gray-600">
            {totalProduits} produit(s) • {nombreLignes} ligne(s)
          </p>
        </div>
      </div>

      {/* Section Paiement */}
      <div className="mb-4 p-3 bg-gray-200 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            {estTotalementPayee && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCheckIcon size={16} />
                <span className="text-sm font-medium">Payée</span>
              </div>
            )}
            {estPartiellementPayee && (
              <div className="flex items-center space-x-1 text-orange-600">
                <DollarSign size={16} />
                <span className="text-sm font-medium">Acompte</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  {Math.round(pourcentagePaiement)}%
                </span>
              </div>
            )}
            {estNonPayee && (
              <div className="flex items-center space-x-1 text-red-600">
                <Ban size={16} />
                <span className="text-sm font-medium">Non payée</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {formatPrix(montantDejaPaye)} / {formatPrix(totalCommande)}
            </p>
            {montantRestePayer > 0 && (
              <p className="text-xs text-gray-600">
                Reste: {formatPrix(montantRestePayer)}
              </p>
            )}
          </div>
        </div>
        
        {/* Barre de progression pour les acomptes */}
        {estPartiellementPayee && (
          <div className="mt-2 w-full bg-white rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pourcentagePaiement}%` }}
            ></div>
          </div>
        )}
        
        {/* Badge de statut de paiement */}
        <div className={`mt-2 inline-flex px-2 py-1 text-xs font-medium rounded-lg border ${getCouleurStatutPaiement(statutPaiement)}`}>
          {getLibelleStatutPaiement(statutPaiement)}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Produits ({totalProduits} article{totalProduits !== 1 ? 's' : ''}):
        </p>
        
        {commande.lignes_commande && commande.lignes_commande.length > 0 ? (
          <div className="space-y-3">
            {commande.lignes_commande.slice(0, 3).map((ligne, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3 flex-1">
                  {ligne.produit?.medias?.[0] ? (
                    <img
                      src={`http://localhost:8000/storage/${ligne.produit.medias[0].chemin_fichier}`}
                      alt={ligne.produit.nom_produit}
                      className="w-12 h-12 object-cover rounded-2xl border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
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
                <p className="text-sm font-medium text-blue-800 whitespace-nowrap ml-2">
                  {formatPrix(ligne.sous_total)}
                </p>
              </div>
            ))}
            
            {commande.lignes_commande.length > 3 && (
              <p className="text-xs text-gray-500 text-center mt-2 bg-gray-50 py-2 rounded-2xl">
                +{commande.lignes_commande.length - 3} autre{commande.lignes_commande.length - 3 > 1 ? 's' : ''} produit{commande.lignes_commande.length - 3 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-2xl">
            Aucun produit dans cette commande
          </p>
        )}
      </div>

      {/* SECTION BOUTONS REORGANISÉE */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
        {/* Première ligne: Boutons Détails, Facture, Modifier, Supprimer */}
        <div className="flex justify-between items-center">
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
              onClick={() => genererFacture(commande.idCommande)}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-2xl transition-all duration-200 hover:scale-105"
            >
              Facture
            </button>
          </div>

          <div className="flex space-x-2">
            {/* Bouton Modifier - Uniquement pour les commandes modifiables */}
            {peutModifier && (
              <button
                onClick={() => ouvrirModalModification(commande)}
                className="px-4 py-2 text-sm bg-purple-200 text-purple-800 hover:text-purple-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center space-x-1"
                title="Modifier la commande"
              >
                <Edit3 size={14} />
                <span>Modifier</span>
              </button>
            )}

            {/* Bouton Supprimer - Uniquement pour les commandes supprimables */}
            {peutSupprimer && (
              <button
                onClick={() => ouvrirModalSuppression(commande)}
                className="px-4 py-2 text-sm bg-red-200 text-red-800 hover:text-red-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center space-x-1"
                title="Supprimer la commande"
              >
                <Trash2 size={14} />
                <span>Supprimer</span>
              </button>
            )}
          </div>
        </div>

        {/* Deuxième ligne: Boutons Paiement, Annuler, Valider */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {/* Bouton Paiement - Afficher seulement si reste à payer */}
            {montantRestePayer > 0 && (
              <button
                onClick={() => ouvrirModalPaiement(commande)}
                className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center space-x-1"
              >
                <CreditCard size={14} />
                <span>Payer</span>
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            {/* Bouton Annulation - Pour les commandes non supprimables mais annulables */}
            {peutAnnuler && (
              <button
                onClick={() => ouvrirModalAnnulation(commande)}
                className="px-4 py-2 text-sm bg-gray-200 text-text-black hover:text-gray-700 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                Annuler
              </button>
            )}
            
            {/* Bouton Valider - Uniquement pour les commandes en attente */}
            {peutValider && (
              <button
                onClick={() => updateStatutCommande(commande.idCommande, 'validee')}
                className="px-4 py-2 text-sm bg-blue-800 text-white hover:bg-blue-700 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                Valider
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarteCommandeActive;