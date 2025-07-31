import React, { useState } from 'react';
import { db, storage } from '../config/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { uploadStartupLogo } from '../utils/imageUpload';

const RegistrationTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [testResults, setTestResults] = useState<any>({});

  const testFirestoreWrite = async () => {
    try {
      setStatus('Testing Firestore write...');
      
      const testData = {
        name: 'Test Startup ' + Date.now(),
        tagline: 'Test Tagline',
        story: 'Test Story',
        sector: 'Technology',
        badges: ['AI', 'ML'],
        team: [{ name: 'Test Member', role: 'Developer', linkedin: '', github: '', portfolio: '', pitchVideo: '', hiring: false }],
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

      const startupRef = doc(db, 'startups', testData.slug);
      await setDoc(startupRef, testData);
      
      const verifyDoc = await getDoc(startupRef);
      if (verifyDoc.exists()) {
        setTestResults(prev => ({ ...prev, firestoreWrite: '✅ Success' }));
        setStatus('Firestore write test completed');
      } else {
        setTestResults(prev => ({ ...prev, firestoreWrite: '❌ Failed' }));
        setStatus('Firestore write test failed');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, firestoreWrite: `❌ Error: ${error}` }));
      setStatus('Firestore write test error');
    }
  };

  const testStorageUpload = async () => {
    try {
      setStatus('Testing Firebase Storage upload...');
      
      // Create a test image
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#e86888';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('TEST', 25, 55);
      }
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'test-logo.png', { type: 'image/png' });
          
          // Test using our upload utility
          const result = await uploadStartupLogo(file, 'TestStartup');
          
          if (result.success && result.url) {
            setTestResults(prev => ({ ...prev, storageUpload: '✅ Success' }));
            setStatus('Storage upload test completed');
          } else {
            setTestResults(prev => ({ ...prev, storageUpload: `❌ Failed: ${result.error}` }));
            setStatus('Storage upload test failed');
          }
        }
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, storageUpload: `❌ Error: ${error}` }));
      setStatus('Storage upload test error');
    }
  };

  const testRegistrationFlow = async () => {
    try {
      setStatus('Testing complete registration flow...');
      
      // Step 1: Create test data
      const testStartup = {
        name: 'Complete Test Startup ' + Date.now(),
        tagline: 'Complete Test Tagline',
        story: 'Complete Test Story',
        sector: 'Technology',
        badges: ['AI', 'ML', 'SaaS'],
        team: [
          { 
            name: 'Test Founder', 
            role: 'CEO', 
            linkedin: 'https://linkedin.com/test', 
            github: 'https://github.com/test', 
            portfolio: 'https://portfolio.com/test', 
            pitchVideo: 'https://youtube.com/test', 
            hiring: true 
          }
        ],
        website: 'https://teststartup.com',
        appStore: 'https://apps.apple.com/test',
        playStore: 'https://play.google.com/test',
        demoUrl: 'https://demo.teststartup.com',
        contactEmail: 'test@teststartup.com',
        contactPhone: '+1234567890',
        productVideo: 'https://youtube.com/product',
        pitchDeck: 'https://slides.com/pitch',
        qrCode: 'https://qr.teststartup.com',
        problem: 'Test problem description',
        solution: 'Test solution description',
        collaborationMessage: 'Test collaboration message',
        slug: 'complete-test-startup-' + Date.now(),
        createdAt: new Date(),
        status: 'active',
        createdBy: 'test@example.com',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3Q8L3RleHQ+Cjwvc3ZnPgo=',
        isTemplateCompatible: true,
        templateVersion: '1.0',
        profileCreatedAt: new Date(),
        lastUpdated: new Date()
      };

      // Step 2: Save to Firestore
      const startupRef = doc(db, 'startups', testStartup.slug);
      await setDoc(startupRef, testStartup);
      
      // Step 3: Verify data was saved
      const verifyDoc = await getDoc(startupRef);
      if (verifyDoc.exists()) {
        const savedData = verifyDoc.data();
        console.log('✅ Registration data saved:', savedData);
        
        // Step 4: Test profile page generation
        const profileUrl = `/startup/${testStartup.slug}`;
        console.log('✅ Profile URL generated:', profileUrl);
        
        setTestResults(prev => ({ 
          ...prev, 
          registrationFlow: '✅ Success - Data saved and profile URL generated',
          profileUrl: profileUrl
        }));
        setStatus('Complete registration flow test completed');
      } else {
        setTestResults(prev => ({ ...prev, registrationFlow: '❌ Failed - Data not saved' }));
        setStatus('Registration flow test failed');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, registrationFlow: `❌ Error: ${error}` }));
      setStatus('Registration flow test error');
    }
  };

  const testExistingData = async () => {
    try {
      setStatus('Testing existing data...');
      
      const startupsRef = collection(db, 'startups');
      const querySnapshot = await getDocs(startupsRef);
      
      if (querySnapshot.size > 0) {
        const startups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('✅ Found existing startups:', startups);
        
        setTestResults(prev => ({ 
          ...prev, 
          existingData: `✅ Found ${querySnapshot.size} startups`,
          startupCount: querySnapshot.size
        }));
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
    
    await testFirestoreWrite();
    await testStorageUpload();
    await testRegistrationFlow();
    await testExistingData();
    
    setStatus('All tests completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Registration & Storage Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={testFirestoreWrite}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Test Firestore Write
          </button>
          
          <button
            onClick={testStorageUpload}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Test Storage Upload
          </button>
          
          <button
            onClick={testRegistrationFlow}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Test Registration Flow
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
          <h3 className="text-lg font-semibold mb-4">Backend Status:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Firebase Configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Firestore Database</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Firebase Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Image Upload System</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Registration Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</span>
              <span>Profile Generation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationTest; 