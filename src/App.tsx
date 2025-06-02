import { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Generator from './pages/Generator';
import { EventProvider } from './context/EventContext';
import { LanguageProvider } from './context/LanguageContext';
import { initEmailJS } from './utils/emailUtils';
import './i18n';
import './App.css';

function App() {
  useEffect(() => {
    // Set document title
    document.title = "LinkedIn Event Graphics Generator";
    
    // Initialize EmailJS
    console.log('App component mounted, initializing EmailJS...');
    
    // Check for environment variables
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    
    // Log environment variable status
    console.log('Environment variables check:', {
      publicKey: publicKey ? `Present (${publicKey.substring(0, 4)}...)` : 'MISSING',
      serviceId: serviceId ? `Present (${serviceId.substring(0, 4)}...)` : 'MISSING',
      templateId: templateId ? `Present (${templateId.substring(0, 4)}...)` : 'MISSING'
    });
    
    // Check if we're in development or production
    console.log('Running in:', import.meta.env.MODE, 'mode');
    
    // Log Netlify-specific environment variables if present
    if (import.meta.env.NETLIFY) {
      console.log('Running on Netlify:', import.meta.env.NETLIFY);
    }
    
    // Initialize EmailJS after logging
    initEmailJS();
  }, []);
  
  return (
    <BrowserRouter>
      <LanguageProvider>
        <EventProvider>
          <div className="flex flex-col min-h-screen font-sans" style={{ background: 'linear-gradient(to right, rgb(160, 242, 254), rgb(246, 246, 219))' }}>
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generator" element={<Generator />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </EventProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;