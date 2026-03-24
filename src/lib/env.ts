export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.trim() ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '',
  enableMock: (import.meta.env.VITE_ENABLE_SUPABASE_MOCK ?? 'true').toLowerCase() !== 'false',
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const dataMode = isSupabaseConfigured ? 'supabase' : env.enableMock ? 'mock' : 'disabled';
