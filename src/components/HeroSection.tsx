import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        {/* Upper Section - Text Content */}
        <div className="flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Main Headline */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Students.
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Startups
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Disruption Begins.
                </span>
              </h1>
              <p className="text-white text-lg md:text-xl mt-4">
                Established 2019
              </p>
            </motion.div>

            {/* Right Side - Description and Statistics */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="border-l-2 border-white/30 pl-6">
                <p className="text-white text-lg md:text-xl mb-8 leading-relaxed">
                  Powered by LWJAZBAA — India's biggest student-led startup revolution, where engineering minds become real-world creators.
                </p>
                
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">134+</div>
                    <div className="text-white/80 text-sm md:text-base">Startups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                    <div className="text-white/80 text-sm md:text-base">Dreamers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">45</div>
                    <div className="text-white/80 text-sm md:text-base">Days</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lower Section - Central Image */}
        <motion.div 
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative w-full max-w-4xl">
            {/* Placeholder for the event image */}
            <div className="w-full h-64 md:h-80 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-white/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <div className="text-2xl md:text-4xl font-bold mb-2">Event Image</div>
                  <div className="text-sm md:text-base">Conference/Seminar Scene</div>
                </div>
              </div>
            </div>
            
            {/* Bottom text */}
            <div className="text-center mt-6">
              <p className="text-white text-lg md:text-xl">
                Our Engineers Can be The Creators - Mr Vimal Daga
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 