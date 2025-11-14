import React from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, RotateCcw, Filter, Truck, Calendar, Euro } from 'lucide-react';

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
  filteredLivraisonsCount,
  dateFilter,
  setDateFilter
}) => {
  const filterOptions = [
    { value: 'tous', label: 'Toutes les livraisons', color: 'gray' },
    { value: 'en_attente', label: 'En attente', color: 'yellow' },
    { value: 'en_preparation', label: 'En préparation', color: 'blue' },
    { value: 'expedie', label: 'Expédié', color: 'purple' },
    { value: 'en_transit', label: 'En transit', color: 'indigo' },
    { value: 'livre', label: 'Livré', color: 'green' },
    { value: 'retourne', label: 'Retourné', color: 'red' },
    { value: 'annule', label: 'Annulé', color: 'gray' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Plus récent', icon: '🕒' },
    { value: 'date_asc', label: 'Plus ancien', icon: '📅' },
    { value: 'montant_desc', label: 'Montant ↓', icon: '💰' },
    { value: 'montant_asc', label: 'Montant ↑', icon: '💸' },
    { value: 'client_asc', label: 'Client A-Z', icon: '👤' },
    { value: 'client_desc', label: 'Client Z-A', icon: '👥' },
    { value: 'statut_asc', label: 'Statut A-Z', icon: '📊' },
  ];

  const dateOptions = [
    { value: 'toutes', label: 'Toutes dates' },
    { value: 'aujourdhui', label: "Aujourd'hui" },
    { value: 'semaine', label: 'Cette semaine' },
    { value: 'mois', label: 'Ce mois' },
    { value: 'demain', label: 'Demain' },
    { value: 'retard', label: 'En retard' },
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

  const getDateLabel = (dateValue) => {
    const option = dateOptions.find(opt => opt.value === dateValue);
    return option?.label || 'Toutes dates';
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('tous');
    setSortBy('date_desc');
    setDateFilter('toutes');
    setIsSearchExpanded(false);
  };

  const hasActiveFilters = searchTerm || filterStatus !== 'tous' || sortBy !== 'date_desc' || dateFilter !== 'toutes';

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
                  placeholder="Rechercher client, N° suivi, adresse..."
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filtre Statut Livraison */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Statut Livraison
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`
                    px-3 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
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

          {/* Filtre Date */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date de Livraison
            </label>
            <div className="flex flex-wrap gap-2">
              {dateOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setDateFilter(option.value)}
                  className={`
                    px-3 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${dateFilter === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
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
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Trier par
            </label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`
                    px-3 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
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

        {/* Bouton Tout effacer */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              <X className="h-4 w-4" />
              Tout effacer
            </button>
          </div>
        )}
      </div>

      {/* Filtres actifs avec animations */}
      <div className={`
        transition-all duration-500 ease-out
        ${hasActiveFilters ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'}
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
              🚚 {getStatusLabel(filterStatus)}
              <button 
                onClick={() => setFilterStatus('tous')} 
                className={`ml-2 p-1 hover:bg-${getStatusColor(filterStatus)}-200/50 rounded-full transition-colors`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {dateFilter !== 'toutes' && (
            <span className="
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 
              border border-orange-200/60 shadow-sm animate-fadeIn
            ">
              📅 {getDateLabel(dateFilter)}
              <button 
                onClick={() => setDateFilter('toutes')} 
                className="ml-2 p-1 hover:bg-orange-200/50 rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
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
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Compteur de résultats */}
      {(searchTerm || filterStatus !== 'tous' || dateFilter !== 'toutes') && (
        <div className="mt-3 animate-fadeIn">
          <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 inline-block border border-gray-200/60">
            📊 <span className="font-medium">{filteredLivraisonsCount}</span> livraison(s) trouvée(s)
            {searchTerm && ` pour "${searchTerm}"`}
          </p>
        </div>
      )}


    </div>
  );
};

export default FilterSystem;