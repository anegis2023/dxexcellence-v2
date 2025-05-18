import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image, Download, Users } from 'lucide-react';
import animatedBg from '../assets/images/animated-bg.avif';

const Home: React.FC = () => {
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
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#72edff]">
              Create Your DX EXCELLENCE conference graphics
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-[#72edff]">
              Stand out on LinkedIn with eye-catching DX EXCELLENCE conference graphics in seconds!
            </p>
            <Link
              to="/generator"
              className="inline-block bg-[#72edff] text-[#380e5b] font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#5ad8e9] transition-colors duration-200"
            >
              Click to create Your LinkedIn graphics
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How it works?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your photo</h3>
              <p className="text-gray-600">
                Upload your professional headshot or profile picture
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your details</h3>
              <p className="text-gray-600">
                Provide your name and email to personalize your graphics
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4">
                <Image size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a template</h3>
              <p className="text-gray-600">
                Select from our professionally designed templates
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center template-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4">
                <Download size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Download</h3>
              <p className="text-gray-600">
                Get your personalized graphics ready to share
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#380e5b]">
            Ready to Stand Out at DX EXCELLENCE conference?
          </h2>
          <p className="text-xl mb-8 text-[#380e5b] max-w-3xl mx-auto">
            Create your custom conference graphics now and show your network you're participating in this exclusive professional event.
          </p>
          <Link
            to="/generator"
            className="inline-block bg-[#72edff] text-[#380e5b] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-[#5ad8e9] transition-colors duration-200"
          >
            Click to start creating
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;