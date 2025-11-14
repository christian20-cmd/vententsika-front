import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  XMarkIcon,
  InformationCircleIcon,
  LockClosedIcon,
  PhotoIcon,
  TrashIcon,
  CheckIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { Package, DollarSign, Tag, FileText } from 'lucide-react';
import api from '../../api/axios'; 
import LogoTB from '../../assets/LogoTB.png'

// Error Boundary SIMPLIFIÉ - Ne capture pas les erreurs mineures
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Ignorer les erreurs de DOM mineures
    if (error.message?.includes('insertBefore') || error.message?.includes('Node')) {
      console.warn('Erreur DOM mineure ignorée:', error.message);
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Seulement logger les erreurs critiques
    if (!error.message?.includes('insertBefore') && !error.message?.includes('Node')) {
      console.error('Error Boundary caught a critical error:', error, errorInfo);
    }
  }

  render() {
    return this.props.children;
  }
}

// Composant Image sécurisé
const SafeImage = ({ src, alt, className, onClick }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    console.warn('Image failed to load:', src);
    setHasError(true);
  };

  if (hasError || !imgSrc) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <PhotoIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onClick={onClick}
    />
  );
};

const ProduitForm = ({ produit, stock, categories, onClose, onSuccess, isCreation }) => {
  const [formData, setFormData] = useState({
    nom_produit: '',
    description: '',
    prix_unitaire: '',
    prix_promotion: '',
    idCategorie: '',
    idStock: '',
    image_principale: '',
    images_supplementaires: []
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [isMounted, setIsMounted] = useState(true);
  const [focusedFields, setFocusedFields] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);
  const previewUrlsRef = useRef(new Set());

  // Fonction utilitaire pour s'assurer que images_supplementaires est un tableau
  const ensureArray = (value) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        // Essayer de parser si c'est une chaîne JSON
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Si ce n'est pas du JSON valide, retourner un tableau vide
        return [];
      }
    }
    return [];
  };

  // Fonction pour créer une URL blob sécurisée
  const createPreviewUrl = useCallback((file) => {
    if (!isMounted || !file) return null;
    
    try {
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.add(url);
      return url;
    } catch (error) {
      console.error('Error creating preview URL:', error);
      return null;
    }
  }, [isMounted]);

  // Fonction pour révoquer une URL blob sécurisée
  const revokePreviewUrl = useCallback((url) => {
    if (!url || !url.startsWith('blob:')) return;
    
    try {
      URL.revokeObjectURL(url);
      previewUrlsRef.current.delete(url);
    } catch (error) {
      console.warn('Error revoking preview URL:', error);
    }
  }, []);

  // Nettoyage COMPLET au démontage
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      setIsMounted(false);
      
      // Nettoyer TOUTES les URLs blob
      previewUrlsRef.current.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            // Ignorer les erreurs de révocation
          }
        }
      });
      previewUrlsRef.current.clear();
    };
  }, []);

  // Initialisation des données - CORRIGÉ
  useEffect(() => {
    if (!isMounted) return;

    if (produit) {
      // Mode édition - CORRECTION: Utiliser ensureArray pour images_supplementaires
      const safeImagesSupplementaires = ensureArray(produit.images_supplementaires);
      
      console.log('🔧 Initialisation produit:', {
        produit,
        images_supplementaires: produit.images_supplementaires,
        safeImages: safeImagesSupplementaires
      });

      setFormData({
        nom_produit: produit.nom_produit || '',
        description: produit.description || '',
        prix_unitaire: produit.prix_unitaire || '',
        prix_promotion: produit.prix_promotion || '',
        idCategorie: produit.idCategorie || '',
        idStock: produit.idStock || '',
        image_principale: produit.image_principale || '',
        images_supplementaires: safeImagesSupplementaires
      });

      const category = categories.find(cat => cat.idCategorie == produit.idCategorie);
      setSelectedCategoryName(category?.nom_categorie || '');

      // Pré-remplir les images existantes - CORRIGÉ avec safeImagesSupplementaires
      if (produit.image_principale) {
        setMainImage({
          url: produit.image_principale,
          name: 'image_principale',
          isUploaded: true
        });
      }

      if (safeImagesSupplementaires.length > 0) {
        const additionalFiles = safeImagesSupplementaires.map((url, index) => ({
          url: url,
          name: `image_supplementaire_${index + 1}`,
          isUploaded: true
        }));
        setAdditionalImages(additionalFiles);
      }
    } else if (stock) {
      // Mode création
      const category = categories.find(cat => cat.nom_categorie === stock.categorie);
      const categoryId = category ? category.idCategorie : '';

      setFormData({
        nom_produit: stock.nom_produit || `Produit ${stock.code_stock}`,
        description: stock.description || '',
        prix_unitaire: stock.prix_unitaire?.toString() || '',
        prix_promotion: '',
        idCategorie: categoryId,
        idStock: stock.idStock,
        image_principale: '',
        images_supplementaires: []
      });

      setSelectedCategoryName(stock.categorie || 'Non catégorisé');
    }
  }, [produit, stock, categories, isMounted]);

  // Gestion du focus pour les inputs
  const handleFocus = useCallback((fieldName) => {
    if (!isMounted) return;
    setFocusedFields(prev => ({ ...prev, [fieldName]: true }));
  }, [isMounted]);

  const handleBlur = useCallback((fieldName) => {
    if (!isMounted) return;
    setFocusedFields(prev => ({ ...prev, [fieldName]: false }));
  }, [isMounted]);

  const handleChange = useCallback((e) => {
    if (!isMounted) return;

    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'idCategorie') {
      const category = categories.find(cat => cat.idCategorie == value);
      if (isMounted) {
        setSelectedCategoryName(category?.nom_categorie || '');
      }
    }
    
    if (errors[name] && isMounted) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [isMounted, categories, errors]);

  // Upload d'image via l'API media/upload
  const uploadImageFile = async (file, onProgress = null) => {
    if (!isMounted) return null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type_media', 'image');

      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });

      return response.data.media.chemin_fichier;
    } catch (error) {
      console.error('Erreur upload:', error);
      throw new Error(`Échec de l'upload de ${file.name}`);
    }
  };

  // Gestion de l'image principale - VERSION ULTRA-STABLE
  const handleMainImageSelect = async (event) => {
    if (!isMounted) return;

    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    let previewUrl = null;

    try {
      // Créer une preview
      previewUrl = createPreviewUrl(file);
      if (!previewUrl || !isMounted) {
        if (previewUrl) revokePreviewUrl(previewUrl);
        return;
      }

      // Mettre à jour l'état AVANT l'upload
      setMainImage({
        file: file,
        preview: previewUrl,
        name: file.name,
        isUploaded: false
      });

      // Uploader l'image via l'API media avec progression
      const imageUrl = await uploadImageFile(file, (progress) => {
        if (isMounted) setUploadProgress(progress);
      });
      
      // Vérifier à nouveau le montage
      if (!isMounted) {
        revokePreviewUrl(previewUrl);
        return;
      }

      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          image_principale: imageUrl
        }));
        
        setMainImage(prev => ({
          ...prev,
          url: imageUrl,
          isUploaded: true
        }));
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (isMounted) {
        setMainImage(null);
        alert(error.message);
      }
    } finally {
      if (isMounted) {
        setUploading(false);
        setUploadProgress(0);
      }
    }

    // Reset input
    event.target.value = '';
  };

  const removeMainImage = useCallback(() => {
    if (!isMounted) return;
    
    // Révoquer l'URL après un délai pour laisser le DOM se mettre à jour
    if (mainImage?.preview) {
      setTimeout(() => {
        if (isMounted) {
          revokePreviewUrl(mainImage.preview);
        }
      }, 500);
    }
    
    setMainImage(null);
    setFormData(prev => ({
      ...prev,
      image_principale: ''
    }));
  }, [isMounted, mainImage, revokePreviewUrl]);

  // Gestion des images supplémentaires - VERSION ULTRA-STABLE
  const handleAdditionalImagesSelect = async (event) => {
    if (!isMounted) return;

    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Vérifier le nombre maximum
    const remainingSlots = 5 - additionalImages.length;
    if (files.length > remainingSlots) {
      alert(`Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s)`);
      return;
    }

    setUploading(true);

    try {
      const newImages = [...additionalImages];
      const uploadPromises = [];
      
      for (const file of files.slice(0, remainingSlots)) {
        // Vérifications
        if (!file.type.startsWith('image/')) {
          console.warn(`Fichier ignoré: ${file.name} n'est pas une image`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          console.warn(`Fichier ignoré: ${file.name} dépasse 5MB`);
          continue;
        }

        // Créer preview
        const previewUrl = createPreviewUrl(file);
        if (!previewUrl || !isMounted) {
          if (previewUrl) revokePreviewUrl(previewUrl);
          continue;
        }

        const newImage = {
          file: file,
          preview: previewUrl,
          name: file.name,
          isUploaded: false
        };

        newImages.push(newImage);

        // Uploader l'image via l'API media
        const uploadPromise = uploadImageFile(file)
          .then(imageUrl => {
            if (imageUrl && isMounted) {
              const imageIndex = newImages.findIndex(img => img.preview === previewUrl);
              if (imageIndex !== -1) {
                newImages[imageIndex] = {
                  ...newImages[imageIndex],
                  url: imageUrl,
                  isUploaded: true
                };
              }
            }
          })
          .catch(error => {
            console.error(`Erreur upload ${file.name}:`, error);
            // Marquer comme erreur mais garder la preview
            const imageIndex = newImages.findIndex(img => img.preview === previewUrl);
            if (imageIndex !== -1) {
              newImages[imageIndex] = {
                ...newImages[imageIndex],
                uploadError: true
              };
            }
          });

        uploadPromises.push(uploadPromise);
      }

      // Mettre à jour l'interface immédiatement
      if (isMounted) {
        setAdditionalImages(newImages);
      }

      // Attendre que tous les uploads soient terminés
      await Promise.all(uploadPromises);

      if (isMounted) {
        // Mettre à jour les URLs dans formData
        const uploadedUrls = newImages
          .filter(img => img.isUploaded && img.url)
          .map(img => img.url);
        
        setFormData(prev => ({
          ...prev,
          images_supplementaires: uploadedUrls
        }));
      }
    } catch (error) {
      console.error('Erreur globale upload:', error);
      if (isMounted) {
        alert('Erreur lors de l\'upload des images');
      }
    } finally {
      if (isMounted) {
        setUploading(false);
      }
    }

    // Reset input
    event.target.value = '';
  };

  const removeAdditionalImage = useCallback((index) => {
    if (!isMounted) return;

    const imageToRemove = additionalImages[index];
    
    // Révoquer l'URL après un délai
    if (imageToRemove?.preview) {
      setTimeout(() => {
        if (isMounted) {
          revokePreviewUrl(imageToRemove.preview);
        }
      }, 500);
    }

    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);

    // Mettre à jour formData
    const uploadedUrls = newImages
      .filter(img => img.isUploaded && img.url)
      .map(img => img.url);
    
    setFormData(prev => ({
      ...prev,
      images_supplementaires: uploadedUrls
    }));
  }, [isMounted, additionalImages, revokePreviewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMounted) return;
  
    setSubmitLoading(true);
    setErrors({});

    try {
      // Vérifications finales
      if (!formData.idCategorie) {
        alert('Veuillez sélectionner une catégorie');
        setSubmitLoading(false);
        return;
      }

      if (isCreation && !formData.image_principale) {
        alert('Veuillez sélectionner une image principale');
        setSubmitLoading(false);
        return;
      }

      // Vérifier que tous les uploads sont terminés
      const hasUnuploadedImages = additionalImages.some(img => !img.isUploaded && !img.uploadError);
      if (hasUnuploadedImages || (mainImage && !mainImage.isUploaded)) {
        alert('Veuillez attendre la fin des uploads d\'images');
        setSubmitLoading(false);
        return;
      }

      // Vérifier s'il y a des erreurs d'upload
      const hasUploadErrors = additionalImages.some(img => img.uploadError);
      if (hasUploadErrors) {
        alert('Certaines images n\'ont pas pu être uploadées. Veuillez les retirer ou réessayer.');
        setSubmitLoading(false);
        return;
      }

      // Préparer les données selon le format du backend
      const submitData = {
        nom_produit: formData.nom_produit,
        description: formData.description,
        prix_unitaire: parseFloat(formData.prix_unitaire) || 0,
        prix_promotion: formData.prix_promotion ? parseFloat(formData.prix_promotion) : null,
        idCategorie: parseInt(formData.idCategorie),
        idStock: parseInt(formData.idStock),
        image_principale: formData.image_principale,
        images_supplementaires: ensureArray(formData.images_supplementaires) // CORRECTION: utiliser ensureArray
      };

      const url = isCreation ? '/produits' : `/produits/${produit.idProduit}`;
      const method = isCreation ? 'post' : 'put';

      await api[method](url, submitData);

      if (isMounted) {
        alert(isCreation ? 'Produit créé avec succès' : 'Produit modifié avec succès');
        onSuccess();
      }

    } catch (error) {
      console.error('Erreur soumission:', error);
      if (isMounted) {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
          alert('Veuillez corriger les erreurs dans le formulaire');
        } else if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Erreur lors de la sauvegarde du produit');
        }
      }
    } finally {
      if (isMounted) {
        setSubmitLoading(false);
      }
    }
  };

  // Classes CSS réutilisables
  const inputContainerClasses = "relative mt-8";
  const inputClasses = "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 peer";
  const readOnlyInputClasses = "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl bg-gray-100 text-gray-600 cursor-not-allowed";
  const labelClasses = "absolute left-4 -top-2 px-2 bg-white text-gray-600 text-sm font-medium transition-all duration-200 peer-focus:text-blue-600 peer-focus:-top-2";
  const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  if (!isMounted) return null;

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">

          {/* Bouton fermeture */}
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-200 place-self-end m-2 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
            disabled={submitLoading || uploading}
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4 pt-6">
            <img src={LogoTB} alt="logo" className='w-32'/>
          </div>

          {/* Titre */}
          <div className='text-center px-6'>
            <h2 className="text-xl font-bold text-gray-900">
              {isCreation ? 'Publier un nouveau produit' : 'Modifier le produit'}
            </h2>
            {isCreation && stock && (
              <p className="text-sm text-gray-600">
                Publication du stock: <strong>{stock.nom_produit || stock.code_stock}</strong>
              </p>
            )}
          </div>

          {/* Informations du stock (en mode création) */}
          {isCreation && stock && (
            <div className=" bg-gray-200 rounded-2xl mx-6 mt-4 p-4 transition-all duration-300 hover:shadow-md">
              <div className="">
                
                <div className="flex items-start space-x-4 w-full">
                  <h3 className="text-lg font-medium mb-2 flex items-start">
                    <InformationCircleIcon className="h-10 w-10 mt-0.5 flex-shrink-0" />
                   
                  </h3>
                  <div className=" gap-4 text-sm">
                    <div className="space-x-3 flex items-center">
                      <p className="font-medium">Quantité disponible: </p>
                      <span className='text-lg text-green-600'>{stock.quantite_disponible}</span>
                      
                    </div>
                    <div className="space-x-3 flex items-center">
                      <p className="font-medium">Stock entrée: </p>
                      <span className='text-lg text-green-600'>{stock.stock_entree}</span>
                      
                    </div>
                    
                    
                    <div className="space-x-3 flex items-center">
                      <p className="font-medium">Quantité réservée: </p>
                      <span className='text-lg text-green-600'>{stock.quantite_reservee}</span>
                      
                    </div>
                    <div className="space-x-3 flex items-center">
                      <span className="font-medium ">Disponible réel:</span>
                      <div className="text-green-600 text-lg">{stock.quantite_reellement_disponible}</div>
                    </div>
                  </div>
                  {stock.categorie && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-blue-100">
                      <span className="font-medium text-blue-700">Catégorie actuelle:</span>
                      <div className="text-blue-900 font-semibold">{stock.categorie}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[50vh] custom-scrollbar">
            <div className=" gap-8">
              {/* Colonne gauche - Informations de base */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  Informations du produit {isCreation && '(fixes)'}
                </h3>
                
                {isCreation ? (
                  // En mode création, afficher les champs en lecture seule avec design amélioré
                  <>
                    {/* Nom du produit */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <Package className={`${iconClasses}`} size={20} />
                        <input
                          type="text"
                          value={formData.nom_produit}
                          className={`${readOnlyInputClasses} pl-12`}
                          placeholder=" "
                          readOnly
                        />
                        <label className={labelClasses}>
                          Nom du produit *
                        </label>
                        <LockClosedIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Catégorie */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <Tag className={`${iconClasses}`} size={20} />
                        <input
                          type="text"
                          value={selectedCategoryName || 'Non catégorisé'}
                          className={`${readOnlyInputClasses} pl-12`}
                          placeholder=" "
                          readOnly
                        />
                        <label className={labelClasses}>
                          Catégorie *
                        </label>
                        <LockClosedIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Description */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <FileText className={`${iconClasses}`} size={20} />
                        <textarea
                          value={formData.description || 'Aucune description'}
                          className={`${readOnlyInputClasses} pl-12 resize-none`}
                          rows="3"
                          placeholder=" "
                          readOnly
                        />
                        <label className={labelClasses}>
                          Description
                        </label>
                        <LockClosedIcon className="absolute right-4 top-4 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Prix unitaire */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <DollarSign className={`${iconClasses}`} size={20} />
                        <input
                          type="text"
                          value={parseFloat(formData.prix_unitaire || 0).toLocaleString('fr-FR') + ' Ar'}
                          className={`${readOnlyInputClasses} pl-12`}
                          placeholder=" "
                          readOnly
                        />
                        <label className={labelClasses}>
                          Prix de vente *
                        </label>
                        <LockClosedIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </>
                ) : (
                  // En mode édition, afficher les champs modifiables
                  <>
                    {/* Nom du produit */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <Package className={`${iconClasses} ${focusedFields.nom_produit ? 'text-blue-500' : ''}`} size={20} />
                        <input
                          type="text"
                          name="nom_produit"
                          value={formData.nom_produit}
                          onChange={handleChange}
                          className={`${inputClasses} pl-12 ${errors.nom_produit ? 'border-red-500' : ''}`}
                          placeholder=" "
                          required
                          disabled={submitLoading || uploading}
                          onFocus={() => handleFocus('nom_produit')}
                          onBlur={() => handleBlur('nom_produit')}
                        />
                        <label className={`${labelClasses} ${focusedFields.nom_produit ? 'text-blue-600' : ''}`}>
                          Nom du produit *
                        </label>
                      </div>
                      {errors.nom_produit && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          {errors.nom_produit}
                        </p>
                      )}
                    </div>

                    {/* Catégorie */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <Tag className={`${iconClasses} ${focusedFields.idCategorie ? 'text-blue-500' : ''}`} size={20} />
                        <select
                          name="idCategorie"
                          value={formData.idCategorie}
                          onChange={handleChange}
                          className={`${inputClasses} pl-12 ${errors.idCategorie ? 'border-red-500' : ''}`}
                          required
                          disabled={submitLoading || uploading}
                          onFocus={() => handleFocus('idCategorie')}
                          onBlur={() => handleBlur('idCategorie')}
                        >
                          <option value="">Sélectionnez une catégorie</option>
                          {categories.map(cat => (
                            <option key={cat.idCategorie} value={cat.idCategorie}>
                              {cat.nom_categorie}
                            </option>
                          ))}
                        </select>
                        <label className={`${labelClasses} ${focusedFields.idCategorie ? 'text-blue-600' : ''}`}>
                          Catégorie *
                        </label>
                      </div>
                      {errors.idCategorie && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          {errors.idCategorie}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <FileText className={`${iconClasses} ${focusedFields.description ? 'text-blue-500' : ''}`} size={20} />
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          className={`${inputClasses} pl-12 resize-none`}
                          placeholder=" "
                          disabled={submitLoading || uploading}
                          onFocus={() => handleFocus('description')}
                          onBlur={() => handleBlur('description')}
                        />
                        <label className={`${labelClasses} ${focusedFields.description ? 'text-blue-600' : ''}`}>
                          Description
                        </label>
                      </div>
                    </div>

                    {/* Prix unitaire */}
                    <div className={inputContainerClasses}>
                      <div className="relative">
                        <DollarSign className={`${iconClasses} ${focusedFields.prix_unitaire ? 'text-blue-500' : ''}`} size={20} />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          name="prix_unitaire"
                          value={formData.prix_unitaire}
                          onChange={handleChange}
                          className={`${inputClasses} pl-12 ${errors.prix_unitaire ? 'border-red-500' : ''}`}
                          placeholder=" "
                          required
                          disabled={submitLoading || uploading}
                          onFocus={() => handleFocus('prix_unitaire')}
                          onBlur={() => handleBlur('prix_unitaire')}
                        />
                        <label className={`${labelClasses} ${focusedFields.prix_unitaire ? 'text-blue-600' : ''}`}>
                          Prix de vente (Ar) *
                        </label>
                      </div>
                      {errors.prix_unitaire && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          {errors.prix_unitaire}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Colonne droite - Prix promotionnel et Images */}
              <div className="space-y-3 mt-6 ">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Tag size={20} />
                  Personnalisation
                </h3>

                {/* Prix promotionnel */}
                <div className={inputContainerClasses}>
                  <div className="relative">
                    <Tag className={`${iconClasses} ${focusedFields.prix_promotion ? 'text-blue-800' : ''}`} size={20} />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="prix_promotion"
                      value={formData.prix_promotion}
                      onChange={handleChange}
                      className={`${inputClasses} pl-12`}
                      placeholder=" "
                      disabled={submitLoading || uploading}
                      onFocus={() => handleFocus('prix_promotion')}
                      onBlur={() => handleBlur('prix_promotion')}
                    />
                    <label className={`${labelClasses} ${focusedFields.prix_promotion ? 'text-blue-600' : ''}`}>
                      Prix promotionnel (Ar)
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-4">
                    Laissez vide si pas de promotion
                  </p>
                </div>

                {/* Image principale */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                    <PhotoIcon className="h-5 w-5" />
                    Image principale {isCreation && '*'}
                  </label>
                  
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    onChange={handleMainImageSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={uploading || submitLoading}
                  />
                  
                  {mainImage ? (
                    <div className="border-2 border-green-200 rounded-2xl p-4 bg-green-50 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-20 h-20 border-2 border-gray-300 rounded-xl overflow-hidden cursor-pointer bg-white hover:shadow-lg transition-all duration-200"
                            onClick={() => window.open(mainImage.preview || mainImage.url, '_blank')}
                          >
                            <SafeImage
                              src={mainImage.preview || mainImage.url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {mainImage.name}
                            </p>
                            <p className="text-sm text-green-600 flex items-center gap-1">
                              {mainImage.isUploaded ? (
                                <>
                                  <CheckIcon className="h-4 w-4" />
                                  Image prête
                                </>
                              ) : uploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                  Upload {uploadProgress}%
                                </>
                              ) : (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                                  En attente...
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeMainImage}
                          disabled={uploading || submitLoading}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => mainImageInputRef.current?.click()}
                      disabled={uploading || submitLoading}
                      className={`w-full border-2 border-dashed border-gray-300 rounded-2xl p-2 hover:border-blue-800 hover:bg-blue-50 transition-all duration-200 group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-3 text-gray-600">
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800"></div>
                            <span className="text-sm">Upload en cours...</span>
                          </div>
                        ) : (
                          <>
                            <CloudArrowUpIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                            <span className="font-medium text-lg">Cliquez pour sélectionner une image</span>
                            <span className="text-sm text-gray-500">Ratio 4:3 recommandé - Max 5MB</span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>

                {/* Images supplémentaires */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center gap-2">
                    <PhotoIcon className="h-5 w-5" />
                    Images supplémentaires
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      ({additionalImages.length}/5)
                    </span>
                  </label>

                  <input
                    ref={additionalImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesSelect}
                    className="hidden"
                    disabled={uploading || additionalImages.length >= 5 || submitLoading}
                  />

                  {/* Images existantes */}
                  {additionalImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {additionalImages.map((image, index) => (
                        <div key={index} className={`border-2 rounded-2xl p-3 group relative transition-all duration-300 hover:shadow-lg ${
                          image.uploadError ? 'border-red-300 bg-red-50' : 
                          image.isUploaded ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                        }`}>
                          <div 
                            className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-xl overflow-hidden cursor-pointer mb-2 hover:shadow-md transition-all duration-200"
                            onClick={() => window.open(image.preview || image.url, '_blank')}
                          >
                            <SafeImage
                              src={image.preview || image.url}
                              alt={`Supplementaire ${index + 1}`}
                              className="w-full h-20 object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-700 truncate flex-1 mr-2">
                              {image.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              disabled={uploading || submitLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 opacity-70 group-hover:opacity-100"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          {uploading && !image.isUploaded && !image.uploadError && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                          )}
                          {image.uploadError && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-80 rounded-xl flex items-center justify-center">
                              <span className="text-white text-xs font-bold text-center">Erreur upload</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bouton d'ajout */}
                  {additionalImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => additionalImagesInputRef.current?.click()}
                      disabled={uploading || submitLoading}
                      className={`w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-center gap-3 text-gray-600">
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="font-medium">Upload en cours...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                              <span className="text-blue-600 font-bold text-lg">+</span>
                            </div>
                            <span className="font-medium">Ajouter des images supplémentaires</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Jusqu'à {5 - additionalImages.length} image(s) supplémentaire(s) - Max 5MB par image
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6 ">
              <button
                type="button"
                onClick={onClose}
                disabled={submitLoading || uploading}
                className="flex-1 px-3 py-2  bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-3  disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitLoading || uploading}
                className="flex-1 px-3 py-2 bg-blue-800 text-white rounded-xl hover:bg-blue-800/60 transition-all duration-200 font-medium flex items-center justify-center gap-3 hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
              >
                {submitLoading || uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <CheckIcon className="h-5 w-5" />
                )}
                {submitLoading || uploading ? 'Traitement...' : (isCreation ? 'Publier le produit' : 'Modifier')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProduitForm;