// server.js — Tiger Tyres Express API
'use strict';

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const multer   = require('multer');
const { initDb, getDb } = require('./db');

const PORT       = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tigertyres-change-me-in-production';

// Uploads dir: use Render persistent disk path if available, else local
const UPLOADS_DIR = process.env.UPLOADS_DIR
  || path.join(__dirname, '..', 'frontend', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = initDb();

// ── Multer ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `tyre_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype);
    cb(ok ? null : new Error('Images only'), ok);
  },
});

// ── App ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve built frontend
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
}

// ── Auth middleware ───────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorised' });
  try {
    req.admin = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ════════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  const admin = getDb().prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash))
    return res.status(401).json({ error: 'Invalid username or password' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, username: admin.username });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = getDb().prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);
  if (!bcrypt.compareSync(currentPassword, admin.password_hash))
    return res.status(401).json({ error: 'Current password incorrect' });
  getDb().prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
    .run(bcrypt.hashSync(newPassword, 10), req.admin.id);
  res.json({ ok: true });
});

// ════════════════════════════════════════════════════════════════════
// TYRES (public)
// ════════════════════════════════════════════════════════════════════
app.get('/api/tyres', (req, res) => {
  const { search, rim, condition, sort, inStock } = req.query;
  let sql = 'SELECT * FROM tyres WHERE 1=1';
  const params = [];
  if (search) { sql += ' AND (brand LIKE ? OR model LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (rim)       { sql += ' AND rim = ?';       params.push(Number(rim)); }
  if (condition) { sql += ' AND condition = ?';  params.push(condition); }
  if (inStock === 'true') sql += ' AND qty > 0';
  const sortMap = { price_asc:'price ASC', price_desc:'price DESC', rim_desc:'rim DESC', brand:'brand ASC,model ASC', newest:'created_at DESC' };
  sql += ` ORDER BY ${sortMap[sort] || 'price ASC'}`;
  res.json(getDb().prepare(sql).all(...params));
});

app.get('/api/tyres/meta/rims', (_req, res) => {
  res.json(getDb().prepare('SELECT DISTINCT rim FROM tyres ORDER BY rim DESC').all().map(r => r.rim));
});

app.get('/api/tyres/:id', (req, res) => {
  const t = getDb().prepare('SELECT * FROM tyres WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  res.json(t);
});

// ════════════════════════════════════════════════════════════════════
// TYRES (admin)
// ════════════════════════════════════════════════════════════════════
app.post('/api/admin/tyres', requireAuth, (req, res) => {
  const { brand, model, width, profile, rim, condition, price, qty, speed, load_index, description, image_url } = req.body;
  const info = getDb().prepare(`
    INSERT INTO tyres (brand,model,width,profile,rim,condition,price,qty,speed,load_index,description,image_url)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(brand, model, +width, +profile, +rim, condition||'New', +price, +qty, speed||'V', +load_index||91, description||'', image_url||null);
  res.status(201).json(getDb().prepare('SELECT * FROM tyres WHERE id = ?').get(info.lastInsertRowid));
});

app.put('/api/admin/tyres/:id', requireAuth, (req, res) => {
  const { brand, model, width, profile, rim, condition, price, qty, speed, load_index, description, image_url } = req.body;
  getDb().prepare(`
    UPDATE tyres SET brand=?,model=?,width=?,profile=?,rim=?,condition=?,price=?,qty=?,speed=?,load_index=?,description=?,image_url=?
    WHERE id=?
  `).run(brand, model, +width, +profile, +rim, condition, +price, +qty, speed, +load_index, description, image_url??null, req.params.id);
  res.json(getDb().prepare('SELECT * FROM tyres WHERE id = ?').get(req.params.id));
});

app.patch('/api/admin/tyres/:id', requireAuth, (req, res) => {
  const allowed = ['brand','model','width','profile','rim','condition','price','qty','speed','load_index','description','image_url'];
  const updates = Object.entries(req.body).filter(([k]) => allowed.includes(k));
  if (!updates.length) return res.status(400).json({ error: 'No valid fields' });
  const sets   = updates.map(([k]) => `${k} = ?`).join(', ');
  const values = updates.map(([,v]) => v);
  getDb().prepare(`UPDATE tyres SET ${sets} WHERE id = ?`).run(...values, req.params.id);
  res.json(getDb().prepare('SELECT * FROM tyres WHERE id = ?').get(req.params.id));
});

app.delete('/api/admin/tyres/:id', requireAuth, (req, res) => {
  const t = getDb().prepare('SELECT * FROM tyres WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (t.image_url?.startsWith('/uploads/')) {
    const fp = path.join(UPLOADS_DIR, path.basename(t.image_url));
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  getDb().prepare('DELETE FROM tyres WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD
// ════════════════════════════════════════════════════════════════════
app.post('/api/admin/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ════════════════════════════════════════════════════════════════════
// ENQUIRIES
// ════════════════════════════════════════════════════════════════════
app.post('/api/enquiries', (req, res) => {
  const { name, phone, email, message, items } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const info = getDb().prepare(
    'INSERT INTO enquiries (name,phone,email,message,items_json) VALUES (?,?,?,?,?)'
  ).run(name, phone, email||'', message||'', items ? JSON.stringify(items) : null);
  res.status(201).json({ id: info.lastInsertRowid, ok: true });
});

app.get('/api/admin/enquiries', requireAuth, (_req, res) => {
  res.json(getDb().prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all());
});

app.patch('/api/admin/enquiries/:id', requireAuth, (req, res) => {
  const { status } = req.body;
  if (!['new','contacted','completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  getDb().prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/admin/enquiries/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ════════════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════════════
app.get('/api/settings', (_req, res) => {
  const rows = getDb().prepare('SELECT key, value FROM settings').all();
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
});

app.put('/api/admin/settings', requireAuth, (req, res) => {
  const upsert = getDb().prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  getDb().transaction((pairs) => { for (const [k,v] of pairs) upsert.run(k, String(v)); })(Object.entries(req.body));
  res.json({ ok: true });
});

// ════════════════════════════════════════════════════════════════════
// STATS
// ════════════════════════════════════════════════════════════════════
app.get('/api/admin/stats', requireAuth, (_req, res) => {
  const d = getDb();
  res.json({
    total_skus:    d.prepare('SELECT COUNT(*) as c FROM tyres').get().c,
    total_units:   d.prepare('SELECT COALESCE(SUM(qty),0) as s FROM tyres').get().s,
    new_count:     d.prepare("SELECT COUNT(*) as c FROM tyres WHERE condition='New'").get().c,
    used_count:    d.prepare("SELECT COUNT(*) as c FROM tyres WHERE condition='Used'").get().c,
    low_stock:     d.prepare('SELECT COUNT(*) as c FROM tyres WHERE qty > 0 AND qty <= 2').get().c,
    out_of_stock:  d.prepare('SELECT COUNT(*) as c FROM tyres WHERE qty = 0').get().c,
    new_enquiries: d.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='new'").get().c,
  });
});

// ── SPA fallback ──────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  const idx = path.join(FRONTEND_DIST, 'index.html');
  if (fs.existsSync(idx)) res.sendFile(idx);
  else res.json({ status: 'Tiger Tyres API running', note: 'Frontend not built' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🐯  Tiger Tyres running on port ${PORT}`);
  console.log(`   Admin: tiger / tiger123\n`);
});
