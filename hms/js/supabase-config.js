/* ============================================================
   SUPABASE CONFIGURATION
   Replace with your actual Supabase project credentials
   ============================================================ */

// ── Supabase Config ──
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// Initialize Supabase client
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Export for use across modules ──
window.supabaseClient = sb;

// ── Database Schema Reference (run in Supabase SQL editor) ──
/*
-- USERS (profiles) table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin','doctor','receptionist','patient')) DEFAULT 'patient',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users manage own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- DOCTORS table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  availability TEXT DEFAULT 'available',
  department TEXT,
  experience_years INT,
  fee DECIMAL(10,2) DEFAULT 500,
  profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors readable by all auth users" ON doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages doctors" ON doctors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PATIENTS table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INT,
  gender TEXT CHECK (gender IN ('male','female','other')),
  blood_group TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact TEXT,
  medical_history TEXT,
  allergies TEXT,
  status TEXT DEFAULT 'active',
  profile_id UUID REFERENCES profiles(id),
  registered_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients accessible by staff" ON patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manages patients" ON patients FOR ALL TO authenticated USING (true);

-- APPOINTMENTS table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  type TEXT DEFAULT 'consultation',
  status TEXT CHECK (status IN ('scheduled','completed','cancelled','no-show')) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Appointments visible to auth users" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manages appointments" ON appointments FOR ALL TO authenticated USING (true);

-- BEDS table
CREATE TABLE beds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bed_number TEXT NOT NULL UNIQUE,
  ward TEXT CHECK (ward IN ('ICU','General','Emergency','Private','Pediatric')) NOT NULL,
  status TEXT CHECK (status IN ('available','occupied','cleaning')) DEFAULT 'available',
  patient_id UUID REFERENCES patients(id),
  admitted_date DATE,
  daily_charge DECIMAL(10,2) DEFAULT 1000,
  floor INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Beds visible to all auth users" ON beds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manages beds" ON beds FOR ALL TO authenticated USING (true);

-- BILLING table
CREATE TABLE billing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  doctor_fee DECIMAL(10,2) DEFAULT 0,
  bed_charges DECIMAL(10,2) DEFAULT 0,
  medicine_charges DECIMAL(10,2) DEFAULT 0,
  other_charges DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('paid','pending','partial')) DEFAULT 'pending',
  payment_method TEXT,
  bill_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Billing visible to auth users" ON billing FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manages billing" ON billing FOR ALL TO authenticated USING (true);

-- MEDICAL RECORDS table
CREATE TABLE medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  diagnosis TEXT,
  prescription TEXT,
  file_url TEXT,
  file_name TEXT,
  record_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Records visible to auth users" ON medical_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manages records" ON medical_records FOR ALL TO authenticated USING (true);

-- NOTIFICATIONS table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Trigger: Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- SEED: Sample beds
INSERT INTO beds (bed_number, ward, status) VALUES
  ('ICU-01','ICU','available'),('ICU-02','ICU','occupied'),('ICU-03','ICU','available'),
  ('ICU-04','ICU','cleaning'),('ICU-05','ICU','available'),('ICU-06','ICU','occupied'),
  ('GEN-01','General','available'),('GEN-02','General','available'),('GEN-03','General','occupied'),
  ('GEN-04','General','available'),('GEN-05','General','cleaning'),('GEN-06','General','occupied'),
  ('GEN-07','General','available'),('GEN-08','General','available'),('GEN-09','General','occupied'),
  ('GEN-10','General','available'),('GEN-11','General','available'),('GEN-12','General','available'),
  ('EMR-01','Emergency','occupied'),('EMR-02','Emergency','available'),('EMR-03','Emergency','occupied'),
  ('EMR-04','Emergency','available'),('EMR-05','Emergency','cleaning'),('EMR-06','Emergency','available'),
  ('PRI-01','Private','available'),('PRI-02','Private','occupied'),('PRI-03','Private','available'),
  ('PED-01','Pediatric','available'),('PED-02','Pediatric','occupied'),('PED-03','Pediatric','available');
*/
