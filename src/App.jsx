import React from 'react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from "react"

// Import des composants d'authentification
import LoginForm from './components/Auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import VerifyCode from './components/auth/VerifyCode'
import NewPassword from './components/Auth/NewPassword'
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm'
import RoleSelectionPage from './pages/RoleSelectionPage'

// Import des composants ADMIN
import AdminLoginForm from './components/admin/auth/AdminLoginForm'
import PasswordForgetAdmin from './components/admin/auth/PasswordForgetAdmin'

// Import des composants du dashboard VENDEUR
import Sidebar from './components/Sidebar'
import Dashboard from "./pages/Dashboard"
import Clients from "./pages/Clients"
import Commandes from "./pages/Commandes"
import Produits from "./pages/Produits"
import Stocks from "./pages/Stocks"
import Livraisons from "./pages/Livraison"
import ProtectedRoute from './components/ProtectedRoute'
import Profil from './pages/Profils'

// Import des composants ADMIN
import DashboardAdmin from './pages/admin/DashboardAdmin';
import AdministrateursPage from './pages/admin/AdministrateursPage';
import VendeursPage from './pages/admin/VendeursPage';
import ClientsPage from './pages/admin/ClientsPage';
import CommandesPage from './pages/admin/CommandesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import ParametresPage from './pages/admin/ParametresPage';
import AdminRegister from './components/admin/auth/AdminRegister';
import ResetPasswordAdmin from './components/admin/auth/ResetPasswordAdmin';

// Layout pour les pages authentifiées avec sidebar VENDEUR
const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Dashboard');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') {
      setActivePage('Dashboard');
    } else if (path === '/clients') {
      setActivePage('Clients');
    } else if (path === '/commandes') {
      setActivePage('Commandes');
    } else if (path === '/produits') {
      setActivePage('Produits');
    } else if (path === '/stocks') {
      setActivePage('Stocks');
    } else if (path === '/livraisons') {
      setActivePage('Livraisons');
    } else if (path === '/profil') {
      setActivePage('Profil');
    }
  }, [location]);

  const handleNavigation = (page) => {
    setActivePage(page);
    switch (page) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Clients':
        navigate('/clients');
        break;
      case 'Commandes':
        navigate('/commandes');
        break;
      case 'Produits':
        navigate('/produits');
        break;
      case 'Stocks':
        navigate('/stocks');
        break;
      case 'Livraisons':
        navigate('/livraisons');
        break;
      case 'Profil':
        navigate('/profil');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/dashboard' || path === '/') {
      return <Dashboard />;
    } else if (path === '/clients') {
      return <Clients />;
    } else if (path === '/commandes') {
      return <Commandes />;
    } else if (path === '/produits') {
      return <Produits />;
    } else if (path === '/stocks') {
      return <Stocks />;
    } else if (path === '/livraisons') {
      return <Livraisons />;
    } else if (path === '/profil') {
      return <Profil />;
    } else {
      return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-200 font-MyFontFamily">
      <Sidebar onNavigate={handleNavigation} activePage={activePage} />
      <main className="flex-1 overflow-auto p-4 h-[50.5rem] my-4">
        {renderContent()}
      </main>
    </div>
  );
}

const App = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      <Routes>
        {/* Page de sélection des rôles */}
        <Route path="/" element={<RoleSelectionPage />} />
        
        {/* Routes d'authentification VENDEUR */}
        <Route path="/connexion" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/admin/reset-password" element={<ResetPasswordAdmin />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword />} />
        
        {/* Routes d'authentification ADMIN */}
        <Route path="/admin/connexion" element={<AdminLoginForm />} />
        <Route path="/admin-forgot-password" element={<PasswordForgetAdmin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        
        {/* ===== ROUTES PROTÉGÉES ADMIN ===== */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <DashboardAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/administrateurs" element={
          <ProtectedRoute>
            <AdministrateursPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/vendeurs" element={
          <ProtectedRoute>
            <VendeursPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/clients" element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/commandes" element={
          <ProtectedRoute>
            <CommandesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/parametres" element={
          <ProtectedRoute>
            <ParametresPage />
          </ProtectedRoute>
        } />
        
        {/* ===== ROUTES PROTÉGÉES VENDEUR ===== */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/commandes" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/produits" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/stocks" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/livraisons" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        
        {/* Route fallback pour les URLs inconnues */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Page non trouvée</h1>
              <p className="text-gray-600 mt-2">La page que vous recherchez n'existe pas.</p>
              <Link 
                to="/"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;