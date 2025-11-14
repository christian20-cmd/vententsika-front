import React from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, RotateCcw, Filter, User, CheckCircle, Clock, XCircle } from 'lucide-react';

const Filters = ({
  searchTerm,
  setSearchTerm,
  filterStatut,
  setFilterStatut,
  filterActif,
  setFilterActif,

  filteredSellersCount
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const searchInputRef = React.useRef(null);

  const statusOptions = [
    { value: 'tous', label: 'Tous les statuts', color: 'gray', icon: <Filter className="h-4 w-4" /> },
    { value: 'valide', label: 'Validés', color: 'green', icon: <CheckCircle className="h-4 w-4" /> },
    { value: 'en_attente', label: 'En attente', color: 'orange', icon: <Clock className="h-4 w-4" /> },
    { value: 'rejete', label: 'Rejetés', color: 'red', icon: <XCircle className="h-4 w-4" /> }
  ];

  const activityOptions = [
    { value: 'tous', label: 'Tous', color: 'gray', icon: <User className="h-4 w-4" /> },
    { value: 'actif', label: 'Actifs', color: 'green', icon: <CheckCircle className="h-4 w-4" /> },
    { value: 'inactif', label: 'Inactifs', color: 'red', icon: <XCircle className="h-4 w-4" /> }
  ];

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearchClose = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false);
    }
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'gray';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || 'Inconnu';
  };

  const getActivityColor = (activity) => {
    const option = activityOptions.find(opt => opt.value === activity);
    return option?.color || 'gray';
  };

  const getActivityLabel = (activity) => {
    const option = activityOptions.find(opt => opt.value === activity);
    return option?.label || 'Inconnu';
  };

  return (
    <div className="transition-all duration-300 mb-6">
      {/* Barre principale */}


      <div className="transition-all duration-300 mb-4">
        {/* Barre de contrôles */}
        <div className="flex items-center justify-between">
          {/* Recherche animée */}
          <div className="flex-1 flex items-center gap-4">
            <div className="relative">
              <div className={`
                flex items-center transition-all duration-500 ease-out
                ${isSearchExpanded ? 'w-96' : 'w-12'}
                bg-white rounded-2xl border border-gray-200/60
                hover:border-blue-300/50 hover:shadow-md
              `}>
                {/* Icône de recherche */}
                <button
                  onClick={handleSearchClick}
                  className="p-3 text-gray-500 hover:text-blue-600 transition-colors duration-200 flex-shrink-0"
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Input de recherche */}
                <div className={`
                  overflow-hidden transition-all duration-500 ease-out
                  ${isSearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'}
                `}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Rechercher un vendeur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Bouton fermer */}
                {isSearchExpanded && (
                  <button
                    onClick={handleSearchClose}
                    className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Bouton Filtres avancés */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300
                ${isFiltersOpen 
                  ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-md' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-800'
                }
              `}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="font-medium">Filtres</span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

      
         
        </div>

        {/* Panneau de filtres avancés */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isFiltersOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}
        `}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/60">
            {/* Filtre Statut */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Statut du Vendeur
              </label>
              <div className="flex flex-wrap gap-3">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilterStatut(option.value)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium
                      ${filterStatut === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700 shadow-sm`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md'
                      }
                      hover:scale-105 active:scale-95
                    `}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtre Activité */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700  items-center gap-2">
                <User className="h-4 w-4" />
                État d'Activité
              </label>
              <div className="flex flex-wrap gap-3">
                {activityOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilterActif(option.value)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium
                      ${filterActif === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700 shadow-sm`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md'
                      }
                      hover:scale-105 active:scale-95
                    `}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filtres actifs avec animations */}
        <div className={`
          transition-all duration-500 ease-out
          ${(searchTerm || filterStatut !== 'tous' || filterActif !== 'tous') 
            ? 'max-h-32 opacity-100 mt-4' 
            : 'max-h-0 opacity-0'
          }
        `}>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <Filter className="h-4 w-4" />
              <span>Filtres actifs:</span>
            </div>
            
            {searchTerm && (
              <span className="
                inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
                bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 
                border border-blue-200/60 shadow-sm
                animate-fadeIn
              ">
                🔍 "{searchTerm}"
                <button 
                  onClick={handleSearchClose} 
                  className="ml-2 p-1 hover:bg-blue-200/50 rounded-full transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filterStatut !== 'tous' && (
              <span className={`
                inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
                bg-gradient-to-r from-${getStatusColor(filterStatut)}-50 to-${getStatusColor(filterStatut)}-100 
                text-${getStatusColor(filterStatut)}-700 border border-${getStatusColor(filterStatut)}-200/60
                shadow-sm animate-fadeIn
              `}>
                {statusOptions.find(opt => opt.value === filterStatut)?.icon}
                {getStatusLabel(filterStatut)}
                <button 
                  onClick={() => setFilterStatut('tous')} 
                  className={`ml-2 p-1 hover:bg-${getStatusColor(filterStatut)}-200/50 rounded-full transition-colors`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filterActif !== 'tous' && (
              <span className={`
                inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
                bg-gradient-to-r from-${getActivityColor(filterActif)}-50 to-${getActivityColor(filterActif)}-100 
                text-${getActivityColor(filterActif)}-700 border border-${getActivityColor(filterActif)}-200/60
                shadow-sm animate-fadeIn
              `}>
                {activityOptions.find(opt => opt.value === filterActif)?.icon}
                {getActivityLabel(filterActif)}
                <button 
                  onClick={() => setFilterActif('tous')} 
                  className={`ml-2 p-1 hover:bg-${getActivityColor(filterActif)}-200/50 rounded-full transition-colors`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Compteur de résultats */}
        {searchTerm && (
          <div className="mt-3 animate-fadeIn">
            <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 inline-block border border-gray-200/60">
              📊 <span className="font-medium">{filteredSellersCount}</span> vendeur(s) trouvé(s) pour "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Styles d'animation CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Filters;