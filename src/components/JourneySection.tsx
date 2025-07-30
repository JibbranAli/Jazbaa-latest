import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Play, ArrowRight, Building } from 'lucide-react';

const JourneySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const timeline = [
    {
      day: 'Day 1',
      title: 'Team Formation & Ideation',
      description: 'Students form diverse teams, brainstorm problems, and validate ideas through market research.',
      activities: ['Team Building', 'Problem Identification', 'Market Research', 'Mentor Assignment'],
      color: 'from-[#e86888] to-[#ff6b6b]'
    },
    {
      day: 'Day 2',
      title: 'UI/UX Design & Planning',
      description: 'Teams create wireframes, design user interfaces on paper, and plan their technical architecture.',
      activities: ['Wireframing', 'UI Design', 'User Journey Mapping', 'Tech Stack Planning'],
      color: 'from-[#7d7eed] to-[#6c5ce7]'
    },
    {
      day: 'Day 3',
      title: 'Prototype & Pitch',
      description: 'Final day to build working prototypes, prepare presentations, and pitch to investors.',
      activities: ['Prototype Development', 'Pitch Preparation', 'Demo Recording', 'Final Presentations'],
      color: 'from-[#9cecd5] to-[#00b894]'
    }
  ];

  return (
    <section id="journey" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/5 to-[#7d7eed]/5"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The 72-Hour Journey
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            From idea to prototype in just three days. Here's how ordinary students 
            transformed into extraordinary entrepreneurs.
          </p>
        </motion.div>

        <div className="space-y-12">
          {timeline.map((phase, index) => (
            <motion.div
              key={phase.day}
              className="relative"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${phase.color} flex items-center justify-center`}>
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{phase.day}</h3>
                      <h4 className="text-xl text-[#e86888] font-semibold">{phase.title}</h4>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-lg leading-relaxed">
                    {phase.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {phase.activities.map((activity) => (
                      <div key={activity} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full"></div>
                        <span className="text-white/80 text-sm">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <Play className="text-white/60" size={48} />
                    </div>
                    <p className="text-white/60 text-sm mt-4 text-center">
                      Watch {phase.day} highlights and learner stories
                    </p>
                  </div>
                </div>
              </div>

              {index < timeline.length - 1 && (
                <div className="flex justify-center my-8">
                  <div className="w-px h-16 bg-gradient-to-b from-[#e86888] to-[#7d7eed]"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 justify-center">
              Apply for Next JAZBAA 
              <ArrowRight size={20} />
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center gap-2 justify-center">
              Bring JAZBAA to Campus
              <Building size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySection; 