import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { importBackgroundImages } from '../utils/imageUtils';

interface Template {
  id: string;
  name: string;
  imageUrl: string;
  primaryColor: string; // Color for the oval ring
  textColor: string; // Color for the name text
}

interface EventContextType {
  userPhoto: string | null;
  setUserPhoto: (photo: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  selectedTemplate: number;
  setSelectedTemplate: (template: number) => void;
  templates: Template[];
  addTemplate: (template: Template) => void;
  refreshTemplates: () => void;
}

const defaultContextValue: EventContextType = {
  userPhoto: null,
  setUserPhoto: () => {},
  userName: '',
  setUserName: () => {},
  userEmail: '',
  setUserEmail: () => {},
  selectedTemplate: 0,
  setSelectedTemplate: () => {},
  templates: [],
  addTemplate: () => {},
  refreshTemplates: () => {},
};

const EventContext = createContext<EventContextType>(defaultContextValue);

export const useEventContext = () => useContext(EventContext);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  
  // Load all background images as templates when the component mounts
  useEffect(() => {
    refreshTemplates();
  }, []);
  
  // Function to refresh the templates list
  const refreshTemplates = () => {
    const loadedTemplates = importBackgroundImages();
    setTemplates(loadedTemplates);
  };
  
  // Function to add a new template
  const addTemplate = (template: Template) => {
    setTemplates(prevTemplates => [...prevTemplates, template]);
  };
  
  return (
    <EventContext.Provider 
      value={{
        userPhoto,
        setUserPhoto,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        selectedTemplate,
        setSelectedTemplate,
        templates,
        addTemplate,
        refreshTemplates
      }}
    >
      {children}
    </EventContext.Provider>
  );
};