import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image, Download, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-[#0F172A] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your DX Excellence Event Graphics
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Generate professional promotional graphics for DX Excellence events in seconds
            </p>
            <Link
              to="/generator"
              className="inline-block bg-white text-[#0F172A] font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Create Your Graphics
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center template-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-gray-600">
                Upload your professional headshot or profile picture
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center template-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Details</h3>
              <p className="text-gray-600">
                Provide your name and email to personalize your graphics
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center template-card">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-[#0F172A] mb-4">
                <Image size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
              <p className="text-gray-600">
                Select from our professionally designed templates
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center template-card">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to Stand Out at DX Excellence Events?
          </h2>
          <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Create your custom event graphics now and show your network you're participating in this exclusive professional event.
          </p>
          <Link
            to="/generator"
            className="inline-block bg-[#0F172A] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-[#1E293B] transition-colors duration-200"
          >
            Start Creating
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;