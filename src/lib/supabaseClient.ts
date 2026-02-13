import { createClient } from '@supabase/supabase-js'

// Your Supabase project URL
const supabaseUrl = 'https://ajqbzwhmtmjtxgzmmigy.supabase.co'

// Your Supabase anon/public key (from Supabase → Settings → API → Project API Keys → anon/public)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcWJ6d2htdG1qdHhnem1taWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTQ3MDUsImV4cCI6MjA4NjQ5MDcwNX0.3GnwxN6QPynStkWZhxs6nZDW9Xz5xUQJh0_qjLNQLOc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)