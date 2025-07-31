import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const CommentTest: React.FC = () => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [type, setType] = useState<'investment' | 'hiring' | 'general'>('general');
  const [status, setStatus] = useState('');

  const testCommentSubmission = async () => {
    if (!currentUser) {
      setStatus('Error: No user logged in');
      return;
    }

    if (!comment.trim()) {
      setStatus('Error: Please enter a comment');
      return;
    }

    try {
      setStatus('Submitting comment...');
      
      const newComment = {
        investorId: currentUser.uid,
        investorName: currentUser.displayName || currentUser.email,
        startupId: 'test-startup-id',
        comment: comment.trim(),
        timestamp: new Date(),
        type: type
      };

      console.log('Submitting comment:', newComment);
      
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      
      setStatus(`Success! Comment added with ID: ${docRef.id}`);
      setComment('');
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Comment Submission Test</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Test Comment Submission</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Comment Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#e86888]"
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <option value="general" style={{ backgroundColor: '#1f2937', color: 'white' }}>General Comment</option>
                <option value="investment" style={{ backgroundColor: '#1f2937', color: 'white' }}>Investment Related</option>
                <option value="hiring" style={{ backgroundColor: '#1f2937', color: 'white' }}>Hiring Related</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Comment Text:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your test comment..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#e86888] resize-none"
                rows={4}
              />
            </div>
            
            <button
              onClick={testCommentSubmission}
              className="w-full py-3 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Test Comment Submission
            </button>
          </div>
        </div>
        
        {status && (
          <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 ${
            status.includes('Error') ? 'border border-red-500/50' : 'border border-green-500/50'
          }`}>
            <h3 className="text-lg font-semibold mb-2">Status:</h3>
            <p className={status.includes('Error') ? 'text-red-300' : 'text-green-300'}>
              {status}
            </p>
          </div>
        )}
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Debug Information:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-white/60">Current User:</span> {currentUser?.email || 'Not logged in'}
            </div>
            <div>
              <span className="text-white/60">User ID:</span> {currentUser?.uid || 'N/A'}
            </div>
            <div>
              <span className="text-white/60">Display Name:</span> {currentUser?.displayName || 'N/A'}
            </div>
            <div>
              <span className="text-white/60">Comment Type:</span> {type}
            </div>
            <div>
              <span className="text-white/60">Comment Length:</span> {comment.length} characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentTest; 