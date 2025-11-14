import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const useCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [commandesAnnulees, setCommandesAnnulees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistiques, setStatistiques] = useState(null);
  const [commandeEnPreparation, setCommandeEnPreparation] = useState(null);
  const location = useLocation();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Vérifier si on arrive depuis la page Produits avec une commande en préparation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'create') {
      const commandeData = localStorage.getItem('commandeEnPreparation');
      if (commandeData) {
        setCommandeEnPreparation(JSON.parse(commandeData));
        localStorage.removeItem('commandeEnPreparation');
      }
    }
  }, [location]);

  const formaterCommandes = (commandes) => {
    console.log('🔄 Formatage des commandes - Statuts disponibles:');
    const statuts = [...new Set(commandes.map(c => c.statut))];
    console.log('   - Statuts:', statuts);
    
    return commandes.map(commande => {
      return {
        ...commande,
        statut_paiement: commande.statut_paiement,
        montant_deja_paye: parseFloat(commande.montant_deja_paye) || 0,
        montant_reste_payer: parseFloat(commande.montant_reste_payer) || 0,
        total_commande: parseFloat(commande.total_commande) || 0,
      };
    });
  };
  
  // ✅ CORRECTION: Charger TOUTES les commandes sans les annulées
  const fetchCommandes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement de toutes les commandes (sauf annulées)...');
      
      const response = await axios.get('http://localhost:8000/api/commandes', {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        const toutesCommandes = response.data.commandes;
        console.log('✅ Toutes les commandes chargées:', toutesCommandes.length);
        
        // Formater les commandes
        const commandesFormatees = formaterCommandes(toutesCommandes);
        
        // ✅ CORRECTION: Filtrer les annulées côté client
        const commandesActives = commandesFormatees.filter(cmd => cmd.statut !== 'annulee');
        setCommandes(commandesActives);
        
        // ✅ CORRECTION: Charger les annulées via l'API spécifique
        await fetchCommandesAnnulees();
        
        console.log('📊 Répartition des commandes:');
        console.log('   - Actives:', commandesActives.length);
        console.log('   - Annulées (via API):', commandesAnnulees.length);
        
      } else {
        console.error('❌ Réponse API non successful:', response.data);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      if (error.response) {
        console.error('📡 Détails erreur API:', {
          status: error.response.status,
          data: error.response.data
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCommandesAnnulees = async () => {
    try {
      console.log('🔄 Chargement spécifique des commandes annulées...');
      
      const response = await axios.get('http://localhost:8000/api/commandes/statut/annulees', {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        const annulees = formaterCommandes(response.data.commandes || []);
        console.log('✅ Commandes annulées chargées via API spécifique:', annulees.length);
        setCommandesAnnulees(annulees);
        return annulees;
      } else {
        console.error('❌ Réponse API annulées non successful:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes annulées:', error);
      if (error.response) {
        console.error('📡 Détails erreur API annulées:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      return [];
    }
  };

  // Charger les statistiques
  const fetchStatistiques = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/commandes/statistiques', {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setStatistiques(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  // Mettre à jour le statut d'une commande
  const updateStatutCommande = async (idCommande, nouveauStatut) => {
    try {
      console.log(`🔄 Mise à jour statut commande ${idCommande} -> ${nouveauStatut}`);
      await axios.put(`http://localhost:8000/api/commandes/${idCommande}/statut`,
        { statut: nouveauStatut },
        { headers: getAuthHeaders() }
      );
      
      // ✅ CORRECTION: Recharger les deux états
      await fetchCommandes();
      await fetchCommandesAnnulees();
      await fetchStatistiques();
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Modifier une commande existante
  const modifierCommande = async (idCommande, donneesModifiees) => {
    try {
      console.log('🔄 Modification commande:', idCommande, donneesModifiees);
      
      const response = await axios.put(
        `http://localhost:8000/api/commandes/${idCommande}/modifier-produits`,
        donneesModifiees,
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        console.log('✅ Commande modifiée avec succès');
        await fetchCommandes();
        await fetchCommandesAnnulees();
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'Erreur modification');
      }
    } catch (error) {
      console.error('❌ Erreur modification commande:', error);
      throw error;
    }
  };

  

  // Générer une facture
  const genererFacture = async (idCommande) => {
    try {
      console.log(`🔄 Génération facture pour commande ${idCommande}`);
      const response = await axios.get(
        `http://localhost:8000/api/commandes/${idCommande}/facture`,
        {
          headers: getAuthHeaders(),
          responseType: 'blob',
          timeout: 30000
        }
      );
      
      if (response.status === 200) {
        console.log('✅ Facture générée avec succès');
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `facture-commande-${idCommande}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('❌ Erreur génération facture:', error);
      alert('Erreur lors de la génération de la facture');
    }
  };





    // ===== SUPPRIMER UNE COMMANDE =====
  const supprimerCommande = async (id) => {
    try {
      console.log(`🗑️ Suppression commande ${id}`);
      const response = await axios.delete(`http://localhost:8000/api/commandes/${id}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        console.log('✅ Commande supprimée avec succès');
        await fetchCommandes(); // Recharger les commandes actives
        await fetchStatistiques();
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('❌ Erreur suppression commande:', error);
      
      let errorMessage = 'Erreur lors de la suppression de la commande';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Impossible de supprimer une commande déjà validée';
      }
      
      return { success: false, message: errorMessage };
    }
  };

  // ===== SUPPRIMER DÉFINITIVEMENT UNE COMMANDE ANNULÉE =====
  const supprimerDefinitivementCommande = async (id) => {
    try {
      console.log(`💀 Suppression définitive commande ${id}`);
      const response = await axios.delete(`http://localhost:8000/api/commandes/${id}/supprimer-definitivement`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        console.log('✅ Commande supprimée définitivement');
        await fetchCommandesAnnulees(); // Recharger les annulées
        await fetchStatistiques();
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression définitive');
      }
    } catch (error) {
      console.error('❌ Erreur suppression définitive:', error);
      
      let errorMessage = 'Erreur lors de la suppression définitive';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };

  // ===== MODIFIER LES INFORMATIONS D'UNE COMMANDE =====
  const modifierCommandeInfos = async (id, donneesModifiees) => {
    try {
      console.log(`✏️ Modification infos commande ${id}:`, donneesModifiees);
      
      const response = await axios.put(
        `http://localhost:8000/api/commandes/${id}`,
        donneesModifiees,
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        console.log('✅ Informations commande modifiées avec succès');
        await fetchCommandes();
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('❌ Erreur modification infos commande:', error);
      
      let errorMessage = 'Erreur lors de la modification de la commande';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Impossible de modifier une commande déjà validée';
      }
      
      return { success: false, message: errorMessage };
    }
  };

  useEffect(() => {
    console.log('🚀 Initialisation useCommandes');
    fetchCommandes();
    fetchStatistiques();
  }, []);

  return {
    commandes,           // ✅ Contient TOUTES les commandes actives (sans annulées)
    commandesAnnulees,   // ✅ Contient UNIQUEMENT les commandes annulées
    loading,
    statistiques,
    commandeEnPreparation,
    fetchCommandes,
    fetchCommandesAnnulees, // ✅ BIEN EXPORTÉE
    fetchStatistiques,
    updateStatutCommande,
    modifierCommande,
    genererFacture,
    setCommandeEnPreparation,
    getAuthHeaders,
    supprimerCommande,
    supprimerDefinitivementCommande,
    modifierCommandeInfos
  };
};