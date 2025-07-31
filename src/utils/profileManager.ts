import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface StartupProfile {
  id: string;
  name: string;
  tagline?: string;
  story?: string;
  sector: string;
  badges: string[];
  team: any[];
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
  slug: string;
  createdAt: Date;
  isPermanent: boolean;
  profileCreatedAt: Date;
  lastUpdated: Date;
  // Template compatibility
  isTemplateCompatible: boolean;
  templateVersion: string;
}

/**
 * Ensures all startups have profile pages created automatically
 * This function checks if a startup profile exists and creates one if it doesn't
 */
export const ensureStartupProfile = async (startupData: any): Promise<string> => {
  try {
    // Generate slug for the startup
    const slug = startupData.slug || 
                 startupData.id || 
                 startupData.name?.toLowerCase().replace(/\s+/g, '-') || 
                 `startup-${Date.now()}`;

    console.log('🔍 Ensuring startup profile exists:', {
      startupName: startupData.name,
      slug: slug,
      hasExistingProfile: !!startupData.slug
    });

    // Check if profile already exists in main collection
    const startupRef = doc(db, 'startups', slug);
    const startupDoc = await getDoc(startupRef);

    if (startupDoc.exists()) {
      console.log('✅ Startup profile already exists:', slug);
      return slug;
    }

    // Create basic profile data if it doesn't exist
    const profileData: StartupProfile = {
      id: startupData.id || slug,
      name: startupData.name || 'Unknown Startup',
      tagline: startupData.tagline || startupData.pitch || 'No tagline available',
      story: startupData.story || 'No story available',
      sector: startupData.sector || 'Technology',
      badges: startupData.badges || [],
      team: startupData.team || [],
      website: startupData.website,
      appStore: startupData.appStore,
      playStore: startupData.playStore,
      demoUrl: startupData.demoUrl,
      qrCode: startupData.qrCode,
      contactEmail: startupData.contactEmail,
      contactPhone: startupData.contactPhone,
      productVideo: startupData.productVideo,
      pitchDeck: startupData.pitchDeck,
      problem: startupData.problem || 'Problem description not available',
      solution: startupData.solution || 'Solution description not available',
      collaborationMessage: startupData.collaborationMessage || 'We are open to collaboration, funding, and partnerships.',
      individualPitches: startupData.individualPitches || [],
      slug: slug,
      createdAt: startupData.createdAt || new Date(),
      isPermanent: true,
      profileCreatedAt: new Date(),
      lastUpdated: new Date(),
      // Template compatibility
      isTemplateCompatible: true,
      templateVersion: '1.0'
    };

    // Save to main startups collection
    await setDoc(startupRef, profileData);
    console.log('✅ Created startup profile:', slug);

    // Also save to backup collection for permanence
    try {
      const backupRef = doc(db, 'permanent_profiles', slug);
      await setDoc(backupRef, {
        ...profileData,
        backupCreatedAt: new Date(),
        originalCollection: 'startups'
      });
      console.log('✅ Created backup profile:', slug);
    } catch (backupError) {
      console.warn('⚠️ Backup creation failed (optional):', backupError);
    }

    return slug;
  } catch (error) {
    console.error('❌ Error ensuring startup profile:', error);
    throw error;
  }
};

/**
 * Ensures all existing startups in the database have profile pages
 * This function can be called to migrate existing data
 */
export const ensureAllStartupProfiles = async (): Promise<string[]> => {
  try {
    console.log('🔄 Ensuring all startup profiles exist...');
    
    // Get all startups from the main collection
    const startupsRef = collection(db, 'startups');
    const querySnapshot = await getDocs(startupsRef);
    
    const profilesCreated: string[] = [];
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      try {
        const slug = await ensureStartupProfile({
          ...data,
          id: doc.id
        });
        profilesCreated.push(slug);
      } catch (error) {
        console.error(`❌ Failed to ensure profile for ${doc.id}:`, error);
      }
    }
    
    console.log(`✅ Ensured ${profilesCreated.length} startup profiles exist`);
    return profilesCreated;
  } catch (error) {
    console.error('❌ Error ensuring all startup profiles:', error);
    throw error;
  }
};

/**
 * Gets the profile URL for a startup
 */
export const getStartupProfileUrl = (startup: any): string => {
  const slug = startup.slug || 
               startup.id || 
               startup.name?.toLowerCase().replace(/\s+/g, '-') || 
               `startup-${startup.id}`;
  
  return `/startup/${slug}`;
};

/**
 * Validates if a startup has a complete profile
 */
export const validateStartupProfile = (startup: any): boolean => {
  const requiredFields = ['name', 'slug'];
  const hasRequiredFields = requiredFields.every(field => startup[field]);
  
  return hasRequiredFields;
}; 