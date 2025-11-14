import React, { useRef, useState } from 'react';
import { MdSearch, MdFilterList, MdAdd, MdAdminPanelSettings, MdEmail, MdClose, MdRefresh, MdExpandMore, MdTune } from 'react-icons/md';

const AdminFilters = ({
  searchTerm,
  onSearchChange,
  filterNiveau,
  onFilterChange,

  filteredAdminsCount
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchInputRef = useRef(null);

  const niveauOptions = [
    { value: 'tous', label: 'Tous les niveaux', color: 'gray' },
    { value: 'super_admin', label: 'Super Admin', color: 'purple' },
    { value: 'admin', label: 'Administrateur', color: 'blue' },
    { value: 'moderateur', label: 'Modérateur', color: 'orange' }
  ];

  const sortOptions = [
    { value: 'nom_asc', label: 'Nom A-Z', icon: '📝' },
    { value: 'nom_desc', label: 'Nom Z-A', icon: '🔠' },
    { value: 'email_asc', label: 'Email A-Z', icon: '📧' },
    { value: 'date_desc', label: 'Plus récent', icon: '🕒' },
    { value: 'date_asc', label: 'Plus ancien', icon: '📅' },
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
    onSearchChange('');
  };

  const getNiveauColor = (niveau) => {
    const option = niveauOptions.find(opt => opt.value === niveau);
    return option?.color || 'gray';
  };

  const getNiveauLabel = (niveau) => {
    const option = niveauOptions.find(opt => opt.value === niveau);
    return option?.label || 'Inconnu';
  };

  return (
    <div className="transition-all duration-300 my-4">
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
                <MdSearch className="h-5 w-5" />
              </button>

              {/* Input de recherche */}
              <div className={`
                overflow-hidden transition-all duration-500 ease-out
                ${isSearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'}
              `}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher un admin..."
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
                  <MdClose className="h-4 w-4" />
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
            <MdTune className="h-5 w-5" />
            <span className="font-medium">Filtres</span>
            <MdExpandMore 
              className={`h-4 w-4 transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Bouton Actualiser */}

      </div>

      {/* Panneau de filtres avancés */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isFiltersOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtre Niveau */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              👥 Niveau d'administration
            </label>
            <div className="flex flex-wrap gap-2">
              {niveauOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${filterNiveau === option.value
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
                  onClick={() => {/* Implémentez la fonction de tri si nécessaire */}}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${false /* Remplacez par votre état de tri */
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
        ${(searchTerm || filterNiveau !== 'tous') 
          ? 'max-h-32 opacity-100 mt-4' 
          : 'max-h-0 opacity-0'
        }
      `}>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <MdFilterList className="h-4 w-4" />
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
                <MdClose className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filterNiveau !== 'tous' && (
            <span className={`
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-${getNiveauColor(filterNiveau)}-50 to-${getNiveauColor(filterNiveau)}-100 
              text-${getNiveauColor(filterNiveau)}-700 border border-${getNiveauColor(filterNiveau)}-200/60
              shadow-sm animate-fadeIn
            `}>
              💼 {getNiveauLabel(filterNiveau)}
              <button 
                onClick={() => onFilterChange('tous')} 
                className={`ml-2 p-1 hover:bg-${getNiveauColor(filterNiveau)}-200/50 rounded-full transition-colors`}
              >
                <MdClose className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Compteur de résultats */}
      {searchTerm && (
        <div className="mt-3 animate-fadeIn">
          <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 inline-block border border-gray-200/60">
            📊 <span className="font-medium">{filteredAdminsCount}</span> admin(s) trouvé(s) pour "{searchTerm}"
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

// Composant AdminStats avec le style de StatCard
const AdminStats = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
  };

  const IconComponent = icon;

  return (
    <div className={`${colorClasses[color]} rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white shadow-md">
          {React.cloneElement(icon, { className: "h-6 w-6 text-gray-600" })}
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;
export { AdminStats };