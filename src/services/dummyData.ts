import { User, Startup } from '../types/auth';

// Dummy users for testing
export const dummyUsers: User[] = [
  {
    uid: 'investor-1',
    email: 'investor@test.com',
    role: 'investor',
    investorId: 'INV001',
    displayName: 'Test Investor'
  },
  {
    uid: 'college-1',
    email: 'college@test.com',
    role: 'college',
    collegeId: 'COL001',
    displayName: 'Test College'
  },
  {
    uid: 'admin-1',
    email: 'admin@test.com',
    role: 'admin',
    displayName: 'Test Admin'
  }
];

// Dummy startups for testing
export const dummyStartups: Startup[] = [
  {
    id: 'startup-1',
    name: 'MediCare AI',
    pitch: 'AI-powered diagnosis for rural healthcare',
    sector: 'HealthTech',
    badges: ['Open to Invest'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: ['investor-1'],
    hiringInvestors: []
  },
  {
    id: 'startup-2',
    name: 'HealthBridge',
    pitch: 'Connecting patients with specialists virtually',
    sector: 'HealthTech',
    badges: ['Open to Hire'],
    special: 'Built by All-Women Team',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: ['investor-1']
  },
  {
    id: 'startup-3',
    name: 'PillTracker',
    pitch: 'Smart medication management system',
    sector: 'HealthTech',
    badges: ['Open to Invest', 'Open to Hire'],
    special: 'Flagship Startup',
    collegeId: 'COL001',
    createdBy: 'college-1',
    createdAt: new Date(),
    interestedInvestors: ['investor-1'],
    hiringInvestors: ['investor-1']
  },
  {
    id: 'startup-4',
    name: 'FarmSmart',
    pitch: 'IoT sensors for precision farming',
    sector: 'AgriTech',
    badges: ['Open to Invest'],
    collegeId: 'COL002',
    createdBy: 'college-2',
    createdAt: new Date(),
    interestedInvestors: [],
    hiringInvestors: []
  },
  {
    id: 'startup-5',
    name: 'PayEasy',
    pitch: 'Digital payments for rural merchants',
    sector: 'FinTech',
    badges: ['Open to Invest'],
    special: 'Flagship Startup',
    collegeId: 'COL003',
    createdBy: 'college-3',
    createdAt: new Date(),
    interestedInvestors: ['investor-1'],
    hiringInvestors: []
  }
];

// Dummy login credentials
export const dummyCredentials = {
  investor: {
    email: 'investor@test.com',
    password: 'password123'
  },
  college: {
    email: 'college@test.com',
    password: 'password123'
  },
  admin: {
    email: 'admin@test.com',
    password: 'password123'
  }
};

// Helper function to get user by email
export const getUserByEmail = (email: string): User | undefined => {
  return dummyUsers.find(user => user.email === email);
};

// Helper function to get startups by college
export const getStartupsByCollege = (collegeId: string): Startup[] => {
  return dummyStartups.filter(startup => startup.collegeId === collegeId);
};

// Helper function to get all startups
export const getAllStartups = (): Startup[] => {
  return dummyStartups;
}; 