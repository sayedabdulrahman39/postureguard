import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen font-sans flex flex-col selection:bg-accent-blue/30">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        <footer className="py-20 px-4 bg-white/40 backdrop-blur-md border-t border-white/60">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-2xl font-serif font-bold text-navy mb-2">
                PostureGuard
              </div>
              <p className="text-sm text-navy/60 font-medium">Protecting spines, preserving focus since 2026.</p>
            </div>
            
            <div className="flex gap-8 text-sm font-bold text-navy/70 uppercase tracking-widest">
              <Link to="/about" className="hover:text-accent-blue transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-accent-blue transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-accent-blue transition-colors">Contact</Link>
              <a href="https://github.com/sayedabdulrahman39/postureguard" target="_blank" rel="noreferrer" className="hover:text-accent-blue transition-colors">GitHub</a>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-navy/5 text-center text-xs font-bold text-navy/40 uppercase tracking-[0.2em]">
            © 2026 PostureGuard. All Rights Reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App
