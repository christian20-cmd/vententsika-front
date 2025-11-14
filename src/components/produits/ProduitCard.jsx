import React, { useState, useRef, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  TagIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Check } from 'lucide-react';
import { FaPlus } from 'react-icons/fa';
import ProductFlightAnimation from '../ProductFlightAnimation';

const ProduitCard = ({ produit, onEdit, onDelete, onAddToCart, onViewDetail, loading = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isSelected, setIsSelected] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStart, setAnimationStart] = useState(null);
  const [animationEnd, setAnimationEnd] = useState(null);
  const [isInView, setIsInView] = useState(false);
  
  const cardRef = useRef(null);
  const observerRef = useRef(null);

  // Observer pour détecter quand la carte entre dans la vue
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (cardRef.current) {
      observerRef.current.observe(cardRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Fonction pour déclencher l'animation
  const triggerFlightAnimation = () => {
    if (!cardRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const startX = cardRect.left + cardRect.width / 2;
    const startY = cardRect.top + cardRect.height / 2;

    const endX = window.innerWidth - 100;
    const endY = 100;

    setAnimationStart({ x: startX, y: startY });
    setAnimationEnd({ x: endX, y: endY });
    setIsAnimating(true);
  };

  // Skeleton loading
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-600 p-4 w-full relative overflow-hidden">
        {/* Skeleton Image */}
        <div className="relative mb-3">
          <div className="w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shimmer-animation"></div>
          
          {/* Skeleton Badges */}
          <div className="absolute top-2 left-2">
            <div className="w-10 h-6 bg-gray-300 rounded-full shimmer-animation"></div>
          </div>
          <div className="absolute top-2 right-2">
            <div className="w-16 h-6 bg-gray-300 rounded-full shimmer-animation"></div>
          </div>
        </div>

        {/* Skeleton Miniatures */}
        <div className="px-2 py-2 bg-gray-100 rounded-xl mb-2">
          <div className="flex space-x-1">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-10 h-10 bg-gray-300 rounded-lg shimmer-animation"></div>
            ))}
          </div>
        </div>

        {/* Skeleton Content */}
        <div className="space-y-3">
          {/* Nom et Statut */}
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-300 rounded w-3/4 shimmer-animation"></div>
            <div className="w-16 h-6 bg-gray-300 rounded-full shimmer-animation"></div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full shimmer-animation"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3 shimmer-animation"></div>
          </div>
        
          {/* Prix et Catégorie */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-6 bg-gray-300 rounded w-20 shimmer-animation"></div>
              <div className="h-4 bg-gray-300 rounded w-16 shimmer-animation"></div>
            </div>
            <div className="w-20 h-6 bg-gray-300 rounded-full shimmer-animation"></div>
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between">
            <div className="w-24 h-6 bg-gray-300 rounded-full shimmer-animation"></div>
            <div className="w-16 h-5 bg-gray-300 rounded shimmer-animation"></div>
          </div>

          {/* Bouton */}
          <div className="h-12 bg-gray-300 rounded-xl shimmer-animation"></div>
        </div>

        {/* Informations supplémentaires */}
        <div className="p-2 bg-gray-100 rounded-2xl mt-3">
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded shimmer-animation"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🔧 Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (chemin) => {
    if (!chemin) return null;
   
    if (chemin.startsWith('http')) {
      return chemin;
    }
   
    if (chemin.startsWith('/storage/')) {
      return `http://localhost:8000${chemin}`;
    }
   
    return `http://localhost:8000${chemin.startsWith('/') ? chemin : '/' + chemin}`;
  };

  // 🔧 Récupérer toutes les images disponibles
  const getAllImages = () => {
    const images = [];

    if (produit.medias && produit.medias.length > 0) {
      produit.medias.forEach(media => {
        const url = getImageUrl(media.chemin_fichier);
        if (url) images.push(url);
      });
    }

    if (produit.image_principale) {
      const mainImageUrl = getImageUrl(produit.image_principale);
      if (mainImageUrl && !images.includes(mainImageUrl)) {
        images.unshift(mainImageUrl);
      }
    }

    return images;
  };

  const images = getAllImages();
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] || null;

  // Navigation entre les images
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const prixOriginal = parseFloat(produit.prix_unitaire);
  const prixPromo = produit.prix_promotion ? parseFloat(produit.prix_promotion) : null;
  const reduction = prixPromo ? Math.round(((prixOriginal - prixPromo) / prixOriginal) * 100) : 0;

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactif': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'rupture': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStockColor = () => {
    const quantite = produit.quantite_reellement_disponible || 0;
    const seuil = produit.stock?.seuil_alerte || 0;
    
    if (quantite === 0) return 'text-red-600 bg-red-50 border border-red-200';
    if (quantite <= seuil) return 'text-orange-600 bg-orange-50 border border-orange-200';
    return 'text-green-600 bg-green-50 border border-green-200';
  };

  const handleAnimationComplete = () => {
    if (showQuantitySelector) {
      onAddToCart(produit, selectedQuantity);
      setShowQuantitySelector(false);
      setSelectedQuantity(1);
    } else {
      onAddToCart(produit, 1);
    }
    
    setIsSelected(true);
    setIsAnimating(false);
    
    setTimeout(() => {
      setIsSelected(false);
    }, 2000);
  };

  const handleAddToCart = () => {
    if ((produit.quantite_reellement_disponible || 0) === 0) {
      alert('Ce produit est en rupture de stock.');
      return;
    }

    if (showQuantitySelector) {
      triggerFlightAnimation();
    } else {
      setShowQuantitySelector(true);
    }
  };

  const handleQuickAdd = () => {
    if ((produit.quantite_reellement_disponible || 0) === 0) {
      alert('Ce produit est en rupture de stock.');
      return;
    }
    
    triggerFlightAnimation();
  };

  const incrementQuantity = () => {
    const maxQuantity = produit.quantite_reellement_disponible || 0;
    if (selectedQuantity < maxQuantity) {
      setSelectedQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  const cancelQuantitySelection = () => {
    setShowQuantitySelector(false);
    setSelectedQuantity(1);
  };

  const isOutOfStock = (produit.quantite_reellement_disponible || 0) === 0;
  const isLowStock = (produit.quantite_reellement_disponible || 0) > 0 && 
                    (produit.quantite_reellement_disponible || 0) <= (produit.stock?.seuil_alerte || 5);

  return (
    <div 
      ref={cardRef}
      className={`
        bg-white rounded-3xl shadow-2xl shadow-gray-600 p-4 w-full relative hover:shadow-xl 
        transition-all duration-500 ease-out transform
        ${isInView 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
        }
        group
      `}
      style={{
        transitionDelay: isInView ? '0.1s' : '0s'
      }}
    >
      {/* Animation de vol */}
      {isAnimating && (
        <ProductFlightAnimation
          product={produit}
          startPosition={animationStart}
          endPosition={animationEnd}
          onAnimationComplete={handleAnimationComplete}
        />
      )}

      {/* Section Image Principale */}
      <div className="relative mb-3">
        <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
          {currentImage ? (
            <img
              src={currentImage}
              alt={produit.nom_produit}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                console.error('Erreur de chargement image:', currentImage);
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-1">📦</div>
                <div className="text-xs">Aucune image</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation entre images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 shadow-lg hover:scale-110"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 shadow-lg hover:scale-110"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Indicateur de galerie */}
        {hasMultipleImages && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg transform transition-transform duration-300 group-hover:scale-105">
              {currentImageIndex + 1}/{images.length}
            </span>
          </div>
        )}

        {/* Badge promotion */}
        {prixPromo && (
          <div className="absolute top-8 left-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg transform transition-transform duration-300 group-hover:scale-105">
              <TagIcon className="h-3 w-3 mr-1" />
              -{reduction}%
            </span>
          </div>
        )}

        {/* Badge stock */}
        {isOutOfStock && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-lg transform transition-transform duration-300 group-hover:scale-105">
              Rupture
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-lg transform transition-transform duration-300 group-hover:scale-105">
              Stock faible
            </span>
          </div>
        )}

        {/* Bouton d'ajout rapide au panier */}
        {!showQuantitySelector && !isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 transform ${
              isSelected 
                ? 'bg-green-500 text-white animate-bounce' 
                : 'bg-white text-green-800 border border-green-800 font-bold hover:bg-green-500 hover:text-white'
            }`}
            title={isSelected ? "Ajouté au panier" : "Ajouter au panier"}
          >
            {isSelected ? (
              <Check className="h-4 w-4" />
            ) : (
              <FaPlus className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-6 right-6 flex flex-col space-y-1">
        <button
          onClick={() => onViewDetail(produit)}
          className="p-1.5 rounded-full bg-cyan-400 backdrop-blur-sm shadow-lg text-black hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 hover:scale-110 transform"
          title="Voir les détails"
        >
          <EyeIcon className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => onEdit(produit)}
          className="p-1.5 rounded-full items-center bg-yellow-400 backdrop-blur-sm shadow-lg text-black hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-110 transform"
          title="Modifier"
        >
          <PencilIcon className="h-4 w-5" />
        </button>
        <button
          onClick={() => onDelete(produit.idProduit)}
          className="p-1.5 rounded-full bg-red-400 shadow-lg text-black hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-110 transform"
          title="Supprimer"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Miniatures des images supplémentaires */}
      {hasMultipleImages && images.length > 1 && (
        <div className="px-2 py-2 bg-gray-200 rounded-xl border border-gray-100 mb-2 transform transition-all duration-300 group-hover:bg-gray-300">
          <div className="flex space-x-1 overflow-x-auto">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={(e) => selectImage(index, e)}
                className={`flex-shrink-0 w-10 h-10 rounded-lg border transition-all duration-300 transform hover:scale-105 ${
                  index === currentImageIndex 
                    ? 'border-blue-500 ring-1 ring-blue-200 shadow-sm scale-105' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`Vue ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </button>
            ))}
            {images.length > 4 && (
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 transform transition-all duration-300 hover:scale-105">
                +{images.length - 4}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="transform transition-all duration-300 group-hover:translate-y-[-2px]">
        {/* Nom et Statut */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors duration-300 transform group-hover:translate-x-1">
            {produit.nom_produit}
          </h3>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium transform transition-all duration-300 group-hover:scale-105 ${getStatutColor(produit.statut)}`}>
            {produit.statut}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed text-start min-h-[2.5rem] transform transition-all duration-300 group-hover:text-gray-700">
          {produit.description}
        </p>
       
        {/* Prix et Catégorie */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono">
            {prixPromo ? (
              <div className="flex flex-col transform transition-all duration-300 group-hover:scale-105">
                <span className="text-lg font-bold text-blue-700">
                  {prixPromo.toLocaleString('fr-FR')} Ar
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {prixOriginal.toLocaleString('fr-FR')} Ar
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900 transform transition-all duration-300 group-hover:scale-105">
                {prixOriginal.toLocaleString('fr-FR')} Ar
              </span>
            )}
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 transform transition-all duration-300 group-hover:scale-105">
            {produit.categorie}
          </span>
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 mb-2 rounded-full text-xs font-medium transform transition-all duration-300 group-hover:scale-105 ${getStockColor()} shadow-sm`}>
            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
              isOutOfStock ? 'bg-red-500' :
              isLowStock ? 'bg-orange-500' : 'bg-green-500'
            }`} />
            Stock: {produit.quantite_reellement_disponible || 0}
          </span>
          
          {produit.stock?.seuil_alerte && (
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded transform transition-all duration-300 group-hover:scale-105">
              Seuil: {produit.stock.seuil_alerte}
            </span>
          )}
        </div>

        {/* Section d'ajout au panier */}
        {showQuantitySelector ? (
          <div className="space-y-2 bg-gray-200 p-3 rounded-2xl transform transition-all duration-300 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Quantité:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={decrementQuantity}
                  disabled={selectedQuantity <= 1}
                  className="p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 transform transition-all duration-200 hover:scale-110"
                >
                  <MinusIcon className="h-3 w-3" />
                </button>
                <span className="text-base font-bold w-6 text-center bg-white py-1 rounded shadow-sm transform transition-all duration-200">
                  {selectedQuantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={selectedQuantity >= (produit.quantite_reellement_disponible || 0)}
                  className="p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 transform transition-all duration-200 hover:scale-110"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={cancelQuantitySelection}
                className="flex-1 py-2 px-3 rounded-lg text-black bg-white hover:bg-gray-50 text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
               Annuler
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-2 px-3 font-semibold bg-blue-800 text-white rounded-lg hover:bg-blue-800/60 text-sm flex items-center justify-center transition-all duration-200 transform hover:scale-105"
              >
                <Check className="h-3 w-3 mr-1" />
                Confirmer
              </button>
            </div>

            {/* Prix total */}
            <div className="flex items-center gap-4 border-t border-gray-200 pt-2">
              <p className="text-xs text-gray-600">Total:........................................  </p>
              <p className="text-sm font-bold font-mono text-green-800 transform transition-all duration-200 group-hover:scale-105">
                {((prixPromo || prixOriginal) * selectedQuantity).toLocaleString('fr-FR')} Ar
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-md transform hover:scale-105 ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSelected
                ? 'bg-green-500 text-white hover:bg-green-600 animate-pulse'
                : 'bg-blue-800 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isOutOfStock ? (
              <span className="font-semibold text-sm">Rupture de stock</span>
            ) : isSelected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                <span className="font-semibold text-sm">Ajouté !</span>
              </>
            ) : (
              <>
                <FaPlus className="h-4 w-4 mr-2" />
                <span className="font-semibold text-sm">Sélectionner</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Informations supplémentaires */}
      <div className="p-2 bg-gray-200 rounded-2xl border border-gray-200 mt-3 transform transition-all duration-300 group-hover:bg-gray-300 group-hover:scale-105">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="bg-white p-1.5 rounded shadow-sm transform transition-all duration-300 hover:scale-105">
            <span className="font-medium block text-gray-500 text-xs">Réf:</span> 
            <span className="font-semibold">{produit.idProduit}</span>
          </div>
          <div className="bg-white p-1.5 rounded shadow-sm transform transition-all duration-300 hover:scale-105">
            <span className="font-medium block text-gray-500 text-xs">Catégorie:</span> 
            <span className="font-semibold">{produit.categorie}</span>
          </div>
          {produit.created_at && (
            <div className="col-span-2 bg-white p-1.5 rounded shadow-sm transform transition-all duration-300 hover:scale-105">
              <span className="font-medium block text-gray-500 text-xs">Ajouté le:</span> 
              <span className="font-semibold">{new Date(produit.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Styles CSS supplémentaires */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        .shimmer-animation {
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ProduitCard;