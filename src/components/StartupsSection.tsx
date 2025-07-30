import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, ExternalLink } from 'lucide-react';

const StartupsSection = () => {
  const [activeTab, setActiveTab] = useState('HealthTech');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectors = [
    'HealthTech', 'AgriTech', 'FinTech', 'EdTech', 'Sustainability', 
    'WomenTech', 'TravelTech', 'Social Impact', 'AI for Bharat'
  ];

  const startups = {
    HealthTech: [
      {
        name: 'MediCare AI',
        pitch: 'AI-powered diagnosis for rural healthcare',
        sector: 'HealthTech',
        badges: ['Open to Invest'],
        special: null
      },
      {
        name: 'HealthBridge',
        pitch: 'Connecting patients with specialists virtually',
        sector: 'HealthTech',
        badges: ['Open to Hire'],
        special: 'Built by All-Women Team'
      },
      {
        name: 'PillTracker',
        pitch: 'Smart medication management system',
        sector: 'HealthTech',
        badges: ['Open to Invest', 'Open to Hire'],
        special: 'Flagship Startup'
      }
    ],
    AgriTech: [
      {
        name: 'FarmSmart',
        pitch: 'IoT sensors for precision farming',
        sector: 'AgriTech',
        badges: ['Open to Invest'],
        special: null
      },
      {
        name: 'CropGuard',
        pitch: 'AI-based crop disease detection',
        sector: 'AgriTech',
        badges: ['Open to Hire'],
        special: 'Built by All-Women Team'
      }
    ],
    FinTech: [
      {
        name: 'PayEasy',
        pitch: 'Digital payments for rural merchants',
        sector: 'FinTech',
        badges: ['Open to Invest'],
        special: 'Flagship Startup'
      },
      {
        name: 'MicroLend',
        pitch: 'Peer-to-peer lending platform',
        sector: 'FinTech',
        badges: ['Open to Hire'],
        special: null
      }
    ]
  };

  return (
    <section id="startups" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/10 to-[#7d7eed]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sector-wise Startups
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover innovative solutions across 9 key sectors, built by passionate students 
            who dared to dream big and execute bigger.
          </p>
        </motion.div>

        {/* Tab Navigation */}
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
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {(startups[activeTab as keyof typeof startups] || startups.HealthTech).map((startup, index) => (
              <motion.div
                key={startup.name}
                className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#e86888]/50 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-lg flex items-center justify-center">
                    <Zap className="text-white" size={24} />
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
                  <span className="bg-[#e86888]/20 text-[#e86888] px-3 py-1 rounded-full text-sm">
                    {startup.sector}
                  </span>
                  {startup.badges.map((badge) => (
                    <span key={badge} className="bg-[#7d7eed]/20 text-[#7d7eed] px-3 py-1 rounded-full text-sm">
                      {badge}
                    </span>
                  ))}
                </div>
                
                <button className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                  View Details <ExternalLink size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default StartupsSection; 