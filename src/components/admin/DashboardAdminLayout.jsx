// components/admin/DashboardAdminLayout.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideBarAdmin from './SideBarAdmin';

const DashboardAdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Dashboard');

  // Synchroniser activePage avec l'URL actuelle
  useEffect(() => {
    const path = location.pathname;
    const pageMap = {
      '/admin/dashboard': 'Dashboard',
      '/admin/administrateurs': 'Administrateurs',
      '/admin/vendeurs': 'Vendeurs',
      '/admin/clients': 'Clients',
      '/admin/commandes': 'Commandes',
      '/admin/analytics': 'Analytics',
      '/admin/parametres': 'Paramètres',
    };
    
    setActivePage(pageMap[path] || 'Dashboard');
  }, [location]);

  const handleNavigation = (page) => {
    setActivePage(page);
    const routeMap = {
      'Dashboard': '/admin/dashboard',
      'Administrateurs': '/admin/administrateurs',
      'Vendeurs': '/admin/vendeurs',
      'Clients': '/admin/clients',
      'Commandes': '/admin/commandes',
      'Analytics': '/admin/analytics',
      'Paramètres': '/admin/parametres',
    };
    
    if (routeMap[page]) {
      navigate(routeMap[page]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-MyFontFamily">
      <SideBarAdmin onNavigate={handleNavigation} activePage={activePage} />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardAdminLayout;