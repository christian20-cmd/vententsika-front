import { Plus, ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { MdAdminPanelSettings, MdEmail, MdPersonAdd } from 'react-icons/md';

const AdminHeader = ({ 
  totalAdmins, 
  filteredAdmins, 
  onAddMenuToggle,
  onCreateAdmin, 
  showAddMenu,
  onInviteAdmin,
  isLoading = false,
  variant = 'primary',
  size = 'medium'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onAddMenuToggle?.(newState);
  };

  const handleCreateAdmin = () => {
    setIsMenuOpen(false);
    onCreateAdmin?.();
  };

  const handleInviteAdmin = () => {
    setIsMenuOpen(false);
    onInviteAdmin?.();
  };

  // Options de style dynamiques
  const variantStyles = {
    primary: {
      button: 'bg-blue-800 text-white hover:bg-blue-700 border-blue-800',
      menu: 'border-blue-200 shadow-blue-100',
      icon: 'text-white'
    },
    secondary: {
      button: 'bg-gray-700 text-white hover:bg-gray-600 border-gray-700',
      menu: 'border-gray-200 shadow-gray-100',
      icon: 'text-white'
    },
    outline: {
      button: 'bg-white text-blue-800 border border-blue-800 hover:bg-blue-50',
      menu: 'border-blue-200 shadow-blue-100',
      icon: 'text-blue-800'
    }
  };

  const sizeStyles = {
    small: {
      button: 'px-4 py-1.5 text-sm rounded-xl',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    medium: {
      button: 'px-6 py-2 rounded-2xl',
      icon: 'w-5 h-5',
      text: 'text-base'
    },
    large: {
      button: 'px-8 py-3 rounded-2xl text-lg',
      icon: 'w-6 h-6',
      text: 'text-lg'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.medium;

  // Options de menu configurables
  const menuOptions = [
    {
      id: 'create',
      label: 'Création manuelle',
      icon: MdAdminPanelSettings,
      onClick: handleCreateAdmin,
      description: 'Ajouter un administrateur manuellement'
    },
    {
      id: 'invite',
      label: 'Invitation par lien',
      icon: MdEmail,
      onClick: handleInviteAdmin,
      description: 'Envoyer une invitation par email'
    }
  ];

  const getAdminCountText = () => {
    if (totalAdmins === 0) {
      return "Aucun administrateur sur la plateforme";
    }
    
    const baseText = filteredAdmins === totalAdmins 
      ? `${totalAdmins} administrateur${totalAdmins !== 1 ? 's' : ''} sur la plateforme`
      : `${filteredAdmins} sur ${totalAdmins} administrateur${totalAdmins !== 1 ? 's' : ''}`;

    return baseText;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4">
      <div className="flex-1">
        <h1 className={`font-bold text-gray-900 ${currentSize.text}`}>
          Gestion des Administrateurs
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          {getAdminCountText()}
        </p>
      </div>
      
      <div className="relative" ref={menuRef}>
        <button 
          onClick={handleMenuToggle}
          disabled={isLoading}
          className={`
            ${currentVariant.button} 
            ${currentSize.button}
            transition-all duration-200 
            flex items-center justify-center
            font-medium
            border-2
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            shadow-sm hover:shadow-md
          `}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
          ) : (
            <Plus className={`mr-2 ${currentSize.icon} ${currentVariant.icon}`} />
          )}
          <span className={currentSize.text}>
            {isLoading ? 'Chargement...' : 'Ajouter un Admin'}
          </span>
          <ChevronDown 
            className={`ml-2 transition-transform duration-200 ${currentSize.icon} ${
              isMenuOpen ? 'rotate-180' : 'rotate-0'
            } ${currentVariant.icon}`} 
          />
        </button>
        
        {isMenuOpen && (
          <div className={`
            absolute top-full right-0 mt-2 
            bg-white rounded-2xl shadow-lg border 
            ${currentVariant.menu}
            py-2 z-20
            animate-in fade-in-0 zoom-in-95
            min-w-[220px]
          `}>
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Méthodes d'ajout
              </p>
            </div>
            
            {menuOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 group transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <option.icon className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-800">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
            
            {/* Section supplémentaire pour d'autres actions */}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm text-gray-600">
                <MdPersonAdd className="text-gray-400" />
                <span>Voir les guides d'ajout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Props par défaut
AdminHeader.defaultProps = {
  totalAdmins: 0,
  filteredAdmins: 0,
  showAddMenu: false,
  isLoading: false,
  variant: 'primary',
  size: 'medium'
};

export default AdminHeader;