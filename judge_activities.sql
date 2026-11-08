-- ==============================================================================
-- SKRIP SQL SUPABASE: TABEL PELACAKAN AKTIVITAS DEWAN JURI & RELAWAN
-- Jalankan skrip ini di Dashboard Supabase > SQL Editor > New query > Run.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.judge_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  role TEXT NOT NULL,
  action_type TEXT NOT NULL,
  ip_info TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.judge_activities ENABLE ROW LEVEL SECURITY;

-- Izinkan public / anon user untuk mencatat audit aktivitas login
CREATE POLICY "Allow public insert judge_activities" 
  ON public.judge_activities 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Izinkan pembacaan log untuk dashboard
CREATE POLICY "Allow read judge_activities" 
  ON public.judge_activities 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Index waktu agar pemuatan riwayat cepat
CREATE INDEX IF NOT EXISTS idx_judge_activities_created_at 
  ON public.judge_activities (created_at DESC);
