import { createBrowserSupabase } from '@/lib/db/client-rls';

export const useSupabaseClient = () => {
  const client = createBrowserSupabase();
  return client;
};
