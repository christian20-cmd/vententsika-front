import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Eye, EyeOff, CheckCircle, ArrowLeft, LockIcon, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ResetPasswordAdmin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email') || localStorage.getItem('admin_reset_email');
    
    if (!urlToken || !urlEmail) {
      setError('Lien de réinitialisation invalide ou expiré');
      return;
    }

    setToken(urlToken);
    setEmail(urlEmail);

    // Valider le token
    validateToken(urlToken, urlEmail);
  }, [searchParams]);

  const validateToken = async (token, email) => {
    try {
      const response = await axios.post('http://localhost:8000/api/admin/password/validate-token', {
        token,
        email
      });

      if (!response.data.is_valid) {
        setError('Le lien de réinitialisation est invalide ou a expiré');
      }
    } catch (error) {
      console.error('Erreur validation token:', error);
      setError('Erreur de validation du lien. Veuillez refaire une demande.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.password || !formData.password_confirmation) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/admin/password/reset', {
        token,
        email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response.data.success) {
        setSuccess(true);
        // Nettoyer le stockage
        localStorage.removeItem('admin_reset_email');
      }
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors de la réinitialisation. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/admin/login');
  };

  const handleNewRequest = () => {
    navigate('/admin-forgot-password');
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-300">
        <div className="relative rounded-3xl z-10 bg-white shadow-xl p-8 w-full max-w-md mx-4">
          <div className="text-center space-y-6">
            <div className='bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto'>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Mot de passe réinitialisé !
              </h2>
              <p className="text-gray-600">
                Votre mot de passe a été réinitialisé avec succès. 
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>

            <button
              onClick={handleBackToLogin}
              className="w-full h-12 bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-300">
      {/* 🧱 Conteneur du formulaire */}
      <div className="relative rounded-3xl z-10 bg-white shadow-xl p-8 w-full max-w-md mx-4">
        {/* Bouton retour */}
        <button
          onClick={handleNewRequest}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Nouvelle demande
        </button>

        <div className="flex justify-center mb-8">
          <div className='bg-gray-200 w-16 h-16 flex items-center justify-center rounded-full'>
            <Shield className='w-8 h-8 text-gray-700' />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nouveau mot de passe
            </h2>
            <p className="text-gray-600">Définissez votre nouveau mot de passe administrateur</p>
          </div>

          {/* Informations email */}
          <div className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 py-3 px-4 rounded-2xl border border-gray-200">
            <CheckCircle size={16} />
            <span><strong>Email:</strong> {email}</span>
          </div>

          {/* 🔐 Formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 py-3 px-4 rounded-2xl border border-red-200">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Nouveau mot de passe */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full h-12 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder=" "
                disabled={isLoading}
                minLength="8"
              />
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                isPasswordFocused || formData.password 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <LockIcon size={14} />
                  Nouveau mot de passe
                </div>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirmation mot de passe */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
                className="w-full h-12 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder=" "
                disabled={isLoading}
              />
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                isConfirmPasswordFocused || formData.password_confirmation 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <LockIcon size={14} />
                  Confirmer le mot de passe
                </div>
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Recommandations de sécurité */}
            <div className="flex items-start gap-3 text-blue-700 text-sm bg-blue-50 py-3 px-4 rounded-2xl border border-blue-200">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Recommandations de sécurité :</p>
                <ul className="text-xs space-y-1">
                  <li>• Minimum 8 caractères</li>
                  <li>• Mélange de lettres et chiffres</li>
                  <li>• Évitez les mots de passe courants</li>
                </ul>
              </div>
            </div>

            {/* Bouton de réinitialisation */}
            <button 
              type="submit"
              disabled={!formData.password || !formData.password_confirmation || isLoading}
              className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                formData.password && formData.password_confirmation && !isLoading
                  ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-400 cursor-not-allowed'
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Réinitialisation...
                </>
              ) : (
                <>
                  <Shield size={18} className="mr-2" />
                  Réinitialiser le mot de passe
                </>
              )}
            </button>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-green-700 text-sm bg-green-50 py-3 px-4 rounded-2xl border border-green-200">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Sécurisé</p>
                <p className="text-xs">
                  Votre nouveau mot de passe sera chiffré et sécurisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordAdmin;