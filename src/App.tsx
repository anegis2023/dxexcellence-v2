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