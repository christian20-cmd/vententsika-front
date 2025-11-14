import React from 'react';
import LivraisonRow from './LivraisonRow';
import SkeletonTable from './SkeletonTable';

const LivraisonTable = ({ 
  livraisons, 
  loading, 
  actionLoading, 
  onEdit, 
  onCalculs, 
  onStatusChange, 
  onDelete, 
  onDownloadPDF,
  onCreateNew,
  onVerifierPaiement
}) => {
  if (loading) {
    return <SkeletonTable rowCount={6} />;
  }

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Liste des Livraisons</h2>
        
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                N° Suivi
              </th>
              <th className="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                N° Commande
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Adresse
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Montants
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {livraisons.map((livraison) => (
              <LivraisonRow
                key={livraison.idLivraison}
                livraison={livraison}
                actionLoading={actionLoading}
                onEdit={onEdit}
                onCalculs={onCalculs}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onDownloadPDF={onDownloadPDF}
                onVerifierPaiement={onVerifierPaiement}
              />
            ))}
          </tbody>
        </table>
        
        {livraisons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">Aucune livraison trouvée</p>
            <p className="text-gray-400 text-sm mb-4">Commencez par créer votre première livraison</p>
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-md transition-colors"
              >
                Créer votre première livraison
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivraisonTable;