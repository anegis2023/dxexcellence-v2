import React, { useState, useEffect } from 'react';
import { useEventContext } from '../context/EventContext';
import { useTranslation } from 'react-i18next';

const UserForm: React.FC = () => {
  const { t } = useTranslation();
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
      setNameError(t('userForm.errors.nameRequired'));
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError(t('userForm.errors.emailRequired'));
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t('userForm.errors.emailInvalid'));
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
          data-component-name="UserForm"
        >
          {t('userForm.labels.name')}
        </label>
        <input
          type="text"
          id="name"
          value={userName}
          onChange={handleNameChange}
          onBlur={() => handleBlur('name')}
          placeholder={t('userForm.placeholders.name')}
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
          {t('userForm.helpText.name')}
        </p>
      </div>
      
      <div className="mb-6">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('userForm.labels.email')}
        </label>
        <input
          type="email"
          id="email"
          value={userEmail}
          onChange={handleEmailChange}
          onBlur={() => handleBlur('email')}
          placeholder={t('userForm.placeholders.email')}
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
          {t('userForm.helpText.email')}
        </p>
      </div>
      
      <div className="p-4 rounded-lg border" style={{ background: '#dde2fc', borderColor: '#c5cef5' }}>
        <h4 className="text-sm font-medium text-[#380e5b] mb-2">{t('userForm.conferenceInfo.title')}</h4>
        <p className="text-xs text-[#380e5b]">
          {t('userForm.conferenceInfo.description')}
        </p>
      </div>
    </div>
  );
};

export default UserForm;