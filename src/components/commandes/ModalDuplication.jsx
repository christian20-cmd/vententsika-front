import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Package, Plus, Trash2, Minus } from 'lucide-react';
import axios from 'axios';
import { createPortal } from 'react-dom';
import ErrorBoundary from '../ErrorBoundary';
import { XMarkIcon } from '@heroicons/react/24/outline';
import LogoTB from '../../assets/LogoTB.png'

const formatPrix = (prix) => {
  if (!prix || isNaN(prix)) return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(0);
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

// Composant pour l'image du produit
const ProductImage = React.memo(({ produit }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError || !produit.produit?.medias?.[0]) {
    return (
      <div className="w-12 h-12 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center flex-shrink-0">
        <Package className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={`http://localhost:8000/storage/${produit.produit.medias[0].chemin_fichier}`}
      alt={produit.produit.nom_produit || 'Produit'}
      className="w-12 h-12 object-cover rounded-2xl border border-gray-200 flex-shrink-0"
      onError={() => setImageError(true)}
    />
  );
});

ProductImage.displayName = 'ProductImage';

// Composant pour les contrôles de quantité avec gestion du stock
const QuantityControls = React.memo(({ 
  quantity, 
  onDecrease, 
  onIncrease, 
  loading,
  stockDisponible,
  quantiteModifiee 
}) => {
  const peutAugmenter = stockDisponible > quantiteModifiee;
  
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={onDecrease}
        disabled={loading || quantity <= 1}
        className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus/>
      </button>
      <span className="w-12 text-center font-bold text-lg">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={loading || !peutAugmenter}
        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 border ${
          peutAugmenter 
            ? 'bg-white hover:bg-gray-100 border-gray-300' 
            : 'bg-gray-100 border-gray-200 cursor-not-allowed'
        } disabled:opacity-50`}
        title={!peutAugmenter ? "Stock insuffisant" : "Augmenter la quantité"}
      >
        <Plus className={`w-5 h-5 ${peutAugmenter ? 'text-gray-700' : 'text-gray-400'}`}/>
      </button>
      
      {/* Indicateur de stock */}
      {!peutAugmenter && (
        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">
          Stock: {stockDisponible}
        </span>
      )}
    </div>
  );
});

QuantityControls.displayName = 'QuantityControls';

// Composant pour l'affichage du prix
const PriceDisplay = React.memo(({ produit, originalQuantity }) => {
  const prixUnitaire = produit.prix_promotion || produit.prix_unitaire || 0;
  const totalActuel = prixUnitaire * produit.quantite_modifiee;
  const totalOriginal = prixUnitaire * originalQuantity;

  return (
    <div className="text-right min-w-24">
      <p className="font-semibold text-gray-900">
        {formatPrix(totalActuel)}
      </p>
      {produit.quantite_modifiee !== originalQuantity && (
        <p className="text-xs text-gray-500 line-through">
          {formatPrix(totalOriginal)}
        </p>
      )}
    </div>
  );
});

PriceDisplay.displayName = 'PriceDisplay';

// Composant pour un produit individuel avec gestion du stock
const ProductItem = React.memo(({ 
  produit, 
  index, 
  loading, 
  onModifyQuantity, 
  onRemoveProduct,
  stockDisponible 
}) => {
  const handleDecrease = useCallback(() => {
    if (loading) return;
    onModifyQuantity(index, Math.max(1, produit.quantite_modifiee - 1));
  }, [index, produit.quantite_modifiee, onModifyQuantity, loading]);

  const handleIncrease = useCallback(() => {
    if (loading || stockDisponible <= produit.quantite_modifiee) return;
    onModifyQuantity(index, produit.quantite_modifiee + 1);
  }, [index, produit.quantite_modifiee, onModifyQuantity, loading, stockDisponible]);

  const handleRemove = useCallback(() => {
    if (loading) return;
    onRemoveProduct(index);
  }, [index, onRemoveProduct, loading]);

  if (!produit || !produit.produit) {
    return null;
  }

  const peutAugmenter = stockDisponible > produit.quantite_modifiee;
  const originalQuantity = produit.quantite || 1;

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 mb-3 ${
      peutAugmenter 
        ? 'bg-gray-50 border-gray-200 hover:border-blue-300' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <ProductImage produit={produit} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {produit.produit?.nom_produit || 'Produit inconnu'}
          </p>
          <p className="text-sm text-gray-600">
            Prix: {formatPrix(produit.prix_promotion || produit.prix_unitaire)}
            {produit.prix_promotion && (
              <span className="text-red-600 ml-2">Promotion!</span>
            )}
          </p>
          <p className={`text-xs mt-1 ${
            peutAugmenter ? 'text-gray-500' : 'text-red-600 font-semibold'
          }`}>
            Stock disponible: {stockDisponible}
            {!peutAugmenter && ' - Rupture de stock'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <QuantityControls
          quantity={produit.quantite_modifiee}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          loading={loading}
          stockDisponible={stockDisponible}
          quantiteModifiee={produit.quantite_modifiee}
        />
        
        <PriceDisplay 
          produit={produit} 
          originalQuantity={originalQuantity}
        />
        
        <button
          onClick={handleRemove}
          disabled={loading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
          title="Supprimer le produit"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
});

ProductItem.displayName = 'ProductItem';

// Composant SummarySection simplifié
const SummarySection = React.memo(({ totalOriginal, totalModifie }) => {
  const difference = totalModifie - totalOriginal;
  
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
      <h4 className="font-semibold text-blue-800 mb-3">Résumé des modifications</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total original:</p>
          <p className="text-lg font-bold text-gray-800">{formatPrix(totalOriginal)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total modifié:</p>
          <p className={`text-lg font-bold ${
            totalModifie > totalOriginal ? 'text-green-600' : 
            totalModifie < totalOriginal ? 'text-blue-600' : 'text-gray-800'
          }`}>
            {formatPrix(totalModifie)}
            {difference !== 0 && (
              <span className="text-sm ml-2">
                ({difference > 0 ? '+' : ''}{formatPrix(difference)})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
});

SummarySection.displayName = 'SummarySection';

// Composant pour l'avertissement
const WarningSection = React.memo(() => (
  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
    <p className="text-sm text-yellow-800">
      ⚠️ La commande annulée sera mise à jour avec les produits modifiés.
      Vérifiez les quantités avant de confirmer.
    </p>
  </div>
));

WarningSection.displayName = 'WarningSection';

// ModalContent avec gestion des stocks
const ModalContent = React.memo(({ 
  loading,
  error,
  commandeADupliquer,
  produitsModifies,
  onClose,
  onModifyQuantity,
  onRemoveProduct,
  onAddProduct,
  onConfirm,
  onRetry,
  stocksProduits
}) => {
  // Calculer les totaux de manière sécurisée
  const { totalModifie, totalOriginal } = useMemo(() => {
    const totalModifie = (produitsModifies || []).reduce((total, produit) => {
      const prix = produit.prix_promotion || produit.prix_unitaire || 0;
      const quantite = produit.quantite_modifiee || produit.quantite || 0;
      return total + (prix * quantite);
    }, 0);

    const totalOriginal = (commandeADupliquer?.lignes_commande || []).reduce((total, ligne) => {
      return total + (ligne.sous_total || 0);
    }, 0);

    return { totalModifie, totalOriginal };
  }, [produitsModifies, commandeADupliquer]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  }, [loading, onClose]);

  // Vérifier s'il y a des produits disponibles avec stock
  const produitsAvecStockDisponible = useMemo(() => {
    return Object.values(stocksProduits).some(stock => stock > 0);
  }, [stocksProduits]);

  // Rendu des produits avec gestion du stock
  const renderProductItems = useCallback(() => {
    if (!produitsModifies || produitsModifies.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucun produit sélectionné. Cliquez sur "Ajouter des produits" pour commencer.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {produitsModifies.map((produit, index) => {
          const produitId = produit.idProduit || produit.produit?.idProduit;
          const stockDisponible = stocksProduits[produitId] || 0;

          return (
            <ProductItem
              key={`product-${produitId}-${index}`}
              produit={produit}
              index={index}
              loading={loading}
              onModifyQuantity={onModifyQuantity}
              onRemoveProduct={onRemoveProduct}
              stockDisponible={stockDisponible}
            />
          );
        })}
      </div>
    );
  }, [produitsModifies, loading, onModifyQuantity, onRemoveProduct, stocksProduits]);

  // Ne pas rendre si pas de données
  if (!commandeADupliquer) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 font-MyFontFamily"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>

        {/* Header */}
        <div className="text-center px-6">
          <h2 className="text-xl font-bold text-black">Dupliquer et modifier la commande</h2>
          <p className="text-gray-600 mt-2">
            Commande #{commandeADupliquer.numero_commande} - {commandeADupliquer.client?.nom_prenom_client || 'Client inconnu'}
          </p>
          <p className="text-sm text-blue-600 font-medium mt-1">
            ⚡ La commande annulée sera restaurée avec les modifications
          </p>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-800 mb-2">{error}</p>
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-2xl text-sm hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Section Produits */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Produits de la commande</h3>
              <button
                onClick={onAddProduct}
                disabled={loading || !produitsAvecStockDisponible}
                className={`px-4 py-2 rounded-2xl transition-all duration-200 flex items-center space-x-2 ${
                  produitsAvecStockDisponible 
                    ? 'bg-blue-800 text-white hover:bg-blue-700' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                } disabled:opacity-50`}
                title={!produitsAvecStockDisponible ? "Aucun produit disponible en stock" : "Ajouter des produits"}
              >
                <Plus size={16} />
                <span>
                  {produitsAvecStockDisponible ? "Ajouter des produits" : "Aucun stock disponible"}
                </span>
              </button>
            </div>

            {renderProductItems()}
          </div>

          {/* Résumé et actions */}
          <SummarySection 
            totalOriginal={totalOriginal}
            totalModifie={totalModifie}
          />

          <WarningSection />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !produitsModifies || produitsModifies.length === 0}
            className="px-6 py-3 bg-blue-800 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Mise à jour en cours...' : 'Confirmer la mise à jour'}
          </button>
        </div>
      </div>
    </div>
  );
});

ModalContent.displayName = 'ModalContent';

// Composant principal avec meilleure gestion des stocks
const ModalDuplicationContent = ({ 
  commandeADupliquer, 
  setShowDuplicateModal, 
  setCommandeADupliquer,
  produitsModifies,
  setProduitsModifies,
  fetchCommandes,
  fetchStatistiques,
  getAuthHeaders
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const [stocksProduits, setStocksProduits] = useState({});
  const cleanupTimerRef = useRef(null);

  // CORRECTION: Fonction améliorée pour récupérer les stocks
  const fetchStocksProduits = useCallback(async () => {
    if (!commandeADupliquer || !produitsModifies?.length) return;

    try {
      console.log('🔄 Début récupération des stocks...');
      
      const response = await axios.get('http://localhost:8000/api/produits', {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        const stocksMap = {};
        
        response.data.data.forEach(produit => {
          if (produit.idProduit) {
            stocksMap[produit.idProduit] = produit.quantite_reellement_disponible || 0;
          }
        });

        console.log('📊 Stocks récupérés depuis /api/produits:', stocksMap);
        setStocksProduits(stocksMap);
      } else {
        throw new Error('Erreur dans la réponse API');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des produits:', error);
      
      const fallbackStocks = {};
      produitsModifies.forEach(produit => {
        const produitId = produit.idProduit || produit.produit?.idProduit;
        const stockFromProduct = produit.quantite_reellement_disponible ?? 
                               produit.produit?.quantite_reellement_disponible ?? 
                               0;
        fallbackStocks[produitId] = stockFromProduct;
      });
      
      setStocksProduits(fallbackStocks);
      console.log('📦 Stocks de fallback utilisés:', fallbackStocks);
    }
  }, [commandeADupliquer, produitsModifies, getAuthHeaders]);

  useEffect(() => {
    setIsMounted(true);
    
    if (commandeADupliquer && produitsModifies?.length > 0) {
      fetchStocksProduits();
    }
    
    return () => {
      setIsMounted(false);
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
    };
  }, [commandeADupliquer, produitsModifies, fetchStocksProduits]);

  // Fermeture améliorée
  const handleClose = useCallback(() => {
    setError(null);
    
    cleanupTimerRef.current = setTimeout(() => {
      if (isMounted) {
        setShowDuplicateModal(false);
        setCommandeADupliquer(null);
        setProduitsModifies([]);
      }
    }, 100);
  }, [setShowDuplicateModal, setCommandeADupliquer, setProduitsModifies, isMounted]);

  // Redirection vers produits
  const handleAddProductAndRedirect = useCallback(() => {
    if (!commandeADupliquer) {
      console.error('❌ Aucune commande à dupliquer');
      return;
    }

    const duplicationData = {
      commandeADupliquer: {
        idCommande: commandeADupliquer.idCommande,
        numero_commande: commandeADupliquer.numero_commande,
        client: commandeADupliquer.client,
        produits: produitsModifies.map(produit => ({
          idProduit: produit.idProduit || produit.produit?.idProduit,
          nom_produit: produit.produit?.nom_produit,
          prix_unitaire: produit.prix_unitaire,
          prix_promotion: produit.prix_promotion,
          quantite: produit.quantite_modifiee || produit.quantite,
          quantite_modifiee: produit.quantite_modifiee,
          produit: produit.produit,
          stock_disponible: stocksProduits[produit.idProduit || produit.produit?.idProduit]
        })),
        produitsExistants: commandeADupliquer.lignes_commande?.map(ligne => ({
          idProduit: ligne.idProduit,
          nom_produit: ligne.produit?.nom_produit,
          prix_unitaire: ligne.prix_unitaire,
          prix_promotion: ligne.prix_promotion,
          quantite: ligne.quantite,
          produit: ligne.produit,
          stock_disponible: stocksProduits[ligne.idProduit]
        })) || []
      },
      timestamp: new Date().getTime()
    };

    localStorage.setItem('commandeDuplication', JSON.stringify(duplicationData));

    setShowDuplicateModal(false);
    setCommandeADupliquer(null);
    setProduitsModifies([]);

    window.location.href = '/produits';

  }, [commandeADupliquer, produitsModifies, stocksProduits, setShowDuplicateModal, setCommandeADupliquer, setProduitsModifies]);

  const modifierQuantiteProduit = useCallback((index, nouvelleQuantite) => {
    if (nouvelleQuantite < 1 || !produitsModifies?.[index]) return;
    
    const produit = produitsModifies[index];
    const produitId = produit.idProduit || produit.produit?.idProduit;
    const stockDisponible = stocksProduits[produitId] || 0;
    
    if (nouvelleQuantite > stockDisponible) {
      console.log('❌ Stock insuffisant:', { 
        produit: produit.produit?.nom_produit,
        demandé: nouvelleQuantite, 
        disponible: stockDisponible 
      });
      return;
    }
    
    setProduitsModifies(prev => {
      if (!Array.isArray(prev) || index < 0 || index >= prev.length) {
        return prev;
      }
      
      return prev.map((produit, i) => 
        i === index 
          ? { ...produit, quantite_modifiee: Math.max(1, parseInt(nouvelleQuantite) || 1) }
          : produit
      );
    });
  }, [produitsModifies, setProduitsModifies, stocksProduits]);

  const supprimerProduit = useCallback((index) => {
    if (!produitsModifies?.[index]) return;
    
    setProduitsModifies(prev => {
      if (!Array.isArray(prev)) return [];
      return prev.filter((_, i) => i !== index);
    });
  }, [produitsModifies, setProduitsModifies]);

  const handleRetry = useCallback(() => {
    setError(null);
  }, []);

  // ⭐⭐ CORRECTION: Mettre à jour la commande existante au lieu d'en créer une nouvelle
  const confirmerDuplication = useCallback(async () => {
    if (!commandeADupliquer || !produitsModifies?.length) {
      setError('Veuillez ajouter au moins un produit à la commande.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Vérification finale des stocks
      const erreursStock = [];
      produitsModifies.forEach(produit => {
        const produitId = produit.idProduit || produit.produit?.idProduit;
        const stockDisponible = stocksProduits[produitId] || 0;
        const quantiteDemandee = produit.quantite_modifiee || produit.quantite || 1;
        
        if (stockDisponible < quantiteDemandee) {
          erreursStock.push({
            produit: produit.produit?.nom_produit || 'Produit inconnu',
            quantite_demandee: quantiteDemandee,
            stock_disponible: stockDisponible
          });
        }
      });

      if (erreursStock.length > 0) {
        const messagesErreurs = erreursStock.map(erreur => 
          `• ${erreur.produit}: demandé ${erreur.quantite_demandee}, disponible ${erreur.stock_disponible}`
        ).join('\n');
        
        throw new Error(`Stocks insuffisants:\n${messagesErreurs}`);
      }

      // Préparer les données pour la mise à jour
      const produitsValides = produitsModifies.map(produit => {
        const idProduit = parseInt(produit.idProduit || produit.produit?.idProduit);
        if (!idProduit || isNaN(idProduit)) {
          throw new Error(`ID produit invalide pour: ${produit.produit?.nom_produit || 'produit inconnu'}`);
        }

        return {
          idProduit: idProduit,
          quantite: parseInt(produit.quantite_modifiee || produit.quantite || 1),
          prix_unitaire: parseFloat(produit.prix_unitaire) || 0,
          prix_promotion: produit.prix_promotion ? parseFloat(produit.prix_promotion) : null
        };
      });

      // ⭐⭐ CORRECTION: Utiliser l'endpoint de modification avec l'ID de la commande existante
      const response = await axios.put(
        `http://localhost:8000/api/commandes/${commandeADupliquer.idCommande}/modifier-produits`,
        {
          produits: produitsValides
        },
        {
          headers: getAuthHeaders(),
          timeout: 15000
        }
      );
      
      if (response.data.success) {
        alert('✅ Commande dupliquée et modifiée avec succès ! La commande a été mise à jour.');
        handleClose();
        
        // Recharger les données
        if (fetchCommandes) await fetchCommandes();
        if (fetchStatistiques) await fetchStatistiques();
      } else {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour de la commande');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la commande:', error);
      
      let errorMessage = 'Erreur lors de la mise à jour de la commande.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout: La requête a pris trop de temps.';
      } else if (error.response?.status === 400 && error.response.data?.erreurs_stock) {
        const erreursStock = error.response.data.erreurs_stock;
        const messagesErreurs = erreursStock.map(erreur => 
          `• ${erreur.produit}: demandé ${erreur.quantite_demandee}, disponible ${erreur.stock_disponible}`
        ).join('\n');
        
        errorMessage = `❌ Stocks insuffisants:\n${messagesErreurs}`;
      } else if (error.response?.status === 422) {
        const erreurs = error.response.data.errors;
        if (erreurs) {
          const messagesErreurs = Object.entries(erreurs)
            .map(([champ, messages]) => `• ${champ}: ${messages.join(', ')}`)
            .join('\n');
          errorMessage = `❌ Erreurs de validation:\n${messagesErreurs}`;
        }
      } else if (error.response?.data?.message) {
        errorMessage = `❌ Erreur: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [commandeADupliquer, produitsModifies, stocksProduits, getAuthHeaders, handleClose, fetchCommandes, fetchStatistiques]);

  return createPortal(
    <ModalContent
      loading={loading}
      error={error}
      commandeADupliquer={commandeADupliquer}
      produitsModifies={produitsModifies}
      onClose={handleClose}
      onModifyQuantity={modifierQuantiteProduit}
      onRemoveProduct={supprimerProduit}
      onAddProduct={handleAddProductAndRedirect}
      onConfirm={confirmerDuplication}
      onRetry={handleRetry}
      stocksProduits={stocksProduits}
    />,
    document.body
  );
};

ModalDuplicationContent.displayName = 'ModalDuplicationContent';

// Composant exporté avec Error Boundary
export const ModalDuplication = (props) => {
  return (
    <ErrorBoundary 
      onReset={() => {
        props.setShowDuplicateModal(false);
        props.setCommandeADupliquer(null);
        props.setProduitsModifies([]);
      }}
    >
      <ModalDuplicationContent {...props} />
    </ErrorBoundary>
  );
};

export default ModalDuplication;