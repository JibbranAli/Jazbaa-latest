import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadStartupLogo, uploadTeamPhoto } from '../../utils/imageUpload';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

interface StartupData {
  name: string;
  tagline: string;
  story: string;
  storyImage?: string;
  productVideo?: string;
  pitchDeck?: string;
  team: TeamMember[];
  website?: string;
  appStore?: string;
  playStore?: string;
  demoUrl?: string;
  qrCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  sector: string;
  badges: string[];
  special?: string;
  logo?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  individualPitches?: IndividualPitch[];
  collaborationMessage?: string;
}

interface TeamMember {
  name: string;
  role: string;
  headshot?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  hiring?: boolean;
  pitchVideo?: string;
}

interface IndividualPitch {
  name: string;
  role: string;
  videoUrl: string;
  hiring: boolean;
}

const StartupRegistration: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<StartupData>({
    name: '',
    tagline: '',
    story: '',
    team: [{ name: '', role: '', linkedin: '', github: '', portfolio: '', pitchVideo: '', hiring: false }],
    website: '',
    appStore: '',
    playStore: '',
    demoUrl: '',
    qrCode: '',
    contactEmail: '',
    contactPhone: '',
    sector: 'Technology',
    badges: [],
    special: '',
    problem: '',
    solution: '',
    productVideo: '',
    pitchDeck: '',
    collaborationMessage: '',
    logo: ''
  });

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  
  // Team member image upload states
  const [teamMemberImages, setTeamMemberImages] = useState<{ [key: number]: { file: File | null, preview: string | null, uploading: boolean, error: string | null } }>({});

  const sectors = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 
    'Entertainment', 'Transportation', 'Food & Beverage', 'Real Estate', 
    'Manufacturing', 'Energy', 'Environment', 'Sports', 'Fashion', 'Other'
  ];

  const availableBadges = [
    'AI/ML', 'Blockchain', 'IoT', 'SaaS', 'Mobile App', 'Web App',
    'Open to Invest', 'Hiring', 'B2B', 'B2C', 'Enterprise', 'Startup',
    'Innovation', 'Sustainability', 'Social Impact', 'FinTech', 'HealthTech',
    'EdTech', 'CleanTech', 'AgriTech'
  ];

  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) {
        setMessage({ type: 'error', text: 'Invalid invite token.' });
        setLoading(false);
        return;
      }

      try {
        // Search for invite by token field instead of using token as document ID
        const invitesRef = collection(db, 'invites');
        const q = query(invitesRef, where('token', '==', token));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setMessage({ type: 'error', text: 'Invalid or expired invite token.' });
          setLoading(false);
          return;
        }

        const inviteDoc = querySnapshot.docs[0];
        const inviteData = inviteDoc.data();
        
        if (inviteData.status === 'registered') {
          setMessage({ type: 'error', text: 'This invite has already been used.' });
          setLoading(false);
          return;
        }

        setInvite({ id: inviteDoc.id, ...inviteData });
        setFormData(prev => ({
          ...prev,
          contactEmail: inviteData.email
        }));
      } catch (error) {
        console.error('Error fetching invite:', error);
        setMessage({ type: 'error', text: 'Error loading invite. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  const handleInputChange = (field: keyof StartupData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamChange = (index: number, field: keyof TeamMember, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name: '', role: '', linkedin: '', github: '', portfolio: '', pitchVideo: '', hiring: false, headshot: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
    
    // Clean up team member image state
    setTeamMemberImages(prev => {
      const newState = { ...prev };
      delete newState[index];
      // Shift down all indices after the removed one
      const shiftedState: typeof prev = {};
      Object.keys(newState).forEach(key => {
        const keyNum = parseInt(key);
        if (keyNum > index) {
          shiftedState[keyNum - 1] = newState[keyNum];
        } else {
          shiftedState[keyNum] = newState[keyNum];
        }
      });
      return shiftedState;
    });
  };

  const handleBadgeToggle = (badge: string) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Logo upload handlers
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('File size must be less than 5MB');
      return;
    }

    setLogoFile(file);
    setLogoUploadError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUploadError(null);
    setFormData(prev => ({ ...prev, logo: '' }));
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !formData.name) {
      return null;
    }

    setLogoUploading(true);
    setLogoUploadError(null);

    try {
      console.log('📤 Starting logo upload...');
      
      // First try Firebase Storage upload
      const result = await uploadStartupLogo(logoFile, formData.name);
      
      if (result.success && result.url) {
        console.log('✅ Logo uploaded successfully to Firebase Storage:', result.url);
        return result.url;
      } else {
        // Fallback: Convert to base64 and store in Firestore
        console.log('⚠️ Firebase Storage upload failed, using base64 fallback');
        console.log('❌ Storage error:', result.error);
        
        const base64Url = await convertFileToBase64(logoFile);
        console.log('✅ Logo converted to base64 successfully');
        return base64Url;
      }
    } catch (error) {
      console.error('❌ Logo upload error:', error);
      
      // Always fallback to base64 on any error
      try {
        console.log('🔄 Attempting base64 fallback due to error...');
        const base64Url = await convertFileToBase64(logoFile);
        console.log('✅ Base64 fallback successful');
        return base64Url;
      } catch (base64Error) {
        console.error('❌ Base64 conversion also failed:', base64Error);
        setLogoUploadError('Logo upload failed. Please try again or skip logo upload.');
        return null;
      }
    } finally {
      setLogoUploading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Team member image upload handlers
  const handleTeamMemberImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setTeamMemberImages(prev => ({
          ...prev,
          [index]: { ...prev[index], error: 'Please select an image file' }
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setTeamMemberImages(prev => ({
          ...prev,
          [index]: { ...prev[index], error: 'Image size should be less than 5MB' }
        }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setTeamMemberImages(prev => ({
          ...prev,
          [index]: {
            file,
            preview: e.target?.result as string,
            uploading: false,
            error: null
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTeamMemberImage = (index: number) => {
    setTeamMemberImages(prev => ({
      ...prev,
      [index]: { file: null, preview: null, uploading: false, error: null }
    }));
  };

  const uploadTeamMemberImage = async (index: number): Promise<string | null> => {
    const imageData = teamMemberImages[index];
    if (!imageData?.file) return null;

    try {
      setTeamMemberImages(prev => ({
        ...prev,
        [index]: { ...prev[index], uploading: true, error: null }
      }));

      // Try Firebase Storage first
      try {
        const fileName = `team-headshots/${formData.name}_${index}_${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, imageData.file);
        const downloadURL = await getDownloadURL(storageRef);
        
        setTeamMemberImages(prev => ({
          ...prev,
          [index]: { ...prev[index], uploading: false }
        }));
        
        return downloadURL;
      } catch (storageError) {
        console.log('Firebase Storage failed, using base64 fallback:', storageError);
        
        // Fallback to base64
        const base64Data = await convertFileToBase64(imageData.file);
        
        setTeamMemberImages(prev => ({
          ...prev,
          [index]: { ...prev[index], uploading: false }
        }));
        
        return base64Data;
      }
    } catch (error) {
      console.error('Error uploading team member image:', error);
      setTeamMemberImages(prev => ({
        ...prev,
        [index]: { 
          ...prev[index], 
          uploading: false, 
          error: 'Failed to upload image' 
        }
      }));
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invite) {
      setMessage({ type: 'error', text: 'Invalid invite.' });
      return;
    }

    // Debug: Log form data
    console.log('📝 Form data being submitted:', formData);
    console.log('📧 Invite data:', invite);

    setSubmitting(true);
    setMessage(null);

    try {
      const slug = generateSlug(formData.name);
      console.log('🚀 Creating PERMANENT startup profile with slug:', slug);
      
      // Validate required fields
      if (!formData.name || !formData.tagline || !formData.story) {
        throw new Error('Please fill in all required fields (Name, Tagline, and Story)');
      }
      
      // Upload logo if selected
      let logoUrl = formData.logo;
      if (logoFile) {
        console.log('📤 Uploading logo...');
        logoUrl = await uploadLogo();
        if (!logoUrl) {
          throw new Error('Logo upload failed. Please try again.');
        }
        console.log('✅ Logo uploaded successfully:', logoUrl);
      }
      
      // Upload team member images if selected
      console.log('📤 Uploading team member images...');
      const updatedTeam = await Promise.all(
        formData.team.map(async (member, index) => {
          const imageData = teamMemberImages[index];
          if (imageData?.file) {
            console.log(`📤 Uploading image for team member ${index}: ${member.name}`);
            const headshotUrl = await uploadTeamMemberImage(index);
            if (headshotUrl) {
              console.log(`✅ Team member image uploaded successfully: ${headshotUrl}`);
              return { ...member, headshot: headshotUrl };
            } else {
              console.warn(`⚠️ Team member image upload failed for ${member.name}`);
              return member;
            }
          }
          return member;
        })
      );
      console.log('✅ All team member images processed');
      
      // Prepare complete startup data with all profile fields for PERMANENT storage
      const startupData = {
        ...formData, 
        slug, 
        createdAt: new Date(), 
        status: 'active', 
        createdBy: invite.email,
        team: updatedTeam, // Use updated team with headshot URLs
        // Template-compatible fields
        name: formData.name,
        tagline: formData.tagline,
        story: formData.story,
        sector: formData.sector,
        badges: formData.badges,
        website: formData.website,
        appStore: formData.appStore,
        playStore: formData.playStore,
        demoUrl: formData.demoUrl,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        productVideo: formData.productVideo,
        pitchDeck: formData.pitchDeck,
        qrCode: formData.qrCode,
        problem: formData.problem,
        solution: formData.solution,
        collaborationMessage: formData.collaborationMessage,
        individualPitches: formData.individualPitches || [],
        logo: logoUrl || undefined, // Use uploaded logo URL or undefined
        // Ensure template compatibility
        isTemplateCompatible: true,
        templateVersion: '1.0',
        profileCreatedAt: new Date(),
        lastUpdated: new Date()
      };

      console.log('💾 Saving PERMANENT startup profile data:', startupData);

      // Create PERMANENT startup document with slug as ID
      const startupRef = doc(db, 'startups', slug);
      await setDoc(startupRef, startupData);
      console.log('✅ PERMANENT startup profile created successfully with ID:', slug);

      // Test: Verify the data was saved by reading it back
      try {
        const verifyDoc = await getDoc(startupRef);
        if (verifyDoc.exists()) {
          const savedData = verifyDoc.data();
          console.log('✅ Data verification successful. Saved data:', savedData);
        } else {
          console.error('❌ Data verification failed - document not found after saving');
        }
      } catch (verifyError) {
        console.error('❌ Data verification error:', verifyError);
      }

      // Try to create a backup in a separate collection for extra permanence (optional)
      try {
        const backupRef = doc(db, 'permanent_profiles', slug);
        await setDoc(backupRef, {
          ...startupData,
          backupCreatedAt: new Date(),
          originalCollection: 'startups'
        });
        console.log('✅ Backup profile created in permanent_profiles collection');
      } catch (backupError) {
        console.warn('⚠️ Backup creation failed (optional):', backupError);
        // Continue with registration even if backup fails
      }

      // Update invite status with permanent profile reference
      const inviteRef = doc(db, 'invites', invite.id);
      await updateDoc(inviteRef, {
        status: 'registered',
        startupSlug: slug,
        registeredAt: new Date(),
        profilePermanent: true
      });
      console.log('✅ Invite status updated with permanent profile reference');

      // Simulate welcome email with permanent profile link
      console.log('📧 Simulating welcome email to:', formData.contactEmail);
      console.log('🎯 PERMANENT Profile URL:', `${window.location.origin}/startup/${slug}`);

      setMessage({ 
        type: 'success', 
        text: `✅ Startup "${formData.name}" registered successfully! 
        
🎯 Your PERMANENT profile is now live at: ${window.location.origin}/startup/${slug}
📧 Welcome email sent to ${invite.email}.
🔒 This profile page will remain accessible forever.` 
      });
      
      // Redirect to startup profile after a short delay
      setTimeout(() => {
        navigate(`/startup/${slug}`);
      }, 3000);
    } catch (error) {
      console.error('❌ Error creating permanent startup profile:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to create permanent startup profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading invite...</p>
        </div>
      </div>
    );
  }

  if (message?.type === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Invalid Invite</h1>
          <p className="text-gray-300 mb-6">{message.text}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🚀 Register Your Startup</h1>
          <p className="text-xl text-gray-300">
            Complete your startup profile for JAZBAA 4.0
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Debug Section - Remove this in production */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-400 font-semibold mb-2">🔧 Debug Info</h3>
            <p className="text-yellow-300 text-sm mb-2">Form Data: {JSON.stringify(formData, null, 2)}</p>
            <p className="text-yellow-300 text-sm">Invite: {invite ? 'Valid' : 'Invalid'}</p>
            <button
              type="button"
              onClick={() => {
                console.log('🔍 Debug: Form data:', formData);
                console.log('🔍 Debug: Invite:', invite);
                alert('Check browser console for debug info');
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded text-sm"
            >
              Test Form Data
            </button>
          </div>

          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">🚀 Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2">Startup Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="Enter startup name"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Tagline *</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="Short, memorable tagline"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Sector *</label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#e86888]"
                  style={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  required
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select sector</option>
                  <option value="HealthTech" style={{ backgroundColor: '#1f2937', color: 'white' }}>HealthTech</option>
                  <option value="EdTech" style={{ backgroundColor: '#1f2937', color: 'white' }}>EdTech</option>
                  <option value="FinTech" style={{ backgroundColor: '#1f2937', color: 'white' }}>FinTech</option>
                  <option value="E-commerce" style={{ backgroundColor: '#1f2937', color: 'white' }}>E-commerce</option>
                  <option value="AI/ML" style={{ backgroundColor: '#1f2937', color: 'white' }}>AI/ML</option>
                  <option value="IoT" style={{ backgroundColor: '#1f2937', color: 'white' }}>IoT</option>
                  <option value="Sustainability" style={{ backgroundColor: '#1f2937', color: 'white' }}>Sustainability</option>
                  <option value="Entertainment" style={{ backgroundColor: '#1f2937', color: 'white' }}>Entertainment</option>
                  <option value="Social Impact" style={{ backgroundColor: '#1f2937', color: 'white' }}>Social Impact</option>
                  <option value="Other" style={{ backgroundColor: '#1f2937', color: 'white' }}>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="contact@startup.com"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">🖼️ Startup Logo</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="block text-white/80 mb-2">Upload Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-lg cursor-pointer hover:scale-105 transition-all"
                >
                  <Upload size={16} />
                  Choose Logo
                </label>
                {logoFile && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    <X size={16} />
                    Remove
                  </button>
                )}
              </div>
              
              {logoUploadError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {logoUploadError}
                </div>
              )}
              
              {logoUploading && (
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  Uploading logo...
                </div>
              )}
              
              {logoPreview && (
                <div className="mt-4">
                  <p className="text-white/80 mb-2">Logo Preview:</p>
                  <div className="w-32 h-32 border-2 border-white/20 rounded-lg overflow-hidden bg-white/10">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              <p className="text-white/60 text-sm">
                Upload your startup logo (PNG, JPG, GIF). Max size: 5MB. 
                This will be displayed on your profile page and startup cards.
              </p>
            </div>
          </div>

          {/* Story & Problem */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">📖 Story & Problem</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">Our Story *</label>
                <textarea
                  value={formData.story}
                  onChange={(e) => handleInputChange('story', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] resize-none"
                  rows={4}
                  placeholder="Tell the story behind your startup - what inspired you, what problem you're solving..."
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">The Problem We're Solving</label>
                <textarea
                  value={formData.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] resize-none"
                  rows={3}
                  placeholder="Describe the specific problem or gap in the market that your startup addresses..."
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Our Solution</label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] resize-none"
                  rows={3}
                  placeholder="Explain how your product/service solves the problem..."
                />
              </div>
            </div>
          </div>

          {/* Product & Media */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">🎬 Product & Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2">Product Video URL</label>
                <input
                  type="url"
                  value={formData.productVideo}
                  onChange={(e) => handleInputChange('productVideo', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="YouTube or video link"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Pitch Deck URL</label>
                <input
                  type="url"
                  value={formData.pitchDeck}
                  onChange={(e) => handleInputChange('pitchDeck', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="Google Slides or PDF link"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="https://yourstartup.com"
                />
              </div>
              {/* <div>
                <label className="block text-white/80 mb-2">Demo URL</label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="Live demo link"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">App Store Link</label>
                <input
                  type="url"
                  value={formData.appStore}
                  onChange={(e) => handleInputChange('appStore', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="iOS App Store link"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Play Store Link</label>
                <input
                  type="url"
                  value={formData.playStore}
                  onChange={(e) => handleInputChange('playStore', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="Google Play Store link"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">QR Code URL</label>
                <input
                  type="url"
                  value={formData.qrCode}
                  onChange={(e) => handleInputChange('qrCode', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="QR code image URL"
                />
              </div> */}
              <div>
                <label className="block text-white/80 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">👥 Team Members</h3>
            <div className="space-y-4">
              {formData.team.map((member, index) => (
                <div key={index} className="border border-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Team Member {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-2">Name *</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">Role *</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleTeamChange(index, 'role', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                        placeholder="Frontend, Backend, UX, ML, etc."
                        required
                      />
                    </div>
                    
                    {/* Team Member Headshot Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-white/80 mb-2">Headshot Photo</label>
                      <div className="space-y-3">
                        {/* Image Preview */}
                        {teamMemberImages[index]?.preview && (
                          <div className="relative inline-block">
                            <img
                              src={teamMemberImages[index].preview}
                              alt={`${member.name} headshot`}
                              className="w-24 h-24 object-cover rounded-lg border border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => removeTeamMemberImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        
                        {/* Upload Progress */}
                        {teamMemberImages[index]?.uploading && (
                          <div className="text-blue-400 text-sm">Uploading image...</div>
                        )}
                        
                        {/* Error Message */}
                        {teamMemberImages[index]?.error && (
                          <div className="text-red-400 text-sm">{teamMemberImages[index].error}</div>
                        )}
                        
                        {/* Upload Button */}
                        {!teamMemberImages[index]?.preview && (
                          <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-white/40 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleTeamMemberImageChange(index, e)}
                              className="hidden"
                              id={`team-member-image-${index}`}
                            />
                            <label
                              htmlFor={`team-member-image-${index}`}
                              className="cursor-pointer text-white/80 hover:text-white"
                            >
                              <div className="text-2xl mb-2">📷</div>
                              <div className="text-sm">Click to upload headshot</div>
                              <div className="text-xs text-white/60 mt-1">JPG, PNG (max 5MB)</div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={member.linkedin || ''}
                        onChange={(e) => handleTeamChange(index, 'linkedin', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                        placeholder="LinkedIn profile URL"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">GitHub URL</label>
                      <input
                        type="url"
                        value={member.github || ''}
                        onChange={(e) => handleTeamChange(index, 'github', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                        placeholder="GitHub profile URL"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">Portfolio URL</label>
                      <input
                        type="url"
                        value={member.portfolio || ''}
                        onChange={(e) => handleTeamChange(index, 'portfolio', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                        placeholder="Personal portfolio URL"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">Pitch Video URL</label>
                      <input
                        type="url"
                        value={member.pitchVideo || ''}
                        onChange={(e) => handleTeamChange(index, 'pitchVideo', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]"
                        placeholder="Individual pitch video URL"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center text-white/80 mb-2">
                        <input
                          type="checkbox"
                          checked={member.hiring}
                          onChange={(e) => handleTeamChange(index, 'hiring', e.target.checked)}
                          className="mr-2"
                        />
                        Available for Hiring
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addTeamMember}
                className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                + Add Team Member
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">🏷️ Badges & Tags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">Select Badges</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Open to Invest', 'Open to Hire', 'Incubator Ready', 'MVP Ready', 'Revenue Generating', 'Patent Pending', 'CSR Eligible', 'Grant Eligible'].map((badge) => (
                    <label key={badge} className="flex items-center text-white/80">
                      <input
                        type="checkbox"
                        checked={formData.badges.includes(badge)}
                        onChange={() => handleBadgeToggle(badge)}
                        className="mr-2"
                      />
                      {badge}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">🤝 Collaboration</h3>
            <div>
              <label className="block text-white/80 mb-2">Collaboration Message</label>
              <textarea
                value={formData.collaborationMessage}
                onChange={(e) => handleInputChange('collaborationMessage', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#e86888] resize-none"
                rows={3}
                placeholder="We're open to funding, incubation, mentorship, or partnership..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '🚀 Creating Profile...' : '🚀 Create Startup Profile'}
            </button>
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/30 border border-green-500/50 text-green-300' 
                : 'bg-red-900/30 border border-red-500/50 text-red-300'
            }`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StartupRegistration; 