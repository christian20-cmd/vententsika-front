import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { SlidersHorizontal, Package, Tag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    orange: 'bg-orange-50 border border-orange-200',
    purple: 'bg-purple-50 border border-purple-200',
    red: 'bg-red-50 border border-red-200',
    slate: 'bg-slate-50 border border-slate-200',
  };

  const iconComponents = {
    'package': Package,
    'tag': Tag,
    'check-circle': CheckCircle,
    'x-circle': XCircle,
    'alert-triangle': AlertTriangle,
    'users': Package,
    'shopping-cart': Package,
    'dollar-sign': Tag
  };

  const IconComponent = iconComponents[icon];

  return (
    <div className={`${colorClasses[color]} rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white shadow-md">
          <IconComponent className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

const ProduitFilter = ({ 
  filter, 
  setFilter, 
  produits, 
  searchTerm, 
  setSearchTerm, 
  loading = false,
  sortBy = 'nom_asc',
  onSortChange = () => {}
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchInputRef = useRef(null);

  // 🔧 CORRECTION : Vérifier que produits est un tableau
  const safeProduits = Array.isArray(produits) ? produits : [];

  const stats = {
    total: safeProduits.length,
    promotion: safeProduits.filter(p => p.prix_promotion && p.prix_promotion > 0).length,
    actif: safeProduits.filter(p => p.statut === 'actif').length,
    inactif: safeProduits.filter(p => p.statut === 'inactif').length,
    rupture: safeProduits.filter(p => p.statut === 'rupture').length,
  };

  // Section des statistiques avec style StatCard
  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <StatCard 
        title="Total Produits" 
        value={stats.total} 
        icon="package" 
        color="blue" 
      />
      <StatCard 
        title="En Promotion" 
        value={stats.promotion} 
        icon="tag" 
        color="red" 
      />
      <StatCard 
        title="Produits Actifs" 
        value={stats.actif} 
        icon="check-circle" 
        color="green" 
      />
      <StatCard 
        title="Produits Inactifs" 
        value={stats.inactif} 
        icon="x-circle" 
        color="slate" 
      />
      <StatCard 
        title="En Rupture" 
        value={stats.rupture} 
        icon="alert-triangle" 
        color="orange" 
      />
    </div>
  );

  const filterOptions = [
    { value: 'all', label: 'Tous les produits', count: stats.total, color: 'gray' },
    { value: 'promotion', label: 'En promotion', count: stats.promotion, color: 'red' },
    { value: 'actif', label: 'Produits actifs', count: stats.actif, color: 'green' },
    { value: 'inactif', label: 'Produits inactifs', count: stats.inactif, color: 'slate' },
    { value: 'rupture', label: 'En rupture', count: stats.rupture, color: 'orange' },
  ];

  const sortOptions = [
    { value: 'nom_asc', label: 'Nom A-Z', icon: '📝' },
    { value: 'nom_desc', label: 'Nom Z-A', icon: '🔠' },
    { value: 'prix_asc', label: 'Prix ↑', icon: '💰' },
    { value: 'prix_desc', label: 'Prix ↓', icon: '📉' },
    { value: 'stock_asc', label: 'Stock ↑', icon: '📈' },
    { value: 'stock_desc', label: 'Stock ↓', icon: '📊' },
    { value: 'date_desc', label: 'Plus récent', icon: '🕒' },
    { value: 'date_asc', label: 'Plus ancien', icon: '📅' },
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
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (!searchTerm) {
      setIsSearchExpanded(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'rupture': return 'orange';
      case 'actif': return 'green';
      case 'inactif': return 'slate';
      case 'promotion': return 'red';
      case 'all': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status) => {
    const option = filterOptions.find(opt => opt.value === status);
    return option?.label || 'Inconnu';
  };

  // Skeleton loader pendant le chargement
  if (loading) {
    return (
      <div className="transition-all duration-300 mb-6">
        {/* Skeleton pour les statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-3xl shadow-lg p-6 shimmer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2 shimmer"></div>
                  <div className="h-8 bg-gray-300 rounded w-12 shimmer"></div>
                </div>
                <div className="p-3 rounded-full bg-gray-300 shimmer">
                  <div className="h-6 w-6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barre principale skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center w-14 bg-gray-200 rounded-2xl border border-gray-300">
                <div className="p-3 text-gray-500 flex-shrink-0 shimmer"></div>
              </div>
            </div>
            
            <div className="h-10 bg-gray-200 rounded-xl shimmer w-32"></div>
          </div>
          
          <div className="h-10 bg-gray-200 rounded-xl shimmer w-24"></div>
        </div>

        <style jsx>{`
          .shimmer {
            animation: shimmer 2s infinite linear;
            background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
            background-size: 800px 104px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 mb-6">
      {/* Section des statistiques */}
      <StatsSection />

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
                <MagnifyingGlassIcon className="h-5 w-5" />
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
                  onChange={handleSearchChange}
                  className="w-full py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Bouton fermer */}
              {isSearchExpanded && (
                <button
                  onClick={handleSearchClose}
                  className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                >
                  <XMarkIcon className="h-4 w-4" />
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
            <ChevronDownIcon 
              className={`h-4 w-4 transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Bouton Actualiser */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-blue-200 hover:text-blue-800 transition-all duration-300 hover:scale-105"
        >
          <ArrowsUpDownIcon className="h-5 w-5" />
          <span className="font-medium">Actualiser</span>
        </button>
      </div>

      {/* Panneau de filtres avancés */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isFiltersOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtre Statut Produit */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              📊 Statut Produit
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                    ${filter === option.value
                      ? `${
                          option.color === 'orange' ? 'border-orange-500 bg-orange-50 text-orange-700' :
                          option.color === 'green' ? 'border-green-500 bg-green-50 text-green-700' :
                          option.color === 'red' ? 'border-red-500 bg-red-50 text-red-700' :
                          option.color === 'slate' ? 'border-slate-500 bg-slate-50 text-slate-700' :
                          'border-gray-500 bg-gray-50 text-gray-700'
                        } shadow-sm`
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md'
                    }
                    hover:scale-105 active:scale-95
                  `}
                >
                  {option.label} ({option.count})
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
        ${(searchTerm || filter !== 'all' || sortBy !== 'nom_asc') 
          ? 'max-h-32 opacity-100 mt-4' 
          : 'max-h-0 opacity-0'}
      `}>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <FunnelIcon className="h-4 w-4" />
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
                onClick={clearSearch} 
                className="ml-2 p-1 hover:bg-blue-200/50 rounded-full transition-colors"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filter !== 'all' && (
            <span className={`
              inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium
              ${
                getStatusColor(filter) === 'orange' ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200/60' :
                getStatusColor(filter) === 'green' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/60' :
                getStatusColor(filter) === 'red' ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200/60' :
                getStatusColor(filter) === 'slate' ? 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border border-slate-200/60' :
                'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200/60'
              }
              shadow-sm animate-fadeIn
            `}>
              📦 {getStatusLabel(filter)}
              <button 
                onClick={() => setFilter('all')} 
                className={`ml-2 p-1 ${
                  getStatusColor(filter) === 'orange' ? 'hover:bg-orange-200/50' :
                  getStatusColor(filter) === 'green' ? 'hover:bg-green-200/50' :
                  getStatusColor(filter) === 'red' ? 'hover:bg-red-200/50' :
                  getStatusColor(filter) === 'slate' ? 'hover:bg-slate-200/50' :
                  'hover:bg-gray-200/50'
                } rounded-full transition-colors`}
              >
                <XMarkIcon className="h-3 w-3" />
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
                onClick={() => onSortChange('nom_asc')} 
                className="ml-2 p-1 hover:bg-purple-200/50 rounded-full transition-colors"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Compteur de résultats */}
      {searchTerm && (
        <div className="mt-3 animate-fadeIn">
          <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 inline-block border border-gray-200/60">
            📊 <span className="font-medium">{safeProduits.filter(p => 
              p.nom_produit?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.reference?.toLowerCase().includes(searchTerm.toLowerCase())
            ).length}</span> produit(s) trouvé(s) pour "{searchTerm}"
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
        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
        }
      `}</style>
    </div>
  );
};

export default ProduitFilter;