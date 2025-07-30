import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getAllStartups, dummyUsers } from '../../services/dummyData';
import { Startup, User } from '../../types/auth';
import { Zap, ExternalLink, Users, TrendingUp, Building, Plus, UserPlus, User as UserIcon } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('interests');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    role: 'investor' as 'investor' | 'college' | 'admin',
    collegeId: '',
    investorId: ''
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const startupsData = getAllStartups();
      setStartups(startupsData);
      setUsers(dummyUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getInvestorName = (investorId: string) => {
    const investor = users.find(user => user.uid === investorId);
    return investor?.email || investorId;
  };

  const getStartupName = (startupId: string) => {
    const startup = startups.find(s => s.id === startupId);
    return startup?.name || startupId;
  };

  const allInterests = startups.flatMap(startup => [
    ...startup.interestedInvestors.map(investorId => ({
      type: 'investment' as const,
      investorId,
      startupId: startup.id,
      startupName: startup.name,
      sector: startup.sector
    })),
    ...startup.hiringInvestors.map(investorId => ({
      type: 'hiring' as const,
      investorId,
      startupId: startup.id,
      startupName: startup.name,
      sector: startup.sector
    }))
  ]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would add to Firebase
    const newUserData: User = {
      uid: `user-${Date.now()}`,
      email: newUser.email,
      role: newUser.role,
      ...(newUser.collegeId && { collegeId: newUser.collegeId }),
      ...(newUser.investorId && { investorId: newUser.investorId })
    };
    
    setUsers([...users, newUserData]);
    setNewUser({ email: '', role: 'investor', collegeId: '', investorId: '' });
    setShowAddUser(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Welcome, {currentUser?.email}. Manage users and monitor investor interests.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('interests')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'interests'
                ? 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            Investment Interests
          </button>
          <button
            onClick={() => setActiveTab('hiring')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'hiring'
                ? 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            Hiring Requests
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            Overview
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'interests' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Investment Interests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allInterests
                .filter(interest => interest.type === 'investment')
                .map((interest, index) => (
                  <motion.div
                    key={`${interest.investorId}-${interest.startupId}`}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full flex items-center justify-center">
                        <TrendingUp className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Investment Interest</h3>
                        <p className="text-white/60 text-sm">{interest.sector}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-white/60 text-sm">Investor:</span>
                        <p className="text-white font-medium">{getInvestorName(interest.investorId)}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Startup:</span>
                        <p className="text-white font-medium">{interest.startupName}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'hiring' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Hiring Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allInterests
                .filter(interest => interest.type === 'hiring')
                .map((interest, index) => (
                  <motion.div
                    key={`${interest.investorId}-${interest.startupId}`}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#7d7eed] to-[#e86888] rounded-full flex items-center justify-center">
                        <Users className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Hiring Request</h3>
                        <p className="text-white/60 text-sm">{interest.sector}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-white/60 text-sm">Investor:</span>
                        <p className="text-white font-medium">{getInvestorName(interest.investorId)}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Startup:</span>
                        <p className="text-white font-medium">{interest.startupName}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Manage Users</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <UserPlus size={16} />
                Add User
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user.uid}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                                         <div className="w-10 h-10 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full flex items-center justify-center">
                       <UserIcon className="text-white" size={20} />
                     </div>
                    <div>
                      <h3 className="text-white font-semibold capitalize">{user.role}</h3>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {user.collegeId && (
                      <div>
                        <span className="text-white/60 text-sm">College ID:</span>
                        <p className="text-white font-medium">{user.collegeId}</p>
                      </div>
                    )}
                    {user.investorId && (
                      <div>
                        <span className="text-white/60 text-sm">Investor ID:</span>
                        <p className="text-white font-medium">{user.investorId}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add User Modal */}
            {showAddUser && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Add New User</h3>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#e86888] transition-colors"
                      >
                        <option value="investor">Investor</option>
                        <option value="college">College</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    {newUser.role === 'college' && (
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">College ID</label>
                        <input
                          type="text"
                          value={newUser.collegeId}
                          onChange={(e) => setNewUser({...newUser, collegeId: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
                          placeholder="Enter college ID"
                          required
                        />
                      </div>
                    )}
                    {newUser.role === 'investor' && (
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Investor ID</label>
                        <input
                          type="text"
                          value={newUser.investorId}
                          onChange={(e) => setNewUser({...newUser, investorId: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
                          placeholder="Enter investor ID"
                          required
                        />
                      </div>
                    )}
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Add User
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddUser(false)}
                        className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              System Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Building className="text-white mx-auto mb-4" size={32} />
                <h3 className="text-3xl font-bold text-white mb-2">{startups.length}</h3>
                <p className="text-white/70">Total Startups</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Users className="text-white mx-auto mb-4" size={32} />
                <h3 className="text-3xl font-bold text-white mb-2">
                  {users.filter(user => user.role === 'investor').length}
                </h3>
                <p className="text-white/70">Total Investors</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Building className="text-white mx-auto mb-4" size={32} />
                <h3 className="text-3xl font-bold text-white mb-2">
                  {users.filter(user => user.role === 'college').length}
                </h3>
                <p className="text-white/70">Total Colleges</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <TrendingUp className="text-white mx-auto mb-4" size={32} />
                <h3 className="text-3xl font-bold text-white mb-2">{allInterests.length}</h3>
                <p className="text-white/70">Total Interests</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'interests' && allInterests.filter(i => i.type === 'investment').length === 0 && (
          <div className="text-center text-white/60 text-xl">
            No investment interests found.
          </div>
        )}

        {activeTab === 'hiring' && allInterests.filter(i => i.type === 'hiring').length === 0 && (
          <div className="text-center text-white/60 text-xl">
            No hiring requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 