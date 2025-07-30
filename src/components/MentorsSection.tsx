import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const mentors = [
  {
    name: 'Dr. A. P. J. Abdul Kalam',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'Visionary mentor inspiring innovation and leadership among students.'
  },
  {
    name: 'Ms. Kiran Bedi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: 'Renowned leader guiding students towards impactful social change.'
  },
  {
    name: 'Mr. Sundar Pichai',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    description: 'Tech mentor encouraging creative problem-solving and entrepreneurship.'
  },
  {
    name: 'Ms. Indra Nooyi',
    image: 'https://randomuser.me/api/portraits/women/47.jpg',
    description: 'Business mentor fostering strategic thinking and growth mindset.'
  },
  {
    name: 'Mr. Ratan Tata',
    image: 'https://randomuser.me/api/portraits/men/50.jpg',
    description: 'Industry mentor supporting innovation and ethical leadership.'
  },
  {
    name: 'Ms. Nirmala Sitharaman',
    image: 'https://randomuser.me/api/portraits/women/51.jpg',
    description: 'Policy mentor guiding students in economic and financial innovation.'
  },
  {
    name: 'Mr. Mukesh Ambani',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    description: 'Business mentor inspiring digital transformation and innovation.'
  },
  {
    name: 'Ms. Arundhati Bhattacharya',
    image: 'https://randomuser.me/api/portraits/women/53.jpg',
    description: 'Leadership mentor fostering women empowerment in technology.'
  },
  {
    name: 'Mr. Azim Premji',
    image: 'https://randomuser.me/api/portraits/men/54.jpg',
    description: 'Philanthropy mentor encouraging social impact through technology.'
  },
  {
    name: 'Ms. Shobhana Bhartia',
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    description: 'Media mentor guiding students in communication and innovation.'
  }
];

const MentorsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              className={`group text-center cursor-pointer`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: activeIndex === index ? 1.12 : 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveIndex(index === activeIndex ? null : index)}
              whileTap={{ scale: 1.08 }}
            >
              <div className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transition-all duration-300 h-80 w-full flex flex-col justify-center ${activeIndex === index ? 'ring-4 ring-[#e86888]/40 scale-110 z-10' : 'group-hover:scale-110 group-hover:ring-4 group-hover:ring-[#e86888]/40'}`}>
                                 <div className="w-40 h-40 mx-auto mb-6 rounded-xl overflow-hidden border-4 border-gradient-to-r from-[#e86888] to-[#7d7eed] flex items-center justify-center bg-gradient-to-r from-[#e86888] to-[#7d7eed]">
                   <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                 </div>
                <h3 className="text-white font-semibold mb-2 text-lg">{mentor.name}</h3>
                <p className="text-white/70 text-sm">{mentor.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorsSection; 