export type UserRole = 'admin' | 'investor' | 'college';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  collegeId?: string; // For college users
  investorId?: string; // For investor users
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
}

export interface InvestorInterest {
  investorId: string;
  startupId: string;
  type: 'investment' | 'hiring';
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
} 