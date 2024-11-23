import { createClient } from '../utils/supabase/client';

export const useSupabaseClient = () => {
  const client = createClient();
  return client;
};
