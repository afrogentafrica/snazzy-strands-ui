
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase URL and anon key
const supabaseUrl = "https://irwoefmbkcozwbgpfxxz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyd29lZm1ia2NvendiZ3BmeHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjgxNDYsImV4cCI6MjA1OTAwNDE0Nn0.ndW5aFWhFdb5l5XUElSRo8jCnuKuA5xf8H4wtDg65zg";

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // We now have hardcoded values, so it's always configured
};
