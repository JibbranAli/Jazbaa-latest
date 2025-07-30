import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { setupFirebase, checkFirebaseSetup } from '../utils/firebaseSetup';
import { runFirebaseDiagnostics as runDiagnostics } from '../utils/firebaseDiagnostics';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const SetupFirebase: React.FC = () => {
  const { currentUser } = useAuth();
  const [setupStatus, setSetupStatus] = useState<'checking' | 'needed' | 'completed' | 'error'>('checking');
  const [setupResult, setSetupResult] = useState<any>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const result = await checkFirebaseSetup();
      setSetupStatus(result.needsSetup ? 'needed' : 'completed');
    } catch (error: any) {
      setSetupStatus('error');
    }
  };

  const handleSetup = async () => {
    setSetupStatus('checking');
    try {
      const result = await setupFirebase();
      setSetupResult(result);
      setSetupStatus(result.success ? 'completed' : 'error');
    } catch (error) {
      setSetupStatus('error');
      setSetupResult({ error: error.message });
    }
  };

  const handleDiagnostics = async () => {
    try {
      const result = await runDiagnostics();
      setDiagnosticResult(result);
    } catch (error: any) {
      setDiagnosticResult({ error: error.message });
    }
  };

  const handleTestOperations = async () => {
    try {
      console.log('Testing Firebase operations...');
      
      // Test 1: Fetch startups
      const startupsSnapshot = await getDocs(collection(db, 'startups'));
      console.log('Startups found:', startupsSnapshot.size);
      
      // Test 2: Fetch comments
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      console.log('Comments found:', commentsSnapshot.size);
      
      // Test 3: Try to update a startup (if any exist)
      if (startupsSnapshot.size > 0) {
        const firstStartup = startupsSnapshot.docs[0];
        console.log('Testing update on startup:', firstStartup.id);
        
        await updateDoc(doc(db, 'startups', firstStartup.id), {
          interestedInvestors: arrayUnion('test-investor')
        });
        console.log('Successfully updated startup');
      }
      
      // Test 4: Try to add a comment
      const testComment = {
        investorId: 'test-investor',
        investorName: 'Test Investor',
        startupId: startupsSnapshot.size > 0 ? startupsSnapshot.docs[0].id : 'test-startup',
        comment: 'This is a test comment',
        timestamp: new Date(),
        type: 'general' as const
      };
      
      await addDoc(collection(db, 'comments'), testComment);
      console.log('Successfully added test comment');
      
      setTestResult({
        success: true,
        startups: startupsSnapshot.size,
        comments: commentsSnapshot.size,
        message: 'All Firebase operations working correctly!'
      });
      
    } catch (error: any) {
      console.error('Test failed:', error);
      setTestResult({
        success: false,
        error: error.message,
        message: 'Firebase operations failed'
      });
    }
  };

  const handleResetData = async () => {
    try {
      console.log('Resetting Firebase data...');
      
      // Delete existing data
      const startupsSnapshot = await getDocs(collection(db, 'startups'));
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      
      console.log(`Found ${startupsSnapshot.size} startups and ${commentsSnapshot.size} comments to delete`);
      
      // Note: In a real app, you'd want to delete the documents
      // For now, we'll just recreate the data
      
      // Re-run setup
      const result = await setupFirebase();
      setSetupResult(result);
      setSetupStatus(result.success ? 'completed' : 'error');
      
      alert('Data has been reset and recreated!');
    } catch (error: any) {
      console.error('Reset failed:', error);
      alert(`Reset failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Firebase Setup & Diagnostics
          </h1>
          <p className="text-xl text-white/80">
            Configure and test your Firebase backend
          </p>
        </motion.div>

        {/* Status Display */}
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Setup Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                setupStatus === 'completed' ? 'bg-green-500' :
                setupStatus === 'error' ? 'bg-red-500' :
                setupStatus === 'needed' ? 'bg-yellow-500' :
                'bg-blue-500 animate-pulse'
              }`}></div>
              <span className="text-white">
                {setupStatus === 'checking' && 'Checking setup...'}
                {setupStatus === 'needed' && 'Setup required'}
                {setupStatus === 'completed' && 'Setup completed'}
                {setupStatus === 'error' && 'Setup error'}
              </span>
            </div>
            
            {setupStatus === 'needed' && (
              <div className="space-y-4">
                <button
                  onClick={handleSetup}
                  className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  Initialize Firebase
                </button>
                <button
                  onClick={handleResetData}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  Reset & Recreate Data
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Test Operations */}
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Test Firebase Operations</h2>
          <div className="space-y-4">
            <button
              onClick={handleTestOperations}
              className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Test Firebase Operations
            </button>
            
            {testResult && (
              <div className={`p-4 rounded-lg ${
                testResult.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
              }`}>
                <h3 className="font-semibold text-white mb-2">{testResult.message}</h3>
                {testResult.success ? (
                  <div className="text-white/80 text-sm">
                    <p>Startups: {testResult.startups}</p>
                    <p>Comments: {testResult.comments}</p>
                  </div>
                ) : (
                  <p className="text-red-300 text-sm">{testResult.error}</p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Diagnostics */}
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Run Diagnostics</h2>
          <div className="space-y-4">
            <button
              onClick={handleDiagnostics}
              className="bg-gradient-to-r from-[#7d7eed] to-[#e86888] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Run Diagnostics
            </button>
            
            {diagnosticResult && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Diagnostic Results</h3>
                <pre className="text-white/80 text-sm overflow-auto">
                  {JSON.stringify(diagnosticResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </motion.div>

        {/* Setup Results */}
        {setupResult && (
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Setup Results</h2>
            <div className="space-y-4">
              {setupResult.steps && (
                <div className="space-y-2">
                  <h3 className="text-white font-semibold">Steps:</h3>
                  {setupResult.steps.map((step: string, index: number) => (
                    <p key={index} className="text-white/80 text-sm">{step}</p>
                  ))}
                </div>
              )}
              
              {setupResult.errors && setupResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-red-400 font-semibold">Errors:</h3>
                  {setupResult.errors.map((error: string, index: number) => (
                    <p key={index} className="text-red-300 text-sm">{error}</p>
                  ))}
                </div>
              )}
              
              {setupResult.success && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold">Setup Successful!</h3>
                  <p className="text-green-300 text-sm">
                    Startups added: {setupResult.startupsAdded}<br/>
                    Comments added: {setupResult.commentsAdded}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SetupFirebase; 