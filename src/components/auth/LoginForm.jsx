import React, { useState } from 'react'
import { Mail, Eye, EyeOff, LockIcon, Loader, AlertCircle, CheckCircle, User2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LogoTB from '../../assets/LogoTB.png'
// 🔥 AJOUTER CES IMPORTS
import { 
  setAuthToken, 
  setCurrentUser, 
  clearAuthTokens,
  checkAuthentication 
} from '../../utils/authUtils'

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isEmailFocused, setIsEmailFocused] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Effacer l'erreur quand l'utilisateur tape
        if (error) setError('')
    }

    const validateForm = () => {
        if (!formData.email.trim()) {
            setError('L\'email est requis')
            return false
        }
        
        if (!formData.password.trim()) {
            setError('Le mot de passe est requis')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez saisir une adresse email valide')
            return false
        }

        return true
    }

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== ''

    const handleRegisterClick = () => {
        navigate('/register')
    }

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password')
    }

    const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
        console.log('📡 Envoi de la requête de connexion...');
        
        const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email: formData.email,
            password: formData.password
        })
        });

        console.log('📡 Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        });

        const data = await response.json();
        console.log('📡 Données reçues:', data);

        if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
        }

        console.log('🔐 Analyse du token reçu:', {
        tokenPresent: !!data.token,
        tokenType: typeof data.token,
        tokenLength: data.token?.length,
        tokenPreview: data.token ? data.token.substring(0, 50) + '...' : 'Aucun token'
        });

        if (data.token && typeof data.token === 'string' && data.token.length > 10) {
        console.log('✅ Token valide détecté');
        
        // 🔥 CORRECTION : Forcer rememberMe à true pour utiliser localStorage
        const tokenSaved = setAuthToken(data.token, true);
        
        if (tokenSaved) {
            // Stocker les infos utilisateur
            if (data.user) {
            setCurrentUser(data.user);
            console.log('👤 Utilisateur stocké:', data.user);
            }
            
            console.log('✅ Authentification réussie, redirection...');
            
            // 🔥 VÉRIFICATION DÉTAILLÉE DU STOCKAGE
            console.log('🔍 Vérification DÉTAILLÉE du stockage:');
            console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
            console.log('localStorage token:', localStorage.getItem('token'));
            console.log('sessionStorage auth_token:', sessionStorage.getItem('auth_token'));
            console.log('sessionStorage token:', sessionStorage.getItem('token'));
            console.log('user:', localStorage.getItem('user'));
            
            // Vérification avec getAuthToken
            const authCheck = checkAuthentication();
            console.log('🔐 Vérification authUtils:', authCheck);
            
            // Test immédiat de l'API
            try {
            console.log('🧪 Test immédiat de l\'API...');
            const testResponse = await fetch('http://localhost:8000/api/user', {
                headers: {
                'Authorization': `Bearer ${data.token}`,
                'Accept': 'application/json',
                }
            });
            console.log('🧪 Test API résultat:', {
                status: testResponse.status,
                statusText: testResponse.statusText
            });
            } catch (testError) {
            console.error('🧪 Erreur test API:', testError);
            }
            
            // Redirection après un délai pour laisser le temps au stockage
            setTimeout(() => {
            console.log('🔄 Redirection vers /dashboard');
            navigate('/dashboard');
            }, 1000);
        } else {
            throw new Error('Erreur lors du stockage du token');
        }
        } else {
        console.error('❌ Token invalide ou manquant:', data);
        throw new Error('Token d\'authentification invalide ou manquant dans la réponse du serveur');
        }

    } catch (err) {
        console.error('❌ Erreur de connexion complète:', err);
        setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
        // Nettoyer en cas d'erreur
        clearAuthTokens();
        
        // Vérification du nettoyage
        console.log('🧹 Après nettoyage:');
        console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
        console.log('sessionStorage auth_token:', sessionStorage.getItem('auth_token'));
    } finally {
        setIsLoading(false);
    }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-300">
            {/* 🧱 Conteneur du formulaire */}
            <div className="relative rounded-3xl z-10 bg-white  shadow-xl p-8 w-full max-w-md mx-4">
                <div className="flex justify-center mb-8">
                    <img src={LogoTB} alt="logo" className='w-32'/>
                </div>

                <div className="space-y-6">
                    <div className="text-center">
                        <div className='bg-gray-200 w-16 p-4 place-self-center rounded-full'>
                            <User2Icon className='place-self-center'/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h2>
                        <p className="text-gray-600">Connectez-vous à votre compte</p>
                    </div>

                    {/* 🔐 Formulaire */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="relative">
                            
                        
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
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
                                    E-mail
                                </div>
                            </label>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            
                        
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
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
                                'Se connecter'
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
                            <button
                                type="button"
                                onClick={handleForgotPasswordClick}
                                disabled={isLoading}
                                className="text-sm text-blue-700 hover:text-blue-600 transition-colors cursor-pointer disabled:text-gray-400"
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>

                        {/* Lien d'inscription */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                                Pas encore de compte ?{' '}
                                <button
                                    type="button"
                                    onClick={handleRegisterClick}
                                    disabled={isLoading}
                                    className="text-blue-700 font-semibold hover:text-blue-600 transition-colors cursor-pointer disabled:text-gray-400"
                                >
                                    S'inscrire
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm