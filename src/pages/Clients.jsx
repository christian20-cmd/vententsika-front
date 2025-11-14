import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

// Composants
import SkeletonLoading from '../components/clients/SkeletonLoading';
import StatCard from '../components/clients/StatCard';
import ClientRow from '../components/clients/ClientRow';
import ClientModal from '../components/clients/ClientModal';
import AddClientModal from '../components/clients/AddClientModal';
import EditClientModal from '../components/clients/EditClientModal';
import FilterSystem from '../components/clients/FilterSystem';
import ToastContainer from '../components/common/ToastContainer';
import { useToast } from '../hooks/useToast';
import { Plus, UserPlus, Users } from 'lucide-react';

const Clients = () => {
  const navigate = useNavigate();
  const {
    notifications,
    removeNotification,
    success,
    error,
    warning,
    info,
    confirm
  } = useToast();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [statistiques, setStatistiques] = useState({});

  // États pour le filtrage
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('tous');
  const [sortBy, setSortBy] = useState('nom_asc');
  const searchInputRef = useRef(null);

  const [newClient, setNewClient] = useState({
    nom_prenom_client: '',
    email_client: '',
    adresse_client: '',
    cin_client: '',
    telephone_client: '',
    password_client: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.error('Aucun token trouvé dans le localStorage');
      window.location.href = '/connexion';
      return {};
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  };

  // Focus sur l'input quand la recherche s'étend
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    
    console.log('Token (auth_token):', token);
    console.log('User:', user);
    
    if (!token) {
      console.warn('Aucun token trouvé, redirection vers la connexion');
      navigate('/connexion');
      return;
    }

    fetchClients();
    fetchStatistiques();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      setClients(response.data);
      
      if (response.data.length === 0) {
        info(
          'Aucun Client',
          'Vous n\'avez pas encore de clients dans votre base de données.',
          { duration: 4000 }
        );
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      error(
        'Erreur de Chargement',
        'Impossible de charger la liste des clients. Vérifiez votre connexion.',
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistiques = async () => {
    try {
      const response = await api.get('/clients/statistiques');
      setStatistiques(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      warning(
        'Données Partielles',
        'Les statistiques n\'ont pas pu être chargées complètement.',
        { duration: 4000 }
      );
    }
  };

  const handleProductSelection = (idClient) => {
    const client = clients.find(c => c.idClient === idClient);
    if (client) {
      const clientInfo = {
        idClient: client.idClient,
        nom_prenom_client: client.nom_prenom_client,
        email_client: client.email_client,
        telephone_client: client.telephone_client,
        adresse_client: client.adresse_client,
        cin_client: client.cin_client
      };
      
      localStorage.setItem('selectedClientForOrder', JSON.stringify(clientInfo));
      
      success(
        'Client Sélectionné',
        `${client.nom_prenom_client} a été sélectionné pour la commande. Redirection vers les produits...`,
        { type: 'cart', duration: 3000 }
      );
      
      setTimeout(() => {
        navigate('/produits');
      }, 2000);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      // Validation des champs requis
      if (!newClient.nom_prenom_client.trim()) {
        error('Champ Manquant', 'Le nom et prénom sont obligatoires.', { duration: 5000 });
        return;
      }
      
      if (!newClient.email_client.trim()) {
        error('Champ Manquant', 'L\'email est obligatoire.', { duration: 5000 });
        return;
      }

      if (!newClient.cin_client.trim()) {
        error('Champ Manquant', 'Le CIN est obligatoire.', { duration: 5000 });
        return;
      }

      if (!newClient.telephone_client.trim()) {
        error('Champ Manquant', 'Le téléphone est obligatoire.', { duration: 5000 });
        return;
      }

      info(
        'Ajout en Cours',
        'Création du client...',
        { duration: 2000 }
      );

      await axios.post('http://localhost:8000/api/clients', newClient, {
        headers: getAuthHeaders()
      });

      setShowAddModal(false);
      setNewClient({
        nom_prenom_client: '',
        email_client: '',
        adresse_client: '',
        cin_client: '',
        telephone_client: '',
        password_client: ''
      });
      
      success(
        'Client Ajouté',
        'Le client a été ajouté avec succès!',
        { type: 'user', duration: 4000 }
      );
      
      fetchClients();
      fetchStatistiques();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      
      const errorMessage = error.response?.data?.message 
        ? `Erreur: ${error.response.data.message}`
        : 'Erreur lors de l\'ajout du client';
        
      error('Erreur d\'Ajout', errorMessage, { duration: 6000 });
    }
  };

  const handleEditClient = (client) => {
    setEditingClient({ ...client });
    setShowEditModal(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      // Validation des champs requis
      if (!editingClient.nom_prenom_client.trim()) {
        error('Champ Manquant', 'Le nom et prénom sont obligatoires.', { duration: 5000 });
        return;
      }
      
      if (!editingClient.email_client.trim()) {
        error('Champ Manquant', 'L\'email est obligatoire.', { duration: 5000 });
        return;
      }

      info(
        'Modification en Cours',
        'Mise à jour du client...',
        { duration: 2000 }
      );

      await axios.put(
        `http://localhost:8000/api/clients/${editingClient.idClient}`, 
        editingClient, 
        { headers: getAuthHeaders() }
      );

      success(
        'Client Modifié',
        'Le client a été modifié avec succès!',
        { type: 'user', duration: 4000 }
      );
      
      setShowEditModal(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Erreur lors de la modification du client:', error);
      
      const errorMessage = error.response?.data?.message 
        ? `Erreur: ${error.response.data.message}`
        : 'Erreur lors de la modification du client';
        
      error('Erreur de Modification', errorMessage, { duration: 6000 });
    }
  };

  const handleDeleteClient = async (id, nom) => {
    confirm(
      'Confirmer la Suppression',
      `Êtes-vous sûr de vouloir supprimer le client "${nom}" ? Cette action est irréversible.`,
      async () => {
        try {
          info(
            'Suppression en Cours',
            `Suppression du client "${nom}"...`,
            { duration: 2000 }
          );

          await axios.delete(`http://localhost:8000/api/clients/${id}`, {
            headers: getAuthHeaders()
          });
          
          success(
            'Client Supprimé',
            `Le client "${nom}" a été supprimé avec succès!`,
            { type: 'user', duration: 4000 }
          );
          
          fetchClients();
          fetchStatistiques();
        } catch (error) {
          if (error.response?.status === 422) {
            error(
              'Suppression Impossible',
              'Impossible de supprimer ce client : il a des commandes ou paniers associés. Veuillez d\'abord supprimer les commandes liées.',
              { duration: 7000 }
            );
          } else if (error.response?.status === 404) {
            error(
              'Client Non Trouvé',
              'Le client que vous essayez de supprimer n\'existe pas ou a déjà été supprimé.',
              { duration: 5000 }
            );
          } else {
            error(
              'Erreur de Suppression',
              'Une erreur est survenue lors de la suppression du client. Veuillez réessayer.',
              { duration: 5000 }
            );
          }
        }
      }
    );
  };

  // Fonction de recherche et filtrage
  const filteredClients = clients.filter(client => {
    // Filtrage par recherche
    const matchesSearch = searchTerm === '' || 
      client.nom_prenom_client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email_client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cin_client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.adresse_client?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrage par statut
    let matchesFilter = true;
    switch (filterStatus) {
      case 'avec_commandes': {
        matchesFilter = (client.commandes_count || 0) > 0;
        break;
      }
      case 'avec_paniers': {
        matchesFilter = (client.paniers_count || 0) > 0;
        break;
      }
      case 'sans_activite': {
        matchesFilter = (client.commandes_count || 0) === 0 && (client.paniers_count || 0) === 0;
        break;
      }
      case 'recent': {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        matchesFilter = client.date_creation ? new Date(client.date_creation) > oneMonthAgo : false;
        break;
      }
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Tri
    switch (sortBy) {
      case 'nom_asc': {
        return (a.nom_prenom_client || '').localeCompare(b.nom_prenom_client || '');
      }
      case 'nom_desc': {
        return (b.nom_prenom_client || '').localeCompare(a.nom_prenom_client || '');
      }
      case 'commandes_desc': {
        return (b.commandes_count || 0) - (a.commandes_count || 0);
      }
      case 'commandes_asc': {
        return (a.commandes_count || 0) - (b.commandes_count || 0);
      }
      case 'paniers_desc': {
        return (b.paniers_count || 0) - (a.paniers_count || 0);
      }
      case 'date_desc': {
        return new Date(b.date_creation || 0) - new Date(a.date_creation || 0);
      }
      case 'date_asc': {
        return new Date(a.date_creation || 0) - new Date(b.date_creation || 0);
      }
      default: {
        return 0;
      }
    }
  });

  // Notification pour les résultats de recherche
  useEffect(() => {
    if (searchTerm && filteredClients.length === 0) {
      info(
        'Aucun Résultat',
        `Aucun client ne correspond à votre recherche : "${searchTerm}"`,
        { duration: 4000 }
      );
    }
  }, [searchTerm, filteredClients.length]);

  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <div className="min-h-screen">
      {/* Container de notifications */}
      <ToastContainer 
        notifications={notifications}
        onClose={removeNotification}
      />

      {/* Header */}
      <div className="">
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-black">Gestion des Clients</h1>
                <p className="text-gray-600">Gérez vos clients et consultez leurs activités</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-2 font-bold bg-blue-800 text-white rounded-2xl hover:bg-blue-800/60 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="h-5 w-5" />
              <span>Ajouter un Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-4">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Clients"
            value={statistiques.total_clients || 0}
            icon="users"
            color="blue"
          />
          <StatCard
            title="Avec Commandes"
            value={statistiques.clients_avec_commandes || 0}
            icon="package"
            color="green"
          />
          <StatCard
            title="Avec Paniers"
            value={statistiques.clients_avec_paniers || 0}
            icon="shopping-cart"
            color="orange"
          />
          <StatCard
            title="Taux Conversion"
            value={`${statistiques.taux_conversion || 0}%`}
            icon="dollar-sign"
            color="purple"
          />
        </div>

        {/* Système de filtrage */}
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
          searchInputRef={searchInputRef}
          onRefresh={fetchClients}
          filteredClientsCount={filteredClients.length}
        />

        {/* Liste des clients */}
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-600 overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun client trouvé</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || filterStatus !== 'tous' ? 'Aucun client ne correspond à vos critères.' : 'Vous n\'avez pas encore de clients.'}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Ajouter votre premier client
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <ClientRow
                      key={client.idClient}
                      client={client}
                      onViewDetails={() => {
                        setSelectedClient(client);
                        setShowModal(true);
                      }}
                      onEdit={() => handleEditClient(client)}
                      onDelete={() => handleDeleteClient(client.idClient, client.nom_prenom_client)}
                      onSelectProducts={() => handleProductSelection(client.idClient)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
          }}
        />
      )}

      {showAddModal && (
        <AddClientModal
          client={newClient}
          onChange={setNewClient}
          onSave={handleAddClient}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && editingClient && (
        <EditClientModal
          client={editingClient}
          onChange={setEditingClient}
          onSave={handleUpdateClient}
          onClose={() => {
            setShowEditModal(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
};

export default Clients;