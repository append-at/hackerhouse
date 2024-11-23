// WARNING: DO NOT USE THIS IN CLIENT SIDE

import { Database } from '@/database.types';
import { createClient } from '@supabase/supabase-js';

export const createAdminSupabase = () =>
  createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
