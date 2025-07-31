export type UserRole = 'admin' | 'investor' | 'college';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  collegeId?: string; // For college users
  investorId?: string; // For investor users
}

export interface Comment {
  id: string;
  investorId: string;
  investorName: string;
  startupId: string;
  comment: string;
  timestamp: Date;
  type: 'investment' | 'hiring' | 'general';
}

export interface Startup {
  id: string;
  name: string;
  pitch: string;
  sector: string;
  badges: string[];
  special?: string;
  collegeId: string; // Which college this startup belongs to
  createdBy: string; // User ID who created this startup
  createdAt: Date;
  interestedInvestors: string[]; // Array of investor UIDs who are interested
  hiringInvestors: string[]; // Array of investor UIDs who want to hire
  // Additional profile fields
  tagline?: string;
  story?: string;
  team?: any[];
  website?: string;
  appStore?: string;
  playStore?: string;
  demoUrl?: string;
  qrCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  productVideo?: string;
  pitchDeck?: string;
  problem?: string;
  solution?: string;
  collaborationMessage?: string;
  individualPitches?: any[];
  slug?: string;
  status?: string;
  logo?: string; // Added logo field
}

export interface InvestorInterest {
  investorId: string;
  startupId: string;
  type: 'investment' | 'hiring';
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
} 