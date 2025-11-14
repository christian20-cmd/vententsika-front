import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Inbox } from 'lucide-react';
import axios from 'axios';

// Hooks
import { useCommandes } from '../hooks/useCommandes';

// Composants
import { CartesStatistiques } from '../components/commandes/CartesStatistiques';
import { OngletsFiltre } from '../components/commandes/OngletsFiltre';
import { CommandesFiltres } from '../components/commandes/CommandesFiltres';
import { CarteCommandeActive } from '../components/commandes/CarteCommandeActive';
import { CarteCommandeAnnulee } from '../components/commandes/CarteCommandeAnnulee';
import { SkeletonCarteCommande } from '../components/commandes/SkeletonCarteCommande';
import { SkeletonStatistiques } from '../components/commandes/SkeletonStatistiques';
import { SkeletonOnglets } from '../components/commandes/SkeletonOnglets';
import ToastContainer from '../components/common/ToastContainer';
import ConfirmationModal from '../components/common/ConfirmationModal';

// Modals
import { ModalDetails } from '../components/commandes/ModalDetails';
import { ModalCreationCommande } from '../components/commandes/ModalCreationCommande';
import { ModalRestoration } from '../components/commandes/ModalRestoration';
import { ModalDuplication } from '../components/commandes/ModalDuplication';
import { ModalSelectProduct } from '../components/commandes/ModalSelectProduct';
import { ModalChoixAnnulation } from '../components/commandes/ModalChoixAnnulation';
import { ModalPaiement } from '../components/commandes/ModalPaiement';
import { ModalSuppression } from '../components/commandes/ModalSuppression';
import { ModalModification } from '../components/commandes/ModalModification';

const Commandes = () => {
  const [activeTab, setActiveTab] = useState('toutes');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [commandeARestaurer, setCommandeARestaurer] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [commandeADupliquer, setCommandeADupliquer] = useState(null);
  const [produitsModifies, setProduitsModifies] = useState([]);
  const [showSelectProductModal, setShowSelectProductModal] = useState(false);
  const [produitsDisponibles, setProduitsDisponibles] = useState([]);
  const [rechercheProduit, setRechercheProduit] = useState('');
  const [showAnnulationModal, setShowAnnulationModal] = useState(false);
  const [commandeAAnnuler, setCommandeAAnnuler] = useState(null);
  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [commandeAPayer, setCommandeAPayer] = useState(null);
  const [formPaiement, setFormPaiement] = useState({
    montant: '',
    methode_paiement: 'especes'
  });

  // États pour les notifications
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

  // NOUVELLES FONCTIONS POUR SUPPRESSION ET MODIFICATION
  const [showSuppressionModal, setShowSuppressionModal] = useState(false);
  const [commandeASupprimer, setCommandeASupprimer] = useState(null);
  const [typeSuppression, setTypeSuppression] = useState('normale');
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [commandeAModifier, setCommandeAModifier] = useState(null);

  // États pour le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navigate = useNavigate();
  
  // Utiliser le hook personnalisé
  const {
    commandes,
    commandesAnnulees,
    loading,
    statistiques,
    commandeEnPreparation,
    fetchCommandes,
    fetchCommandesAnnulees,
    fetchStatistiques,
    updateStatutCommande,
    genererFacture,
    setCommandeEnPreparation,
    getAuthHeaders,
    supprimerCommande,
    supprimerDefinitivementCommande,
    modifierCommandeInfos
  } = useCommandes();

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

  // Fonction de recherche et filtrage
  const getCommandesFiltrees = () => {
    let commandesFiltrees = [];
    
    console.log('🔍 Filtrage - Données disponibles:');
    console.log('   - Commandes actives:', commandes.length);
    console.log('   - Commandes annulées:', commandesAnnulees.length);
    console.log('   - Onglet actif:', activeTab);

    // Utiliser les bonnes sources de données
    switch (activeTab) {
      case 'toutes':
        commandesFiltrees = [...commandes];
        break;
      case 'attente_validation':
        commandesFiltrees = commandes.filter(c => c.statut === 'attente_validation');
        break;
      case 'validee':
        commandesFiltrees = commandes.filter(c => c.statut === 'validee');
        break;
      case 'en_preparation':
        commandesFiltrees = commandes.filter(c => c.statut === 'en_preparation');
        break;
      case 'livree':
        commandesFiltrees = commandes.filter(c => c.statut === 'livree');
        break;
      case 'annulees':
        commandesFiltrees = [...commandesAnnulees];
        break;
      default:
        commandesFiltrees = [...commandes];
    }

    console.log(`📊 Après sélection onglet "${activeTab}":`, commandesFiltrees.length);

    // Appliquer la recherche
    if (searchTerm && commandesFiltrees.length > 0) {
      const terme = searchTerm.toLowerCase();
      commandesFiltrees = commandesFiltrees.filter(commande =>
        commande.numero_commande?.toLowerCase().includes(terme) ||
        commande.client?.nom_prenom_client?.toLowerCase().includes(terme) ||
        commande.adresse_livraison?.toLowerCase().includes(terme) ||
        commande.lignes_commande?.some(ligne => 
          ligne.produit?.nom_produit?.toLowerCase().includes(terme)
        )
      );
    }

    // Appliquer le filtre de statut UNIQUEMENT pour l'onglet "toutes"
    if (filterStatus !== 'tous' && activeTab === 'toutes') {
      commandesFiltrees = commandesFiltrees.filter(commande => 
        commande.statut === filterStatus
      );
    }

    // Tri
    commandesFiltrees = [...commandesFiltrees].sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.created_at || b.date_creation) - new Date(a.created_at || a.date_creation);
        case 'date_asc':
          return new Date(a.created_at || a.date_creation) - new Date(b.created_at || b.date_creation);
        case 'montant_desc':
          return (b.total_commande || 0) - (a.total_commande || 0);
        case 'montant_asc':
          return (a.total_commande || 0) - (b.total_commande || 0);
        default:
          return 0;
      }
    });

    return commandesFiltrees;
  };

  // Debug des données et du filtrage
  useEffect(() => {
    console.log('🔍 Debug Filtrage:');
    console.log('   - Active Tab:', activeTab);
    console.log('   - Commandes actives:', commandes.length);
    console.log('   - Commandes annulées:', commandesAnnulees.length);
    console.log('   - Commandes filtrées:', getCommandesFiltrees().length);

    if (activeTab === 'annulees') {
      console.log('   - Détails commandes annulées:', commandesAnnulees);
    }
  }, [activeTab, commandes, commandesAnnulees, searchTerm, filterStatus, sortBy]);

  // Ouvrir le modal de création si une commande est en préparation
  useEffect(() => {
    if (commandeEnPreparation) {
      setShowCreateModal(true);
    }
  }, [commandeEnPreparation]);

  // FONCTIONS POUR LES MODALS

  const ouvrirModalAnnulation = (commande) => {
    setCommandeAAnnuler(commande);
    setShowAnnulationModal(true);
  };

  const ouvrirModalPaiement = (commande) => {
    setCommandeAPayer(commande);
    setFormPaiement({
      montant: commande.montant_reste_payer || commande.total_commande,
      methode_paiement: 'especes'
    });
    setShowPaiementModal(true);
  };

  // NOUVELLES FONCTIONS AMÉLIORÉES POUR SUPPRESSION ET MODIFICATION
  const ouvrirModalSuppression = (commande) => {
    showConfirmation({
      title: 'Supprimer la commande',
      message: `Êtes-vous sûr de vouloir supprimer la commande #${commande.numero_commande} ? Cette action déplacera la commande vers les commandes annulées.`,
      type: 'warning',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        await confirmerSuppression(commande, false);
      }
    });
  };

  const ouvrirModalSuppressionDefinitive = (commande) => {
    showConfirmation({
      title: 'Supprimer définitivement',
      message: `Êtes-vous sûr de vouloir supprimer définitivement la commande #${commande.numero_commande} ? Cette action est irréversible et supprimera complètement la commande du système.`,
      type: 'error',
      confirmText: 'Supprimer définitivement',
      cancelText: 'Annuler',
      onConfirm: async () => {
        await confirmerSuppression(commande, true);
      }
    });
  };

  const ouvrirModalModification = (commande) => {
    setCommandeAModifier(commande);
    setShowModificationModal(true);
  };

  // FONCTION AMÉLIORÉE POUR LA DUPLICATION AVEC CONFIRMATION
  const dupliquerCommande = async (commande) => {
    showConfirmation({
      title: 'Dupliquer la commande',
      message: `Êtes-vous sûr de vouloir dupliquer la commande #${commande.numero_commande} ? Vous pourrez modifier les produits avant de créer la nouvelle commande.`,
      type: 'info',
      confirmText: 'Dupliquer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          setCommandeADupliquer(commande);
          setProduitsModifies(commande.lignes_commande.map(ligne => ({
            ...ligne,
            quantite_modifiee: ligne.quantite,
            idProduit: ligne.idProduit,
            produit: ligne.produit
          })));
          await fetchProduitsDisponibles();
          setShowDuplicateModal(true);
        } catch (error) {
          showNotification('error', 'Erreur', 'Erreur lors de la préparation de la duplication');
        }
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR LA RESTAURATION AVEC CONFIRMATION
  const restaurerCommande = (commande) => {
    showConfirmation({
      title: 'Restaurer la commande',
      message: `Êtes-vous sûr de vouloir restaurer la commande #${commande.numero_commande} ? La commande sera remise en attente de validation.`,
      type: 'warning',
      confirmText: 'Restaurer',
      cancelText: 'Annuler',
      onConfirm: () => {
        setCommandeARestaurer(commande);
        setShowRestoreModal(true);
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR CHANGER LE STATUT AVEC CONFIRMATION
  const handleUpdateStatutWithConfirmation = async (idCommande, nouveauStatut, commande) => {
    const statutsLabels = {
      'attente_validation': 'en attente de validation',
      'validee': 'validée',
      'en_preparation': 'en préparation',
      'livree': 'livrée'
    };

    showConfirmation({
      title: `Marquer comme ${statutsLabels[nouveauStatut]}`,
      message: `Êtes-vous sûr de vouloir marquer la commande #${commande.numero_commande} comme ${statutsLabels[nouveauStatut]} ?`,
      type: 'info',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          await updateStatutCommande(idCommande, nouveauStatut);
          showNotification('success', 'Statut mis à jour', `La commande a été marquée comme ${statutsLabels[nouveauStatut]}`);
        } catch (error) {
          showNotification('error', 'Erreur', 'Erreur lors de la mise à jour du statut');
          throw error;
        }
      }
    });
  };

  // Charger les produits disponibles
  const fetchProduitsDisponibles = async () => {
    try {
      showNotification('info', 'Chargement', 'Chargement des produits disponibles...', 2000);
      
      const response = await axios.get('http://localhost:8000/api/produits', {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        setProduitsDisponibles(response.data.produits || []);
        showNotification('success', 'Produits chargés', 'Les produits disponibles ont été chargés avec succès', 3000);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      showNotification('error', 'Erreur', 'Impossible de charger les produits disponibles');
    }
  };

  // FONCTION AMÉLIORÉE POUR CRÉER UNE COMMANDE
  const creerCommandeDepuisPreparation = async (donneesPaiement) => {
    if (!commandeEnPreparation) return;
    
    showConfirmation({
      title: 'Créer la commande',
      message: `Êtes-vous sûr de vouloir créer cette commande pour ${commandeEnPreparation.client.nom_prenom_client} ? Montant total: ${commandeEnPreparation.produits.reduce((total, produit) => {
        const prix = produit.prix_promotion || produit.prix_unitaire;
        return total + (prix * produit.quantite);
      }, 0).toLocaleString('fr-FR')} Ar`,
      type: 'info',
      confirmText: 'Créer la commande',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          console.log('🚀 DONNÉES PAIEMENT REÇUES DANS COMMANDES.JS:', donneesPaiement);
          
          const commandeData = {
            idClient: commandeEnPreparation.client.idClient,
            produits: commandeEnPreparation.produits.map(item => ({
              idProduit: item.idProduit,
              quantite: item.quantite,
              prix_unitaire: item.prix_unitaire,
              prix_promotion: item.prix_promotion || null
            })),
            montant_total: commandeEnPreparation.produits.reduce((total, produit) => {
              const prix = produit.prix_promotion || produit.prix_unitaire;
              return total + (prix * produit.quantite);
            }, 0),
            statut: 'attente_validation',
            adresse_livraison: donneesPaiement?.adresse_livraison || commandeEnPreparation.client.adresse_client || 'Adresse à préciser',
            date_livraison: donneesPaiement?.date_livraison || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Commande créée depuis la sélection produits',
            choix_paiement: donneesPaiement?.choix_paiement || 'non_paye',
            montant_paye: donneesPaiement?.montant_paye || 0,
            methode_paiement: donneesPaiement?.methode_paiement || 'especes'
          };

          console.log('🎯 DONNÉES FINALES ENVOYÉES À L\'API:', commandeData);

          const response = await axios.post('http://localhost:8000/api/commandes', commandeData, {
            headers: getAuthHeaders()
          });
          
          console.log('✅ RÉPONSE DE L\'API COMMANDES:', response.data);
          
          if (response.data.success) {
            showNotification('success', 'Commande créée', 'La commande a été créée avec succès et est en attente de validation');
            setShowCreateModal(false);
            setCommandeEnPreparation(null);
            fetchCommandes();
            fetchStatistiques();
          } else {
            throw new Error(response.data.message || 'Erreur lors de la création de la commande');
          }
        } catch (error) {
          console.error('❌ ERREUR DÉTAILLÉE CRÉATION COMMANDE:', error);
          
          if (error.response?.data?.erreurs_stock) {
            const erreurs = error.response.data.erreurs_stock.map(e =>
              `${e.produit}: demandé ${e.quantite_demandee}, disponible ${e.stock_disponible}`
            ).join('\n');
            showNotification('error', 'Stocks insuffisants', erreurs, 6000);
          } else if (error.response?.status === 422) {
            const errors = error.response.data.errors;
            const errorMessages = Object.values(errors).flat().join('\n');
            showNotification('error', 'Erreur de validation', errorMessages, 6000);
          } else {
            showNotification('error', 'Erreur', 'Erreur lors de la création de la commande. Veuillez réessayer.');
          }
          throw error;
        }
      }
    });
  };

  const fermerModalCreation = () => {
    showConfirmation({
      title: 'Annuler la création',
      message: 'Êtes-vous sûr de vouloir annuler la création de cette commande ? Tous les produits sélectionnés seront perdus.',
      type: 'warning',
      confirmText: 'Oui, annuler',
      cancelText: 'Continuer',
      onConfirm: () => {
        setShowCreateModal(false);
        setCommandeEnPreparation(null);
        navigate('/commandes', { replace: true });
        showNotification('info', 'Création annulée', 'La création de la commande a été annulée');
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR CONFIRMER L'ANNULATION
  const confirmerAnnulation = async () => {
    if (!commandeAAnnuler) return;
    
    showConfirmation({
      title: 'Confirmer l\'annulation',
      message: `Êtes-vous sûr de vouloir annuler la commande #${commandeAAnnuler.numero_commande} ? Les stocks seront libérés et la commande sera déplacée vers les commandes annulées.`,
      type: 'error',
      confirmText: 'Oui, annuler',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const response = await axios.put(
            `http://localhost:8000/api/commandes/${commandeAAnnuler.idCommande}/annuler`,
            {},
            { headers: getAuthHeaders() }
          );
          if (response.data.success) {
            showNotification('success', 'Commande annulée', 'La commande a été annulée avec succès et les stocks ont été libérés');
            setShowAnnulationModal(false);
            setCommandeAAnnuler(null);
            await fetchCommandes();
            await fetchStatistiques();
            setActiveTab('annulees');
          } else {
            throw new Error(response.data.message || 'Erreur lors de l\'annulation');
          }
        } catch (error) {
          console.error('Erreur lors de l\'annulation de la commande:', error);
          if (error.response?.data?.message) {
            showNotification('error', 'Erreur', error.response.data.message);
          } else {
            showNotification('error', 'Erreur', "Erreur lors de l'annulation de la commande");
          }
          throw error;
        }
      }
    });
  };

  // FONCTIONS AMÉLIORÉES POUR SUPPRESSION ET MODIFICATION
  const confirmerSuppression = async (commande, isDefinitive = false) => {
    try {
      let result;
      
      if (isDefinitive) {
        result = await supprimerDefinitivementCommande(commande.idCommande);
      } else {
        result = await supprimerCommande(commande.idCommande);
      }
      
      if (result.success) {
        showNotification('success', 'Suppression réussie', result.message);
        setShowSuppressionModal(false);
        setCommandeASupprimer(null);
        await fetchCommandes();
        await fetchCommandesAnnulees();
        await fetchStatistiques();
      } else {
        showNotification('error', 'Erreur', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showNotification('error', 'Erreur', 'Erreur lors de la suppression');
      throw error;
    }
  };

  const confirmerModification = async (idCommande, donneesModifiees) => {
    try {
      const result = await modifierCommandeInfos(idCommande, donneesModifiees);
      
      if (result.success) {
        showNotification('success', 'Modification réussie', 'La commande a été modifiée avec succès');
        setShowModificationModal(false);
        setCommandeAModifier(null);
        await fetchCommandes();
      } else {
        showNotification('error', 'Erreur', result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      throw error;
    }
  };

  // FONCTION AMÉLIORÉE POUR CONFIRMER LA DUPLICATION
  const confirmerDuplication = async () => {
    if (!commandeADupliquer) return;
    
    if (produitsModifies.length === 0) {
      showNotification('warning', 'Attention', 'Veuillez ajouter au moins un produit à la commande');
      return;
    }
    
    showConfirmation({
      title: 'Confirmer la duplication',
      message: `Êtes-vous sûr de vouloir créer cette nouvelle commande basée sur la commande #${commandeADupliquer.numero_commande} ? Montant total: ${calculerTotalDuplication().toLocaleString('fr-FR')} Ar`,
      type: 'info',
      confirmText: 'Créer la commande',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const nouvelleCommandeData = {
            idClient: commandeADupliquer.idClient,
            produits: produitsModifies.map(produit => ({
              idProduit: produit.idProduit,
              quantite: produit.quantite_modifiee,
              prix_unitaire: produit.prix_unitaire,
              prix_promotion: produit.prix_promotion || null
            })),
            adresse_livraison: commandeADupliquer.adresse_livraison,
            date_livraison: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: `Duplication modifiée de la commande annulée #${commandeADupliquer.numero_commande}`,
            montant_total: calculerTotalDuplication(),
            statut: 'attente_validation',
            choix_paiement: 'non_paye',
            montant_paye: 0,
            methode_paiement: 'especes'
          };

          const response = await axios.post('http://localhost:8000/api/commandes', nouvelleCommandeData, {
            headers: getAuthHeaders()
          });
          
          if (response.data.success) {
            showNotification('success', 'Duplication réussie', 'La commande a été dupliquée et modifiée avec succès');
            setShowDuplicateModal(false);
            setCommandeADupliquer(null);
            setProduitsModifies([]);
            await fetchCommandes();
            await fetchStatistiques();
            if (activeTab === 'annulees') {
              setActiveTab('toutes');
            }
          } else {
            throw new Error(response.data.message || 'Erreur lors de la duplication');
          }
        } catch (error) {
          console.error('Erreur lors de la duplication de la commande:', error);
          
          if (error.response?.data?.erreurs_stock) {
            const erreurs = error.response.data.erreurs_stock.map(e =>
              `${e.produit}: demandé ${e.quantite_demandee}, disponible ${e.stock_disponible}`
            ).join('\n');
            showNotification('error', 'Stocks insuffisants', erreurs, 6000);
          } else if (error.response?.status === 422) {
            const errors = error.response.data.errors;
            const errorMessages = Object.values(errors).flat().join('\n');
            showNotification('error', 'Erreur de validation', errorMessages, 6000);
          } else {
            showNotification('error', 'Erreur', 'Erreur lors de la duplication de la commande. Veuillez réessayer.');
          }
          throw error;
        }
      }
    });
  };

  const calculerTotalDuplication = () => {
    return produitsModifies.reduce((total, produit) => {
      const prix = produit.prix_promotion || produit.prix_unitaire;
      return total + (prix * produit.quantite_modifiee);
    }, 0);
  };

  const modifierQuantiteProduit = (index, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) return;
    
    const nouveauxProduits = [...produitsModifies];
    nouveauxProduits[index] = {
      ...nouveauxProduits[index],
      quantite_modifiee: parseInt(nouvelleQuantite)
    };
    setProduitsModifies(nouveauxProduits);
  };

  const ajouterProduit = (produit) => {
    const produitExiste = produitsModifies.find(p => p.idProduit === produit.idProduit);
    
    if (produitExiste) {
      const nouveauxProduits = produitsModifies.map(p =>
        p.idProduit === produit.idProduit
          ? { ...p, quantite_modifiee: p.quantite_modifiee + 1 }
          : p
      );
      setProduitsModifies(nouveauxProduits);
    } else {
      const nouveauProduit = {
        idProduit: produit.idProduit,
        produit: {
          nom_produit: produit.nom_produit,
          reference: produit.reference,
          medias: produit.medias || []
        },
        prix_unitaire: produit.prix_unitaire,
        prix_promotion: produit.prix_promotion || null,
        quantite: 1,
        quantite_modifiee: 1,
        sous_total: produit.prix_promotion || produit.prix_unitaire
      };
      
      setProduitsModifies([...produitsModifies, nouveauProduit]);
    }
    
    setShowSelectProductModal(false);
    showNotification('success', 'Produit ajouté', `${produit.nom_produit} a été ajouté à la commande`, 3000);
  };

  const supprimerProduit = (index) => {
    showConfirmation({
      title: 'Retirer le produit',
      message: 'Êtes-vous sûr de vouloir retirer ce produit de la commande ?',
      type: 'warning',
      confirmText: 'Retirer',
      cancelText: 'Annuler',
      onConfirm: () => {
        const nouveauxProduits = produitsModifies.filter((_, i) => i !== index);
        setProduitsModifies(nouveauxProduits);
        showNotification('info', 'Produit supprimé', 'Le produit a été retiré de la commande', 3000);
      }
    });
  };

  // FONCTION AMÉLIORÉE POUR ENREGISTRER LE PAIEMENT
  const enregistrerPaiement = async () => {
    if (!commandeAPayer) return;

    showConfirmation({
      title: 'Enregistrer le paiement',
      message: `Êtes-vous sûr de vouloir enregistrer un paiement de ${parseFloat(formPaiement.montant).toLocaleString('fr-FR')} Ar pour la commande #${commandeAPayer.numero_commande} ?`,
      type: 'info',
      confirmText: 'Enregistrer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const response = await axios.post(
            `http://localhost:8000/api/commandes/${commandeAPayer.idCommande}/paiement`,
            formPaiement,
            { headers: getAuthHeaders() }
          );

          if (response.data.message) {
            showNotification('success', 'Paiement enregistré', 'Le paiement a été enregistré avec succès');
            setShowPaiementModal(false);
            setCommandeAPayer(null);
            fetchCommandes();
          }
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement du paiement:', error);
          showNotification('error', 'Erreur', 'Erreur lors de l\'enregistrement du paiement');
          throw error;
        }
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mt-4">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
                <p className="text-gray-600">Gérez et suivez toutes vos commandes</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/produits')}
              className="bg-blue-800 text-white px-6 py-2 font-bold rounded-2xl hover:bg-blue-900 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Nouvelle Commande</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-4">
        {/* Statistiques */}
        {loading ? <SkeletonStatistiques /> : <CartesStatistiques statistiques={statistiques} />}

        {/* Système de filtrage moderne */}
        <CommandesFiltres 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          isSearchExpanded={isSearchExpanded}
          setIsSearchExpanded={setIsSearchExpanded}
          fetchCommandes={fetchCommandes}
        />

        {/* Onglets de filtre */}
        {loading ? <SkeletonOnglets /> : (
          <OngletsFiltre 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            commandes={commandes}
            commandesAnnulees={commandesAnnulees}
          />
        )}

        {/* Liste des commandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
          {loading ? (
            // Skeleton screens pendant le chargement
            <>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <SkeletonCarteCommande key={item} />
              ))}
            </>
          ) : (
            <>
              {getCommandesFiltrees().length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-3xl shadow-lg border border-gray-200">
                  <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'annulees' ? 'Aucune commande annulée' : 'Aucune commande trouvée'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'annulees' 
                      ? 'Les commandes annulées apparaîtront ici.'
                      : activeTab === 'toutes'
                      ? 'Commencez par créer votre première commande.'
                      : `Aucune commande avec le statut "${activeTab}" pour le moment.`
                    }
                  </p>
                  {activeTab !== 'annulees' && (
                    <button
                      onClick={() => navigate('/produits')}
                      className="bg-blue-800 text-white px-6 py-3 rounded-2xl hover:bg-blue-900 transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <Plus size={16} />
                      <span>Créer une commande</span>
                    </button>
                  )}
                </div>
              ) : (
                getCommandesFiltrees().map((commande) => (
                  activeTab === 'annulees' ? (
                    <CarteCommandeAnnulee 
                      key={commande.idCommande} 
                      commande={commande}
                      setSelectedCommande={setSelectedCommande}
                      setShowModal={setShowModal}
                      setModalType={setModalType}
                      dupliquerCommande={() => dupliquerCommande(commande)}
                      restaurerCommande={() => restaurerCommande(commande)}
                      ouvrirModalSuppressionDefinitive={ouvrirModalSuppressionDefinitive}
                    />
                  ) : (
                    <CarteCommandeActive 
                      key={commande.idCommande} 
                      commande={commande}
                      setSelectedCommande={setSelectedCommande}
                      setShowModal={setShowModal}
                      setModalType={setModalType}
                      updateStatutCommande={(id, statut) => handleUpdateStatutWithConfirmation(id, statut, commande)}
                      genererFacture={genererFacture}
                      ouvrirModalAnnulation={ouvrirModalAnnulation}
                      ouvrirModalPaiement={ouvrirModalPaiement}
                      ouvrirModalModification={ouvrirModalModification}
                      ouvrirModalSuppression={ouvrirModalSuppression}
                    />
                  )
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Container de notifications */}
      <ToastContainer 
        notifications={notifications}
        onClose={closeNotification}
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
      {showModal && modalType === 'details' && (
        <ModalDetails 
          selectedCommande={selectedCommande}
          setShowModal={setShowModal}
          dupliquerCommande={() => {
            setShowModal(false);
            dupliquerCommande(selectedCommande);
          }}
          restaurerCommande={() => {
            setShowModal(false);
            restaurerCommande(selectedCommande);
          }}
          ouvrirModalPaiement={() => {
            setShowModal(false);
            ouvrirModalPaiement(selectedCommande);
          }}
        />
      )}
      
      {showCreateModal && (
        <ModalCreationCommande 
          commandeEnPreparation={commandeEnPreparation}
          fermerModalCreation={fermerModalCreation}
          creerCommandeDepuisPreparation={creerCommandeDepuisPreparation}
        />
      )}

      {showRestoreModal && (
        <ModalRestoration 
          commandeARestaurer={commandeARestaurer}
          setShowRestoreModal={setShowRestoreModal}
          setCommandeARestaurer={setCommandeARestaurer}
          fetchCommandes={fetchCommandes}
          fetchStatistiques={fetchStatistiques}
          getAuthHeaders={getAuthHeaders}
        />
      )}

      {showDuplicateModal && (
        <ModalDuplication 
          commandeADupliquer={commandeADupliquer}
          setShowDuplicateModal={setShowDuplicateModal}
          setCommandeADupliquer={setCommandeADupliquer}
          produitsModifies={produitsModifies}
          setProduitsModifies={setProduitsModifies}
          showSelectProductModal={showSelectProductModal}
          setShowSelectProductModal={setShowSelectProductModal}
          fetchCommandes={fetchCommandes}
          fetchStatistiques={fetchStatistiques}
          getAuthHeaders={getAuthHeaders}
          modifierQuantiteProduit={modifierQuantiteProduit}
          supprimerProduit={supprimerProduit}
          confirmerDuplication={confirmerDuplication}
        />
      )}

      {showSelectProductModal && (
        <ModalSelectProduct 
          showSelectProductModal={showSelectProductModal}
          setShowSelectProductModal={setShowSelectProductModal}
          produitsDisponibles={produitsDisponibles}
          setProduitsDisponibles={setProduitsDisponibles}
          rechercheProduit={rechercheProduit}
          setRechercheProduit={setRechercheProduit}
          produitsModifies={produitsModifies}
          setProduitsModifies={setProduitsModifies}
          getAuthHeaders={getAuthHeaders}
          ajouterProduit={ajouterProduit}
        />
      )}

      {showAnnulationModal && (
        <ModalChoixAnnulation 
          commandeAAnnuler={commandeAAnnuler}
          setShowAnnulationModal={setShowAnnulationModal}
          setCommandeAAnnuler={setCommandeAAnnuler}
          fetchCommandes={fetchCommandes}
          fetchStatistiques={fetchStatistiques}
          getAuthHeaders={getAuthHeaders}
          dupliquerCommande={dupliquerCommande}
          confirmerAnnulation={confirmerAnnulation}
        />
      )}

      {showPaiementModal && (
        <ModalPaiement 
          commandeAPayer={commandeAPayer}
          setShowPaiementModal={setShowPaiementModal}
          setCommandeAPayer={setCommandeAPayer}
          formPaiement={formPaiement}
          setFormPaiement={setFormPaiement}
          fetchCommandes={fetchCommandes}
          getAuthHeaders={getAuthHeaders}
          enregistrerPaiement={enregistrerPaiement}
        />
      )}

      {/* NOUVEAUX MODALS POUR SUPPRESSION ET MODIFICATION */}
      {showSuppressionModal && (
        <ModalSuppression 
          commandeASupprimer={commandeASupprimer}
          setShowSuppressionModal={setShowSuppressionModal}
          setCommandeASupprimer={setCommandeASupprimer}
          onConfirmSuppression={confirmerSuppression}
          typeSuppression={typeSuppression}
        />
      )}

      {showModificationModal && (
        <ModalModification 
          commandeAModifier={commandeAModifier}
          setShowModificationModal={setShowModificationModal}
          setCommandeAModifier={setCommandeAModifier}
          onConfirmModification={confirmerModification}
        />
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
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
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Commandes;