// frontend/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// SAFE: This uses the NEXT_PUBLIC_ key which is meant for the browser
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // MUST BE THE ANON KEY
);