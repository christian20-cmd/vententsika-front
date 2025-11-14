import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axiosConfig'; // Import de votre configuration axios

// Composants
import LivraisonStats from '../components/livraisons/LivraisonStats';
import LivraisonTable from '../components/livraisons/LivraisonTable';
import FilterSystem from '../components/livraisons/FilterSystem';
import CreateModal from '../components/livraisons/CreateModal';
import EditModal from '../components/livraisons/EditModal';
import CalculsModal from '../components/livraisons/CalculsModal';
import ModalPaiement from '../components/commandes/ModalPaiement';
import { useModal } from '../components/livraisons/modals';
import ToastContainer from '../components/common/ToastContainer';
import ConfirmationModal from '../components/common/ConfirmationModal';

// Import des composants Skeleton
import SkeletonLivraisonPage from '../components/livraisons/SkeletonLivraisonPage';
import SkeletonStats from '../components/livraisons/SkeletonStats';
import SkeletonTable from '../components/livraisons/SkeletonTable';
import { Plus } from 'lucide-react';

const Livraison = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [commandesDisponibles, setCommandesDisponibles] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedLivraison, setSelectedLivraison] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('tous');
  const [sortBy, setSortBy] = useState('date_desc');
  const [dateFilter, setDateFilter] = useState('toutes');
  
  const searchInputRef = useRef(null);

  // États pour le modal de paiement
  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [commandeAPayer, setCommandeAPayer] = useState(null);
  const [livraisonEnAttente, setLivraisonEnAttente] = useState(null);
  const [formPaiement, setFormPaiement] = useState({
    montant: '',
    methode_paiement: 'especes'
  });

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

  const { modalType, showModal, openModal, closeModal } = useModal();

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

  // Focus sur l'input de recherche quand il s'étend
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('🎯 Début du chargement des données...');
        await Promise.all([
          loadLivraisons(),
          loadStatistiques()
        ]);
        console.log('🎉 Toutes les données chargées avec succès');
        showInfo('Données des livraisons chargées avec succès');
      } catch (error) {
        console.error('💥 Erreur globale lors du chargement des données:', error);
        showError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
        console.log('🏁 Chargement terminé');
      }
    };

    loadData();
  }, []);

  const loadLivraisons = async () => {
    try {
      console.log('🔄 Tentative de chargement des livraisons...');
      const response = await api.get('/livraisons');
      console.log('✅ Réponse livraisons:', response);
      
      const data = response.data;
      
      if (data.success) {
        console.log('📦 Livraisons chargées:', data.data.length);
        const livraisonsFormatees = data.data.map(livraison => ({
          ...livraison,
          montant_total_commande: livraison.commande?.total_commande || 0,
          frais_livraison: livraison.commande?.frais_livraison || 0,
          montant_deja_paye: livraison.commande?.montant_deja_paye || 0,
          montant_reste_payer: livraison.commande?.montant_reste_payer || 0,
          nom_client: livraison.commande?.client?.nom_prenom_client || livraison.nom_client,
          telephone_client: livraison.commande?.client?.telephone_client || livraison.telephone_client,
          adresse_livraison: livraison.commande?.adresse_livraison || livraison.adresse_livraison
        }));
        setLivraisons(livraisonsFormatees);
      } else {
        console.error('❌ Erreur dans la réponse:', data.message);
        showError(data.message || 'Erreur lors du chargement des livraisons');
      }
    } catch (error) {
      console.error('❌ Erreur détaillée lors du chargement des livraisons:', error);
      console.error('📊 Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      showError('Erreur lors du chargement des livraisons');
    }
  };

  const loadStatistiques = async () => {
    try {
      console.log('🔄 Tentative de chargement des statistiques...');
      const response = await api.get('/livraisons/statistiques');
      console.log('✅ Réponse statistiques:', response);
      
      const data = response.data;
      
      if (data.success) {
        console.log('📊 Statistiques chargées:', data.data);
        setStatistiques(data.data);
      } else {
        console.error('❌ Erreur dans la réponse statistiques:', data.message);
      }
    } catch (error) {
      console.error('❌ Erreur détaillée lors du chargement des statistiques:', error);
      console.error('📊 Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
    }
  };

  const loadCommandesDisponibles = async () => {
    try {
      showInfo('Chargement des commandes disponibles...');
      const response = await api.get('/livraisons/commandes-disponibles');
      const data = response.data;
      
      if (data.success) {
        setCommandesDisponibles(data.data || data.commandes);
        showSuccess('Commandes disponibles chargées avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      showError('Erreur lors du chargement des commandes disponibles');
    }
  };

  // Fonction de filtrage et tri
  const getFilteredAndSortedLivraisons = () => {
    let filtered = livraisons;

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(livraison =>
        livraison.nom_client?.toLowerCase().includes(searchLower) ||
        livraison.numero_suivi?.toLowerCase().includes(searchLower) ||
        livraison.adresse_livraison?.toLowerCase().includes(searchLower) ||
        livraison.commande?.numero_commande?.toLowerCase().includes(searchLower) ||
        livraison.telephone_client?.includes(searchTerm)
      );
    }

    // Filtre par statut
    if (filterStatus !== 'tous') {
      filtered = filtered.filter(livraison => 
        livraison.status_livraison === filterStatus
      );
    }

    // Filtre par date
    if (dateFilter !== 'toutes') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter(livraison => {
        if (!livraison.date_livraison_prevue) return false;
        
        const dateLivraison = new Date(livraison.date_livraison_prevue);
        dateLivraison.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case 'aujourdhui': {
            return dateLivraison.getTime() === today.getTime();
          }
          case 'demain': {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return dateLivraison.getTime() === tomorrow.getTime();
          }
          case 'semaine': {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return dateLivraison >= startOfWeek && dateLivraison <= endOfWeek;
          }
          case 'mois': {
            return dateLivraison.getMonth() === today.getMonth() && 
                  dateLivraison.getFullYear() === today.getFullYear();
          }
          case 'retard': {
            return dateLivraison < today && 
                  !['livre', 'annule', 'retourne'].includes(livraison.status_livraison);
          }
          default: {      
            return true;
          }
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc': {
          return new Date(a.date_livraison_prevue) - new Date(b.date_livraison_prevue);
        }
        case 'montant_desc': {
          return (b.montant_total_commande || 0) - (a.montant_total_commande || 0);
        }
        case 'montant_asc': {
          return (a.montant_total_commande || 0) - (b.montant_total_commande || 0);
        }
        case 'client_asc': {
          return (a.nom_client || '').localeCompare(b.nom_client || '');
        }
        case 'client_desc': {
          return (b.nom_client || '').localeCompare(a.nom_client || '');
        }
        case 'statut_asc': {
          return (a.status_livraison || '').localeCompare(b.status_livraison || '');
        }
        case 'date_desc':
        default: {
          return new Date(b.date_livraison_prevue) - new Date(a.date_livraison_prevue);
        }
      }
    });

    return filtered;
  };

  const filteredLivraisons = getFilteredAndSortedLivraisons();

  console.log('🔍 Livraisons filtrées:', filteredLivraisons.length);

  // Fonction pour vérifier le paiement
  const verifierPaiementComplet = (livraison) => {
    const montantReste = livraison.montant_reste_payer || 
                        livraison.commande?.montant_reste_payer || 
                        0;
    
    // Considérer comme payé si le reste est inférieur à 0.01 (problèmes d'arrondi)
    return montantReste <= 0.01;
  };

  // FONCTION AMÉLIORÉE POUR TENTER LA LIVRAISON
  const handleTentativeLivraison = async (livraison) => {
    // Vérifier si le paiement est complet
    if (verifierPaiementComplet(livraison)) {
      // Paiement complet, demander confirmation pour la livraison
      showConfirmation({
        title: 'Confirmer la livraison',
        message: `Êtes-vous sûr de vouloir marquer la livraison #${livraison.idLivraison} comme livrée ? Cette action est définitive.`,
        type: 'info',
        confirmText: 'Confirmer la livraison',
        cancelText: 'Annuler',
        onConfirm: async () => {
          await handleStatusChange('livrer', livraison.idLivraison);
        }
      });
    } else {
      // Paiement incomplet, ouvrir le modal de paiement
      const idCommande = livraison.idCommande || livraison.commande?.idCommande;
      
      if (!idCommande) {
        showError('Erreur: Impossible de trouver l\'identifiant de la commande');
        return;
      }

      setCommandeAPayer({
        idCommande: idCommande,
        numero_commande: livraison.numero_commande || livraison.commande?.numero_commande,
        client: {
          nom_prenom_client: livraison.nom_client || livraison.commande?.client?.nom_prenom_client
        },
        total_commande: livraison.montant_total_commande || livraison.commande?.total_commande,
        montant_deja_paye: livraison.montant_deja_paye || livraison.commande?.montant_deja_paye,
        montant_reste_payer: livraison.montant_reste_payer || livraison.commande?.montant_reste_payer
      });
      setLivraisonEnAttente(livraison);
      setShowPaiementModal(true);
    }
  };

  // Fonction appelée après un paiement réussi
  const handlePaiementReussi = async () => {
    if (livraisonEnAttente) {
      // Attendre un peu pour que le backend traite le paiement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Recharger les données pour avoir les informations à jour
      await loadLivraisons();
      
      // Trouver la livraison actualisée
      const livraisonsActualisees = await loadLivraisonsSilencieusement();
      const livraisonActualisee = livraisonsActualisees.find(
        l => l.idLivraison === livraisonEnAttente.idLivraison
      );
      
      if (livraisonActualisee && verifierPaiementComplet(livraisonActualisee)) {
        // Paiement complet, demander confirmation pour la livraison
        showConfirmation({
          title: 'Paiement complet - Confirmer la livraison',
          message: `Le paiement est maintenant complet. Voulez-vous procéder à la livraison de la commande #${livraisonActualisee.numero_commande || livraisonActualisee.commande?.numero_commande} ?`,
          type: 'success',
          confirmText: 'Confirmer la livraison',
          cancelText: 'Plus tard',
          onConfirm: async () => {
            console.log('Paiement complet, procéder à la livraison');
            await handleStatusChange('livrer', livraisonEnAttente.idLivraison);
          }
        });
      } else {
        // Calculer le nouveau montant restant
        const nouveauReste = livraisonActualisee?.montant_reste_payer || 
                            livraisonActualisee?.commande?.montant_reste_payer;
        
        if (nouveauReste > 0) {
          showSuccess(`Paiement enregistré avec succès ! Il reste encore ${formatPrix(nouveauReste)} à payer.`);
        } else {
          showSuccess('Paiement enregistré avec succès !');
        }
      }
      
      setLivraisonEnAttente(null);
    }
  };

  // Fonction utilitaire pour charger les livraisons silencieusement
  const loadLivraisonsSilencieusement = async () => {
    try {
      const response = await api.get('/livraisons');
      const data = response.data;
      
      if (data.success) {
        return data.data.map(livraison => ({
          ...livraison,
          montant_total_commande: livraison.commande?.total_commande || 0,
          frais_livraison: livraison.commande?.frais_livraison || 0,
          montant_deja_paye: livraison.commande?.montant_deja_paye || 0,
          montant_reste_payer: livraison.commande?.montant_reste_payer || 0,
          nom_client: livraison.commande?.client?.nom_prenom_client || livraison.nom_client,
          telephone_client: livraison.commande?.client?.telephone_client || livraison.telephone_client,
          adresse_livraison: livraison.commande?.adresse_livraison || livraison.adresse_livraison
        }));
      }
      return [];
    } catch (error) {
      console.error('Erreur lors du chargement silencieux:', error);
      return [];
    }
  };

  // Fonction pour formater les prix
  const formatPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(prix || 0);
  };

  // FONCTIONS AMÉLIORÉES POUR GÉRER LES CHANGEMENTS DE STATUT
  const handleStatusChange = async (action, idLivraison) => {
    setActionLoading(idLivraison);
    
    try {
      let response;
      const livraison = livraisons.find(l => l.idLivraison === idLivraison);
      const nomClient = livraison?.nom_client || 'le client';

      switch (action) {
        case 'preparation':
          response = await api.put(`/livraisons/${idLivraison}`, { 
            status_livraison: 'en_preparation' 
          });
          break;
        case 'expedier':
          response = await api.post(`/livraisons/${idLivraison}/expedier`);
          break;
        case 'transit':
          response = await api.put(`/livraisons/${idLivraison}`, { 
            status_livraison: 'en_transit' 
          });
          break;
        case 'livrer':
          response = await api.post(`/livraisons/${idLivraison}/livrer`);
          break;
        case 'annuler':
          // La confirmation est déjà gérée dans la fonction appelante
          response = await api.put(`/livraisons/${idLivraison}`, { 
            status_livraison: 'annule' 
          });
          break;
        default:
          return;
      }

      const data = response.data;
      
      if (data.success) {
        const messages = {
          'preparation': `Livraison mise en préparation pour ${nomClient}`,
          'expedier': `Livraison expédiée pour ${nomClient}`,
          'transit': `Livraison mise en transit pour ${nomClient}`,
          'livrer': `Livraison marquée comme livrée pour ${nomClient}`,
          'annuler': `Livraison annulée pour ${nomClient}`
        };
        
        showSuccess(messages[action] || `Livraison ${action} avec succès!`);
        loadLivraisons();
        loadStatistiques();
      } else {
        // Si erreur due au paiement incomplet
        if (data.message && data.message.includes('pas entièrement payée')) {
          const livraison = livraisons.find(l => l.idLivraison === idLivraison);
          if (livraison) {
            const idCommande = livraison.idCommande || livraison.commande?.idCommande;
            
            if (!idCommande) {
              showError('Erreur: Impossible de trouver l\'identifiant de la commande');
              return;
            }

            setCommandeAPayer({
              idCommande: idCommande,
              numero_commande: livraison.numero_commande || livraison.commande?.numero_commande,
              client: {
                nom_prenom_client: livraison.nom_client || livraison.commande?.client?.nom_prenom_client
              },
              total_commande: livraison.montant_total_commande || livraison.commande?.total_commande,
              montant_deja_paye: livraison.montant_deja_paye || livraison.commande?.montant_deja_paye,
              montant_reste_payer: livraison.montant_reste_payer || livraison.commande?.montant_reste_payer
            });
            setLivraisonEnAttente(livraison);
            setShowPaiementModal(true);
          }
        } else {
          showError('Erreur: ' + data.message);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(null);
    }
  };

  // FONCTIONS AMÉLIORÉES POUR LES ACTIONS CRITIQUES
  const handleAnnulationLivraison = (livraison) => {
    showConfirmation({
      title: 'Annuler la livraison',
      message: `Êtes-vous sûr de vouloir annuler la livraison #${livraison.idLivraison} pour ${livraison.nom_client} ? Cette action est irréversible.`,
      type: 'error',
      confirmText: 'Oui, annuler',
      cancelText: 'Annuler',
      onConfirm: async () => {
        await handleStatusChange('annuler', livraison.idLivraison);
      }
    });
  };

  const handleExpeditionLivraison = (livraison) => {
    showConfirmation({
      title: 'Expédier la livraison',
      message: `Êtes-vous sûr de vouloir marquer la livraison #${livraison.idLivraison} comme expédiée ?`,
      type: 'info',
      confirmText: 'Confirmer l\'expédition',
      cancelText: 'Annuler',
      onConfirm: async () => {
        await handleStatusChange('expedier', livraison.idLivraison);
      }
    });
  };

  const handleMiseEnTransit = (livraison) => {
    showConfirmation({
      title: 'Mettre en transit',
      message: `Êtes-vous sûr de vouloir marquer la livraison #${livraison.idLivraison} comme étant en transit ?`,
      type: 'info',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        await handleStatusChange('transit', livraison.idLivraison);
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR SUPPRIMER UNE LIVRAISON
  const handleDelete = async (idLivraison) => {
    const livraison = livraisons.find(l => l.idLivraison === idLivraison);
    
    if (!livraison) return;

    showConfirmation({
      title: 'Supprimer la livraison',
      message: `Êtes-vous sûr de vouloir supprimer définitivement la livraison #${livraison.idLivraison} pour ${livraison.nom_client} ? Cette action est irréversible.`,
      type: 'error',
      confirmText: 'Supprimer définitivement',
      cancelText: 'Annuler',
      onConfirm: async () => {
        setActionLoading(idLivraison);
        try {
          const response = await api.delete(`/livraisons/${idLivraison}`);
          const data = response.data;
          
          if (data.success) {
            showSuccess('Livraison supprimée avec succès!');
            loadLivraisons();
            loadStatistiques();
            loadCommandesDisponibles();
          } else {
            showError('Erreur: ' + data.message);
          }
        } catch (error) {
          console.error('Erreur:', error);
          showError('Erreur lors de la suppression');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR TÉLÉCHARGER LE PDF
  const handleDownloadPDF = async (idLivraison) => {
    const livraison = livraisons.find(l => l.idLivraison === idLivraison);
    
    if (!livraison) return;

    showConfirmation({
      title: 'Télécharger le PDF',
      message: `Voulez-vous télécharger le bon de livraison pour ${livraison.nom_client} ?`,
      type: 'info',
      confirmText: 'Télécharger',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const response = await api.get(`/livraisons/${idLivraison}/pdf`, {
            responseType: 'blob'
          });
          
          if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `livraison-${idLivraison}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showSuccess('PDF téléchargé avec succès!');
          }
        } catch (error) {
          console.error('Erreur:', error);
          showError('Erreur lors du téléchargement du PDF');
        }
      }
    });
  };

  const openCreateModal = async () => {
    await loadCommandesDisponibles();
    openModal('create');
  };

  const openEditModal = async (livraison) => {
    setSelectedLivraison(livraison);
    openModal('edit');
  };

  const openCalculsModal = async (idLivraison) => {
    try {
      const response = await api.get(`/livraisons/${idLivraison}/detail-calculs`);
      const data = response.data;
      
      if (data.success) {
        setSelectedLivraison(data.data);
        openModal('calculs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors du chargement des détails');
    }
  };

  // Fonction pour obtenir les headers d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fonction pour vérifier le paiement (utilisé dans ActionButtons)
  const onVerifierPaiement = (livraison) => {
    handleTentativeLivraison(livraison);
  };

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    showInfo('Actualisation des données en cours...');
    setLoading(true);
    Promise.all([loadLivraisons(), loadStatistiques()]).finally(() => {
      setLoading(false);
      showSuccess('Données actualisées avec succès');
    });
  };

  // Afficher le skeleton pendant le chargement
  if (loading) {
    return <SkeletonLivraisonPage />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Gestion des Livraisons</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center font-bold justify-center gap-2 bg-blue-800 hover:bg-blue-800/60 text-white px-6 py-2 rounded-2xl transition-colors"
        >
          <Plus className='w-6 h-6'/>Nouvelle Livraison
        </button>
      </div>

      {/* Statistiques */}
      {statistiques ? (
        <LivraisonStats statistiques={statistiques} />
      ) : (
        <SkeletonStats />
      )}

      {/* Système de Filtres */}
      <FilterSystem
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearchExpanded={isSearchExpanded}
        setIsSearchExpanded={setIsSearchExpanded}
        isFiltersOpen={isFiltersOpen}
        setIsFiltersOpen={setIsFiltersOpen}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        searchInputRef={searchInputRef}
        onRefresh={handleRefresh}
        filteredLivraisonsCount={filteredLivraisons.length}
      />

      {/* Liste des livraisons - CORRECTION FINALE */}
      <LivraisonTable
        livraisons={filteredLivraisons}
        loading={loading}
        actionLoading={actionLoading}
        onEdit={openEditModal}
        onCalculs={openCalculsModal}
        onStatusChange={(action, idLivraison) => {
          const livraison = livraisons.find(l => l.idLivraison === idLivraison);
          switch (action) {
            case 'annuler':
              handleAnnulationLivraison(livraison);
              break;
            case 'expedier':
              handleExpeditionLivraison(livraison);
              break;
            case 'transit':
              handleMiseEnTransit(livraison);
              break;
            case 'livrer':
              handleTentativeLivraison(livraison);
              break;
            default:
              handleStatusChange(action, idLivraison);
          }
        }}
        onDelete={handleDelete}
        onDownloadPDF={handleDownloadPDF}
        onCreateNew={openCreateModal}
        onVerifierPaiement={onVerifierPaiement}
      />

      {/* Modal de confirmation global */}
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

      {/* Modals */}
      {showModal && modalType === 'create' && (
        <CreateModal
          commandesDisponibles={commandesDisponibles}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            showSuccess('Livraison créée avec succès!');
            loadLivraisons();
            loadStatistiques();
            loadCommandesDisponibles();
          }}
          onError={showError}
        />
      )}

      {showModal && modalType === 'edit' && selectedLivraison && (
        <EditModal
          livraison={selectedLivraison}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            showSuccess('Livraison modifiée avec succès!');
            loadLivraisons();
          }}
          onError={showError}
        />
      )}

      {showModal && modalType === 'calculs' && selectedLivraison && (
        <CalculsModal
          livraison={selectedLivraison}
          onClose={closeModal}
        />
      )}

      {/* Modal de paiement */}
      {showPaiementModal && commandeAPayer && (
        <ModalPaiement
          commandeAPayer={commandeAPayer}
          setShowPaiementModal={setShowPaiementModal}
          setCommandeAPayer={setCommandeAPayer}
          formPaiement={formPaiement}
          setFormPaiement={setFormPaiement}
          fetchCommandes={loadLivraisons}
          getAuthHeaders={getAuthHeaders}
          onPaiementReussi={handlePaiementReussi}
          onError={showError}
          onSuccess={showSuccess}
        />
      )}

      {/* Container de notifications */}
      <ToastContainer 
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
};

export default Livraison;