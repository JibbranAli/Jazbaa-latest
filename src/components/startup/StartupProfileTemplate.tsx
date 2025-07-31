import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Rocket, 
  Users, 
  Globe, 
  Smartphone, 
  QrCode, 
  Mail, 
  Phone, 
  PlayCircle, 
  Download, 
  Presentation, 
  Lightbulb,
  ExternalLink,
  Linkedin,
  Github,
  Briefcase,
  Video,
  Code
} from 'lucide-react';

interface StartupData {
  name: string;
  tagline: string;
  story: string;
  sector: string;
  badges: string[];
  team: TeamMember[];
  website?: string;
  appStore?: string;
  playStore?: string;
  demoUrl?: string;
  qrCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  productVideo?: string;
  pitchDeck?: string;
  problem?: string;
  solution?: string;
  collaborationMessage?: string;
  individualPitches?: IndividualPitch[];
  slug: string;
  createdAt: Date;
  status: string;
  logo?: string; // Added logo field
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

// Utility function to convert YouTube URLs to embed format
const convertToEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle YouTube URLs
  if (url.includes('youtube.com/watch')) {
    const videoId = url.match(/[?&]v=([^&]+)/)?.[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Handle YouTube short URLs
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Handle YouTube embed URLs (already in correct format)
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // For other video platforms, return as is
  return url;
};

const StartupProfileTemplate: React.FC = () => {
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
        console.log('🔍 Fetching startup profile for slug:', slug);
        
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
        
        // Ensure all required fields have fallbacks
        const processedData = {
          ...startupData,
          name: startupData.name || 'Unknown Startup',
          tagline: startupData.tagline || 'No tagline available',
          story: startupData.story || 'No story available',
          team: startupData.team || [],
          badges: startupData.badges || [],
          sector: startupData.sector || 'Technology',
          slug: startupData.slug || slug,
          // Ensure all optional fields have proper fallbacks
          problem: startupData.problem || 'Problem description not available',
          solution: startupData.solution || 'Solution description not available',
          collaborationMessage: startupData.collaborationMessage || 'We are open to collaboration, funding, and partnerships.',
          individualPitches: startupData.individualPitches || [],
          contactEmail: startupData.contactEmail || 'contact@startup.com',
          contactPhone: startupData.contactPhone || 'Not provided',
          demoUrl: startupData.demoUrl || undefined,
          appStore: startupData.appStore || undefined,
          playStore: startupData.playStore || undefined,
          qrCode: startupData.qrCode || undefined,
          productVideo: startupData.productVideo || undefined,
          pitchDeck: startupData.pitchDeck || undefined,
          website: startupData.website || undefined,
          logo: startupData.logo || undefined // Ensure logo is included
        };
        
        setStartup(processedData);
        console.log('✅ Startup profile processed and set:', processedData);
      } catch (error) {
        console.error('❌ Error fetching startup profile:', error);
        setError('Error loading startup profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading startup profile...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Startup Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested startup profile could not be found.'}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-black py-20 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        
        {/* Left Content Card */}
        <div className="bg-gradient-to-b from-neutral-900 to-black rounded-3xl shadow-2xl p-10 relative z-20">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {startup.name}
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-medium mb-10 text-gray-200">
            {startup.tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {startup.productVideo && (
              <button className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:scale-105 transform transition-all duration-300">
                <PlayCircle className="w-5 h-5" />
                Watch Product Video
              </button>
            )}
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 transform transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5" />
                Explore Website / App
              </a>
            )}
            <button className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 transform transition-all duration-300">
              <Users className="w-5 h-5" />
              Meet the Team
            </button>
          </div>
        </div>

        {/* Right Logo */}
        <div className="flex justify-center md:justify-end relative">
          <div className="bg-white rounded-full shadow-2xl w-72 h-72 flex items-center justify-center absolute md:right-[-50px] z-10">
            {startup.logo ? (
              <img
                src={startup.logo}
                alt={`${startup.name} logo`}
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="text-gray-500">No Logo</div>
            )}
          </div>
        </div>
      </div>
    </section>
      {/* Product Introduction */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Why We Built This
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-medium">
                Born from a real problem. Built with purpose.
              </p>
              <div className="text-lg text-gray-700 space-y-6 leading-relaxed">
                <p>{startup.story}</p>
                {startup.problem && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <h3 className="font-semibold text-red-800 mb-2">The Problem</h3>
                    <p className="text-red-700">{startup.problem}</p>
                  </div>
                )}
                {startup.solution && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                    <h3 className="font-semibold text-green-800 mb-2">Our Solution</h3>
                    <p className="text-green-700">{startup.solution}</p>
                  </div>
                )}
              </div>
            </div>
            {startup.productVideo ? (
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl h-96 flex items-center justify-center text-white shadow-2xl overflow-hidden">
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  {/* <div className="text-xl font-semibold mb-2">Product Video</div> */}
                  {/* <div className="text-sm opacity-80 mb-4">{startup.sector} Sector</div> */}
                  <div className="w-full max-w-md">
                    <iframe
                      src={convertToEmbedUrl(startup.productVideo)}
                      title={`${startup.name} Product Video`}
                      className="w-full h-56 rounded-lg shadow-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl h-96 flex items-center justify-center text-white shadow-2xl">
                <div className="text-center">
                  <Lightbulb className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-xl font-semibold">Innovation Story</div>
                  <div className="text-sm opacity-80 mt-2">{startup.sector} Sector</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The Solution */}
      {/* {startup.productVideo && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Our Product in Action
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Solving a Real Problem, One Feature at a Time.
            </p>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl h-96 flex items-center justify-center text-white shadow-2xl max-w-4xl mx-auto">
              <div className="text-center">
                <PlayCircle className="w-20 h-20 mx-auto mb-4" />
                <div className="text-2xl font-semibold">Product Demo Video</div>
                <div className="text-sm opacity-80 mt-2">2-4 minute overview</div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* Pitch Deck */}
      {startup.pitchDeck && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              See Our Vision
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              View our Investor Pitch Deck to know our mission, model, and market.
            </p>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-500 to-teal-400 rounded-xl h-96 flex items-center justify-center text-white">
                <div className="text-center">
                  <Presentation className="w-20 h-20 mx-auto mb-4" />
                  <div className="text-2xl font-semibold">Investor Pitch Deck</div>
                  <div className="text-sm opacity-80 mt-2 mb-6">Google Slides Embedded</div>
                  <a
                    href={startup.pitchDeck}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 backdrop-blur-md rounded-lg font-semibold hover:bg-opacity-30 transition-all mx-auto"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Meet the Team */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Brains Behind the Build
            </h2>
            <p className="text-xl text-gray-600">
              Student Innovators Who Dared to Dream & Do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {startup.team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-teal-400 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {member.headshot ? (
                    <img
                      src={member.headshot}
                      alt={`${member.name} headshot`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name.split(' ').map((word: string) => word[0]).join('')
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex gap-3 justify-center mb-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.portfolio && (
                    <a
                      href={member.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all"
                    >
                      <Briefcase className="w-5 h-5" />
                    </a>
                  )}
                </div>
                {member.hiring && (
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-teal-400 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Available for Hiring
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Pitch Video */}
      {startup.team.some(member => member.pitchVideo) && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Want to Hire Our Talent?
              </h2>
              <p className="text-xl text-gray-600">
                Beyond Founders — Talented Developers Open to Opportunities
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 max-w-4xl w-full">
                {/* Video Player */}
                <div className="mb-8">
                  {startup.team.find(member => member.pitchVideo)?.pitchVideo && (
                    <div className="relative w-full h-96 rounded-xl overflow-hidden">
                      <iframe
                        src={convertToEmbedUrl(startup.team.find(member => member.pitchVideo)!.pitchVideo!)}
                        title="Team Pitch Video"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
                
                {/* Team Information */}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-3">Meet Our Team</h3>
                  <p className="text-gray-600 mb-6">
                    Our talented developers are passionate about creating innovative solutions and leading development teams.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {startup.team.map((member, index) => (
                      <span key={index} className="inline-block bg-gradient-to-r from-purple-500 to-teal-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {member.name} - {member.role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Live Demo */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Try It Yourself
            </h2>
            <p className="text-xl text-gray-600">
              Experience our platform firsthand
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {startup.demoUrl && (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <Globe className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Live Website</h3>
                <p className="text-gray-600 mb-6">Explore our full-featured web application with all the latest features.</p>
                <a
                  href={startup.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:-translate-y-1 transition-all mx-auto"
                >
                  <ExternalLink className="w-5 h-5" />
                  Visit Website
                </a>
              </div>
            )}
            {(startup.appStore || startup.playStore) && (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <Smartphone className="w-16 h-16 text-pink-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Mobile App</h3>
                <p className="text-gray-600 mb-6">Download our mobile app for iOS and Android devices.</p>
                <div className="flex gap-2 justify-center">
                  {startup.appStore && (
                    <a
                      href={startup.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      iOS
                    </a>
                  )}
                  {startup.playStore && (
                    <a
                      href={startup.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      Android
                    </a>
                  )}
                </div>
              </div>
            )}
            {startup.qrCode && (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                  <QrCode className="w-20 h-20 text-purple-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">QR Code Access</h3>
                <p className="text-gray-600">Scan for instant access to our platform</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call for Collaboration */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Take Our Dream Further
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {startup.collaborationMessage}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {startup.contactEmail && (
              <a
                href={`mailto:${startup.contactEmail}`}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:-translate-y-1 transition-all shadow-lg"
              >
                <Mail className="w-5 h-5" />
                Contact Founders
              </a>
            )}
            {startup.contactPhone && (
              <a
                href={`tel:${startup.contactPhone}`}
                className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:-translate-y-1 transition-all shadow-sm"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            )}
            <button className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:-translate-y-1 transition-all">
              <Download className="w-5 h-5" />
              Request Detailed Deck
            </button>
            <button className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:-translate-y-1 transition-all">
              <Rocket className="w-5 h-5" />
              Support via CSR
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex gap-8 justify-center items-center mb-8 flex-wrap">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-8 h-8" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-teal-400 rounded-xl flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Code className="w-8 h-8" />
            </div>
          </div>
          <p className="text-gray-300 italic text-lg mb-4">
            "Built with passion during The Creator Program 2025 under the mentorship of Mr. Vimal Daga."
          </p>
          <p className="text-gray-400 text-sm">
            JAZBAA × LinuxWorld | Empowering Student Innovation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StartupProfileTemplate; 