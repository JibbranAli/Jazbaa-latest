import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Play, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-[#543ef7] to-[#9cecd5] opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#e86888]/80 to-[#7d7eed]/80"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Where Ordinary Engineering Students Became{' '}
          <span className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent">
            Nation-Builders
          </span>{' '}
          in 72 Hours
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          JAZBAA 4.0 isn't just an event. It's a movement. 134+ startups. 500+ dreamers. 45 days. 
          Infinite passion. One purpose — to build for India, not just in India.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="group bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
            Explore Startups 
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
          <button className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center gap-2">
            Connect with Founders
            <Users className="group-hover:scale-110 transition-transform duration-300" size={20} />
          </button>
          <button className="group bg-transparent text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/40 transition-all duration-300 hover:bg-white/10 hover:scale-105 flex items-center gap-2">
            <Play size={20} />
            Watch the Story
          </button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-white/60" size={32} />
      </motion.div>
    </section>
  );
};

export default HeroSection; 