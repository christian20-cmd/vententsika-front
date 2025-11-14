import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Eye, 
  EyeOff, 
  LockIcon, 
  Loader, 
  AlertCircle, 
  CheckCircle, 
  User2Icon, 
  Phone,
  Shield,
  ArrowLeft
} from 'lucide-react';

const AdminRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    token: token || '',
    prenomUtilisateur: '',
    nomUtilisateur: '',
    email: '',
    tel: '',
    mot_de_passe: '',
    mot_de_passe_confirmation: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  
  // États pour le focus des champs
  const [focusedFields, setFocusedFields] = useState({
    prenomUtilisateur: false,
    nomUtilisateur: false,
    email: false,
    tel: false,
    mot_de_passe: false,
    mot_de_passe_confirmation: false
  });

  // Valider le token au chargement
  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/invitations/validate/${token}`);
      const data = await response.json();
      
      if (data.success) {
        setTokenInfo(data.data);
        if (data.data.email) {
          setFormData(prev => ({ ...prev, email: data.data.email }));
        }
      } else {
        setError('Lien d\'invitation invalide ou expiré');
      }
    } catch (err) {
      setError('Erreur de validation du lien');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors({});

    if (formData.mot_de_passe !== formData.mot_de_passe_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/register-with-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Compte administrateur créé avec succès !');
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        if (response.status === 422 && data.errors) {
          setValidationErrors(data.errors);
          setError('Veuillez corriger les erreurs dans le formulaire');
        } else {
          setError(data.message || 'Erreur lors de la création du compte');
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFieldFocus = (fieldName) => {
    setFocusedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleFieldBlur = (fieldName) => {
    setFocusedFields(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  const renderFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      return (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
          <AlertCircle size={14} />
          <span>{validationErrors[fieldName][0]}</span>
        </div>
      );
    }
    return null;
  };

  const handleBackToLogin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-300">
      {/* 🧱 Conteneur du formulaire */}
      <div className="relative rounded-3xl z-10 bg-white shadow-xl p-8 w-full max-w-md mx-4">
        {/* Bouton retour */}
        <button
          onClick={handleBackToLogin}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour à la connexion
        </button>

        <div className="flex justify-center mb-8">
          <div className='bg-gray-200 w-16 h-16 flex items-center justify-center rounded-full'>
            <Shield className='w-8 h-8 text-gray-700' />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {token ? 'Finaliser votre inscription' : 'Créer un compte Admin'}
            </h2>
            <p className="text-gray-600">
              {token ? 'Complétez vos informations pour activer votre compte' : 'Inscription administrateur'}
            </p>
          </div>

          {/* Info token */}
          {tokenInfo && (
            <div className="flex items-center gap-2 text-blue-700 text-sm bg-blue-50 py-3 px-4 rounded-2xl border border-blue-200">
              <CheckCircle size={16} />
              <div>
                <p className="font-medium">Invitation valide</p>
                <p className="text-xs">
                  Niveau d'accès : <span className="capitalize font-medium">{tokenInfo.niveau_acces}</span>
                </p>
              </div>
            </div>
          )}

          {/* Message d'erreur général */}
          {error && !Object.keys(validationErrors).length && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 py-3 px-4 rounded-2xl border border-red-200">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Message d'erreur de validation */}
          {error && Object.keys(validationErrors).length > 0 && (
            <div className="flex items-center gap-2 text-orange-500 text-sm bg-orange-50 py-3 px-4 rounded-2xl border border-orange-200">
              <AlertCircle size={16} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-500 text-sm bg-green-50 py-3 px-4 rounded-2xl border border-green-200">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* 🔐 Formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              {/* Prénom */}
              <div className="relative">
                <input
                  type="text"
                  name="prenomUtilisateur"
                  value={formData.prenomUtilisateur}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('prenomUtilisateur')}
                  onBlur={() => handleFieldBlur('prenomUtilisateur')}
                  className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                    validationErrors.prenomUtilisateur 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-600'
                  }`}
                  placeholder=" "
                  disabled={isLoading}
                />
                <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                  focusedFields.prenomUtilisateur || formData.prenomUtilisateur 
                    ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                    : 'top-1/2 transform -translate-y-1/2 text-gray-500'
                }`}>
                  <div className='items-center justify-center flex gap-2'>
                    <User2Icon size={14} />
                    Prénom
                  </div>
                </label>
                {renderFieldError('prenomUtilisateur')}
              </div>

              {/* Nom */}
              <div className="relative">
                <input
                  type="text"
                  name="nomUtilisateur"
                  value={formData.nomUtilisateur}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('nomUtilisateur')}
                  onBlur={() => handleFieldBlur('nomUtilisateur')}
                  className={`w-full h-12 bg-gray-50 border-2 rounded-2xl px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                    validationErrors.nomUtilisateur 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-600'
                  }`}
                  placeholder=" "
                  disabled={isLoading}
                />
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedFields.nomUtilisateur || formData.nomUtilisateur 
                    ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                    : 'top-1/2 transform -translate-y-1/2 text-gray-500'
                }`}>
                  Nom
                </label>
                {renderFieldError('nomUtilisateur')}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFieldFocus('email')}
                onBlur={() => handleFieldBlur('email')}
                className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500 ${
                  validationErrors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-600'
                }`}
                placeholder=" "
                disabled={isLoading || tokenInfo?.email}
              />
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                focusedFields.email || formData.email 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <Mail size={14} />
                  E-mail
                </div>
              </label>
              {renderFieldError('email')}
            </div>

            {/* Téléphone */}
            <div className="relative">
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                onFocus={() => handleFieldFocus('tel')}
                onBlur={() => handleFieldBlur('tel')}
                className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                  validationErrors.tel 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-600'
                }`}
                placeholder=" "
                disabled={isLoading}
              />
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                focusedFields.tel || formData.tel 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <Phone size={14} />
                  Téléphone
                </div>
              </label>
              {renderFieldError('tel')}
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                onFocus={() => handleFieldFocus('mot_de_passe')}
                onBlur={() => handleFieldBlur('mot_de_passe')}
                className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                  validationErrors.mot_de_passe 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-600'
                }`}
                placeholder=" "
                disabled={isLoading}
              />
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                focusedFields.mot_de_passe || formData.mot_de_passe 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <LockIcon size={14} />
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
              {renderFieldError('mot_de_passe')}
            </div>

            {/* Confirmation mot de passe */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="mot_de_passe_confirmation"
                value={formData.mot_de_passe_confirmation}
                onChange={handleChange}
                onFocus={() => handleFieldFocus('mot_de_passe_confirmation')}
                onBlur={() => handleFieldBlur('mot_de_passe_confirmation')}
                className="w-full h-12 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder=" "
                disabled={isLoading}
              />
              <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                focusedFields.mot_de_passe_confirmation || formData.mot_de_passe_confirmation 
                  ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
                  : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }`}>
                <div className='items-center justify-center flex gap-2'>
                  <LockIcon size={14} />
                  Confirmation
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

            {/* Bouton d'inscription */}
            <button 
              type="submit"
              disabled={isLoading || (token && !tokenInfo)}
              className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                !isLoading && tokenInfo
                  ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-400 cursor-not-allowed'
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  {token ? 'Activation...' : 'Création...'}
                </>
              ) : (
                token ? 'Activer mon compte' : 'Créer le compte'
              )}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <button
                onClick={handleBackToLogin}
                disabled={isLoading}
                className="text-blue-700 font-semibold hover:text-blue-600 transition-colors cursor-pointer disabled:text-gray-400"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;