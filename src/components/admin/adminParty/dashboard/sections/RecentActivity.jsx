import React, { useState, useRef, useEffect } from 'react';

const RecentActivity = ({ data }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);
  
  // Fermer la popup quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activities = data?.activite_temps_reel?.connexions_recentes || [];
  const activityCount = activities.length;

  return (
    <div className="relative" ref={popupRef}>
      {/* Bouton principal avec compteur */}
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="flex items-center space-x-2 bg-white rounded-3xl shadow-lg px-6 py-2 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-semibold text-gray-700">Activités</span>
        {activityCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center">
            {activityCount}
          </span>
        )}
      </button>

      {/* Fenêtre popup */}
      {isPopupOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* En-tête de la popup */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Activité Récente
              </h3>
              {activityCount > 0 && (
                <span className="bg-white text-green-600 text-sm font-bold px-2 py-1 rounded-full">
                  {activityCount} activité(s)
                </span>
              )}
            </div>
          </div>

          {/* Contenu de la popup */}
          <div className="p-4 max-h-64 overflow-y-auto">
            {activityCount > 0 ? (
              <div className="space-y-3">
                {activities.map((connexion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`relative ${connexion.type === 'admin' ? 'text-blue-500' : 'text-green-500'}`}>
                        <div className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 ${
                          connexion.type === 'admin' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {connexion.nom}
                        </p>
                        <p className="text-xs text-gray-600 truncate">{connexion.email}</p>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-medium text-gray-900 text-xs">{connexion.heure_connexion}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        connexion.type === 'admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {connexion.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 text-sm font-medium">Aucune activité récente</p>
                  <p className="text-gray-400 text-xs mt-1">Les nouvelles connexions apparaîtront ici</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer de la popup */}
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;