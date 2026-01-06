-- =============================================
-- PULSE. Database Schema for Supabase
-- Wellness & Body Awareness Tracking Application
-- =============================================

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- Stores user profile information
-- Links to Supabase Auth users
-- =============================================
CREATE TABLE public.profiles (
    -- Primary key: UUID from Supabase Auth
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- User's display name
    full_name TEXT,
    
    -- Profile avatar URL
    avatar_url TEXT,
    
    -- User's preferred timezone
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    
    -- User's birth date (optional, for age-related insights)
    birth_date DATE,
    
    -- Notification preferences
    notifications_enabled BOOLEAN DEFAULT true,
    
    -- Daily check-in reminder time (24h format)
    reminder_time TIME DEFAULT '09:00:00',
    
    -- Account creation timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Last profile update timestamp
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment on table
COMMENT ON TABLE public.profiles IS 'User profile information extending Supabase Auth';

-- =============================================
-- DAILY_CHECKINS TABLE
-- Stores daily wellness check-in records
-- One entry per user per day
-- =============================================
CREATE TABLE public.daily_checkins (
    -- Unique identifier for each check-in
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference to the user who made the check-in
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Date of the check-in (only date, no time)
    checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Energy level (1-10 scale)
    -- 1 = Completely exhausted, 10 = Extremely energetic
    energy_level SMALLINT CHECK (energy_level >= 1 AND energy_level <= 10),
    
    -- Sleep quality (1-10 scale)
    -- 1 = Terrible sleep, 10 = Perfect sleep
    sleep_quality SMALLINT CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    
    -- Mood score (1-10 scale)
    -- 1 = Very negative mood, 10 = Excellent mood
    mood_score SMALLINT CHECK (mood_score >= 1 AND mood_score <= 10),
    
    -- Fatigue level (1-10 scale)
    -- 1 = No fatigue, 10 = Extreme fatigue
    fatigue_level SMALLINT CHECK (fatigue_level >= 1 AND fatigue_level <= 10),
    
    -- Optional notes from the user
    notes TEXT,
    
    -- Timestamp when the check-in was created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamp when the check-in was last updated
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one check-in per user per day
    UNIQUE(user_id, checkin_date)
);

-- Comment on table
COMMENT ON TABLE public.daily_checkins IS 'Daily wellness check-in records tracking energy, sleep, mood, and fatigue';

-- Create index for faster queries by user and date
CREATE INDEX idx_checkins_user_date ON public.daily_checkins(user_id, checkin_date DESC);

-- =============================================
-- BODY_PAIN_RECORDS TABLE
-- Stores body pain/discomfort information
-- Multiple entries per check-in possible
-- =============================================
CREATE TABLE public.body_pain_records (
    -- Unique identifier for each pain record
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference to the daily check-in
    checkin_id UUID NOT NULL REFERENCES public.daily_checkins(id) ON DELETE CASCADE,
    
    -- Reference to the user (for easier querying)
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Body part identifier (matches frontend BodyMap component)
    -- Examples: 'head', 'neck', 'shoulder_left', 'lower_back', etc.
    body_part TEXT NOT NULL,
    
    -- Pain intensity (1-10 scale)
    -- 1 = Mild discomfort, 10 = Severe pain
    pain_intensity SMALLINT CHECK (pain_intensity >= 1 AND pain_intensity <= 10),
    
    -- Type of pain (optional)
    -- Examples: 'sharp', 'dull', 'throbbing', 'burning', 'aching'
    pain_type TEXT,
    
    -- Optional description of the pain
    description TEXT,
    
    -- Timestamp when the record was created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment on table
COMMENT ON TABLE public.body_pain_records IS 'Records of body pain/discomfort associated with daily check-ins';

-- Create index for faster queries
CREATE INDEX idx_pain_user_date ON public.body_pain_records(user_id, created_at DESC);
CREATE INDEX idx_pain_checkin ON public.body_pain_records(checkin_id);
CREATE INDEX idx_pain_body_part ON public.body_pain_records(body_part);

-- =============================================
-- BODY_METRICS TABLE
-- Stores optional body measurements over time
-- For users who want to track physical metrics
-- =============================================
CREATE TABLE public.body_metrics (
    -- Unique identifier for each metric record
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference to the user
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Date of the measurement
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Weight in kilograms (optional)
    weight_kg DECIMAL(5,2),
    
    -- Height in centimeters (optional, usually recorded once)
    height_cm DECIMAL(5,2),
    
    -- Resting heart rate in BPM (optional)
    resting_heart_rate SMALLINT,
    
    -- Blood pressure - systolic (optional)
    blood_pressure_systolic SMALLINT,
    
    -- Blood pressure - diastolic (optional)
    blood_pressure_diastolic SMALLINT,
    
    -- Optional notes
    notes TEXT,
    
    -- Timestamp when the record was created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamp when the record was last updated
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one metric record per user per day
    UNIQUE(user_id, measurement_date)
);

-- Comment on table
COMMENT ON TABLE public.body_metrics IS 'Optional body measurements and physical metrics tracked over time';

-- Create index for faster queries
CREATE INDEX idx_metrics_user_date ON public.body_metrics(user_id, measurement_date DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can only access their own data
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_pain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Daily check-ins: Users can only access their own check-ins
CREATE POLICY "Users can view own check-ins" 
    ON public.daily_checkins FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins" 
    ON public.daily_checkins FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins" 
    ON public.daily_checkins FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins" 
    ON public.daily_checkins FOR DELETE 
    USING (auth.uid() = user_id);

-- Body pain records: Users can only access their own records
CREATE POLICY "Users can view own pain records" 
    ON public.body_pain_records FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pain records" 
    ON public.body_pain_records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pain records" 
    ON public.body_pain_records FOR DELETE 
    USING (auth.uid() = user_id);

-- Body metrics: Users can only access their own metrics
CREATE POLICY "Users can view own metrics" 
    ON public.body_metrics FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics" 
    ON public.body_metrics FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics" 
    ON public.body_metrics FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own metrics" 
    ON public.body_metrics FOR DELETE 
    USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- Automatic timestamp updates and profile creation
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for daily_checkins table
CREATE TRIGGER on_checkins_updated
    BEFORE UPDATE ON public.daily_checkins
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for body_metrics table
CREATE TRIGGER on_metrics_updated
    BEFORE UPDATE ON public.body_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SAMPLE QUERIES FOR COMMON USE CASES
-- =============================================

-- Get user's check-ins for the last 7 days
-- SELECT * FROM public.daily_checkins 
-- WHERE user_id = auth.uid() 
-- AND checkin_date >= CURRENT_DATE - INTERVAL '7 days'
-- ORDER BY checkin_date DESC;

-- Get average metrics for the current month
-- SELECT 
--     AVG(energy_level) as avg_energy,
--     AVG(sleep_quality) as avg_sleep,
--     AVG(mood_score) as avg_mood,
--     AVG(fatigue_level) as avg_fatigue
-- FROM public.daily_checkins
-- WHERE user_id = auth.uid()
-- AND checkin_date >= DATE_TRUNC('month', CURRENT_DATE);

-- Get most common pain areas for a user
-- SELECT body_part, COUNT(*) as frequency
-- FROM public.body_pain_records
-- WHERE user_id = auth.uid()
-- GROUP BY body_part
-- ORDER BY frequency DESC
-- LIMIT 5;
