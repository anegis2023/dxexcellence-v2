import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Home, Image } from 'lucide-react';
import dxLogo from '../assets/images/dx-logo-purple.png';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  return (
    <header className="shadow-sm" style={{ background: 'linear-gradient(to right, #dbe2fe, #ebe7f1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src={dxLogo} alt="DX Excellence" className="h-10" />
          </Link>
          <div className="flex items-center">
            <nav className="mr-6">
              <ul className="flex space-x-6" data-component-name="Header">
                <li data-component-name="Header">
                  <Link 
                    to="/" 
                    className="text-gray-600 hover:text-[#0F172A] transition-colors flex items-center"
                    title={t('navigation.home')}
                    data-component-name="LinkWithRef"
                  >
                    <Home size={24} />
                  </Link>
                </li>
                <li data-component-name="Header">
                  <Link 
                    to="/generator" 
                    className="text-gray-600 hover:text-[#0F172A] transition-colors flex items-center"
                    title={t('navigation.createGraphics')}
                    data-component-name="LinkWithRef"
                  >
                    <Image size={24} />
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* Language Switcher */}
            <div className="flex space-x-2 border-l pl-4 border-gray-300">
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded ${language === 'en' ? 'bg-[#380e5b] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button 
                onClick={() => changeLanguage('pl')}
                className={`px-2 py-1 rounded ${language === 'pl' ? 'bg-[#380e5b] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                aria-label="Switch to Polish"
              >
                PL
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;