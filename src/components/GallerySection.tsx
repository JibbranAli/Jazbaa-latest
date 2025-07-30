import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, ExternalLink, Star } from 'lucide-react';

const GallerySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const mediaItems = [
    { type: 'news', title: 'Featured in Times of India', source: 'TOI' },
    { type: 'testimonial', title: 'Student Success Story', author: 'Priya S.' },
    { type: 'social', title: 'LinkedIn Post Viral', engagement: '10K+ likes' },
    { type: 'video', title: 'Demo Day Highlights', duration: '5:30' },
    { type: 'news', title: 'TechCrunch Coverage', source: 'TC' },
    { type: 'testimonial', title: 'Mentor Feedback', author: 'Industry Expert' },
  ];

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#543ef7]/10 to-[#9cecd5]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Media & Impact Gallery
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Celebrating our journey through news features, testimonials, and the incredible 
            transformations of our JAZBAA community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mediaItems.map((item, index) => (
            <motion.div
              key={index}
              className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#e86888]/50 transition-all duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mb-4">
                {item.type === 'video' ? (
                  <Play className="text-white/60" size={32} />
                ) : (
                  <ExternalLink className="text-white/60" size={32} />
                )}
              </div>
              
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              
              <div className="flex items-center justify-between text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.type === 'news' ? 'bg-blue-500/20 text-blue-400' :
                  item.type === 'testimonial' ? 'bg-green-500/20 text-green-400' :
                  item.type === 'social' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.type}
                </span>
                
                <span className="text-white/60">
                  {item.source || item.author || item.engagement || item.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 justify-center">
              Submit Your JAZBAA Story
              <Star size={20} />
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center gap-2 justify-center">
              Download Media Kit
              <ExternalLink size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection; 