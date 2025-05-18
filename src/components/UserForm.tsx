import React, { useState, useEffect } from 'react';
import { useEventContext } from '../context/EventContext';

const UserForm: React.FC = () => {
  const { userName, setUserName, userEmail, setUserEmail } = useEventContext();
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  
  useEffect(() => {
    // Parse URL parameters on mount
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam && userEmail === '') {
      setUserEmail(emailParam);
    }
  }, [setUserEmail, userEmail]);
  
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserName(newName);
    if (newName) {
      validateName(newName);
    } else {
      setNameError('');
    }
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setUserEmail(newEmail);
    if (newEmail) {
      validateEmail(newEmail);
    } else {
      setEmailError('');
    }
  };
  
  const handleBlur = (field: 'name' | 'email') => {
    if (field === 'name') {
      validateName(userName);
    } else {
      validateEmail(userEmail);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={userName}
          onChange={handleNameChange}
          onBlur={() => handleBlur('name')}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors ${
            nameError 
              ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
          }`}
        />
        {nameError && (
          <p className="mt-1 text-sm text-red-500">{nameError}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          This name will appear on your LinkedIn event graphic
        </p>
      </div>
      
      <div className="mb-6">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={userEmail}
          onChange={handleEmailChange}
          onBlur={() => handleBlur('email')}
          placeholder="johndoe@example.com"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors ${
            emailError 
              ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
          }`}
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-500">{emailError}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Your email is used to link your graphic to your event registration
        </p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">About conference Steps to Digital Transformation Excellence</h4>
        <p className="text-xs text-yellow-700">
          By creating this graphic, you're confirming that you participate in conference Steps to Digital Transformation Excellence. Your personalized graphic will help you 
          announce your attendance to your professional network.
        </p>
      </div>
    </div>
  );
};

export default UserForm;