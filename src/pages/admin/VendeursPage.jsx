import React, { useState, useEffect, useCallback } from 'react';
import DashboardAdminLayout from '../../components/admin/DashboardAdminLayout';
import Statistics from '../../components/admin/vendeurs/Statistics';
import VendeursList from '../../components/admin/vendeurs/VendeursList';
import VendeurDetailsModal from '../../components/admin/vendeurs/VendeurDetailsModal';
import Filters from '../../components/admin/vendeurs/Filters';
import SkeletonLoader from '../../components/admin/vendeurs/SkeletonLoader';
import ToastContainer from '../../components/common/ToastContainer';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const VendeursPage = () => {
  const [vendeurs, setVendeurs] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterActif, setFilterActif] = useState('tous');
  const [selectedVendeur, setSelectedVendeur] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // États pour les notifications et confirmations
  const [notifications, setNotifications] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: null,
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    isLoading: false,
    showInput: false,
    inputPlaceholder: '',
    inputRequired: false
  });

  // API base URL
  const API_BASE_URL = 'http://localhost:8000/api/admin/vendeurs';

  // FONCTIONS POUR LES NOTIFICATIONS TOAST
  const showNotification = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type,
      title,
      message,
      duration
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
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
      showInput: false,
      inputPlaceholder: '',
      inputRequired: false,
      ...config
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = async (inputValue = '') => {
    if (confirmationModal.onConfirm) {
      setConfirmationModal(prev => ({ ...prev, isLoading: true }));
      try {
        await confirmationModal.onConfirm(inputValue);
        closeConfirmation();
      } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
        setConfirmationModal(prev => ({ ...prev, isLoading: false }));
        showNotification('error', 'Erreur', 'Erreur lors de l\'exécution de l\'action');
      }
    }
  };

  // Fonction optimisée pour récupérer les vendeurs
  const fetchVendeurs = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      let url = API_BASE_URL;
      const params = new URLSearchParams();
      
      // Ajouter les filtres seulement s'ils sont différents de 'tous'
      if (filterStatut !== 'tous') params.append('statut_validation', filterStatut);
      if (filterActif !== 'tous') params.append('est_actif', filterActif === 'actif');
      if (searchQuery) params.append('search', searchQuery);
      
      if (params.toString()) url += `?${params.toString()}`;

      console.log('🔄 Fetching vendeurs from:', url);

      // Ajouter un timeout pour éviter les requêtes trop longues
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Données vendeurs reçues:', data.data?.length || 0, 'vendeurs');
        setVendeurs(data.data || []);
        if (searchQuery) {
          showNotification('success', 'Recherche terminée', `${data.data?.length || 0} vendeur(s) trouvé(s)`);
        }
      } else {
        throw new Error(data.message || 'Erreur inconnue du serveur');
      }
    } catch (err) {
      console.error('❌ Erreur fetchVendeurs:', err);
      setError(err.message);
      setVendeurs([]); // Réinitialiser en cas d'erreur
      showNotification('error', 'Erreur', 'Erreur lors du chargement des vendeurs');
    } finally {
      setLoading(false);
    }
  }, [filterStatut, filterActif]);

  // Fonction optimisée pour les statistiques
  const fetchStatistiques = useCallback(async () => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.warn('Token manquant pour les statistiques');
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 secondes timeout

      const response = await fetch(`${API_BASE_URL}/statistiques`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStatistiques(data.data);
        }
      } else {
        console.warn('Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      console.error('Erreur statistiques:', err);
      // Ne pas bloquer l'interface si les stats échouent
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Recherche optimisée avec debounce
  const searchVendeurs = useCallback(async (query) => {
    if (!query.trim()) {
      fetchVendeurs(); // Retour à la liste complète si recherche vide
      return;
    }

    try {
      setLoading(true);
      await fetchVendeurs(query);
    } catch (err) {
      console.error('Erreur recherche:', err);
    }
  }, [fetchVendeurs]);

  // FONCTION AMÉLIORÉE POUR METTRE À JOUR LE STATUT
  const updateStatutVendeur = async (vendeurId, nouveauStatut, raison = '') => {
    const vendeur = vendeurs.find(v => v.idVendeur === vendeurId);
    if (!vendeur) return false;

    const statutsLabels = {
      'en_attente': 'en attente',
      'valide': 'validé',
      'rejete': 'rejeté'
    };

    const confirmationMessages = {
      'valide': `Êtes-vous sûr de vouloir valider ${vendeur.nom_complet || vendeur.nom_entreprise} ? Ce vendeur aura accès à la plateforme.`,
      'rejete': `Êtes-vous sûr de vouloir rejeter ${vendeur.nom_complet || vendeur.nom_entreprise} ? Veuillez saisir la raison du rejet :`,
      'en_attente': `Êtes-vous sûr de vouloir remettre ${vendeur.nom_complet || vendeur.nom_entreprise} en attente ?`
    };

    const confirmationConfig = {
      'valide': {
        title: 'Valider le vendeur',
        message: confirmationMessages.valide,
        type: 'info',
        confirmText: 'Valider',
        showInput: false
      },
      'rejete': {
        title: 'Rejeter le vendeur',
        message: confirmationMessages.rejete,
        type: 'warning',
        confirmText: 'Rejeter',
        showInput: true,
        inputPlaceholder: 'Raison du rejet...',
        inputRequired: true
      },
      'en_attente': {
        title: 'Remettre en attente',
        message: confirmationMessages.en_attente,
        type: 'warning',
        confirmText: 'Confirmer',
        showInput: false
      }
    };

    showConfirmation({
      ...confirmationConfig[nouveauStatut],
      onConfirm: async (raisonRejet = '') => {
        try {
          setActionLoading(vendeurId);
          const token = localStorage.getItem('auth_token');
          
          const response = await fetch(`${API_BASE_URL}/${vendeurId}/statut`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              statut_validation: nouveauStatut,
              raison: nouveauStatut === 'rejete' ? raisonRejet : raison
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la mise à jour');
          }

          const data = await response.json();
          
          if (data.success) {
            // Mise à jour optimiste de l'UI
            setVendeurs(prev => prev.map(v => 
              v.idVendeur === vendeurId 
                ? { ...v, statut_validation: nouveauStatut }
                : v
            ));
            
            // Recharger les stats en arrière-plan sans bloquer l'UI
            setTimeout(() => {
              fetchStatistiques();
            }, 100);
            
            showNotification('success', 'Statut mis à jour', `${vendeur.nom_complet || vendeur.nom_entreprise} est maintenant ${statutsLabels[nouveauStatut]}`);
            return true;
          } else {
            throw new Error(data.message || 'Erreur inconnue');
          }
        } catch (err) {
          console.error('Erreur:', err);
          showNotification('error', 'Erreur', `Erreur lors de la mise à jour: ${err.message}`);
          return false;
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR SUPPRIMER UN VENDEUR
  const deleteVendeur = async (vendeurId) => {
    const vendeur = vendeurs.find(v => v.idVendeur === vendeurId);
    if (!vendeur) return false;

    showConfirmation({
      title: 'Supprimer le vendeur',
      message: `Êtes-vous sûr de vouloir supprimer définitivement ${vendeur.nom_complet || vendeur.nom_entreprise} ? Cette action est irréversible et supprimera toutes les données associées.`,
      type: 'error',
      confirmText: 'Supprimer définitivement',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          setActionLoading(vendeurId);
          const token = localStorage.getItem('auth_token');
          
          const response = await fetch(`${API_BASE_URL}/${vendeurId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la suppression');
          }

          const data = await response.json();
          
          if (data.success) {
            // Mise à jour optimiste
            setVendeurs(prev => prev.filter(v => v.idVendeur !== vendeurId));
            
            // Recharger les stats en arrière-plan
            setTimeout(() => {
              fetchStatistiques();
            }, 100);
            
            showNotification('success', 'Suppression réussie', `${vendeur.nom_complet || vendeur.nom_entreprise} a été supprimé avec succès`);
            return true;
          } else {
            throw new Error(data.message || 'Erreur inconnue');
          }
        } catch (err) {
          console.error('Erreur:', err);
          showNotification('error', 'Erreur', `Erreur lors de la suppression: ${err.message}`);
          return false;
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  // Fonction pour voir les détails
  const viewVendeurDetails = async (vendeurId) => {
    try {
      setActionLoading(vendeurId);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/${vendeurId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedVendeur(data.data);
          setShowDetailsModal(true);
          showNotification('success', 'Détails chargés', 'Informations du vendeur chargées avec succès');
        }
      } else {
        throw new Error('Erreur lors du chargement des détails');
      }
    } catch (err) {
      console.error('Erreur détails:', err);
      showNotification('error', 'Erreur', 'Impossible de charger les détails du vendeur');
    } finally {
      setActionLoading(null);
    }
  };

  // Effet principal - Chargement initial
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (isMounted) {
        setLoading(true);
        try {
          // Charger d'abord les vendeurs, puis les stats en parallèle
          await Promise.all([
            fetchVendeurs(),
            fetchStatistiques()
          ]);
          showNotification('success', 'Chargement terminé', 'Tous les vendeurs ont été chargés avec succès');
        } catch (err) {
          console.error('Erreur chargement initial:', err);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []); // Seulement au montage

  // Effet pour les filtres - recharge quand les filtres changent
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVendeurs();
    }, 300); // Debounce de 300ms pour les filtres
    
    return () => clearTimeout(timer);
  }, [filterStatut, filterActif, fetchVendeurs]);

  // Effet pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchVendeurs(searchTerm);
      } else if (searchTerm.length === 0) {
        fetchVendeurs();
      }
    }, 500); // Debounce de 500ms pour la recherche
    
    return () => clearTimeout(timer);
  }, [searchTerm, searchVendeurs, fetchVendeurs]);

  // Afficher le skeleton pendant le chargement initial
  if (loading && vendeurs.length === 0) {
    return (
      <DashboardAdminLayout>
        <SkeletonLoader />
      </DashboardAdminLayout>
    );
  }

  // Afficher une erreur si nécessaire
  if (error && vendeurs.length === 0) {
    return (
      <DashboardAdminLayout>
        <div className="">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchVendeurs();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardAdminLayout>
    );
  }

  return (
    <DashboardAdminLayout>
      <div className="">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">Gestion des Vendeurs</h1>
          <p className="text-gray-600 mt-2">
            {loading ? 'Chargement...' : `${vendeurs.length} vendeur${vendeurs.length !== 1 ? 's' : ''} sur la plateforme`}
          </p>
        </div>

        {/* Filtres */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatut={filterStatut}
          setFilterStatut={setFilterStatut}
          filterActif={filterActif}
          setFilterActif={setFilterActif}
          loading={loading}
          onRefresh={() => {
            showNotification('info', 'Actualisation', 'Actualisation des données en cours...');
            fetchVendeurs();
            fetchStatistiques();
          }}
        />

        {/* Statistiques */}
        <Statistics statistiques={statistiques} loading={loadingStats} />

        {/* Liste des vendeurs */}
        <VendeursList
          vendeurs={vendeurs}
          loading={loading}
          searchTerm={searchTerm}
          filterStatut={filterStatut}
          filterActif={filterActif}
          actionLoading={actionLoading}
          onViewDetails={viewVendeurDetails}
          onUpdateStatus={updateStatutVendeur}
          onDelete={deleteVendeur}
        />

        {/* Modal de détails */}
        {showDetailsModal && (
          <VendeurDetailsModal
            vendeur={selectedVendeur}
            actionLoading={actionLoading}
            onClose={() => setShowDetailsModal(false)}
            onUpdateStatus={updateStatutVendeur}
          />
        )}

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
          showInput={confirmationModal.showInput}
          inputPlaceholder={confirmationModal.inputPlaceholder}
          inputRequired={confirmationModal.inputRequired}
        />

        {/* Container de notifications */}
        <ToastContainer 
          notifications={notifications}
          onClose={closeNotification}
        />
      </div>
    </DashboardAdminLayout>
  );
};

export default VendeursPage;