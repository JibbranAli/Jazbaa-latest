import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Startup } from '../../types/auth';
import { Building, Users, TrendingUp, Filter, Award } from 'lucide-react';

const CollegeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('all');

  useEffect(() => {
    fetchCollegeStartups();
  }, [currentUser]);

  useEffect(() => {
    if (selectedSector === 'all') {
      setFilteredStartups(startups);
    } else {
      setFilteredStartups(startups.filter(startup => startup.sector === selectedSector));
    }
  }, [startups, selectedSector]);

  const fetchCollegeStartups = async () => {
    if (!currentUser?.collegeId) {
      console.error('No college ID found for user');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching startups for college:', currentUser.collegeId);
      
      const startupsCollection = collection(db, 'startups');
      const q = query(startupsCollection, where('collegeId', '==', currentUser.collegeId));
      const querySnapshot = await getDocs(q);
      
      const startupsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Startup[];
      
      console.log('Found startups:', startupsData.length);
      setStartups(startupsData);
    } catch (error) {
      console.error('Error fetching college startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const sectors = ['all', ...Array.from(new Set(startups.map(s => s.sector)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading college dashboard...</div>
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
            College Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Welcome, {currentUser?.email}. Monitor your college's startup ecosystem.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <Building className="text-white mx-auto mb-4" size={32} />
            <h3 className="text-3xl font-bold text-white mb-2">{startups.length}</h3>
            <p className="text-white/70">Total Startups</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <TrendingUp className="text-white mx-auto mb-4" size={32} />
            <h3 className="text-3xl font-bold text-white mb-2">
              {startups.reduce((acc, s) => acc + s.interestedInvestors.length, 0)}
            </h3>
            <p className="text-white/70">Investment Interests</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <Users className="text-white mx-auto mb-4" size={32} />
            <h3 className="text-3xl font-bold text-white mb-2">
              {startups.reduce((acc, s) => acc + s.hiringInvestors.length, 0)}
            </h3>
            <p className="text-white/70">Hiring Requests</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <Award className="text-white mx-auto mb-4" size={32} />
            <h3 className="text-3xl font-bold text-white mb-2">
              {Array.from(new Set(startups.map(s => s.sector))).length}
            </h3>
            <p className="text-white/70">Sectors</p>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <label className="text-white font-medium">Filter by Sector:</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#e86888] transition-colors"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector} className="bg-gray-800">
                  {sector === 'all' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Startups Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredStartups.map((startup, index) => (
            <motion.div
              key={startup.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full flex items-center justify-center overflow-hidden">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {startup.name.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                </div>
                {startup.special && (
                  <span className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-3 py-1 rounded-full text-xs font-medium">
                    {startup.special}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{startup.name}</h3>
              <p className="text-white/70 mb-4">{startup.pitch}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#e86888]/20 text-white px-3 py-1 rounded-full text-sm">
                  {startup.sector}
                </span>
                {startup.badges.map((badge) => (
                  <span key={badge} className="bg-[#7d7eed]/20 text-white px-3 py-1 rounded-full text-sm">
                    {badge}
                  </span>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Investment Interests:</span>
                  <span className="text-white font-medium">{startup.interestedInvestors.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Hiring Requests:</span>
                  <span className="text-white font-medium">{startup.hiringInvestors.length}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredStartups.length === 0 && (
          <div className="text-center text-white/60 text-xl">
            {startups.length === 0 ? 'No startups found for your college.' : 'No startups found for the selected sector.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDashboard; 