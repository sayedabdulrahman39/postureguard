import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download, LayoutDashboard, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path) => {
    return location.pathname === path 
      ? "text-accent-blue font-bold" 
      : "text-navy/70 hover:text-navy transition-colors duration-300";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-6">
      <div className="max-w-7xl mx-auto glass-card h-16 flex items-center justify-between px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="text-2xl font-serif font-bold tracking-tight text-navy">
            PostureGuard
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/about" className={isActive('/about')}>About Us</Link>
          <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
          <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          {user ? (
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
          ) : (
            <Link to="/login" className={isActive('/login')}>Sign In</Link>
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest text-navy/60 hover:text-alert-red transition-colors"
            >
              Logout
            </motion.button>
          ) : null}
          <a href="/PostureGuard.zip" download className="glass-button text-sm bg-navy text-white hover:bg-navy/90 transition-all no-underline inline-block">
            Download App
          </a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
