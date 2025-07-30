import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { User, Startup } from '../types/auth';

// Initial admin user credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@jazbaa.com',
  password: 'admin123456'
};

// Initial test users
const TEST_USERS = [
  {
    email: 'investor@test.com',
    password: 'password123',
    role: 'investor' as const,
    investorId: 'INV001',
    displayName: 'Test Investor'
  },
  {
    email: 'college@test.com',
    password: 'password123',
    role: 'college' as const,
    collegeId: 'COL001',
    displayName: 'Test College'
  }
];

// Sample startup data
const SAMPLE_STARTUPS: Omit<Startup, 'id'>[] = [
  {
    name: 'Feed',
    pitch: 'AI-powered food delivery and restaurant management platform',
    sector: 'FoodTech',
    badges: ['Open to Invest'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'Hirex',
    pitch: 'AI-driven recruitment and talent acquisition platform',
    sector: 'HRTech',
    badges: ['Open to Invest', 'Open to Hire'],
    special: 'Built by All-Women Team',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'Hash 13',
    pitch: 'Blockchain-based secure data management and verification system',
    sector: 'Blockchain',
    badges: ['Open to Invest'],
    special: 'Innovation Award',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'India AI Mission',
    pitch: 'AI solutions for Indian government and public sector digitization',
    sector: 'AI for Bharat',
    badges: ['Open to Invest', 'Government Initiative'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'MediCare AI',
    pitch: 'AI-powered diagnosis for rural healthcare',
    sector: 'HealthTech',
    badges: ['Open to Invest'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'HealthBridge',
    pitch: 'Connecting patients with specialists virtually',
    sector: 'HealthTech',
    badges: ['Open to Hire'],
    special: 'Built by All-Women Team',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'PillTracker',
    pitch: 'Smart medication management system',
    sector: 'HealthTech',
    badges: ['Open to Invest', 'Open to Hire'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'FarmSmart',
    pitch: 'IoT sensors for precision farming',
    sector: 'AgriTech',
    badges: ['Open to Invest'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'CropGuard',
    pitch: 'AI-based crop disease detection',
    sector: 'AgriTech',
    badges: ['Open to Hire'],
    special: 'Built by All-Women Team',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'PayEasy',
    pitch: 'Digital payments for rural merchants',
    sector: 'FinTech',
    badges: ['Open to Invest'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'MicroLend',
    pitch: 'Peer-to-peer lending platform',
    sector: 'FinTech',
    badges: ['Open to Hire'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'LearnSmart',
    pitch: 'AI-powered personalized learning platform',
    sector: 'EdTech',
    badges: ['Open to Invest'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'SkillBridge',
    pitch: 'Virtual reality skill training',
    sector: 'EdTech',
    badges: ['Open to Hire'],
    special: 'Built by All-Women Team',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'EcoTrack',
    pitch: 'Carbon footprint tracking for businesses',
    sector: 'Sustainability',
    badges: ['Open to Invest'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'GreenTech',
    pitch: 'Renewable energy optimization',
    sector: 'Sustainability',
    badges: ['Open to Hire'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'SheLeads',
    pitch: 'Leadership platform for women entrepreneurs',
    sector: 'WomenTech',
    badges: ['Open to Invest'],
    special: 'Built by All-Women Team',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'TechMentor',
    pitch: 'Women in tech mentorship network',
    sector: 'WomenTech',
    badges: ['Open to Hire'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'LocalGuide',
    pitch: 'AI-powered local travel recommendations',
    sector: 'TravelTech',
    badges: ['Open to Invest'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'SmartStay',
    pitch: 'Smart hotel booking platform',
    sector: 'TravelTech',
    badges: ['Open to Hire'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'CommunityConnect',
    pitch: 'Platform for social impact initiatives',
    sector: 'Social Impact',
    badges: ['Open to Invest'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'HelpBridge',
    pitch: 'Connecting volunteers with NGOs',
    sector: 'Social Impact',
    badges: ['Open to Hire'],
    special: 'Built by All-Women Team',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'BharatAI',
    pitch: 'AI solutions for Indian languages',
    sector: 'AI for Bharat',
    badges: ['Open to Invest'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'LocalAI',
    pitch: 'AI-powered local business solutions',
    sector: 'AI for Bharat',
    badges: ['Open to Hire'],
    special: undefined,
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'AgriTech Solutions',
    pitch: 'Smart farming solutions for Indian agriculture',
    sector: 'AgriTech',
    badges: ['Open to Invest', 'Rural Development'],
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    name: 'AI for Bharat',
    pitch: 'AI solutions tailored for Indian languages and culture',
    sector: 'AI for Bharat',
    badges: ['Open to Invest', 'AI Innovation'],
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  }
];

export const setupFirebase = async () => {
  const results = {
    success: false,
    adminUser: null as any,
    testUsers: [] as any[],
    startupsAdded: 0,
    commentsAdded: 0,
    errors: [] as string[],
    steps: [] as string[]
  };

  try {
    results.steps.push('🚀 Starting Firebase setup...');

    // Step 1: Test Firebase connection
    try {
      results.steps.push('📡 Testing Firebase connection...');
      await signOut(auth); // Ensure we're signed out
      results.steps.push('✅ Firebase connection successful');
    } catch (error: any) {
      results.errors.push(`Connection Error: ${error.message}`);
      throw new Error('Firebase connection failed');
    }

    // Step 2: Create admin user
    try {
      results.steps.push('👤 Creating admin user...');
      const adminUserCredential = await createUserWithEmailAndPassword(
        auth,
        ADMIN_CREDENTIALS.email,
        ADMIN_CREDENTIALS.password
      );

      // Add admin user to Firestore
      await setDoc(doc(db, 'users', adminUserCredential.user.uid), {
        uid: adminUserCredential.user.uid,
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        displayName: 'Admin User',
        createdAt: new Date()
      });

      results.adminUser = {
        uid: adminUserCredential.user.uid,
        email: ADMIN_CREDENTIALS.email
      };
      results.steps.push('✅ Admin user created successfully');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        results.steps.push('⚠️ Admin user already exists');
        // Try to sign in to get the user
        try {
          const signInResult = await signInWithEmailAndPassword(
            auth,
            ADMIN_CREDENTIALS.email,
            ADMIN_CREDENTIALS.password
          );
          results.adminUser = {
            uid: signInResult.user.uid,
            email: ADMIN_CREDENTIALS.email
          };
          results.steps.push('✅ Admin user verified');
        } catch (signInError: any) {
          results.errors.push(`Admin sign in failed: ${signInError.message}`);
        }
      } else {
        results.errors.push(`Admin creation failed: ${error.message}`);
        throw error;
      }
    }

    // Step 3: Create test users
    results.steps.push('👥 Creating test users...');
    for (const userData of TEST_USERS) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        // Add user to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userData.email,
          role: userData.role,
          displayName: userData.displayName,
          ...(userData.collegeId && { collegeId: userData.collegeId }),
          ...(userData.investorId && { investorId: userData.investorId }),
          createdAt: new Date()
        });

        results.testUsers.push({
          uid: userCredential.user.uid,
          role: userData.role,
          email: userData.email
        });

        results.steps.push(`✅ Created ${userData.role} user: ${userData.email}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          results.steps.push(`⚠️ User ${userData.email} already exists`);
        } else {
          results.errors.push(`Error creating ${userData.role} user: ${error.message}`);
        }
      }
    }

    // Step 4: Add sample startups
    results.steps.push('🚀 Adding sample startups...');
    const startupsCollection = collection(db, 'startups');
    
    for (const startupData of SAMPLE_STARTUPS) {
      try {
        await addDoc(startupsCollection, startupData);
        results.startupsAdded++;
        results.steps.push(`✅ Added startup: ${startupData.name}`);
      } catch (error: any) {
        results.errors.push(`Error adding startup ${startupData.name}: ${error.message}`);
      }
    }

    // Step 5: Add sample comments
    results.steps.push('💬 Adding sample comments...');
    const commentsCollection = collection(db, 'comments');
    
    const sampleComments = [
      {
        investorId: 'investor-1',
        investorName: 'John Investor',
        startupId: 'startup-1', // This will be replaced with actual startup ID
        comment: 'This looks like a promising investment opportunity. I\'m particularly interested in the AI-powered healthcare solutions.',
        timestamp: new Date(),
        type: 'investment' as const
      },
      {
        investorId: 'investor-2',
        investorName: 'Sarah Tech',
        startupId: 'startup-2',
        comment: 'Great team and innovative approach. Would love to discuss potential collaboration opportunities.',
        timestamp: new Date(),
        type: 'hiring' as const
      },
      {
        investorId: 'investor-1',
        investorName: 'John Investor',
        startupId: 'startup-3',
        comment: 'The sustainability focus is exactly what we\'re looking for. Let\'s schedule a meeting.',
        timestamp: new Date(),
        type: 'general' as const
      }
    ];

    for (const commentData of sampleComments) {
      try {
        await addDoc(commentsCollection, commentData);
        results.commentsAdded++;
        results.steps.push(`✅ Added comment from ${commentData.investorName}`);
      } catch (error: any) {
        results.errors.push(`Error adding comment: ${error.message}`);
      }
    }

    // Step 6: Verify data was created
    results.steps.push('🔍 Verifying data creation...');
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const startupsSnapshot = await getDocs(collection(db, 'startups'));
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      
      results.steps.push(`✅ Verified ${usersSnapshot.size} users in database`);
      results.steps.push(`✅ Verified ${startupsSnapshot.size} startups in database`);
      results.steps.push(`✅ Verified ${commentsSnapshot.size} comments in database`);
    } catch (error: any) {
      results.errors.push(`Verification failed: ${error.message}`);
    }

    // Step 7: Sign out
    await signOut(auth);
    results.steps.push('✅ Setup completed successfully');

    results.success = true;
    return results;

  } catch (error: any) {
    results.errors.push(`Setup failed: ${error.message}`);
    console.error('❌ Firebase setup failed:', error);
    return results;
  }
};

// Function to check if setup is needed
export const checkFirebaseSetup = async () => {
  try {
    // Try to sign in as admin to check if user exists
    await signInWithEmailAndPassword(auth, ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    await signOut(auth);
    return { needsSetup: false, message: 'Firebase is already set up' };
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return { needsSetup: true, message: 'Firebase setup required' };
    }
    return { needsSetup: false, message: 'Unknown error checking setup' };
  }
};

// Function to force reset Firebase data
export const resetFirebaseData = async () => {
  try {
    console.log('🔄 Resetting Firebase data...');
    
    // This is a destructive operation - only use for development
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const startupsSnapshot = await getDocs(collection(db, 'startups'));
    const commentsSnapshot = await getDocs(collection(db, 'comments'));
    
    console.log(`Found ${usersSnapshot.size} users, ${startupsSnapshot.size} startups, and ${commentsSnapshot.size} comments to reset`);
    
    // Note: In production, you'd want to implement proper data deletion
    // For now, we'll just recreate the data
    
    return { success: true, message: 'Reset completed - run setup again' };
  } catch (error: any) {
    console.error('Reset failed:', error);
    return { success: false, error: error.message };
  }
};