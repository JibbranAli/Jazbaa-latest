import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { Startup, User, Comment } from '../../types/auth';
import { Zap, ExternalLink, Users, TrendingUp, Building, Plus, UserPlus, Trash2, Edit, Key, MessageCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('interests');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'investor' as 'investor' | 'college' | 'admin',
    collegeId: '',
    investorId: '',
    displayName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin data...');
      
      const [startupsSnapshot, usersSnapshot, commentsSnapshot] = await Promise.all([
        getDocs(collection(db, 'startups')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'comments'))
      ]);
      
      const startupsData = startupsSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Startup data:', doc.id, data);
        return {
          id: doc.id,
          name: data.name || 'Unknown Startup',
          pitch: data.pitch || '',
          sector: data.sector || 'Technology',
          badges: data.badges || [],
          special: data.special || null,
          collegeId: data.collegeId || '',
          createdBy: data.createdBy || '',
          createdAt: data.createdAt || new Date(),
          interestedInvestors: data.interestedInvestors || [],
          hiringInvestors: data.hiringInvestors || []
        };
      }) as Startup[];
      
      const usersData = usersSnapshot.docs.map(doc => ({
        uid: doc.id, // Fixed: use doc.id for uid
        ...doc.data()
      })) as User[];
      
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      console.log('Found startups:', startupsData.length);
      console.log('Found users:', usersData.length);
      console.log('Found comments:', commentsData.length);
      console.log('Comments data:', commentsData);
      console.log('Startups with investors:', startupsData.filter(s => s.interestedInvestors?.length > 0 || s.hiringInvestors?.length > 0));
      
      setStartups(startupsData);
      setUsers(usersData);
      setComments(commentsData);
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      alert(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getInvestorName = (investorId: string) => {
    const investor = users.find(user => user.uid === investorId);
    return investor?.email || investorId;
  };

  const getStartupName = (startupId: string) => {
    const startup = startups.find(s => s.id === startupId);
    return startup?.name || startupId;
  };

  const allInterests = startups.flatMap(startup => {
    if (!startup) return [];
    
    const interestedInvestors = startup.interestedInvestors || [];
    const hiringInvestors = startup.hiringInvestors || [];
    
    return [
      ...interestedInvestors.map(investorId => ({
        type: 'investment' as const,
        investorId,
        startupId: startup.id,
        startupName: startup.name,
        sector: startup.sector
      })),
      ...hiringInvestors.map(investorId => ({
        type: 'hiring' as const,
        investorId,
        startupId: startup.id,
        startupName: startup.name,
        sector: startup.sector
      }))
    ];
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating new user:', newUser.email);
      
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      
      console.log('Firebase Auth user created:', userCredential.user.uid);
      
      // Step 2: Add user data to Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.displayName,
        ...(newUser.collegeId && { collegeId: newUser.collegeId }),
        ...(newUser.investorId && { investorId: newUser.investorId }),
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      // Step 3: Update local state
      setUsers([...users, userData]);
      
      // Step 4: Reset form
      setNewUser({ 
        email: '', 
        password: '', 
        role: 'investor', 
        collegeId: '', 
        investorId: '', 
        displayName: '' 
      });
      setShowAddUser(false);
      
      console.log('User created successfully - they can now login!');
      alert(`User created successfully!\nEmail: ${newUser.email}\nPassword: ${newUser.password}\n\nShare these credentials with the user.`);
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('User with this email already exists!');
      } else {
        alert(`Error creating user: ${error.message}`);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(user => user.uid !== userId));
        console.log('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
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

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
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
                    onClick={() => setActiveTab('comments')}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === 'comments'
                        ? 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    Investor Comments
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

                {/* Admin Navigation Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <a
                    href="/admin/invite"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
                  >
                    🚀 Invite Startups
                  </a>
                  <a
                    href="/admin/email-test"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
                  >
                    📧 Test Emails
                  </a>
                  <a
                    href="/admin/auth-test"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
                  >
                    🔐 Test Auth
                  </a>
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

        {activeTab === 'comments' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Investor Comments
            </h2>
            {(comments || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(comments || []).map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full flex items-center justify-center">
                        <MessageCircle className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{comment.investorName}</h3>
                        <p className="text-white/60 text-sm">{getStartupName(comment.startupId)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-white/60 text-sm">Comment:</span>
                        <p className="text-white/90 text-sm mt-1">{comment.comment}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          comment.type === 'investment' ? 'bg-green-500/20 text-green-400' :
                          comment.type === 'hiring' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {comment.type}
                        </span>
                        <span className="text-white/60 text-xs">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60 text-xl">
                No comments from investors yet.
              </div>
            )}
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
              {(users || []).map((user, index) => (
                <motion.div
                  key={user.uid}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full flex items-center justify-center">
                      <Users className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold capitalize">{user.role}</h3>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.uid)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {user.displayName && (
                      <div>
                        <span className="text-white/60 text-sm">Name:</span>
                        <p className="text-white font-medium">{user.displayName}</p>
                      </div>
                    )}
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
                      <label className="block text-white text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
                        placeholder="Enter password (min 6 characters)"
                        minLength={6}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Display Name</label>
                      <input
                        type="text"
                        value={newUser.displayName}
                        onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
                        placeholder="Enter display name"
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
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="text-blue-400" size={16} />
                        <span className="text-blue-400 font-medium">Login Credentials</span>
                      </div>
                      <p className="text-blue-200 text-sm">
                        The user will be able to login immediately with the email and password you provide.
                      </p>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Create User
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