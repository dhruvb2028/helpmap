import { createClient } from '@supabase/supabase-js';

export const supabaseBrowser = () => {
  if (typeof window === 'undefined') {
    console.log('Window not available, cannot create browser client');
    return null;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase browser credentials not configured');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const isSupabaseBrowserAvailable = () => {
  return typeof window !== 'undefined' && 
         !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};
