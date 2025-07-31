import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface Invite {
  id: string;
  email: string;
  status: 'pending' | 'registered' | 'expired';
  invitedBy: string;
  invitedAt: Date;
  token: string;
  startupSlug?: string;
  inviteNumber?: number;
}

const InviteStartup: React.FC = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch invites function
  const fetchInvites = async () => {
    try {
      const invitesRef = collection(db, 'invites');
      const q = query(invitesRef, orderBy('invitedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const invitesData: Invite[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        invitesData.push({
          id: doc.id,
          email: data.email,
          status: data.status,
          invitedBy: data.invitedBy,
          invitedAt: data.invitedAt.toDate(),
          token: data.token,
          startupSlug: data.startupSlug,
          inviteNumber: data.inviteNumber || 1
        });
      });
      
      setInvites(invitesData);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter an email address.' });
      return;
    }

    if (!currentUser) {
      setMessage({ type: 'error', text: 'You must be logged in to send invites.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Check existing invites for this email
      const existingInvites = invites.filter(invite => invite.email === email.trim());
      
      const token = generateToken();
      const inviteData = {
        email: email.trim(),
        status: 'pending',
        invitedBy: currentUser.uid,
        invitedAt: new Date(),
        token: token,
        inviteNumber: existingInvites.length + 1
      };

      // Add invite to Firestore
      const docRef = await addDoc(collection(db, 'invites'), inviteData);
      console.log('Invite added to Firestore:', docRef.id);

      // For now, we'll simulate email sending
      const inviteLink = `${window.location.origin}/register/${token}`;
      
      setMessage({ 
        type: 'success', 
        text: `✅ Invite sent successfully to ${email.trim()}! 
        
📧 Invite link: ${inviteLink}
📋 Please send this link to the recipient manually.

💡 For automatic email sending, configure EmailJS in the email test page.`
      });
      setEmail('');
      
      // Refresh invites list
      fetchInvites();
    } catch (error) {
      console.error('Error sending invite:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to send invite. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/register/${token}`;
    navigator.clipboard.writeText(inviteLink);
    setMessage({ type: 'success', text: 'Invite link copied to clipboard!' });
  };

  const openInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/register/${token}`;
    window.open(inviteLink, '_blank');
  };

  // Group invites by email for summary
  const inviteSummary = invites.reduce((acc, invite) => {
    if (!acc[invite.email]) {
      acc[invite.email] = { count: 0, statuses: [] };
    }
    acc[invite.email].count++;
    acc[invite.email].statuses.push(invite.status);
    return acc;
  }, {} as Record<string, { count: number; statuses: string[] }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🚀 Invite Startups</h1>
          <p className="text-xl text-gray-300">
            Send invitations to startup teams to join JAZBAA 4.0
          </p>
        </div>

        {/* Send Invite Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📧 Send Invitation</h2>
          
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Startup Team Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="startup@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '📧 Sending...' : '🚀 Send Invitation'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/30 border border-green-500/50 text-green-300' 
                : 'bg-red-900/30 border border-red-500/50 text-red-300'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Recent Invitations */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📋 Recent Invitations</h2>
          
          {invites.length === 0 ? (
            <p className="text-gray-400">No invitations sent yet.</p>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-gray-400">
                        Sent {invite.invitedAt.toLocaleDateString()} at {invite.invitedAt.toLocaleTimeString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          invite.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300' :
                          invite.status === 'registered' ? 'bg-green-900/50 text-green-300' :
                          'bg-red-900/50 text-red-300'
                        }`}>
                          {invite.status}
                        </span>
                        {invite.inviteNumber && invite.inviteNumber > 1 && (
                          <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs">
                            Invite #{invite.inviteNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyInviteLink(invite.token)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => openInviteLink(invite.token)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                      >
                        Open Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Summary */}
        {Object.keys(inviteSummary).length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">📊 Invite Summary</h2>
            <div className="space-y-3">
              {Object.entries(inviteSummary).map(([email, data]) => (
                <div key={email} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-medium">{email}</p>
                  <p className="text-sm text-gray-400">
                    Total invites: {data.count} | 
                    Statuses: {data.statuses.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteStartup; 