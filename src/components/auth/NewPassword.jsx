import React, { useState } from 'react'
import { Lock, Eye, EyeOff, ArrowBigLeftDashIcon, CheckCircle, Loader, KeyboardOffIcon, KeyRoundIcon, LockIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoTB from '../../assets/LogoTB.png'

const NewPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: ''
    })

    const navigate = useNavigate()
    const location = useLocation()
    const { email, code } = location.state || {}

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        if (error) setError('')
    }

    const validateForm = () => {
        if (!formData.password) {
            setError('Le mot de passe est requis')
            return false
        }

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères')
            return false
        }

        if (formData.password !== formData.password_confirmation) {
            setError('Les mots de passe ne correspondent pas')
            return false
        }

        return true
    }

    const isFormValid = formData.password.length >= 8 && 
                       formData.password_confirmation.length >= 8 &&
                       formData.password === formData.password_confirmation

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) return

        if (!email || !code) {
            setError('Données manquantes. Veuillez recommencer le processus.')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:8000/api/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: code,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la réinitialisation')
            }

            if (data.success) {
                setIsSubmitted(true)
                // Redirection vers la page de connexion après succès
                setTimeout(() => {
                    navigate('/connexion', { 
                        state: { 
                            message: 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.'
                        }
                    })
                }, 2000)
            } else {
                throw new Error(data.message || 'Erreur lors de la réinitialisation')
            }
            
        } catch (err) {
            setError(err.message || 'Erreur lors de la réinitialisation. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    if (isSubmitted) {
        return (
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-200">
                <div className="relative z-10 bg-white rounded-3xl py-14 shadow-2xl p-8 w-full max-w-md mx-4">
                    <button  
                        className="flex font-bold items-center text-blue-900 hover:text-blue-900/70 transition-colors mb-4 cursor-pointer"
                        onClick={handleBack}
                    >
                        <ArrowBigLeftDashIcon size={30} className="mr-2" />
                    </button>
                    
                    <div className="flex justify-center mb-6">
                        <img src={LogoTB} alt="logo" className='w-40'/>
                    </div>

                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <CheckCircle size={80} className="text-green-500" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-primary-800 mb-2">
                            Mot de passe réinitialisé !
                        </h2>
                        
                        <p className="text-gray-600 mb-4">
                            Votre mot de passe a été modifié avec succès.
                        </p>
                        
                        <p className="text-gray-500 text-sm">
                            Un email de confirmation a été envoyé à {email}
                        </p>
                        
                        <p className="text-gray-500 text-sm">
                            Redirection vers la page de connexion...
                        </p>
                        
                        <div className="flex justify-center">
                            <Loader size={24} className="animate-spin text-blue-900" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-MyFontFamily bg-gray-300">
            <div className="relative z-10 bg-white rounded-3xl py-8 shadow-2xl p-8 w-full max-w-md mx-4">
                <button  
                    className="flex font-bold items-center text-blue-900 hover:text-blue-900/70 transition-colors mb-4 cursor-pointer"
                    onClick={handleBack}
                >
                    <ArrowBigLeftDashIcon size={30} className="mr-2" />
                </button>
                
                <div className="flex justify-center mb-6">
                    <img src={LogoTB} alt="logo" className='w-32'/>
                </div>

                <div className="space-y-6 font-MyFontFamily">
                    <div className="text-center">
                        <div className='bg-gray-200 w-16 p-4 place-self-center rounded-full'>
                            <KeyRoundIcon className='place-self-center'/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h2>
                        
                        <p className="text-gray-600">
                            Créez votre nouveau mot de passe
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Nouveau mot de passe */}
                        <div className="relative">
                            
                            
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                className="w-full h-14 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                placeholder=""
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
                                        Nouveau Mot de passe
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

                        {/* Confirmation du mot de passe */}
                        <div className="relative">
                            
                            
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                onFocus={() => setIsConfirmPasswordFocused(true)}
                                onBlur={() => setIsConfirmPasswordFocused(false)}
                                className="w-full h-14 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                placeholder=""
                                disabled={isLoading}
                            />
                            
                            <label className={`absolute left-7 transition-all duration-200 pointer-events-none ${
                                isConfirmPasswordFocused || formData.password_confirmation 
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
                                        Confirmer le Mot de passe
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

                        {/* Indications mot de passe */}
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>Le mot de passe doit contenir au moins :</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                                    8 caractères
                                </li>
                                <li className={formData.password === formData.password_confirmation && formData.password_confirmation ? 'text-green-600' : ''}>
                                    Les mots de passe doivent correspondre
                                </li>
                            </ul>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                                isFormValid && !isLoading
                                    ? 'bg-primary-800 hover:bg-primary-900 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            } flex items-center justify-center`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Réinitialisation...
                                </>
                            ) : (
                                'Réinitialiser le mot de passe'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewPassword