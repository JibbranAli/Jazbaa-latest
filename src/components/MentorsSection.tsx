import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building, Heart } from 'lucide-react';

const MentorsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const mentors = [
    { name: 'Microsoft', type: 'Corporate Partner' },
    { name: 'Infosys', type: 'Technology Partner' },
    { name: 'Startup India', type: 'Government Initiative' },
    { name: 'Angel Investors Network', type: 'Investment Partner' },
    { name: 'TiE Delhi', type: 'Entrepreneurship Network' },
    { name: 'NASSCOM', type: 'Industry Partner' },
  ];

  return (
    <section id="mentors" className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#543ef7]/10 to-[#9cecd5]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Investors & Mentors Wall
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Backed by industry leaders, supported by visionary investors, and guided by 
            experienced mentors who believe in the power of student innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              className="group text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 group-hover:border-[#e86888]/50 transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Building className="text-white" size={32} />
                </div>
                <h3 className="text-white font-semibold mb-2">{mentor.name}</h3>
                <p className="text-white/60 text-sm">{mentor.type}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 mx-auto">
            I Want to Mentor or Invest
            <Heart size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorsSection; 