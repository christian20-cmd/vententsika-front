// components/admin/SideBarAdmin.jsx
import React, { useState, useEffect, useRef } from 'react';

import {
  MdOutlineDashboard,
  MdPeopleOutline,
  MdOutlineStore,
  MdOutlineShoppingBag,
  MdOutlineAnalytics,
  MdOutlineSettings,
  MdLogout,
  MdMenu,
  MdChevronLeft,
  MdPerson,
  MdBusiness,
  MdClose,
} from 'react-icons/md';
import { FaUserShield, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LogoTW from '../../assets/LogoTB.png';
import ConfirmationModal from '../common/ConfirmationModal';
import ToastContainer from '../common/ToastContainer';

// Composant Profil séparé pour l'admin
const ProfilPopupAdmin = ({ isOpen, onClose, profileData }) => {
  if (!isOpen) return null;

  const { profile, loading, error } = profileData;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-start mt-24 ml-24">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MdClose size={24} />
          </button>
          <div className="animate-pulse">
            <div className="rounded-full bg-gray-300 h-40 w-40 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto mb-6"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-start mt-24 ml-24">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MdClose size={24} />
          </button>
          <p className="text-red-500 mb-4 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-start mt-24 ml-24">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MdClose size={24} />
          </button>
          <p className="text-gray-500 text-center">Aucune donnée de profil disponible</p>
        </div>
      </div>
    );
  }

  const { administrateur, utilisateur } = profile;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start mt-24 ml-24">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20"
        onClick={onClose}
      ></div>
      
      {/* Carte de profil principale */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 pt-0 w-full max-w-sm relative z-10">
        
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-20"
        >
          <MdClose size={24} />
        </button>
        
        {/* Section de l'image de profil */}
        <div className="flex justify-center -mt-24 mb-4">
          <div className="relative p-1 rounded-full bg-white">
            <div className="w-60 h-60 rounded-full overflow-hidden 
                        bg-black/10 flex items-center justify-center 
                        border-8 border-white">
              <img
                className="w-full h-full object-cover rounded-full"
                src={Profil}
                alt={`${utilisateur?.prenom} ${utilisateur?.nom} profile`}
                onError={(e) => {
                  e.target.src = Profil;
                }}
              />
            </div>
          </div>
        </div>

        {/* Nom et Titre */}
        <div className="text-center pb-8 border-b border-gray-400">
          <h1 className="text-xl font-bold text-gray-800">
            {utilisateur?.prenom} {utilisateur?.nom}
          </h1>
          <p className="text-sm text-gray-500">
            Administrateur Système
          </p>
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 bg-blue-100 text-blue-800">
            Super Administrateur
          </div>
        </div>

        {/* Informations de contact */}
        <div className="space-y-4 my-8">
          
          {/* Téléphone */}
          {utilisateur?.telephone && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
              <FaPhone className="text-blue-800 w-5 h-5" />
              <p className="text-gray-700">{utilisateur.telephone}</p>
            </div>
          )}

          {/* Email */}
          {utilisateur?.email && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
              <FaEnvelope className="text-blue-800 w-5 h-5" />
              <p className="text-gray-700">{utilisateur.email}</p>
            </div>
          )}

          {/* Niveau d'accès */}
          {administrateur?.niveau_acces && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
              <FaUserShield className="text-blue-800 w-5 h-5" />
              <p className="text-gray-700">Niveau {administrateur.niveau_acces}</p>
            </div>
          )}

          {/* Date de création */}
          {administrateur?.date_creation && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2">
              <FaInfoCircle className="text-blue-800 w-5 h-5" />
              <p className="text-gray-700">Membre depuis {new Date(administrateur.date_creation).toLocaleDateString('fr-FR')}</p>
            </div>
          )}

        </div>

        {/* Section statistiques ou informations supplémentaires */}
        <div className="bg-gray-50 rounded-xl p-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Informations Administrateur</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="font-bold text-blue-600">Rôle</p>
              <p className="text-gray-600">Administrateur</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="font-bold text-blue-600">Statut</p>
              <p className="text-gray-600">Actif</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const navLinks = [
  { name: 'Dashboard', icon: MdOutlineDashboard },
  { name: 'Administrateurs', icon: FaUserShield },
  { name: 'Vendeurs', icon: MdPeopleOutline },
  { name: 'Paramètres', icon: MdOutlineSettings },
];

const SideBarAdmin = ({ onNavigate, activePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    profile: null,
    loading: true,
    error: null
  });
  const [userInfo, setUserInfo] = useState({
    nom: 'Administrateur',
    prenom: '',
    email: 'admin@system.com',
    role: 'admin',
    telephone: '',
    date_creation: '',
    niveau_acces: 'admin',
    est_actif: true,
    est_en_ligne: true
  });
  
  // États pour les notifications et confirmations
  const [notifications, setNotifications] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null,
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    isLoading: false
  });
  
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // FONCTIONS POUR LES NOTIFICATIONS TOAST
  const showNotification = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type,
      title,
      message,
      duration
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // FONCTIONS POUR LES MODALES DE CONFIRMATION
  const showConfirmation = (config) => {
    setConfirmationModal({
      isOpen: true,
      type: 'warning',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      isLoading: false,
      ...config
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = async () => {
    if (confirmationModal.onConfirm) {
      setConfirmationModal(prev => ({ ...prev, isLoading: true }));
      try {
        await confirmationModal.onConfirm();
        closeConfirmation();
      } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
        setConfirmationModal(prev => ({ ...prev, isLoading: false }));
        showNotification('error', 'Erreur', 'Erreur lors de l\'exécution de l\'action');
      }
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    if (userData.prenom && userData.nom) {
      setUserInfo({
        nom: userData.nom || 'Administrateur',
        prenom: userData.prenom || '',
        email: userData.email || 'admin@system.com',
        role: userData.role || 'admin',
        telephone: userData.tel || 'Non renseigné',
        date_creation: userData.created_at || new Date().toLocaleDateString('fr-FR'),
        niveau_acces: userData.niveau_acces || 'admin',
        est_actif: true,
        est_en_ligne: true
      });
    }
  }, []);

  // Fonction pour récupérer les données du profil
  const fetchProfile = async () => {
    try {
      setProfileData(prev => ({ ...prev, loading: true, error: null }));
      const token = localStorage.getItem('auth_token');
      
      // Simuler une requête API pour les données admin
      setTimeout(() => {
        setProfileData({
          profile: {
            administrateur: {
              niveau_acces: 'admin',
              date_creation: userInfo.date_creation
            },
            utilisateur: {
              prenom: userInfo.prenom,
              nom: userInfo.nom,
              email: userInfo.email,
              telephone: userInfo.telephone
            }
          },
          loading: false,
          error: null
        });
      }, 1000);

    } catch (err) {
      console.error('Erreur API:', err);
      setProfileData({
        profile: null,
        loading: false,
        error: 'Impossible de charger les données du profil'
      });
      showNotification('error', 'Erreur', 'Impossible de charger les données du profil');
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    fetchProfile();
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleNavigation = (pageName) => {
    if (pageName === 'Logout') {
      handleLogout();
    } else {
      onNavigate(pageName);
    }
  };

  // FONCTION AMÉLIORÉE POUR LA DÉCONNEXION AVEC CONFIRMATION
  const handleLogout = () => {
    showConfirmation({
      title: 'Confirmer la déconnexion',
      message: `Êtes-vous sûr de vouloir vous déconnecter, ${userInfo.prenom} ${userInfo.nom} ? Vous devrez vous reconnecter pour accéder à nouveau au panneau d'administration.`,
      type: 'warning',
      confirmText: 'Se déconnecter',
      cancelText: 'Annuler',
      onConfirm: async () => {
        await performLogout();
      }
    });
  };

  const performLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        const response = await fetch('http://localhost:8000/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });

        if (response.ok) {
          console.log('Déconnexion réussie');
          showNotification('success', 'Déconnexion réussie', 'Vous avez été déconnecté avec succès', 3000);
        } else {
          console.warn('Problème lors de la déconnexion, mais suppression du token locale');
          showNotification('warning', 'Déconnexion', 'Déconnexion effectuée localement');
        }
      }

      // Nettoyer le stockage local
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');
      localStorage.removeItem('token');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('last_activity');
      
      // Afficher une notification de succès
      showNotification('success', 'Déconnexion', 'Redirection vers la page de connexion...', 2000);
      
      // Redirection vers la page de connexion après un délai
      setTimeout(() => {
        navigate('/admin/connexion');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      // En cas d'erreur, nettoyer quand même et rediriger
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');
      localStorage.removeItem('token');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('last_activity');
      
      showNotification('error', 'Erreur de déconnexion', 'Redirection vers la page de connexion...', 2000);
      
      setTimeout(() => {
        navigate('/admin/connexion');
      }, 1500);
    }
  };

  const sidebarClass = isOpen
    ? 'w-64 translate-x-0 shadow-2xl'
    : 'w-20 -translate-x-full md:translate-x-0 md:w-20';

  const displayName = `${userInfo.prenom} ${userInfo.nom}`;
  const displaySubtitle = userInfo.email;

  return (
    <>
      <div 
        className={`flex fixed ml-4 my-4 rounded-3xl flex-col ${sidebarClass} bg-white text-white transition-all duration-300 ease-in-out md:relative z-40 border-r border-gray-200`}
      >
        {/* Header avec logo et bouton toggle */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <div 
            className={`flex items-center space-x-3 transition-all duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}
          >
            <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-black/5 bg-clip-text text-transparent">
              <img src={LogoTW} alt="Logo TW" className="w-32" />
            </span>
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-gray-200 hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-sm flex-shrink-0"
          >
            {isOpen ? (
              <MdChevronLeft className="text-xl text-black" />
            ) : (
              <MdMenu className="text-xl text-black" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 mt-2">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavigation(link.name)}
                    className={`flex items-center px-3 py-2 rounded-2xl transition-all duration-200 group relative overflow-hidden w-full text-left ${
                      activePage === link.name 
                        ? 'bg-gradient-to-r from-blue-800 to-transparent text-white shadow-blue-500/25' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <IconComponent 
                      className={`text-2xl transition-transform duration-200 flex-shrink-0 ${
                        activePage === link.name ? 'scale-110' : 'group-hover:scale-105'
                      }`} 
                    />
                    
                    <span 
                      className={`ml-4 font-medium transition-all duration-300 whitespace-nowrap ${
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
                      }`}
                    >
                      {link.name}
                    </span>
                    
                    {/* Indicateur pour l'élément actif */}
                    {activePage === link.name && !isOpen && (
                      <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                    
                    {/* Tooltip quand la sidebar est fermée */}
                    {!isOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50 whitespace-nowrap pointer-events-none">
                        {link.name}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Section Déconnexion */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group relative overflow-hidden w-full text-left"
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <MdLogout className="text-2xl transition-transform duration-200 group-hover:scale-105 flex-shrink-0" />
            
            <span 
              className={`ml-4 font-medium transition-all duration-300 whitespace-nowrap ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
              }`}
            >
              Se Déconnecter
            </span>
            
            {/* Tooltip quand la sidebar est fermée */}
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50 whitespace-nowrap pointer-events-none">
                Se Déconnecter
              </div>
            )}
          </button>
          
          {/* User info (visible seulement quand ouvert) */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={handleProfileClick}
              className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors duration-200 group"
            >
              {/* Avatar avec icône admin */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-blue-200 group-hover:border-blue-300 transition-colors">
                <div className="w-full h-full bg-blue-800 rounded-full flex items-center justify-center">
                  <FaUserShield className="text-white text-lg" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {displayName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {displaySubtitle}
                </p>
                <p className="text-xs text-blue-600 font-medium truncate flex items-center">
                  <FaUserShield className="mr-1" size={12} />
                  Administrateur
                </p>
              </div>

              {/* Indicateur de clic */}
              <MdPerson className="text-gray-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup du profil admin */}
      <ProfilPopupAdmin 
        isOpen={showProfile} 
        onClose={handleCloseProfile}
        profileData={profileData}
      />

      {/* Modal de confirmation global */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        isLoading={confirmationModal.isLoading}
      />

      {/* Container de notifications */}
      <ToastContainer 
        notifications={notifications}
        onClose={closeNotification}
      />
    </>
  );
};

export default SideBarAdmin;