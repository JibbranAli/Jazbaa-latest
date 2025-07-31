import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const RegistrationDebug: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [testData, setTestData] = useState({
    name: 'Test Startup',
    tagline: 'Test Tagline',
    story: 'Test Story',
    sector: 'Technology',
    badges: ['AI', 'ML'],
    team: []
  });

  const testFirebaseConnection = async () => {
    try {
      setStatus('Testing Firebase connection...');
      
      // Test writing data
      const testRef = doc(db, 'test', 'connection-test');
      await setDoc(testRef, {
        ...testData,
        createdAt: new Date(),
        test: true
      });
      
      // Test reading data
      const readDoc = await getDoc(testRef);
      if (readDoc.exists()) {
        setStatus('✅ Firebase connection successful! Data written and read successfully.');
        console.log('Test data:', readDoc.data());
      } else {
        setStatus('❌ Firebase connection failed - could not read data');
      }
    } catch (error) {
      setStatus(`❌ Firebase connection failed: ${error}`);
      console.error('Firebase test error:', error);
    }
  };

  const testStartupRegistration = async () => {
    try {
      setStatus('Testing startup registration...');
      
      const testStartup = {
        name: 'Test Startup ' + Date.now(),
        tagline: 'Test Tagline',
        story: 'Test Story',
        sector: 'Technology',
        badges: ['AI', 'ML'],
        team: [],
        slug: 'test-startup-' + Date.now(),
        createdAt: new Date(),
        status: 'active',
        createdBy: 'test@example.com',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3Q8L3RleHQ+Cjwvc3ZnPgo=',
        isTemplateCompatible: true,
        templateVersion: '1.0',
        profileCreatedAt: new Date(),
        lastUpdated: new Date()
      };

      const startupRef = doc(db, 'startups', testStartup.slug);
      await setDoc(startupRef, testStartup);
      
      // Verify the data was saved
      const verifyDoc = await getDoc(startupRef);
      if (verifyDoc.exists()) {
        setStatus('✅ Startup registration test successful! Data saved to Firebase.');
        console.log('Saved startup data:', verifyDoc.data());
      } else {
        setStatus('❌ Startup registration test failed - data not found after saving');
      }
    } catch (error) {
      setStatus(`❌ Startup registration test failed: ${error}`);
      console.error('Startup registration test error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Registration Debug Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
            <button
              onClick={testFirebaseConnection}
              className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Test Firebase Connection
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Registration Test</h2>
            <button
              onClick={testStartupRegistration}
              className="w-full bg-gradient-to-r from-[#7d7eed] to-[#e86888] text-white py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Test Startup Registration
            </button>
          </div>
        </div>
        
        {status && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Status:</h3>
            <p className="text-sm">{status}</p>
          </div>
        )}
        
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Test Firebase Connection" to verify basic Firebase connectivity</li>
            <li>Click "Test Startup Registration" to test the startup registration process</li>
            <li>Check the browser console for detailed logs</li>
            <li>If tests fail, check your Firebase configuration</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDebug; 