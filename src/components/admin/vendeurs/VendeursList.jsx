import React from 'react';
import { MdBusiness, MdEmail, MdPhone, MdCalendarToday, MdVisibility, MdCheckCircle, MdDelete } from 'react-icons/md';
import VendeurCard from './VendeurCard';

const VendeursList = ({
  vendeurs,
  loading,
  searchTerm,
  filterStatut,
  filterActif,
  actionLoading,
  onViewDetails,
  onUpdateStatus,
  onDelete
}) => {
  if (vendeurs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MdBusiness className="text-6xl mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Aucun vendeur trouvé</p>
        <p className="text-sm mt-2">
          {searchTerm || filterStatut !== 'tous' || filterActif !== 'tous' 
            ? "Aucun vendeur ne correspond aux critères de recherche." 
            : "Aucun vendeur n'est inscrit sur la plateforme pour le moment."}
        </p>
      </div>
    );
  }

  return (
    <div className=" mt-28">
      <div className="">
        {vendeurs.map((vendeur) => (
          <VendeurCard
            key={vendeur.idVendeur}
            vendeur={vendeur}
            actionLoading={actionLoading}
            onViewDetails={onViewDetails}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default VendeursList;