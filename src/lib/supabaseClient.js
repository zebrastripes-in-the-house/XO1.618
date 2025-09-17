import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://uvzbtuolvgdvwkygksqt.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2emJ0dW9sdmdkdndreWdrc3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTY3ODAsImV4cCI6MjA3MzYzMjc4MH0.lXuSBZd2b04hBAkWzxpl-kwBfwRNPsrZhkJAj7TXzoo";

// Check if environment variables are properly set
const isSupabaseConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !==
    "https://uvzbtuolvgdvwkygksqt.supabase.co" &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !==
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2emJ0dW9sdmdkdndreWdrc3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTY3ODAsImV4cCI6MjA3MzYzMjc4MH0.lXuSBZd2b04hBAkWzxpl-kwBfwRNPsrZhkJAj7TXzoo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a flag to check if Supabase is properly configured
export const isSupabaseReady = isSupabaseConfigured;
