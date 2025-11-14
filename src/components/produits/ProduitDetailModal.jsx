import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  TagIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import LogoTB from '../../assets/LogoTB.png'
import { Plus } from 'lucide-react';

const ProduitDetailModal = ({ produit, onClose, onAddToCart, loading = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-md max-w-7xl w-full max-h-[90vh] overflow-hidden">
          {/* En-tête Skeleton */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="h-8 bg-gray-200 rounded w-64 shimmer"></div>
            <div className="h-6 w-6 bg-gray-200 rounded shimmer"></div>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
            {/* Image Section Skeleton */}
            <div className="lg:w-1/2 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="relative h-96 bg-gray-200 shimmer rounded-lg"></div>
            </div>

            {/* Content Section Skeleton */}
            <div className="lg:w-1/2 p-8 overflow-y-auto">
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 bg-gray-200 rounded shimmer"></div>
                <div className="h-20 bg-gray-200 rounded shimmer"></div>
                <div className="h-12 bg-gray-200 rounded shimmer"></div>
                <div className="h-16 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
          </div>
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

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (chemin) => {
    if (!chemin) return null;
    if (chemin.startsWith('http')) return chemin;
    if (chemin.startsWith('/storage/')) return `http://localhost:8000${chemin}`;
    return `http://localhost:8000${chemin.startsWith('/') ? chemin : '/' + chemin}`;
  };

  // Récupérer toutes les images
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const prixOriginal = parseFloat(produit.prix_unitaire);
  const prixPromo = produit.prix_promotion ? parseFloat(produit.prix_promotion) : null;
  const reduction = prixPromo ? Math.round(((prixOriginal - prixPromo) / prixOriginal) * 100) : 0;

  const handleAddToCart = () => {
    onAddToCart(produit, selectedQuantity);
    onClose();
  };

  const incrementQuantity = () => {
    const maxQuantity = produit.quantite_disponible || 0;
    if (selectedQuantity < maxQuantity) {
      setSelectedQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  const isOutOfStock = (produit.quantite_disponible || 0) === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-face-left">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">

        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>

        <h1 className='text-xl font-bold text-center's>Détails d'un produits</h1>
        {/* En-tête */}
        

        <div className="flex flex-col lg:flex-row m-4 ">
          {/* Section Images - Style iPhone */}
          <div className="lg:w-1/2  rounded-2xl">
            
            <div className="relative h-96 bg-transparent p-4">
              
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt={produit.nom_produit}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  
                  {/* Navigation entre images */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-sm">Aucune image disponible</div>
                  </div>
                </div>
              )}

              {/* Badge promotion */}
              {prixPromo && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg">
                    <TagIcon className="h-4 w-4 mr-1" />
                    -{reduction}% ÉCONOMIE
                  </span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {hasMultipleImages && (
              <div className="flex justify-center space-x-3 mt-6">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`w-16 h-16 rounded-xl border-2 transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Vue ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Informations - Style iPhone */}
          <div className="lg:w-1/2 p-8 overflow-y-auto">
            <div className="space-y-2">
              {/* Titre et catégorie */}
              <div className='bg-gray-200 p-4 rounded-2xl'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">{produit.nom_produit}</h1>
                        <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {produit.categorie}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            produit.statut === 'actif' 
                              ? 'bg-green-100 text-green-800'
                              : produit.statut === 'rupture'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {produit.statut}
                          </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 ">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {produit.description || "Aucune description disponible pour ce produit."}
                      </p>
                    </div>
                </div>


                {/* Stock */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-black">Disponibilité</h4>
                      <p className={`text-lg font-bold ${
                        isOutOfStock ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {isOutOfStock ? 'Rupture de stock' : 'En stock'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-black">Quantité disponible</p>
                      <p className="text-xl font-bold text-blue-900">
                        {produit.quantite_disponible || 0} unités
                      </p>
                    </div>
                  </div>
                </div>
                
              </div>
              {/* Prix */}
              <div className="bg-gray-200 rounded-2xl py-4 px-6 font-mono w-auto min-w-56">
                <div className="space-y-2">
                  {prixPromo ? (
                    <>
                      <div className="flex items-center space-x-3">
                        
                        <h1 className="text-xl font-bold text-gray-900">
                           Prix de promotion: {prixPromo.toLocaleString('fr-FR')} Ar
                        </h1>
                        <span className="text-xl text-gray-400 line-through">
                          Prix unitaire: {prixOriginal.toLocaleString('fr-FR')} Ar
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-red-600">
                          Économisez {reduction}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      Prix unitaire: {prixOriginal.toLocaleString('fr-FR')} Ar
                    </span>
                  )}
                </div>
              </div>

              

              {/* Sélection de quantité */}
              {!isOutOfStock && (
                <div className="bg-white border-2 border-gray-400 rounded-2xl p-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Quantité</span>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={decrementQuantity}
                        disabled={selectedQuantity <= 1}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-4xl">-</span>
                      </button>
                      <span className="text-2xl font-bold w-12 text-center">
                        {selectedQuantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        disabled={selectedQuantity >= (produit.quantite_disponible || 0)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-4xl">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Prix total */}
                  <div className="border-t border-gray-400 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600 font-mono">
                        {((prixPromo || prixOriginal) * selectedQuantity).toLocaleString('fr-FR')} Ar
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton d'action */}
              <div className="space-y-3">
                {!isOutOfStock ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-800 text-white py-2 px-3 rounded-2xl font-semibold hover:bg-blue-800/60 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Plus className="h-6 w-6 mr-3" />
                    Sélectionner
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-2xl font-semibold text-lg cursor-not-allowed"
                  >
                    Produit en rupture de stock
                  </button>
                )}
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Informations produit</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Référence:</span>
                    <p className="font-medium">{produit.idProduit}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Statut:</span>
                    <p className="font-medium capitalize">{produit.statut}</p>
                  </div>
                  {produit.created_at && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Date d'ajout:</span>
                      <p className="font-medium">
                        {new Date(produit.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduitDetailModal;