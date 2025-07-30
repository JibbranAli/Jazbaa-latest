import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const runFirebaseDiagnostics = async () => {
  const diagnostics = {
    authEnabled: false,
    firestoreEnabled: false,
    authTest: false,
    firestoreTest: false,
    errors: [] as string[]
  };

  try {
    console.log('🔍 Running Firebase diagnostics...');

    // Test 1: Check if Auth is working
    try {
      console.log('Testing Firebase Auth...');
      // Try to create a test user (this will fail if auth is not enabled)
      const testEmail = `test-${Date.now()}@diagnostic.com`;
      const testPassword = 'test123456';
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Firebase Auth is working');
      diagnostics.authEnabled = true;
      diagnostics.authTest = true;
      
      // Clean up - delete the test user
      // Note: Firebase doesn't provide a direct way to delete users from client-side
      // The test user will remain but that's okay for diagnostics
      
    } catch (error: any) {
      console.error('❌ Firebase Auth test failed:', error);
      diagnostics.errors.push(`Auth Error: ${error.message}`);
      
      if (error.code === 'auth/operation-not-allowed') {
        diagnostics.errors.push('Email/Password authentication is not enabled in Firebase Console');
      } else if (error.code === 'auth/invalid-api-key') {
        diagnostics.errors.push('Invalid API key - check Firebase configuration');
      } else if (error.code === 'auth/network-request-failed') {
        diagnostics.errors.push('Network error - check internet connection');
      }
    }

    // Test 2: Check if Firestore is working
    try {
      console.log('Testing Firestore...');
      const testDocRef = doc(db, 'diagnostics', 'test');
      await setDoc(testDocRef, {
        timestamp: new Date(),
        test: true
      });
      
      const testDoc = await getDoc(testDocRef);
      if (testDoc.exists()) {
        console.log('✅ Firestore is working');
        diagnostics.firestoreEnabled = true;
        diagnostics.firestoreTest = true;
      }
      
    } catch (error: any) {
      console.error('❌ Firestore test failed:', error);
      diagnostics.errors.push(`Firestore Error: ${error.message}`);
      
      if (error.code === 'permission-denied') {
        diagnostics.errors.push('Firestore security rules are blocking access');
      } else if (error.code === 'unavailable') {
        diagnostics.errors.push('Firestore is not enabled in Firebase Console');
      }
    }

    // Test 3: Check project configuration
    try {
      console.log('Testing project configuration...');
      const projectId = db.app.options.projectId;
      console.log('✅ Project ID:', projectId);
      
      if (projectId !== 'jazbaa-4-0') {
        diagnostics.errors.push(`Project ID mismatch: expected 'jazbaa-4-0', got '${projectId}'`);
      }
      
    } catch (error: any) {
      console.error('❌ Project configuration test failed:', error);
      diagnostics.errors.push(`Configuration Error: ${error.message}`);
    }

    return diagnostics;

  } catch (error: any) {
    console.error('❌ Diagnostic failed:', error);
    diagnostics.errors.push(`General Error: ${error.message}`);
    return diagnostics;
  }
};

export const getSetupInstructions = (diagnostics: any) => {
  const instructions = [];
  
  if (!diagnostics.authEnabled) {
    instructions.push({
      title: 'Enable Firebase Authentication',
      steps: [
        'Go to Firebase Console (https://console.firebase.google.com)',
        'Select your project: jazbaa-4-0',
        'Click "Authentication" in the left sidebar',
        'Click "Get started"',
        'Go to "Sign-in method" tab',
        'Enable "Email/Password" provider',
        'Click "Save"'
      ]
    });
  }
  
  if (!diagnostics.firestoreEnabled) {
    instructions.push({
      title: 'Enable Firestore Database',
      steps: [
        'Go to Firebase Console (https://console.firebase.google.com)',
        'Select your project: jazbaa-4-0',
        'Click "Firestore Database" in the left sidebar',
        'Click "Create database"',
        'Choose "Start in test mode" (we\'ll add security rules later)',
        'Select a location (choose closest to your users)',
        'Click "Done"'
      ]
    });
  }
  
  if (diagnostics.errors.length > 0) {
    instructions.push({
      title: 'Fix Configuration Issues',
      steps: [
        'Check the error messages above',
        'Verify your Firebase project settings',
        'Ensure all services are properly enabled',
        'Check your internet connection',
        'Try refreshing the page and running setup again'
      ]
    });
  }
  
  return instructions;
}; 