import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client instance
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// Add type definitions to match Supabase's interface
declare global {
  interface Window {
    crypto: {
      randomUUID: () => string;
    };
  }
} 