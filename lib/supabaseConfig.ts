// This file will contain Supabase configuration
// To use this, you'll need to:
// 1. Create a Supabase project at https://supabase.com
// 2. Install @supabase/supabase-js: npm install @supabase/supabase-js
// 3. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseConfig.url && supabaseConfig.anonKey);
};

// Types for database operations
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface SavedPortfolio {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  assets: Array<{
    id?: string;
    portfolio_id?: string;
    asset_name: string;
    asset_type: string;
    risk_score?: number;
  }>;
}
