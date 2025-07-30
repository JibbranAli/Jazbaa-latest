import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Linkedin, Github, ExternalLink, Play, ArrowRight } from 'lucide-react';

const CreatorsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const creators = [
    {
      name: 'Priya Sharma',
      role: 'Co-Founder, MediCare AI',
      college: 'IIT Delhi',
      city: 'New Delhi',
      status: 'Open to Hire',
      hasPitch: true
    },
    {
      name: 'Rahul Kumar',
      role: 'Founder, FarmSmart',
      college: 'NIT Trichy',
      city: 'Chennai',
      status: 'Continuing Startup Journey',
      hasPitch: true
    },
    {
      name: 'Ananya Patel',
      role: 'CTO, HealthBridge',
      college: 'BITS Pilani',
      city: 'Mumbai',
      status: 'Open to Hire',
      hasPitch: false
    },
    {
      name: 'Vikram Singh',
      role: 'CEO, PayEasy',
      college: 'DTU Delhi',
      city: 'Bangalore',
      status: 'Continuing Startup Journey',
      hasPitch: true
    },
    {
      name: 'Sneha Reddy',
      role: 'Co-Founder, CropGuard',
      college: 'VIT Vellore',
      city: 'Hyderabad',
      status: 'Open to Hire',
      hasPitch: true
    },
    {
      name: 'Arjun Mehta',
      role: 'Founder, MicroLend',
      college: 'Manipal University',
      city: 'Pune',
      status: 'Continuing Startup Journey',
      hasPitch: false
    }
  ];

  return (
    <section id="creators" className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#543ef7]/10 to-[#9cecd5]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet the Creators
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The brilliant minds behind JAZBAA's success stories. Students who transformed 
            from learners to leaders in just 72 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.name}
              className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#e86888]/50 transition-all duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{creator.name}</h3>
                <p className="text-[#e86888] font-medium mb-2">{creator.role}</p>
                <div className="flex items-center justify-center gap-4 text-white/60 text-sm mb-4">
                  <span>{creator.college}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {creator.city}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 mb-4">
                <button className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors duration-200">
                  <Linkedin size={18} />
                </button>
                <button className="p-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors duration-200">
                  <Github size={18} />
                </button>
                <button className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors duration-200">
                  <ExternalLink size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  creator.status === 'Open to Hire' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {creator.status}
                </span>
                {creator.hasPitch && (
                  <button className="w-full mt-3 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                    <Play size={16} />
                    Watch My Pitch
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 mx-auto">
            View All Creators 
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CreatorsSection; 