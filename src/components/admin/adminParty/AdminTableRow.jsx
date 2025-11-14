import React from 'react';
import { 
  MdAdminPanelSettings, 
  MdEmail, 
  MdPhone, 
  MdCalendarToday, 
  MdCheckCircle, 
  MdCancel,
  MdEdit,
  MdDelete,
  MdSecurity,
  MdSupervisorAccount,
  MdPerson,
  MdVisibility
} from 'react-icons/md';

const AdminTableRow = ({ 
  admin, 
  onValider, 
  onRejeter, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const getNiveauColor = (niveau) => {
    switch (niveau) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderateur': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNiveauIcon = (niveau) => {
    switch (niveau) {
      case 'super_admin': return <MdSecurity className="h-3 w-3" />;
      case 'admin': return <MdAdminPanelSettings className="h-3 w-3" />;
      case 'moderateur': return <MdSupervisorAccount className="h-3 w-3" />;
      default: return <MdPerson className="h-3 w-3" />;
    }
  };

  const formatNiveauAcces = (niveau) => {
    switch (niveau) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrateur';
      case 'moderateur': return 'Modérateur';
      default: return niveau;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non connecté';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
            <MdAdminPanelSettings className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {admin.nom_complet}
            </div>
            <div className="text-sm text-gray-500">
              ID: {admin.idAdministrateur}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center gap-1">
          <MdEmail className="h-3 w-3" />
          {admin.email}
        </div>
        {admin.telephone && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <MdPhone className="h-3 w-3" />
            {admin.telephone}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getNiveauColor(admin.niveau_acces)}`}>
          {getNiveauIcon(admin.niveau_acces)}
          <span className="ml-2 font-medium">{formatNiveauAcces(admin.niveau_acces)}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {admin.est_actif ? (
            <>
              <MdCheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">Actif</span>
            </>
          ) : (
            <>
              <MdCancel className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">En attente</span>
            </>
          )}
          {admin.est_en_ligne && admin.est_actif && (
            <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              En ligne
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <MdCalendarToday className="h-3 w-3" />
          {formatDate(admin.derniere_connexion)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-3">
          <button
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-900 transition-colors group relative"
            title="Voir détails"
          >
            <MdVisibility className="h-4 w-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Voir détails
            </span>
          </button>

          {!admin.est_actif ? (
            <>
              <button
                onClick={() => onValider(admin)}
                className="text-green-600 hover:text-green-900 transition-colors group relative"
                title="Valider"
              >
                <MdCheckCircle className="h-4 w-4" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Valider
                </span>
              </button>
              
              <button
                onClick={() => onRejeter(admin)}
                className="text-red-600 hover:text-red-900 transition-colors group relative"
                title="Rejeter"
              >
                <MdCancel className="h-4 w-4" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Rejeter
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="text-green-600 hover:text-green-900 transition-colors group relative"
                title="Modifier"
              >
                <MdEdit className="h-4 w-4" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Modifier
                </span>
              </button>
              
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-900 transition-colors group relative"
                title="Supprimer"
              >
                <MdDelete className="h-4 w-4" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Supprimer
                </span>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AdminTableRow;