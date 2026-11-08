-- ==============================================================================
-- GREENSCOPE DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Platform Konservasi Pesisir dan Hutan Tropis Bengkulu
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('volunteer', 'coordinator');
CREATE TYPE ecosystem_type AS ENUM ('pesisir_pantai', 'mangrove', 'muara_sungai', 'hutan_tropis');
CREATE TYPE severity_level AS ENUM ('rendah', 'sedang', 'tinggi', 'kritis');
CREATE TYPE report_status AS ENUM ('menunggu', 'terverifikasi', 'dalam_aksi', 'pulih');
CREATE TYPE campaign_status AS ENUM ('direncanakan', 'berlangsung', 'selesai');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'volunteer'::user_role,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. REPORTS TABLE (ScopeLens Findings)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_name TEXT NOT NULL DEFAULT 'Warga Pelapor',
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_name TEXT NOT NULL,
    ecosystem ecosystem_type NOT NULL,
    urgency_score INTEGER CHECK (urgency_score >= 0 AND urgency_score <= 100) NOT NULL,
    severity severity_level NOT NULL,
    ai_analysis JSONB NOT NULL,
    status report_status DEFAULT 'menunggu'::report_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CAMPAIGNS TABLE (Action Brief & Restoration Movement)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    coordinator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    target_volunteers INTEGER DEFAULT 20,
    target_trees INTEGER DEFAULT 0,
    target_waste_kg DOUBLE PRECISION DEFAULT 0,
    actual_trees INTEGER DEFAULT 0,
    actual_waste_kg DOUBLE PRECISION DEFAULT 0,
    estimated_co2_kg DOUBLE PRECISION DEFAULT 0,
    action_brief JSONB,
    after_image_url TEXT,
    status campaign_status DEFAULT 'direncanakan'::campaign_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CAMPAIGN PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.campaign_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    volunteer_name TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(campaign_id, user_id)
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;

-- Read policies: Public can read everything
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public reports are viewable by everyone" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Public campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Public campaign participants are viewable by everyone" ON public.campaign_participants FOR SELECT USING (true);

-- Write policies: Authenticated users can insert
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone authenticated can create reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Coordinators or reporters can update reports" ON public.reports FOR UPDATE USING (true);
CREATE POLICY "Coordinators can create campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Coordinators can update campaigns" ON public.campaigns FOR UPDATE USING (true);
CREATE POLICY "Users can join campaigns" ON public.campaign_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can leave campaigns" ON public.campaign_participants FOR DELETE USING (true);

-- 8. INITIAL SEED DATA (FOKUS BENGKULU - PESISIR & HUTAN TROPIS)
INSERT INTO public.reports (
    title, description, image_url, latitude, longitude, location_name, ecosystem, urgency_score, severity, status, ai_analysis
) VALUES
(
    'Tumpukan Sampah Plastik & Ancaman Abrasi Pantai Panjang',
    'Ditemukan tumpukan limbah anorganik dan sisa jaring di bibir pantai pasir putih dekat pos wisata, menghambat vegetasi pandan laut.',
    'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    -3.8214, 102.2741,
    'Pantai Panjang, Kota Bengkulu',
    'pesisir_pantai',
    82,
    'tinggi',
    'dalam_aksi',
    '{
        "kategori": "Polusi Sampah Pesisir & Erosi Pasir",
        "spesies_rekomendasi": "Ipomoea pes-caprae (Tapak Kuda), Pandanus odoratissimus",
        "tindakan": ["Pembersihan sampah makro sepanjang 500m", "Pemasangan bronjong alami penahan pasir", "Pemberdayaan pedagang pesisir"],
        "risiko": "Degradasi habitat penyu bertelur dan penyumbatan muara saat pasang tinggi."
    }'::jsonb
),
(
    'Kerusakan Sabuk Mangrove Alami Pulau Baai',
    'Sebagian sabuk bibit mangrove mengalami kekeringan dan patah cabang akibat hempasan sampah kayu dan sedimentasi berlebih.',
    'https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=800&q=80',
    -3.9056, 102.3021,
    'Kawasan Konservasi Mangrove Pulau Baai, Bengkulu',
    'mangrove',
    91,
    'kritis',
    'menunggu',
    '{
        "kategori": "Degradasi Sabuk Mangrove Kritis",
        "spesies_rekomendasi": "Rhizophora apiculata (Bakau Minyak), Avicennia marina",
        "tindakan": ["Penanaman kembali 300 bibit Rhizophora", "Pembersihan lumpur padat & sampah jeratan", "Pemasangan pancang bambu pelindung ombak"],
        "risiko": "Hilangnya penahan intrusi air asin ke pemukiman dan penurunan potensi serapan karbon biru hingga 12 ton CO2e/ha."
    }'::jsonb
),
(
    'Sedimentasi & Limbah Domestik Muara Jenggalu',
    'Aliran muara sungai mengalami pendangkalan akibat endapan lumpur dan sampah rumah tangga yang terbawa arus hulu.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    -3.8567, 102.2890,
    'Muara Sungai Jenggalu, Bengkulu',
    'muara_sungai',
    68,
    'sedang',
    'terverifikasi',
    '{
        "kategori": "Pencemaran Muara & Hambatan Aliran",
        "spesies_rekomendasi": "Sonneratia alba (Pidada), Nypa fruticans (Nipah)",
        "tindakan": ["Pemasangan jaring perangkap sampah apung", "Pengerukan manual endapan tepi", "Edukasi warga bantaran sungai"],
        "risiko": "Pencemaran mikroplastik ke ekosistem terumbu karang terdekat dan penurunan tangkapan nelayan tradisional."
    }'::jsonb
),
(
    'Degradasi Tepi Hutan Tropis Koridor Bukit Barisan',
    'Penebangan ranting liar dan erosi lereng di jalur peralihan hulu menuju pesisir barat Sumatera.',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    -3.7120, 102.3850,
    'Koridor Bukit Barisan, Bengkulu Tengah',
    'hutan_tropis',
    75,
    'tinggi',
    'terverifikasi',
    '{
        "kategori": "Degradasi Kanopi & Erosi Lereng Hulu",
        "spesies_rekomendasi": "Shorea spp. (Meranti), Ficus fistulosa, Bambu Petung",
        "tindakan": ["Restorasi lereng dengan penanaman pohon berakar tunjang", "Pemasangan plang larangan pembukaan lahan", "Patroli partisipatif warga desa"],
        "risiko": "Potensi banjir bandang kiriman ke daerah hilir pesisir saat intensitas hujan tinggi."
    }'::jsonb
);
