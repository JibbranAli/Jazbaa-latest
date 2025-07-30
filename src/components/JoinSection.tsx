import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building, Briefcase, Target, Users, Star, ArrowRight } from 'lucide-react';

const JoinSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const actions = [
    {
      title: "I'm a College",
      subtitle: "Bring JAZBAA to Campus",
      description: "Partner with us to transform your students into entrepreneurs",
      icon: <Building className="text-white" size={32} />,
      color: "from-[#e86888] to-[#ff6b6b]"
    },
    {
      title: "I'm a Company",
      subtitle: "Hire from JAZBAA",
      description: "Recruit passionate, skilled, and innovation-ready talent",
      icon: <Briefcase className="text-white" size={32} />,
      color: "from-[#7d7eed] to-[#6c5ce7]"
    },
    {
      title: "I'm an Investor",
      subtitle: "Fund a Startup",
      description: "Invest in the next generation of Indian innovators",
      icon: <Target className="text-white" size={32} />,
      color: "from-[#9cecd5] to-[#00b894]"
    },
    {
      title: "I'm a Mentor",
      subtitle: "Share My Expertise",
      description: "Guide students and shape the future of entrepreneurship",
      icon: <Users className="text-white" size={32} />,
      color: "from-[#fd79a8] to-[#e84393]"
    },
    {
      title: "I'm a Student",
      subtitle: "Join the Next Cohort",
      description: "Transform your ideas into reality in just 72 hours",
      icon: <Star className="text-white" size={32} />,
      color: "from-[#fdcb6e] to-[#e17055]"
    }
  ];

  return (
    <section id="join" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/10 to-[#7d7eed]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Movement
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Be part of India's largest student entrepreneurship movement. 
            Choose your path and help us build the future, together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-[#e86888]/50 transition-all duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-6`}>
                {action.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
              <h4 className="text-lg text-[#e86888] font-semibold mb-4">{action.subtitle}</h4>
              <p className="text-white/70 mb-6 leading-relaxed">{action.description}</p>
              
              <button className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                Get Started <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Make Impact?</h3>
            <p className="text-white/70 mb-6">
              Join thousands of students, mentors, and industry leaders who are 
              building the future of India, one startup at a time.
            </p>
            <button className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-12 py-4 rounded-full font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              Join JAZBAA Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinSection; 