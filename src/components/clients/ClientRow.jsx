import React from 'react';
import { Mail, Phone, MapPin, IdCard, Calendar, Eye, ShoppingCart, Edit, Trash2 } from 'lucide-react';

const ClientRow = ({ client, onViewDetails, onEdit, onDelete, onSelectProducts }) => {
  return (
    <tr className="bg-white hover:bg-gray-100 transition-colors duration-200 ">
      <td className="px-6 py-4 whitespace-nowrap ">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-800 font-medium text-sm">
              {client.nom_prenom_client?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {client.nom_prenom_client}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <IdCard className="h-3 w-3" />
              {client.cin_client}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center gap-1">
          <Mail className="h-3 w-3" />
          {client.email_client}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {client.telephone_client}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate" title={client.adresse_client}>
          <MapPin className="h-3 w-3 inline mr-1" />
          {client.adresse_client}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-4">
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {client.commandes_count || 0}
            </div>
            <div className="text-xs text-gray-500">Commandes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-green-600">
              {client.total_commandes ? `${client.total_commandes} DH` : '0 DH'}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {client.derniere_commande ? (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(client.derniere_commande).toLocaleDateString('fr-FR')}
          </div>
        ) : (
          'Aucune commande'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-3">
          <button
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-900 transition-colors group relative"
            title="Voir détails"
          >
            <Eye className="h-4 w-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Voir détails
            </span>
          </button>
          
          <button
            onClick={onSelectProducts}
            className="text-purple-600 hover:text-purple-900 transition-colors group relative"
            title="Créer une commande"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Créer commande
            </span>
          </button>
          
          <button
            onClick={onEdit}
            className="text-green-600 hover:text-green-900 transition-colors group relative"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Modifier
            </span>
          </button>
          
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900 transition-colors group relative"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Supprimer
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ClientRow;