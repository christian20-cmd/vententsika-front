import React from 'react';

const HeaderCard = ({ onProfileClick }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute"></div>
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Tableau de Bord Administrateur</h1>
        </div>
        
        {/* Bouton profil amélioré */}
        <button 
          onClick={onProfileClick}
          className="transform hover:scale-105 transition-all duration-300 hover:bg-gray-100 p-2 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            {/* Avatar et statut */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-400">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {/* Point vert pour statut en ligne */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Informations utilisateur (optionnel - peut être caché sur mobile) */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">Administrateur</p>
              <p className="text-xs text-gray-600">En ligne</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HeaderCard;