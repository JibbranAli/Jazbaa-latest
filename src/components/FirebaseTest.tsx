import React, { useState } from 'react';
import { db, storage } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FirebaseTest: React.FC = () => {
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
      
      // Create a simple test image (1x1 pixel PNG)
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

  const runAllTests = async () => {
    setStatus('Running all tests...');
    setTestResults({});
    
    await testFirestore();
    await testStorage();
    
    setStatus('All tests completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Connectivity Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            onClick={runAllTests}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors"
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
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Test Results:</h3>
            <div className="space-y-2">
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="flex justify-between items-center">
                  <span className="capitalize">{test}:</span>
                  <span className={result.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                    {result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseTest; 