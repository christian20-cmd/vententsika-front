// pages/Stocks.jsx
import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, Plus } from 'lucide-react';
import StockAlert from '../components/stocks/StockAlert';
import StockStatistics from '../components/stocks/StockStatistics';
import StockFilters from '../components/stocks/StockFilters';
import StockTable from '../components/stocks/StockTable';
import StockModal from '../components/stocks/StockModal';
import PublishProductModal from '../components/stocks/PublishProductModal';
import SkeletonLoader from '../components/stocks/SkeletonLoader';
import StatisticsSkeleton from '../components/stocks/StatisticsSkeleton';
import TableSkeleton from '../components/stocks/TableSkeleton';
import ToastContainer from '../components/common/ToastContainer';
import ConfirmationModal from '../components/common/ConfirmationModal';

const API_BASE_URL = 'http://localhost:8000/api';

// Composant ErrorBoundary pour capturer les erreurs
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Erreur d'affichage</h3>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message || 'Une erreur est survenue'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterPublication, setFilterPublication] = useState('tous');
  const [sortBy, setSortBy] = useState('nom_produit');
  const [showModal, setShowModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [formData, setFormData] = useState({});
  const [notifications, setNotifications] = useState([]);

  // État pour la modale de confirmation
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

  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('authToken') || 
           sessionStorage.getItem('auth_token') ||
           sessionStorage.getItem('token');
  };

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // FONCTIONS POUR LES NOTIFICATIONS TOAST
  const addNotification = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      title,
      message,
      duration
    };
    
    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showError = (message) => {
    addNotification('error', 'Erreur', message, 6000);
  };

  const showSuccess = (message) => {
    addNotification('success', 'Succès', message, 4000);
  };

  const showInfo = (message) => {
    addNotification('info', 'Information', message, 4000);
  };

  const showWarning = (message) => {
    addNotification('warning', 'Attention', message, 5000);
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
        showError('Erreur lors de l\'exécution de l\'action');
      }
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      showError('Vous devez être connecté pour accéder à cette page');
      setLoading(false);
      return;
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStocks(),
          fetchStatistics()
        ]);
        setDataLoaded(true);
        showInfo('Données des stocks chargées avec succès');
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        showError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchStocks = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch(`${API_BASE_URL}/stocks`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStocks(data);
    } catch (err) {
      console.error('Erreur fetchStocks:', err);
      showError(err.message);
      setStocks([]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.warn('Pas de token pour les statistiques');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/stocks/statistiques`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (response.status === 401) {
        console.warn('Non autorisé pour les statistiques');
        return;
      }
      
      if (!response.ok) {
        console.warn('Erreur lors du chargement des statistiques');
        return;
      }
      
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Erreur statistiques:', err);
    }
  };

  // FONCTION AMÉLIORÉE POUR PUBLIER UN STOCK
  const handlePublishStock = async (publishData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${selectedStock.idStock}/publier`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(publishData)
      });

      if (response.status === 422) {
        const errorData = await response.json();
        const errorMessage = errorData.errors 
          ? Object.values(errorData.errors).flat().join(', ')
          : errorData.message || 'Données invalides';
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la publication');
      }

      showSuccess('Produit publié avec succès !');
      setShowPublishModal(false);
      fetchStocks();
      fetchStatistics();
      
    } catch (err) {
      showError(err.message);
      console.error('Erreur publication:', err);
    }
  };

  // OUVERTURE AMÉLIORÉE DU MODAL DE PUBLICATION
  const openPublishModal = async (stock) => {
    try {
      setSelectedStock(stock);
      
      showInfo('Chargement des informations du stock...');

      const response = await fetch(`${API_BASE_URL}/stocks/${stock.idStock}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations du stock');
      }

      const stockComplet = await response.json();
      console.log('📦 Stock complet récupéré:', stockComplet);
      
      setFormData({
        nom_produit: stockComplet.nom_produit || `Produit ${stock.code_stock}`,
        description: stockComplet.produit?.description || stockComplet.description || '',
        prix_unitaire: stockComplet.prix_unitaire || stockComplet.produit?.prix_unitaire || 0,
        prix_promotion: stockComplet.produit?.prix_promotion || null,
        idCategorie: stockComplet.produit?.idCategorie || stockComplet.idCategorie || null,
        image_principale: stockComplet.produit?.image_principale || stockComplet.image_principale || null,
        images_supplementaires: stockComplet.produit?.images_supplementaires || stockComplet.images_supplementaires || [],
        quantite_disponible: stockComplet.quantite_disponible || 0,
        stock_entree: stockComplet.stock_entree || 0,
        quantite_reservee: stockComplet.quantite_reservee || 0,
        quantite_reellement_disponible: stockComplet.quantite_reellement_disponible || 0,
        code_stock: stockComplet.code_stock || '',
      });
      
      setShowPublishModal(true);
      showSuccess('Informations du stock chargées avec succès');
    } catch (err) {
      showError(err.message);
      console.error('Erreur récupération stock complet:', err);
      
      // Fallback: utiliser les données basiques du tableau
      setFormData({
        nom_produit: stock.nom_produit || `Produit ${stock.code_stock}`,
        description: stock.description || '',
        prix_unitaire: stock.prix_unitaire || 0,
        prix_promotion: null,
        idCategorie: null,
        image_principale: null,
        images_supplementaires: [],
        quantite_disponible: stock.quantite_disponible || 0,
        stock_entree: stock.stock_entree || 0,
        quantite_reservee: stock.quantite_reservee || 0,
        quantite_reellement_disponible: stock.quantite_reellement_disponible || 0,
        code_stock: stock.code_stock || '',
      });
      setShowPublishModal(true);
      showWarning('Utilisation des données basiques du stock');
    }
  };

  // FONCTION AMÉLIORÉE POUR CRÉER UN STOCK
  const handleCreateStock = async () => {
    try {
      // VALIDATION RENFORCÉE
      if (!formData.nom_produit || formData.nom_produit.length < 2) {
        showError('Le nom du produit doit contenir au moins 2 caractères');
        return;
      }
      
      if (!formData.categorie || formData.categorie.length < 2) {
        showError('La catégorie doit contenir au moins 2 caractères');
        return;
      }
      
      if (!formData.prix_unitaire || formData.prix_unitaire <= 0) {
        showError('Le prix unitaire doit être supérieur à 0');
        return;
      }
      
      if (!formData.quantite_disponible || formData.quantite_disponible < 0) {
        showError('La quantité disponible est obligatoire');
        return;
      }

      const stockData = {
        nom_produit: formData.nom_produit.trim(),
        categorie: formData.categorie.trim(),
        prix_unitaire: parseFloat(formData.prix_unitaire),
        quantite_disponible: parseInt(formData.quantite_disponible),
        stock_entree: parseInt(formData.stock_entree || formData.quantite_disponible),
        quantite_reservee: parseInt(formData.quantite_reservee || 0)
      };

      showInfo('Création du stock en cours...');

      const response = await fetch(`${API_BASE_URL}/stocks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(stockData)
      });

      if (response.status === 422) {
        const errorData = await response.json();
        const errorMessage = errorData.errors 
          ? Object.values(errorData.errors).flat().join(', ')
          : errorData.message || 'Données invalides';
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }

      showSuccess('Stock et produit créés avec succès !');
      setShowModal(false);
      fetchStocks();
      fetchStatistics();
      setFormData({});
      
    } catch (err) {
      showError(err.message);
      console.error('Erreur création stock:', err);
    }
  };

  // FONCTION AMÉLIORÉE POUR METTRE À JOUR LA QUANTITÉ
  const handleUpdateQuantite = async () => {
    try {
      // Validation des champs obligatoires
      if (!formData.nom_produit || formData.nom_produit.length < 2) {
        showError('Le nom du produit doit contenir au moins 2 caractères');
        return;
      }
      
      if (!formData.categorie || formData.categorie.length < 2) {
        showError('La catégorie doit contenir au moins 2 caractères');
        return;
      }
      
      if (!formData.prix_unitaire || formData.prix_unitaire <= 0) {
        showError('Le prix unitaire doit être supérieur à 0');
        return;
      }

      // Préparer les données pour la mise à jour
      const updateData = {
        nom_produit: formData.nom_produit.trim(),
        categorie: formData.categorie.trim(),
        prix_unitaire: parseFloat(formData.prix_unitaire),
      };

      // Si une opération sur la quantité est spécifiée, l'ajouter
      if (formData.operation && formData.quantite) {
        updateData.quantite = parseInt(formData.quantite);
        updateData.operation = formData.operation;
      }

      showInfo('Mise à jour du stock en cours...');

      const response = await fetch(`${API_BASE_URL}/stocks/${selectedStock.idStock}/update-complete`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updateData)
      });

      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      showSuccess('Produit et stock mis à jour avec succès');
      setShowModal(false);
      fetchStocks();
      fetchStatistics();
      setFormData({});
    } catch (err) {
      showError(err.message);
    }
  };

  // FONCTION AMÉLIORÉE POUR RÉSERVER DES PRODUITS
  const handleReserver = async () => {
    try {
      if (!formData.quantite) {
        showError('Veuillez indiquer la quantité à réserver');
        return;
      }

      const quantite = parseInt(formData.quantite);
      if (quantite <= 0) {
        showError('La quantité doit être supérieure à 0');
        return;
      }

      // Vérifier si la quantité à réserver est disponible
      if (selectedStock.quantite_reellement_disponible < quantite) {
        showError(`Quantité insuffisante. Disponible: ${selectedStock.quantite_reellement_disponible}`);
        return;
      }

      showInfo(`Réservation de ${quantite} unités en cours...`);

      const response = await fetch(`${API_BASE_URL}/stocks/${selectedStock.idStock}/reserver`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ quantite })
      });

      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réservation');
      }

      showSuccess(`${quantite} produit(s) réservé(s) avec succès`);
      setShowModal(false);
      fetchStocks();
      setFormData({});
    } catch (err) {
      showError(err.message);
    }
  };

  // FONCTION AMÉLIORÉE POUR LIVRER DES PRODUITS
  const handleLivrer = async () => {
    try {
      if (!formData.quantite) {
        showError('Veuillez indiquer la quantité à livrer');
        return;
      }

      const quantite = parseInt(formData.quantite);
      if (quantite <= 0) {
        showError('La quantité doit être supérieure à 0');
        return;
      }

      // Vérifier si la quantité à livrer est disponible
      if (selectedStock.quantite_reservee < quantite) {
        showError(`Quantité réservée insuffisante. Réservé: ${selectedStock.quantite_reservee}`);
        return;
      }

      showInfo(`Livraison de ${quantite} unités en cours...`);

      const response = await fetch(`${API_BASE_URL}/stocks/${selectedStock.idStock}/livrer`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ quantite })
      });

      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la livraison');
      }

      showSuccess(`${quantite} produit(s) livré(s) avec succès`);
      setShowModal(false);
      fetchStocks();
      fetchStatistics();
      setFormData({});
    } catch (err) {
      showError(err.message);
    }
  };

  // FONCTION AMÉLIORÉE POUR SUPPRIMER UN STOCK AVEC CONFIRMATION
  const handleDelete = async (stock) => {
    showConfirmation({
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer le stock "${stock.nom_produit}" (${stock.code_stock}) ? Cette action est irréversible.`,
      type: 'error',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/stocks/${stock.idStock}`, {
            method: 'DELETE',
            headers: getHeaders()
          });

          if (response.status === 401) {
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          }

          if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
          }

          showSuccess(`Stock "${stock.nom_produit}" supprimé avec succès`);
          fetchStocks();
          fetchStatistics();
        } catch (err) {
          showError(err.message);
          throw err;
        }
      }
    });
  };

  // FONCTION POUR LA PUBLICATION AVEC CONFIRMATION
  const handlePublishWithConfirmation = (stock) => {
    showConfirmation({
      title: 'Publier le produit',
      message: `Êtes-vous sûr de vouloir publier le stock "${stock.nom_produit}" vers le catalogue produits ?`,
      type: 'info',
      confirmText: 'Publier',
      cancelText: 'Annuler',
      onConfirm: async () => {
        await openPublishModal(stock);
      }
    });
  };

  // FONCTION POUR LA RÉSERVATION AVEC CONFIRMATION
  const handleReserverWithConfirmation = (stock) => {
    showConfirmation({
      title: 'Réserver des produits',
      message: `Vous allez réserver des produits du stock "${stock.nom_produit}". Disponible: ${stock.quantite_reellement_disponible} unités.`,
      type: 'warning',
      confirmText: 'Continuer',
      cancelText: 'Annuler',
      onConfirm: () => {
        openModal('reserver', stock);
      }
    });
  };

  // FONCTION POUR LA LIVRAISON AVEC CONFIRMATION
  const handleLivrerWithConfirmation = (stock) => {
    if (stock.quantite_reservee === 0) {
      showWarning('Aucun produit réservé pour ce stock');
      return;
    }

    showConfirmation({
      title: 'Livrer des produits',
      message: `Vous allez livrer des produits réservés du stock "${stock.nom_produit}". Réservé: ${stock.quantite_reservee} unités.`,
      type: 'warning',
      confirmText: 'Continuer',
      cancelText: 'Annuler',
      onConfirm: () => {
        openModal('livrer', stock);
      }
    });
  };

  // FONCTION POUR LA MODIFICATION AVEC CONFIRMATION
  const handleUpdateWithConfirmation = (stock) => {
    showConfirmation({
      title: 'Modifier le stock',
      message: `Vous allez modifier les informations du stock "${stock.nom_produit}".`,
      type: 'info',
      confirmText: 'Modifier',
      cancelText: 'Annuler',
      onConfirm: () => {
        openModal('update', stock);
      }
    });
  };

  const openModal = (type, stock = null) => {
    setModalType(type);
    setSelectedStock(stock);
    
    if (stock && type === 'update') {
      setFormData({
        operation: 'ajouter',
        nom_produit: stock.nom_produit,
        categorie: stock.categorie,
        prix_unitaire: stock.prix_unitaire,
        quantite: ''
      });
    } else {
      setFormData(stock ? { operation: 'ajouter' } : {});
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const closePublishModal = () => {
    setShowPublishModal(false);
    setFormData({});
  };

  const handleRefresh = () => {
    setLoading(true);
    showInfo('Actualisation des données en cours...');
    Promise.all([fetchStocks(), fetchStatistics()]).finally(() => {
      setLoading(false);
      showSuccess('Données actualisées avec succès');
    });
  };

  const handleSubmit = () => {
    if (modalType === 'create') handleCreateStock();
    else if (modalType === 'update') handleUpdateQuantite();
    else if (modalType === 'reserver') handleReserver();
    else if (modalType === 'livrer') handleLivrer();
  };

  const filteredStocks = stocks
    .filter(stock => {
      const matchesSearch = stock.nom_produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stock.code_stock?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stock.categorie?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'tous' || stock.statut_automatique === filterStatus;
      const matchesPublication = filterPublication === 'tous' || stock.statut_publication === filterPublication;
      
      return matchesSearch && matchesStatus && matchesPublication;
    })
    .sort((a, b) => {
      if (sortBy === 'nom_produit') return (a.nom_produit || '').localeCompare(b.nom_produit || '');
      if (sortBy === 'quantite_asc') return (a.quantite_disponible || 0) - (b.quantite_disponible || 0);
      if (sortBy === 'quantite_desc') return (b.quantite_disponible || 0) - (a.quantite_disponible || 0);
      if (sortBy === 'valeur_desc') return (b.valeur || 0) - (a.valeur || 0);
      return 0;
    });

  // Afficher le skeleton pendant le chargement
  if (loading && !dataLoaded) {
    return <SkeletonLoader />;
  }

  if (!getAuthToken()) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Authentification requise</h2>
        <p className="text-gray-600 mt-2">Veuillez vous connecter pour accéder à la gestion des stocks.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Gestion des Stocks</h1>
          
          <button
            onClick={() => openModal('create')}
            className="bg-blue-800 text-white px-4 py-2 rounded-2xl font-bold hover:bg-blue-800/60 flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Nouveau Stock
          </button>
        </div>

        {/* Filtres */}
        <StockFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          filterPublication={filterPublication}
          onFilterPublicationChange={setFilterPublication}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRefresh={handleRefresh}
        />

        {/* Statistiques avec skeleton */}
        {loading ? (
          <StatisticsSkeleton />
        ) : (
          <StockStatistics statistics={statistics} />
        )}

        {/* Tableau avec skeleton */}
        {loading ? (
          <TableSkeleton rows={5} columns={11} />
        ) : (
          <StockTable
            stocks={filteredStocks}
            onEdit={handleUpdateWithConfirmation}
            onDelete={handleDelete}
            onPublish={handlePublishWithConfirmation}
            onReserver={handleReserverWithConfirmation}
            onLivrer={handleLivrerWithConfirmation}
          />
        )}

        {/* Modals */}
        {showModal && (
          <StockModal
            modalType={modalType}
            selectedStock={selectedStock}
            formData={formData}
            onFormDataChange={setFormData}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )}

        {showPublishModal && (
          <ErrorBoundary>
            <PublishProductModal
              stock={selectedStock}
              formData={formData}
              onFormDataChange={setFormData}
              onClose={closePublishModal}
              onSubmit={handlePublishStock}
            />
          </ErrorBoundary>
        )}

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

        {/* Container de notifications */}
        <ToastContainer 
          notifications={notifications}
          onClose={removeNotification}
        />
      </div>
    </div>
  );
};

export default Stocks;