import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const DatabaseDebug: React.FC = () => {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllStartups = async () => {
      try {
        setLoading(true);
        console.log('🔍 Debug: Fetching ALL startups from database...');
        
        const startupsRef = collection(db, 'startups');
        const querySnapshot = await getDocs(startupsRef);
        
        const fetchedStartups = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        });

        console.log('✅ Debug: Found startups in database:', fetchedStartups.length);
        console.log('✅ Debug: All startup data:', fetchedStartups);
        
        setStartups(fetchedStartups);
        setError(null);
      } catch (err) {
        console.error('❌ Debug: Error fetching startups:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStartups();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Debug - Startup Check</h1>
        
        {loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <p className="text-lg">Loading startup data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-6 mb-6 border border-red-500/50">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Error:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Database Summary:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400">Total Startups</h4>
              <p className="text-2xl font-bold">{startups.length}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-green-400">Active Startups</h4>
              <p className="text-2xl font-bold">
                {startups.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400">Sectors</h4>
              <p className="text-2xl font-bold">
                {new Set(startups.map(s => s.sector).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        {startups.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">All Startups in Database:</h3>
            <div className="space-y-4">
              {startups.map((startup, index) => (
                <div key={startup.id || index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{startup.name || 'Unnamed Startup'}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      startup.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {startup.status || 'unknown'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">ID:</span> {startup.id}
                    </div>
                    <div>
                      <span className="text-white/60">Sector:</span> {startup.sector || 'Not specified'}
                    </div>
                    <div>
                      <span className="text-white/60">Created:</span> {startup.createdAt ? new Date(startup.createdAt.toDate ? startup.createdAt.toDate() : startup.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                    <div>
                      <span className="text-white/60">Created By:</span> {startup.createdBy || 'Unknown'}
                    </div>
                    <div>
                      <span className="text-white/60">Slug:</span> {startup.slug || 'No slug'}
                    </div>
                    <div>
                      <span className="text-white/60">Has Logo:</span> {startup.logo ? '✅ Yes' : '❌ No'}
                    </div>
                  </div>
                  {startup.tagline && (
                    <p className="text-white/70 mt-2 italic">"{startup.tagline}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/50">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">No Startups Found</h3>
            <p className="text-yellow-300">
              No startups were found in the database. This could mean:
            </p>
            <ul className="text-yellow-300 mt-2 list-disc list-inside space-y-1">
              <li>No startups have been registered yet</li>
              <li>There's an issue with the database connection</li>
              <li>The startups collection doesn't exist</li>
              <li>There's a permissions issue</li>
            </ul>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Debug Information:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-white/60">Database:</span> Firestore
            </div>
            <div>
              <span className="text-white/60">Collection:</span> startups
            </div>
            <div>
              <span className="text-white/60">Query:</span> getDocs(collection(db, 'startups'))
            </div>
            <div>
              <span className="text-white/60">Filters:</span> None (fetching all documents)
            </div>
            <div>
              <span className="text-white/60">Timestamp:</span> {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDebug; 