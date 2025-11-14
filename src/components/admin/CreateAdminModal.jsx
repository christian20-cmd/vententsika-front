// ../components/admin/CreateAdminModal.jsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MdAdminPanelSettings, MdEmail, MdPerson, MdPhone, MdSecurity } from 'react-icons/md';
import LogoTB from '../../assets/LogoTB.png';

const CreateAdminModal = ({ isOpen, onClose, onAdminCreated }) => {
  const [formData, setFormData] = useState({
    prenomUtilisateur: '',
    nomUtilisateur: '',
    email: '',
    tel: '',
    mot_de_passe: '',
    niveau_acces: 'admin',
    permissions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/administrateurs/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onAdminCreated(data.admin);
        onClose();
        // Réinitialiser le formulaire
        setFormData({
          prenomUtilisateur: '',
          nomUtilisateur: '',
          email: '',
          tel: '',
          mot_de_passe: '',
          niveau_acces: 'admin',
          permissions: []
        });
      } else {
        setError(data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

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

        {/* En-tête */}
        <div className='text-center'>
          <div className="">

            <h2 className="text-xl font-bold text-gray-900">Nouvel Administrateur</h2>
          </div>
          <p className="text-gray-500">Création manuelle</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdPerson className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="prenomUtilisateur"
                    value={formData.prenomUtilisateur}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200"
                    placeholder="John"
                  />
                </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                required
                minLength="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau d'accès *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSecurity className="text-gray-400" />
                </div>
                <select
                  name="niveau_acces"
                  value={formData.niveau_acces}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200 appearance-none bg-white"
                >
                  <option value="moderateur">Modérateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-800 text-white px-4 py-2 rounded-2xl hover:bg-blue-900 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer l\'admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;