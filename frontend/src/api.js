// api.js — centralised API client

const BASE = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const token = localStorage.getItem('tt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req(method, path, body, isForm = false) {
  const headers = { ...authHeaders() };
  let bodyContent;

  if (body && !isForm) {
    headers['Content-Type'] = 'application/json';
    bodyContent = JSON.stringify(body);
  } else {
    bodyContent = body; // FormData
  }

  const res = await fetch(`${BASE}${path}`, { method, headers, body: bodyContent });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────
export const login    = (u, p) => req('POST', '/api/auth/login', { username: u, password: p });
export const changePassword = (cur, next) => req('POST', '/api/auth/change-password', { currentPassword: cur, newPassword: next });

// ── Tyres (public) ───────────────────────────────────────────────────
export const getTyres  = (params = {}) => req('GET', `/api/tyres?${new URLSearchParams(params)}`);
export const getTyre   = (id)          => req('GET', `/api/tyres/${id}`);
export const getRims   = ()            => req('GET', '/api/tyres/meta/rims');

// ── Tyres (admin) ────────────────────────────────────────────────────
export const createTyre = (data)       => req('POST',   '/api/admin/tyres', data);
export const updateTyre = (id, data)   => req('PUT',    `/api/admin/tyres/${id}`, data);
export const patchTyre  = (id, data)   => req('PATCH',  `/api/admin/tyres/${id}`, data);
export const deleteTyre = (id)         => req('DELETE', `/api/admin/tyres/${id}`);

// ── Image upload ─────────────────────────────────────────────────────
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('image', file);
  return req('POST', '/api/admin/upload', fd, true);
}

// ── Enquiries ─────────────────────────────────────────────────────────
export const submitEnquiry   = (data) => req('POST',  '/api/enquiries', data);
export const getEnquiries    = ()     => req('GET',   '/api/admin/enquiries');
export const patchEnquiry    = (id, status) => req('PATCH', `/api/admin/enquiries/${id}`, { status });
export const deleteEnquiry   = (id)  => req('DELETE', `/api/admin/enquiries/${id}`);

// ── Settings ─────────────────────────────────────────────────────────
export const getSettings    = ()     => req('GET', '/api/settings');
export const saveSettings   = (data) => req('PUT', '/api/admin/settings', data);

// ── Stats ─────────────────────────────────────────────────────────────
export const getStats = () => req('GET', '/api/admin/stats');
