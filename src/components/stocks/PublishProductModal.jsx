import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, CheckIcon, PhotoIcon, CloudArrowUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Package, DollarSign, Tag, FileText, Trash2 } from 'lucide-react';
import LogoTB from '../../assets/LogoTB.png';

const PublishProductModal = ({ stock, formData, onFormDataChange, onClose, onSubmit, error }) => {
  const [categories, setCategories] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [focusedFields, setFocusedFields] = useState({});
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);

  useEffect(() => {
    const fetchStockComplet = async () => {
      // Si on a déjà des données complètes, ne rien faire
      if (formData?.nom_produit && formData?.prix_unitaire && formData?.idCategorie) {
        console.log('✅ Données déjà complètes dans formData');
        return;
      }
      
      // Si on a un stock mais pas toutes les données, récupérer les données complètes
      if (stock?.idStock && (!formData?.idCategorie || !formData?.prix_unitaire || !formData?.nom_produit)) {
        try {
          console.log('🔄 Récupération des données complètes du stock depuis le modal...');
          const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
          const response = await fetch(`http://localhost:8000/api/stocks/${stock.idStock}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const stockComplet = await response.json();
            console.log('📦 Stock complet récupéré dans le modal:', stockComplet);
            
            // Préparer les données mises à jour
            const updatedFormData = {
              ...formData,
              // Données de base
              nom_produit: stockComplet.nom_produit || stock.nom_produit || '',
              description: stockComplet.produit?.description || stockComplet.description || stock.description || '',
              idCategorie: stockComplet.produit?.idCategorie || stockComplet.idCategorie || stock.idCategorie || '',
              prix_unitaire: stockComplet.prix_unitaire || stockComplet.produit?.prix_unitaire || stock.prix_unitaire || 0,
              prix_promotion: stockComplet.produit?.prix_promotion || stockComplet.prix_promotion || stock.prix_promotion || 0,
              // Images
              image_principale: stockComplet.produit?.image_principale || stockComplet.image_principale || stock.image_principale || formData.image_principale || '',
              images_supplementaires: stockComplet.produit?.images_supplementaires || stockComplet.images_supplementaires || stock.images_supplementaires || formData.images_supplementaires || [],
              // Données du stock
              quantite_disponible: stockComplet.quantite_disponible || stock.quantite_disponible || 0,
              stock_entree: stockComplet.stock_entree || stock.stock_entree || 0,
              quantite_reservee: stockComplet.quantite_reservee || stock.quantite_reservee || 0,
              quantite_reellement_disponible: stockComplet.quantite_reellement_disponible || stock.quantite_reellement_disponible || 0,
              code_stock: stockComplet.code_stock || stock.code_stock || '',
            };
            
            console.log('📝 FormData mis à jour avec données complètes:', updatedFormData);
            onFormDataChange(updatedFormData);
            
            // Mettre à jour aussi selectedCategoryName si on a une catégorie
            if (stockComplet.categorie) {
              setSelectedCategoryName(stockComplet.categorie);
              console.log('🏷️ Catégorie mise à jour:', stockComplet.categorie);
            } else if (stock.categorie) {
              setSelectedCategoryName(stock.categorie);
              console.log('🏷️ Catégorie du stock utilisé:', stock.categorie);
            }
          } else {
            console.warn('❌ Échec récupération stock complet, utilisation des données disponibles');
          }
        } catch (error) {
          console.error('❌ Erreur récupération stock complet dans le modal:', error);
        }
      } else {
        console.log('ℹ️ Données suffisantes ou stock non disponible');
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          console.log('📂 Catégories chargées:', data.length);
          
          // Après avoir chargé les catégories, essayer de trouver la correspondance
          if (formData?.idCategorie && data.length > 0) {
            const categoryMatch = data.find(cat => cat.idCategorie == formData.idCategorie);
            if (categoryMatch) {
              setSelectedCategoryName(categoryMatch.nom_categorie);
              console.log('✅ Catégorie correspondante trouvée:', categoryMatch.nom_categorie);
            }
          } else if (stock?.categorie && !selectedCategoryName) {
            setSelectedCategoryName(stock.categorie);
            console.log('🏷️ Catégorie du stock définie:', stock.categorie);
          }
        }
      } catch (err) {
        console.error('❌ Erreur chargement catégories:', err);
      }
    };

    // Appel des fonctions
    fetchStockComplet();
    fetchCategories();

    // Pré-remplir les images existantes si disponibles
    if (formData?.image_principale) {
      console.log('🖼️ Image principale détectée:', formData.image_principale);
      setMainImageFile({
        url: formData.image_principale,
        name: 'image_principale',
        isExisting: true
      });
    }

    // Gestion sécurisée des images supplémentaires
    try {
      const getAdditionalImages = () => {
        if (!formData?.images_supplementaires) {
          return [];
        }
        
        if (Array.isArray(formData.images_supplementaires)) {
          return formData.images_supplementaires;
        }
        
        if (typeof formData.images_supplementaires === 'string') {
          try {
            const parsed = JSON.parse(formData.images_supplementaires);
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.warn('⚠️ Impossible de parser images_supplementaires:', e);
            return [];
          }
        }
        
        return [];
      };

      const additionalImagesList = getAdditionalImages();
      console.log('🖼️ Images supplémentaires détectées:', additionalImagesList.length);
      
      if (additionalImagesList.length > 0) {
        const existingImages = additionalImagesList.map((url, index) => ({
          url: url,
          name: `image_supplementaire_${index + 1}`,
          isExisting: true
        }));
        setAdditionalImages(existingImages);
      } else {
        setAdditionalImages([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors du traitement des images:', error);
      setAdditionalImages([]);
    }

  }, [stock?.idStock, formData?.idCategorie]); // Dépendances principales

  // Fonction pour uploader une image
  const uploadImage = async (file) => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('http://localhost:8000/api/upload-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const result = await response.json();
      
      // CORRECTION : Utiliser l'URL complète si ce n'est pas déjà le cas
      let imageUrl = result.url;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `http://localhost:8000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
      
      return { ...result, url: imageUrl };
    };

  // Gestion de l'image principale
  const handleMainImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      setMainImageFile({
        file: file,
        url: URL.createObjectURL(file),
        name: file.name,
        uploadedUrl: result.url
      });
      
      onFormDataChange({
        ...formData,
        image_principale: result.url
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      alert(`Erreur lors de l'upload de ${file.name}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    onFormDataChange({
      ...formData,
      image_principale: ''
    });
  };

  // Gestion des images supplémentaires
  const handleAdditionalImagesSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + additionalImages.length > 5) {
      alert('Vous ne pouvez pas ajouter plus de 5 images supplémentaires');
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const result = await uploadImage(file);
        return {
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
          uploadedUrl: result.url
        };
      });

      const newImages = await Promise.all(uploadPromises);
      const allImages = [...additionalImages, ...newImages];
      setAdditionalImages(allImages);

      const uploadedUrls = allImages.map(img => img.uploadedUrl || img.url).filter(url => url);
      onFormDataChange({
        ...formData,
        images_supplementaires: uploadedUrls
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setIsUploading(false);
      if (additionalImagesInputRef.current) {
        additionalImagesInputRef.current.value = '';
      }
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);

    const uploadedUrls = newImages.map(img => img.uploadedUrl || img.url).filter(url => url);
    onFormDataChange({
      ...formData,
      images_supplementaires: uploadedUrls
    });
  };

  // Gestion du focus pour les inputs
  const handleFocus = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: false }));
  };

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    const updatedFormData = {
      ...formData,
      [name]: newValue
    };
    
    // Si c'est la catégorie qui change, mettre à jour le nom de catégorie
    if (name === 'idCategorie') {
      const selectedCategory = categories.find(cat => cat.idCategorie == value);
      if (selectedCategory) {
        setSelectedCategoryName(selectedCategory.nom_categorie);
      }
    }
    
    onFormDataChange(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 DONNÉES SOUMISES:', formData);
    console.log('🖼️ Image principale soumise:', formData.image_principale);
    console.log('🖼️ Images supplémentaires soumises:', formData.images_supplementaires);
    
    // Validation
    if (!formData.nom_produit || !formData.idCategorie || !formData.prix_unitaire) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (isUploading) {
      alert('Veuillez attendre la fin des uploads d\'images');
      return;
    }

    // S'assurer que les images supplémentaires sont bien un tableau
    const submitData = {
      ...formData,
      images_supplementaires: Array.isArray(formData.images_supplementaires) 
        ? formData.images_supplementaires 
        : []
    };

    console.log('🎯 DONNÉES FINALES POUR API:', submitData);
    onSubmit(submitData);
  };
  // Classes CSS réutilisables
  const inputContainerClasses = "relative mt-8";
  const inputClasses = "w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 peer";
  const labelClasses = "absolute left-4 -top-2 px-2 bg-white text-gray-600 text-sm font-medium transition-all duration-200 peer-focus:text-blue-600 peer-focus:-top-2";
  const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  // Valeurs par défaut sécurisées
  const safeFormData = formData || {};
  const safeStock = stock || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        
        {/* Header avec bouton fermeture */}
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

        {/* Titre */}
        <div className='text-center px-6'>
          <h2 className="text-2xl font-bold text-gray-900">
            Publier le Produit
          </h2>
          <p className="text-sm text-gray-600">
            Code Stock: {safeStock.code_stock || 'N/A'}
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-2 animate-shake">
              <XMarkIcon className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Informations du stock */}
          <div className="bg-gray-200 rounded-2xl mx-6 mt-4 p-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start space-x-4 w-full">
              <h3 className="text-lg font-medium mb-2 flex items-start">
                <InformationCircleIcon className="h-10 w-10 mt-0.5 flex-shrink-0" />
              </h3>
              <div className="gap-4 text-sm">
                <div className="space-x-3 flex items-center">
                  <p className="font-medium">Quantité disponible: </p>
                  <span className='text-lg text-green-600'>{safeStock.quantite_disponible || 0}</span>
                </div>
                <div className="space-x-3 flex items-center">
                  <p className="font-medium">Stock entrée: </p>
                  <span className='text-lg text-green-600'>{safeStock.stock_entree || 0}</span>
                </div>
                <div className="space-x-3 flex items-center">
                  <p className="font-medium">Quantité réservée: </p>
                  <span className='text-lg text-green-600'>{safeStock.quantite_reservee || 0}</span>
                </div>
                <div className="space-x-3 flex items-center">
                  <span className="font-medium">Disponible réel:</span>
                  <div className="text-green-600 text-lg">{safeStock.quantite_reellement_disponible || 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {/* Informations de base */}
            <div className="">
              {/* Nom du produit */}
              <div className={inputContainerClasses}>
                <div className="relative">
                  <Package className={`${iconClasses} ${focusedFields.nom_produit ? 'text-blue-500' : ''}`} size={20} />
                  <input
                    type="text"
                    value={safeFormData.nom_produit || ''}
                    onChange={handleChange}
                    name="nom_produit"
                    className={`${inputClasses} pl-12`}
                    placeholder=" "
                    onFocus={() => handleFocus('nom_produit')}
                    onBlur={() => handleBlur('nom_produit')}
                  />
                  <label className={labelClasses}>
                    Nom du Produit *
                  </label>
                </div>
              </div>

              {/* Catégorie */}
              <div className={inputContainerClasses}>
                <div className="relative">
                  <Tag className={`${iconClasses} ${focusedFields.idCategorie ? 'text-blue-500' : ''}`} size={20} />
                  <select
                    value={safeFormData.idCategorie || ''}
                    onChange={handleChange}
                    name="idCategorie"
                    className={`${inputClasses} pl-12`}
                    onFocus={() => handleFocus('idCategorie')}
                    onBlur={() => handleBlur('idCategorie')}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(category => (
                      <option key={category.idCategorie} value={category.idCategorie}>
                        {category.nom_categorie}
                      </option>
                    ))}
                  </select>
                  <label className={labelClasses}>
                    Catégorie *
                  </label>
                </div>
                {selectedCategoryName && (
                  <p className="text-xs text-blue-600 mt-2 ml-4">
                    Catégorie actuelle du stock: <strong>{selectedCategoryName}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={inputContainerClasses}>
              <div className="relative">
                <FileText className={`${iconClasses} ${focusedFields.description ? 'text-blue-500' : ''}`} size={20} />
                <textarea
                  value={safeFormData.description || ''}
                  onChange={handleChange}
                  name="description"
                  className={`${inputClasses} pl-12 resize-none`}
                  rows="3"
                  placeholder=" "
                  onFocus={() => handleFocus('description')}
                  onBlur={() => handleBlur('description')}
                />
                <label className={labelClasses}>
                  Description
                </label>
              </div>
            </div>

            {/* Prix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prix Unitaire */}
              <div className={inputContainerClasses}>
                <div className="relative">
                  <DollarSign className={`${iconClasses} ${focusedFields.prix_unitaire ? 'text-blue-500' : ''}`} size={20} />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={safeFormData.prix_unitaire || ''}
                    onChange={handleChange}
                    name="prix_unitaire"
                    className={`${inputClasses} pl-12`}
                    placeholder=" "
                    onFocus={() => handleFocus('prix_unitaire')}
                    onBlur={() => handleBlur('prix_unitaire')}
                  />
                  <label className={labelClasses}>
                    Prix Unitaire (Ar) *
                  </label>
                </div>
              </div>

              {/* Prix Promotionnel */}
              <div className={inputContainerClasses}>
                <div className="relative">
                  <Tag className={`${iconClasses} ${focusedFields.prix_promotion ? 'text-blue-800' : ''}`} size={20} />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={safeFormData.prix_promotion || ''}
                    onChange={handleChange}
                    name="prix_promotion"
                    className={`${inputClasses} pl-12`}
                    placeholder=" "
                    onFocus={() => handleFocus('prix_promotion')}
                    onBlur={() => handleBlur('prix_promotion')}
                  />
                  <label className={`${labelClasses} ${focusedFields.prix_promotion ? 'text-blue-800' : ''}`}>
                    Prix Promotionnel (Ar)
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-4">
                  Laissez vide si pas de promotion
                </p>
              </div>
            </div>

            {/* Image Principale */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <PhotoIcon className="h-5 w-5" />
                Image Principale *
              </label>
              
              <input
                type="file"
                ref={mainImageInputRef}
                onChange={handleMainImageSelect}
                accept="image/*"
                className="hidden"
              />
              
              {mainImageFile ? (
                <div className="border-2 border-green-200 rounded-2xl p-4 bg-green-50 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-20 h-20 border-2 border-gray-300 rounded-xl overflow-hidden cursor-pointer bg-white hover:shadow-lg transition-all duration-200"
                        onClick={() => window.open(mainImageFile.url, '_blank')}
                      >
                        <img 
                          src={mainImageFile.url.startsWith('http') ? mainImageFile.url : `http://localhost:8000${mainImageFile.url}`} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {mainImageFile.name}
                        </p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckIcon className="h-4 w-4" />
                          Image prête
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => mainImageInputRef.current?.click()}
                  className={`w-full border-2 border-dashed border-gray-300 rounded-2xl p-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUploading}
                >
                  <div className="flex flex-col items-center gap-3 text-gray-600">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    ) : (
                      <CloudArrowUpIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    )}
                    <span className="font-medium text-lg">
                      {isUploading ? 'Upload en cours...' : 'Cliquez pour sélectionner une image'}
                    </span>
                    <span className="text-sm text-gray-500">Ratio 4:3 recommandé</span>
                  </div>
                </button>
              )}
            </div>

            {/* Images Supplémentaires */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <PhotoIcon className="h-5 w-5" />
                Images Supplémentaires
                <span className="text-xs text-gray-500 font-normal ml-2">
                  ({additionalImages.length}/5)
                </span>
              </label>

              <input
                type="file"
                ref={additionalImagesInputRef}
                onChange={handleAdditionalImagesSelect}
                accept="image/*"
                multiple
                className="hidden"
              />

              {/* Images existantes */}
              {additionalImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {additionalImages.map((image, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-2xl p-4 bg-white group relative transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                      <div 
                        className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-xl overflow-hidden cursor-pointer mb-3 hover:shadow-md transition-all duration-200"
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        <img 
                          src={image.url.startsWith('http') ? image.url : `http://localhost:8000${image.url}`}
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
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 opacity-70 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bouton d'ajout */}
              {additionalImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => additionalImagesInputRef.current?.click()}
                  className={`w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUploading}
                >
                  <div className="flex items-center justify-center gap-3 text-gray-600">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                          <span className="text-blue-600 font-bold text-lg">+</span>
                        </div>
                        <span className="font-medium">
                          {isUploading ? 'Upload en cours...' : 'Ajouter des images supplémentaires'}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Jusqu'à {5 - additionalImages.length} image(s) supplémentaire(s) - Ratio 4:3 recommandé
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-3 hover:shadow-md"
            >
              <XMarkIcon className="h-5 w-5" />
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-800/60 font-semibold transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg transform hover:scale-105"
            >
              <CheckIcon className="h-5 w-5" />
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishProductModal;