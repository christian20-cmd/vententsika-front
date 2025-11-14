import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const PasswordForgetAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email) {
      setError('Veuillez saisir votre adresse email');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/admin/password/forgot', {
        email: email
      });

      if (response.data.success) {
        setSuccess(true);
        localStorage.setItem('admin_reset_email', email);
      }
    } catch (error) {
      console.error('Erreur demande de réinitialisation:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors de la demande de réinitialisation. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/admin/login');
  };

  const handleBackToSelection = () => {
    navigate('/');
  };

  const handleNewRequest = () => {
    setSuccess(false);
    setEmail('');
    setError('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-300">
      {/* 🧱 Conteneur du formulaire */}
      <div className="relative rounded-3xl z-10 bg-white shadow-xl p-8 w-full max-w-md mx-4">
        {/* Bouton retour */}
        <button
          onClick={handleBackToSelection}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour au choix d'espace
        </button>

        <div className="flex justify-center mb-8">
          <div className='bg-gray-200 w-16 h-16 flex items-center justify-center rounded-full'>
            <Shield className='w-8 h-8 text-gray-700' />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Mot de passe oublié
            </h2>
            <p className="text-gray-600">Administration - Réinitialisation du mot de passe</p>
          </div>

          {success ? (
            /* ✅ État de succès */
            <div className="text-center space-y-6">
              <div className='bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto'>
                <CheckCircle className='w-8 h-8 text-green-600' />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Email envoyé !
                </h3>
                <p className="text-gray-600">
                  Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. 
                  Veuillez vérifier votre boîte de réception et suivre les instructions.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBackToLogin}
                  className="w-full h-12 bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Retour à la connexion
                </button>
                
                <button
                  onClick={handleNewRequest}
                  className="w-full h-12 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Nouvelle demande
                </button>
              </div>
            </div>
          ) : (
            /* 🔐 Formulaire de demande */
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Instructions */}
              <div className="flex items-start gap-3 text-blue-700 text-sm bg-blue-50 py-3 px-4 rounded-2xl border border-blue-200">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Instructions</p>
                  <p className="text-xs">
                    Saisissez votre adresse email administrative. 
                    Vous recevrez un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 py-3 px-4 rounded-2xl border border-red-200">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="w-full h-12 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  placeholder=" "
                  required
                  disabled={isLoading}
                />
                <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                  isEmailFocused || email 
                    ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                    : 'top-1/2 transform -translate-y-1/2 text-gray-500'
                }`}>
                  <div className='items-center justify-center flex gap-2'>
                    <Mail size={14} />
                    E-mail administratif
                  </div>
                </label>
              </div>

              {/* Bouton d'envoi */}
              <button 
                type="submit"
                disabled={!email || isLoading}
                className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  email && !isLoading
                    ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-gray-400 cursor-not-allowed'
                } flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail size={18} className="mr-2" />
                    Envoyer le lien de réinitialisation
                  </>
                )}
              </button>

              {/* Bouton retour */}
              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isLoading}
                className="w-full h-12 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retour à la connexion
              </button>
            </form>
          )}

          {/* Informations de sécurité */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-yellow-700 text-sm bg-yellow-50 py-3 px-4 rounded-2xl border border-yellow-200">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Sécurité</p>
                <p className="text-xs">
                  Le lien de réinitialisation est valable 15 minutes. 
                  Si vous ne recevez pas l'email, vérifiez vos spams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordForgetAdmin;