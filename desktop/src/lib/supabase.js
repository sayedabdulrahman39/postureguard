const { createClient } = require('@supabase/supabase-js');
const { app } = require('electron');
const fs = require('fs');
const path = require('path');

// Simple file-based storage for Supabase persistence in the Main process
const fileStorage = {
  getItem: (key) => {
    try {
      const storageDir = app.getPath('userData');
      const filePath = path.join(storageDir, `sb-${key}.json`);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch (e) {
      console.error('Error reading auth storage:', e);
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      const storageDir = app.getPath('userData');
      const filePath = path.join(storageDir, `sb-${key}.json`);
      fs.writeFileSync(filePath, value);
    } catch (e) {
      console.error('Error writing auth storage:', e);
    }
  },
  removeItem: (key) => {
    try {
      const storageDir = app.getPath('userData');
      const filePath = path.join(storageDir, `sb-${key}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('Error removing auth storage:', e);
    }
  }
};

const supabaseUrl = 'https://gxxjimpllictaxfxhjux.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4eGppbXBsbGljdGF4ZnhoanV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTc2MTYsImV4cCI6MjA5MzEzMzYxNn0.feIBOmWbxBdmxyc7-OuyJpGV--PC339KjwjShfmsyM0';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: fileStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

module.exports = { supabase };
