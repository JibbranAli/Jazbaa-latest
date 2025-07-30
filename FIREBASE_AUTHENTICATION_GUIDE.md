# Firebase Authentication Implementation Guide

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `jazbaa-4-0`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 1.3 Create Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 2: Get Firebase Configuration

### 2.1 Get Web App Configuration
1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register app with name: `jazbaa-web-app`
6. Copy the configuration object

### 2.2 Update Firebase Config
Replace the placeholder in `src/config/firebase.ts` with your actual config:

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Step 3: Update Authentication Context

### 3.1 Replace Dummy Data with Firebase
Update `src/contexts/AuthContext.tsx` to use real Firebase authentication:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, collegeId?: string, investorId?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              ...userDoc.data()
            } as User);
          } else {
            // User exists in Auth but not in Firestore
            console.error('User data not found in Firestore');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, role: UserRole, collegeId?: string, investorId?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    const userData: Partial<User> = {
      uid: user.uid,
      email: user.email!,
      role,
      ...(collegeId && { collegeId }),
      ...(investorId && { investorId })
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Step 4: Update Login Component

### 4.1 Remove Dummy Data Dependencies
Update `src/components/auth/Login.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      redirectBasedOnRole(currentUser.role);
    }
  }, [currentUser]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'investor':
        navigate('/investor-dashboard');
        break;
      case 'college':
        navigate('/college-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'Failed to log in');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div 
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Don't have an account? Contact admin to get registered.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
```

## Step 5: Create Firestore Security Rules

### 5.1 Set Up Security Rules
In Firebase Console, go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all users
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Startups - read based on role
    match /startups/{startupId} {
      // Investors can read all startups
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'investor';
      
      // Colleges can only read their own startups
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'college' &&
        resource.data.collegeId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.collegeId;
      
      // Admin can read all startups
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Investment interests
    match /investorInterests/{interestId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Create Initial Users

### 6.1 Create Admin User
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter admin email and password
4. Go to Firestore Database
5. Create document in `users` collection with ID matching the user's UID:

```json
{
  "uid": "admin-uid-from-auth",
  "email": "admin@jazbaa.com",
  "role": "admin",
  "displayName": "Admin User"
}
```

### 6.2 Create Test Users
Create similar documents for test users:

**Investor User:**
```json
{
  "uid": "investor-uid",
  "email": "investor@test.com",
  "role": "investor",
  "investorId": "INV001",
  "displayName": "Test Investor"
}
```

**College User:**
```json
{
  "uid": "college-uid",
  "email": "college@test.com",
  "role": "college",
  "collegeId": "COL001",
  "displayName": "Test College"
}
```

## Step 7: Update Dashboard Components

### 7.1 Update Investor Dashboard
Replace dummy data calls with Firebase queries in `src/components/dashboard/InvestorDashboard.tsx`:

```typescript
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';

// In useEffect:
const fetchStartups = async () => {
  try {
    const startupsCollection = await getDocs(collection(db, 'startups'));
    const startupsData = startupsCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Startup[];
    setStartups(startupsData);
  } catch (error) {
    console.error('Error fetching startups:', error);
  } finally {
    setLoading(false);
  }
};

// Update handleInterest:
const handleInterest = async (startupId: string, type: 'investment' | 'hiring') => {
  if (!currentUser) return;
  
  try {
    const startupRef = doc(db, 'startups', startupId);
    const startup = startups.find(s => s.id === startupId);
    
    if (startup) {
      const isInterested = startup.interestedInvestors.includes(currentUser.uid);
      const isHiring = startup.hiringInvestors.includes(currentUser.uid);
      
      if (type === 'investment') {
        if (isInterested) {
          await updateDoc(startupRef, {
            interestedInvestors: arrayRemove(currentUser.uid)
          });
        } else {
          await updateDoc(startupRef, {
            interestedInvestors: arrayUnion(currentUser.uid)
          });
        }
      } else {
        if (isHiring) {
          await updateDoc(startupRef, {
            hiringInvestors: arrayRemove(currentUser.uid)
          });
        } else {
          await updateDoc(startupRef, {
            hiringInvestors: arrayUnion(currentUser.uid)
          });
        }
      }
      
      // Update local state
      fetchStartups();
    }
  } catch (error) {
    console.error('Error updating interest:', error);
  }
};
```

### 7.2 Update College Dashboard
Similar updates for `src/components/dashboard/CollegeDashboard.tsx`:

```typescript
// Filter startups by college
const fetchCollegeStartups = async () => {
  try {
    const startupsCollection = await getDocs(collection(db, 'startups'));
    const allStartups = startupsCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Startup[];
    
    // Filter by college ID
    const collegeStartups = allStartups.filter(
      startup => startup.collegeId === currentUser?.collegeId
    );
    setStartups(collegeStartups);
  } catch (error) {
    console.error('Error fetching college startups:', error);
  } finally {
    setLoading(false);
  }
};
```

### 7.3 Update Admin Dashboard
Update `src/components/dashboard/AdminDashboard.tsx`:

```typescript
// Fetch all data
const fetchData = async () => {
  try {
    const [startupsSnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, 'startups')),
      getDocs(collection(db, 'users'))
    ]);
    
    const startupsData = startupsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Startup[];
    
    const usersData = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    
    setStartups(startupsData);
    setUsers(usersData);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

// Add user function
const handleAddUser = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const userData = {
      email: newUser.email,
      role: newUser.role,
      ...(newUser.collegeId && { collegeId: newUser.collegeId }),
      ...(newUser.investorId && { investorId: newUser.investorId }),
      createdAt: new Date()
    };
    
    // Add to Firestore (you'll need to create the user in Auth first)
    const newUserRef = doc(collection(db, 'users'));
    await setDoc(newUserRef, userData);
    
    setUsers([...users, { ...userData, uid: newUserRef.id }]);
    setNewUser({ email: '', role: 'investor', collegeId: '', investorId: '' });
    setShowAddUser(false);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};
```

## Step 8: Environment Variables

### 8.1 Create .env file
Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 8.2 Update Firebase Config
Update `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Step 9: Testing

### 9.1 Test Authentication Flow
1. Start the development server: `npm run dev`
2. Try logging in with the admin credentials
3. Test role-based redirections
4. Test dashboard functionality
5. Test logout functionality

### 9.2 Test Security Rules
1. Try accessing data with different user roles
2. Verify that colleges can only see their startups
3. Verify that investors can see all startups
4. Verify that admin can see everything

## Step 10: Production Deployment

### 10.1 Update Security Rules
Before going to production, update Firestore rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // More restrictive rules for production
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only allow admin to create users
    }
    
    match /startups/{startupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 10.2 Environment Setup
1. Create production Firebase project
2. Update environment variables
3. Deploy with proper security rules
4. Test all functionality in production

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your domain is added to Firebase Auth authorized domains
2. **Permission Denied**: Check Firestore security rules
3. **User Not Found**: Ensure user document exists in Firestore
4. **Role-based Access**: Verify user role is correctly set in Firestore

### Debug Steps:
1. Check browser console for errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Verify user documents exist in Firestore
5. Test with different user roles

This completes the Firebase authentication implementation for all three roles! 🎉 