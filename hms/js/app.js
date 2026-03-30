/* ============================================================
   APP CORE - Utilities, Mock Data, State Management
   ============================================================ */

// ── App State ──
const AppState = {
  user: null,
  role: 'admin',
  theme: localStorage.getItem('hms_theme') || 'dark',
  sidebarCollapsed: localStorage.getItem('hms_sidebar') === 'true',
  currentPage: 'dashboard',
  notifications: [],
  data: {
    patients: [], doctors: [], appointments: [],
    beds: [], billing: [], records: []
  }
};

// ── Mock Data (used when Supabase is not configured) ──
const MockData = {
  patients: [
    { id: 'p1', name: 'Arjun Sharma', age: 34, gender: 'male', blood_group: 'A+', phone: '+91-9876543210', status: 'active', registered_date: '2024-01-15', medical_history: 'Hypertension' },
    { id: 'p2', name: 'Priya Nair', age: 28, gender: 'female', blood_group: 'O+', phone: '+91-9845123456', status: 'active', registered_date: '2024-02-10', medical_history: 'Diabetes Type 2' },
    { id: 'p3', name: 'Ravi Kumar', age: 52, gender: 'male', blood_group: 'B+', phone: '+91-9731234567', status: 'admitted', registered_date: '2024-03-05', medical_history: 'Cardiac Issues' },
    { id: 'p4', name: 'Meena Pillai', age: 45, gender: 'female', blood_group: 'AB-', phone: '+91-9652345678', status: 'discharged', registered_date: '2024-01-28', medical_history: 'Arthritis' },
    { id: 'p5', name: 'Suresh Reddy', age: 61, gender: 'male', blood_group: 'O-', phone: '+91-9543456789', status: 'active', registered_date: '2024-04-12', medical_history: 'Asthma' },
    { id: 'p6', name: 'Kavitha Devi', age: 38, gender: 'female', blood_group: 'A-', phone: '+91-9434567890', status: 'active', registered_date: '2024-05-01', medical_history: 'None' },
    { id: 'p7', name: 'Mohan Das', age: 22, gender: 'male', blood_group: 'B-', phone: '+91-9325678901', status: 'active', registered_date: '2024-05-15', medical_history: 'Allergy' },
    { id: 'p8', name: 'Lakshmi Menon', age: 55, gender: 'female', blood_group: 'O+', phone: '+91-9216789012', status: 'admitted', registered_date: '2024-06-01', medical_history: 'Post-surgery recovery' },
  ],
  doctors: [
    { id: 'd1', name: 'Dr. Ananya Krishnan', specialization: 'Cardiologist', department: 'Cardiology', phone: '+91-9876500001', availability: 'available', experience_years: 12, fee: 800 },
    { id: 'd2', name: 'Dr. Rajesh Iyer', specialization: 'Neurologist', department: 'Neurology', phone: '+91-9876500002', availability: 'available', experience_years: 15, fee: 1000 },
    { id: 'd3', name: 'Dr. Smitha George', specialization: 'Pediatrician', department: 'Pediatrics', phone: '+91-9876500003', availability: 'on-leave', experience_years: 8, fee: 600 },
    { id: 'd4', name: 'Dr. Vikram Rao', specialization: 'Orthopedic', department: 'Orthopedics', phone: '+91-9876500004', availability: 'available', experience_years: 20, fee: 900 },
    { id: 'd5', name: 'Dr. Deepa Nambiar', specialization: 'Dermatologist', department: 'Dermatology', phone: '+91-9876500005', availability: 'available', experience_years: 10, fee: 700 },
    { id: 'd6', name: 'Dr. Arun Menon', specialization: 'General Physician', department: 'General', phone: '+91-9876500006', availability: 'busy', experience_years: 6, fee: 500 },
  ],
  appointments: [
    { id: 'a1', patient_name: 'Arjun Sharma', doctor_name: 'Dr. Ananya Krishnan', appointment_date: '2025-03-17', appointment_time: '09:00', type: 'consultation', status: 'scheduled' },
    { id: 'a2', patient_name: 'Priya Nair', doctor_name: 'Dr. Rajesh Iyer', appointment_date: '2025-03-17', appointment_time: '10:30', type: 'follow-up', status: 'completed' },
    { id: 'a3', patient_name: 'Ravi Kumar', doctor_name: 'Dr. Vikram Rao', appointment_date: '2025-03-17', appointment_time: '11:00', type: 'emergency', status: 'scheduled' },
    { id: 'a4', patient_name: 'Meena Pillai', doctor_name: 'Dr. Deepa Nambiar', appointment_date: '2025-03-18', appointment_time: '14:00', type: 'consultation', status: 'cancelled' },
    { id: 'a5', patient_name: 'Suresh Reddy', doctor_name: 'Dr. Arun Menon', appointment_date: '2025-03-18', appointment_time: '15:30', type: 'follow-up', status: 'scheduled' },
    { id: 'a6', patient_name: 'Kavitha Devi', doctor_name: 'Dr. Smitha George', appointment_date: '2025-03-19', appointment_time: '09:30', type: 'consultation', status: 'scheduled' },
  ],
  beds: [
    ...Array.from({length:6}, (_,i) => ({ id:`b-icu-${i+1}`, bed_number:`ICU-0${i+1}`, ward:'ICU', status: ['available','occupied','available','cleaning','available','occupied'][i], daily_charge: 3000 })),
    ...Array.from({length:12}, (_,i) => ({ id:`b-gen-${i+1}`, bed_number:`GEN-${String(i+1).padStart(2,'0')}`, ward:'General', status: ['available','available','occupied','available','cleaning','occupied','available','available','occupied','available','available','available'][i], daily_charge: 1000 })),
    ...Array.from({length:6}, (_,i) => ({ id:`b-emr-${i+1}`, bed_number:`EMR-0${i+1}`, ward:'Emergency', status: ['occupied','available','occupied','available','cleaning','available'][i], daily_charge: 2000 })),
    ...Array.from({length:3}, (_,i) => ({ id:`b-pri-${i+1}`, bed_number:`PRI-0${i+1}`, ward:'Private', status: ['available','occupied','available'][i], daily_charge: 5000 })),
    ...Array.from({length:3}, (_,i) => ({ id:`b-ped-${i+1}`, bed_number:`PED-0${i+1}`, ward:'Pediatric', status: ['available','occupied','available'][i], daily_charge: 1500 })),
  ],
  billing: [
    { id: 'bill1', patient_name: 'Arjun Sharma', doctor_name: 'Dr. Ananya Krishnan', doctor_fee: 800, bed_charges: 3000, medicine_charges: 450, other_charges: 200, total_amount: 4450, status: 'paid', bill_date: '2025-03-10', payment_method: 'card' },
    { id: 'bill2', patient_name: 'Priya Nair', doctor_name: 'Dr. Rajesh Iyer', doctor_fee: 1000, bed_charges: 2000, medicine_charges: 750, other_charges: 0, total_amount: 3750, status: 'pending', bill_date: '2025-03-15', payment_method: null },
    { id: 'bill3', patient_name: 'Ravi Kumar', doctor_name: 'Dr. Vikram Rao', doctor_fee: 900, bed_charges: 6000, medicine_charges: 1200, other_charges: 500, total_amount: 8600, status: 'partial', bill_date: '2025-03-12', payment_method: 'cash' },
    { id: 'bill4', patient_name: 'Meena Pillai', doctor_name: 'Dr. Deepa Nambiar', doctor_fee: 700, bed_charges: 0, medicine_charges: 320, other_charges: 0, total_amount: 1020, status: 'paid', bill_date: '2025-03-08', payment_method: 'upi' },
    { id: 'bill5', patient_name: 'Suresh Reddy', doctor_name: 'Dr. Arun Menon', doctor_fee: 500, bed_charges: 1000, medicine_charges: 180, other_charges: 100, total_amount: 1780, status: 'pending', bill_date: '2025-03-16', payment_method: null },
  ],
  stats: {
    totalPatients: 8, totalDoctors: 6, todayAppointments: 6,
    bedsAvailable: 18, bedsOccupied: 8, totalRevenue: 284500,
    monthRevenue: 42750, emergencyCases: 3
  }
};

// ── Toast Notifications ──
const Toast = {
  container: null,
  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.id = 'toastContainer';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span>${message}</span>
    `;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  success(m) { this.show(m, 'success'); },
  error(m) { this.show(m, 'error'); },
  warning(m) { this.show(m, 'warning'); },
  info(m) { this.show(m, 'info'); }
};

// Add toast out animation
const toastStyle = document.createElement('style');
toastStyle.textContent = `@keyframes toastOut { to { opacity: 0; transform: translateX(40px); } }`;
document.head.appendChild(toastStyle);

// ── Theme Manager ──
const ThemeManager = {
  init() {
    document.documentElement.setAttribute('data-theme', AppState.theme);
  },
  toggle() {
    AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('hms_theme', AppState.theme);
    document.documentElement.setAttribute('data-theme', AppState.theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = AppState.theme === 'dark' ? '☀️' : '🌙';
  }
};

// ── Auth Manager ──
const Auth = {
  async login(email, password) {
    if (window.supabaseClient) {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
    // Mock login
    return { user: { id: 'mock-user', email, role: 'admin' } };
  },
  async signup(email, password, fullName, role) {
    if (window.supabaseClient) {
      const { data, error } = await window.supabaseClient.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, role } }
      });
      if (error) throw error;
      return data;
    }
    return { user: { id: 'mock-user', email, role } };
  },
  async logout() {
    if (window.supabaseClient) {
      await window.supabaseClient.auth.signOut();
    }
    AppState.user = null;
    window.location.href = 'index.html';
  },
  async getSession() {
    if (window.supabaseClient) {
      const { data } = await window.supabaseClient.auth.getSession();
      return data.session;
    }
    return { user: JSON.parse(localStorage.getItem('hms_mock_user') || 'null') };
  }
};

// ── DB Helper ──
const DB = {
  async fetch(table, filters = {}) {
    if (!window.supabaseClient || SUPABASE_URL.includes('YOUR_PROJECT')) {
      return MockData[table] || [];
    }
    let query = window.supabaseClient.from(table).select('*');
    Object.entries(filters).forEach(([k, v]) => { query = query.eq(k, v); });
    const { data, error } = await query;
    if (error) { console.error(error); return []; }
    return data;
  },
  async insert(table, row) {
    if (!window.supabaseClient || SUPABASE_URL.includes('YOUR_PROJECT')) {
      const id = 'mock_' + Date.now();
      const record = { ...row, id, created_at: new Date().toISOString() };
      if (MockData[table]) MockData[table].unshift(record);
      return record;
    }
    const { data, error } = await window.supabaseClient.from(table).insert(row).select().single();
    if (error) throw error;
    return data;
  },
  async update(table, id, updates) {
    if (!window.supabaseClient || SUPABASE_URL.includes('YOUR_PROJECT')) {
      if (MockData[table]) {
        const idx = MockData[table].findIndex(r => r.id === id);
        if (idx > -1) MockData[table][idx] = { ...MockData[table][idx], ...updates };
        return MockData[table][idx];
      }
      return null;
    }
    const { data, error } = await window.supabaseClient.from(table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(table, id) {
    if (!window.supabaseClient || SUPABASE_URL.includes('YOUR_PROJECT')) {
      if (MockData[table]) {
        MockData[table] = MockData[table].filter(r => r.id !== id);
      }
      return true;
    }
    const { error } = await window.supabaseClient.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// ── Helpers ──
const Utils = {
  initials(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  },
  formatDate(date) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },
  formatCurrency(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
  },
  statusBadge(status) {
    const map = {
      active: 'badge-success', available: 'badge-success',
      admitted: 'badge-info', scheduled: 'badge-info',
      occupied: 'badge-danger',
      discharged: 'badge-warning', cancelled: 'badge-danger',
      completed: 'badge-teal', paid: 'badge-success',
      pending: 'badge-warning', partial: 'badge-purple',
      cleaning: 'badge-warning', 'on-leave': 'badge-warning',
      busy: 'badge-danger', 'no-show': 'badge-danger'
    };
    return map[status] || 'badge-info';
  },
  avatarClass(index) {
    const classes = ['avatar-teal', 'avatar-blue', 'avatar-orange'];
    return classes[index % classes.length];
  },
  debounce(fn, delay = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  }
};

// ── Sidebar & Layout Manager ──
const Layout = {
  init() {
    ThemeManager.init();
    this.renderSidebar();
    this.bindEvents();
  },
  renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (AppState.sidebarCollapsed) sidebar.classList.add('collapsed');

    const navItems = [
      { icon: '📊', label: 'Dashboard', page: 'dashboard', section: 'MAIN' },
      { icon: '👤', label: 'Patients', page: 'patients', section: null },
      { icon: '👨‍⚕️', label: 'Doctors', page: 'doctors', section: null },
      { icon: '📅', label: 'Appointments', page: 'appointments', section: null, badge: '3' },
      { icon: '🛏️', label: 'Bed Management', page: 'beds', section: 'OPERATIONS' },
      { icon: '💊', label: 'Billing', page: 'billing', section: null },
      { icon: '🚑', label: 'Emergency', page: 'emergency', section: null, badge: '!' },
      { icon: '📁', label: 'Medical Records', page: 'records', section: 'CLINICAL' },
      { icon: '🔔', label: 'Notifications', page: 'notifications', section: 'SYSTEM' },
      { icon: '⚙️', label: 'Settings', page: 'settings', section: null },
    ];

    const navEl = sidebar.querySelector('.sidebar-nav');
    if (!navEl) return;

    let lastSection = null;
    let html = '';
    navItems.forEach(item => {
      if (item.section && item.section !== lastSection) {
        html += `<div class="nav-section-label">${item.section}</div>`;
        lastSection = item.section;
      }
      const active = AppState.currentPage === item.page ? 'active' : '';
      const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
      html += `<a class="nav-item ${active}" onclick="navigate('${item.page}')" href="#">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>${badge}
      </a>`;
    });

    navEl.innerHTML = html;
  },
  bindEvents() {
    const toggle = document.getElementById('sidebarToggle');
    if (toggle) toggle.addEventListener('click', () => this.toggleSidebar());

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.innerHTML = AppState.theme === 'dark' ? '☀️' : '🌙';
      themeBtn.addEventListener('click', () => ThemeManager.toggle());
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => Auth.logout());

    // Mobile overlay click
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('mobile-open');
      overlay.classList.remove('visible');
    });
  },
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('mainContent');
    const overlay = document.getElementById('sidebarOverlay');

    if (window.innerWidth <= 1024) {
      sidebar?.classList.toggle('mobile-open');
      overlay?.classList.toggle('visible');
    } else {
      sidebar?.classList.toggle('collapsed');
      main?.classList.toggle('expanded');
      AppState.sidebarCollapsed = sidebar?.classList.contains('collapsed');
      localStorage.setItem('hms_sidebar', AppState.sidebarCollapsed);
    }
  }
};

// ── Page Navigation ──
function navigate(page) {
  const pageMap = {
    dashboard: 'index.html',
    patients: 'pages/patients.html',
    doctors: 'pages/doctors.html',
    appointments: 'pages/appointments.html',
    beds: 'pages/beds.html',
    billing: 'pages/billing.html',
    emergency: 'pages/emergency.html',
    records: 'pages/records.html',
    notifications: 'pages/notifications.html',
    settings: 'pages/settings.html',
  };
  const url = pageMap[page];
  if (url) window.location.href = url;
}

// ── Pagination Helper ──
function renderPagination(containerId, total, perPage, current, onChangeFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) { container.innerHTML = ''; return; }
  let html = '';
  if (current > 1) html += `<div class="page-btn" onclick="${onChangeFn}(${current - 1})">‹</div>`;
  for (let i = 1; i <= pages; i++) {
    html += `<div class="page-btn ${i === current ? 'active' : ''}" onclick="${onChangeFn}(${i})">${i}</div>`;
  }
  if (current < pages) html += `<div class="page-btn" onclick="${onChangeFn}(${current + 1})">›</div>`;
  container.innerHTML = html;
}

// ── Confirm Dialog ──
function confirmDialog(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:380px">
      <div style="text-align:center;padding:10px 0">
        <div style="font-size:2.5rem;margin-bottom:12px">⚠️</div>
        <h3 style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:8px">Are you sure?</h3>
        <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:24px">${message}</p>
        <div style="display:flex;gap:10px;justify-content:center">
          <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-danger" id="confirmYes">Delete</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('confirmYes').onclick = () => { overlay.remove(); onConfirm(); };
}

// ── Real-time listener for beds ──
function setupRealtimeBeds(callback) {
  if (window.supabaseClient && !SUPABASE_URL.includes('YOUR_PROJECT')) {
    window.supabaseClient.channel('beds_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, callback)
      .subscribe();
  }
}
