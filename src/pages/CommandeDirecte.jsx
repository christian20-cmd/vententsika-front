import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Search, Plus, Trash2, Package } from 'lucide-react';

const CommandeDirecte = ({ onRetour }) => {
  const [etape, setEtape] = useState(1);
  const [interfaceData, setInterfaceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rechercheClient, setRechercheClient] = useState('');
  const [clientsTrouves, setClientsTrouves] = useState([]);
  const [produitsTrouves, setProduitsTrouves] = useState([]);
  const [loadingInterface, setLoadingInterface] = useState(true);
  const [erreurs, setErreurs] = useState({});

  const [formData, setFormData] = useState({
    idClient: '',
    produits: [],
    adresse_livraison: '',
    date_livraison: '',
    notes: '',
    montant_paye: 0,
    methode_paiement: 'especes'
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    chargerInterface();
  }, []);

  const chargerInterface = async () => {
    try {
      setLoadingInterface(true);
      const response = await axios.get('http://localhost:8000/api/commandes-directes/interface', {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        setInterfaceData(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement interface:', error);
      alert('Erreur lors du chargement de l\'interface');
    } finally {
      setLoadingInterface(false);
    }
  };

  const rechercherClients = async (term) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/commandes-directes/clients/autocomplete?search=${term}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data && response.data.success) {
        setClientsTrouves(response.data.clients);
      }
    } catch (error) {
      console.error('Erreur recherche clients:', error);
    }
  };

  const rechercherProduits = async (term) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/commandes-directes/produits/autocomplete?search=${term}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data && response.data.success) {
        setProduitsTrouves(response.data.produits);
      }
    } catch (error) {
      console.error('Erreur recherche produits:', error);
    }
  };

  const ajouterProduit = (produit) => {
    const existeDeja = formData.produits.find(p => p.idProduit === produit.idProduit);
    
    if (existeDeja) {
      setFormData({
        ...formData,
        produits: formData.produits.map(p =>
          p.idProduit === produit.idProduit
            ? { ...p, quantite: p.quantite + 1 }
            : p
        )
      });
    } else {
      setFormData({
        ...formData,
        produits: [
          ...formData.produits,
          {
            idProduit: produit.idProduit,
            quantite: 1,
            produit: produit
          }
        ]
      });
    }
    
    setProduitsTrouves([]);
  };

  const modifierQuantite = (idProduit, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) return;
    
    const produit = formData.produits.find(p => p.idProduit === idProduit);
    if (produit && nouvelleQuantite > produit.produit.stock_disponible) {
      alert(`Stock insuffisant. Disponible: ${produit.produit.stock_disponible}`);
      return;
    }
    
    setFormData({
      ...formData,
      produits: formData.produits.map(p =>
        p.idProduit === idProduit
          ? { ...p, quantite: nouvelleQuantite }
          : p
      )
    });
  };

  const supprimerProduit = (idProduit) => {
    setFormData({
      ...formData,
      produits: formData.produits.filter(p => p.idProduit !== idProduit)
    });
  };

  const calculerTotal = () => {
    return formData.produits.reduce((total, item) => {
      const prix = item.produit.prix_promotion || item.produit.prix_unitaire;
      return total + (prix * item.quantite);
    }, 0);
  };

  const validerEtape = () => {
    const nouvellesErreurs = {};

    if (etape === 1 && !formData.idClient) {
      nouvellesErreurs.idClient = 'Veuillez sélectionner un client';
    }

    if (etape === 2 && formData.produits.length === 0) {
      nouvellesErreurs.produits = 'Veuillez ajouter au moins un produit';
    }

    if (etape === 3) {
      if (!formData.adresse_livraison.trim()) {
        nouvellesErreurs.adresse_livraison = 'L\'adresse de livraison est obligatoire';
      }
      if (!formData.date_livraison) {
        nouvellesErreurs.date_livraison = 'La date de livraison est obligatoire';
      }
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const passerEtapeSuivante = () => {
    if (validerEtape()) {
      setEtape(etape + 1);
    }
  };

  const soumettreCommande = async () => {
    if (!validerEtape()) return;

    try {
      setLoading(true);
      
      const commandeData = {
        ...formData,
        produits: formData.produits.map(p => ({
          idProduit: p.idProduit,
          quantite: p.quantite
        }))
      };

      const response = await axios.post(
        'http://localhost:8000/api/commandes-directes/creer',
        commandeData,
        { headers: getAuthHeaders() }
      );
      
      if (response.data && response.data.success) {
        alert('Commande créée avec succès! Elle est maintenant en attente de validation.');
        onRetour();
      }
    } catch (error) {
      console.error('Erreur création commande:', error);
      if (error.response?.data?.erreurs_stock) {
        const erreurs = error.response.data.erreurs_stock.map(e => 
          `${e.produit}: demandé ${e.quantite_demandee}, disponible ${e.stock_disponible}`
        ).join('\n');
        alert(`Stocks insuffisants:\n${erreurs}`);
      } else {
        alert(error.response?.data?.message || 'Erreur lors de la création de la commande');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingInterface) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const total = calculerTotal();
  const fraisLivraison = total * 0.10;
  const totalCommande = total + fraisLivraison;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onRetour}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Créer une commande directe</h1>
            <p className="text-gray-600">Créez une commande manuellement pour un client</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Étape {etape} sur 3
          </div>
        </div>
      </div>

      {/* Indicateur d'étapes */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                etape >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-24 h-1 mx-4 ${
                  etape > step ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm">
          <span className={etape >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
            Client
          </span>
          <span className={etape >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
            Produits
          </span>
          <span className={etape >= 3 ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
            Validation
          </span>
        </div>
      </div>

      {/* Étape 1: Sélection du client */}
      {etape === 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6">Sélection du client</h2>
          
          <div className="max-w-2xl">
            {/* Recherche client */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un client
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rechercheClient}
                  onChange={(e) => {
                    setRechercheClient(e.target.value);
                    if (e.target.value.length > 2) {
                      rechercherClients(e.target.value);
                    } else {
                      setClientsTrouves([]);
                    }
                  }}
                  placeholder="Nom, email ou téléphone..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              {erreurs.idClient && (
                <p className="text-red-600 text-sm mt-1">{erreurs.idClient}</p>
              )}
              
              {/* Résultats recherche */}
              {clientsTrouves.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                  {clientsTrouves.map(client => (
                    <button
                      key={client.idClient}
                      onClick={() => {
                        setFormData({...formData, idClient: client.idClient});
                        setClientsTrouves([]);
                        setRechercheClient(client.nom_prenom_client);
                        setErreurs({...erreurs, idClient: ''});
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium">{client.nom_prenom_client}</div>
                      <div className="text-sm text-gray-500">
                        {client.email_client} • {client.telephone_client}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Liste des clients récents */}
            {interfaceData?.clients && interfaceData.clients.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Clients récents</h3>
                <div className="grid gap-3">
                  {interfaceData.clients.slice(0, 5).map(client => (
                    <button
                      key={client.idClient}
                      onClick={() => {
                        setFormData({...formData, idClient: client.idClient});
                        setRechercheClient(client.nom_prenom_client);
                        setErreurs({...erreurs, idClient: ''});
                      }}
                      className={`p-4 border rounded-lg text-left hover:bg-gray-50 ${
                        formData.idClient === client.idClient ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium">{client.nom_prenom_client}</div>
                      <div className="text-sm text-gray-500">
                        {client.email_client} • {client.telephone_client}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-8">
            <button
              onClick={passerEtapeSuivante}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Étape 2: Sélection des produits */}
      {etape === 2 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6">Sélection des produits</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recherche produits */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher un produit
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nom du produit..."
                      onChange={(e) => {
                        if (e.target.value.length > 2) {
                          rechercherProduits(e.target.value);
                        } else {
                          setProduitsTrouves([]);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Résultats recherche */}
                {produitsTrouves.length > 0 && (
                  <div className="border border-gray-200 rounded-md bg-white shadow-lg max-h-96 overflow-y-auto">
                    {produitsTrouves.map(produit => (
                      <button
                        key={produit.idProduit}
                        onClick={() => ajouterProduit(produit)}
                        disabled={produit.stock_disponible === 0}
                        className={`w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between ${
                          produit.stock_disponible === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium">{produit.nom_produit}</div>
                          <div className="text-sm text-gray-500">
                            {produit.categorie} • Stock: {produit.stock_disponible}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {parseFloat(produit.prix_promotion || produit.prix_unitaire).toFixed(2)} €
                          </div>
                          {produit.stock_disponible > 0 && (
                            <Plus size={16} className="text-green-600 ml-auto mt-1" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Produits disponibles */}
                {interfaceData?.produits && produitsTrouves.length === 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Produits disponibles</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {interfaceData.produits.map(produit => (
                        <button
                          key={produit.idProduit}
                          onClick={() => ajouterProduit(produit)}
                          disabled={produit.stock_disponible === 0}
                          className={`w-full text-left p-3 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-between ${
                            produit.stock_disponible === 0 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div>
                            <div className="font-medium">{produit.nom_produit}</div>
                            <div className="text-sm text-gray-500">
                              {produit.categorie} • Stock: {produit.stock_disponible}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {parseFloat(produit.prix_promotion || produit.prix_unitaire).toFixed(2)} €
                            </div>
                            {produit.stock_disponible > 0 && (
                              <Plus size={16} className="text-green-600 ml-auto mt-1" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panier */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium mb-4">Produits sélectionnés</h3>
              
              {formData.produits.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Aucun produit sélectionné</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Recherchez et ajoutez des produits depuis la colonne de gauche
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.produits.map((item) => (
                    <div key={item.idProduit} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.produit.image_principale && (
                          <img 
                            src={item.produit.image_principale}
                            alt={item.produit.nom_produit}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{item.produit.nom_produit}</div>
                          <div className="text-sm text-gray-500">
                            {parseFloat(item.produit.prix_promotion || item.produit.prix_unitaire).toFixed(2)} €
                          </div>
                          <div className="text-xs text-gray-400">
                            Stock: {item.produit.stock_disponible}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Contrôle quantité */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => modifierQuantite(item.idProduit, item.quantite - 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{item.quantite}</span>
                          <button
                            onClick={() => modifierQuantite(item.idProduit, item.quantite + 1)}
                            disabled={item.quantite >= item.produit.stock_disponible}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right min-w-20">
                          <div className="font-medium">
                            {parseFloat((item.produit.prix_promotion || item.produit.prix_unitaire) * item.quantite).toFixed(2)} €
                          </div>
                        </div>
                        
                        <button
                          onClick={() => supprimerProduit(item.idProduit)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {erreurs.produits && (
                <p className="text-red-600 text-sm mt-2">{erreurs.produits}</p>
              )}

              {/* Résumé */}
              {formData.produits.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{parseFloat(total).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de livraison (10%):</span>
                      <span>{parseFloat(fraisLivraison).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{parseFloat(totalCommande).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setEtape(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Retour
            </button>
            <button
              onClick={passerEtapeSuivante}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Étape 3: Validation */}
      {etape === 3 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6">Validation de la commande</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations livraison */}
            <div>
              <h3 className="text-lg font-medium mb-4">Informations de livraison</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison *
                  </label>
                  <textarea
                    value={formData.adresse_livraison}
                    onChange={(e) => {
                      setFormData({...formData, adresse_livraison: e.target.value});
                      setErreurs({...erreurs, adresse_livraison: ''});
                    }}
                    rows={3}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      erreurs.adresse_livraison ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Adresse complète de livraison..."
                    required
                  />
                  {erreurs.adresse_livraison && (
                    <p className="text-red-600 text-sm mt-1">{erreurs.adresse_livraison}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de livraison souhaitée *
                  </label>
                  <input
                    type="date"
                    value={formData.date_livraison}
                    onChange={(e) => {
                      setFormData({...formData, date_livraison: e.target.value});
                      setErreurs({...erreurs, date_livraison: ''});
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      erreurs.date_livraison ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {erreurs.date_livraison && (
                    <p className="text-red-600 text-sm mt-1">{erreurs.date_livraison}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Instructions spéciales..."
                  />
                </div>
              </div>
            </div>

            {/* Paiement et résumé */}
            <div>
              <h3 className="text-lg font-medium mb-4">Paiement</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant payé
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.montant_paye}
                    onChange={(e) => setFormData({...formData, montant_paye: parseFloat(e.target.value) || 0})}
                    max={totalCommande}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum: {parseFloat(totalCommande).toFixed(2)} €
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Méthode de paiement
                  </label>
                  <select
                    value={formData.methode_paiement}
                    onChange={(e) => setFormData({...formData, methode_paiement: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="especes">Espèces</option>
                    <option value="carte">Carte bancaire</option>
                    <option value="virement">Virement</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
              </div>

              {/* Résumé final */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Résumé de la commande</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nombre de produits:</span>
                    <span>{formData.produits.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total articles:</span>
                    <span>{parseFloat(total).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison:</span>
                    <span>{parseFloat(fraisLivraison).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total commande:</span>
                    <span>{parseFloat(totalCommande).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Montant payé:</span>
                    <span>{parseFloat(formData.montant_paye).toFixed(2)} €</span>
                  </div>
                  {formData.montant_paye < totalCommande && (
                    <div className="flex justify-between text-orange-600">
                      <span>Reste à payer:</span>
                      <span>{parseFloat(totalCommande - formData.montant_paye).toFixed(2)} €</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions finales */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setEtape(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Retour
            </button>
            <div className="flex space-x-4">
              <button
                onClick={onRetour}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={soumettreCommande}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer la commande'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandeDirecte;