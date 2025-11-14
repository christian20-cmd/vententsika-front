import React, { useState, useEffect } from 'react';
import DashboardAdminLayout from './DashboardAdminLayout';
import { 
  MdPerson, 
  MdEmail, 
  MdPhone, 
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdRefresh,
  MdSecurity,
  MdSearch
} from 'react-icons/md';

const AdminDemandesPage = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Fonction pour récupérer les demandes en attente
  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/demandes-en-attente', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des demandes');
      }

      const data = await response.json();
      
      if (data.success) {
        setDemandes(data.data || []);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  // Fonction pour valider une demande
  const validerDemande = async (idDemande) => {
    try {
      setProcessingId(idDemande);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/demandes/${idDemande}/valider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (data.success) {
        // Rafraîchir la liste
        await fetchDemandes();
        // Optionnel: afficher un toast de succès
        alert('Demande validée avec succès !');
      } else {
        throw new Error(data.message || 'Erreur lors de la validation');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Fonction pour rejeter une demande
  const rejeterDemande = async (idDemande) => {
    const raison = prompt('Veuillez saisir la raison du rejet :');
    
    if (!raison || raison.trim() === '') {
      alert('Veuillez saisir une raison pour le rejet.');
      return;
    }

    try {
      setProcessingId(idDemande);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/demandes/${idDemande}/rejeter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ raison_rejet: raison })
      });

      const data = await response.json();

      if (data.success) {
        // Rafraîchir la liste
        await fetchDemandes();
        // Optionnel: afficher un toast de succès
        alert('Demande rejetée avec succès !');
      } else {
        throw new Error(data.message || 'Erreur lors du rejet');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Filtrer les demandes selon la recherche
  const filteredDemandes = demandes.filter(demande => {
    return (
      demande.candidat.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.candidat.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.invitation.niveau_acces?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour formater le niveau d'accès
  const formatNiveauAcces = (niveau) => {
    switch (niveau) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrateur';
      case 'moderateur':
        return 'Modérateur';
      default:
        return niveau;
    }
  };

  // Fonction pour obtenir la couleur du niveau d'accès
  const getNiveauColor = (niveau) => {
    switch (niveau) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'moderateur':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardAdminLayout>
        <div className="">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900">Demandes d'Administration en Attente</h1>
            <p className="text-gray-600 mt-2">Validez ou rejetez les demandes d'accès administrateur</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Chargement des demandes...</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardAdminLayout>
    );
  }

  return (
    <DashboardAdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Demandes d'Administration en Attente</h1>
          <p className="text-gray-600 mt-2">
            {demandes.length} demande{demandes.length !== 1 ? 's' : ''} en attente de validation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* En-tête avec recherche */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Liste des Demandes</h2>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              {/* Barre de recherche */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une demande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full sm:w-64"
                />
              </div>

              {/* Bouton rafraîchir */}
              <button
                onClick={fetchDemandes}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <MdRefresh className="mr-2" />
                Actualiser
              </button>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {/* Liste des demandes */}
          {filteredDemandes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {demandes.length === 0 ? (
                <>
                  <MdPerson className="text-6xl mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Aucune demande en attente</p>
                  <p className="text-sm mt-2">Toutes les demandes ont été traitées.</p>
                </>
              ) : (
                <>
                  <MdSearch className="text-6xl mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Aucune demande ne correspond aux critères</p>
                  <p className="text-sm mt-2">Essayez de modifier votre recherche.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDemandes.map((demande) => (
                <div key={demande.idDemande} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Informations du candidat */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <MdPerson className="text-purple-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {demande.candidat.nom_complet}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <MdEmail className="text-gray-400 mr-2" />
                              <span>{demande.candidat.email}</span>
                            </div>
                            {demande.candidat.telephone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MdPhone className="text-gray-400 mr-2" />
                                <span>{demande.candidat.telephone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informations de l'invitation */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getNiveauColor(demande.invitation.niveau_acces)}`}>
                        <MdSecurity className="mr-2" />
                        <span>{formatNiveauAcces(demande.invitation.niveau_acces)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MdCalendarToday className="text-gray-400 mr-2" />
                        <span>{formatDate(demande.date_demande)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => validerDemande(demande.idDemande)}
                        disabled={processingId === demande.idDemande}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <MdCheckCircle className="mr-2" />
                        {processingId === demande.idDemande ? 'Traitement...' : 'Valider'}
                      </button>
                      
                      <button
                        onClick={() => rejeterDemande(demande.idDemande)}
                        disabled={processingId === demande.idDemande}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <MdCancel className="mr-2" />
                        {processingId === demande.idDemande ? 'Traitement...' : 'Rejeter'}
                      </button>
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-c-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Initié par :</span>
                        <p>{demande.invitation.generer_par}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date d'invitation :</span>
                        <p>{formatDate(demande.invitation.date_invitation)}</p>
                      </div>
                      <div>
                        <span className="font-medium">ID Demande :</span>
                        <p className="font-mono">#{demande.idDemande}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardAdminLayout>
  );
};

export default AdminDemandesPage;