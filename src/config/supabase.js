import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

// Client for user operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Service client for admin operations
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);
