import { createClient } from '@supabase/supabase-js';

// Ensure these values are correct
const SUPABASE_URL = 'https://mojzdvkodkssrzrwwusc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vanpkdmtvZGtzc3J6cnd3dXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDUxNjIsImV4cCI6MjA1MDY4MTE2Mn0.sE_ZwWXOJcFFG5VXJ7mCtPr-vf9neQc_qhn5tlECxSg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 