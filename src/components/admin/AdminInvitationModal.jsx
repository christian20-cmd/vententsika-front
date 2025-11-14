// ../components/admin/AdminInvitationModal.jsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MdLink, MdEmail, MdSecurity, MdContentCopy } from 'react-icons/md';
import LogoTB from '../../assets/LogoTB.png';

const AdminInvitationModal = ({ isOpen, onClose, onInvitationSent }) => {
  const [formData, setFormData] = useState({
    email: '',
    niveau_acces: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invitationData, setInvitationData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/invitations/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setInvitationData(data.data);
        if (formData.email) {
          onInvitationSent(data.data);
        }
      } else {
        setError(data.message || 'Erreur lors de la génération');
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

  const copyToClipboard = () => {
    if (invitationData?.invitation_url) {
      navigator.clipboard.writeText(invitationData.invitation_url);
      // Vous pouvez ajouter un toast de confirmation ici
    }
  };

  const handleNewInvitation = () => {
    setInvitationData(null);
    setFormData({ email: '', niveau_acces: 'admin' });
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

            <h2 className="text-xl font-bold text-gray-900">
              {invitationData ? 'Lien d\'invitation généré' : 'Inviter un Administrateur'}
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            {invitationData ? 'Partagez ce lien' : 'Générer un lien d\'invitation'}
          </p>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-4">
              {error}
            </div>
          )}

          {!invitationData ? (
            // Formulaire de génération
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optionnel)
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
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200"
                    placeholder="email@example.com (optionnel)"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Si renseigné, le lien sera envoyé par email. Sinon, vous pourrez le copier manuellement.
                </p>
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

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
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
                  {loading ? 'Génération...' : 'Générer le lien'}
                </button>
              </div>
            </form>
          ) : (
            // Affichage du lien généré
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Lien d'invitation :</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm transition-all duration-200"
                  >
                    <MdContentCopy size={16} />
                    <span>Copier</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600 break-all bg-white p-3 rounded-2xl border border-gray-300">
                  {invitationData.invitation_url}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Niveau d'accès :</span>
                  <p className="text-gray-600 capitalize">{invitationData.niveau_acces}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Expire dans :</span>
                  <p className="text-gray-600">{invitationData.expiration_minutes} minutes</p>
                </div>
              </div>

              {invitationData.email_envoye && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">
                  ✅ Lien envoyé par email à {formData.email}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleNewInvitation}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Nouvelle invitation
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-blue-800 text-white px-4 py-2 rounded-2xl hover:bg-blue-900 transition-all duration-200 font-medium"
                >
                  Terminer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInvitationModal;