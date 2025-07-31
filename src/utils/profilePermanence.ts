import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface PermanentProfile {
  slug: string;
  name: string;
  tagline: string;
  story: string;
  sector: string;
  badges: string[];
  team: any[];
  website?: string;
  appStore?: string;
  playStore?: string;
  demoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  productVideo?: string;
  pitchDeck?: string;
  qrCode?: string;
  problem?: string;
  solution?: string;
  collaborationMessage?: string;
  individualPitches?: any[];
  isPermanent: boolean;
  profileCreatedAt: Date;
  lastUpdated: Date;
  profileVersion: string;
}

/**
 * Ensures a startup profile is permanently stored and accessible
 */
export const ensureProfilePermanence = async (slug: string, profileData: any) => {
  try {
    console.log('🔒 Ensuring profile permanence for:', slug);
    
    // Save to main collection
    const mainRef = doc(db, 'startups', slug);
    await setDoc(mainRef, {
      ...profileData,
      isPermanent: true,
      profileCreatedAt: new Date(),
      lastUpdated: new Date(),
      profileVersion: '1.0'
    });
    
    // Save to backup collection for extra permanence
    const backupRef = doc(db, 'permanent_profiles', slug);
    await setDoc(backupRef, {
      ...profileData,
      isPermanent: true,
      profileCreatedAt: new Date(),
      lastUpdated: new Date(),
      profileVersion: '1.0',
      backupCreatedAt: new Date(),
      originalCollection: 'startups'
    });
    
    console.log('✅ Profile permanence ensured for:', slug);
    return true;
  } catch (error) {
    console.error('❌ Error ensuring profile permanence:', error);
    return false;
  }
};

/**
 * Fetches a startup profile from the most reliable source
 */
export const fetchPermanentProfile = async (slug: string) => {
  try {
    console.log('🔍 Fetching permanent profile for:', slug);
    
    // Try main collection first
    const mainRef = doc(db, 'startups', slug);
    const mainDoc = await getDoc(mainRef);
    
    if (mainDoc.exists()) {
      console.log('✅ Profile found in main collection');
      return mainDoc.data();
    }
    
    // Try backup collection
    const backupRef = doc(db, 'permanent_profiles', slug);
    const backupDoc = await getDoc(backupRef);
    
    if (backupDoc.exists()) {
      console.log('✅ Profile found in backup collection');
      return backupDoc.data();
    }
    
    console.log('❌ Profile not found in any collection');
    return null;
  } catch (error) {
    console.error('❌ Error fetching permanent profile:', error);
    return null;
  }
};

/**
 * Lists all permanent profiles
 */
export const listAllPermanentProfiles = async () => {
  try {
    const profiles: PermanentProfile[] = [];
    
    // Get from main collection
    const mainQuery = query(collection(db, 'startups'));
    const mainSnapshot = await getDocs(mainQuery);
    
    mainSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.isPermanent) {
        profiles.push({
          ...data,
          slug: doc.id
        } as PermanentProfile);
      }
    });
    
    // Get from backup collection
    const backupQuery = query(collection(db, 'permanent_profiles'));
    const backupSnapshot = await getDocs(backupQuery);
    
    backupSnapshot.docs.forEach(doc => {
      const data = doc.data();
      profiles.push({
        ...data,
        slug: doc.id
      } as PermanentProfile);
    });
    
    console.log('📋 Found permanent profiles:', profiles.length);
    return profiles;
  } catch (error) {
    console.error('❌ Error listing permanent profiles:', error);
    return [];
  }
}; 