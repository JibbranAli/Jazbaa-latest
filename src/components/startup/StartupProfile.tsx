import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Play, 
  ExternalLink, 
  Users, 
  Video, 
  FileText, 
  Smartphone, 
  QrCode, 
  Mail, 
  Phone, 
  MessageCircle,
  Download,
  Globe,
  Github,
  Linkedin,
  Award,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface StartupData {
  name: string;
  tagline: string;
  story: string;
  storyImage?: string;
  productVideo?: string;
  pitchDeck?: string;
  team: TeamMember[];
  website?: string;
  appStore?: string;
  playStore?: string;
  demoUrl?: string;
  qrCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  sector: string;
  badges: string[];
  special?: string;
  slug: string;
  createdAt: Date;
  status: string;
  logo?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  individualPitches?: IndividualPitch[];
  collaborationMessage?: string;
}

interface TeamMember {
  name: string;
  role: string;
  headshot?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  hiring?: boolean;
  pitchVideo?: string;
}

interface IndividualPitch {
  name: string;
  role: string;
  videoUrl: string;
  hiring: boolean;
}

const StartupProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [startup, setStartup] = useState<StartupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchStartup = async () => {
      if (!slug) {
        setError('Invalid startup slug.');
        setLoading(false);
        return;
      }

      try {
        const startupRef = doc(db, 'startups', slug);
        const startupDoc = await getDoc(startupRef);

        if (!startupDoc.exists()) {
          setError('Startup not found.');
          setLoading(false);
          return;
        }

        const startupData = startupDoc.data() as StartupData;
        setStartup(startupData);
      } catch (error) {
        console.error('Error fetching startup:', error);
        setError('Error loading startup profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading startup profile...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Startup Not Found</h1>
          <p className="text-gray-300 mb-6">{error || 'The requested startup profile could not be found.'}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* 1. Hero Banner */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/10 to-[#7d7eed]/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full mx-auto flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {startup.name.split(' ').map((word: string) => word[0]).join('')}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">{startup.name}</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">{startup.tagline}</p>
            
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {startup.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Sector */}
            <div className="inline-block px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 mb-8">
              {startup.sector}
            </div>

            {/* Call-to-Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              {startup.productVideo && (
                <button className="px-6 py-3 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  <Play size={20} />
                  Watch Product Video
                </button>
              )}
              
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/20 flex items-center gap-2"
                >
                  <Globe size={20} />
                  Explore Website
                </a>
              )}

              <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/20 flex items-center gap-2">
                <Users size={20} />
                Meet the Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Product Introduction — Story Behind the Startup */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-center">Why We Built This</h2>
            <p className="text-xl text-gray-300 mb-8 text-center">Born from a real problem. Built with purpose.</p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <p className="text-lg leading-relaxed text-gray-300 mb-6">{startup.story}</p>
              
              {startup.problem && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">The Problem</h3>
                  <p className="text-gray-300">{startup.problem}</p>
                </div>
              )}

              {startup.solution && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Our Solution</h3>
                  <p className="text-gray-300">{startup.solution}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Solution — What We've Built */}
      {startup.productVideo && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center">Our Product in Action</h2>
              <p className="text-xl text-gray-300 mb-8 text-center">Solving a Real Problem, One Feature at a Time.</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400">Product Video: {startup.productVideo}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 4. Pitch Deck */}
      {startup.pitchDeck && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center">See Our Vision</h2>
              <p className="text-xl text-gray-300 mb-8 text-center">View our Investor Pitch Deck to know our mission, model, and market.</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-4">Pitch Deck: {startup.pitchDeck}</p>
                    <button className="px-4 py-2 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
                      <Download size={16} />
                      Download Deck
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 5. Meet the Innovators */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-center">Brains Behind the Build</h2>
            <p className="text-xl text-gray-300 mb-8 text-center">Student Innovators Who Dared to Dream & Do</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startup.team.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-gray-400 mb-4">{member.role}</p>
                    
                    {member.hiring && (
                      <span className="inline-block px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-sm text-green-300 mb-4">
                        Available for Hiring
                      </span>
                    )}
                    
                    <div className="flex justify-center gap-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors"
                        >
                          <Linkedin size={16} />
                        </a>
                      )}
                      
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      
                      {member.portfolio && (
                        <a
                          href={member.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Individual Pitch Videos */}
      {startup.individualPitches && startup.individualPitches.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center">Want to Hire Our Talent?</h2>
              <p className="text-xl text-gray-300 mb-8 text-center">Beyond Founders — Talented Developers Open to Opportunities</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {startup.individualPitches.map((pitch, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">{pitch.name}</h3>
                      <p className="text-gray-400 mb-4">{pitch.role}</p>
                      
                      {pitch.hiring && (
                        <span className="inline-block px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-sm text-green-300 mb-4">
                          Open to Explore Offers
                        </span>
                      )}
                      
                      <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Video size={32} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-400 text-sm">Pitch Video</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 7. Live Demo & Product Access */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-center">Try It Yourself</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startup.demoUrl && (
                <a
                  href={startup.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/20 transition-colors text-center"
                >
                  <Globe className="text-3xl mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Live Website</h3>
                  <p className="text-gray-400 text-sm">Try our product online</p>
                </a>
              )}

              {startup.appStore && (
                <a
                  href={startup.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/20 transition-colors text-center"
                >
                  <Smartphone className="text-3xl mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">App Store</h3>
                  <p className="text-gray-400 text-sm">Download on iOS</p>
                </a>
              )}

              {startup.playStore && (
                <a
                  href={startup.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/20 transition-colors text-center"
                >
                  <Smartphone className="text-3xl mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Play Store</h3>
                  <p className="text-gray-400 text-sm">Download on Android</p>
                </a>
              )}

              {startup.qrCode && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                  <QrCode className="text-3xl mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">QR Code</h3>
                  <p className="text-gray-400 text-sm">Scan for instant access</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Call for Collaboration */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-center">Take Our Dream Further</h2>
            <p className="text-xl text-gray-300 mb-8 text-center">
              {startup.collaborationMessage || "We're open to funding, incubation, mentorship, or partnership"}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startup.contactEmail && (
                <a
                  href={`mailto:${startup.contactEmail}`}
                  className="px-6 py-3 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Contact Founders
                </a>
              )}

              <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-2">
                <Calendar size={20} />
                Book a 1:1 Call
              </button>

              <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-2">
                <FileText size={20} />
                Request Detailed Deck
              </button>

              <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-2">
                <Award size={20} />
                Support via CSR / Grant
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. Footer Section */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full mx-auto flex items-center justify-center overflow-hidden mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {startup.name.split(' ').map((word: string) => word[0]).join('')}
                </span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{startup.name}</h3>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-gray-400">Powered by</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">JAZBAA</span>
              <span className="text-gray-400">+</span>
              <span className="text-white font-semibold">LinuxWorld</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm">
            Built with passion during The Creator Program 2025 under the mentorship of Mr. Vimal Daga.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StartupProfile; 