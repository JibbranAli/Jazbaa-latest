import React from 'react';
import {
  Navigation,
  HeroSection,
  AboutSection,
  StartupsSection,
  CreatorsSection,
  JourneySection,
  MentorsSection,
  VisionSection,
  GallerySection,
  JoinSection,
  Footer
} from './components';

function App() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <StartupsSection />
      <CreatorsSection />
      <JourneySection />
      <MentorsSection />
      <VisionSection />
      <GallerySection />
      <JoinSection />
      <Footer />
    </div>
  );
}

export default App;