import React from 'react';
import { X, Calculator, DollarSign, FileText, Info, CreditCard } from 'lucide-react';
import { formatPrix } from './utils';
import LogoTB from '../../assets/LogoTB.png';

const CalculsModal = ({ livraison, onClose }) => {
  return (
    <div className="fixed -inset-6 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
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
          <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6" />
            Détails des Calculs
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {livraison.numero_suivi}
          </p>
        </div>

        {/* Content avec scroll */}
        <div className="px-6 overflow-y-auto max-h-[60vh] custom-scrollbar space-y-6">
          {/* Cartes principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-600">Montant Commande</p>
              </div>
              <p className="text-lg font-bold text-blue-800">
                {formatPrix(livraison.montant_total_commande)}
              </p>
            </div>
            
            <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-600">Frais Livraison (10%)</p>
              </div>
              <p className="text-lg font-bold text-green-800">
                {formatPrix(livraison.frais_livraison_appliques || livraison.frais_livraison)}
              </p>
            </div>
          </div>

          {/* Calcul détaillé */}
          {livraison.calcul_detaille && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calcul détaillé
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Montant de la commande :</span>
                  <span className="font-semibold text-gray-800">{formatPrix(livraison.calcul_detaille?.base_calcul)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Pourcentage appliqué :</span>
                  <span className="font-semibold text-blue-600">10%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Frais calculés :</span>
                  <span className="font-semibold text-green-600">{formatPrix(livraison.calcul_detaille?.frais_calcules)}</span>
                </div>
                <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-gray-300 font-bold">
                  <span className="text-gray-800">Total avec livraison :</span>
                  <span className="text-blue-800 text-lg">{formatPrix(livraison.calcul_detaille?.total_avec_livraison)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Informations de paiement */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <p className="text-sm font-medium text-orange-600">Montant déjà payé</p>
              </div>
              <p className="text-lg font-bold text-orange-800">
                {formatPrix(livraison.montant_deja_paye)}
              </p>
            </div>
            
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-red-600" />
                <p className="text-sm font-medium text-red-600">Reste à payer</p>
              </div>
              <p className="text-lg font-bold text-red-800">
                {formatPrix(livraison.montant_reste_payer)}
              </p>
            </div>
          </div>

          {/* Notes de livraison */}
          {livraison.notes_livraison && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-700">Notes de livraison</h4>
              </div>
              <p className="text-sm text-yellow-800 leading-relaxed">
                {livraison.notes_livraison}
              </p>
            </div>
          )}

          {/* Information supplémentaire */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Information
                </p>
                <p className="text-xs text-blue-700">
                  Les frais de livraison sont calculés automatiquement à 10% du montant de la commande.
                  Le total inclut les frais de livraison appliqués.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 mt-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-black  rounded-2xl hover:bg-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105"
          >
            <X size={18} />
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculsModal;