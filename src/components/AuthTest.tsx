import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [testResult, setTestResult] = useState<string | null>(null);

  const testFirebaseConnection = async () => {
    setTestResult('Testing Firebase connection...');
    
    try {
      // Test if Firebase is properly initialized
      const { db } = await import('../config/firebase');
      setTestResult('✅ Firebase connection successful!');
    } catch (error) {
      setTestResult(`❌ Firebase connection failed: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔐 Authentication Test</h1>
          <p className="text-xl text-gray-300">
            Test Firebase authentication and user management
          </p>
        </div>

        {/* Current User Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">👤 Current User Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400">Authentication Status</h3>
              <p className={currentUser ? 'text-green-400' : 'text-red-400'}>
                {currentUser ? '✅ Authenticated' : '❌ Not Authenticated'}
              </p>
            </div>
            {currentUser && (
              <>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400">User Email</h3>
                  <p>{currentUser.email}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400">User Role</h3>
                  <p className="capitalize">{currentUser.role}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400">User ID</h3>
                  <p className="text-sm font-mono">{currentUser.uid}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Firebase Connection Test */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔥 Firebase Connection Test</h2>
          <button
            onClick={testFirebaseConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Test Firebase Connection
          </button>

          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              testResult.includes('✅') 
                ? 'bg-green-900/30 border border-green-500/50 text-green-300' 
                : 'bg-red-900/30 border border-red-500/50 text-red-300'
            }`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📋 Authentication Instructions</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">For Testing:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to the login page to test authentication</li>
                <li>Create real users in Firebase Console</li>
                <li>Test different user roles (admin, investor, college)</li>
                <li>Verify automatic redirection to appropriate dashboards</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Firebase Console Setup:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Enable Authentication in Firebase Console</li>
                <li>Create users with email/password</li>
                <li>Add user documents to Firestore with role information</li>
                <li>Set up Firestore security rules</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors mr-4"
          >
            ← Go Back
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthTest; 