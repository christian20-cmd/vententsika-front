import { useState } from 'react';
import { Upload, Building2, User, Mail, Phone, Lock, MapPin, AlertCircle, CheckCircle, ArrowLeft, MailCheck, KeyRound, Building, Eye, EyeOff, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoTB from '../../assets/LogoTB.png';

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1
    prenomUtilisateur: '',
    nomUtilisateur: '',
    email: '',
    tel: '',
    type_utilisateur: 'vendeur',

    // Étape 2
    verificationCode: '',

    // Étape 3 (entreprise seulement)
    nom_entreprise: '',
    adresse_entreprise: '',

    // Étape 4
    mot_de_passe: '',
    mot_de_passe_confirmation: '',
    adresse_personnelle: '',

    // Étape 5
    logo_image: null
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [userType, setUserType] = useState('vendeur');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // États pour le focus des champs
  const [focusedFields, setFocusedFields] = useState({
    prenomUtilisateur: false,
    nomUtilisateur: false,
    email: false,
    tel: false,
    verificationCode: false,
    nom_entreprise: false,
    adresse_entreprise: false,
    mot_de_passe: false,
    mot_de_passe_confirmation: false,
    adresse_personnelle: false
  });

  const navigate = useNavigate();

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleLoginClick = () => {
    navigate('/connexion');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const maxSize = 2048 * 1024;

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, logo_image: 'Format invalide. Utilisez jpeg, png, jpg ou gif' }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, logo_image: 'Le fichier ne doit pas dépasser 2MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, logo_image: file }));
      setErrors(prev => ({ ...prev, logo_image: '' }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Les fonctions de soumission des étapes restent inchangées
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = {};
    if (!formData.prenomUtilisateur.trim()) newErrors.prenomUtilisateur = 'Le prénom est requis';
    if (!formData.nomUtilisateur.trim()) newErrors.nomUtilisateur = 'Le nom est requis';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.tel.trim()) newErrors.tel = 'Le téléphone est requis';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      setUserType(formData.type_utilisateur);
      setCurrentStep(2);
      setLoading(false);
    }, 1500);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!formData.verificationCode.trim()) {
      setErrors({ verificationCode: 'Le code de vérification est requis' });
      return;
    }

    setLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      if (formData.type_utilisateur === 'entreprise') {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
      setLoading(false);
    }, 1500);
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = {};
    if (!formData.nom_entreprise.trim()) newErrors.nom_entreprise = 'Le nom de l\'entreprise est requis';
    if (!formData.adresse_entreprise.trim()) newErrors.adresse_entreprise = 'L\'adresse de l\'entreprise est requise';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      setCurrentStep(4);
      setLoading(false);
    }, 1500);
  };

  const handleStep4Submit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = {};
    if (!formData.mot_de_passe) {
      newErrors.mot_de_passe = 'Le mot de passe est requis';
    } else if (formData.mot_de_passe.length < 8) {
      newErrors.mot_de_passe = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.mot_de_passe !== formData.mot_de_passe_confirmation) {
      newErrors.mot_de_passe_confirmation = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      setCurrentStep(5);
      setLoading(false);
    }, 1500);
  };

  const handleStep5Submit = async (e) => {
    e.preventDefault();
    setApiError('');

    setLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      setLoading(false);
    }, 1500);
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      setResendLoading(false);
    }, 1500);
  };

  // Rendu des étapes avec le nouveau style

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="space-y-6">
      {/* Type d'utilisateur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de compte
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type_utilisateur: 'vendeur' }))}
            className={`p-4 border-2 rounded-2xl transition-all duration-300 ease-in-out group ${
              formData.type_utilisateur === 'vendeur'
                ? 'border-blue-700 bg-blue-50 shadow-md'
                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
          >
            <User className={`w-8 h-8 mx-auto mb-2 transition-colors duration-300 ${
              formData.type_utilisateur === 'vendeur' ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'
            }`} />
            <p className="font-medium text-gray-900 transition-colors duration-300">Vendeur Individuel</p>
            <p className="text-xs text-gray-500 mt-1">Projet personnel</p>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type_utilisateur: 'entreprise' }))}
            className={`p-4 border-2 rounded-2xl transition-all duration-300 ease-in-out group ${
              formData.type_utilisateur === 'entreprise'
                ? 'border-blue-700 bg-blue-50 shadow-md'
                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
          >
            <Building2 className={`w-8 h-8 mx-auto mb-2 transition-colors duration-300 ${
              formData.type_utilisateur === 'entreprise' ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'
            }`} />
            <p className="font-medium text-gray-900 transition-colors duration-300">Entreprise</p>
            <p className="text-xs text-gray-500 mt-1">Société commerciale</p>
          </button>
        </div>
      </div>

      {/* Informations personnelles avec labels flottants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prénom */}
        <div className="relative">
          <input
            type="text"
            name="prenomUtilisateur"
            value={formData.prenomUtilisateur}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('prenomUtilisateur')}
            onBlur={() => handleFieldBlur('prenomUtilisateur')}
            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
              errors.prenomUtilisateur 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-600'
            }`}
            placeholder=" "
          />
          <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
            focusedFields.prenomUtilisateur || formData.prenomUtilisateur 
              ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
              : 'top-1/2 transform -translate-y-1/2 text-gray-500'
          }`}>
            <div className='items-center justify-center flex gap-2'>
              <User size={14} />
              Prénom
            </div>
          </label>
          {errors.prenomUtilisateur && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.prenomUtilisateur}
            </div>
          )}
        </div>

        {/* Nom */}
        <div className="relative">
          <input
            type="text"
            name="nomUtilisateur"
            value={formData.nomUtilisateur}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('nomUtilisateur')}
            onBlur={() => handleFieldBlur('nomUtilisateur')}
            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
              errors.nomUtilisateur 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-600'
            }`}
            placeholder=" "
          />
          <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
            focusedFields.nomUtilisateur || formData.nomUtilisateur 
              ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
              : 'top-1/2 transform -translate-y-1/2 text-gray-500'
          }`}>
            <div className='items-center justify-center flex gap-2'>
              <User size={14} />
              Nom
            </div>
          </label>
          {errors.nomUtilisateur && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.nomUtilisateur}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('email')}
            onBlur={() => handleFieldBlur('email')}
            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-600'
            }`}
            placeholder=" "
          />
          <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
            focusedFields.email || formData.email 
              ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
              : 'top-1/2 transform -translate-y-1/2 text-gray-500'
          }`}>
            <div className='items-center justify-center flex gap-2'>
              <Mail size={14} />
              Email
            </div>
          </label>
          {errors.email && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.email}
            </div>
          )}
        </div>

        {/* Téléphone */}
        <div className="relative">
          <input
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('tel')}
            onBlur={() => handleFieldBlur('tel')}
            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
              errors.tel 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-600'
            }`}
            placeholder=" "
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
          {errors.tel && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.tel}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          formData.prenomUtilisateur && formData.nomUtilisateur && formData.email && formData.tel && !loading
            ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
            : 'bg-gray-400 cursor-not-allowed'
        } flex items-center justify-center`}
      >
        {loading ? (
          <>
            <Loader size={20} className="animate-spin mr-2" />
            Envoi du code...
          </>
        ) : (
          'Envoyer le code de vérification'
        )}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2Submit} className="space-y-6">
      <div className="text-center mb-6">
        <div className='bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4'>
          <MailCheck className='w-8 h-8 text-blue-700' />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Vérification de l'email</h3>
        <p className="text-gray-600 mt-2">
          Nous avons envoyé un code à 6 chiffres à <strong>{formData.email}</strong>
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          name="verificationCode"
          value={formData.verificationCode}
          onChange={handleInputChange}
          onFocus={() => handleFieldFocus('verificationCode')}
          onBlur={() => handleFieldBlur('verificationCode')}
          maxLength="6"
          className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
            errors.verificationCode 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-600'
          }`}
          placeholder=" "
        />
        <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
          focusedFields.verificationCode || formData.verificationCode 
            ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
            : 'top-1/2 transform -translate-y-1/2 text-gray-500'
        }`}>
          <div className='items-center justify-center flex gap-2'>
            <KeyRound size={14} />
            Code de vérification
          </div>
        </label>
        {errors.verificationCode && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <AlertCircle size={14} />
            {errors.verificationCode}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendLoading}
          className="flex-1 h-12 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {resendLoading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            'Renvoyer le code'
          )}
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`flex-1 h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            formData.verificationCode && !loading
              ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-gray-400 cursor-not-allowed'
          } flex items-center justify-center`}
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Vérification...
            </>
          ) : (
            'Vérifier le code'
          )}
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleStep3Submit} className="space-y-6">
      <div className="text-center mb-6">
        <div className='bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4'>
          <Building className='w-8 h-8 text-blue-700' />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Informations de l'entreprise</h3>
      </div>

      <div className="relative">
        <input
          type="text"
          name="nom_entreprise"
          value={formData.nom_entreprise}
          onChange={handleInputChange}
          onFocus={() => handleFieldFocus('nom_entreprise')}
          onBlur={() => handleFieldBlur('nom_entreprise')}
          className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
            errors.nom_entreprise 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-600'
          }`}
          placeholder=" "
        />
        <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
          focusedFields.nom_entreprise || formData.nom_entreprise 
            ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
            : 'top-1/2 transform -translate-y-1/2 text-gray-500'
        }`}>
          <div className='items-center justify-center flex gap-2'>
            <Building2 size={14} />
            Nom de l'entreprise
          </div>
        </label>
        {errors.nom_entreprise && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <AlertCircle size={14} />
            {errors.nom_entreprise}
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          name="adresse_entreprise"
          value={formData.adresse_entreprise}
          onChange={handleInputChange}
          onFocus={() => handleFieldFocus('adresse_entreprise')}
          onBlur={() => handleFieldBlur('adresse_entreprise')}
          rows="3"
          className={`w-full bg-gray-50 border-2 rounded-2xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
            errors.adresse_entreprise 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-600'
          }`}
          placeholder=" "
        />
        <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
          focusedFields.adresse_entreprise || formData.adresse_entreprise 
            ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
            : 'top-3 transform -translate-y-1/2 text-gray-500'
        }`}>
          <div className='items-center justify-center flex gap-2'>
            <MapPin size={14} />
            Adresse de l'entreprise
          </div>
        </label>
        {errors.adresse_entreprise && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <AlertCircle size={14} />
            {errors.adresse_entreprise}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          formData.nom_entreprise && formData.adresse_entreprise && !loading
            ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
            : 'bg-gray-400 cursor-not-allowed'
        } flex items-center justify-center`}
      >
        {loading ? (
          <>
            <Loader size={20} className="animate-spin mr-2" />
            Enregistrement...
          </>
        ) : (
          'Continuer'
        )}
      </button>
    </form>
  );

  const renderStep4 = () => (
    <form onSubmit={handleStep4Submit} className="space-y-6">
      <div className="text-center mb-6">
        <div className='bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4'>
          <Lock className='w-8 h-8 text-blue-700' />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Création du mot de passe</h3>
      </div>

      {userType === 'vendeur' && (
        <div className="relative">
          <textarea
            name="adresse_personnelle"
            value={formData.adresse_personnelle}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('adresse_personnelle')}
            onBlur={() => handleFieldBlur('adresse_personnelle')}
            rows="2"
            className="w-full bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            placeholder=" "
          />
          <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
            focusedFields.adresse_personnelle || formData.adresse_personnelle 
              ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
              : 'top-3 transform -translate-y-1/2 text-gray-500'
          }`}>
            <div className='items-center justify-center flex gap-2'>
              <MapPin size={14} />
              Adresse personnelle
            </div>
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mot de passe */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('mot_de_passe')}
            onBlur={() => handleFieldBlur('mot_de_passe')}
            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
              errors.mot_de_passe 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-600'
            }`}
            placeholder=" "
          />
          <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
            focusedFields.mot_de_passe || formData.mot_de_passe 
              ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
              : 'top-1/2 transform -translate-y-1/2 text-gray-500'
          }`}>
            <div className='items-center justify-center flex gap-2'>
              <Lock size={14} />
              Mot de passe
            </div>
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.mot_de_passe && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.mot_de_passe}
            </div>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="mot_de_passe_confirmation"
            value={formData.mot_de_passe_confirmation}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('mot_de_passe_confirmation')}
            onBlur={() => handleFieldBlur('mot_de_passe_confirmation')}
            className={`w-full h-12 bg-gray-50 border-2 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
              errors.mot_de_passe_confirmation 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-600'
            }`}
            placeholder=" "
          />
          <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
            focusedFields.mot_de_passe_confirmation || formData.mot_de_passe_confirmation 
              ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-blue-800' 
              : 'top-1/2 transform -translate-y-1/2 text-gray-500'
          }`}>
            <div className='items-center justify-center flex gap-2'>
              <Lock size={14} />
              Confirmation
            </div>
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.mot_de_passe_confirmation && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.mot_de_passe_confirmation}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          formData.mot_de_passe && formData.mot_de_passe_confirmation && !loading
            ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
            : 'bg-gray-400 cursor-not-allowed'
        } flex items-center justify-center`}
      >
        {loading ? (
          <>
            <Loader size={20} className="animate-spin mr-2" />
            Enregistrement...
          </>
        ) : (
          'Continuer'
        )}
      </button>
    </form>
  );

  const renderStep5 = () => (
    <form onSubmit={handleStep5Submit} className="space-y-6">
      <div className="text-center mb-6">
        <div className='bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4'>
          <Upload className='w-8 h-8 text-blue-700' />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Finalisation</h3>
        <p className="text-gray-600 mt-2">Ajoutez un logo pour votre profil (optionnel)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo / Image (optionnel)
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer group">
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
              errors.logo_image
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
            }`}>
              <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors duration-300 ${
                errors.logo_image ? 'text-red-600' : 'text-gray-400 group-hover:text-blue-600'
              }`} />
              <p className="text-sm text-gray-600">
                {formData.logo_image ? formData.logo_image.name : 'Cliquez pour choisir une image'}
              </p>
              <p className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG, GIF (max 2MB)</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {previewLogo && (
            <div className="w-24 h-24 border-2 border-gray-300 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img src={previewLogo} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        {errors.logo_image && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <AlertCircle size={14} />
            {errors.logo_image}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || success}
        className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          !loading && !success
            ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
            : 'bg-gray-400 cursor-not-allowed'
        } flex items-center justify-center`}
      >
        {loading ? (
          <>
            <Loader size={20} className="animate-spin mr-2" />
            <span>Finalisation...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Inscription réussie !</span>
          </>
        ) : (
          <span>Finaliser l'inscription</span>
        )}
      </button>
    </form>
  );

  // Indicateur de progression
  const getStepTitle = () => {
    const steps = {
      1: 'Informations personnelles',
      2: 'Vérification email',
      3: 'Informations entreprise',
      4: 'Mot de passe',
      5: 'Finalisation'
    };
    return steps[currentStep];
  };

  const getStepIcon = () => {
    const icons = {
      1: <User className="w-6 h-6" />,
      2: <MailCheck className="w-6 h-6" />,
      3: <Building className="w-6 h-6" />,
      4: <Lock className="w-6 h-6" />,
      5: <Upload className="w-6 h-6" />
    };
    return icons[currentStep];
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-300 py-8 px-4">
      {/* 🧱 Conteneur principal */}
      <div className="relative rounded-3xl z-10 bg-white shadow-xl p-8 w-full max-w-2xl mx-4">
        {/* Bouton retour */}
        <button
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-300 mb-4 cursor-pointer group"
          onClick={handleBack}
        >
          <ArrowLeft size={20} className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Retour
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={LogoTB} alt="logo" className='w-32'/>
        </div>

        {/* En-tête avec progression */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gray-200 w-20 h-20 p-4 rounded-full flex items-center justify-center text-gray-700 shadow-lg">
            {getStepIcon()}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-800">Créer un compte</h2>
            <p className="text-gray-600">{getStepTitle()}</p>
          </div>
        </div>

        {/* Indicateur de progression visuel */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                  step === currentStep
                    ? 'bg-blue-700 text-white shadow-lg transform scale-110'
                    : step < currentStep
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-1 transition-colors duration-500 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Messages d'alerte et de succès */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Inscription réussie ! 🎉</p>
              <p className="text-green-700 text-sm mt-1">Redirection en cours...</p>
            </div>
          </div>
        )}

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{apiError}</p>
          </div>
        )}

        {/* Rendu de l'étape actuelle */}
        <div className="relative min-h-[350px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Lien de connexion (uniquement sur la première étape) */}
        {currentStep === 1 && (
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Vous avez déjà un compte?{' '}
              <button
                type="button"
                onClick={handleLoginClick}
                className="text-blue-700 font-semibold hover:text-blue-600 transition-colors cursor-pointer"
              >
                Se connecter
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}