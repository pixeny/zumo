import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Copy server/.env.example to server/.env and fill in your project values.'
  )
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || 'placeholder-service-role-key',
  { auth: { autoRefreshToken: false, persistSession: false } }
)
