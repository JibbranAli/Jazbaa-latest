import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, TrendingUp, Zap, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ensureStartupProfile, getStartupProfileUrl } from '../utils/profileManager';
import { Startup, Comment } from '../types/auth';

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
  const navigate = useNavigate();
  const [startupsWithIds, setStartupsWithIds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [commentTypes, setCommentTypes] = useState<{ [key: string]: 'investment' | 'hiring' | 'general' }>({});

  const sectors = ['all', 'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 
    'Entertainment', 'Transportation', 'Food & Beverage', 'Real Estate', 
    'Manufacturing', 'Energy', 'Environment', 'Sports', 'Fashion', 'Other'];

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        console.log('🔍 Fetching startups from Firebase...');
        const startupsRef = collection(db, 'startups');
        
        // Remove any filters to get ALL startups
        const querySnapshot = await getDocs(startupsRef);
        
        const fetchedStartups = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📊 Startup data from Firebase:', { id: doc.id, name: data.name, sector: data.sector });
          return {
            id: doc.id,
            ...data
          };
        });

        console.log('✅ Fetched startups count:', fetchedStartups.length);
        console.log('✅ All fetched startups:', fetchedStartups);

        // Ensure all startups have profile pages
        for (const startup of fetchedStartups) {
          try {
            await ensureStartupProfile(startup);
          } catch (profileError) {
            console.warn('⚠️ Profile creation failed for startup:', startup.name, profileError);
          }
        }

        // Combine fetched startups with passed startups prop
        const allStartups = [...fetchedStartups, ...startups];
        const uniqueStartups = allStartups.filter((startup, index, self) => 
          index === self.findIndex(s => s.id === startup.id)
        );

        console.log('✅ Final unique startups count:', uniqueStartups.length);
        console.log('✅ Final startups list:', uniqueStartups.map(s => ({ id: s.id, name: s.name, sector: s.sector })));

        setStartupsWithIds(uniqueStartups);
      } catch (error) {
        console.error('❌ Error fetching startups:', error);
        console.error('❌ Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        setStartupsWithIds(startups);
      }
    };

    fetchStartups();
  }, [startups]);

  const filteredStartups = activeTab === 'all' 
    ? startupsWithIds 
    : startupsWithIds.filter(startup => startup.sector === activeTab);

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isInvestorView ? 'Discover Startups' : 'Featured Startups'}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {isInvestorView 
              ? 'Explore innovative startups and connect with founders'
              : 'Meet the innovative startups participating in JAZBAA 4.0'
            }
          </p>
        </div>

        {/* Sector Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
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
            {filteredStartups.map((startup: any, index: number) => {
              console.log('Rendering startup:', startup);
              return (
                <motion.div
                  key={startup.id || startup.name}
                  className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#e86888]/50 transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={`${startup.name} logo`}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <Rocket className="w-8 h-8 text-white" />
                        )}
            
                      <div>
                        <h3 className="font-bold text-lg text-white">{startup.name}</h3>
                        <p className="text-sm text-white/70">{startup.sector}</p>
                      </div>
                    </div>
                    {startup.special && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {startup.special}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/70 mb-4">{startup.pitch}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {startup.badges?.map((badge: string) => (
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
                                  const commentText = commentTexts[startup.id]?.trim();
                                  const commentType = commentTypes[startup.id] || 'general';
                                  
                                  if (commentText && onCommentSubmit) {
                                    console.log('Submitting comment:', {
                                      startupId: startup.id,
                                      comment: commentText,
                                      type: commentType
                                    });
                                    
                                    onCommentSubmit(startup.id, commentText, commentType);
                                    setCommentTexts({ ...commentTexts, [startup.id]: '' });
                                    setShowCommentForm(null);
                                  } else {
                                    console.warn('Comment submission failed:', {
                                      hasComment: !!commentText,
                                      hasOnCommentSubmit: !!onCommentSubmit,
                                      commentType: commentType
                                    });
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
                        const profileUrl = getStartupProfileUrl(startup);
                        console.log('🔗 Navigating to startup profile:', {
                          startupName: startup.name,
                          profileUrl: profileUrl,
                          hasSlug: !!startup.slug,
                          hasId: !!startup.id
                        });
                        navigate(profileUrl);
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

        {filteredStartups.length === 0 && (
          <div className="text-center text-white/60 text-xl">
            No startups found for the selected sector.
          </div>
        )}
      </div>
    </section>
  );
};

export default StartupsSection; 