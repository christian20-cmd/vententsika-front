// produits.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  PlusIcon,
  ShoppingCartIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  TrashIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  CheckBadgeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ProduitFilter from '../components/produits/ProduitFilter';
import ProduitList from '../components/produits/ProduitList';
import StockSelector from '../components/stocks/StockSelector';
import PublishProductModal from '../components/stocks/PublishProductModal';
import ProduitDetailModal from '../components/produits/ProduitDetailModal';
import ProduitForm from '../components/produits/ProduitForm';
import ToastContainer from '../components/common/ToastContainer';
import ConfirmationModal from '../components/common/ConfirmationModal';
import api from '../api/axios';
import LogoTB from '../assets/LogoTB.png'
import { Inbox } from 'lucide-react';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [stocksDisponibles, setStocksDisponibles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduitDetail, setSelectedProduitDetail] = useState(null);
  const [error, setError] = useState('');

  // NOUVEAUX ÉTATS POUR PUBLICATION
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishFormData, setPublishFormData] = useState(null);

  // ÉTAT POUR LA SÉLECTION DE PRODUITS
  const [produitsSelectionnes, setProduitsSelectionnes] = useState([]);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  const [commandeDuplication, setCommandeDuplication] = useState(null);

  // ÉTATS POUR LES NOTIFICATIONS TOAST
  const [notifications, setNotifications] = useState([]);

  // ÉTATS POUR LES MODALES DE CONFIRMATION
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null,
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    isLoading: false
  });

  const navigate = useNavigate();

  // NOUVEAUX ÉTATS POUR LE MODAL GLISSABLE
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isModalMinimized, setIsModalMinimized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const modalRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [produitToEdit, setProduitToEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // FONCTIONS POUR LES NOTIFICATIONS TOAST
  const showNotification = (title, message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      title,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // FONCTIONS POUR LES MODALES DE CONFIRMATION
  const showConfirmation = (config) => {
    setConfirmationModal({
      isOpen: true,
      type: 'warning',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      isLoading: false,
      ...config
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = async () => {
    if (confirmationModal.onConfirm) {
      setConfirmationModal(prev => ({ ...prev, isLoading: true }));
      try {
        await confirmationModal.onConfirm();
        closeConfirmation();
      } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
        setConfirmationModal(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  // FONCTION POUR L'ÉDITION DE PRODUIT
  const handleEditProduit = (produit) => {
    console.log('🔄 Début de la fonction handleEditProduit');
    console.log('📝 Produit à modifier:', produit);
    
    if (!produit) {
      console.error('❌ Erreur: Produit non défini');
      showNotification('Erreur', 'Produit non trouvé', 'error');
      return;
    }

    if (!produit.idProduit) {
      console.error('❌ Erreur: ID du produit manquant');
      showNotification('Erreur', 'ID du produit manquant', 'error');
      return;
    }

    console.log('✅ Données du produit à éditer:');
    console.log('- ID:', produit.idProduit);
    console.log('- Nom:', produit.nom_produit);
    console.log('- Prix:', produit.prix_unitaire);
    console.log('- Catégorie:', produit.categorie);
    console.log('- Statut:', produit.statut);
    console.log('- Stock:', produit.quantite_reellement_disponible);
    console.log('- Image principale:', produit.image_principale);
    console.log('- Médias:', produit.medias);

    setProduitToEdit(produit);
    setShowEditModal(true);
    console.log('✅ Modal d\'édition ouvert avec succès');
  };

  // FONCTION POUR FERMER LE MODAL D'ÉDITION
  const handleCloseEditModal = () => {
    console.log('🔄 Fermeture du modal d\'édition');
    setShowEditModal(false);
    setProduitToEdit(null);
    setEditLoading(false);
  };

  useEffect(() => {
    console.log('📊 Statistiques des produits:', {
      total: produits.length,
      actif: produits.filter(p => p.statut === 'actif').length,
      rupture: produits.filter(p => p.statut === 'rupture').length,
      inactif: produits.filter(p => p.statut === 'inactif').length,
      tousLesStatuts: [...new Set(produits.map(p => p.statut))]
    });
  }, [produits]);

  // FONCTION POUR SAUVEGARDER LES MODIFICATIONS
  const handleSaveEdit = async (formData) => {
    console.log('🔄 Début de la sauvegarde des modifications');
    console.log('📝 Données du formulaire:', formData);
    
    if (!produitToEdit) {
      console.error('❌ Erreur: Aucun produit à modifier');
      showNotification('Erreur', 'Aucun produit sélectionné', 'error');
      return;
    }

    setEditLoading(true);

    try {
      console.log('📤 Envoi de la requête PUT vers l\'API...');
      
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/produits/${produitToEdit.idProduit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('✅ Réponse reçue:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Produit modifié avec succès:', result);
        
        showNotification('Succès', 'Produit modifié avec succès!', 'success');
        handleCloseEditModal();
        
        console.log('🔄 Rechargement de la liste des produits...');
        await fetchProduits();
        
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        showNotification('Erreur', errorData.message || 'Erreur lors de la modification', 'error');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      showNotification('Erreur', 'Erreur lors de la modification du produit', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // FONCTIONS POUR LE DRAG & DROP
  const handleMouseDown = (e) => {
    if (!modalRef.current) return;
    
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return;
    }
    
    setIsDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!isDragging || !modalRef.current) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - modalRef.current.offsetWidth;
      const maxY = window.innerHeight - modalRef.current.offsetHeight;

      setModalPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragOffset]);

  // SAUVEGARDER LES PRODUITS SÉLECTIONNÉS DANS LOCALSTORAGE
  useEffect(() => {
    if (produitsSelectionnes.length > 0) {
      localStorage.setItem('produitsSelectionnes', JSON.stringify(produitsSelectionnes));
    } else {
      localStorage.removeItem('produitsSelectionnes');
    }
  }, [produitsSelectionnes]);

  // SAUVEGARDER LE CLIENT SÉLECTIONNÉ
  useEffect(() => {
    if (selectedClient) {
      localStorage.setItem('selectedClient', JSON.stringify(selectedClient));
    } else {
      localStorage.removeItem('selectedClient');
    }
  }, [selectedClient]);

  // Vérifier la duplication au chargement
  useEffect(() => {
    console.log('✅ Chargement des données produits...');
    fetchInitialData();
    
    const donneesDuplication = localStorage.getItem('commandeDuplication');
    if (donneesDuplication) {
      try {
        const duplicationData = JSON.parse(donneesDuplication);
        setCommandeDuplication(duplicationData.commandeADupliquer);
        
        if (duplicationData.commandeADupliquer?.produits) {
          const produitsAvecQuantite = duplicationData.commandeADupliquer.produits.map(produit => {
            const prix = produit.prix_promotion && produit.prix_promotion > 0 ? produit.prix_promotion : produit.prix_unitaire;
            return {
              ...produit,
              quantite: produit.quantite,
              prix_total: produit.quantite * prix
            };
          });
          setProduitsSelectionnes(produitsAvecQuantite);
        }

        if (duplicationData.commandeADupliquer?.client) {
          setSelectedClient(duplicationData.commandeADupliquer.client);
        }

        localStorage.removeItem('commandeDuplication');
      } catch (e) {
        console.error('Erreur parsing duplication data:', e);
      }
    }

    const clientPreselectionne = localStorage.getItem('selectedClientForOrder');
    if (clientPreselectionne) {
      try {
        const clientInfo = JSON.parse(clientPreselectionne);
        setSelectedClient(clientInfo);
        localStorage.removeItem('selectedClientForOrder');
      } catch (e) {
        console.error('Erreur parsing client data:', e);
      }
    }
  }, []);

  // FONCTIONS POUR LA PAGINATION
  const totalPages = Math.ceil(produitsSelectionnes.length / itemsPerPage);
  
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return produitsSelectionnes.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // FONCTION POUR RÉDUIRE/AGRANDIR LE MODAL
  const toggleMinimize = () => {
    setIsModalMinimized(!isModalMinimized);
  };

  const toggleSelectionPanel = () => {
    setShowSelectionPanel(!showSelectionPanel);
    if (!showSelectionPanel) {
      setModalPosition({ x: 0, y: 0 });
      setIsModalMinimized(false);
      setCurrentPage(1);
    }
  }

  // Fonction pour récupérer les données initiales
  const fetchInitialData = async () => {
    try {
      console.log('📦 Début du chargement des données...');
      await Promise.all([
        fetchProduits(),
        fetchCategories(),
        fetchStocksDisponibles()
      ]);
      console.log('✅ Données chargées avec succès');
      showNotification('Chargement terminé', 'Les produits ont été chargés avec succès', 'success', 3000);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données initiales:', error);
      setError('Erreur lors du chargement des données');
      showNotification('Erreur', 'Erreur lors du chargement des données', 'error');
    }
  };

  // Fonction fetchProduits
  const fetchProduits = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetch produits en cours...');
      
      const response = await api.get('/produits');
      console.log('✅ Réponse API produits:', response);
      
      let produitsData = [];
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        produitsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        produitsData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        produitsData = response.data.data;
      } else if (response.data && Array.isArray(response.data.produits)) {
        produitsData = response.data.produits;
      }
      
      console.log(`📦 ${produitsData.length} produits chargés`);
      setProduits(produitsData);
      
    } catch (err) {
      console.error('❌ Erreur fetchProduits:', err);
      console.error('❌ Détails erreur:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Erreur lors du chargement des produits');
      setProduits([]);
      showNotification('Erreur', 'Erreur lors du chargement des produits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetch catégories en cours...');
      const response = await api.get('/categories');
      console.log('✅ Réponse API catégories:', response);
      
      let categoriesData = [];
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      }
      
      console.log(`📦 ${categoriesData.length} catégories chargées`);
      setCategories(categoriesData);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des catégories:', error);
      setCategories([]);
    }
  };

  const fetchStocksDisponibles = async () => {
    try {
      console.log('🔄 Fetch stocks non publiés en cours...');
      const response = await api.get('/stocks/non-publies');
      console.log('✅ Réponse API stocks non publiés:', response);
      
      let stocksData = [];
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        stocksData = response.data.data;
      } else if (Array.isArray(response.data)) {
        stocksData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        stocksData = response.data.data;
      } else if (response.data && Array.isArray(response.data.stocks)) {
        stocksData = response.data.stocks;
      }
      
      console.log(`📦 ${stocksData.length} stocks non publiés chargés:`, stocksData);
      setStocksDisponibles(stocksData);
      
      if (stocksData.length === 0) {
        console.warn('⚠️ Aucun stock disponible - Vérifiez votre API /stocks/non-publies');
        showNotification('Stock requis', 'Créez des stocks dans l\'inventaire avant de publier des produits', 'warning', 5000);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stocks non publiés:', error);
      console.error('Détails erreur:', error.response?.data || error.message);
      setStocksDisponibles([]);
    }
  };

  // NOUVELLES FONCTIONS POUR LA PUBLICATION
  const handleCreateProduit = () => {
    if (!Array.isArray(stocksDisponibles) || stocksDisponibles.length === 0) {
      showNotification('Stock requis', 'Créez des stocks dans l\'inventaire avant de publier des produits', 'warning', 5000);
      return;
    }
    
    setSelectedStock(null);
    setShowStockSelector(true);
  };

  const handleStockSelect = (stock) => {
    console.log('🔄 Stock sélectionné:', stock);
    
    setSelectedStock(stock);
    setShowStockSelector(false);
    
    const initialFormData = {
      idStock: stock.idStock,
      nom_produit: stock.nom_produit || '',
      description: stock.produit?.description || stock.description || '',
      idCategorie: stock.produit?.idCategorie || stock.idCategorie || '',
      categorie: stock.categorie || '',
      prix_unitaire: stock.prix_unitaire || 0,
      prix_promotion: stock.produit?.prix_promotion || stock.prix_promotion || 0,
      image_principale: stock.produit?.image_principale || stock.image_principale || '',
      images_supplementaires: stock.produit?.images_supplementaires || stock.images_supplementaires || [],
      quantite_disponible: stock.quantite_disponible || 0,
      stock_entree: stock.stock_entree || 0,
      quantite_reservee: stock.quantite_reservee || 0,
      quantite_reellement_disponible: stock.quantite_reellement_disponible || 0,
      code_stock: stock.code_stock || '',
      produit: stock.produit || null
    };
    
    console.log('📝 FormData préparé pour publication:', initialFormData);
    
    setPublishFormData(initialFormData);
    setShowPublishModal(true);
  };

  const handleClosePublishModal = () => {
    setShowPublishModal(false);
    setPublishFormData(null);
    setSelectedStock(null);
  };

  const handlePublishFormDataChange = (newFormData) => {
    setPublishFormData(newFormData);
  };

  const handlePublishSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/produits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification('Succès', 'Produit publié avec succès!', 'success');
        handleClosePublishModal();
        fetchProduits();
        fetchStocksDisponibles();
      } else {
        const errorData = await response.json();
        showNotification('Erreur', errorData.message || 'Erreur lors de la publication', 'error');
      }
    } catch (error) {
      console.error('Erreur publication:', error);
      showNotification('Erreur', 'Erreur lors de la publication du produit', 'error');
    }
  };

  const handleCloseStockSelector = () => {
    setShowStockSelector(false);
  };

  // FONCTION AMÉLIORÉE POUR LA SUPPRESSION AVEC CONFIRMATION
  const handleDeleteProduit = (idProduit) => {
    const produit = produits.find(p => p.idProduit === idProduit);
    const produitName = produit?.nom_produit || 'ce produit';
    
    showConfirmation({
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer "${produitName}" ? Cette action est irréversible.`,
      type: 'warning',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          await api.delete(`/produits/${idProduit}`);
          showNotification('Succès', `${produitName} a été supprimé avec succès`, 'success');
          fetchProduits();
        } catch (error) {
          console.error('Erreur suppression:', error);
          showNotification('Erreur', 'Erreur lors de la suppression du produit', 'error');
          throw error;
        }
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR VIDER LA SÉLECTION AVEC CONFIRMATION
  const handleViderSelection = () => {
    if (produitsSelectionnes.length === 0) return;

    showConfirmation({
      title: 'Vider le panier',
      message: `Êtes-vous sûr de vouloir vider le panier ? ${produitsSelectionnes.length} produit(s) seront retirés.`,
      type: 'warning',
      confirmText: 'Vider',
      cancelText: 'Annuler',
      onConfirm: () => {
        showNotification('Panier vidé', 'Tous les produits ont été retirés du panier', 'info');
        setProduitsSelectionnes([]);
        setSelectedClient(null);
        setShowSelectionPanel(false);
        setCommandeDuplication(null);
        
        localStorage.removeItem('produitsSelectionnes');
        localStorage.removeItem('selectedClient');
        localStorage.removeItem('commandeDuplication');
        localStorage.removeItem('selectedClientForOrder');
      }
    });
  };

  // FONCTIONS POUR LA GESTION DE LA SÉLECTION DE PRODUITS
  const ajouterProduitSelectionne = (produit, quantite = 1) => {
    const quantiteDisponible = produit.quantite_reellement_disponible || 0;
    
    const existingItem = produitsSelectionnes.find(item => item.idProduit === produit.idProduit);
    
    if (existingItem) {
      const nouvelleQuantite = existingItem.quantite + quantite;
      if (nouvelleQuantite > quantiteDisponible) {
        showNotification('Stock insuffisant', `Il ne reste que ${quantiteDisponible} unités disponibles pour ${produit.nom_produit}`, 'warning');
        return;
      }
      
      const prix = produit.prix_promotion && produit.prix_promotion > 0 ? produit.prix_promotion : produit.prix_unitaire;
      
      setProduitsSelectionnes(produitsSelectionnes.map(item =>
        item.idProduit === produit.idProduit
          ? { 
              ...item, 
              quantite: nouvelleQuantite,
              prix_total: nouvelleQuantite * prix
            }
          : item
      ));

      showNotification('Panier mis à jour', `${produit.nom_produit} - Quantité: ${nouvelleQuantite}`, 'cart', 2000);
    } else {
      if (quantite > quantiteDisponible) {
        showNotification('Stock insuffisant', `Il ne reste que ${quantiteDisponible} unités disponibles pour ${produit.nom_produit}`, 'warning');
        return;
      }
      
      const prix = produit.prix_promotion && produit.prix_promotion > 0 ? produit.prix_promotion : produit.prix_unitaire;
      
      setProduitsSelectionnes([...produitsSelectionnes, { 
        ...produit, 
        quantite: quantite,
        prix_unitaire: produit.prix_unitaire,
        prix_promotion: produit.prix_promotion,
        prix_total: quantite * prix
      }]);

      showNotification('Produit ajouté', `${produit.nom_produit} a été ajouté au panier`, 'cart', 2000);
    }

    const button = document.querySelector(`[data-product-id="${produit.idProduit}"]`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        button.classList.remove('animate-pulse');
      }, 500);
    }
  };

  const retirerProduitSelectionne = (produitId) => {
    const produit = produitsSelectionnes.find(item => item.idProduit === produitId);
    
    showConfirmation({
      title: 'Retirer le produit',
      message: `Êtes-vous sûr de vouloir retirer "${produit?.nom_produit}" du panier ?`,
      type: 'warning',
      confirmText: 'Retirer',
      cancelText: 'Annuler',
      onConfirm: () => {
        setProduitsSelectionnes(produitsSelectionnes.filter(item => item.idProduit !== produitId));
        if (produit) {
          showNotification('Produit retiré', `${produit.nom_produit} a été retiré du panier`, 'info', 2000);
        }
      }
    });
  };

  const modifierQuantiteSelectionnee = (produitId, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) {
      retirerProduitSelectionne(produitId);
      return;
    }

    const produitOriginal = produits.find(p => p.idProduit === produitId);
    const quantiteDisponible = produitOriginal?.quantite_reellement_disponible || 0;
      
    if (nouvelleQuantite > quantiteDisponible) {
      showNotification('Stock insuffisant', `Il ne reste que ${quantiteDisponible} unités disponibles`, 'warning');
      return;
    }

    setProduitsSelectionnes(produitsSelectionnes.map(item => {
      if (item.idProduit === produitId) {
        const prix = item.prix_promotion && item.prix_promotion > 0 ? item.prix_promotion : item.prix_unitaire;
        return { 
          ...item, 
          quantite: nouvelleQuantite,
          prix_total: nouvelleQuantite * prix
        };
      }
      return item;
    }));
  };

  const retirerClient = () => {
    if (!selectedClient) return;

    showConfirmation({
      title: 'Retirer le client',
      message: `Êtes-vous sûr de vouloir retirer "${selectedClient.nom_prenom_client}" de la commande ?`,
      type: 'warning',
      confirmText: 'Retirer',
      cancelText: 'Annuler',
      onConfirm: () => {
        showNotification('Client retiré', `${selectedClient.nom_prenom_client} a été retiré`, 'user');
        setSelectedClient(null);
        localStorage.removeItem('selectedClient');
      }
    });
  };

  const totalSelection = produitsSelectionnes.reduce((total, item) => {
    const prix = item.prix_promotion && item.prix_promotion > 0 ? item.prix_promotion : item.prix_unitaire;
    return total + (prix * item.quantite);
  }, 0);

  // FONCTIONS POUR LA GESTION DES CLIENTS
  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await api.get('/clients');
      
      let clientsData = [];
      
      if (response.data && Array.isArray(response.data)) {
        clientsData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        clientsData = response.data.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        clientsData = response.data.data;
      }
      
      setClients(clientsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      showNotification('Erreur', 'Erreur lors du chargement des clients', 'error');
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const ouvrirSelectionClient = () => {
    if (produitsSelectionnes.length === 0) {
      showNotification('Action requise', 'Veuillez d\'abord sélectionner des produits', 'warning');
      return;
    }
    fetchClients();
    setShowClientSelection(true);
  };

  const selectionnerClient = (client) => {
    setSelectedClient(client);
    setShowClientSelection(false);
    showNotification('Client sélectionné', `${client.nom_prenom_client} a été sélectionné`, 'user');
  };

  const creerNouveauClient = () => {
    window.location.href = '/clients?action=add';
  };

  const naviguerVersCommandes = () => {
    if (!selectedClient) {
      showNotification('Action requise', 'Veuillez sélectionner un client avant de créer la commande', 'warning');
      return;
    }

    if (produitsSelectionnes.length === 0) {
      showNotification('Action requise', 'Aucun produit sélectionné', 'warning');
      return;
    }

    const commandeData = {
      client: selectedClient,
      produits: produitsSelectionnes,
      total: totalSelection,
      timestamp: new Date().getTime()
    };

    localStorage.setItem('commandeEnPreparation', JSON.stringify(commandeData));
    showNotification('Création de commande', 'Redirection vers la création de commande...', 'info', 2000);
    
    setTimeout(() => {
      navigate('/commandes?action=create');
    }, 1000);
  };

  const handleViewDetail = (produit) => {
    console.log('Voir détail:', produit);
    setSelectedProduitDetail(produit);
  };

  const handleAddToCart = (produit, quantite = 1) => {
    console.log('Ajouter au panier:', produit, quantite);
    ajouterProduitSelectionne(produit, quantite);
  };

  // Filtrage des produits
  const filteredProduits = Array.isArray(produits) 
    ? produits.filter(produit => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' || 
          (produit.nom_produit && produit.nom_produit.toLowerCase().includes(searchLower)) ||
          (produit.description && produit.description.toLowerCase().includes(searchLower));
        
        if (searchTerm && !matchesSearch) return false;
        
        switch (filter) {
          case 'promotion':
            return produit.prix_promotion && produit.prix_promotion > 0;
          case 'actif':
            return produit.statut === 'actif';
          case 'inactif':
            return produit.statut === 'inactif';
          case 'rupture':
            return produit.statut === 'rupture';
          default:
            return true;
        }
      })
    : [];

  // Composant de chargement squelette
  const ProduitsSkeletonLoading = () => {
    return (
      <div className="min-h-screen p-4">
        {/* En-tête Skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-300 rounded w-64 shimmer-animation"></div>
              <div className="h-4 bg-gray-300 rounded w-96 shimmer-animation"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 bg-gray-300 rounded-xl w-40 shimmer-animation"></div>
              <div className="h-12 bg-gray-300 rounded-xl w-40 shimmer-animation"></div>
            </div>
          </div>

          {/* Filtres Skeleton */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 shimmer-animation"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/2 shimmer-animation"></div>
                    </div>
                    <div className="p-3 rounded-full bg-gray-300 shimmer-animation">
                      <div className="h-6 w-6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 flex items-center gap-4">
                <div className="h-12 bg-gray-300 rounded-xl w-96 shimmer-animation"></div>
                <div className="h-12 bg-gray-300 rounded-xl w-32 shimmer-animation"></div>
              </div>
              <div className="h-12 bg-gray-300 rounded-xl w-24 shimmer-animation"></div>
            </div>
          </div>
        </div>

        {/* Grille de produits Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-2xl shadow-gray-600 p-4 relative overflow-hidden">
              <div className="w-full aspect-[4/3] rounded-2xl mb-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shimmer-animation"></div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="h-5 bg-gray-300 rounded w-2/3 shimmer-animation"></div>
                  <div className="w-12 h-5 bg-gray-300 rounded-full shimmer-animation"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-full shimmer-animation"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 shimmer-animation"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-16 shimmer-animation"></div>
                  <div className="w-16 h-5 bg-gray-300 rounded-full shimmer-animation"></div>
                </div>
                
                <div className="h-10 bg-gray-300 rounded-xl shimmer-animation"></div>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          .shimmer-animation {
            animation: shimmer 2s infinite linear;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 1000px 100%;
            position: relative;
            overflow: hidden;
          }
          .shimmer-animation::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    );
  };

  if (loading) {
    return <ProduitsSkeletonLoading />;
  }

  return (
    <div className="min-h-screen">
      {/* Container pour les notifications Toast */}
      <ToastContainer 
        notifications={notifications} 
        onClose={closeNotification} 
      />

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        isLoading={confirmationModal.isLoading}
      />

      <div className="max-w-full mx-auto py-4">
        {/* En-tête */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Catalogue des Produits</h1>
              <p className="text-gray-600">
                Sélectionnez les produits pour créer une commande ({produits.length} produit{produits.length !== 1 ? 's' : ''})
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              
              <button
                onClick={toggleSelectionPanel}
                className={`inline-flex items-center px-3 py-2 rounded-2xl shadow-sm text-sm font-semibold transition-all duration-300 ${
                  produitsSelectionnes.length > 0
                    ? 'bg-blue-800 text-white shadow-lg hover:shadow-xl hover:bg-blue-800'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                Groupe de Commande
                {produitsSelectionnes.length > 0 && (
                  <span className="ml-2 bg-white text-blue-700 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    {produitsSelectionnes.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleCreateProduit}
                disabled={!Array.isArray(stocksDisponibles) || stocksDisponibles.length === 0}
                className="inline-flex items-center px-3 py-2 bg-blue-800 rounded-xl shadow-lg text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Publier un produit
                {Array.isArray(stocksDisponibles) && stocksDisponibles.length > 0 && (
                  <span className="ml-2 bg-white text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                    {stocksDisponibles.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm font-medium">
              <strong>Erreur:</strong> {error}
              <button 
                onClick={fetchInitialData}
                className="ml-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </p>
          </div>
        )}

        <div className="flex gap-6">
          <div className="flex-1">
            <ProduitFilter
              filter={filter}
              setFilter={setFilter}
              produits={Array.isArray(produits) ? produits : []}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <ProduitList
              produits={filteredProduits}
              onEdit={handleEditProduit}
              onDelete={handleDeleteProduit}
              onAddToCart={handleAddToCart}
              onViewDetail={handleViewDetail}
            />

            {/* StockSelector */}
            {showStockSelector && (
              <StockSelector
                stocks={Array.isArray(stocksDisponibles) ? stocksDisponibles : []}
                onSelect={handleStockSelect}
                onClose={handleCloseStockSelector}
              />
            )}

            {/* PublishProductModal */}
            {showPublishModal && selectedStock && (
              <PublishProductModal
                stock={selectedStock}
                formData={publishFormData}
                onFormDataChange={handlePublishFormDataChange}
                onClose={handleClosePublishModal}
                onSubmit={handlePublishSubmit}
                error={null}
              />
            )}

            {showEditModal && produitToEdit && (
              <ProduitForm
                produit={produitToEdit}
                categories={categories}
                onClose={handleCloseEditModal}
                onSuccess={handleSaveEdit}
                isCreation={false}
                loading={editLoading}
              />
            )}
          </div>
        </div>

        {/* Modal de sélection des produits */}
        {showSelectionPanel && (
          <div 
            ref={modalRef}
            className={`fixed z-50 mt-4 ml-28 ${
              isModalMinimized ? 'w-80 h-16' : 'w-96 max-h-[80vh]'
            } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className={`bg-white shadow-2xl shadow-black rounded-3xl transform transition-all duration-300 flex flex-col ${
              isModalMinimized ? 'h-12 w-20 overflow-hidden' : 'max-h-[80vh]'
            }`}>

              {/* Bouton Réduire/Agrandir */}
              <div className='flex place-self-end m-2'>
                <button
                  onClick={toggleMinimize}
                  className="w-8 h-8 flex items-center justify-center text-back hover:text-gray-700 transition-colors"
                  title={isModalMinimized ? "Agrandir" : "Réduire"}
                >
                  {isModalMinimized ? (
                    <PlusCircleIcon className="h-6 w-6" />
                  ) : (
                    <MinusCircleIcon className="h-6 w-6" />
                  )}
                </button>
                {/* Bouton fermer */}
                <button
                  onClick={toggleSelectionPanel}
                  className="w-8 h-8 flex items-center justify-center text-black hover:text-red-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Header */}
              <div className="flex-shrink-0 relative">
                <div className="flex justify-between items-center p-4 pb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    {!isModalMinimized && (
                      <>
                        <div className="flex justify-center flex-1">
                          <img src={LogoTB} alt="logo" className="w-32" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {!isModalMinimized && (
                  <div className="text-center px-4 pb-4">
                    <h3 className="font-bold text-xl">
                      {commandeDuplication ? 'Duplication de commande' : 'Groupe de commande'}
                    </h3>
                    {commandeDuplication && (
                      <p className="text-sm text-blue-600 font-medium">
                        Commande #{commandeDuplication.numero_commande}
                      </p>
                    )}
                    <p className="text-gray-700 text-sm opacity-90">
                      {produitsSelectionnes.length} article{produitsSelectionnes.length !== 1 ? 's' : ''} sélectionné{produitsSelectionnes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Body */}
              {!isModalMinimized && (
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
                  {produitsSelectionnes.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
                        <Inbox className="h-14 w-14 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium mb-1">😏Pas de sélection</p>
                      <p className="text-gray-400 text-sm">Ajoutez des produits pour commencer</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 py-2">
                        {getCurrentPageItems().map((item, index) => {
                          const prix = item.prix_promotion && item.prix_promotion > 0 ? item.prix_promotion : item.prix_unitaire;
                          const totalItem = prix * item.quantite;
                          
                          return (
                            <div 
                              key={item.idProduit} 
                              className="bg-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 animate-fade-in group"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                                    {item.nom_produit}
                                  </h4>
                                  <div className="flex items-center mt-1 space-x-2">
                                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                      {prix.toLocaleString('fr-FR')} Ar
                                    </span>
                                    {item.prix_promotion && item.prix_promotion > 0 && (
                                      <span className="text-xs line-through text-gray-400">
                                        {item.prix_unitaire.toLocaleString('fr-FR')} Ar
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => retirerProduitSelectionne(item.idProduit)}
                                  className="w-7 h-7 text-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-100 hover:scale-110 ml-2"
                                >
                                  <TrashIcon className="h-10 w-10" />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => modifierQuantiteSelectionnee(item.idProduit, item.quantite - 1)}
                                    className="w-8 h-8 text-red-600 rounded-lg flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105 shadow-sm"
                                  >
                                    <MinusCircleIcon className="h-8 w-8" />
                                  </button>
                                  <span className="text-sm font-bold text-gray-900 w-8 text-center">
                                    {item.quantite}
                                  </span>
                                  <button
                                    onClick={() => modifierQuantiteSelectionnee(item.idProduit, item.quantite + 1)}
                                    className="w-8 h-8 text-black rounded-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-sm"
                                  >
                                    <PlusCircleIcon className="h-8 w-8" />
                                  </button>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-bold text-green-600 block">
                                    {totalItem.toLocaleString('fr-FR')} Ar
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {item.quantite} × {prix.toLocaleString('fr-FR')} Ar
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* PAGINATION */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between py-4 border-t border-gray-200">
                          <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="flex items-center px-3 py-1 text-sm text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-800"
                          >
                            ← Précédent
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Page {currentPage} sur {totalPages}
                            </span>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                            >
                              <option value={3}>3/page</option>
                              <option value={5}>5/page</option>
                              <option value={10}>10/page</option>
                              <option value={20}>20/page</option>
                            </select>
                          </div>

                          <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-3 py-1 text-sm text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-800"
                          >
                            Suivant →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Footer */}
              {!isModalMinimized && produitsSelectionnes.length > 0 && (
                <div className="flex-shrink-0 px-4 pb-4 bg-white rounded-b-3xl space-y-2">
                  {/* Total */}
                  <div className="flex justify-between items-center p-2">
                    <span className="text-black font-bold">Total commande:</span>
                    <span className="text-2xl font-bold text-green-700 animate-pulse">
                      {totalSelection.toLocaleString('fr-FR')} Ar
                    </span>
                  </div>

                  {/* Client sélectionné */}
                  {selectedClient ? (
                    <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                            <UserIcon className="h-5 w-5 text-blue-800" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-800">
                              {selectedClient.nom_prenom_client}
                            </p>
                            <p className="text-xs text-blue-700">
                              {selectedClient.telephone_client}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                          <button
                            onClick={retirerClient}
                            className="w-7 h-7 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={ouvrirSelectionClient}
                      className="w-full flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-dashed border-blue-300 rounded-xl text-blue-700 hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 mr-3 text-blue-800" />
                        <div className="text-left">
                          <p className="font-semibold text-blue-800">Sélectionner un client</p>
                          <p className="text-xs text-blue-800">Choisir le destinataire</p>
                        </div>
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleViderSelection}
                      className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Vider
                    </button>
                    
                    {selectedClient && (
                      <button
                        onClick={naviguerVersCommandes}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <CheckBadgeIcon className="h-5 w-5 mr-2" />
                        Créer Commande
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* État réduit */}
              {isModalMinimized && (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-sm">
                      Panier ({produitsSelectionnes.length})
                    </span>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {totalSelection.toLocaleString('fr-FR')} Ar
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de détail du produit */}
        {selectedProduitDetail && (
          <ProduitDetailModal
            produit={selectedProduitDetail}
            onClose={() => setSelectedProduitDetail(null)}
            onAddToCart={ajouterProduitSelectionne}
          />
        )}

        {/* Modal de sélection du client */}
        {showClientSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 shadow-2xl">
              <div className='bg-gray-200 p-2 w-12 rounded-xl place-self-end mt-4 mr-4'>
                <button
                  onClick={() => setShowClientSelection(false)}
                  className="w-8 h-8  rounded-lg flex transition-colors"
                >
                  <XMarkIcon className="h-8 w-8" />
                </button>
              </div>
              <div className="flex justify-center mb-4">
                <img src={LogoTB} alt="logo" className='w-32'/>
              </div>
              
              <div className=" text-center ">
                <h2 className="text-2xl font-bold">
                  Sélectionner un client
                </h2>
                <p className="text-gray-500 text-sm">
                  Choisissez un client existant ou créez-en un nouveau
                </p>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                {loadingClients ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-500">Aucun client trouvé</p>
                    <p className="text-sm text-gray-400">Créez votre premier client</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <button
                        key={client.idClient}
                        onClick={() => selectionnerClient(client)}
                        className="w-full pl-6 py-2 text-left bg-gray-200 border-l-2 border-blue-800 hover:bg-blue-100 transition-all duration-200 hover:scale-105 hover:shadow-3xl"
                      >
                        <div className="font-bold text-black">
                          {client.nom_prenom_client}
                        </div>
                        <div className="text-sm text-blue-800">
                          {client.telephone_client} • {client.email_client}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-8 mx-6">
                <button
                  onClick={creerNouveauClient}
                  className="w-full flex items-center justify-center px-3 py-2 bg-blue-800 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Créer un nouveau client
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Styles CSS */}
        <style jsx>{`
          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.5s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
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
    </div>
  );
};

export default Produits;
