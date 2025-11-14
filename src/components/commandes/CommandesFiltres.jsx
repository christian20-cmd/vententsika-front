import React, { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, RefreshCw, Filter } from 'lucide-react';

export const CommandesFiltres = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  isFiltersOpen,
  setIsFiltersOpen,
  isSearchExpanded,
  setIsSearchExpanded,
  fetchCommandes
}) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false);
    }
    setSearchTerm('');
  };

  const filterOptions = [
    { value: 'tous', label: 'Tous statuts', color: 'gray' },
    { value: 'attente_validation', label: 'En attente', color: 'yellow' },
    { value: 'validee', label: 'Validée', color: 'blue' },
    { value: 'en_preparation', label: 'Préparation', color: 'orange' },
    { value: 'expediee', label: 'Expédiée', color: 'purple' },
    { value: 'livree', label: 'Livrée', color: 'green' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Plus récentes', icon: '🕒' },
    { value: 'date_asc', label: 'Plus anciennes', icon: '📅' },
    { value: 'montant_desc', label: 'Montant ↓', icon: '💰' },
    { value: 'montant_asc', label: 'Montant ↑', icon: '💸' }
  ];

  const getStatusColor = (status) => {
    const option = filterOptions.find(opt => opt.value === status);
    return option?.color || 'gray';
  };

  return (
    <div className="transition-all duration-300 mb-6">
      {/* Barre principale */}
      <div className="flex items-center justify-between">
        {/* Recherche animée */}
        <div className="flex-1 flex items-center gap-4">
          <div className="relative">
            <div className={`
              flex items-center transition-all duration-500 ease-out
              ${isSearchExpanded ? 'w-96' : 'w-14'}
              bg-white rounded-2xl border border-gray-200/60
              hover:border-blue-300/50 hover:shadow-md
            `}>
              {/* Icône de recherche */}
              <button
                onClick={handleSearchClick}
                className="p-3 text-gray-500 hover:text-blue-600 transition-colors duration-200 flex-shrink-0"
              >
                <Search size={20} />
              </button>

              {/* Input de recherche */}
              <div className={`
                overflow-hidden transition-all duration-500 ease-out
                ${isSearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'}
              `}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher commande, client, produit..."
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
                  <X size={18} />
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
            <SlidersHorizontal size={18} />
            <span className="font-medium">Filtres</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Bouton Actualiser */}
        <button
          onClick={fetchCommandes}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-blue-200 hover:text-blue-800 transition-all duration-300 hover:scale-105"
        >
          <RefreshCw size={18} />
          <span className="font-medium">Actualiser</span>
        </button>
      </div>

      {/* Panneau de filtres avancés */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isFiltersOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtre Statut */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              📊 Statut Commande
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
        ${(searchTerm || filterStatus !== 'tous' || sortBy !== 'date_desc') 
          ? 'max-h-32 opacity-100 mt-4' 
          : 'max-h-0 opacity-0'}
      `}>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Filter size={16} />
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
                <X size={14} />
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
              📦 {filterOptions.find(opt => opt.value === filterStatus)?.label}
              <button 
                onClick={() => setFilterStatus('tous')} 
                className={`ml-2 p-1 hover:bg-${getStatusColor(filterStatus)}-200/50 rounded-full transition-colors`}
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {sortBy !== 'date_desc' && (
            <span className="
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 
              border border-purple-200/60 shadow-sm animate-fadeIn
            ">
              🔄 {sortOptions.find(opt => opt.value === sortBy)?.label}
              <button 
                onClick={() => setSortBy('date_desc')} 
                className="ml-2 p-1 hover:bg-purple-200/50 rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};