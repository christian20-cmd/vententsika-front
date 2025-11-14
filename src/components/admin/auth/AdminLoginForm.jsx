import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft, LogIn, Mail, LockIcon, Loader, AlertCircle, User2Icon } from 'lucide-react';
import axios from 'axios';

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) setError('');
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('✅ Connexion admin réussie, redirection...');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(
        error.response?.data?.message || 
        'Erreur de connexion. Vérifiez vos identifiants.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSelection = () => {
    navigate('/');
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion Administrateur</h2>
            <p className="text-gray-600">Accédez à votre interface d'administration</p>
          </div>

          {/* 🔐 Formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full h-12 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder=" "
                disabled={isLoading}
              />
        
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                isEmailFocused || formData.email 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <Mail 
                    size={14} 
                    className={`transition-colors duration-200 ${
                      isEmailFocused ? 'text-blue-600' : 'text-gray-500'
                    }`} 
                  />
                  E-mail administratif
                </div>
              </label>
            </div>

            {/* Password Input */}
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
              />
            
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                isPasswordFocused || formData.password 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <LockIcon 
                    size={14} 
                    className={`transition-colors duration-200 ${
                      isPasswordFocused ? 'text-blue-600' : 'text-gray-500'
                    }`} 
                  />
                  Mot de passe
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

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 py-3 px-4 rounded-2xl border border-red-200">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Bouton de connexion */}
            <button 
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                isFormValid && !isLoading
                  ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-400 cursor-not-allowed'
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Se connecter
                </>
              )}
            </button>

            {/* Options supplémentaires */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link
                to="/admin-forgot-password"
                className="text-sm text-blue-700 hover:text-blue-600 transition-colors cursor-pointer disabled:text-gray-400"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-800 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Accès sécurisé
                  </p>
                  <p className="text-xs text-blue-700">
                    Cette interface est réservée aux administrateurs autorisés. 
                    Toutes les activités sont journalisées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;