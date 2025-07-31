import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, ExternalLink, TrendingUp, MessageCircle, Send } from 'lucide-react';
import { Startup, Comment } from '../types/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

interface StartupsSectionProps {
  isInvestorView?: boolean;
  startups?: Startup[];
  onInterestClick?: (startupId: string, type: 'investment' | 'hiring') => void;
  onCommentSubmit?: (startupId: string, comment: string, type: 'investment' | 'hiring' | 'general') => void;
  currentUser?: any;
  comments?: Comment[];
}

const StartupsSection: React.FC<StartupsSectionProps> = ({ 
  isInvestorView = false, 
  startups = [], 
  onInterestClick,
  onCommentSubmit,
  currentUser,
  comments = []
}) => {
  console.log('StartupsSection received comments:', comments);
  console.log('StartupsSection received startups:', startups);
  
  const [activeTab, setActiveTab] = useState('all');
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [commentTypes, setCommentTypes] = useState<{ [key: string]: 'investment' | 'hiring' | 'general' }>({});
  const [firebaseStartups, setFirebaseStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const navigate = useNavigate();

  // Fetch startups from Firebase
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const startupsRef = collection(db, 'startups');
        // Remove status filter since existing startups don't have status field
        const q = query(startupsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedStartups = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Raw startup data from Firebase:', { id: doc.id, ...data });
          
          return {
            id: doc.id,
            name: data.name || 'Unknown Startup',
            pitch: data.tagline || data.story || 'No description available',
            sector: data.sector || 'Technology',
            badges: data.badges || [],
            special: data.special || null,
            interestedInvestors: data.interestedInvestors || [],
            hiringInvestors: data.hiringInvestors || [],
            collegeId: data.collegeId || data.createdBy || 'unknown',
            createdBy: data.createdBy || 'unknown',
            createdAt: data.createdAt || new Date(),
            slug: data.slug || doc.id,
            status: data.status || 'active',
            // Include additional fields for registered startups
            tagline: data.tagline,
            story: data.story,
            team: data.team || [],
            website: data.website,
            appStore: data.appStore,
            playStore: data.playStore,
            demoUrl: data.demoUrl,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            // New detailed profile fields
            problem: data.problem,
            solution: data.solution,
            productVideo: data.productVideo,
            pitchDeck: data.pitchDeck,
            qrCode: data.qrCode,
            collaborationMessage: data.collaborationMessage,
            individualPitches: data.individualPitches || []
          } as Startup;
        });
        
        setFirebaseStartups(fetchedStartups);
        console.log('Fetched startups from Firebase:', fetchedStartups);
        console.log('Total startups fetched:', fetchedStartups.length);
      } catch (error) {
        console.error('Error fetching startups:', error);
        // Set empty array on error to prevent infinite loading
        setFirebaseStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  // Combine passed startups with Firebase startups
  const allStartups = [...startups, ...firebaseStartups];

  // Get sectors from actual startup data
  const sectors = ['all', ...Array.from(new Set(allStartups.map(s => s.sector)))];
  
  // Filter startups based on active tab
  const filteredStartups = activeTab === 'all' 
    ? allStartups 
    : allStartups.filter(startup => startup.sector === activeTab);

  // Ensure all startups have IDs and are treated as real
  const startupsWithIds = filteredStartups.map((startup: any, index: number) => ({
    ...startup,
    id: startup.id || startup.slug || `startup-${activeTab}-${index}`,
    interestedInvestors: startup.interestedInvestors || [],
    hiringInvestors: startup.hiringInvestors || [],
    // Ensure required fields for registered startups
    name: startup.name || 'Unknown Startup',
    pitch: startup.pitch || startup.tagline || startup.story || 'No description available',
    sector: startup.sector || 'Technology',
    badges: startup.badges || []
  }));

  console.log('StartupsSection - Display startups:', {
    totalStartups: allStartups.length,
    filteredStartups: filteredStartups.length,
    startupsWithIds: startupsWithIds.length,
    activeTab,
    isInvestorView,
    loading
  });

  if (loading) {
    return (
      <section id="startups" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/10 to-[#7d7eed]/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e86888] mx-auto mb-4"></div>
            <p className="text-white/70">Loading startups...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="startups" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e86888]/10 to-[#7d7eed]/10"></div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isInvestorView ? 'Available Startups' : 'Sector-wise Startups'}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {isInvestorView 
              ? 'Discover and invest in innovative solutions across various sectors.'
              : 'Discover innovative solutions across various sectors, built by passionate students who dared to dream big and execute bigger.'
            }
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveTab(sector)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === sector
                  ? 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {sector === 'all' ? 'All Sectors' : sector}
            </button>
          ))}
        </div>

        {/* Startup Cards */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {startupsWithIds.map((startup: any, index: number) => {
              console.log('Rendering startup:', startup);
              return (
                <motion.div
                  key={startup.id || startup.name}
                  className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#e86888]/50 transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#e86888] to-[#7d7eed] rounded-full flex items-center justify-center overflow-hidden">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {startup.name.split(' ').map((word: string) => word[0]).join('')}
                        </span>
                      </div>
                    </div>
                    {startup.special && (
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                        {startup.special}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{startup.name}</h3>
                  <p className="text-white/70 mb-4">{startup.pitch}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#e86888]/20 text-white px-3 py-1 rounded-full text-sm">
                      {startup.sector}
                    </span>
                    {startup.badges.map((badge: string) => (
                      <span key={badge} className="bg-[#7d7eed]/20 text-white px-3 py-1 rounded-full text-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                  
                  {isInvestorView && onInterestClick && currentUser ? (
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          console.log('Interest button clicked for startup:', startup);
                          onInterestClick(startup.id, 'investment');
                        }}
                        className={`w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          (startup.interestedInvestors || []).includes(currentUser.uid)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white hover:scale-105'
                        }`}
                      >
                        <TrendingUp size={16} />
                        {(startup.interestedInvestors || []).includes(currentUser.uid) 
                          ? 'Interested ✓' 
                          : 'Show Interest'
                        }
                      </button>
                      
                      <button 
                        onClick={() => {
                          console.log('Hiring button clicked for startup:', startup);
                          onInterestClick(startup.id, 'hiring');
                        }}
                        className={`w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          (startup.hiringInvestors || []).includes(currentUser.uid)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gradient-to-r from-[#7d7eed] to-[#e86888] text-white hover:scale-105'
                        }`}
                      >
                        <Zap size={16} />
                        {(startup.hiringInvestors || []).includes(currentUser.uid) 
                          ? 'Want to Hire ✓' 
                          : 'Want to Hire'
                        }
                      </button>

                      {/* Comment Button */}
                      <button 
                        onClick={() => setShowCommentForm(showCommentForm === startup.id ? null : startup.id)}
                        className="w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                      >
                        <MessageCircle size={16} />
                        Add Comment
                      </button>

                      {/* Comment Form */}
                      {showCommentForm === startup.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <div className="space-y-3">
                            <select
                              value={commentTypes[startup.id] || 'general'}
                              onChange={(e) => setCommentTypes({ ...commentTypes, [startup.id]: e.target.value as any })}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#e86888]"
                            >
                              <option value="general">General Comment</option>
                              <option value="investment">Investment Related</option>
                              <option value="hiring">Hiring Related</option>
                            </select>
                            
                            <textarea
                              value={commentTexts[startup.id] || ''}
                              onChange={(e) => setCommentTexts({ ...commentTexts, [startup.id]: e.target.value })}
                              placeholder="Write your comment here..."
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#e86888] resize-none"
                              rows={3}
                            />
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (commentTexts[startup.id]?.trim() && onCommentSubmit) {
                                    onCommentSubmit(startup.id, commentTexts[startup.id]?.trim(), commentTypes[startup.id]);
                                    setCommentTexts({ ...commentTexts, [startup.id]: '' });
                                    setShowCommentForm(null);
                                  }
                                }}
                                className="flex-1 py-2 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                              >
                                <Send size={14} />
                                Submit
                              </button>
                              <button
                                onClick={() => {
                                  setCommentTexts({ ...commentTexts, [startup.id]: '' });
                                  setShowCommentForm(null);
                                }}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium transition-all duration-300 hover:bg-white/20"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Display Comments */}
                      {comments.filter(c => c.startupId === startup.id).length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-white/80 text-sm font-medium">Comments:</h4>
                          {comments
                            .filter(c => c.startupId === startup.id)
                            .map((comment, idx) => {
                              console.log('Displaying comment:', comment);
                              return (
                                <div key={comment.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/90 text-sm font-medium">{comment.investorName}</span>
                                    <span className="text-white/60 text-xs">
                                      {new Date(comment.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-white/70 text-sm">{comment.comment}</p>
                                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                                    comment.type === 'investment' ? 'bg-green-500/20 text-green-400' :
                                    comment.type === 'hiring' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {comment.type}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        // Navigate to startup profile page using slug
                        const slug = startup.slug || startup.id || startup.name.toLowerCase().replace(/\s+/g, '-');
                        navigate(`/startup/${slug}`);
                      }}
                      className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-[#e86888]/25 active:scale-95 transform"
                    >
                      View Details <ExternalLink size={16} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {startupsWithIds.length === 0 && (
          <div className="text-center text-white/60 text-xl">
            No startups found for the selected sector.
          </div>
        )}
      </div>
    </section>
  );
};

export default StartupsSection; 