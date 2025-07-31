import React, { useState } from 'react';

const HeroSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const youtubeVideoId = "xdVdOeRmEKg";

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  return (
    <section id="hero" className="relative min-h-screen bg-black overflow-hidden mt-12">
      {/* White Background Half Section */}
      <div className="absolute bottom-0 left-0 w-full h-1/5 bg-white  z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left Side */}
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Students. Startups.
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Disruption Begins.
              </span>
            </h1>

            <div className="mt-6">
              <span className="text-white text-base">Established</span>
              <div className="text-white text-2xl font-bold">2019</div>
            </div>
          </div>

          {/* Right Side */}
          <div className="text-left">
            <div className="border-l-2 border-white/30 pl-6 mb-8">
              <p className="text-white text-lg leading-relaxed">
                <span className="font-semibold">Powered by LWJAZBAA</span> — India's biggest student-led startup revolution, where engineering minds become real-world creators.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-pink-400 text-4xl md:text-5xl font-bold mb-1">134+</div>
                <div className="text-white text-sm">Startups</div>
              </div>
              <div>
                <div className="text-purple-400 text-4xl md:text-5xl font-bold mb-1">500+</div>
                <div className="text-white text-sm">Dreamers</div>
              </div>
              <div>
                <div className="text-cyan-400 text-4xl md:text-5xl font-bold mb-1">45</div>
                <div className="text-white text-sm">Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-5xl z-30">
            {!showVideo ? (
              <>
                <div 
                  className="w-full h-80 md:h-96 rounded-3xl overflow-hidden relative cursor-pointer group shadow-xl"
                  onClick={handleVideoClick}
                >
                  <img 
                    src={`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`}
                    alt="YouTube Video Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-500/30 to-purple-800/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-80 md:h-96 rounded-3xl overflow-hidden shadow-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-3xl"
                ></iframe>
              </div>
            )}

            {/* Quote on White Background */}
            
              <p className="text-gray-700 text-xl md:text-2xl font-semibold text-center pt-4">
                Our Engineers Can be The Creators - Mr Vimal Daga
              </p>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
