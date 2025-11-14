// components/stocks/StockFilters.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, RefreshCw, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

const StockFilters = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  filterPublication,
  onFilterPublicationChange,
  sortBy,
  onSortChange,
  
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchInputRef = useRef(null);

  const filterOptions = [
    { value: 'tous', label: 'Tous statuts stock', color: 'gray' },
    { value: 'normal', label: 'En stock', color: 'green' },
    { value: 'alerte', label: 'Alerte', color: 'orange' },
    { value: 'rupture', label: 'Rupture', color: 'red' }
  ];

  const publicationOptions = [
    { value: 'tous', label: 'Tous statuts publication', color: 'gray' },
    { value: 'actif', label: 'Publié', color: 'blue' },
    { value: 'inactif', label: 'Non publié', color: 'slate' },
    { value: 'sans_produit', label: 'Sans produit', color: 'amber' }
  ];

  const sortOptions = [
    { value: 'nom_produit', label: 'Nom A-Z', icon: '📝' },
    { value: 'quantite_asc', label: 'Quantité ↑', icon: '📈' },
    { value: 'quantite_desc', label: 'Quantité ↓', icon: '📉' },
    { value: 'valeur_desc', label: 'Valeur ↓', icon: '💰' }
  ];

  // Focus sur l'input quand la recherche s'étend
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
    onSearchChange('');
  };

  const getStatusColor = (status, type = 'status') => {
    const options = type === 'publication' ? publicationOptions : filterOptions;
    const option = options.find(opt => opt.value === status);
    return option?.color || 'gray';
  };

  return (
    <div className="transition-all duration-300 my-4">
      {/* Barre principale */}
      <div className="flex items-center justify-between place-self-start ">
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
                  placeholder="Rechercher produit, code, catégorie..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
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

        
      </div>

      {/* Panneau de filtres avancés */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isFiltersOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* Filtre Statut Stock */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              📊 Statut Stock
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${filterStatus === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700 shadow-sm`
                      : 'border-gray-800 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md'
                    }
                    hover:scale-105 active:scale-95
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre Statut Publication */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              🌐 Statut Publication
            </label>
            <div className="flex flex-wrap gap-2">
              {publicationOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onFilterPublicationChange(option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${filterPublication === option.value
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
                  onClick={() => onSortChange(option.value)}
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
        ${(searchTerm || filterStatus !== 'tous' || filterPublication !== 'tous' || sortBy !== 'nom_produit') 
          ? 'max-h-32 opacity-100 mt-4' 
          : 'max-h-0 opacity-0'
        }
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
                onClick={() => onFilterChange('tous')} 
                className={`ml-2 p-1 hover:bg-${getStatusColor(filterStatus)}-200/50 rounded-full transition-colors`}
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {filterPublication !== 'tous' && (
            <span className={`
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-${getStatusColor(filterPublication, 'publication')}-50 
              to-${getStatusColor(filterPublication, 'publication')}-100 
              text-${getStatusColor(filterPublication, 'publication')}-700 
              border border-${getStatusColor(filterPublication, 'publication')}-200/60
              shadow-sm animate-fadeIn
            `}>
              🌐 {publicationOptions.find(opt => opt.value === filterPublication)?.label}
              <button 
                onClick={() => onFilterPublicationChange('tous')} 
                className={`ml-2 p-1 hover:bg-${getStatusColor(filterPublication, 'publication')}-200/50 rounded-full transition-colors`}
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {sortBy !== 'nom_produit' && (
            <span className="
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 
              border border-purple-200/60 shadow-sm animate-fadeIn
            ">
              🔄 {sortOptions.find(opt => opt.value === sortBy)?.label}
              <button 
                onClick={() => onSortChange('nom_produit')} 
                className="ml-2 p-1 hover:bg-purple-200/50 rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
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

export default StockFilters;