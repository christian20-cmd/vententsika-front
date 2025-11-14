import React, { useState, useEffect } from 'react';
import { X, Plus, Package } from 'lucide-react';
import LogoTB from '../../assets/LogoTB.png'
import { XMarkIcon } from '@heroicons/react/24/outline';
const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

export const ModalCreationCommande = ({ 
  commandeEnPreparation, 
  fermerModalCreation, 
  creerCommandeDepuisPreparation
}) => {
  const [choixPaiement, setChoixPaiement] = useState('non_paye');
  const [montantPaiement, setMontantPaiement] = useState(0);
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');

  // ⭐ CORRECTION: Utiliser adresse_client au lieu de adresse
  useEffect(() => {
    if (commandeEnPreparation) {
      if (commandeEnPreparation.client?.adresse_client) {
        setAdresseLivraison(commandeEnPreparation.client.adresse_client);
      }
      
      // Date de livraison par défaut : 3 jours
      const dateDefault = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setDateLivraison(dateDefault);
    }
  }, [commandeEnPreparation]);

  if (!commandeEnPreparation) return null;

  // ⭐ NOUVEAU CODE (CORRIGÉ)
  const totalCommande = commandeEnPreparation.produits.reduce((total, produit) => {
    console.log('💰 Calcul prix produit:', {
      nom: produit.nom_produit,
      prix_unitaire: produit.prix_unitaire,
      prix_promotion: produit.prix_promotion,
      quantite: produit.quantite
    });
    
    // ⭐ CORRECTION: Conversion explicite en nombres et gestion des valeurs nulles
    const prixUnitaire = parseFloat(produit.prix_unitaire) || 0;
    const prixPromotion = produit.prix_promotion ? parseFloat(produit.prix_promotion) : null;
    const quantite = parseInt(produit.quantite) || 1;
    
    const prixFinal = prixPromotion && prixPromotion > 0 ? prixPromotion : prixUnitaire;
    const sousTotal = prixFinal * quantite;
    
    console.log('📊 Sous-total calculé:', {
      prixFinal,
      quantite,
      sousTotal
    });
    
    return total + sousTotal;
  }, 0);

  // ⭐ AJOUT: Log pour débogage
  console.log('🎯 TOTAL COMMANDE CALCULÉ:', totalCommande);
  console.log('📋 Données complètes:', commandeEnPreparation.produits);

  // ⭐ CORRECTION: Utiliser adresse_client ici aussi
  const preparerDonneesAvecPaiement = () => {
    console.log('💰 PRÉPARATION DONNÉES PAIEMENT:', {
      choixPaiement,
      montantPaiement,
      totalCommande,
      estAcompte: choixPaiement === 'avance'
    });

    const donneesPaiement = {
      choix_paiement: choixPaiement,
      montant_paye: choixPaiement !== 'non_paye' ? montantPaiement : 0,
      methode_paiement: 'especes',
      // ⭐ CORRECTION: Utiliser adresse_client
      adresse_livraison: adresseLivraison || commandeEnPreparation.client.adresse_client || 'Adresse à préciser',
      date_livraison: dateLivraison
    };

    console.log('🎯 DONNÉES PAIEMENT FINALES:', donneesPaiement);

    // Validation
    if (choixPaiement === 'avance' && montantPaiement <= 0) {
      alert('Erreur: Le montant de l\'acompte doit être supérieur à 0');
      return null;
    }

    if (choixPaiement === 'avance' && montantPaiement >= totalCommande) {
      alert('Erreur: L\'acompte doit être inférieur au total de la commande');
      return null;
    }

    return donneesPaiement;
  };

  const handleCreerCommande = () => {
    console.log('=== 🚀 DÉBUT CRÉATION COMMANDE AVEC PAIEMENT ===');
    
    // ⭐ AJOUT: Validation des données avant envoi
    console.log('📋 DONNÉES VALIDATION:');
    console.log('   - Date livraison:', dateLivraison);
    console.log('   - Type:', typeof dateLivraison);
    console.log('   - Valide:', dateLivraison && !isNaN(new Date(dateLivraison).getTime()));
    
    const donneesPaiement = preparerDonneesAvecPaiement();
    if (!donneesPaiement) {
        console.error('❌ Données de paiement invalides');
        return;
    }

    console.log('✅ DONNÉES FINALES:', {
        ...donneesPaiement,
        date_livraison_type: typeof donneesPaiement.date_livraison,
        date_livraison_valeur: donneesPaiement.date_livraison
    });

    creerCommandeDepuisPreparation(donneesPaiement);
};

  // Gérer le changement de type de paiement
  const handleChangementPaiement = (nouveauChoix) => {
    console.log(`🔄 Changement type paiement: ${choixPaiement} -> ${nouveauChoix}`);
    
    setChoixPaiement(nouveauChoix);
    
    if (nouveauChoix === 'total') {
      setMontantPaiement(totalCommande);
      console.log('💳 Paiement total - Montant défini à:', totalCommande);
    } else if (nouveauChoix === 'non_paye') {
      setMontantPaiement(0);
      console.log('❌ Non payé - Montant défini à: 0');
    } else if (nouveauChoix === 'avance') {
      const acompteParDefaut = totalCommande * 0.5;
      setMontantPaiement(acompteParDefaut);
      console.log('💰 Acompte - Montant par défaut:', acompteParDefaut);
    }
  };

  // Gérer le changement manuel du montant
  const handleChangementMontant = (nouveauMontant) => {
    const montant = parseFloat(nouveauMontant) || 0;
    console.log(`📊 Changement montant: ${montantPaiement} -> ${montant}`);
    setMontantPaiement(montant);
  };

  const resteAPayer = totalCommande - (choixPaiement !== 'non_paye' ? montantPaiement : 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto pb-8 transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Bouton fermeture */}
        <button
          onClick={fermerModalCreation}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>

        <h1 className='text-xl text-center font-bold'>Finalisez votre commande</h1>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Client sélectionné</h3>
            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
              <p className="font-medium">{commandeEnPreparation.client.nom_prenom_client}</p>
              <p className="text-sm text-gray-600">Email: {commandeEnPreparation.client.email_client}</p>
              {/* ⭐ CORRECTION: Afficher l'adresse du client */}
              <p className="text-sm text-gray-600">Adresse: {commandeEnPreparation.client.adresse_client || 'Non renseignée'}</p>
              <p className="text-sm text-gray-600">Téléphone: {commandeEnPreparation.client.telephone_client}</p>
              <p className="text-sm text-gray-600">ID Client: {commandeEnPreparation.client.idClient}</p>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-700 mb-4">Produits sélectionnés</h3>
          <div className="border-2 border-gray-200 rounded-2xl overflow-hidden mb-6">

            
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sous-total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commandeEnPreparation.produits.map((produit, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {produit.medias?.[0] ? (
                          <img
                            src={`http://localhost:8000/storage/${produit.medias[0].chemin_fichier}`}
                            alt={produit.nom_produit}
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
                        <div>
                          <p className="font-medium text-gray-900">{produit.nom_produit}</p>
                          <p className="text-sm text-gray-500">Réf: {produit.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-800 rounded-2xl text-sm font-medium">
                        {produit.quantite}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {produit.prix_promotion ? (
                        <div>
                          <span className="text-red-600 font-medium">{formatPrix(produit.prix_promotion)}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{formatPrix(produit.prix_unitaire)}</span>
                        </div>
                      ) : (
                        formatPrix(produit.prix_unitaire)
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrix((produit.prix_promotion || produit.prix_unitaire) * produit.quantite)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-right font-medium">Total commande:</td>
                  <td className="px-4 py-4 text-right font-bold text-green-600 text-lg">
                    {formatPrix(totalCommande)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Section Paiement */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-3">Options de paiement</h4>
            
            {/* Alert de statut */}
            {choixPaiement === 'avance' && (
              <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                <p className="text-orange-800 font-medium">🎯 MODE ACOMPTE ACTIVÉ</p>
                <p className="text-orange-700 text-sm">Montant de l'acompte: {formatPrix(montantPaiement)}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de paiement
                </label>
                <select
                  value={choixPaiement}
                  onChange={(e) => handleChangementPaiement(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="non_paye">Non payé</option>
                  <option value="avance">Acompte</option>
                  <option value="total">Paiement total</option>
                </select>
              </div>

              {(choixPaiement === 'avance' || choixPaiement === 'total') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant {choixPaiement === 'total' ? 'du paiement' : 'de l\'acompte'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={totalCommande}
                    value={montantPaiement}
                    onChange={(e) => handleChangementMontant(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {formatPrix(totalCommande)}
                  </p>
                </div>
              )}

              {/* Récapitulatif paiement */}
              <div className="bg-white border-2 border-blue-100 rounded-2xl p-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Total commande:</span>
                  <span className="font-semibold">{formatPrix(totalCommande)}</span>
                </div>
                {choixPaiement !== 'non_paye' && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span>Montant payé:</span>
                    <span className="font-semibold text-green-600">{formatPrix(montantPaiement)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm mt-1 border-t border-blue-100 pt-1">
                  <span>Reste à payer:</span>
                  <span className={`font-semibold ${resteAPayer > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {formatPrix(resteAPayer)}
                  </span>
                </div>
                
                {/* Statut de paiement prévu */}
                <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-700">STATUT PAIEMENT PRÉVU:</p>
                  <p className={`text-xs font-bold ${
                    resteAPayer <= 0 ? 'text-green-600' : 
                    montantPaiement > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {resteAPayer <= 0 ? '✅ PAYÉ' : 
                     montantPaiement > 0 ? '💰 ACOMPTE' : '❌ NON PAYÉ'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Livraison */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 ">
            <h4 className="font-semibold text-blue-800 mb-3">Informations de livraison</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de livraison *</label>
                <input
                  type="text"
                  value={adresseLivraison}
                  onChange={(e) => setAdresseLivraison(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Adresse de livraison"
                  required
                />
                {/* ⭐ AJOUT: Aide pour l'utilisateur */}
                {commandeEnPreparation.client?.adresse_client && (
                  <p className="text-xs text-gray-500 mt-1">
                    Adresse du client: {commandeEnPreparation.client.adresse_client}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de livraison prévue</label>
                <input
                  type="date"
                  value={dateLivraison}
                  onChange={(e) => setDateLivraison(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 mx-6 gap-4">
          <button
            onClick={fermerModalCreation}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            Annuler
          </button>
          <button
            onClick={handleCreerCommande}
            className="px-6 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-800/60 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Créer la commande</span>
          </button>
        </div>
      </div>
    </div>
  );
};