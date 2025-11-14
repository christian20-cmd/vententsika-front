import React, { useState } from 'react'
import { Mail, ArrowBigLeftDashIcon, CheckCircle, Loader, User2Icon, KeyIcon, LockKeyholeOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LogoTB from '../../assets/LogoTB.png'

const ForgotPasswordForm = () => {
    const [isEmailFocused, setIsEmailFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')
    
    const [formData, setFormData] = useState({
        email: ''
    })

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        if (error) setError('')
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isFormValid = formData.email.trim() !== '' && validateEmail(formData.email)

    const handleRegisterClick = () => {
        navigate('/register')
    }

    const handleSendEmail = async (e) => {
        e.preventDefault()
        
        if (!isFormValid) {
            setError('Veuillez saisir une adresse email valide')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // 🔥 APPEL RÉEL AU BACKEND
            const response = await fetch('http://localhost:8000/api/password/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'envoi du code')
            }

            if (data.success) {
                setIsSubmitted(true)
                
                // Redirection vers la page de vérification avec l'email
                setTimeout(() => {
                    navigate('/verify-code', { 
                        state: { email: formData.email }
                    })
                }, 1500)
            } else {
                throw new Error(data.message || 'Erreur lors de l\'envoi du code')
            }

        } catch (err) {
            setError(err.message || 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.')
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
                <div className="relative z-10 bg-white rounded-2xl py-14 shadow-2xl p-8 w-full max-w-md mx-4">
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
                            Email envoyé !
                        </h2>
                        
                        <p className="text-gray-600 mb-4">
                            Nous avons envoyé un code de réinitialisation à :
                        </p>
                        
                        <p className="text-blue-900 font-semibold text-lg mb-6">
                            {formData.email}
                        </p>
                        
                        <p className="text-gray-500 text-sm">
                            Redirection vers la page de vérification...
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
            <div className="relative z-10 bg-white py-8 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
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
                        <div>
                            <div className='bg-gray-200 w-16 p-4 place-self-center rounded-full'>
                            <LockKeyholeOpen className='place-self-center'/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mot de passe oublié</h2>
                            <p className="text-gray-600">
                                Entrez l'adresse email de votre compte
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSendEmail}>
                            <div className="relative">
                                
                                
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(false)}
                                    className="w-full h-14 bg-gray-50 border-2 border-gray-300 rounded-2xl pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                    placeholder=""
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

                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-2xl border border-red-200">
                                    {error}
                                </div>
                            )}

                            {formData.email && !validateEmail(formData.email) && (
                                <div className="text-amber-600 text-sm bg-amber-50 py-2 px-3 rounded-lg border border-amber-200">
                                    Veuillez saisir une adresse email valide
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
                                        Envoi en cours...
                                    </>
                                ) : (
                                    'Envoyer le code de vérification'
                                )}
                            </button>

                            <div className="text-center pt-4">
                                <p className="text-gray-600">
                                    Pas encore de compte ?{' '}
                                    <button
                                        type="button"
                                        onClick={handleRegisterClick}
                                        disabled={isLoading}
                                        className="text-blue-800 font-semibold hover:text-blue-800/70 transition-colors cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        S'inscrire
                                    </button>
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-gray-500 text-sm">
                                    Vous recevrez un email avec un code à 6 chiffres pour réinitialiser votre mot de passe.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordForm