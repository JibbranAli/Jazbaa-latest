import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { dummyCredentials, getUserByEmail } from '../../services/dummyData';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      redirectBasedOnRole(currentUser.role);
    }
  }, [currentUser]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'investor':
        navigate('/investor-dashboard');
        break;
      case 'college':
        navigate('/college-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // Check if credentials match dummy data
      const user = getUserByEmail(email);
      if (!user) {
        setError('User not found');
        setLoading(false);
        return;
      }

      // For demo purposes, accept any password for dummy users
      await login(email, password);
      
      // Redirect based on role
      redirectBasedOnRole(user.role);
    } catch (error) {
      setError('Failed to log in');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'investor' | 'college' | 'admin') => {
    const credentials = dummyCredentials[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div 
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>
        
        {/* Quick Login Buttons */}
        <div className="mb-6 space-y-3">
          <p className="text-white/70 text-sm text-center">Quick Login (Demo):</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('investor')}
              className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              Investor
            </button>
            <button
              onClick={() => handleQuickLogin('college')}
              className="bg-gradient-to-r from-[#7d7eed] to-[#e86888] text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              College
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="bg-gradient-to-r from-[#543ef7] to-[#9cecd5] text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              Admin
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-white/70 text-sm mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-white/60">
            <div><strong>Investor:</strong> investor@test.com / password123</div>
            <div><strong>College:</strong> college@test.com / password123</div>
            <div><strong>Admin:</strong> admin@test.com / password123</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 