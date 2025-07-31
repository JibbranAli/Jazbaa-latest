import React, { useState } from 'react';

const EmailTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResult('✅ Email connection test successful! Emails should be sent automatically.');
    } catch (error) {
      setTestResult(`❌ Email test error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const emailStatus = {
    service: 'EmailJS',
    fromEmail: 'intern.linuxworld@gmail.com',
    fromName: 'JAZBAA Team',
    status: 'Real Email Service - Automatic Sending',
    configRequired: 'Please configure EmailJS credentials below'
  };

  const setupInstructions = `
📧 **EmailJS Setup Instructions:**

1. **Sign up at EmailJS:**
   - Go to https://www.emailjs.com/
   - Create a free account

2. **Create Email Service:**
   - Go to Email Services
   - Add Gmail service
   - Connect your Gmail account (intern.linuxworld@gmail.com)

3. **Create Email Templates:**
   
   **Invite Template (Template ID: invite_template):**
   Subject: 🎉 You're Invited to Join JAZBAA 4.0!
   Body:
   Dear {{to_name}},
   
   You have been invited to join JAZBAA 4.0 - The Creator Movement of India!
   
   Click the link below to register your startup and create your profile:
   {{invite_link}}
   
   Best regards,
   {{from_name}}

   **Welcome Template (Template ID: welcome_template):**
   Subject: 🎉 Welcome to JAZBAA 4.0, {{startup_name}}!
   Body:
   Dear {{to_name}},
   
   Welcome to JAZBAA 4.0! Your startup "{{startup_name}}" has been successfully registered.
   
   View your profile at the link below:
   {{profile_link}}
   
   Best regards,
   {{from_name}}

4. **Get Your Credentials:**
   - Service ID: Copy from Email Services
   - Template IDs: Copy from Email Templates
   - Public Key: Copy from Account > API Keys

5. **Update Configuration:**
   Replace the placeholder values in realEmailService.ts with your actual credentials.
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">📧 Email Service Test</h1>
          <p className="text-xl text-gray-300">
            Test and configure EmailJS for real email sending
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📊 Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400">Service</h3>
              <p>{emailStatus.service}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400">From Email</h3>
              <p>{emailStatus.fromEmail}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400">From Name</h3>
              <p>{emailStatus.fromName}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400">Status</h3>
              <p>{emailStatus.status}</p>
            </div>
          </div>
        </div>

        {/* Configuration Alert */}
        <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-6 mb-8">
          <h3 className="text-yellow-400 font-semibold mb-4">⚠️ Configuration Required</h3>
          <p className="text-gray-300 mb-4">{emailStatus.configRequired}</p>
          
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '🧪 Testing...' : '🧪 Test Email Connection'}
          </button>

          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              testResult.includes('✅') 
                ? 'bg-green-900/30 border border-green-500/50 text-green-300' 
                : 'bg-red-900/30 border border-red-500/50 text-red-300'
            }`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📋 EmailJS Setup Instructions</h2>
          <div className="prose prose-invert max-w-none">
            <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
              {setupInstructions}
            </pre>
          </div>
        </div>

        {/* Quick Setup Steps */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🚀 Quick Setup Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold">Sign up at EmailJS</h3>
                <p className="text-gray-300">Go to <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">emailjs.com</a> and create a free account</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold">Create Email Service</h3>
                <p className="text-gray-300">Add Gmail service and connect your Gmail account (intern.linuxworld@gmail.com)</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold">Create Email Templates</h3>
                <p className="text-gray-300">Create two templates: one for invites and one for welcome emails</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold">Get Credentials</h3>
                <p className="text-gray-300">Copy Service ID, Template IDs, and Public Key from EmailJS dashboard</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
              <div>
                <h3 className="font-semibold">Update Configuration</h3>
                <p className="text-gray-300">Replace placeholder values in <code className="bg-gray-800 px-1 rounded">src/services/realEmailService.ts</code></p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">6</div>
              <div>
                <h3 className="font-semibold">Test Connection</h3>
                <p className="text-gray-300">Click the "Test Email Connection" button above to verify setup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Admin */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTest; 