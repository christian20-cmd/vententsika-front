import React from 'react';
import ProduitCard from './ProduitCard';

const ProduitList = ({ produits, onEdit, onDelete, onAddToCart, onViewDetail, loading = false }) => {
  if (loading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <ProduitCard key={index} loading={true} />
          ))}
        </div>
      </div>
    );
  }

  if (!produits || produits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
        <p className="text-gray-500">
          Aucun produit ne correspond à votre recherche ou votre filtre.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Grille des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {produits.map((produit) => (
          <ProduitCard
            key={produit.idProduit}
            produit={produit}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddToCart={onAddToCart}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </div>
  );
};

export default ProduitList;