import React from 'react';
import { MdAdminPanelSettings, MdSearch } from 'react-icons/md';

const EmptyState = ({ hasAdmins, searchTerm }) => {
  return (
    <div className="text-center py-12 text-gray-500">
      {!hasAdmins ? (
        <>
          <MdAdminPanelSettings className="text-6xl mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Aucun administrateur trouvé</p>
          <p className="text-sm mt-2">Aucun administrateur n'est configuré sur la plateforme.</p>
        </>
      ) : (
        <>
          <MdSearch className="text-6xl mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Aucun administrateur ne correspond aux critères</p>
          <p className="text-sm mt-2">Essayez de modifier votre recherche ou vos filtres.</p>
        </>
      )}
    </div>
  );
};

export default EmptyState;