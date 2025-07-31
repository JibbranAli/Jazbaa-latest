import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
    team: [{ name: '', role: '' }],
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
    collaborationMessage: ''
  });

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
      team: [...prev.team, { name: '', role: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
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
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invite) {
      setMessage({ type: 'error', text: 'Invalid invite.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const slug = generateSlug(formData.name);
      const startupData = {
        ...formData,
        slug,
        createdAt: new Date(),
        status: 'active',
        createdBy: invite.email
      };

      // Create startup document
      const startupRef = doc(db, 'startups', slug);
      await setDoc(startupRef, startupData);

      // Update invite status
      const inviteRef = doc(db, 'invites', invite.id);
      await updateDoc(inviteRef, {
        status: 'registered',
        startupSlug: slug
      });

      setMessage({ 
        type: 'success', 
        text: `✅ Startup "${formData.name}" registered successfully! Welcome email sent to ${invite.email}.` 
      });
      
      // Redirect to startup profile after a short delay
      setTimeout(() => {
        navigate(`/startup/${slug}`);
      }, 2000);
    } catch (error) {
      console.error('Error registering startup:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to register startup. Please try again.' 
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
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">📋 Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Startup Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Startup Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tagline *</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your startup"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sector *</label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@startup.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Your Story *</label>
              <textarea
                value={formData.story}
                onChange={(e) => handleInputChange('story', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your startup, the problem you're solving, and your vision..."
                required
              />
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">🏷️ Badges & Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableBadges.map(badge => (
                <label key={badge} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.badges.includes(badge)}
                    onChange={() => handleBadgeToggle(badge)}
                    className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{badge}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">🎯 Problem & Solution</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">The Problem</label>
                <textarea
                  value={formData.problem || ''}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the problem that sparked your idea..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Our Solution</label>
                <textarea
                  value={formData.solution || ''}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe how your solution addresses the problem..."
                />
              </div>
            </div>
          </div>

          {/* Media & Resources */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">📹 Media & Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Video URL</label>
                <input
                  type="url"
                  value={formData.productVideo || ''}
                  onChange={(e) => handleInputChange('productVideo', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YouTube/Vimeo link to your product demo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pitch Deck URL</label>
                <input
                  type="url"
                  value={formData.pitchDeck || ''}
                  onChange={(e) => handleInputChange('pitchDeck', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Google Slides/PDF link to your pitch deck"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">QR Code URL</label>
                <input
                  type="url"
                  value={formData.qrCode || ''}
                  onChange={(e) => handleInputChange('qrCode', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="QR code image URL for instant access"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone || ''}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Team Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">👥 Enhanced Team Details</h2>
            {formData.team.map((member, index) => (
              <div key={index} className="border border-white/10 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                    placeholder="Team Member Name"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => handleTeamChange(index, 'role', e.target.value)}
                    placeholder="Role/Position"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="url"
                    value={member.linkedin || ''}
                    onChange={(e) => handleTeamChange(index, 'linkedin', e.target.value)}
                    placeholder="LinkedIn URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={member.github || ''}
                    onChange={(e) => handleTeamChange(index, 'github', e.target.value)}
                    placeholder="GitHub URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={member.portfolio || ''}
                    onChange={(e) => handleTeamChange(index, 'portfolio', e.target.value)}
                    placeholder="Portfolio URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    value={member.pitchVideo || ''}
                    onChange={(e) => handleTeamChange(index, 'pitchVideo', e.target.value)}
                    placeholder="Individual Pitch Video URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={member.hiring || false}
                      onChange={(e) => handleTeamChange(index, 'hiring', e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Available for Hiring</span>
                  </div>
                </div>

                {formData.team.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Remove Member
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTeamMember}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              + Add Team Member
            </button>
          </div>

          {/* Collaboration Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">🤝 Collaboration</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Collaboration Message</label>
              <textarea
                value={formData.collaborationMessage || ''}
                onChange={(e) => handleInputChange('collaborationMessage', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="We're open to funding, incubation, mentorship, or partnership..."
              />
            </div>
          </div>

          {/* Links */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">🔗 Links & Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourstartup.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Demo URL</label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://demo.yourstartup.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">App Store Link</label>
                <input
                  type="url"
                  value={formData.appStore}
                  onChange={(e) => handleInputChange('appStore', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="iOS App Store URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Play Store Link</label>
                <input
                  type="url"
                  value={formData.playStore}
                  onChange={(e) => handleInputChange('playStore', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Google Play Store URL"
                />
              </div>
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