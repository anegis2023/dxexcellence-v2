import React from 'react';
import { Building2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Building2 className="h-6 w-6 text-white" />
            <span className="text-lg font-semibold">DX Excellence</span>
          </div>
          <div className="text-sm text-gray-300">
            <p>Create your personalized graphics for the next DX Excellence event</p>
            <p className="mt-1">© {new Date().getFullYear()} DX Excellence Graphics Generator</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;