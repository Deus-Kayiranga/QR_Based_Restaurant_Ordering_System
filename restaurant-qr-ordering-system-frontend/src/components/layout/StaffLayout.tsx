import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const StaffLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Basic Page Title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard Overview';
    if (path.includes('menu')) return 'Menu Management';
    if (path.includes('staff')) return 'Staff Management';
    if (path.includes('tables')) return 'Tables Overview';
    if (path.includes('bills')) return 'Billing Queue';
    if (path.includes('orders')) return 'Orders Queue';
    if (path.includes('kitchen')) return 'Kitchen Display';
    if (path.includes('bar')) return 'Bar Display';
    if (path.includes('reports')) return 'Business Reports';
    if (path.includes('settings')) return 'System Settings';
    if (path.includes('profile')) return 'My Profile';
    return 'Azzurri Rwanda Restaurant';
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title={getPageTitle()}
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
