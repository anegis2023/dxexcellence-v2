import { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Generator from './pages/Generator';
import { EventProvider } from './context/EventContext';
import { initEmailJS } from './utils/emailUtils';
import './App.css';

function App() {
  useEffect(() => {
    // Set document title
    document.title = "LinkedIn Event Graphics Generator";
    
    // Initialize EmailJS
    console.log('App component mounted, initializing EmailJS...');
    initEmailJS();
    
    // Log environment variables (without revealing full values)
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'not set';
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'not set';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'not set';
    
    console.log('Environment variables loaded:', {
      publicKey: publicKey ? publicKey.substring(0, 4) + '...' : 'not set',
      serviceId: serviceId ? serviceId.substring(0, 4) + '...' : 'not set',
      templateId: templateId ? templateId.substring(0, 4) + '...' : 'not set'
    });
  }, []);
  
  return (
    <BrowserRouter>
      <EventProvider>
        <div className="flex flex-col min-h-screen" style={{ background: 'linear-gradient(to right, rgb(160, 242, 254), rgb(246, 246, 219))' }}>
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
    </BrowserRouter>
  );
}

export default App;