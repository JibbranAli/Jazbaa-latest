import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const CommentDebug: React.FC = () => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log('Fetching comments from Firestore...');
      
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const commentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Comment doc:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || data.timestamp || new Date()
        };
      });
      
      console.log('Fetched comments:', commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTestComment = async () => {
    try {
      const testComment = {
        investorId: currentUser?.uid || 'test-user',
        investorName: currentUser?.email || 'test@example.com',
        startupId: 'test-startup-123',
        comment: `Test comment from ${new Date().toLocaleString()}`,
        timestamp: new Date(),
        type: 'general'
      };
      
      console.log('Adding test comment:', testComment);
      const docRef = await addDoc(collection(db, 'comments'), testComment);
      console.log('Comment added with ID:', docRef.id);
      
      await fetchComments();
      alert('Test comment added successfully!');
    } catch (error) {
      console.error('Error adding test comment:', error);
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Comment Debug Tool</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          <div className="flex gap-4">
            <button
              onClick={fetchComments}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Comments'}
            </button>
            <button
              onClick={addTestComment}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Add Test Comment
            </button>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
          {comments.length === 0 ? (
            <p className="text-white/60">No comments found.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-semibold">{comment.investorName}</h4>
                      <p className="text-white/60 text-sm">Startup: {comment.startupId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      comment.type === 'investment' ? 'bg-green-500/20 text-green-400' :
                      comment.type === 'hiring' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {comment.type}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm mb-2">{comment.comment}</p>
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>ID: {comment.id}</span>
                    <span>{new Date(comment.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Raw Data</h3>
          <pre className="text-white/80 text-xs bg-black/20 p-3 rounded-md overflow-auto max-h-60">
            {JSON.stringify(comments, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CommentDebug; 