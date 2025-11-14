import React from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';
import LogoTB from '../../assets/LogoTB.png'

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

export const ModalRestoration = ({ 
  commandeARestaurer, 
  setShowRestoreModal, 
  setCommandeARestaurer,
  fetchCommandes,
  fetchCommandesAnnulees,
  fetchStatistiques,
  getAuthHeaders
}) => {
  if (!commandeARestaurer) return null;

  const confirmerRestoration = async () => {
    if (!commandeARestaurer) return;
    
    try {
      console.log('🔄 RESTAURATION - Données de la commande:', commandeARestaurer);
      
      // ✅ CORRECTION: Utiliser la route de RESTAURATION (pas de création)
      const response = await axios.put(
        `http://localhost:8000/api/commandes/${commandeARestaurer.idCommande}/restaurer`,
        {}, // Pas besoin de données supplémentaires
        { headers: getAuthHeaders() }
      );
      
      console.log('✅ RÉPONSE RESTAURATION:', response.data);
      
      if (response.data.success) {
        alert('✅ Commande restaurée avec succès !');
        setShowRestoreModal(false);
        setCommandeARestaurer(null);
        
        // ✅ CORRECTION: Recharger TOUTES les données avec délai
        setTimeout(async () => {
          await fetchCommandes(); // Recharge les commandes actives
          
          if (fetchCommandesAnnulees && typeof fetchCommandesAnnulees === 'function') {
            await fetchCommandesAnnulees(); // Recharge les commandes annulées
          }
          
          await fetchStatistiques();
          console.log('🔄 Toutes les listes rechargées après RESTAURATION');
        }, 500);
        
      } else {
        throw new Error(response.data.message || 'Erreur lors de la restauration');
      }
    } catch (error) {
      console.error('❌ Erreur RESTAURATION détaillée:', error);
      console.error('📡 Réponse erreur complète:', error.response?.data);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        let errorMessage = 'Erreurs de validation:\n';
        
        Object.keys(validationErrors).forEach(key => {
          errorMessage += `- ${key}: ${validationErrors[key].join(', ')}\n`;
        });
        
        alert(errorMessage);
      } else if (error.response?.status === 500) {
        alert('❌ Erreur serveur. Vérifiez les logs Laravel pour plus de détails.');
      } else {
        alert('❌ Erreur lors de la restauration: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 font-MyFontFamily animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto pb-8 transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Bouton fermeture */}
        <button
          onClick={() => {
                setShowRestoreModal(false);
                setCommandeARestaurer(null);
              }}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>
        <div className="p-6 border-b border-gray-200 place-self-center text-center">

            <h2 className="text-xl font-bold text-gray-800">Restaurer la commande</h2>
            

          <p className="text-gray-600 mt-2">
            Commande #{commandeARestaurer.numero_commande} - {commandeARestaurer.client?.nom_prenom_client}
          </p>
          <div className="mt-2 text-xs text-blue-800 bg-blue-50 p-2 rounded-full">
            ID Client détecté: {commandeARestaurer.client?.idClient || commandeARestaurer.idClient || 'NON TROUVÉ'}
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Produits à restaurer:</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {commandeARestaurer.lignes_commande?.map((ligne, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div>
                    <p className="font-medium text-sm">{ligne.produit?.nom_produit || 'Produit inconnu'}</p>
                    <p className="text-xs text-gray-600">
                      Quantité: {ligne.quantite} • 
                      ID: {ligne.produit?.idProduit || ligne.idProduit || 'N/A'}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrix(ligne.sous_total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Une nouvelle commande sera créée avec les mêmes produits.
              Vérifiez la disponibilité des stocks avant de confirmer.
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total à restaurer:</span>
              <span className="text-green-600">
                {formatPrix(commandeARestaurer.total_commande)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-2 ">
          <button
            onClick={() => {
              setShowRestoreModal(false);
              setCommandeARestaurer(null);
            }}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            Annuler
          </button>
          <button
            onClick={confirmerRestoration}
            className="px-6 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-800/60 transition-all duration-200 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!commandeARestaurer.client?.idClient && !commandeARestaurer.idClient}
          >
            {(!commandeARestaurer.client?.idClient && !commandeARestaurer.idClient) 
              ? 'ID Client manquant' 
              : 'Confirmer la restauration'}
          </button>
        </div>
      </div>
    </div>
  );
};