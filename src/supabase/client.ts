import { createClient } from '@supabase/supabase-js';

const projectURL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const projectKey = import.meta.env.VITE_SUPABASE_PROJECT_APPKEY;

export const supabase = createClient(projectURL, projectKey);