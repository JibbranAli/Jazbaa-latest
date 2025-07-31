import React, { useState } from 'react';
import { ensureAllStartupProfiles } from '../../utils/profileManager';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ProfileManager: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    profilesCreated?: string[];
  } | null>(null);

  const handleEnsureAllProfiles = async () => {
    setIsRunning(true);
    setResult(null);
    
    try {
      console.log('🔄 Starting profile management...');
      const profilesCreated = await ensureAllStartupProfiles();
      
      setResult({
        success: true,
        message: `Successfully ensured ${profilesCreated.length} startup profiles exist!`,
        profilesCreated
      });
      
      console.log('✅ Profile management completed:', profilesCreated);
    } catch (error) {
      console.error('❌ Profile management failed:', error);
      setResult({
        success: false,
        message: `Failed to ensure startup profiles: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Startup Profile Manager
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">Ensure All Startup Profiles</h2>
            <p className="text-gray-300 mb-6">
              This tool ensures that all startups in the database have complete profile pages created.
              It will automatically create profile pages for any startups that don't have them yet.
            </p>
            
            <button
              onClick={handleEnsureAllProfiles}
              disabled={isRunning}
              className="px-8 py-4 bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isRunning ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Ensuring Profiles...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Ensure All Startup Profiles
                </>
              )}
            </button>
            
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {result.success ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <AlertCircle size={20} className="text-red-400" />
                  )}
                  <span className="font-semibold">
                    {result.success ? 'Success' : 'Error'}
                  </span>
                </div>
                <p className="text-sm">{result.message}</p>
                
                {result.success && result.profilesCreated && result.profilesCreated.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Profiles Created:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {result.profilesCreated.map((slug, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-2 text-xs">
                          {slug}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
          
          <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold mt-0.5">
                  1
                </div>
                <p>Scans all startups in the database to check if they have complete profile pages.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold mt-0.5">
                  2
                </div>
                <p>For startups without profiles, creates basic profile data with all required fields.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold mt-0.5">
                  3
                </div>
                <p>Saves profiles to both main collection and backup collection for permanence.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold mt-0.5">
                  4
                </div>
                <p>Ensures all "View Details" buttons redirect to the correct profile pages.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileManager; 