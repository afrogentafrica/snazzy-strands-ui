
import { createClient } from '@supabase/supabase-js';

// Check if the environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error(
    "Supabase URL is missing! Make sure VITE_SUPABASE_URL is set in your environment variables."
  );
  // Using a placeholder URL to prevent immediate crashes, but the app won't function correctly
  // This allows the app to at least render an error message to the user
}

if (!supabaseAnonKey) {
  console.error(
    "Supabase Anon Key is missing! Make sure VITE_SUPABASE_ANON_KEY is set in your environment variables."
  );
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
