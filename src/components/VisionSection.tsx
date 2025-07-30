import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play } from 'lucide-react';

const VisionSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="vision" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/10 to-[#7d7eed]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Founder Vision
          </h2>
          <h3 className="text-2xl md:text-3xl bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent font-semibold mb-8">
            "Every Student Deserves a Stage to Shine"
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                "When I see the fire in a student's eyes, the passion to solve real problems, 
                and the courage to take on challenges bigger than themselves, I see the future 
                of India. JAZBAA isn't just about building startups—it's about building 
                character, resilience, and the unwavering belief that you can change the world."
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                "Every student who walks into JAZBAA walks out transformed. They don't just 
                learn to code or design—they learn to lead, to fail, to get back up, and to 
                never give up on their dreams. This is what India needs: not just engineers, 
                but nation-builders."
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">VD</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">Vimal Daga Sir</h4>
                  <p className="text-white/60">Founder & Mentor, JAZBAA</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mb-4">
                <Play className="text-white/60" size={64} />
              </div>
              <p className="text-white/60 text-center">
                Watch Vimal Daga Sir's inspiring message about the future of student entrepreneurship
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <p className="text-white/60 text-sm">Students Impacted</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <p className="text-white/60 text-sm">Success Stories</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection; 