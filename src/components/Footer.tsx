import React from 'react';
import { MapPin, Mail, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#543ef7]/5 to-[#9cecd5]/5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#e86888] to-[#7d7eed] bg-clip-text text-transparent mb-4">
              JAZBAA 4.0
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Empowering the next generation of Indian entrepreneurs through 
              intensive learning, collaborative innovation, and relentless execution.
            </p>
            <div className="space-y-2 text-white/60">
              <p className="flex items-center gap-2">
                <MapPin size={16} />
                New Delhi, India
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                hello@jazbaa.com
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#about" className="hover:text-[#e86888] transition-colors duration-200">About JAZBAA</a></li>
              <li><a href="#startups" className="hover:text-[#e86888] transition-colors duration-200">Startups</a></li>
              <li><a href="#creators" className="hover:text-[#e86888] transition-colors duration-200">Creators</a></li>
              <li><a href="#journey" className="hover:text-[#e86888] transition-colors duration-200">Journey</a></li>
              <li><a href="#mentors" className="hover:text-[#e86888] transition-colors duration-200">Mentors</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-white/60 mb-4 text-sm">
              Get inspiring stories from JAZBAA, weekly
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email"
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#e86888]/50"
              />
              <button className="w-full bg-gradient-to-r from-[#e86888] to-[#7d7eed] text-white py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © 2024 JAZBAA 4.0. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/60 hover:text-[#e86888] transition-colors duration-200">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-[#e86888] transition-colors duration-200">
              <Github size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-[#e86888] transition-colors duration-200">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 