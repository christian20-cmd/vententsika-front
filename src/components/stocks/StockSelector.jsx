import React, { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import LogoTB from '../../assets/LogoTB.png';

const StockSelector = ({ stocks, onSelect, onClose }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  console.log('📦 Stocks dans StockSelector:', stocks);

  const handleStockSelect = async (stock) => {
    setSelectedStock(stock);
    
    try {
      // Récupérer les données complètes du stock
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/stocks/${stock.idStock}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const stockComplet = await response.json();
        console.log('📦 Données complètes du stock:', stockComplet);
        
        // Préparer les données avec les informations complètes
        const stockData = {
          ...stockComplet,
          // S'assurer que toutes les données essentielles sont présentes
          nom_produit: stockComplet.nom_produit || stock.nom_produit || '',
          description: stockComplet.produit?.description || stock.description || '',
          categorie: stockComplet.categorie || stock.categorie || '',
          idCategorie: stockComplet.produit?.idCategorie || stock.idCategorie || '',
          prix_unitaire: stockComplet.prix_unitaire || stock.prix_unitaire || 0,
          quantite_disponible: stockComplet.quantite_disponible || stock.quantite_disponible || 0,
          stock_entree: stockComplet.stock_entree || stock.stock_entree || 0,
          quantite_reservee: stockComplet.quantite_reservee || stock.quantite_reservee || 0,
          quantite_reellement_disponible: stockComplet.quantite_reellement_disponible || stock.quantite_reellement_disponible || 0,
          code_stock: stockComplet.code_stock || stock.code_stock || ''
        };
        
        setTimeout(() => {
          onSelect(stockData);
        }, 300);
      } else {
        console.warn('Récupération stock échouée, utilisation des données basiques');
        onSelect(stock);
      }
    } catch (error) {
      console.error('Erreur récupération stock:', error);
      onSelect(stock);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">

        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200  hover:rotate-90 group"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>
         <div className="flex justify-center mb-4">
              <img src={LogoTB} alt="logo" className='w-32'/>
          </div>

         
        {/* Header */}
        
           
            <div className='text-center'>
              <h2 className="text-2xl font-bold text-gray-900">
                Sélectionner un stock
              </h2>
              <p className="text-sm text-gray-600">
                Choisissez parmi vos stocks non publiés
              </p>
            </div>
          

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {stocks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XMarkIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun stock disponible
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Tous vos stocks ont été publiés ou aucun stock n'est disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stocks.map((stock, index) => (
                <div
                  key={stock.idStock}
                  className={`relative bg-white border-2 border-gray-400 rounded-2xl p-4 transition-all duration-300 cursor-pointer transform  group ${
                    selectedStock?.idStock === stock.idStock
                      ? '  shadow-lg '
                      : '  hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleStockSelect(stock)}
                >
                  {/* Badge de statut */}
                  <div className="absolute -top-4 -right-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                      stock.statut_publication === 'inactif' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-800 '
                    }`}>
                      {stock.statut_publication === 'inactif' ? '🔄 Inactif' : '🆕 Nouveau'}
                    </span>
                  </div>

                  {/* Contenu principal en mode block */}
                  <div className="space-y-1">
                    {/* En-tête du stock */}
                    <div className="flex  items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-800 transition-colors duration-200">
                        {stock.nom_produit || 'Stock sans nom'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-black bg-gray-200 px-2 py-1 rounded-lg font-mono">
                          #{stock.code_stock}
                        </span>
                      </div>
                    </div>

                    {/* Détails du stock */}
                                        {/* Dans la section détails du stock */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Quantité:</span>
                          <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            {/* Utiliser quantite_disponible qui est à 50 */}
                            {stock.quantite_disponible} unités
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Catégorie:</span>
                          <span className="font-medium text-gray-900">
                            {/* Maintenant categorie est disponible */}
                            {stock.categorie || 'Non catégorisé'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Afficher le prix maintenant disponible */}
                        {stock.prix_unitaire > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Prix:</span>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                              {parseFloat(stock.prix_unitaire).toLocaleString('fr-FR')} Ar
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Statut:</span>
                          <span className={`font-medium ${
                            stock.statut_publication === 'inactif' ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {stock.statut_publication === 'inactif' ? 'Non publié' : 'Publié'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de sélection */}
                    <div className="pt-3 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStockSelect(stock);
                        }}
                        className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                          selectedStock?.idStock === stock.idStock
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-800 hover:bg-blue-800/60 text-white '
                        }`}
                      >
                        <CheckIcon className={`h-5 w-5 mr-2 transition-transform duration-300 ${
                          selectedStock?.idStock === stock.idStock ? 'scale-95' : ''
                        }`} />
                        {selectedStock?.idStock === stock.idStock ? 'Sélectionné' : 'Sélectionner ce stock'}
                      </button>
                    </div>
                  </div>

                  {/* Effet de survol */}
                  <div className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer informatif */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-center place-self-start space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span>
              {stocks.length} stock{stocks.length !== 1 ? 's' : ''} disponible{stocks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default StockSelector;