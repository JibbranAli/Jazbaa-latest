import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building, Users, Award, MapPin, Target } from 'lucide-react';

const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    { number: '134', label: 'Startups', icon: <Building className="text-[#e86888]" size={24} /> },
    { number: '500+', label: 'Creators', icon: <Users className="text-[#7d7eed]" size={24} /> },
    { number: '100+', label: 'Colleges', icon: <Award className="text-[#e86888]" size={24} /> },
    { number: '20+', label: 'States', icon: <MapPin className="text-[#7d7eed]" size={24} /> },
    { number: '9', label: 'Sectors', icon: <Target className="text-[#e86888]" size={24} /> },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#543ef7]/10 to-[#9cecd5]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Creator Movement of India
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-4">
            Powered by Young Innovators and Mentored by{' '}
            <span className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent font-semibold">
              Vimal Daga Sir
            </span>
          </p>
          <div className="max-w-4xl mx-auto">
            <p className="text-white/70 text-lg leading-relaxed">
              JAZBAA isn't just about building startups—it's about building the future of India. 
              We believe every engineering student has the potential to solve real problems and create 
              meaningful impact. Through intensive mentorship, collaborative learning, and relentless 
              execution, we transform ideas into reality in just 72 hours.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 group-hover:border-[#e86888]/50 transition-all duration-300 group-hover:scale-105">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <motion.div 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-white/80 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 