
import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <div className="mt-16 text-center pb-8">
      <p className={`${isDarkMode ? 'text-green-300' : 'text-gray-700'} text-lg`}>
        🎨 Your QR code updates automatically as you customize it
      </p>
      <p className={`${isDarkMode ? 'text-green-400' : 'text-gray-600'} text-sm mt-2`}>
        All reserved and published by ney0000o
      </p>
    </div>
  );
};

export default Footer;
