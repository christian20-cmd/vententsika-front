// components/admin/ModalProfilsAdmin.jsx
import React from 'react';
import {
  MdClose,
  MdCheckCircle,
  MdEdit,
  MdLogout,
  MdCalendarToday
} from 'react-icons/md';
import { FaEnvelope, FaPhone, FaUserShield, FaMapMarkerAlt, FaBuilding, FaInfoCircle } from 'react-icons/fa';


const ModalProfilsAdmin = ({ 
  isOpen, 
  onClose, 
  userInfo, 
  onLogout,
  isLoggingOut 
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getNiveauAccesColor = (niveau) => {
    switch (niveau) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderateur':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNiveauAccesText = (niveau) => {
    switch (niveau) {
      case 'super_admin': return 'Super Administrateur';
      case 'admin': return 'Administrateur';
      case 'moderateur': return 'Modérateur';
      default: return niveau;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-4 mt-24">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Carte de profil principale */}
      <div className="bg-white rounded-3xl shadow-2xl p-4 pt-0 w-full max-w-sm relative animate-scale-in">
        
        {/* Bouton fermer */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <MdClose className="text-gray-600 text-xl" />
        </button>
        
        {/* Section de l'image de profil */}
        <div className="flex justify-center -mt-24 mb-4">
          <div className="relative p-1 rounded-full bg-white">
            <div className="w-60 h-60 rounded-full overflow-hidden 
                        bg-black/10 flex items-center justify-center 
                        border-8 border-white">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <FaUserShield className="text-white text-6xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Nom et Titre */}
        <div className="text-center pb-8 border-b border-gray-400">
          <h1 className="text-xl font-bold text-gray-800">
            {userInfo.prenom} {userInfo.nom}
          </h1>
          <p className="text-sm text-gray-500">
            {getNiveauAccesText(userInfo.niveau_acces)}
          </p>
          {userInfo.niveau_acces && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${
              getNiveauAccesColor(userInfo.niveau_acces)
            }`}>
              {getNiveauAccesText(userInfo.niveau_acces)}
            </div>
          )}
        </div>

        {/* Informations de contact */}
        <div className="space-y-4 text-xs my-8">
          
          {/* Téléphone */}
          {userInfo.telephone && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
              <FaPhone className="text-blue-800 w-5 h-5" />
              <p className="text-gray-700">{userInfo.telephone}</p>
            </div>
          )}

          {/* Email */}
          {userInfo.email && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
              <FaEnvelope className="text-blue-800 w-5 h-5" />
              <p className="text-gray-700">{userInfo.email}</p>
            </div>
          )}

          {/* Date d'inscription */}
          {userInfo.date_creation && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
              <MdCalendarToday className="text-blue-800 w-5 h-5" />
              <div>
                <p className="text-gray-700 font-medium mb-1">Membre depuis</p>
                <p className="text-gray-600 text-sm">{formatDate(userInfo.date_creation)}</p>
              </div>
            </div>
          )}

          {/* Niveau d'accès */}
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
            <FaUserShield className="text-blue-800 w-5 h-5" />
            <div>
              <p className="text-gray-700 font-medium mb-1">Rôle</p>
              <p className="text-gray-600 text-sm">{getNiveauAccesText(userInfo.niveau_acces)}</p>
            </div>
          </div>

        </div>

        {/* Section informations administratives */}
        <div className="bg-gray-200 rounded-xl p-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Informations Administratives</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="font-bold text-blue-600">Statut</p>
              <p className={`${
                userInfo.est_actif ? 'text-green-600' : 'text-gray-600'
              } capitalize`}>
                {userInfo.est_actif ? 'Actif' : 'Inactif'}
              </p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="font-bold text-blue-600">En ligne</p>
              <p className={`${
                userInfo.est_en_ligne ? 'text-green-600' : 'text-gray-600'
              }`}>
                {userInfo.est_en_ligne ? 'Oui' : 'Non'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200">
            <MdEdit className="text-lg" />
            <span>Modifier</span>
          </button>
          
          <button 
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200 disabled:opacity-50"
          >
            <MdLogout className="text-lg" />
            <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
          </button>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModalProfilsAdmin;