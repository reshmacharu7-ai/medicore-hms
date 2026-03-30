// ============================================================
// SHARED LAYOUT COMPONENT
// ============================================================

// Detect if we're inside /pages/ subfolder
function basePath() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

function renderLayout(pageTitle, activeNav) {
  const base = basePath();
  return `
  <div class="sidebar-overlay" style="display:none"></div>

  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="logo-icon">🏥</div>
        <div>
          <div class="logo-text">MediCore</div>
          <div class="logo-sub">Hospital System</div>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Overview</div>
      <a href="${base}index.html" class="nav-item ${activeNav==='dashboard'?'active':''}" data-page="dashboard">
        <span class="nav-icon">📊</span><span>Dashboard</span>
      </a>

      <div class="nav-section-label">Clinical</div>
      <a href="${base}pages/patients.html" class="nav-item ${activeNav==='patients'?'active':''}" data-page="patients">
        <span class="nav-icon">🧑‍⚕️</span><span>Patients</span>
      </a>
      <a href="${base}pages/doctors.html" class="nav-item ${activeNav==='doctors'?'active':''}" data-page="doctors">
        <span class="nav-icon">👨‍⚕️</span><span>Doctors</span>
      </a>
      <a href="${base}pages/appointments.html" class="nav-item ${activeNav==='appointments'?'active':''}" data-page="appointments">
        <span class="nav-icon">📅</span><span>Appointments</span>
        <span class="nav-badge" id="apptBadge"></span>
      </a>
      <a href="${base}pages/records.html" class="nav-item ${activeNav==='records'?'active':''}" data-page="records">
        <span class="nav-icon">📋</span><span>Medical Records</span>
      </a>

      <div class="nav-section-label">Operations</div>
      <a href="${base}pages/beds.html" class="nav-item ${activeNav==='beds'?'active':''}" data-page="beds">
        <span class="nav-icon">🛏️</span><span>Bed Management</span>
      </a>
      <a href="${base}pages/billing.html" class="nav-item ${activeNav==='billing'?'active':''}" data-page="billing">
        <span class="nav-icon">💳</span><span>Billing</span>
      </a>
      <a href="${base}pages/emergency.html" class="nav-item ${activeNav==='emergency'?'active':''}" data-page="emergency">
        <span class="nav-icon">🚑</span><span>Emergency</span>
        <span class="nav-badge" id="emergBadge" style="background:var(--danger)"></span>
      </a>

      <div class="nav-section-label">System</div>
      <a href="${base}pages/notifications.html" class="nav-item ${activeNav==='notifications'?'active':''}" data-page="notifications">
        <span class="nav-icon">🔔</span><span>Notifications</span>
      </a>
      <a href="${base}pages/settings.html" class="nav-item ${activeNav==='settings'?'active':''}" data-page="settings">
        <span class="nav-icon">⚙️</span><span>Settings</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="user-profile" data-dropdown="userMenuDropdown">
        <div class="user-avatar" id="sidebarAvatar">A</div>
        <div class="user-info">
          <div class="user-name" id="sidebarUserName">Loading...</div>
          <div class="user-role" id="sidebarUserRole">admin</div>
        </div>
        <span style="color:var(--text-muted);margin-left:auto">⋮</span>
      </div>
      <div class="dropdown-menu" id="userMenuDropdown">
        <a class="dropdown-item" href="${base}pages/settings.html">⚙️ Settings</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item danger" id="logoutBtn" href="#">🚪 Logout</a>
      </div>
    </div>
  </aside>

  <div class="main-content">
    <header class="top-header">
      <div class="header-left">
        <button class="menu-toggle">☰</button>
        <h1 class="page-title">${pageTitle}</h1>
      </div>
      <div class="header-right">
        <div class="header-search">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search anything..." id="globalSearch">
        </div>
        <div class="dropdown">
          <button class="icon-btn" data-dropdown="notifPanel">🔔<span class="notif-dot"></span></button>
          <div class="notif-panel" id="notifPanel">
            <div class="notif-panel-header">
              <h4>Notifications</h4>
              <span style="font-size:12px;color:var(--primary);cursor:pointer">Mark all read</span>
            </div>
            <div class="notif-list" id="headerNotifList">
              <div class="notif-item"><div class="notif-ico blue">📅</div><div><div class="notif-text">New appointment booked</div><div class="notif-time">2 min ago</div></div></div>
              <div class="notif-item"><div class="notif-ico red">🚑</div><div><div class="notif-text">Emergency patient admitted to ICU</div><div class="notif-time">15 min ago</div></div></div>
              <div class="notif-item"><div class="notif-ico green">✅</div><div><div class="notif-text">Bed #A-104 is now available</div><div class="notif-time">1 hr ago</div></div></div>
            </div>
          </div>
        </div>
        <button class="theme-toggle" id="themeToggle" title="Toggle Theme"></button>
      </div>
    </header>

    <div class="modal-overlay" id="confirmModal">
      <div class="modal" style="max-width:400px">
        <div class="modal-header">
          <h3>⚠️ Confirm Action</h3>
          <button class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <p id="confirmMsg" style="color:var(--text-secondary);font-size:15px">Are you sure you want to proceed?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('confirmModal')">Cancel</button>
          <button class="btn btn-danger" id="confirmBtn">Confirm</button>
        </div>
      </div>
    </div>
`;
}
