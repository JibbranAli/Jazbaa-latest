import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import InvestorDashboard from './components/dashboard/InvestorDashboard';
import CollegeDashboard from './components/dashboard/CollegeDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import StartupsSection from './components/StartupsSection';
import CreatorsSection from './components/CreatorsSection';
import JourneySection from './components/JourneySection';
import MentorsSection from './components/MentorsSection';
import VisionSection from './components/VisionSection';
import GallerySection from './components/GallerySection';
import JoinSection from './components/JoinSection';
import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

// Home Route Component with Auto-redirect
const HomeRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Auto-redirect authenticated users to their dashboard
  if (currentUser) {
    switch (currentUser.role) {
      case 'investor':
        return <Navigate to="/investor-dashboard" />;
      case 'college':
        return <Navigate to="/college-dashboard" />;
      case 'admin':
        return <Navigate to="/admin-dashboard" />;
      default:
        break;
    }
  }

  // Show home page for unauthenticated users
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StartupsSection />
      <CreatorsSection />
      <JourneySection />
      <MentorsSection />
      <VisionSection />
      <GallerySection />
      <JoinSection />
      <Footer />
    </>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="App">
        {/* Always show Navigation */}
        <Navigation />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/investor-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['investor']}>
                <InvestorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['college']}>
                <CollegeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Home Route with Auto-redirect */}
          <Route path="/" element={<HomeRoute />} />
        </Routes>
      </div>
    </Router>
  );
};

// Root App Component with Auth Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;