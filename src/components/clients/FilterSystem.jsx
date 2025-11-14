import React from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, RotateCcw, Filter } from 'lucide-react';

const FilterSystem = ({
  searchTerm,
  setSearchTerm,
  isSearchExpanded,
  setIsSearchExpanded,
  isFiltersOpen,
  setIsFiltersOpen,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  searchInputRef,
  onRefresh,
  filteredClientsCount
}) => {
  const filterOptions = [
    { value: 'tous', label: 'Tous les clients', color: 'gray' },
    { value: 'avec_commandes', label: 'Avec commandes', color: 'green' },
    { value: 'avec_paniers', label: 'Avec paniers', color: 'orange' },
    { value: 'sans_activite', label: 'Sans activité', color: 'slate' },
    { value: 'recent', label: 'Clients récents', color: 'blue' }
  ];

  const sortOptions = [
    { value: 'nom_asc', label: 'Nom A-Z', icon: '📝' },
    { value: 'nom_desc', label: 'Nom Z-A', icon: '🔠' },
    { value: 'commandes_desc', label: 'Commandes ↓', icon: '📦' },
    { value: 'commandes_asc', label: 'Commandes ↑', icon: '📊' },
    { value: 'paniers_desc', label: 'Paniers ↓', icon: '🛒' },
    { value: 'date_desc', label: 'Plus récent', icon: '🕒' },
    { value: 'date_asc', label: 'Plus ancien', icon: '📅' },
  ];

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false);
    }
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    const option = filterOptions.find(opt => opt.value === status);
    return option?.color || 'gray';
  };

  const getStatusLabel = (status) => {
    const option = filterOptions.find(opt => opt.value === status);
    return option?.label || 'Inconnu';
  };

  return (
    <div className="transition-all duration-300 mb-4">
      {/* Barre principale */}
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
                  placeholder="Rechercher client, email, CIN, adresse..."
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

        {/* Bouton Actualiser */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-blue-200 hover:text-blue-800 transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="h-5 w-5" />
          <span className="font-medium">Actualiser</span>
        </button>
      </div>

      {/* Panneau de filtres avancés */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isFiltersOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtre Statut Client */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              👥 Type de Client
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${filterStatus === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700 shadow-sm`
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md'
                    }
                    hover:scale-105 active:scale-95
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              🔄 Trier par
            </label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${sortBy === option.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md'
                    }
                    hover:scale-105 active:scale-95
                  `}
                >
                  <span className="mr-2">{option.icon}</span>
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
        ${(searchTerm || filterStatus !== 'tous' || sortBy !== 'nom_asc') 
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
              inline-flex items-center px-3 py-2 rounded-xl text-sm 
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
          
          {filterStatus !== 'tous' && (
            <span className={`
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-${getStatusColor(filterStatus)}-50 to-${getStatusColor(filterStatus)}-100 
              text-${getStatusColor(filterStatus)}-700 border border-${getStatusColor(filterStatus)}-200/60
              shadow-sm animate-fadeIn
            `}>
              👥 {getStatusLabel(filterStatus)}
              <button 
                onClick={() => setFilterStatus('tous')} 
                className={`ml-2 p-1 hover:bg-${getStatusColor(filterStatus)}-200/50 rounded-full transition-colors`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {sortBy !== 'nom_asc' && (
            <span className="
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 
              border border-purple-200/60 shadow-sm animate-fadeIn
            ">
              🔄 {sortOptions.find(opt => opt.value === sortBy)?.label}
              <button 
                onClick={() => setSortBy('nom_asc')} 
                className="ml-2 p-1 hover:bg-purple-200/50 rounded-full transition-colors"
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
            📊 <span className="font-medium">{filteredClientsCount}</span> client(s) trouvé(s) pour "{searchTerm}"
          </p>
        </div>
      )}

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

export default FilterSystem;