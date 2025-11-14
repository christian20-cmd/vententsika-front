import React from 'react';
import { X, Trash2, Copy } from 'lucide-react';
import axios from 'axios';
import LogoTB from '../../assets/LogoTB.png'
import { XMarkIcon } from '@heroicons/react/24/outline';

export const ModalChoixAnnulation = ({ 
  commandeAAnnuler, 
  setShowAnnulationModal, 
  setCommandeAAnnuler,
  fetchCommandes,
  fetchStatistiques,
  getAuthHeaders,
  dupliquerCommande
}) => {
  if (!commandeAAnnuler) return null;

  // Confirmer l'annulation simple
  const confirmerAnnulation = async () => {
    if (!commandeAAnnuler) return;
    
    try {
      const response = await axios.put(
        `http://localhost:8000/api/commandes/${commandeAAnnuler.idCommande}/annuler`,
        {},
        { headers: getAuthHeaders() }
      );
      if (response.data.success) {
        alert('Commande annulée avec succès ! Les stocks ont été libérés.');
        setShowAnnulationModal(false);
        setCommandeAAnnuler(null);
        
        await fetchCommandes();
        await fetchStatistiques();
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert("Erreur lors de l'annulation de la commande");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full mx-auto transform transition-all duration-300 scale-95 hover:scale-100 shadow-2xl">
        <button
          onClick={() => {
              setShowAnnulationModal(false);
              setCommandeAAnnuler(null);
            }}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold text-black">Annuler la commande</h2>
          <p className="text-gray-600 mt-2">
            Commande #{commandeAAnnuler.numero_commande} - {commandeAAnnuler.client?.nom_prenom_client}
          </p>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-4">Que souhaitez-vous faire ?</h3>
            
            <div className="space-y-2">
              <button
                onClick={confirmerAnnulation}
                className="w-full p-4 border-2 border-red-200 rounded-2xl hover:bg-red-50 transition-all duration-200 text-left hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800">Annuler définitivement</h4>
                    <p className="text-sm text-gray-600">
                      La commande sera annulée et les stocks seront libérés
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAnnulationModal(false);
                  dupliquerCommande(commandeAAnnuler);
                }}
                className="w-full p-4 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 transition-all duration-200 text-left hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Copy className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Dupliquer et modifier</h4>
                    <p className="text-sm text-gray-600">
                      Créer une nouvelle commande en modifiant les produits
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ L'annulation libérera les stocks réservés pour cette commande.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};