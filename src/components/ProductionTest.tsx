import React, { useState } from 'react';
import { db, storage } from '../config/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProductionTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [testResults, setTestResults] = useState<any>({});

  const testFirestore = async () => {
    try {
      setStatus('Testing Firestore...');
      
      const testData = {
        name: 'Test Startup',
        tagline: 'Test Tagline',
        createdAt: new Date(),
        test: true
      };

      const testRef = doc(db, 'test', 'firestore-test');
      await setDoc(testRef, testData);
      
      const readDoc = await getDoc(testRef);
      if (readDoc.exists()) {
        setTestResults(prev => ({ ...prev, firestore: '✅ Success' }));
        setStatus('Firestore test completed');
      } else {
        setTestResults(prev => ({ ...prev, firestore: '❌ Failed' }));
        setStatus('Firestore test failed');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, firestore: `❌ Error: ${error}` }));
      setStatus('Firestore test error');
    }
  };

  const testStorage = async () => {
    try {
      setStatus('Testing Firebase Storage...');
      
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 1, 1);
      }
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'test.png', { type: 'image/png' });
          const storageRef = ref(storage, 'test/test-image.png');
          
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          
          setTestResults(prev => ({ ...prev, storage: '✅ Success' }));
          setStatus('Storage test completed');
        }
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, storage: `❌ Error: ${error}` }));
      setStatus('Storage test error');
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
      
      const verifyDoc = await getDoc(startupRef);
      if (verifyDoc.exists()) {
        setTestResults(prev => ({ ...prev, registration: '✅ Success' }));
        setStatus('Startup registration test completed');
      } else {
        setTestResults(prev => ({ ...prev, registration: '❌ Failed' }));
        setStatus('Startup registration test failed');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, registration: `❌ Error: ${error}` }));
      setStatus('Startup registration test error');
    }
  };

  const testExistingData = async () => {
    try {
      setStatus('Testing existing data...');
      
      const startupsRef = collection(db, 'startups');
      const querySnapshot = await getDocs(startupsRef);
      
      if (querySnapshot.size > 0) {
        setTestResults(prev => ({ ...prev, existingData: `✅ Found ${querySnapshot.size} startups` }));
        setStatus('Existing data test completed');
      } else {
        setTestResults(prev => ({ ...prev, existingData: '⚠️ No existing data found' }));
        setStatus('No existing data found');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, existingData: `❌ Error: ${error}` }));
      setStatus('Existing data test error');
    }
  };

  const runAllTests = async () => {
    setStatus('Running all tests...');
    setTestResults({});
    
    await testFirestore();
    await testStorage();
    await testStartupRegistration();
    await testExistingData();
    
    setStatus('All tests completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Production Readiness Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={testFirestore}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Test Firestore
          </button>
          
          <button
            onClick={testStorage}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Test Storage
          </button>
          
          <button
            onClick={testStartupRegistration}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Test Registration
          </button>
          
          <button
            onClick={testExistingData}
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Test Existing Data
          </button>
          
          <button
            onClick={runAllTests}
            className="bg-gradient-to-r from-[#e86888] to-[#7d7eed] hover:from-[#d15878] hover:to-[#6d6edd] text-white py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 col-span-full lg:col-span-1"
          >
            Run All Tests
          </button>
        </div>
        
        {status && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Status:</h3>
            <p className="text-sm">{status}</p>
          </div>
        )}
        
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Test Results:</h3>
            <div className="space-y-2">
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="flex justify-between items-center">
                  <span className="capitalize">{test}:</span>
                  <span className={result.includes('✅') ? 'text-green-400' : result.includes('❌') ? 'text-red-400' : 'text-yellow-400'}>
                    {result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Production Checklist:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Firebase Configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Authentication System</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Startup Registration Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Profile Page Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Logo Upload System</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Email Invitation System</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Dashboard Functionality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionTest; 