import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Shield, Building } from 'lucide-react';
import LogoTB from '../assets/LogoTB.png'

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    switch(role) {
      case 'vendeur':
        navigate('/connexion');
        break;
      case 'admin':
        navigate('/admin/connexion');
        break;
      case 'entreprise':
        navigate('/connexion'); // Ou créer une route spécifique entreprise si nécessaire
        break;
      default:
        navigate('/connexion');
    }
  };

  return (
    <div className="min-h-screen gap-40 place-self-center bg-gray-200 flex items-center justify-center p-4 font-MyFontFamily">
              <img src={LogoTB} className='' />

      <div className="max-w-2xl w-full mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800">
            Bienvenue sur votre plateforme
          </h1>
          <p className=" text-gray-600 max-w-2xl mx-auto">
            Choisissez votre espace de travail pour accéder à votre interface dédiée
          </p>
        </div>

        {/* Cartes de sélection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Carte Vendeur */}
          <div 
            onClick={() => handleRoleSelection('vendeur')}
            className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-blue-800"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <Store className="w-10 h-10 text-blue-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Espace Vendeur
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Gérez vos produits, stocks, commandes et livraisons. Interface optimisée pour la vente au détail.
              </p>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-sm font-medium">
                Accéder à mon espace
              </div>
            </div>
          </div>

          

          {/* Carte Administrateur */}
          <div 
            onClick={() => handleRoleSelection('admin')}
            className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-blue-800"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-blue-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Espace Administrateur
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Administration complète de la plateforme, gestion des utilisateurs et supervision du système.
              </p>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-sm font-medium">
                Accéder à l'administration
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Vous rencontrez un problème pour accéder à votre espace ?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;