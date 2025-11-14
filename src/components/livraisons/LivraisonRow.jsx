import React from 'react';
import { MapPin, Calendar, Truck, FileText, Euro } from 'lucide-react';
import ActionButtons from './ActionButtons';

// Fonctions utilitaires
const getStatusColor = (status) => {
  const colors = {
    'en_attente': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'en_preparation': 'bg-blue-100 text-blue-800 border border-blue-200',
    'expedie': 'bg-purple-100 text-purple-800 border border-purple-200',
    'en_transit': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    'livre': 'bg-green-100 text-green-800 border border-green-200',
    'retourne': 'bg-red-100 text-red-800 border border-red-200',
    'annule': 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Non définie';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix || 0);
};

const getNextStatus = (currentStatus) => {
  const nextStatusMap = {
    'en_attente': 'en_preparation',
    'en_preparation': 'expedie',
    'expedie': 'en_transit',
    'en_transit': 'livre'
  };
  return nextStatusMap[currentStatus];
};

const LivraisonRow = ({ 
  livraison, 
  actionLoading, 
  onEdit, 
  onCalculs, 
  onStatusChange, 
  onDelete, 
  onDownloadPDF,
  onVerifierPaiement
}) => {
  const nextStatus = getNextStatus(livraison.status_livraison);
  const montantRestant = livraison.montant_reste_payer || 
                        (livraison.commande?.montant_reste_payer);

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
      {/* Numéro de suivi */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="h-4 w-4 text-blue-800" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-blue-800 font-mono">
              {livraison.numero_suivi || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">
              Suivi
            </div>
          </div>
        </div>
      </td>

      {/* Numéro de commande */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded border">
          {livraison.commande?.numero_commande || 
           `CMD-${livraison.idCommande || 'N/A'}`}
        </div>
        {livraison.commande?.date_commande && (
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" />
            {formatDate(livraison.commande.date_commande)}
          </div>
        )}
      </td>

      {/* Client */}
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-gray-900">
          {livraison.nom_client || 'Non spécifié'}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {livraison.telephone_client || 'Tél. non fourni'}
        </div>
        {livraison.commande?.client?.email_client && (
          <div className="text-xs text-blue-600 truncate max-w-[180px]" title={livraison.commande.client.email_client}>
            {livraison.commande.client.email_client}
          </div>
        )}
      </td>

      {/* Adresse */}
      <td className="px-4 py-4">
        <div className="flex items-start">
          <MapPin className="h-3 w-3 text-gray-400 mt-1 mr-1 flex-shrink-0" />
          <div className="text-sm text-gray-900 line-clamp-2" title={livraison.adresse_livraison}>
            {livraison.adresse_livraison || 'Adresse non spécifiée'}
          </div>
        </div>
      </td>

      {/* Montants */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Total:</span>
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              <Euro className="h-3 w-3" />
              {formatPrix(livraison.montant_total_commande)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Frais:</span>
            <span className="text-sm font-medium text-blue-600">
              {formatPrix(livraison.frais_livraison)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Payé:</span>
            <span className={`text-sm font-medium ${montantRestant > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {montantRestant > 0 ? 
                formatPrix(livraison.montant_deja_paye) : 
                'Complet'
              }
            </span>
          </div>
        </div>
        
        {montantRestant > 0 && (
          <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded mt-2 border border-red-200 text-center">
            Reste: {formatPrix(montantRestant)}
          </div>
        )}
      </td>

      {/* Statut */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-2">
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(livraison.status_livraison)} justify-center`}>
            {livraison.status_livraison ? livraison.status_livraison.replace(/_/g, ' ') : 'Non défini'}
          </span>
          {nextStatus && (
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1 bg-gray-50 px-2 py-1 rounded border">
              <FileText className="h-3 w-3" />
              → {nextStatus.replace(/_/g, ' ')}
            </div>
          )}
        </div>
      </td>

      {/* Date prévue */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100">
          <Calendar className="h-3 w-3 text-blue-600" />
          {formatDate(livraison.date_livraison_prevue)}
        </div>
        {livraison.date_livraison_reelle && (
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1 bg-green-50 px-2 py-1 rounded border border-green-100">
            <Calendar className="h-3 w-3" />
            Livrée: {formatDate(livraison.date_livraison_reelle)}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap">
        <ActionButtons
          livraison={livraison}
          actionLoading={actionLoading}
          onEdit={onEdit}
          onCalculs={onCalculs}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onDownloadPDF={onDownloadPDF}
          onTentativeLivraison={onVerifierPaiement}
        />
      </td>
    </tr>
  );
};

export default LivraisonRow;