import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = 'https://gmadjpdpvggfeqpiawdr.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtYWRqcGRwdmdnZmVxcGlhd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTk2NTcsImV4cCI6MjA2NDA3NTY1N30.aPkLUx3CfuLbLn7bQygwjIQLvpmCAEr3wwBYheEdXYY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
