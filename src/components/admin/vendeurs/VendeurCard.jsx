import React, { useState } from 'react';
import { MdBusiness, MdEmail, MdPhone, MdCalendarToday, MdVisibility, MdCheckCircle, MdDelete } from 'react-icons/md';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaInfoCircle } from 'react-icons/fa';

// Composant séparé pour l'image avec gestion d'erreur
const ImageVendeur = ({ vendeur, className = "w-12 h-12" }) => {
  const [imageError, setImageError] = useState(false);
  
  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = () => {
    const imageUrl = vendeur.logo_url || 
                   vendeur.logo_image || 
                   vendeur.image_url || 
                   vendeur.photo_url ||
                   vendeur.utilisateur?.photo_url ||
                   null;

    console.log(`🖼️ Recherche image pour ${vendeur.nom_entreprise}:`, {
      logo_url: vendeur.logo_url,
      logo_image: vendeur.logo_image,
      image_url: vendeur.image_url,
      photo_url: vendeur.photo_url,
      utilisateur_photo: vendeur.utilisateur?.photo_url,
      resultat: imageUrl
    });

    return imageUrl;
  };

  const imageUrl = getImageUrl();

  if (imageUrl && !imageError) {
    return (
      <img 
        src={imageUrl} 
        alt={vendeur.nom_entreprise}
        className={`${className} object-cover rounded-full`}
        onError={(e) => {
          console.error(`❌ Erreur chargement image: ${imageUrl}`);
          setImageError(true);
        }}
        onLoad={() => {
          console.log(`✅ Image chargée avec succès: ${imageUrl}`);
        }}
      />
    );
  }

  console.log(`⚠️ Utilisation icône par défaut pour: ${vendeur.nom_entreprise}`);
  
  return (
    <div className={`${className} bg-purple-100 rounded-full flex items-center justify-center`}>
      <MdBusiness className="text-purple-600 text-xl" />
    </div>
  );
};

const VendeurCard = ({ vendeur, actionLoading, onViewDetails, onUpdateStatus, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'valide':
        return 'bg-green-100 text-green-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'valide':
        return <MdCheckCircle className="text-green-500" />;
      case 'en_attente':
        return <MdBusiness className="text-yellow-500" />;
      case 'rejete':
        return <MdBusiness className="text-red-500" />;
      default:
        return <MdBusiness className="text-gray-500" />;
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'valide': return 'Validé';
      case 'en_attente': return 'En attente';
      case 'rejete': return 'Rejeté';
      default: return statut;
    }
  };

  console.log(`🎯 Rendu carte vendeur: ${vendeur.nom_entreprise}`, vendeur);

  return (
    <div className="flex items-start justify-start">
      {/* Carte de profil principale */}
      <div className="bg-white rounded-3xl shadow-2xl p-4 pt-0 w-full max-w-sm relative">
        
        {/* Section de l'image de profil avec z-index élevé */}
        <div className="flex justify-center -mt-24 mb-4">
          <div className="relative p-1 rounded-full bg-white z-50">
            <div>
            <div className="w-60 h-60 rounded-full overflow-hidden 
                        bg-black/10 flex items-center justify-center 
                        border-8 border-white z-50 relative">
              <ImageVendeur vendeur={vendeur} className="w-full h-full" />
            </div>
            
            {/* Boutons d'action positionnés près de l'image */}
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-50">
              {/* Bouton Détails */}
              <button 
                onClick={() => {
                  console.log(`👁️ Voir détails: ${vendeur.nom_entreprise} (ID: ${vendeur.idVendeur})`);
                  onViewDetails(vendeur.idVendeur);
                }}
                disabled={actionLoading === vendeur.idVendeur}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg z-50"
                title="Voir détails"
              >
                <MdVisibility className="text-lg" />
              </button>
              
              {/* Bouton Supprimer */}
              <button
                onClick={() => {
                  console.log(`🗑️ Supprimer vendeur: ${vendeur.nom_entreprise}`);
                  onDelete(vendeur.idVendeur);
                }}
                disabled={actionLoading === vendeur.idVendeur}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg z-50"
                title="Supprimer"
              >
                <MdDelete className="text-lg" />
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Section principale avec logo, nom, titre ET informations de contact en flex */}
        <div className="flex flex-col md:flex-row gap-4 pb-8 border-b border-gray-400">
          
          {/* Logo, Nom et Titre */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              {/* Logo réduit */}
              <div className="mb-2">
                <ImageVendeur vendeur={vendeur} className="w-16 h-16" />
              </div>
              
              <h1 className="text-xl font-bold text-gray-800">
                {vendeur?.nom_entreprise || 'Vendeur individuel'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {vendeur?.utilisateur?.prenom} {vendeur?.utilisateur?.nom}
              </p>
              {vendeur?.statut_validation && (
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${
                  getStatutColor(vendeur.statut_validation)
                }`}>
                  {getStatutIcon(vendeur.statut_validation)}
                  <span className="ml-1">{getStatutText(vendeur.statut_validation)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Informations de contact */}
          <div className="flex-1 space-y-2 text-xs">
            
            {/* Email */}
            {vendeur?.utilisateur?.email && (
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-800 w-4 h-4 flex-shrink-0" />
                <p className="text-gray-700 truncate text-xs">{vendeur.utilisateur.email}</p>
              </div>
            )}

            {/* Téléphone */}
            {vendeur?.utilisateur?.telephone && (
              <div className="flex items-center space-x-2">
                <FaPhone className="text-blue-800 w-4 h-4 flex-shrink-0" />
                <p className="text-gray-700 text-xs">{vendeur.utilisateur.telephone}</p>
              </div>
            )}

            {/* Adresse de l'entreprise */}
            {vendeur?.adresse_entreprise && (
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-blue-800 w-4 h-4 flex-shrink-0" />
                <p className="text-gray-700 truncate text-xs">{vendeur.adresse_entreprise}</p>
              </div>
            )}

            {/* Date d'inscription */}
            {vendeur?.utilisateur?.date_inscription && (
              <div className="flex items-center space-x-2">
                <MdCalendarToday className="text-blue-800 w-4 h-4 flex-shrink-0" />
                <p className="text-gray-700 text-xs">Inscrit le {formatDate(vendeur.utilisateur.date_inscription)}</p>
              </div>
            )}

          </div>
        </div>

        {/* Description de l'entreprise */}
        {vendeur?.description && (
          <div className="flex items-start space-x-3 pt-4 mt-4 border-t border-gray-100">
            <FaInfoCircle className="text-blue-800 w-4 h-4 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-700 font-medium mb-1 text-sm">Description</p>
              <p className="text-gray-600 text-xs leading-relaxed">{vendeur.description}</p>
            </div>
          </div>
        )}

        {/* Section statistiques ou informations supplémentaires */}
        <div className="bg-gray-200 rounded-xl p-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm">Informations Professionnelles</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="font-bold text-blue-600 text-xs">Produits</p>
              <p className="text-gray-600 text-sm">{vendeur.nombre_produits || 0}</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg">
              <p className="font-bold text-blue-600 text-xs">Statut</p>
              <p className={`text-gray-600 capitalize text-sm ${
                vendeur.est_en_ligne ? 'text-green-600' : 'text-gray-400'
              }`}>
                {vendeur.est_en_ligne ? 'En ligne' : 'Hors ligne'}
              </p>
            </div>
          </div>

          {/* Bouton de validation pour les vendeurs en attente */}
          {vendeur.statut_validation === 'en_attente' && (
            <button
              onClick={() => {
                console.log(`✅ Valider vendeur: ${vendeur.nom_entreprise}`);
                onUpdateStatus(vendeur.idVendeur, 'valide');
              }}
              disabled={actionLoading === vendeur.idVendeur}
              className="w-full mt-3 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm flex items-center justify-center"
            >
              <MdCheckCircle className="mr-2" />
              Valider ce vendeur
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default VendeurCard;