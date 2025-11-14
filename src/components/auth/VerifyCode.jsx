import React, { useState, useRef, useEffect } from 'react'
import { Mail, ArrowBigLeftDashIcon, Clock, RefreshCw, CheckCircle, CodeSquareIcon, Code2Icon, MailQuestionMarkIcon, MailWarningIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoTB from '../../assets/LogoTB.png'

const VerifyCode = () => {
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes en secondes
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    
    const inputRefs = useRef([])
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleCodeChange = (index, value) => {
        if (!/^\d?$/.test(value)) return
        
        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)
        setError('')

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus()
        }
        
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus()
        }
        
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').trim()
        
        if (/^\d{6}$/.test(pastedData)) {
            const newCode = pastedData.split('').slice(0, 6)
            setCode(newCode)
            setError('')
            inputRefs.current[5].focus()
        }
    }

    const handleResendCode = async () => {
        if (timeLeft > 0 || isResending) return
        
        setIsResending(true)
        setError('')
        
        try {
            const response = await fetch('http://localhost:8000/api/password/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'envoi du code')
            }

            if (data.success) {
                setTimeLeft(600)
                setError('')
            } else {
                throw new Error(data.message || 'Erreur lors de l\'envoi du code')
            }

        } catch (err) {
            setError(err.message || 'Erreur lors de l\'envoi du code. Veuillez réessayer.')
        } finally {
            setIsResending(false)
        }
    }

    const isFormValid = code.every(digit => digit !== '')

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!isFormValid) {
            setError('Veuillez saisir le code complet')
            return
        }

        if (!email) {
            setError('Email non trouvé. Veuillez retourner à la page précédente.')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const verificationCode = code.join('')
            
            const response = await fetch('http://localhost:8000/api/password/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: verificationCode
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Erreur de vérification')
            }

            if (data.success) {
                setIsVerified(true)
                // Redirection vers la page de nouveau mot de passe
                setTimeout(() => {
                    navigate('/new-password', { 
                        state: { 
                            email: email,
                            code: verificationCode
                        }
                    })
                }, 1500)
            } else {
                throw new Error(data.message || 'Code invalide')
            }
            
        } catch (err) {
            setError(err.message || 'Code invalide. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    if (isVerified) {
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
                            Code vérifié !
                        </h2>
                        
                        <p className="text-gray-600 mb-4">
                            Votre code a été vérifié avec succès
                        </p>
                        
                        <p className="text-gray-500 text-sm">
                            Redirection vers la page de nouveau mot de passe...
                        </p>
                        
                        <div className="flex justify-center">
                            <RefreshCw size={24} className="animate-spin text-blue-900" />
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
                    className="flex font-bold items-center text-blue-900 hover:text-blue-900/70 transition-colors mb-2 cursor-pointer"
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
                            <MailWarningIcon className='place-self-center'/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Vérifier votre email</h2>
                        <p className="text-gray-600 mb-2">
                            Nous avons envoyé un code à 6 chiffres à :
                        </p>
                        <p className="text-blue-900 font-semibold mb-4">{email}</p>
                        
                        <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
                            <Clock size={16} className="mr-2" />
                            <span>Code valide pendant: {formatTime(timeLeft)}</span>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="flex justify-center gap-2 mb-4">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 rounded-lg border-2 text-center text-xl font-semibold border-gray-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all"
                                        autoFocus={index === 0}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className={`w-full h-12 text-white font-semibold rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                                    isFormValid && !isLoading
                                        ? 'bg-primary-800 hover:bg-primary-900 cursor-pointer' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                } flex items-center justify-center`}
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw size={20} className="animate-spin mr-2" />
                                        Vérification...
                                    </>
                                ) : (
                                    'Vérifier le code'
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={timeLeft > 0 || isResending}
                                    className={`text-sm ${
                                        timeLeft > 0 || isResending
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-blue-900 hover:text-blue-700 cursor-pointer'
                                    } transition-colors flex items-center justify-center mx-auto`}
                                >
                                    {isResending ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin mr-2" />
                                            Envoi en cours...
                                        </>
                                    ) : timeLeft > 0 ? (
                                        `Renvoyer le code (${formatTime(timeLeft)})`
                                    ) : (
                                        'Renvoyer le code'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyCode