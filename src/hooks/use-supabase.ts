import { createBrowserSupabase } from '@/lib/db/supabase/browser';

export const useSupabaseClient = () => {
  const client = createBrowserSupabase();
  return client;
};
