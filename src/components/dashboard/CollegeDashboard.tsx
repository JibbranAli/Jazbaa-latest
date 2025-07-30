import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Startup } from '../../types/auth';
import { Zap, ExternalLink, Building } from 'lucide-react';

const CollegeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('HealthTech');

  const sectors = [
    'HealthTech', 'AgriTech', 'FinTech', 'EdTech', 'Sustainability', 
    'WomenTech', 'TravelTech', 'Social Impact', 'AI for Bharat'
  ];

  useEffect(() => {
    const fetchCollegeStartups = async () => {
      if (!currentUser?.collegeId) return;

      try {
        const startupsQuery = query(
          collection(db, 'startups'),
          where('collegeId', '==', currentUser.collegeId)
        );
        const startupsCollection = await getDocs(startupsQuery);
        const startupsData = startupsCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Startup[];
        setStartups(startupsData);
      } catch (error) {
        console.error('Error fetching college startups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeStartups();
  }, [currentUser?.collegeId]);

  const filteredStartups = startups.filter(startup => startup.sector === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your college startups...</div>
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
            Welcome, {currentUser?.email}. View startups from your college.
          </p>
          <p className="text-lg text-white/60 mt-2">
            College ID: {currentUser?.collegeId}
          </p>
        </motion.div>

        {/* Sector Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveTab(sector)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === sector
                  ? 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Startup Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStartups.map((startup, index) => (
            <motion.div
              key={startup.id}
              className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#e86888]/50 transition-all duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-lg flex items-center justify-center">
                  <Building className="text-white" size={24} />
                </div>
                {startup.special && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
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

              {/* Interest Statistics */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Investment Interest: {startup.interestedInvestors.length}</span>
                  <span>Hiring Interest: {startup.hiringInvestors.length}</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                View Details <ExternalLink size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <div className="text-center text-white/60 text-xl">
            No startups found in {activeTab} sector from your college.
          </div>
        )}

        {/* Summary Statistics */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{startups.length}</h3>
            <p className="text-white/70">Total Startups</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {startups.reduce((total, startup) => total + startup.interestedInvestors.length, 0)}
            </h3>
            <p className="text-white/70">Total Investment Interest</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {startups.reduce((total, startup) => total + startup.hiringInvestors.length, 0)}
            </h3>
            <p className="text-white/70">Total Hiring Interest</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CollegeDashboard; 