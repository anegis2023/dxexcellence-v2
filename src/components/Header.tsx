import React from 'react';
import { Link } from 'react-router-dom';
import dxLogo from '../assets/images/dx-logo-purple.png';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src={dxLogo} alt="DX Excellence" className="h-10" />
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-[#0F172A] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/generator" 
                  className="text-gray-600 hover:text-[#0F172A] transition-colors"
                >
                  Create Graphics
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;