import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('investor');
  const [collegeId, setCollegeId] = useState('');
  const [investorId, setInvestorId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      
      const collegeIdValue = role === 'college' ? collegeId : undefined;
      const investorIdValue = role === 'investor' ? investorId : undefined;
      
      await register(email, password, role, collegeIdValue, investorIdValue);
    } catch (error) {
      setError('Failed to create account');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div 
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">Register</h2>
        
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
            <label htmlFor="role" className="block text-white text-sm font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#e86888] transition-colors"
              style={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <option value="investor" style={{ backgroundColor: '#1f2937', color: 'white' }}>Investor</option>
              <option value="college" style={{ backgroundColor: '#1f2937', color: 'white' }}>College</option>
              <option value="admin" style={{ backgroundColor: '#1f2937', color: 'white' }}>Admin</option>
            </select>
          </div>

          {role === 'college' && (
            <div>
              <label htmlFor="collegeId" className="block text-white text-sm font-medium mb-2">
                College ID
              </label>
              <input
                id="collegeId"
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
                placeholder="Enter your college ID"
                required
              />
            </div>
          )}

          {role === 'investor' && (
            <div>
              <label htmlFor="investorId" className="block text-white text-sm font-medium mb-2">
                Investor ID
              </label>
              <input
                id="investorId"
                type="text"
                value={investorId}
                onChange={(e) => setInvestorId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
                placeholder="Enter your investor ID"
                required
              />
            </div>
          )}

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

          <div>
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register; 