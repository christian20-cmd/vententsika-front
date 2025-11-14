import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Package, Inbox } from 'lucide-react';
import axios from 'axios';

const formatPrix = (prix) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
};

export const ModalSelectProduct = ({ 
  showSelectProductModal, 
  setShowSelectProductModal,
  produitsDisponibles,
  setProduitsDisponibles,
  rechercheProduit,
  setRechercheProduit,
  produitsModifies,
  setProduitsModifies,
  getAuthHeaders
}) => {
  const [loading, setLoading] = useState(false);

  // Charger les produits disponibles
  const fetchProduitsDisponibles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/produits', {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        setProduitsDisponibles(response.data.produits || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSelectProductModal) {
      fetchProduitsDisponibles();
    }
  }, [showSelectProductModal]);

  // Ajouter un produit à la commande
  const ajouterProduit = (produit) => {
    const produitExiste = produitsModifies.find(p => p.idProduit === produit.idProduit);
    
    if (produitExiste) {
      // Augmenter la quantité si le produit existe déjà
      const nouveauxProduits = produitsModifies.map(p =>
        p.idProduit === produit.idProduit
          ? { ...p, quantite_modifiee: p.quantite_modifiee + 1 }
          : p
      );
      setProduitsModifies(nouveauxProduits);
    } else {
      // Ajouter le nouveau produit
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
    setRechercheProduit('');
  };

  // Filtrer les produits
  const produitsFiltres = produitsDisponibles.filter(produit =>
    produit.nom_produit.toLowerCase().includes(rechercheProduit.toLowerCase()) ||
    produit.reference.toLowerCase().includes(rechercheProduit.toLowerCase())
  );

  if (!showSelectProductModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100 shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Sélectionner un produit</h2>
            <button
              onClick={() => {
                setShowSelectProductModal(false);
                setRechercheProduit('');
              }}
              className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-2xl flex items-center justify-center transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit par nom ou référence..."
                value={rechercheProduit}
                onChange={(e) => setRechercheProduit(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
              <p className="text-gray-600 mt-4">Chargement des produits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produitsFiltres.map((produit) => (
                <div
                  key={produit.idProduit}
                  className="border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white"
                  onClick={() => ajouterProduit(produit)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {produit.medias?.[0] ? (
                      <img
                        src={`http://localhost:8000/storage/${produit.medias[0].chemin_fichier}`}
                        alt={produit.nom_produit}
                        className="w-12 h-12 object-cover rounded-2xl border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{produit.nom_produit}</h3>
                      <p className="text-xs text-gray-500">Ref: {produit.reference}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {produit.prix_promotion ? (
                        <div>
                          <span className="text-red-600 font-bold">{formatPrix(produit.prix_promotion)}</span>
                          <span className="text-gray-500 text-sm line-through ml-2">{formatPrix(produit.prix_unitaire)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">{formatPrix(produit.prix_unitaire)}</span>
                      )}
                    </div>
                    <button className="bg-blue-600 text-white p-2 rounded-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && produitsFiltres.length === 0 && (
            <div className="text-center py-8">
              <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-3xl">
          <button
            onClick={() => {
              setShowSelectProductModal(false);
              setRechercheProduit('');
            }}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};