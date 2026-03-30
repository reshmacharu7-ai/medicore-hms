// ============================================================
// SUPABASE CONFIG & AUTH
// ============================================================
const SUPABASE_URL = 'https://bqkhyrxiwltrojefewju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxa2h5cnhpd2x0cm9qZWZld2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NzI2NzksImV4cCI6MjA4OTM0ODY3OX0.wxyZA2L1zIgGhu4M5XNrvfkiohCoq-wV_uzCngkcApc';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentRole = null;
let currentProfile = null;

async function signIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signUp(email, password, metadata) {
  const { data, error } = await db.auth.signUp({
    email, password,
    options: { data: metadata }
  });
  if (error) throw error;
  return data;
}

async function signOut() {
  await db.auth.signOut();
  currentUser = null; currentRole = null; currentProfile = null;
  // Works from both root and /pages/ subfolder
  const depth = window.location.pathname.includes('/pages/') ? '../' : '';
  window.location.href = depth + 'login.html';
}

async function getSession() {
  const { data } = await db.auth.getSession();
  return data.session;
}

async function loadUserProfile(userId) {
  const { data } = await db.from('profiles').select('*').eq('id', userId).single();
  return data;
}

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    const depth = window.location.pathname.includes('/pages/') ? '../' : '';
    window.location.href = depth + 'login.html';
    return null;
  }
  currentUser = session.user;
  currentProfile = await loadUserProfile(currentUser.id);
  currentRole = currentProfile?.role || 'admin';
  return { user: currentUser, profile: currentProfile, role: currentRole };
}

const ROLE_PERMISSIONS = {
  admin: ['dashboard','patients','doctors','appointments','beds','billing','records','emergency','settings','notifications'],
  doctor: ['dashboard','patients','appointments','records'],
  receptionist: ['dashboard','patients','appointments','beds','billing'],
  patient: ['dashboard','appointments','records','billing']
};

function hasPermission(page) {
  return (ROLE_PERMISSIONS[currentRole] || []).includes(page);
}

function subscribeToTable(table, callback) {
  return db.channel(`${table}-changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
}
