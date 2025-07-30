import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Startup, Comment } from '../../types/auth';
import { TrendingUp, Building, Filter, Award } from 'lucide-react';
import StartupsSection from '../StartupsSection';

const InvestorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching investor data...');
      
      const [startupsCollection, commentsCollection] = await Promise.all([
        getDocs(collection(db, 'startups')),
        getDocs(collection(db, 'comments'))
      ]);
      
      const startupsData = startupsCollection.docs.map(doc => {
        const data = {
          id: doc.id,
          ...doc.data()
        };
        console.log('Startup data:', data);
        return data;
      }) as Startup[];
      
      const commentsData = commentsCollection.docs.map(doc => {
        const data = {
          id: doc.id,
          ...doc.data()
        };
        console.log('Comment data:', data);
        return data;
      }) as Comment[];
      
      console.log('Total startups found:', startupsData.length);
      console.log('Total comments found:', commentsData.length);
      console.log('Startups with IDs:', startupsData.map(s => ({ id: s.id, name: s.name })));
      
      setStartups(startupsData);
      setComments(commentsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      alert(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (startupId: string, type: 'investment' | 'hiring') => {
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    
    if (!startupId) {
      console.error('No startup ID provided');
      alert('Error: No startup ID provided');
      return;
    }
    
    try {
      console.log(`Handling ${type} interest for startup ${startupId} by user ${currentUser.uid}`);
      
      const startupRef = doc(db, 'startups', startupId);
      const startup = startups.find(s => s.id === startupId);
      
      if (!startup) {
        console.error(`Startup with id ${startupId} not found in local data`);
        console.log('Available startups:', startups.map(s => ({ id: s.id, name: s.name })));
        alert(`Error: Startup not found. Please refresh the page.`);
        return;
      }
      
      // Ensure arrays exist
      const interestedInvestors = startup.interestedInvestors || [];
      const hiringInvestors = startup.hiringInvestors || [];
      
      const isInterested = interestedInvestors.includes(currentUser.uid);
      const isHiring = hiringInvestors.includes(currentUser.uid);
      
      console.log(`Current state - Interested: ${isInterested}, Hiring: ${isHiring}`);
      console.log('Startup data:', startup);
      
      if (type === 'investment') {
        if (isInterested) {
          console.log('Removing investment interest');
          await updateDoc(startupRef, {
            interestedInvestors: arrayRemove(currentUser.uid)
          });
        } else {
          console.log('Adding investment interest');
          await updateDoc(startupRef, {
            interestedInvestors: arrayUnion(currentUser.uid)
          });
        }
      } else {
        if (isHiring) {
          console.log('Removing hiring interest');
          await updateDoc(startupRef, {
            hiringInvestors: arrayRemove(currentUser.uid)
          });
        } else {
          console.log('Adding hiring interest');
          await updateDoc(startupRef, {
            hiringInvestors: arrayUnion(currentUser.uid)
          });
        }
      }
      
      console.log('Interest updated successfully, refreshing data...');
      // Refresh startups data
      await fetchData();
    } catch (error: any) {
      console.error('Error updating interest:', error);
      alert(`Error updating interest: ${error.message}`);
    }
  };

  const handleCommentSubmit = async (startupId: string, comment: string, type: 'investment' | 'hiring' | 'general') => {
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    
    if (!startupId) {
      console.error('No startup ID provided');
      alert('Error: No startup ID provided');
      return;
    }
    
    try {
      console.log(`Submitting comment for startup ${startupId}: ${comment}`);
      
      const newComment: Omit<Comment, 'id'> = {
        investorId: currentUser.uid,
        investorName: currentUser.displayName || currentUser.email,
        startupId,
        comment,
        timestamp: new Date(),
        type
      };
      
      console.log('Adding comment to Firestore:', newComment);
      await addDoc(collection(db, 'comments'), newComment);
      
      console.log('Comment added successfully, refreshing data...');
      // Refresh comments data
      await fetchData();
      
      alert('Comment submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      alert(`Error submitting comment: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading investor dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Investor Dashboard
            </h1>
            <p className="text-xl text-white/80">
              Welcome, {currentUser?.email}. Discover and invest in promising startups.
            </p>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <Building className="text-white mx-auto mb-4" size={32} />
              <h3 className="text-3xl font-bold text-white mb-2">{startups.length}</h3>
              <p className="text-white/70">Total Startups</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <TrendingUp className="text-white mx-auto mb-4" size={32} />
              <h3 className="text-3xl font-bold text-white mb-2">
                {startups.reduce((acc, s) => acc + s.interestedInvestors.length, 0)}
              </h3>
              <p className="text-white/70">Investment Interests</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <Award className="text-white mx-auto mb-4" size={32} />
              <h3 className="text-3xl font-bold text-white mb-2">
                {startups.reduce((acc, s) => acc + s.hiringInvestors.length, 0)}
              </h3>
              <p className="text-white/70">Hiring Requests</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <Filter className="text-white mx-auto mb-4" size={32} />
              <h3 className="text-3xl font-bold text-white mb-2">
                {Array.from(new Set(startups.map(s => s.sector))).length}
              </h3>
              <p className="text-white/70">Sectors</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Startups Section - Using the same component as main page */}
      <StartupsSection 
        isInvestorView={true}
        startups={startups}
        onInterestClick={handleInterest}
        onCommentSubmit={handleCommentSubmit}
        currentUser={currentUser}
        comments={comments}
      />
    </div>
  );
};

export default InvestorDashboard; 