import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Generator from './pages/Generator';
import { EventProvider } from './context/EventContext';
import './App.css';

function App() {
  useEffect(() => {
    document.title = "LinkedIn Event Graphics Generator";
  }, []);
  
  return (
    <BrowserRouter>
      <EventProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
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