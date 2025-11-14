import React from 'react';
import { Package } from 'lucide-react';

const CommandesTab = ({ client }) => {
  return (
    <div>
      {(!client.produits_commandes || client.produits_commandes.length === 0) ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune commande</h3>
          <p className="mt-2 text-gray-500">Ce client n'a pas encore passé de commande.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {client.produits_commandes.map((commande, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-300 transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{commande.produit}</h4>
                  <p className="text-sm text-gray-600 mt-1">Quantité: {commande.quantite}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{commande.sous_total} DH</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    commande.statut === 'livrée' ? 'bg-green-100 text-green-800' :
                    commande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {commande.statut}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Date: {new Date(commande.date_commande).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandesTab;