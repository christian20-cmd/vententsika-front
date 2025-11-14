import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import Profil from '../../src/assets/profil.png';
import axios from 'axios';

const Profils = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données du profil
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/vendeur/profile-info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setProfile(response.data);
      } else {
        setError('Erreur lors du chargement du profil');
      }
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Impossible de charger les données du profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Skeleton Loading amélioré
  if (loading) {
    return (
      <div className="flex items-start justify-start mt-24">
        <div className="bg-white rounded-3xl shadow-2xl p-4 pt-0 w-full max-w-sm relative">
          
          {/* Section de l'image de profil - Skeleton */}
          <div className="flex justify-center -mt-24 mb-4">
            <div className="relative p-1 rounded-full bg-white">
              <div className="w-60 h-60 rounded-full overflow-hidden border-8 border-white">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Nom et Titre - Skeleton */}
          <div className="text-center pb-8 border-b border-gray-400 space-y-3">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            <div className="inline-block h-6 w-20 bg-gradient-to-r from-green-100 via-green-200 to-green-100 rounded-full animate-pulse"></div>
          </div>

          {/* Informations de contact - Skeleton */}
          <div className="space-y-4 text-xs my-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 border-b border-gray-100 pb-2">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Section statistiques - Skeleton */}
          <div className="bg-gray-200 rounded-xl p-4 mt-4 animate-pulse">
            <div className="h-5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-3/4 mb-3"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-2 bg-white rounded-lg space-y-2">
                  <div className="h-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start justify-start mt-24">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Erreur de chargement</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchProfile}
            className="bg-blue-800 text-white px-6 py-2 rounded-xl hover:bg-blue-900 transition-colors shadow-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-start justify-start mt-24">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-500">Aucune donnée de profil disponible</p>
        </div>
      </div>
    );
  }

  const { vendeur, utilisateur } = profile;

  return (
    <div className="flex items-start justify-start mt-24">
      {/* Carte de profil principale */}
      <div className="bg-white rounded-3xl shadow-2xl p-4 pt-0 w-full max-w-sm relative">
        
        {/* Section de l'image de profil */}
        <div className="flex justify-center -mt-24 mb-4">
          <div className="relative p-1 rounded-full bg-white">
            <div className="w-60 h-60 rounded-full overflow-hidden 
                        bg-black/10 flex items-center justify-center 
                        border-8 border-white shadow-xl">
              <img
                className="w-full h-full object-cover rounded-full"
                src={vendeur?.logo_url || Profil}
                alt={`${utilisateur?.prenom} ${utilisateur?.nom} profile`}
                onError={(e) => {
                  e.target.src = Profil;
                }}
              />
            </div>
          </div>
        </div>

        {/* Nom et Titre */}
        <div className="text-center pb-8 border-b border-gray-400">
          <h1 className="text-xl font-bold text-gray-800">
            {vendeur?.nom_entreprise || 'Vendeur individuel'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {utilisateur?.prenom} {utilisateur?.nom}
          </p>
          {vendeur?.statut_validation && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
              vendeur.statut_validation === 'validé' 
                ? 'bg-green-100 text-green-800' 
                : vendeur.statut_validation === 'en_attente'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {vendeur.statut_validation}
            </div>
          )}
        </div>

        {/* Informations de contact */}
        <div className="space-y-4 text-xs my-8">
          
          {/* Téléphone */}
          {utilisateur?.telephone && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2 hover:bg-gray-50 transition-colors rounded px-2 py-1">
              <FaPhone className="text-blue-800 w-5 h-5 flex-shrink-0" />
              <p className="text-gray-700">{utilisateur.telephone}</p>
            </div>
          )}

          {/* Email */}
          {utilisateur?.email && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2 hover:bg-gray-50 transition-colors rounded px-2 py-1">
              <FaEnvelope className="text-blue-800 w-5 h-5 flex-shrink-0" />
              <p className="text-gray-700 break-all">{utilisateur.email}</p>
            </div>
          )}

          {/* Adresse de l'entreprise */}
          {vendeur?.adresse_entreprise && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2 hover:bg-gray-50 transition-colors rounded px-2 py-1">
              <FaMapMarkerAlt className="text-blue-800 w-5 h-5 flex-shrink-0" />
              <p className="text-gray-700">{vendeur.adresse_entreprise}</p>
            </div>
          )}

          {/* Nom de l'entreprise */}
          {vendeur?.nom_entreprise && (
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-2 hover:bg-gray-50 transition-colors rounded px-2 py-1">
              <FaBuilding className="text-blue-800 w-5 h-5 flex-shrink-0" />
              <p className="text-gray-700">{vendeur.nom_entreprise}</p>
            </div>
          )}

          {/* Description de l'entreprise */}
          {vendeur?.description && (
            <div className="flex items-start space-x-4 pt-2 hover:bg-gray-50 transition-colors rounded px-2 py-1">
              <FaInfoCircle className="text-blue-800 w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-700 font-medium mb-1">Description</p>
                <p className="text-gray-600 text-sm leading-relaxed">{vendeur.description}</p>
              </div>
            </div>
          )}

        </div>

        {/* Section statistiques ou informations supplémentaires */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Informations Professionnelles</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="font-bold text-blue-800 text-xs mb-1">Commission</p>
              <p className="text-gray-600 font-semibold text-lg">{vendeur?.commission_pourcentage || '0'}%</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="font-bold text-blue-800 text-xs mb-1">Statut</p>
              <p className="text-gray-600 capitalize font-medium text-sm">{vendeur?.statut_validation || 'Non défini'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profils;