import React from 'react';
import { getActionsPossibles } from './utils';

const ActionButtons = ({ 
  livraison, 
  actionLoading, 
  onEdit, 
  onCalculs, 
  onStatusChange, 
  onTentativeLivraison,
  onDelete, 
  onDownloadPDF
}) => {
  const actionsPossibles = getActionsPossibles(livraison);

  const handleStatusAction = async (action) => {
    if (action === 'livrer') {
      if (onTentativeLivraison) {
        await onTentativeLivraison(livraison);
      } else if (onStatusChange) {
        await onStatusChange(action, livraison.idLivraison);
      }
    } else {
      if (onStatusChange) {
        await onStatusChange(action, livraison.idLivraison);
      }
    }
  };

  // Grouper les boutons par type pour mieux les organiser
  const statusButtons = [
    { action: 'preparation', label: 'Préparer', color: 'blue', title: 'Marquer en préparation' },
    { action: 'expedier', label: 'Expédier', color: 'purple', title: 'Marquer comme expédié' },
    { action: 'transit', label: 'Transit', color: 'indigo', title: 'Marquer en transit' },
    { action: 'livrer', label: 'Livrer', color: 'green', title: 'Marquer comme livré' },
    { action: 'annuler', label: 'Annuler', color: 'red', title: 'Annuler la livraison' }
  ];

  const actionButtons = [
    { action: 'modifier', label: 'Modifier', color: 'yellow', title: 'Modifier', onClick: onEdit },
    { action: 'supprimer', label: 'Supprimer', color: 'red', title: 'Supprimer', onClick: onDelete },
    { action: 'calculs', label: 'Calculs', color: 'indigo', title: 'Voir les calculs', onClick: onCalculs },
    { action: 'pdf', label: 'PDF', color: 'gray', title: 'Télécharger PDF', onClick: onDownloadPDF }
  ];

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      {/* Boutons de statut - Première ligne */}
      <div className="flex flex-wrap gap-1 justify-start">
        {statusButtons.map(({ action, label, color, title }) => (
          actionsPossibles.includes(action) && (
            <button
              key={action}
              onClick={() => handleStatusAction(action)}
              disabled={actionLoading === livraison.idLivraison}
              className={`bg-${color}-500 hover:bg-${color}-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50 flex-1 min-w-[70px] text-center`}
              title={title}
            >
              {actionLoading === livraison.idLivraison ? '...' : label}
            </button>
          )
        ))}
      </div>

      {/* Boutons d'actions - Deuxième ligne */}
      <div className="flex flex-wrap gap-1 justify-start">
        {actionButtons.map(({ action, label, color, title, onClick }) => (
          actionsPossibles.includes(action) && (
            <button
              key={action}
              onClick={() => onClick && onClick(livraison.action === 'modifier' ? livraison : livraison.idLivraison)}
              disabled={actionLoading === livraison.idLivraison && action === 'supprimer'}
              className={`bg-${color}-500 hover:bg-${color}-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50 flex-1 min-w-[60px] text-center`}
              title={title}
            >
              {actionLoading === livraison.idLivraison && action === 'supprimer' ? '...' : label}
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;