import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image, Download, Users } from 'lucide-react';
import animatedBg from '../assets/images/animated-bg.avif';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 w-full h-full bg-[#0F172A] z-0 overflow-hidden">
          <div className="absolute inset-0 animate-pulse-slow">
            <img 
              src={animatedBg} 
              alt="Animated background" 
              className="w-full h-full object-cover" 
              style={{
                mixBlendMode: 'screen',
                opacity: 0.8
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A] opacity-40"></div>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-[2.025rem] md:text-[2.7rem] font-bold mb-8 text-[#72edff] leading-[1.22] font-display" data-component-name="Home">
                {t('home.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-[#72edff] leading-[1.65] font-sans" data-component-name="Home">
                {t('home.subtitle')}
              </p>
              <Link
                to="/generator"
                className="inline-block bg-[#72edff] text-[#380e5b] font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#5ad8e9] transition-colors duration-200"
                data-component-name="LinkWithRef"
              >
                {t('home.createButton')}
              </Link>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end" data-component-name="Home">
              <video 
                className="w-[75%] h-auto rounded-2xl shadow-xl" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source 
                  src="https://cdn.prod.website-files.com/67dac6ab14d03a4292155899%2F67fe073f643ba443d6a6218a_dx-excellence-original-compressed-transcode.mp4" 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800" data-component-name="Home">
            {t('home.howItWorks')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card" data-component-name="Home">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4" data-component-name="Home">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-component-name="Home">{t('home.features.uploadPhoto.title')}</h3>
              <p className="text-gray-600" data-component-name="Home">
                {t('home.features.uploadPhoto.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card" data-component-name="Home">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4" data-component-name="Home">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-component-name="Home">{t('home.features.enterDetails.title')}</h3>
              <p className="text-gray-600" data-component-name="Home">
                {t('home.features.enterDetails.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card" data-component-name="Home">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4" data-component-name="Home">
                <Image size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-component-name="Home">{t('home.features.chooseTemplate.title')}</h3>
              <p className="text-gray-600" data-component-name="Home">
                {t('home.features.chooseTemplate.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card" data-component-name="Home">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4" data-component-name="Home">
                <Download size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2" data-component-name="Home">{t('home.features.download.title')}</h3>
              <p className="text-gray-600" data-component-name="Home">
                {t('home.features.download.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-component-name="Home">
          <h2 className="text-3xl font-bold mb-4 text-[#380e5b]" data-component-name="Home">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-[#380e5b] max-w-3xl mx-auto" data-component-name="Home">
            {t('home.cta.description')}
          </p>
          <Link
            to="/generator"
            className="inline-block bg-[#72edff] text-[#380e5b] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-[#5ad8e9] transition-colors duration-200"
            data-component-name="LinkWithRef"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;