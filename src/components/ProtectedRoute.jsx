// components/ProtectedRoute.jsx - VERSION CORRIGÉE
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication } from '../utils/authUtils';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      const authCheck = checkAuthentication();
      
      if (!authCheck.isValid) {
        console.warn('🚫 Accès non autorisé, redirection vers /connexion');
        navigate('/connexion', { replace: true });
        return;
      }
      
      console.log('✅ Accès autorisé pour:', authCheck.user?.email);
      setIsChecking(false);
    };

    verifyAuth();
  }, [navigate]); // Garder navigate dans les dépendances

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;