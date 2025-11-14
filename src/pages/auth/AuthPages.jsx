import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'



import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm'
import RegisterForm from '../../components/auth/RegisterForm'
import VerifyCode from '../../components/auth/VerifyCode'
import NewPassword from '../../components/Auth/NewPassword'
import Dashboard from '../Dashboard'
import LoginForm from '../../components/Auth/LoginForm'

const AuthPages = () => {
  return (
    <div>
        <div className="min-h-screen bg-gray-50">
            <Routes>
                
                {/* Route pour les chemins non trouvés */}
                <Route path="/" element={< LoginForm />} />
                <Route path="/connexion" element={< LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm/>} />
                <Route path='/verify-code' element={<VerifyCode/>}/>
                <Route path="/new-password" element={<NewPassword />} />
                <Route path='/dashboard' element={<Dashboard/>}/>
            
            </Routes>
        </div>
    </div>
  )
}

export default AuthPages