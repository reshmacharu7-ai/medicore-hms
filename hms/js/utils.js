// ============================================================
// CORE UTILITIES
// ============================================================

// ── Theme ──
function initTheme() {
  const saved = localStorage.getItem('hms-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('title', saved === 'dark' ? 'Switch to Light' : 'Switch to Dark');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hms-theme', next);
}

// ── Toast Notifications ──
function toast(msg, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${msg}</span>
    <span class="toast-close" onclick="dismissToast(this.parentElement)">✕</span>
  `;
  container.appendChild(el);

  setTimeout(() => dismissToast(el), duration);
  return el;
}

function dismissToast(el) {
  if (!el || el._dismissing) return;
  el._dismissing = true;
  el.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => el.remove(), 300);
}

// ── Modal ──
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function setupModalClose() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    });
  });
}

// ── Sidebar ──
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggleBtn = document.querySelector('.menu-toggle');

  toggleBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    overlay.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.style.display = 'none';
  });

  // Set active nav item
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
  document.querySelectorAll('.nav-item').forEach(item => {
    const page = item.dataset.page;
    if (page === currentPage) item.classList.add('active');
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
        overlay.style.display = 'none';
      }
    });
  });
}

// ── Dropdown ──
function initDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const target = document.getElementById(trigger.dataset.dropdown);
      if (target) target.classList.toggle('show');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.show, .notif-panel.show').forEach(el => {
      el.classList.remove('show');
    });
  });
}

// ── Pagination ──
class Paginator {
  constructor({ data, perPage = 10, renderRow, tableBody, paginationEl }) {
    this.data = data;
    this.perPage = perPage;
    this.renderRow = renderRow;
    this.tableBody = tableBody;
    this.paginationEl = paginationEl;
    this.page = 1;
    this.filtered = [...data];
    this.render();
  }

  setData(data) {
    this.data = data;
    this.filtered = [...data];
    this.page = 1;
    this.render();
  }

  filter(fn) {
    this.filtered = this.data.filter(fn);
    this.page = 1;
    this.render();
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.perPage));
  }

  get pageData() {
    const start = (this.page - 1) * this.perPage;
    return this.filtered.slice(start, start + this.perPage);
  }

  render() {
    if (this.tableBody) {
      if (this.filtered.length === 0) {
        this.tableBody.innerHTML = `
          <tr><td colspan="20">
            <div class="empty-state">
              <div class="empty-icon">🔍</div>
              <h3>No records found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </td></tr>`;
      } else {
        this.tableBody.innerHTML = this.pageData.map(this.renderRow).join('');
      }
    }
    if (this.paginationEl) this.renderPagination();
  }

  renderPagination() {
    const start = Math.min((this.page - 1) * this.perPage + 1, this.filtered.length);
    const end = Math.min(this.page * this.perPage, this.filtered.length);
    const infoEl = this.paginationEl.querySelector('.pagination-info');
    const ctrlEl = this.paginationEl.querySelector('.pagination-controls');

    if (infoEl) infoEl.textContent = `Showing ${start}–${end} of ${this.filtered.length} entries`;
    if (!ctrlEl) return;

    let html = `<button class="page-btn" onclick="paginators['${this.id}']?.goTo(${this.page - 1})" ${this.page <= 1 ? 'disabled' : ''}>‹</button>`;
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || Math.abs(i - this.page) <= 1) {
        html += `<button class="page-btn ${i === this.page ? 'active' : ''}" onclick="paginators['${this.id}']?.goTo(${i})">${i}</button>`;
      } else if (Math.abs(i - this.page) === 2) {
        html += `<span class="page-btn" style="cursor:default">…</span>`;
      }
    }
    html += `<button class="page-btn" onclick="paginators['${this.id}']?.goTo(${this.page + 1})" ${this.page >= this.totalPages ? 'disabled' : ''}>›</button>`;
    ctrlEl.innerHTML = html;
  }

  goTo(page) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.render();
  }
}

const paginators = {};

// ── Format Helpers ──
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function randomGradient(seed) {
  const gradients = [
    'linear-gradient(135deg, #0ea5e9, #10b981)',
    'linear-gradient(135deg, #8b5cf6, #0ea5e9)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #06d6a0)',
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
  ];
  const idx = seed ? seed.charCodeAt(0) % gradients.length : 0;
  return gradients[idx];
}

// ── Age from DOB ──
function calcAge(dob) {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

// ── Animate counter ──
function animateCounter(el, target, duration = 1000) {
  const start = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Form validation ──
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--danger)';
      field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
      valid = false;
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }, { once: true });
    }
  });
  return valid;
}

// ── Confirmation Dialog ──
function confirm(message, onConfirm) {
  const overlay = document.getElementById('confirmModal');
  if (!overlay) return onConfirm(); // fallback

  document.getElementById('confirmMsg').textContent = message;
  openModal('confirmModal');
  document.getElementById('confirmBtn').onclick = () => {
    closeModal('confirmModal');
    onConfirm();
  };
}

// ── Initialize common elements ──
function initCommon() {
  initTheme();
  initSidebar();
  initDropdowns();
  setupModalClose();

  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('logoutBtn')?.addEventListener('click', signOut);

  // Render user profile in sidebar
  if (currentProfile) {
    const nameEl = document.getElementById('sidebarUserName');
    const roleEl = document.getElementById('sidebarUserRole');
    const avatarEl = document.getElementById('sidebarAvatar');
    if (nameEl) nameEl.textContent = currentProfile.full_name || currentUser?.email;
    if (roleEl) roleEl.textContent = currentRole;
    if (avatarEl) avatarEl.textContent = getInitials(currentProfile.full_name || currentUser?.email);
  }
}
