import React, { useEffect } from 'react';
import { X, CreditCard, DollarSign, AlertTriangle, FileText } from 'lucide-react';
import axios from 'axios';
import LogoTB from '../../assets/LogoTB.png';
import { XMarkIcon } from '@heroicons/react/24/outline';

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix || 0);
};

export const ModalPaiement = ({ 
  commandeAPayer, 
  setShowPaiementModal, 
  setCommandeAPayer,
  formPaiement,
  setFormPaiement,
  fetchCommandes,
  getAuthHeaders,
  onPaiementReussi
}) => {
  // Déclarer montantMax AVANT le useEffect
  const montantMax = commandeAPayer ? (commandeAPayer.montant_reste_payer || commandeAPayer.total_commande) : 0;

  useEffect(() => {
    if (commandeAPayer && montantMax > 0) {
      setFormPaiement({
        montant: montantMax.toString(),
        methode_paiement: 'especes'
      });
    }
  }, [commandeAPayer, montantMax]);

  if (!commandeAPayer) return null;

  // Enregistrer le paiement
  const enregistrerPaiement = async () => {
    if (!commandeAPayer) return;

    // Validation
    if (!formPaiement.montant || parseFloat(formPaiement.montant) <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    if (parseFloat(formPaiement.montant) > montantMax) {
      alert(`Le montant ne peut pas dépasser ${formatPrix(montantMax)}`);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/commandes/${commandeAPayer.idCommande}/paiement`,
        {
          montant: parseFloat(formPaiement.montant),
          methode_paiement: formPaiement.methode_paiement
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.message) {
        alert('Paiement enregistré avec succès !');
        setShowPaiementModal(false);
        setCommandeAPayer(null);
        setFormPaiement({
          montant: '',
          methode_paiement: 'especes'
        });
        
        // Recharger les données
        if (fetchCommandes) {
          fetchCommandes();
        }
        
        // Appeler le callback si fourni
        if (onPaiementReussi) {
          onPaiementReussi();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      alert('Erreur lors de l\'enregistrement du paiement: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleMontantChange = (e) => {
    const value = e.target.value;
    // Permet les nombres décimaux avec 2 décimales maximum
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormPaiement({
        ...formPaiement,
        montant: value
      });
    }
  };

  const handleClose = () => {
    setShowPaiementModal(false);
    setCommandeAPayer(null);
    setFormPaiement({
      montant: '',
      methode_paiement: 'especes'
    });
  };

  // Classes CSS réutilisables (identiques à ProduitForm)
  const inputContainerClasses = "relative mt-8";
  const inputClasses = "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 peer";
  const labelClasses = "absolute left-4 -top-2 px-2 bg-white text-gray-600 text-sm font-medium transition-all duration-200 peer-focus:text-blue-600";
  const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        
        {/* Bouton fermeture (style ProduitForm) */}
       

        {/* Bouton fermeture */}
                <button
                  onClick={handleClose}
                  className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
                 
                >
                  <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
                </button>
        
                {/* Logo */}
                <div className="flex justify-center mb-4 pt-6">
                  <img src={LogoTB} alt="logo" className='w-32'/>
                </div>

        {/* Header */}
        <div className="mb-4 px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Paiement requis pour la livraison
          </h2>
        </div>

        {/* Content avec scroll */}
        <div className="px-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="space-y-6">
            
            {/* Informations de la commande */}
            <div className="bg-gray-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations de la commande
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>N° Commande:</span>
                  <strong>{commandeAPayer.numero_commande}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Client:</span>
                  <strong>{commandeAPayer.client?.nom_prenom_client || commandeAPayer.nom_client || 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Avertissement */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-orange-800 mb-1">
                    Paiement incomplet
                  </h3>
                  <p className="text-sm text-orange-700">
                    La livraison ne peut être effectuée tant que la commande n'est pas entièrement payée.
                  </p>
                </div>
              </div>
            </div>

            {/* Montant du paiement (style ProduitForm) */}
            <div className={inputContainerClasses}>
              <div className="relative">
                <DollarSign className={iconClasses} size={20} />
                <input
                  type="text"
                  inputMode="decimal"
                  value={formPaiement.montant}
                  onChange={handleMontantChange}
                  className={`${inputClasses} pl-12 font-semibold text-blue-800`}
                  placeholder=" "
                  required
                />
                <label className={labelClasses}>
                  Montant à payer *
                </label>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">€</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-4">
                Montant restant dû: <strong>{formatPrix(montantMax)}</strong>
              </p>
            </div>

            {/* Méthode de paiement (style ProduitForm) */}
            <div className={inputContainerClasses}>
              <div className="relative">
                <CreditCard className={iconClasses} size={20} />
                <select
                  value={formPaiement.methode_paiement}
                  onChange={(e) => setFormPaiement({
                    ...formPaiement,
                    methode_paiement: e.target.value
                  })}
                  className={`${inputClasses} pl-12`}
                  required
                >
                  <option value="especes">Espèces</option>
                  <option value="carte">Carte bancaire</option>
                  <option value="virement">Virement</option>
                  <option value="cheque">Chèque</option>
                  <option value="mobile">Paiement mobile</option>
                </select>
                <label className={labelClasses}>
                  Méthode de paiement *
                </label>
              </div>
            </div>

            {/* Résumé financier */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
              <h4 className="font-semibold text-blue-800 mb-3">Résumé financier</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total commande:</span>
                  <span className="font-medium">{formatPrix(commandeAPayer.total_commande)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Déjà payé:</span>
                  <span className="text-green-600 font-medium">{formatPrix(commandeAPayer.montant_deja_paye || 0)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t-2 border-blue-200 pt-2 mt-2">
                  <span className="text-gray-800">Reste à payer:</span>
                  <span className="text-orange-600">{formatPrix(montantMax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Actions (style ProduitForm) */}
        <div className="p-6 rounded-b-3xl mb-8">
          <div className="">
            
            <button
              onClick={enregistrerPaiement}
              disabled={!formPaiement.montant || parseFloat(formPaiement.montant) <= 0}
              className="flex-1 px-6 py-2 w-full bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105"
            >
              <CreditCard className="h-5 w-5" />
              <span>Payer {formatPrix(parseFloat(formPaiement.montant) || 0)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPaiement;