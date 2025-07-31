import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Startups', href: '#startups' },
    { name: 'Creators', href: '#creators' },
    { name: 'Journey', href: '#journey' },
    { name: 'Mentors', href: '#mentors' },
    { name: 'Vision', href: '#vision' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Join', href: '#join' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getDashboardLink = () => {
    if (!currentUser) return null;
    
    switch (currentUser.role) {
      case 'investor':
        return { name: 'Investor Dashboard', href: '/investor-dashboard' };
      case 'college':
        return { name: 'College Dashboard', href: '/college-dashboard' };
      case 'admin':
        return { name: 'Admin Dashboard', href: '/admin-dashboard' };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  // Don't show navigation items on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardPage = location.pathname.includes('-dashboard');

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/20 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent">
              JAZBAA 4.0
            </h1>
            </Link>
          </motion.div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Only show navigation items on main page */}
              {!isAuthPage && !isDashboardPage && navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white hover:text-[#e86888] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Authentication Links */}
              {currentUser ? (
                <div className="flex items-center space-x-4 ml-4">
                  {dashboardLink && (
                    <Link
                      to={dashboardLink.href}
                      className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    >
                      {dashboardLink.name}
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <User className="text-white" size={16} />
                    <span className="text-white text-sm">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-[#e86888] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 ml-4">
                  <Link
                    to="/login"
                    className="text-white hover:text-[#e86888] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#e86888] transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Only show navigation items on main page */}
              {!isAuthPage && !isDashboardPage && navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white hover:text-[#e86888] block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Authentication Links */}
              {currentUser ? (
                <div className="border-t border-white/20 pt-4 mt-4">
                  {dashboardLink && (
                    <Link
                      to={dashboardLink.href}
                      className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white block px-3 py-2 rounded-md text-base font-medium w-full text-center transition-all duration-300 hover:scale-105"
                    >
                      {dashboardLink.name}
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="text-white" size={16} />
                    <span className="text-white text-sm">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-[#e86888] block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="text-white hover:text-[#e86888] block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation; 