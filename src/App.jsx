import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import ApiSettingsModal from './components/ApiSettingsModal';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintPage from './pages/ComplaintPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import QueriesPage from './pages/QueriesPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { isLoggedIn, user } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.replace('#', '') || '/login';
    return hash.startsWith('/') ? hash : `/${hash}`;
  });
  const [apiModalOpen, setApiModalOpen] = useState(false);

  // Sync route on hash change (Hash Router for zero-setup file:/// and static hosting)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/login';
      const cleanPath = hash.startsWith('/') ? hash : `/${hash}`;
      setCurrentPath(cleanPath);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial sync
    if (!window.location.hash) {
      window.location.hash = isLoggedIn ? '#/home' : '#/login';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn]);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Route protection
  const isAuthPage = currentPath === '/login' || currentPath === '/register';

  // Render appropriate page view
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/register':
        return <RegisterPage navigate={navigate} />;
      case '/home':
        return <DashboardPage navigate={navigate} />;
      case '/complaint':
        return <ComplaintPage navigate={navigate} onOpenApiModal={() => setApiModalOpen(true)} />;
      case '/my-complaints':
        return <MyComplaintsPage navigate={navigate} />;
      case '/queries':
        return <QueriesPage navigate={navigate} />;
      case '/profile':
        return <ProfilePage navigate={navigate} />;
      default:
        return <DashboardPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] font-sans antialiased text-[#1E293B]">
      {/* Toast Alert System */}
      <ToastContainer />

      {/* Main Navigation Header (Hidden on Login & Register for clean focused flow) */}
      {!isAuthPage && (
        <Navbar
          currentPath={currentPath}
          navigate={navigate}
          onOpenApiModal={() => setApiModalOpen(true)}
        />
      )}

      {/* Main Page View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Municipal Footer (Hidden on Login & Register) */}
      {!isAuthPage && (
        <Footer
          navigate={navigate}
          onOpenApiModal={() => setApiModalOpen(true)}
        />
      )}

      {/* SNS Workbench Webhook Settings Modal */}
      <ApiSettingsModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
      />
    </div>
  );
}

