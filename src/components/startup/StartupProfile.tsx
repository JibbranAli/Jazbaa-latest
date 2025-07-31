import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Play, ExternalLink, Users, Video, FileText, Smartphone, QrCode, Mail, Phone, MessageCircle,
  Download, Globe, Github, Linkedin, Award, Calendar, ArrowRight, Eye, Heart, Zap
} from 'lucide-react';

interface StartupData {
  name: string;
  tagline: string;
  story: string;
  storyImage?: string;
  productVideo?: string | null;
  pitchDeck?: string | null;
  team: TeamMember[];
  website?: string | null;
  appStore?: string | null;
  playStore?: string | null;
  demoUrl?: string | null;
  qrCode?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
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
  isPermanent?: boolean;
  profileCreatedAt?: Date;
  lastUpdated?: Date;
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
        console.log('🔍 Fetching PERMANENT startup profile for slug:', slug);
        
        // Try to fetch from main startups collection first
        const startupRef = doc(db, 'startups', slug);
        const startupDoc = await getDoc(startupRef);

        let startupData: StartupData | null = null;

        if (startupDoc.exists()) {
          startupData = startupDoc.data() as StartupData;
          console.log('✅ Startup data fetched from main collection:', startupData);
        } else {
          // If not found in main collection, try backup collection
          console.log('🔄 Startup not found in main collection, checking backup...');
          try {
            const backupRef = doc(db, 'permanent_profiles', slug);
            const backupDoc = await getDoc(backupRef);
            
            if (backupDoc.exists()) {
              startupData = backupDoc.data() as StartupData;
              console.log('✅ Startup data fetched from backup collection:', startupData);
            } else {
              console.log('❌ Startup not found in either collection for slug:', slug);
              setError('Startup profile not found. This profile may have been moved or deleted.');
              setLoading(false);
              return;
            }
          } catch (backupError) {
            console.error('❌ Error checking backup collection:', backupError);
            setError('Startup profile not found. This profile may have been moved or deleted.');
            setLoading(false);
            return;
          }
        }
        
        // Debug: Log all available fields
        console.log('📊 Available data fields:', {
          name: startupData.name,
          tagline: startupData.tagline,
          story: startupData.story,
          sector: startupData.sector,
          badges: startupData.badges,
          team: startupData.team,
          website: startupData.website,
          productVideo: startupData.productVideo,
          pitchDeck: startupData.pitchDeck,
          problem: startupData.problem,
          solution: startupData.solution,
          collaborationMessage: startupData.collaborationMessage,
          individualPitches: startupData.individualPitches,
          contactEmail: startupData.contactEmail,
          contactPhone: startupData.contactPhone,
          demoUrl: startupData.demoUrl,
          appStore: startupData.appStore,
          playStore: startupData.playStore,
          qrCode: startupData.qrCode
        });
        
        // Ensure all required fields have fallbacks for PERMANENT display
        const processedData = {
          ...startupData,
          name: startupData.name || 'Unknown Startup',
          tagline: startupData.tagline || 'No tagline available',
          story: startupData.story || 'No story available',
          team: startupData.team || [],
          badges: startupData.badges || [],
          sector: startupData.sector || 'Technology',
          slug: startupData.slug || slug,
          // Ensure permanent status
          isPermanent: startupData.isPermanent || true,
          profileCreatedAt: startupData.profileCreatedAt || startupData.createdAt || new Date(),
          lastUpdated: startupData.lastUpdated || new Date(),
          // Ensure all optional fields have proper fallbacks
          problem: startupData.problem || 'Problem description not available',
          solution: startupData.solution || 'Solution description not available',
          collaborationMessage: startupData.collaborationMessage || 'We are open to collaboration, funding, and partnerships.',
          individualPitches: startupData.individualPitches || [],
          contactEmail: startupData.contactEmail || 'contact@startup.com',
          contactPhone: startupData.contactPhone || 'Not provided',
          demoUrl: startupData.demoUrl || null,
          appStore: startupData.appStore || null,
          playStore: startupData.playStore || null,
          qrCode: startupData.qrCode || null,
          productVideo: startupData.productVideo || null,
          pitchDeck: startupData.pitchDeck || null,
          website: startupData.website || null
        };
        
        setStartup(processedData);
        console.log('✅ PERMANENT startup profile processed and set:', processedData);
      } catch (error) {
        console.error('❌ Error fetching permanent startup profile:', error);
        setError('Error loading permanent startup profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading startup profile...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Debug Section - Remove in production */}
      {startup && (
        <section className="py-8 px-6 bg-yellow-500/10 border border-yellow-500/30">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-yellow-400 font-semibold mb-4">🔧 Debug Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-yellow-300"><strong>Name:</strong> {startup.name}</p>
                <p className="text-yellow-300"><strong>Tagline:</strong> {startup.tagline}</p>
                <p className="text-yellow-300"><strong>Sector:</strong> {startup.sector}</p>
                <p className="text-yellow-300"><strong>Badges:</strong> {startup.badges.join(', ')}</p>
                <p className="text-yellow-300"><strong>Team Members:</strong> {startup.team.length}</p>
              </div>
              <div>
                <p className="text-yellow-300"><strong>Website:</strong> {startup.website || 'Not provided'}</p>
                <p className="text-yellow-300"><strong>Product Video:</strong> {startup.productVideo || 'Not provided'}</p>
                <p className="text-yellow-300"><strong>Pitch Deck:</strong> {startup.pitchDeck || 'Not provided'}</p>
                <p className="text-yellow-300"><strong>Contact Email:</strong> {startup.contactEmail || 'Not provided'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                console.log('🔍 Full startup data:', startup);
                alert('Check browser console for full data');
              }}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded text-sm"
            >
              View Full Data in Console
            </button>
          </div>
        </section>
      )}

      {/* 1. Hero Banner (Full Width Top Section) */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/10 to-[#7d7eed]/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Product Logo */}
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full mx-auto flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {startup.name.split(' ').map((word: string) => word[0]).join('')}
                  </span>
                </div>
              </div>
            </div>

            {/* Name & Tagline */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {startup.name}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto">
              {startup.tagline}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {startup.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Sector */}
            <div className="inline-block px-6 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 mb-8 font-medium">
              {startup.sector}
            </div>

            {/* Call-to-Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              {startup.productVideo && (
                <button className="px-8 py-4 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-3 shadow-lg">
                  <Play size={24} />
                  Watch Product Video
                </button>
              )}
              
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/20 flex items-center gap-3"
                >
                  <Globe size={24} />
                  Explore Website
                </a>
              )}

              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/20 flex items-center gap-3">
                <Users size={24} />
                Meet the Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Product Introduction — Story Behind the Startup */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why We Built This
            </h2>
            <p className="text-xl text-gray-300 mb-12 text-center">
              Born from a real problem. Built with purpose.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-lg leading-relaxed text-gray-300 mb-8">{startup.story}</p>
              
              {startup.problem && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-red-300">The Problem</h3>
                  <p className="text-gray-300">{startup.problem}</p>
                </div>
              )}

              {startup.solution && (
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-green-300">Our Solution</h3>
                  <p className="text-gray-300">{startup.solution}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Solution — What We've Built */}
      {startup.productVideo && (
        <section className="py-20 px-6 bg-gradient-to-br from-blue-900 to-indigo-900">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Product in Action
              </h2>
              <p className="text-xl text-gray-300 mb-12 text-center">
                Solving a Real Problem, One Feature at a Time.
              </p>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <iframe
                  src={startup.productVideo.replace('watch?v=', 'embed/')}
                  title="Product Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 4. Pitch Deck (Embedded Viewer) */}
      {startup.pitchDeck && (
        <section className="py-20 px-6 bg-gradient-to-br from-indigo-900 to-purple-900">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                See Our Vision
              </h2>
              <p className="text-xl text-gray-300 mb-12 text-center">
                View our Investor Pitch Deck to know our mission, model, and market.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <FileText size={80} className="text-blue-400 mx-auto mb-6" />
                <h3 className="text-3xl font-semibold mb-4">Download Pitch Deck</h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Get a comprehensive overview of our startup, market analysis, and growth strategy.
                </p>
                <a
                  href={startup.pitchDeck}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#e86888]/25 active:scale-95 transform"
                >
                  <Download size={24} className="mr-3" /> Download Now
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 5. Meet the Innovators */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Brains Behind the Build
            </h2>
            <p className="text-xl text-gray-300 mb-12 text-center">
              Student Innovators Who Dared to Dream & Do
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {startup.team.map((member, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold shadow-lg">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-gray-400 mb-4 text-lg">{member.role}</p>
                    
                    {member.hiring && (
                      <span className="inline-block px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full text-sm text-green-300 mb-4 font-medium">
                        Available for Hiring
                      </span>
                    )}
                    
                    <div className="flex justify-center gap-4">
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                      {member.github && (
                        <a 
                          href={member.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {member.portfolio && (
                        <a 
                          href={member.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors"
                        >
                          <ExternalLink size={20} />
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
      {startup.team.some(member => member.pitchVideo) && (
        <section className="py-20 px-6 bg-gradient-to-br from-pink-900 to-red-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Want to Hire Our Talent?
              </h2>
              <p className="text-xl text-gray-300 mb-12 text-center">
                Beyond Founders — Talented Developers Open to Opportunities
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {startup.team.filter(member => member.pitchVideo).map((member, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="text-center">
                      <Video size={48} className="text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                      <p className="text-gray-400 mb-4">{member.role}</p>
                      
                      {member.hiring && (
                        <span className="inline-block px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-sm text-green-300 mb-4">
                          Available for Hiring
                        </span>
                      )}
                      
                      <a
                        href={member.pitchVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
                      >
                        <Play size={18} className="mr-2" /> Watch Pitch
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 7. Live Demo & Product Access */}
      <section className="py-20 px-6 bg-gradient-to-br from-red-900 to-orange-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Try It Yourself
            </h2>
            <p className="text-xl text-gray-300 mb-12 text-center">
              Experience our product firsthand.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {startup.demoUrl && (
                <a 
                  href={startup.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-colors text-center group"
                >
                  <Globe className="text-4xl mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-2">Live Website</h3>
                  <p className="text-gray-400 text-sm">Try our product online</p>
                </a>
              )}
              
              {startup.appStore && (
                <a 
                  href={startup.appStore} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-colors text-center group"
                >
                  <Smartphone className="text-4xl mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-2">App Store</h3>
                  <p className="text-gray-400 text-sm">Download on iOS</p>
                </a>
              )}
              
              {startup.playStore && (
                <a 
                  href={startup.playStore} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-colors text-center group"
                >
                  <Smartphone className="text-4xl mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-2">Play Store</h3>
                  <p className="text-gray-400 text-sm">Download on Android</p>
                </a>
              )}
              
              {startup.qrCode && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <QrCode className="text-4xl mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">QR Code</h3>
                  <p className="text-gray-400 text-sm">Scan for instant access</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Call for Collaboration */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-900 to-yellow-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Take Our Dream Further
            </h2>
            <p className="text-xl text-gray-300 mb-12 text-center">
              {startup.collaborationMessage}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startup.contactEmail && (
                <a 
                  href={`mailto:${startup.contactEmail}`} 
                  className="px-8 py-4 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                >
                  <Mail size={24} /> Contact Founders
                </a>
              )}
              
              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-3">
                <Calendar size={24} /> Book a 1:1 Call
              </button>
              
              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-3">
                <FileText size={24} /> Request Detailed Deck
              </button>
              
              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-medium transition-all duration-300 hover:bg-white/20 flex items-center justify-center gap-3">
                <Award size={24} /> Support via CSR / Grant
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. Footer Section */}
      <footer className="py-12 px-6 bg-gradient-to-br from-yellow-900 to-gray-900 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-lg">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {startup.name.split(' ').map((word: string) => word[0]).join('')}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">{startup.name}</h3>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-400">Powered by</span>
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-lg">JAZBAA</span>
              <span className="text-gray-400">+</span>
              <span className="text-white font-semibold text-lg">LinuxWorld</span>
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