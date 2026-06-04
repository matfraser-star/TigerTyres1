'use strict';
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const multer   = require('multer');
const nodemailer = require('nodemailer');
const { initDb, getDb } = require('./db');

const PORT       = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tigertyres-change-me';
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname,'..','frontend','public','uploads');
const FRONTEND_DIST = path.join(__dirname,'..','frontend','dist');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR,{recursive:true});
const db = initDb();

// ── Email ─────────────────────────────────────────────────────────────
function getTransport() {
  const s = setting;
  if (!s('smtp_host')) return null;
  return nodemailer.createTransport({
    host: s('smtp_host'), port: Number(s('smtp_port')) || 587,
    auth: { user: s('smtp_user'), pass: s('smtp_pass') }
  });
}
function setting(key) {
  const r = getDb().prepare('SELECT value FROM settings WHERE key=?').get(key);
  return r ? r.value : '';
}
async function sendNotification(subject, html) {
  const to = setting('notify_email');
  if (!to) return;
  const t = getTransport();
  if (!t) return;
  try { await t.sendMail({ from: setting('smtp_user'), to, subject, html }); } catch(e) { console.error('Mail error:',e.message); }
}

// ── Multer ─────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: (_,__,cb) => cb(null,UPLOADS_DIR),
    filename:    (_,file,cb) => cb(null,`tyre_${Date.now()}_${Math.random().toString(36).slice(2)}${path.extname(file.originalname)||'.jpg'}`),
  }),
  limits: { fileSize: 8*1024*1024 },
  fileFilter: (_,file,cb) => cb(null,/^image\//.test(file.mimetype)),
});

const app = express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(UPLOADS_DIR));
if (fs.existsSync(FRONTEND_DIST)) app.use(express.static(FRONTEND_DIST));

function requireAuth(req,res,next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({error:'Unauthorised'});
  try { req.admin = jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { res.status(401).json({error:'Invalid token'}); }
}

// ════════ AUTH ════════════════════════════════════════════════════════
app.post('/api/auth/login', (req,res) => {
  const {username,password} = req.body;
  const admin = getDb().prepare('SELECT * FROM admins WHERE username=?').get(username);
  if (!admin || !bcrypt.compareSync(password,admin.password_hash)) return res.status(401).json({error:'Invalid credentials'});
  res.json({ token: jwt.sign({id:admin.id,username:admin.username},JWT_SECRET,{expiresIn:'12h'}), username: admin.username });
});
app.post('/api/auth/change-password', requireAuth, (req,res) => {
  const admin = getDb().prepare('SELECT * FROM admins WHERE id=?').get(req.admin.id);
  if (!bcrypt.compareSync(req.body.currentPassword, admin.password_hash)) return res.status(401).json({error:'Wrong password'});
  getDb().prepare('UPDATE admins SET password_hash=? WHERE id=?').run(bcrypt.hashSync(req.body.newPassword,10), req.admin.id);
  res.json({ok:true});
});

// ════════ TYRES (public) ══════════════════════════════════════════════
app.get('/api/tyres', (req,res) => {
  const {search,rim,condition,sort,inStock,featured} = req.query;
  let sql = 'SELECT * FROM tyres WHERE 1=1';
  const p = [];
  if (search)    { sql+=' AND (brand LIKE ? OR model LIKE ?)'; p.push(`%${search}%`,`%${search}%`); }
  if (rim)       { sql+=' AND rim=?'; p.push(+rim); }
  if (condition) { sql+=' AND condition=?'; p.push(condition); }
  if (inStock==='true') sql+=' AND qty>0';
  if (featured==='true') sql+=' AND featured=1';
  const sorts = {price_asc:'price ASC',price_desc:'price DESC',rim_desc:'rim DESC',brand:'brand ASC,model ASC',newest:'created_at DESC'};
  sql+=` ORDER BY ${sorts[sort]||'price ASC'}`;
  res.json(getDb().prepare(sql).all(...p));
});
app.get('/api/tyres/meta/rims', (_,res) => res.json(getDb().prepare('SELECT DISTINCT rim FROM tyres ORDER BY rim DESC').all().map(r=>r.rim)));
app.get('/api/tyres/:id', (req,res) => {
  const t = getDb().prepare('SELECT * FROM tyres WHERE id=?').get(req.params.id);
  if (!t) return res.status(404).json({error:'Not found'});
  const reviews = getDb().prepare('SELECT * FROM reviews WHERE tyre_id=? AND approved=1 ORDER BY created_at DESC').all(req.params.id);
  const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : null;
  res.json({...t, reviews, avg_rating: avg, review_count: reviews.length});
});

// ════════ REVIEWS (public) ════════════════════════════════════════════
app.post('/api/tyres/:id/reviews', (req,res) => {
  const {author,rating,body} = req.body;
  if (!author||!rating) return res.status(400).json({error:'Missing fields'});
  const info = getDb().prepare('INSERT INTO reviews (tyre_id,author,rating,body) VALUES (?,?,?,?)').run(req.params.id,author,+rating,body||'');
  res.status(201).json({id:info.lastInsertRowid,ok:true,message:'Review submitted for approval'});
});

// ════════ VEHICLE LOOKUP ══════════════════════════════════════════════
app.get('/api/vehicles/makes', (_,res) => res.json(getDb().prepare('SELECT DISTINCT make FROM vehicles ORDER BY make').all().map(r=>r.make)));
app.get('/api/vehicles/models', (req,res) => res.json(getDb().prepare('SELECT DISTINCT model FROM vehicles WHERE make=? ORDER BY model').all(req.query.make).map(r=>r.model)));
app.get('/api/vehicles/years', (req,res) => res.json(getDb().prepare('SELECT DISTINCT year FROM vehicles WHERE make=? AND model=? ORDER BY year DESC').all(req.query.make,req.query.model).map(r=>r.year)));
app.get('/api/vehicles/fitment', (req,res) => {
  const {make,model,year} = req.query;
  const v = getDb().prepare('SELECT * FROM vehicles WHERE make=? AND model=? AND year=?').get(make,model,+year);
  if (!v) return res.status(404).json({error:'No fitment found'});
  const tyres = getDb().prepare('SELECT * FROM tyres WHERE width=? AND profile=? AND rim=? AND qty>0 ORDER BY price ASC').all(v.width,v.profile,v.rim);
  res.json({fitment:v, tyres});
});

// ════════ BOOKINGS (public) ═══════════════════════════════════════════
app.post('/api/bookings', async (req,res) => {
  const {name,phone,email,service,vehicle,date,time,notes} = req.body;
  if (!name||!phone||!date||!time||!service) return res.status(400).json({error:'Missing required fields'});
  const info = getDb().prepare('INSERT INTO bookings (name,phone,email,service,vehicle,date,time,notes) VALUES (?,?,?,?,?,?,?,?)').run(name,phone,email||'',service,vehicle||'',date,time,notes||'');
  await sendNotification(`New Booking — ${name}`,`<p><b>${name}</b> booked <b>${service}</b> on <b>${date} at ${time}</b>.<br>Phone: ${phone}<br>Vehicle: ${vehicle||'N/A'}</p>`);
  res.status(201).json({id:info.lastInsertRowid,ok:true});
});
app.get('/api/bookings/availability', (req,res) => {
  const {date} = req.query;
  const booked = getDb().prepare("SELECT time FROM bookings WHERE date=? AND status!='cancelled'").all(date).map(r=>r.time);
  const slots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'];
  res.json(slots.map(t=>({time:t,available:!booked.includes(t)})));
});

// ════════ ENQUIRIES (public) ══════════════════════════════════════════
app.post('/api/enquiries', async (req,res) => {
  const {name,phone,email,message,items} = req.body;
  if (!name||!phone) return res.status(400).json({error:'Name and phone required'});
  const info = getDb().prepare('INSERT INTO enquiries (name,phone,email,message,items_json) VALUES (?,?,?,?,?)').run(name,phone,email||'',message||'',items?JSON.stringify(items):null);
  const itemsList = items ? items.map(i=>`<li>${i.brand} ${i.model} ${i.width}/${i.profile}R${i.rim} x${i.qty} — $${i.price*i.qty}</li>`).join('') : '';
  await sendNotification(`New Enquiry — ${name}`,`<p><b>${name}</b> | ${phone} | ${email}</p><p>${message}</p><ul>${itemsList}</ul>`);
  res.status(201).json({id:info.lastInsertRowid,ok:true});
});

// ════════ SETTINGS (public read) ═════════════════════════════════════
app.get('/api/settings', (_,res) => {
  const rows = getDb().prepare('SELECT key,value FROM settings').all();
  res.json(Object.fromEntries(rows.map(r=>[r.key,r.value])));
});

// ════════ ADMIN — TYRES ═══════════════════════════════════════════════
app.post('/api/admin/tyres', requireAuth, (req,res) => {
  const {brand,model,width,profile,rim,condition,price,qty,speed,load_index,description,image_url,warranty,featured} = req.body;
  const info = getDb().prepare(`INSERT INTO tyres (brand,model,width,profile,rim,condition,price,qty,speed,load_index,description,image_url,warranty,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(brand,model,+width,+profile,+rim,condition||'New',+price,+qty,speed||'V',+load_index||91,description||'',image_url||null,warranty||'',featured?1:0);
  res.status(201).json(getDb().prepare('SELECT * FROM tyres WHERE id=?').get(info.lastInsertRowid));
});
app.put('/api/admin/tyres/:id', requireAuth, (req,res) => {
  const {brand,model,width,profile,rim,condition,price,qty,speed,load_index,description,image_url,warranty,featured} = req.body;
  getDb().prepare(`UPDATE tyres SET brand=?,model=?,width=?,profile=?,rim=?,condition=?,price=?,qty=?,speed=?,load_index=?,description=?,image_url=?,warranty=?,featured=? WHERE id=?`).run(brand,model,+width,+profile,+rim,condition,+price,+qty,speed,+load_index,description,image_url??null,warranty||'',featured?1:0,req.params.id);
  res.json(getDb().prepare('SELECT * FROM tyres WHERE id=?').get(req.params.id));
});
app.patch('/api/admin/tyres/:id', requireAuth, (req,res) => {
  const allowed = ['brand','model','width','profile','rim','condition','price','qty','speed','load_index','description','image_url','warranty','featured'];
  const updates = Object.entries(req.body).filter(([k])=>allowed.includes(k));
  if (!updates.length) return res.status(400).json({error:'No valid fields'});
  getDb().prepare(`UPDATE tyres SET ${updates.map(([k])=>`${k}=?`).join(',')} WHERE id=?`).run(...updates.map(([,v])=>v),req.params.id);
  res.json(getDb().prepare('SELECT * FROM tyres WHERE id=?').get(req.params.id));
});
app.delete('/api/admin/tyres/:id', requireAuth, (req,res) => {
  const t = getDb().prepare('SELECT * FROM tyres WHERE id=?').get(req.params.id);
  if (!t) return res.status(404).json({error:'Not found'});
  if (t.image_url?.startsWith('/uploads/')) { const fp=path.join(UPLOADS_DIR,path.basename(t.image_url)); if(fs.existsSync(fp)) fs.unlinkSync(fp); }
  getDb().prepare('DELETE FROM tyres WHERE id=?').run(req.params.id);
  res.json({ok:true});
});
app.post('/api/admin/tyres/bulk-price', requireAuth, (req,res) => {
  const {condition,adjustment,type} = req.body; // type: 'percent' | 'fixed'
  let sql = type==='percent'
    ? `UPDATE tyres SET price=ROUND(price*(1+?/100.0),2)`
    : `UPDATE tyres SET price=ROUND(price+?,2)`;
  const params = [+adjustment];
  if (condition) { sql+=' WHERE condition=?'; params.push(condition); }
  const info = getDb().prepare(sql).run(...params);
  res.json({ok:true,updated:info.changes});
});
app.get('/api/admin/export/stock', requireAuth, (_,res) => {
  const tyres = getDb().prepare('SELECT * FROM tyres ORDER BY brand,model').all();
  const header = 'ID,Brand,Model,Width,Profile,Rim,Condition,Price,Qty,Speed,Load,Description,Warranty,Featured,Created\n';
  const rows = tyres.map(t=>[t.id,t.brand,t.model,t.width,t.profile,t.rim,t.condition,t.price,t.qty,t.speed,t.load_index,`"${(t.description||'').replace(/"/g,'""')}"`,`"${(t.warranty||'').replace(/"/g,'""')}"`,t.featured,t.created_at].join(',')).join('\n');
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename="tigertyres_stock.csv"');
  res.send(header+rows);
});

// ════════ ADMIN — UPLOAD ══════════════════════════════════════════════
app.post('/api/admin/upload', requireAuth, upload.single('image'), (req,res) => {
  if (!req.file) return res.status(400).json({error:'No file'});
  res.json({url:`/uploads/${req.file.filename}`});
});

// ════════ ADMIN — ENQUIRIES ═══════════════════════════════════════════
app.get('/api/admin/enquiries', requireAuth, (_,res) => res.json(getDb().prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all()));
app.patch('/api/admin/enquiries/:id', requireAuth, (req,res) => {
  if (!['new','contacted','completed'].includes(req.body.status)) return res.status(400).json({error:'Invalid status'});
  getDb().prepare('UPDATE enquiries SET status=? WHERE id=?').run(req.body.status,req.params.id);
  res.json({ok:true});
});
app.delete('/api/admin/enquiries/:id', requireAuth, (req,res) => { getDb().prepare('DELETE FROM enquiries WHERE id=?').run(req.params.id); res.json({ok:true}); });

// ════════ ADMIN — BOOKINGS ════════════════════════════════════════════
app.get('/api/admin/bookings', requireAuth, (_,res) => res.json(getDb().prepare('SELECT * FROM bookings ORDER BY date DESC,time DESC').all()));
app.patch('/api/admin/bookings/:id', requireAuth, (req,res) => {
  const {status} = req.body;
  if (!['pending','confirmed','cancelled','completed'].includes(status)) return res.status(400).json({error:'Invalid status'});
  getDb().prepare('UPDATE bookings SET status=? WHERE id=?').run(status,req.params.id);
  res.json({ok:true});
});
app.delete('/api/admin/bookings/:id', requireAuth, (req,res) => { getDb().prepare('DELETE FROM bookings WHERE id=?').run(req.params.id); res.json({ok:true}); });

// ════════ ADMIN — REVIEWS ═════════════════════════════════════════════
app.get('/api/admin/reviews', requireAuth, (_,res) => {
  res.json(getDb().prepare('SELECT r.*,t.brand,t.model FROM reviews r JOIN tyres t ON t.id=r.tyre_id ORDER BY r.created_at DESC').all());
});
app.patch('/api/admin/reviews/:id', requireAuth, (req,res) => {
  getDb().prepare('UPDATE reviews SET approved=? WHERE id=?').run(req.body.approved?1:0,req.params.id);
  res.json({ok:true});
});
app.delete('/api/admin/reviews/:id', requireAuth, (req,res) => { getDb().prepare('DELETE FROM reviews WHERE id=?').run(req.params.id); res.json({ok:true}); });

// ════════ ADMIN — VEHICLES ════════════════════════════════════════════
app.get('/api/admin/vehicles', requireAuth, (_,res) => res.json(getDb().prepare('SELECT * FROM vehicles ORDER BY make,model,year DESC').all()));
app.post('/api/admin/vehicles', requireAuth, (req,res) => {
  const {make,model,year,width,profile,rim} = req.body;
  const info = getDb().prepare('INSERT INTO vehicles (make,model,year,width,profile,rim) VALUES (?,?,?,?,?,?)').run(make,model,+year,+width,+profile,+rim);
  res.status(201).json({id:info.lastInsertRowid,ok:true});
});
app.delete('/api/admin/vehicles/:id', requireAuth, (req,res) => { getDb().prepare('DELETE FROM vehicles WHERE id=?').run(req.params.id); res.json({ok:true}); });

// ════════ ADMIN — SETTINGS ════════════════════════════════════════════
app.put('/api/admin/settings', requireAuth, (req,res) => {
  const ups = getDb().prepare('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)');
  getDb().transaction(pairs=>pairs.forEach(([k,v])=>ups.run(k,String(v))))(Object.entries(req.body));
  res.json({ok:true});
});

// ════════ ADMIN — STATS ═══════════════════════════════════════════════
app.get('/api/admin/stats', requireAuth, (_,res) => {
  const d = getDb();
  res.json({
    total_skus:      d.prepare('SELECT COUNT(*) as c FROM tyres').get().c,
    total_units:     d.prepare('SELECT COALESCE(SUM(qty),0) as s FROM tyres').get().s,
    new_count:       d.prepare("SELECT COUNT(*) as c FROM tyres WHERE condition='New'").get().c,
    used_count:      d.prepare("SELECT COUNT(*) as c FROM tyres WHERE condition='Used'").get().c,
    low_stock:       d.prepare('SELECT COUNT(*) as c FROM tyres WHERE qty>0 AND qty<=2').get().c,
    out_of_stock:    d.prepare('SELECT COUNT(*) as c FROM tyres WHERE qty=0').get().c,
    new_enquiries:   d.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='new'").get().c,
    new_bookings:    d.prepare("SELECT COUNT(*) as c FROM bookings WHERE status='pending'").get().c,
    pending_reviews: d.prepare('SELECT COUNT(*) as c FROM reviews WHERE approved=0').get().c,
    stock_value:     d.prepare('SELECT COALESCE(SUM(price*qty),0) as v FROM tyres').get().v,
  });
});

// ── SPA fallback ──────────────────────────────────────────────────────
app.get('*', (_,res) => {
  const idx = path.join(FRONTEND_DIST,'index.html');
  if (fs.existsSync(idx)) res.sendFile(idx);
  else res.json({status:'Tiger Tyres API running'});
});

app.listen(PORT,'0.0.0.0',() => console.log(`🐯  Tiger Tyres on port ${PORT}`));
