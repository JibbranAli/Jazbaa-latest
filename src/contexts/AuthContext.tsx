import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole } from '../types/auth';
import { getUserByEmail, dummyUsers } from '../services/dummyData';

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
        // For demo purposes, use dummy data
        const dummyUser = getUserByEmail(firebaseUser.email!);
        if (dummyUser) {
          setCurrentUser(dummyUser);
        } else {
          // Try to get user data from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                ...userDoc.data()
              } as User);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, check dummy data first
    const dummyUser = getUserByEmail(email);
    if (dummyUser) {
      // Simulate Firebase auth for dummy users
      setCurrentUser(dummyUser);
      return;
    }

    // Fallback to Firebase auth
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, role: UserRole, collegeId?: string, investorId?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
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
    setCurrentUser(null);
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
      {!loading && children}
    </AuthContext.Provider>
  );
}; 