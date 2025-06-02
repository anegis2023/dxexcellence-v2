import React from 'react';
import { useTranslation } from 'react-i18next';
import dxLogo from '../assets/images/dxecellence-light.png';
import animatedBg from '../assets/images/animated-bg.avif';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative text-white py-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full bg-[#0F172A] z-0 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={animatedBg} 
            alt="Animated background" 
            className="w-full h-full object-cover" 
            style={{
              mixBlendMode: 'screen',
              opacity: 0.6
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A] opacity-60"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img src={dxLogo} alt="DX EXCELLENTS" className="h-10" />
          </div>
          <div className="text-sm">
            <p className="text-[#72edff]" data-component-name="Footer">{t('footer.tagline')}</p>
            <p className="mt-1 text-[#72edff]" data-component-name="Footer">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;