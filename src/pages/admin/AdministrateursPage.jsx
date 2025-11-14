import React, { useState, useEffect } from 'react';
import DashboardAdminLayout from '../../components/admin/DashboardAdminLayout';
import AdminHeader from '../../components/admin/adminParty/AdminHeader';
import AdminFilters from '../../components/admin/adminParty/AdminFilters';
import AdminTable from '../../components/admin/adminParty/AdminTable';
import AdminStats from '../../components/admin/adminParty/AdminStats';
import LoadingState from '../../components/admin/adminParty/LoadingState';
import ErrorState from '../../components/admin/adminParty/ErrorState';
import EmptyState from '../../components/admin/adminParty/EmptyState';
import CreateAdminModal from '../../components/admin/CreateAdminModal';
import AdminInvitationModal from '../../components/admin/AdminInvitationModal';
import ModalDetail from '../../components/admin/adminParty/ModalDetail';
import ModalEdit from '../../components/admin/adminParty/ModalEdit';
import ToastContainer from '../../components/common/ToastContainer';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdministrateursPage = () => {
  const [administrateurs, setAdministrateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('tous');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [demandesEnAttente, setDemandesEnAttente] = useState([]);
  
  // États pour les modales
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
    isLoading: false
  });

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
        showNotification('error', 'Erreur', 'Erreur lors de l\'exécution de l\'action');
      }
    }
  };

  const fetchDemandesEnAttente = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/demandes-en-attente', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setDemandesEnAttente(data.data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des demandes:', err);
      showNotification('error', 'Erreur', 'Erreur lors du chargement des demandes en attente');
    }
  };

  const fetchAdministrateurs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:8000/api/admin/administrateurs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des administrateurs');
      }

      const data = await response.json();
      
      if (data.success) {
        const demandesResponse = await fetch('http://localhost:8000/api/admin/demandes-en-attente', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        const demandesData = await demandesResponse.json();
        let demandesMap = {};
        
        if (demandesData.success) {
          setDemandesEnAttente(demandesData.data || []);
          demandesData.data.forEach(demande => {
            demandesMap[demande.candidat.email] = demande.idDemande;
          });
        }

        const adminsAvecDemande = data.data.map(admin => ({
          ...admin,
          idDemande: !admin.est_actif ? demandesMap[admin.email] : null
        }));

        setAdministrateurs(adminsAvecDemande);
        showNotification('success', 'Chargement réussi', `${data.data.length} administrateur(s) chargé(s)`);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
      showNotification('error', 'Erreur', 'Erreur lors du chargement des administrateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministrateurs();
    fetchDemandesEnAttente();
  }, []);

  const trouverIdDemande = (emailAdmin) => {
    const demande = demandesEnAttente.find(d => d.candidat.email === emailAdmin);
    return demande ? demande.idDemande : null;
  };

  // FONCTION AMÉLIORÉE POUR VALIDER UN ADMINISTRATEUR
  const validerAdministrateur = async (admin) => {
    const idDemande = trouverIdDemande(admin.email);
    
    if (!idDemande) {
      showNotification('error', 'Erreur', 'Aucune demande trouvée pour cet administrateur');
      return;
    }

    showConfirmation({
      title: 'Valider l\'administrateur',
      message: `Êtes-vous sûr de vouloir valider ${admin.nom_complet} (${admin.email}) ? Cet administrateur aura accès au système.`,
      type: 'info',
      confirmText: 'Valider',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`http://localhost:8000/api/admin/demandes/${idDemande}/valider`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
          });

          const data = await response.json();

          if (data.success) {
            fetchAdministrateurs();
            fetchDemandesEnAttente();
            showNotification('success', 'Validation réussie', `${admin.nom_complet} a été validé avec succès !`);
          } else {
            showNotification('error', 'Erreur', data.message || 'Erreur lors de la validation');
            throw new Error(data.message);
          }
        } catch (err) {
          showNotification('error', 'Erreur', 'Erreur de connexion lors de la validation');
          throw err;
        }
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR REJETER UN ADMINISTRATEUR
  const rejeterAdministrateur = async (admin) => {
    const idDemande = trouverIdDemande(admin.email);
    
    if (!idDemande) {
      showNotification('error', 'Erreur', 'Aucune demande trouvée pour cet administrateur');
      return;
    }

    showConfirmation({
      title: 'Rejeter l\'administrateur',
      message: `Vous allez rejeter la demande de ${admin.nom_complet}. Veuillez saisir la raison du rejet :`,
      type: 'warning',
      confirmText: 'Rejeter',
      cancelText: 'Annuler',
      showInput: true,
      inputPlaceholder: 'Raison du rejet...',
      inputRequired: true,
      onConfirm: async (raison) => {
        if (!raison || raison.trim() === '') {
          showNotification('error', 'Erreur', 'La raison du rejet est obligatoire');
          return;
        }

        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`http://localhost:8000/api/admin/demandes/${idDemande}/rejeter`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ raison_rejet: raison.trim() })
          });

          const data = await response.json();

          if (data.success) {
            fetchAdministrateurs();
            fetchDemandesEnAttente();
            showNotification('success', 'Rejet réussi', `${admin.nom_complet} a été rejeté avec succès`);
          } else {
            showNotification('error', 'Erreur', data.message || 'Erreur lors du rejet');
            throw new Error(data.message);
          }
        } catch (err) {
          showNotification('error', 'Erreur', 'Erreur de connexion lors du rejet');
          throw err;
        }
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR SUPPRIMER UN ADMINISTRATEUR
  const deleteAdministrateur = async (admin) => {
    showConfirmation({
      title: 'Supprimer l\'administrateur',
      message: `Êtes-vous sûr de vouloir supprimer définitivement ${admin.nom_complet} (${admin.email}) ? Cette action est irréversible et supprimera tous ses accès au système.`,
      type: 'error',
      confirmText: 'Supprimer définitivement',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`http://localhost:8000/api/admin/administrateurs/${admin.idAdministrateur}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          const data = await response.json();

          if (data.success) {
            fetchAdministrateurs();
            showNotification('success', 'Suppression réussie', `${admin.nom_complet} a été supprimé avec succès`);
          } else {
            showNotification('error', 'Erreur', data.message || 'Erreur lors de la suppression');
            throw new Error(data.message);
          }
        } catch (err) {
          showNotification('error', 'Erreur', 'Erreur de connexion lors de la suppression');
          throw err;
        }
      }
    });
  };

  // Fonction pour mettre à jour un administrateur
  const handleUpdateAdmin = (updatedAdmin) => {
    setAdministrateurs(prev => 
      prev.map(admin => 
        admin.idAdministrateur === updatedAdmin.idAdministrateur 
          ? { ...admin, ...updatedAdmin }
          : admin
      )
    );
  };

  // Handlers pour les modales
  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowDetailModal(true);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleDelete = (admin) => {
    deleteAdministrateur(admin);
  };

  const filteredAdministrateurs = administrateurs.filter(admin => {
    const matchesSearch = 
      admin.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.telephone?.includes(searchTerm);
    
    const matchesFilter = 
      filterNiveau === 'tous' || 
      admin.niveau_acces === filterNiveau;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchAdministrateurs} />;

  return (
    <DashboardAdminLayout>
      <div className="">
        <AdminHeader 
          totalAdmins={administrateurs.length}
          filteredAdmins={filteredAdministrateurs.length}
          showAddMenu={showAddMenu}
          onAddMenuToggle={setShowAddMenu}
          onCreateAdmin={() => setShowCreateModal(true)}
          onInviteAdmin={() => setShowInvitationModal(true)}
        />

        <div className="">
          <AdminFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterNiveau={filterNiveau}
            onFilterChange={setFilterNiveau}
          />
          
          {administrateurs.length > 0 && (
            <AdminStats administrateurs={administrateurs} />
          )}

          {filteredAdministrateurs.length === 0 ? (
            <EmptyState 
              hasAdmins={administrateurs.length > 0}
              searchTerm={searchTerm}
            />
          ) : (
            <AdminTable
              administrateurs={filteredAdministrateurs}
              onValider={validerAdministrateur}
              onRejeter={rejeterAdministrateur}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAdminCreated={() => {
          setShowCreateModal(false);
          fetchAdministrateurs();
          showNotification('success', 'Création réussie', 'Nouvel administrateur créé avec succès');
        }}
      />

      <AdminInvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        onInvitationSent={() => {
          setShowInvitationModal(false);
          showNotification('success', 'Invitation envoyée', 'L\'invitation a été envoyée avec succès');
        }}
      />

      <ModalDetail
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
      />

      <ModalEdit
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onUpdate={(updatedAdmin) => {
          handleUpdateAdmin(updatedAdmin);
          showNotification('success', 'Modification réussie', 'Administrateur modifié avec succès');
        }}
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
        showInput={confirmationModal.showInput}
        inputPlaceholder={confirmationModal.inputPlaceholder}
        inputRequired={confirmationModal.inputRequired}
      />

      {/* Container de notifications */}
      <ToastContainer 
        notifications={notifications}
        onClose={closeNotification}
      />
    </DashboardAdminLayout>
  );
};

export default AdministrateursPage;