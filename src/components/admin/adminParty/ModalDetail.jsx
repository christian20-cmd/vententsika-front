import React from 'react';
import { 
  MdClose, 
  MdAdminPanelSettings, 
  MdEmail, 
  MdPhone, 
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdSecurity,
  MdSupervisorAccount,
  MdPerson,
  MdOnlinePrediction
} from 'react-icons/md';
import LogoTB from '../../../assets/LogoTB.png'
import { XMarkIcon } from '@heroicons/react/24/outline';
const ModalDetail = ({ isOpen, onClose, admin }) => {
  if (!isOpen || !admin) return null;

  const getNiveauColor = (niveau) => {
    switch (niveau) {
      case 'super_admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'moderateur': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNiveauIcon = (niveau) => {
    switch (niveau) {
      case 'super_admin': return <MdSecurity className="h-5 w-5" />;
      case 'admin': return <MdAdminPanelSettings className="h-5 w-5" />;
      case 'moderateur': return <MdSupervisorAccount className="h-5 w-5" />;
      default: return <MdPerson className="h-5 w-5" />;
    }
  };

  const formatNiveauAcces = (niveau) => {
    switch (niveau) {
      case 'super_admin': return 'Super Administrateur';
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

  const getStatusInfo = () => {
    if (admin.est_actif) {
      return {
        text: 'Actif',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: <MdCheckCircle className="h-5 w-5" />
      };
    } else {
      return {
        text: 'En attente de validation',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: <MdCancel className="h-5 w-5" />
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-2xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>
        {/* Header */}
     
            <div className='text-center'>
              <h2 className="text-lg font-semibold text-gray-900">
                Détails de l'administrateur
              </h2>
              <p className="text-sm text-gray-500">ID: {admin.idAdministrateur}</p>
            </div>
         
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Informations personnelles</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    {admin.nom_complet?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{admin.nom_complet}</p>
                  <p className="text-sm text-gray-500">Nom complet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <MdEmail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">{admin.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              {admin.telephone && (
                <div className="flex items-center space-x-3">
                  <MdPhone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-900">{admin.telephone}</p>
                    <p className="text-xs text-gray-500">Téléphone</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statut et rôle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Rôle</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getNiveauColor(admin.niveau_acces)}`}>
                {getNiveauIcon(admin.niveau_acces)}
                <span className="text-sm font-medium">{formatNiveauAcces(admin.niveau_acces)}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Statut</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg ${statusInfo.bgColor}`}>
                {statusInfo.icon}
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>

          {/* Statut en ligne */}
          {admin.est_actif && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Statut en ligne</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg ${
                admin.est_en_ligne ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
              }`}>
                <MdOnlinePrediction className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {admin.est_en_ligne ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
            </div>
          )}

          {/* Dernière connexion */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Dernière connexion</h3>
            <div className="flex items-center space-x-3">
              <MdCalendarToday className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-900">{formatDate(admin.derniere_connexion)}</p>
                <p className="text-xs text-gray-500">
                  {admin.derniere_connexion ? 'Date et heure' : 'Jamais connecté'}
                </p>
              </div>
            </div>
          </div>

          {/* Date de création */}
          {admin.date_creation && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Date de création</h3>
              <div className="flex items-center space-x-3">
                <MdCalendarToday className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">
                    {new Date(admin.date_creation).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500">Compte créé le</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetail;