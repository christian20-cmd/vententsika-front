import React, { useState } from 'react';
import { Package, Edit2, Plus, Trash2, Eye, EyeOff, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

const StockTable = ({ stocks, onEdit, onDelete, onPublish }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'normal': return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200';
      case 'alerte': return 'bg-gradient-to-r from-yellow-50 to-amber-100 text-yellow-700 border border-yellow-200';
      case 'rupture': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'normal': return '✅';
      case 'alerte': return '⚠️';
      case 'rupture': return '❌';
      default: return '📦';
    }
  };

  const getPublicationStatusColor = (statut) => {
    switch (statut) {
      case 'actif': return 'bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 border border-green-200';
      case 'inactif': return 'bg-gradient-to-r from-yellow-50 to-amber-100 text-yellow-700 border border-yellow-200';
      case 'sans_produit': return 'bg-gradient-to-r from-red-50 to-rose-100 text-red-700 border border-red-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getPublicationStatusIcon = (statut) => {
    switch (statut) {
      case 'actif': return '🌐';
      case 'inactif': return '🔒';
      case 'sans_produit': return '🚫';
      default: return '📄';
    }
  };

  const getPublicationStatusText = (statut) => {
    switch (statut) {
      case 'actif': return 'Publié';
      case 'inactif': return 'Non publié';
      case 'sans_produit': return 'Sans produit';
      default: return statut;
    }
  };

  const formatNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') return defaultValue;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? defaultValue : numValue;
  };

  const formatPrice = (price) => {
    const numPrice = formatNumber(price, 0);
    return numPrice.toLocaleString('fr-FR');
  };

  const calculateValeur = (prixUnitaire, stockEntree) => {
    const prix = formatNumber(prixUnitaire, 0);
    const stock = formatNumber(stockEntree, 0);
    return prix * stock;
  };

  if (stocks.length === 0) {
    return (
      <div className="text-center">
        <div className="relative inline-block mb-2 justify-center items-center mt-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-blue-800" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun stock disponible</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Commencez par créer votre premier stock pour gérer votre inventaire
        </p>
        <button
          onClick={() => onEdit('create')}
              className="flex-1 px-3 py-2 bg-blue-800 place-self-center text-white rounded-xl hover:bg-blue-800/60 transition-all duration-200 font-medium flex items-center justify-center gap-3 hover:shadow-lg transform hover:scale-105 disabled:opacity-50
          "
        >
          <Plus size={20} />
          Créer un stock
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100/50 mt-4">
      {/* En-tête du tableau avec stats */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800">Gestion des Stocks</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {stocks.length} produit{stocks.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-600">En stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-600">Alerte</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-gray-600">Rupture</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prix Unitaire(Ariary)
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock Entrée
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Réservé
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Réellement Dispo
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut Stock
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Publication
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Valeur <br />(Ariary)
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {stocks.map((stock) => {
              const prixUnitaire = formatNumber(stock.prix_unitaire, 0);
              const stockEntree = formatNumber(stock.stock_entree, 0);
              const quantiteReservee = formatNumber(stock.quantite_reservee, 0);
              const quantiteReellementDisponible = formatNumber(stock.quantite_reellement_disponible, 0);
              const valeur = calculateValeur(prixUnitaire, stockEntree);

              return (
                <tr 
                  key={stock.idStock}
                  className={`
                    
                    ${hoveredRow === stock.idStock 
                      ? 'transform scale-[1.02] bg-gradient-to-r from-blue-50/50 to-purple-50/50 shadow-lg border-l-4 border-l-blue-500' 
                      : 'bg-white/50 hover:bg-gray-50/80'
                    }
                  `}
                  onMouseEnter={() => setHoveredRow(stock.idStock)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {stock.code_stock?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {stock.code_stock}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">
                        {stock.nom_produit}
                      </span>
                      {stock.description && (
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                          {stock.description}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {stock.categorie}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-blue-800">
                        {formatPrice(prixUnitaire)}
                      </span>
                      <span className="text-xs text-gray-500"></span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`
                      inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-bold transition-all duration-300
                      ${stockEntree <= 5 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                      }
                    `}>
                      <TrendingUp size={14} />
                      {stockEntree}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-xl text-sm font-medium border border-orange-200">
                      <AlertTriangle size={14} />
                      {quantiteReservee}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`
                      inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-bold transition-all duration-300
                      ${quantiteReellementDisponible <= 5 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                      }
                    `}>
                      <Zap size={14} />
                      {quantiteReellementDisponible}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold ${getStatusColor(stock.statut_automatique)}`}>
                      {getStatusIcon(stock.statut_automatique)}
                      {stock.statut_automatique}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold ${getPublicationStatusColor(stock.statut_publication)}`}>
                      {getPublicationStatusIcon(stock.statut_publication)}
                      {getPublicationStatusText(stock.statut_publication)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(valeur)}
                      </span>
                      <span className="text-xs text-gray-500"></span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* Bouton Publier/Dépublier */}
                      {/* Bouton Publier/Dépublier */}
                      {stock.statut_publication !== 'actif' ? (
                        <button
                          onClick={() => onPublish(stock)}
                          className="
                            text-green-600 hover:text-green-800 hover:bg-green-50 
                            p-2 rounded-xl transition-all duration-300 
                            hover:scale-110 hover:shadow-md
                            border border-transparent hover:border-green-200
                          "
                          title="Publier le produit"
                        >
                          <Eye size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onEdit('update', stock)}
                          className="
                            text-blue-600 hover:text-blue-800 hover:bg-blue-50 
                            p-2 rounded-xl transition-all duration-300 
                            hover:scale-110 hover:shadow-md
                            border border-transparent hover:border-blue-200
                          "
                          title="Dépublier le produit"
                        >
                          <EyeOff size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => onEdit('update', stock)}
                        className="
                          text-blue-600 hover:text-blue-800 hover:bg-blue-50 
                          p-2 rounded-xl transition-all duration-300 
                          hover:scale-110 hover:shadow-md
                          border border-transparent hover:border-blue-200
                        "
                        title="Modifier produit et stock"
                      >
                        <Edit2 size={18} />
                      </button>
                      
                      <button
                        onClick={() => onDelete(stock.idStock)}
                        className="
                          text-red-600 hover:text-red-800 hover:bg-red-50 
                          p-2 rounded-xl transition-all duration-300 
                          hover:scale-110 hover:shadow-md
                          border border-transparent hover:border-red-200
                        "
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau avec résumé */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200/50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total: {stocks.length} produit{stocks.length > 1 ? 's' : ''}</span>
          <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
};

export default StockTable;