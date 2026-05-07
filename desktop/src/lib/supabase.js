const { createClient } = require('@supabase/supabase-js');

// Using the credentials provided by the user
const supabaseUrl = 'https://gxxjimpllictaxfxhjux.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4eGppbXBsbGljdGF4ZnhoanV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTc2MTYsImV4cCI6MjA5MzEzMzYxNn0.feIBOmWbxBdmxyc7-OuyJpGV--PC339KjwjShfmsyM0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
