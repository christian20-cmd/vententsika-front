import React, { useState, useEffect } from 'react';
import { MdClose, MdSave, MdAdminPanelSettings } from 'react-icons/md';
import LogoTB from '../../../assets/LogoTB.png'
import { XMarkIcon } from '@heroicons/react/24/outline';

const ModalEdit = ({ isOpen, onClose, admin, onUpdate }) => {
  const [formData, setFormData] = useState({
    prenomUtilisateur: '',
    nomUtilisateur: '',
    email: '',
    tel: '',
    niveau_acces: 'admin',
    est_actif: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin) {
      // Extraire prénom et nom du nom complet
      const nomComplet = admin.nom_complet?.split(' ') || [];
      const prenom = nomComplet[0] || '';
      const nom = nomComplet.slice(1).join(' ') || '';
      
      setFormData({
        prenomUtilisateur: prenom,
        nomUtilisateur: nom,
        email: admin.email || '',
        tel: admin.telephone || '',
        niveau_acces: admin.niveau_acces || 'admin',
        est_actif: admin.est_actif !== undefined ? admin.est_actif : true
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/administrateurs/${admin.idAdministrateur}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.admin);
        onClose();
      } else {
        setError(data.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-2xl flex items-center justify-center transition-all duration-200 hover:rotate-90 group absolute right-2 top-2 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 pt-6">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>
        {/* Header */}



            <div className='place-self-center text-center '>
              <h2 className="text-xl font-semibold text-gray-900">
                Modifier l'administrateur
              </h2>
              <p className="text-sm text-gray-500">{admin.nom_complet}</p>
            </div>
         
       


        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                name="prenomUtilisateur"
                value={formData.prenomUtilisateur}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="nomUtilisateur"
                value={formData.nomUtilisateur}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Niveau d'accès */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau d'accès *
            </label>
            <select
              name="niveau_acces"
              value={formData.niveau_acces}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="moderateur">Modérateur</option>
              <option value="admin">Administrateur</option>
              <option value="super_admin">Super Administrateur</option>
            </select>
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="est_actif"
              id="est_actif"
              checked={formData.est_actif}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="est_actif" className="text-sm font-medium text-gray-700">
              Compte actif
            </label>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2  gap-4 text-center">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-2xl transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center  space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-800/60 rounded-2xl transition-colors disabled:opacity-50"
            >
              <MdSave className="h-4 w-4" />
              <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;