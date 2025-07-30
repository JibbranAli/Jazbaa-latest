import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* JAZBAA Logo Design */}
      <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2" fill="none"/>
      <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">
        JAZBAA
      </text>
      {/* Innovation/Startup symbol */}
      <path d="M12 15 L20 8 L28 15 L24 20 L16 20 Z" fill="white" opacity="0.8"/>
      <circle cx="20" cy="28" r="3" fill="white" opacity="0.6"/>
    </svg>
  );
};

export default Logo; 