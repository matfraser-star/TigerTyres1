'use strict';
const Database = require('better-sqlite3');
const path     = require('path');
const bcrypt   = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'tigertyres.db');
let db;
function getDb() {
  if (!db) { db = new Database(DB_PATH); db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON'); }
  return db;
}

function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS tyres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL, model TEXT NOT NULL,
      width INTEGER NOT NULL, profile INTEGER NOT NULL, rim INTEGER NOT NULL,
      condition TEXT NOT NULL DEFAULT 'New' CHECK(condition IN ('New','Used')),
      price REAL NOT NULL, qty INTEGER NOT NULL DEFAULT 0,
      speed TEXT NOT NULL DEFAULT 'V', load_index INTEGER NOT NULL DEFAULT 91,
      description TEXT, image_url TEXT, warranty TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT,
      message TEXT, items_json TEXT,
      status TEXT DEFAULT 'new' CHECK(status IN ('new','contacted','completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tyre_id INTEGER NOT NULL REFERENCES tyres(id) ON DELETE CASCADE,
      author TEXT NOT NULL, rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      body TEXT, approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT,
      service TEXT NOT NULL, vehicle TEXT,
      date TEXT NOT NULL, time TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled','completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS blocked_dates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT
    );
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL, model TEXT NOT NULL, year INTEGER NOT NULL,
      width INTEGER NOT NULL, profile INTEGER NOT NULL, rim INTEGER NOT NULL,
      notes TEXT
    );
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_tyre_ts AFTER UPDATE ON tyres
    BEGIN UPDATE tyres SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; END;
  `);

  // Default admin
  if (!db.prepare('SELECT id FROM admins WHERE username=?').get('tiger')) {
    db.prepare('INSERT INTO admins (username,password_hash) VALUES (?,?)').run('tiger', bcrypt.hashSync('tiger123',10));
    console.log('✅  Admin: tiger / tiger123');
  }

  // Settings
  const defaults = {
    shop_name:'Tiger Tyres', phone:'06 835 0000', email:'info@tigertyres.co.nz',
    address:'123 Carlyle Street, Napier 4110, New Zealand', gst:'123-456-789',
    whatsapp:'6468350000', instagram:'', maps_embed:'',
    hours_weekday:'Mon–Fri: 8am – 5:30pm', hours_sat:'Saturday: 8:30am – 3pm', hours_sun:'Sunday: Closed',
    price_match:'true',
    smtp_host:'', smtp_port:'587', smtp_user:'', smtp_pass:'', notify_email:'',
    low_stock_threshold:'2',
    hero_eyebrow:"NAPIER'S TYRE SPECIALISTS",
    hero_heading:'FIND YOUR', hero_heading_highlight:'PERFECT TYRE',
    hero_subtext:"22-inch 285/40s down to budget second-hand — every size, every budget.",
    hero_badge_text:"PRICE MATCH GUARANTEE — Show us any quote, we'll beat it",
    hero_logo_url:'',
    footer_tagline:'Premium & budget tyres for every vehicle. Fitting available 6 days a week.',
    footer_about:"Tiger Tyres has been Napier's trusted tyre specialist for over 15 years.",
    about_text1:"Tiger Tyres has been Hawke's Bay's trusted tyre specialist for over 15 years. From budget second-hand tyres to premium 22\" performance rubber — we stock it all and fit it fast.",
    about_text2:'Our experienced team handles everything from everyday hatchbacks to high-performance sports cars. We price-match any written quote.',
    fitting_fee:'0',
    show_fitted_price:'false',
    booking_open_days:'1111110', // Mon-Sat open, Sun closed (7 chars, Mon=index 0)
    booking_open_time:'08:00',
    booking_close_time:'17:00',
    booking_slot_minutes:'60',
  };
  const ups = db.prepare('INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)');
  for (const [k,v] of Object.entries(defaults)) ups.run(k,v);

  // Seed tyres
  if (!db.prepare('SELECT COUNT(*) as c FROM tyres').get().c) {
    const ins = db.prepare(`INSERT INTO tyres (brand,model,width,profile,rim,condition,price,qty,speed,load_index,description,warranty,featured)
      VALUES (@brand,@model,@width,@profile,@rim,@condition,@price,@qty,@speed,@load_index,@description,@warranty,@featured)`);
    const seed = [
      {brand:'Michelin',model:'Pilot Sport 5',width:285,profile:40,rim:22,condition:'New',price:420,qty:4,speed:'Y',load_index:106,description:'Ultra-high-performance summer tyre. Exceptional dry and wet grip.',warranty:'5 year manufacturer warranty',featured:1},
      {brand:'Pirelli',model:'P Zero PZ4',width:275,profile:35,rim:21,condition:'New',price:390,qty:2,speed:'Y',load_index:103,description:'OEM fitment for Ferrari & Lamborghini. Razor-sharp handling.',warranty:'5 year manufacturer warranty',featured:1},
      {brand:'Continental',model:'SportContact 7',width:265,profile:35,rim:20,condition:'New',price:310,qty:6,speed:'Y',load_index:99,description:'Track-tested performance with outstanding longevity.',warranty:'5 year manufacturer warranty',featured:1},
      {brand:'Bridgestone',model:'Potenza Sport',width:245,profile:45,rim:19,condition:'New',price:270,qty:8,speed:'Y',load_index:98,description:'Balanced high-performance with excellent wet weather confidence.',warranty:'5 year manufacturer warranty',featured:0},
      {brand:'Yokohama',model:'Advan Sport V107',width:255,profile:40,rim:20,condition:'New',price:255,qty:4,speed:'Y',load_index:101,description:'Japanese engineering meets European performance standards.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Dunlop',model:'Sport Maxx RT2',width:225,profile:45,rim:18,condition:'New',price:195,qty:10,speed:'W',load_index:95,description:'Everyday performance tyre with strong all-round capability.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Pirelli',model:'Cinturato P7',width:205,profile:55,rim:16,condition:'New',price:145,qty:12,speed:'V',load_index:91,description:'Eco-focused touring tyre, low rolling resistance.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Bridgestone',model:'Ecopia EP300',width:195,profile:65,rim:15,condition:'New',price:115,qty:8,speed:'V',load_index:91,description:'Fuel-efficient all-season tyre. Great for city and highway driving.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Hankook',model:'Kinergy GT',width:215,profile:60,rim:16,condition:'New',price:125,qty:6,speed:'H',load_index:95,description:'Comfortable touring tyre with low road noise and good wet grip.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Toyo',model:'Proxes CF2',width:205,profile:55,rim:16,condition:'New',price:118,qty:8,speed:'V',load_index:91,description:'Quiet, comfortable everyday tyre with strong wet performance.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Falken',model:'Wildpeak AT3W',width:265,profile:65,rim:17,condition:'New',price:235,qty:6,speed:'T',load_index:112,description:'All-terrain tyre built for Ranger/Hilux/D-Max. Excellent off-road capability.',warranty:'5 year manufacturer warranty',featured:0},
      {brand:'BF Goodrich',model:'All-Terrain T/A KO2',width:265,profile:70,rim:17,condition:'New',price:320,qty:4,speed:'T',load_index:112,description:'The benchmark all-terrain tyre for utes and 4WDs. Tough sidewalls.',warranty:'5 year manufacturer warranty',featured:1},
      {brand:'Michelin',model:'LTX Force',width:265,profile:65,rim:17,condition:'New',price:280,qty:4,speed:'T',load_index:112,description:'Premium all-season tyre designed for SUVs and light trucks.',warranty:'5 year manufacturer warranty',featured:0},
      {brand:'Yokohama',model:'Geolandar A/T G015',width:265,profile:60,rim:18,condition:'New',price:260,qty:6,speed:'H',load_index:110,description:'All-terrain for SUV and 4WD. Balanced on-road comfort and off-road traction.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Dunlop',model:'Grandtrek AT5',width:255,profile:65,rim:17,condition:'New',price:218,qty:8,speed:'H',load_index:110,description:'Highway terrain tyre for SUV/4WD. Quiet, comfortable, durable.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Hankook',model:'Dynapro AT2',width:245,profile:65,rim:17,condition:'New',price:195,qty:6,speed:'T',load_index:111,description:'All-terrain tyre for utes and SUVs. Strong off-road grip.',warranty:'4 year manufacturer warranty',featured:0},
      {brand:'Nexen',model:'N\'Blue HD Plus',width:195,profile:65,rim:15,condition:'New',price:98,qty:12,speed:'H',load_index:91,description:'Budget-friendly everyday tyre. Good wet and dry performance for the price.',warranty:'3 year manufacturer warranty',featured:0},
      {brand:'Kumho',model:'Ecsta PS71',width:225,profile:45,rim:18,condition:'New',price:155,qty:8,speed:'W',load_index:95,description:'High-performance tyre at an accessible price point. Good feedback.',warranty:'3 year manufacturer warranty',featured:0},
      {brand:'Michelin',model:'Energy Saver+',width:195,profile:65,rim:15,condition:'Used',price:55,qty:3,speed:'H',load_index:91,description:'Second-hand, 5mm tread remaining. Perfect budget option.',warranty:'No warranty — used tyre',featured:0},
      {brand:'Goodyear',model:'Eagle F1 Asymm 5',width:235,profile:40,rim:19,condition:'Used',price:90,qty:2,speed:'Y',load_index:96,description:'Second-hand, 6mm tread. Great shape for the price.',warranty:'No warranty — used tyre',featured:0},
      {brand:'Falken',model:'FK510',width:215,profile:50,rim:17,condition:'Used',price:65,qty:4,speed:'W',load_index:91,description:'Used tyre, good mid-range grip, 5.5mm tread remaining.',warranty:'No warranty — used tyre',featured:0},
      {brand:'Bridgestone',model:'Turanza T005',width:225,profile:45,rim:18,condition:'Used',price:70,qty:4,speed:'W',load_index:95,description:'Used, 5mm tread. OE fitment on many Japanese vehicles.',warranty:'No warranty — used tyre',featured:0},
      {brand:'Continental',model:'PremiumContact 6',width:205,profile:55,rim:16,condition:'Used',price:60,qty:4,speed:'V',load_index:91,description:'Used, 6mm tread. Quiet comfortable tyre in great condition.',warranty:'No warranty — used tyre',featured:0},
    ];
    db.transaction(rows => rows.forEach(r => ins.run(r)))(seed);
    console.log('✅  Seeded', seed.length, 'tyres');
  }

  // ── Vehicle fitment database ──────────────────────────────────────
  // Based on NZ top sellers + Japanese imports. OE sizes verified from manufacturer specs.
  // Format: [make, model, year, width, profile, rim, notes]
  if (!db.prepare('SELECT COUNT(*) as c FROM vehicles').get().c) {
    const ins = db.prepare('INSERT INTO vehicles (make,model,year,width,profile,rim,notes) VALUES (?,?,?,?,?,?,?)');
    const vehicles = [
      // ── TOYOTA ───────────────────────────────────────────────────
      // RAV4 — #1 or #2 best seller NZ every year
      ['Toyota','RAV4',2024,235,55,19,'RAV4 GX/GXL/Cruiser on 19"'],
      ['Toyota','RAV4',2023,235,55,19,'RAV4 GX/GXL/Cruiser on 19"'],
      ['Toyota','RAV4',2022,235,55,19,'RAV4 — OE Dunlop Grandtrek'],
      ['Toyota','RAV4',2021,235,55,18,'RAV4 2020-21 base model 18"'],
      ['Toyota','RAV4',2020,235,55,18,'RAV4 2019-20'],
      ['Toyota','RAV4 Hybrid',2024,235,55,19,'RAV4 Hybrid — same size as petrol'],
      ['Toyota','RAV4 Hybrid',2023,235,55,19,'RAV4 Hybrid'],
      ['Toyota','RAV4 Hybrid',2022,235,55,18,'RAV4 Hybrid earlier model'],
      // Hilux — top 3 NZ every year
      ['Toyota','Hilux',2024,265,65,17,'Hilux SR/SR5/Rogue 17" steel/alloy'],
      ['Toyota','Hilux',2023,265,65,17,'Hilux SR/SR5 OE size'],
      ['Toyota','Hilux',2022,265,65,17,'Hilux — most common NZ spec'],
      ['Toyota','Hilux',2021,265,65,17,'Hilux SR5'],
      ['Toyota','Hilux',2020,265,65,17,'Hilux'],
      ['Toyota','Hilux Rogue',2024,265,60,18,'Hilux Rogue/Rugged X 18"'],
      ['Toyota','Hilux Rogue',2023,265,60,18,'Hilux Rogue'],
      // Yaris Cross
      ['Toyota','Yaris Cross',2024,195,60,17,'Yaris Cross GX/GXL'],
      ['Toyota','Yaris Cross',2023,195,60,17,'Yaris Cross'],
      ['Toyota','Yaris Cross',2022,195,60,17,'Yaris Cross'],
      // Yaris hatch
      ['Toyota','Yaris',2024,185,60,15,'Yaris hatch base'],
      ['Toyota','Yaris',2023,185,60,15,'Yaris hatch'],
      // Corolla
      ['Toyota','Corolla',2024,205,55,16,'Corolla Ascent/GX sedan/hatch'],
      ['Toyota','Corolla',2023,205,55,16,'Corolla'],
      ['Toyota','Corolla',2022,205,55,16,'Corolla'],
      ['Toyota','Corolla',2021,205,55,16,'Corolla'],
      ['Toyota','Corolla',2020,205,55,16,'Corolla'],
      ['Toyota','Corolla Hybrid',2024,205,55,16,'Corolla Hybrid — same size'],
      ['Toyota','Corolla Hybrid',2023,205,55,16,'Corolla Hybrid'],
      // Corolla Cross
      ['Toyota','Corolla Cross',2024,225,50,18,'Corolla Cross GX/GXL'],
      ['Toyota','Corolla Cross',2023,225,50,18,'Corolla Cross'],
      // Camry
      ['Toyota','Camry',2024,215,55,17,'Camry Ascent Sport/SL'],
      ['Toyota','Camry',2023,215,55,17,'Camry'],
      ['Toyota','Camry',2022,215,55,17,'Camry'],
      ['Toyota','Camry',2021,215,55,17,'Camry'],
      // Land Cruiser
      ['Toyota','Land Cruiser',2024,285,60,18,'LandCruiser 300 Series GX/VX'],
      ['Toyota','Land Cruiser',2023,285,60,18,'LandCruiser 300 Series'],
      ['Toyota','Land Cruiser',2022,285,60,18,'LandCruiser 300 Series (new shape)'],
      ['Toyota','Land Cruiser 200',2021,285,60,18,'LandCruiser 200 Series (last year)'],
      ['Toyota','Land Cruiser Prado',2024,265,60,18,'Prado GX/VX 18"'],
      ['Toyota','Land Cruiser Prado',2023,265,60,18,'Prado'],
      ['Toyota','Land Cruiser Prado',2022,265,65,17,'Prado older shape 17"'],
      ['Toyota','Land Cruiser Prado',2021,265,65,17,'Prado'],
      // Fortuner
      ['Toyota','Fortuner',2024,265,60,18,'Fortuner GX/GXL'],
      ['Toyota','Fortuner',2023,265,60,18,'Fortuner'],
      ['Toyota','Fortuner',2022,265,60,18,'Fortuner'],
      // C-HR
      ['Toyota','C-HR',2024,215,55,18,'C-HR GX/GXL'],
      ['Toyota','C-HR',2023,215,55,18,'C-HR'],
      ['Toyota','C-HR',2022,215,55,18,'C-HR'],

      // ── FORD ─────────────────────────────────────────────────────
      // Ranger — #1 best seller NZ 10 years in a row
      ['Ford','Ranger',2024,265,60,18,'Ranger XL/XLS/XLT 18" (next-gen)'],
      ['Ford','Ranger',2023,265,60,18,'Ranger XL/XLS/XLT 18"'],
      ['Ford','Ranger',2022,265,65,17,'Ranger XL/XLS 17" (outgoing gen)'],
      ['Ford','Ranger',2021,265,65,17,'Ranger XL/XLS 17"'],
      ['Ford','Ranger',2020,265,65,17,'Ranger'],
      ['Ford','Ranger Wildtrak',2024,255,55,20,'Ranger Wildtrak 20"'],
      ['Ford','Ranger Wildtrak',2023,255,55,20,'Ranger Wildtrak 20"'],
      ['Ford','Ranger Raptor',2024,285,70,17,'Ranger Raptor — BF Goodrich AT 17"'],
      ['Ford','Ranger Raptor',2023,285,70,17,'Ranger Raptor'],
      // Everest
      ['Ford','Everest',2024,265,60,18,'Everest Ambiente/Trend 18"'],
      ['Ford','Everest',2023,265,60,18,'Everest'],
      ['Ford','Everest Platinum',2024,275,55,20,'Everest Platinum/Sport 20"'],
      // Escape
      ['Ford','Escape',2024,235,50,18,'Escape ST-Line/Titanium'],
      ['Ford','Escape',2023,235,50,18,'Escape'],
      ['Ford','Escape',2022,235,50,18,'Escape'],
      // Puma
      ['Ford','Puma',2024,195,55,17,'Puma (European import popular in NZ)'],
      ['Ford','Puma',2023,195,55,17,'Puma'],
      // Mustang
      ['Ford','Mustang',2024,255,40,19,'Mustang GT rear / 235/55/18 front — using rear size'],
      ['Ford','Mustang',2023,255,40,19,'Mustang GT'],
      ['Ford','Mustang',2022,255,40,19,'Mustang GT'],

      // ── MITSUBISHI ───────────────────────────────────────────────
      // ASX — huge seller 2024
      ['Mitsubishi','ASX',2024,215,55,18,'ASX MR/VRX 18" (new gen Renault-based)'],
      ['Mitsubishi','ASX',2023,215,55,18,'ASX'],
      ['Mitsubishi','ASX',2022,215,60,17,'ASX 2022 outgoing gen 17"'],
      ['Mitsubishi','ASX',2021,215,60,17,'ASX outgoing'],
      // Outlander
      ['Mitsubishi','Outlander',2024,235,55,18,'Outlander ES/LS 18"'],
      ['Mitsubishi','Outlander',2023,235,55,18,'Outlander — new gen (2022+)'],
      ['Mitsubishi','Outlander',2022,235,55,18,'Outlander new gen launch'],
      ['Mitsubishi','Outlander',2021,225,55,18,'Outlander outgoing gen'],
      ['Mitsubishi','Outlander',2020,225,55,18,'Outlander outgoing'],
      ['Mitsubishi','Outlander PHEV',2024,235,55,18,'Outlander PHEV — same size'],
      ['Mitsubishi','Outlander PHEV',2023,235,55,18,'Outlander PHEV'],
      // Eclipse Cross
      ['Mitsubishi','Eclipse Cross',2024,215,55,18,'Eclipse Cross LS/VRX 18"'],
      ['Mitsubishi','Eclipse Cross',2023,215,55,18,'Eclipse Cross'],
      ['Mitsubishi','Eclipse Cross',2022,215,60,17,'Eclipse Cross 2022 outgoing'],
      ['Mitsubishi','Eclipse Cross PHEV',2024,225,55,18,'Eclipse Cross PHEV'],
      ['Mitsubishi','Eclipse Cross PHEV',2023,225,55,18,'Eclipse Cross PHEV'],
      // Triton
      ['Mitsubishi','Triton',2024,265,60,18,'Triton GLX+/VRX 18"'],
      ['Mitsubishi','Triton',2023,265,60,18,'Triton'],
      ['Mitsubishi','Triton',2022,265,60,17,'Triton 17"'],
      ['Mitsubishi','Triton',2021,265,65,17,'Triton older'],
      // Pajero Sport
      ['Mitsubishi','Pajero Sport',2023,265,60,18,'Pajero Sport GLX/VRX'],
      ['Mitsubishi','Pajero Sport',2022,265,60,18,'Pajero Sport'],

      // ── SUZUKI ───────────────────────────────────────────────────
      // Swift — consistently top 5 in NZ
      ['Suzuki','Swift',2024,185,55,16,'Swift GL/GLX 16" (new 6th gen)'],
      ['Suzuki','Swift',2023,185,60,15,'Swift GL 15" (5th gen last year)'],
      ['Suzuki','Swift',2022,185,60,15,'Swift GL/GLX 15"'],
      ['Suzuki','Swift',2021,185,60,15,'Swift'],
      ['Suzuki','Swift',2020,185,60,15,'Swift'],
      ['Suzuki','Swift Sport',2024,195,50,17,'Swift Sport 17"'],
      ['Suzuki','Swift Sport',2023,195,50,17,'Swift Sport'],
      ['Suzuki','Swift Sport',2022,195,50,17,'Swift Sport'],
      // Vitara
      ['Suzuki','Vitara',2024,215,55,17,'Vitara GL/GLX 17"'],
      ['Suzuki','Vitara',2023,215,55,17,'Vitara'],
      ['Suzuki','Vitara',2022,215,55,17,'Vitara'],
      // Jimny
      ['Suzuki','Jimny',2024,195,80,15,'Jimny Sierra — unique size'],
      ['Suzuki','Jimny',2023,195,80,15,'Jimny Sierra'],
      ['Suzuki','Jimny',2022,195,80,15,'Jimny Sierra'],
      // S-Cross
      ['Suzuki','S-Cross',2024,215,55,17,'S-Cross GL/GLX'],
      ['Suzuki','S-Cross',2023,215,55,17,'S-Cross'],
      // Baleno
      ['Suzuki','Baleno',2024,185,65,15,'Baleno GL 15"'],
      ['Suzuki','Baleno',2023,185,65,15,'Baleno'],

      // ── KIA ──────────────────────────────────────────────────────
      // Seltos — huge 2024 surge in NZ
      ['Kia','Seltos',2024,215,55,17,'Seltos S/SX 17"'],
      ['Kia','Seltos',2023,215,55,17,'Seltos'],
      ['Kia','Seltos',2022,215,55,17,'Seltos'],
      ['Kia','Seltos GT-Line',2024,215,45,18,'Seltos GT-Line 18"'],
      ['Kia','Seltos GT-Line',2023,215,45,18,'Seltos GT-Line'],
      // Sportage
      ['Kia','Sportage',2024,235,55,18,'Sportage S/SX 18" (NX4)'],
      ['Kia','Sportage',2023,235,55,18,'Sportage'],
      ['Kia','Sportage',2022,235,55,18,'Sportage new gen'],
      ['Kia','Sportage',2021,235,60,17,'Sportage old gen'],
      // Picanto
      ['Kia','Picanto',2024,175,65,14,'Picanto S 14"'],
      ['Kia','Picanto',2023,175,65,14,'Picanto'],
      // Cerato
      ['Kia','Cerato',2024,205,55,16,'Cerato S/SX'],
      ['Kia','Cerato',2023,205,55,16,'Cerato'],
      ['Kia','Cerato',2022,205,55,16,'Cerato'],
      // Stinger
      ['Kia','Stinger',2024,225,40,19,'Stinger GT front 225/40R19'],
      ['Kia','Stinger',2023,225,40,19,'Stinger GT'],
      // EV6
      ['Kia','EV6',2024,235,55,19,'EV6 Standard/Long Range'],
      ['Kia','EV6',2023,235,55,19,'EV6'],
      // EV9
      ['Kia','EV9',2024,255,45,21,'EV9 Air/GT-Line'],
      // Sorento
      ['Kia','Sorento',2024,235,55,19,'Sorento S/SX 19" (MQ4)'],
      ['Kia','Sorento',2023,235,55,19,'Sorento'],

      // ── HYUNDAI ──────────────────────────────────────────────────
      // Tucson
      ['Hyundai','Tucson',2024,235,55,17,'Tucson Active/Elite 17" (NX4)'],
      ['Hyundai','Tucson',2023,235,55,17,'Tucson'],
      ['Hyundai','Tucson',2022,235,55,17,'Tucson new gen'],
      ['Hyundai','Tucson',2021,235,60,17,'Tucson outgoing'],
      ['Hyundai','Tucson N-Line',2024,245,45,19,'Tucson N-Line 19"'],
      // i30
      ['Hyundai','i30',2024,205,60,16,'i30 Active/Elite 16"'],
      ['Hyundai','i30',2023,205,60,16,'i30'],
      ['Hyundai','i30',2022,205,60,16,'i30'],
      ['Hyundai','i30 N',2024,235,40,19,'i30 N — performance 19"'],
      // IONIQ 5
      ['Hyundai','IONIQ 5',2024,235,55,19,'IONIQ 5 Standard/Long Range'],
      ['Hyundai','IONIQ 5',2023,235,55,19,'IONIQ 5'],
      ['Hyundai','IONIQ 6',2024,245,45,20,'IONIQ 6 — 20"'],
      // Santa Fe
      ['Hyundai','Santa Fe',2024,235,55,19,'Santa Fe Active/Elite 19" (MX5)'],
      ['Hyundai','Santa Fe',2023,235,55,18,'Santa Fe 18" outgoing gen'],
      // Kona
      ['Hyundai','Kona',2024,215,55,17,'Kona Active/Elite 17"'],
      ['Hyundai','Kona',2023,215,55,17,'Kona'],
      ['Hyundai','Kona Electric',2024,215,55,17,'Kona Electric'],
      // Staria
      ['Hyundai','Staria',2024,235,60,17,'Staria Active/Elite'],
      ['Hyundai','Staria',2023,235,60,17,'Staria'],

      // ── MG ───────────────────────────────────────────────────────
      // MG4 — massive growth in NZ 2023-2024
      ['MG','MG4',2024,215,55,17,'MG4 Excite/Essence/X-Power 17"'],
      ['MG','MG4',2023,215,55,17,'MG4'],
      ['MG','MG4 XPOWER',2024,235,45,18,'MG4 XPOWER 18"'],
      // MG ZS
      ['MG','ZS',2024,215,60,16,'MG ZS Excite 16"'],
      ['MG','ZS',2023,215,60,16,'MG ZS'],
      ['MG','ZS EV',2024,215,55,17,'MG ZS EV — 17"'],
      ['MG','ZS EV',2023,215,55,17,'MG ZS EV'],
      // MG HS
      ['MG','HS',2024,235,50,18,'MG HS Essence/X 18"'],
      ['MG','HS',2023,235,50,18,'MG HS'],
      // MG3
      ['MG','MG3',2024,195,50,16,'MG3 Excite 16"'],
      ['MG','MG3',2023,195,50,16,'MG3'],

      // ── BYD ──────────────────────────────────────────────────────
      // Atto 3 — top 3 EV in NZ
      ['BYD','Atto 3',2024,215,55,18,'Atto 3 Standard/Extended Range'],
      ['BYD','Atto 3',2023,215,55,18,'Atto 3'],
      ['BYD','Seal',2024,235,45,19,'BYD Seal Standard/Performance'],
      ['BYD','Seal',2023,235,45,19,'BYD Seal'],
      ['BYD','Dolphin',2024,195,60,16,'BYD Dolphin 16"'],
      ['BYD','Dolphin',2023,195,60,16,'BYD Dolphin'],
      ['BYD','Shark 6',2025,265,60,18,'BYD Shark 6 PHEV ute'],

      // ── NISSAN ───────────────────────────────────────────────────
      ['Nissan','X-Trail',2024,235,55,18,'X-Trail Ti/Ti-L 18" (T33)'],
      ['Nissan','X-Trail',2023,235,55,18,'X-Trail T33'],
      ['Nissan','X-Trail',2022,225,65,17,'X-Trail T32 outgoing'],
      ['Nissan','X-Trail',2021,225,65,17,'X-Trail T32'],
      ['Nissan','Navara',2024,265,60,17,'Navara RX/ST/ST-X 17"'],
      ['Nissan','Navara',2023,265,60,17,'Navara'],
      ['Nissan','Navara',2022,265,60,17,'Navara'],
      ['Nissan','Leaf',2024,215,50,17,'Leaf 40kWh/62kWh 17"'],
      ['Nissan','Leaf',2023,215,50,17,'Leaf'],
      ['Nissan','Leaf',2022,215,50,17,'Leaf'],
      ['Nissan','Qashqai',2024,235,55,18,'Qashqai ST/Ti 18" (J12)'],
      ['Nissan','Qashqai',2023,235,55,18,'Qashqai'],
      ['Nissan','Patrol',2024,285,60,18,'Patrol Ti 18"'],
      ['Nissan','Patrol',2023,285,60,18,'Patrol Ti'],

      // ── MAZDA ────────────────────────────────────────────────────
      ['Mazda','CX-5',2024,225,55,19,'CX-5 Maxx/Touring/GT/Akera 19"'],
      ['Mazda','CX-5',2023,225,55,19,'CX-5'],
      ['Mazda','CX-5',2022,225,55,19,'CX-5'],
      ['Mazda','CX-5',2021,225,55,19,'CX-5'],
      ['Mazda','CX-8',2024,225,55,19,'CX-8 Sport/GT/Asaki 19"'],
      ['Mazda','CX-8',2023,225,55,19,'CX-8'],
      ['Mazda','CX-30',2024,215,55,18,'CX-30 G20/G25/X 18"'],
      ['Mazda','CX-30',2023,215,55,18,'CX-30'],
      ['Mazda','CX-60',2024,235,50,20,'CX-60 G40e/PHEV 20"'],
      ['Mazda','CX-60',2023,235,50,20,'CX-60'],
      ['Mazda','Mazda3',2024,215,45,18,'Mazda3 G20/G25 hatch/sedan 18"'],
      ['Mazda','Mazda3',2023,215,45,18,'Mazda3'],
      ['Mazda','Mazda3',2022,215,45,18,'Mazda3'],
      ['Mazda','Mazda6',2024,215,45,18,'Mazda6 Sport/GT 18"'],
      ['Mazda','BT-50',2024,265,60,18,'BT-50 XS/XT/GT 18"'],
      ['Mazda','BT-50',2023,265,60,18,'BT-50'],
      ['Mazda','BT-50',2022,265,65,17,'BT-50 base 17"'],

      // ── SUBARU ────────────────────────────────────────────────────
      ['Subaru','Outback',2024,225,60,18,'Outback 2.5i/XT 18"'],
      ['Subaru','Outback',2023,225,60,18,'Outback'],
      ['Subaru','Outback',2022,225,60,18,'Outback'],
      ['Subaru','Forester',2024,225,55,18,'Forester 2.5i 18"'],
      ['Subaru','Forester',2023,225,55,18,'Forester'],
      ['Subaru','Forester',2022,225,55,18,'Forester'],
      ['Subaru','XV',2024,225,55,17,'XV 2.0i 17" — now Crosstrek in some markets'],
      ['Subaru','XV',2023,225,55,17,'XV'],
      ['Subaru','XV',2022,225,55,17,'XV'],
      ['Subaru','WRX',2024,245,40,18,'WRX VB chassis 18"'],
      ['Subaru','WRX',2023,245,40,18,'WRX'],
      ['Subaru','BRZ',2024,215,45,18,'BRZ (ZD8) 18"'],
      ['Subaru','BRZ',2023,215,45,18,'BRZ'],
      ['Subaru','Impreza',2024,205,55,16,'Impreza 2.0i 16"'],
      ['Subaru','Impreza',2023,205,55,16,'Impreza'],

      // ── VOLKSWAGEN ────────────────────────────────────────────────
      ['Volkswagen','Golf',2024,225,40,18,'Golf 8 GTI/R-Line 18"'],
      ['Volkswagen','Golf',2023,225,40,18,'Golf 8'],
      ['Volkswagen','Golf',2022,225,40,18,'Golf 8'],
      ['Volkswagen','Golf GTI',2024,225,35,19,'Golf GTI 19"'],
      ['Volkswagen','Golf GTI',2023,225,35,19,'Golf GTI'],
      ['Volkswagen','Tiguan',2024,235,50,19,'Tiguan 162TSI/R-Line 19"'],
      ['Volkswagen','Tiguan',2023,235,50,19,'Tiguan'],
      ['Volkswagen','Tiguan',2022,235,50,18,'Tiguan 18"'],
      ['Volkswagen','T-Roc',2024,215,50,18,'T-Roc 140TSI/R-Line'],
      ['Volkswagen','T-Roc',2023,215,50,18,'T-Roc'],
      ['Volkswagen','Amarok',2024,255,60,18,'Amarok V6 TDI 18"'],
      ['Volkswagen','Amarok',2023,255,60,18,'Amarok'],
      ['Volkswagen','Polo',2024,195,55,15,'Polo 70TSI/85TSI 15"'],
      ['Volkswagen','Polo',2023,195,55,15,'Polo'],

      // ── BMW ───────────────────────────────────────────────────────
      ['BMW','3 Series',2024,225,45,18,'330i/M340i base 18"'],
      ['BMW','3 Series',2023,225,45,18,'3 Series G20'],
      ['BMW','5 Series',2024,245,45,18,'530i/520d 18"'],
      ['BMW','5 Series',2023,245,45,18,'5 Series G30'],
      ['BMW','X3',2024,245,50,19,'X3 xDrive20i/30i 19"'],
      ['BMW','X3',2023,245,50,19,'X3'],
      ['BMW','X5',2024,255,50,19,'X5 xDrive30d/50e 19"'],
      ['BMW','X5',2023,255,50,19,'X5 G05'],
      ['BMW','X1',2024,225,50,18,'X1 sDrive18i 18"'],
      ['BMW','X1',2023,225,50,18,'X1'],

      // ── MERCEDES-BENZ ─────────────────────────────────────────────
      ['Mercedes-Benz','C-Class',2024,225,45,18,'C200/C300 W206 18"'],
      ['Mercedes-Benz','C-Class',2023,225,45,18,'C-Class W206'],
      ['Mercedes-Benz','GLC',2024,235,55,19,'GLC 200/300 X254 19"'],
      ['Mercedes-Benz','GLC',2023,235,55,19,'GLC'],
      ['Mercedes-Benz','A-Class',2024,205,55,16,'A180/A200 W177 16"'],
      ['Mercedes-Benz','A-Class',2023,205,55,16,'A-Class'],
      ['Mercedes-Benz','GLA',2024,225,50,18,'GLA 200/250 H247'],
      ['Mercedes-Benz','GLA',2023,225,50,18,'GLA'],

      // ── AUDI ─────────────────────────────────────────────────────
      ['Audi','A4',2024,225,50,17,'A4 40 TFSI Kombi/sedan 17"'],
      ['Audi','A4',2023,225,50,17,'A4 B9'],
      ['Audi','Q5',2024,235,55,19,'Q5 45 TFSI/50 TDI 19"'],
      ['Audi','Q5',2023,235,55,19,'Q5'],
      ['Audi','Q3',2024,215,55,17,'Q3 35 TFSI 17"'],
      ['Audi','Q3',2023,215,55,17,'Q3'],
      ['Audi','A3',2024,225,45,17,'A3 Sportback 35/40 TFSI'],
      ['Audi','A3',2023,225,45,17,'A3'],

      // ── HONDA ────────────────────────────────────────────────────
      ['Honda','CR-V',2024,235,50,19,'CR-V VTi/VTi-LX 19" (RS6)'],
      ['Honda','CR-V',2023,235,50,19,'CR-V'],
      ['Honda','CR-V',2022,235,60,18,'CR-V outgoing gen 18"'],
      ['Honda','Jazz',2024,185,60,15,'Jazz VTi 15"'],
      ['Honda','Jazz',2023,185,60,15,'Jazz'],
      ['Honda','Jazz',2022,185,60,15,'Jazz'],
      ['Honda','Civic',2024,235,40,18,'Civic VTi-LX/RS hatch 18" (11th gen)'],
      ['Honda','Civic',2023,235,40,18,'Civic 11th gen'],
      ['Honda','Civic',2022,235,40,18,'Civic'],
      ['Honda','HR-V',2024,215,55,17,'HR-V VTi/VTi-LX 17"'],
      ['Honda','HR-V',2023,215,55,17,'HR-V'],
      ['Honda','HR-V',2022,215,55,17,'HR-V'],
      ['Honda','ZR-V',2024,235,50,18,'ZR-V e:HEV 18"'],
      ['Honda','ZR-V',2023,235,50,18,'ZR-V'],

      // ── ISUZU ────────────────────────────────────────────────────
      ['Isuzu','D-Max',2024,265,60,18,'D-Max LS/LS-U/X-Terrain 18"'],
      ['Isuzu','D-Max',2023,265,60,18,'D-Max'],
      ['Isuzu','D-Max',2022,265,65,17,'D-Max base 17"'],
      ['Isuzu','D-Max',2021,265,65,17,'D-Max'],
      ['Isuzu','MU-X',2024,265,60,18,'MU-X LS/LS-U 18"'],
      ['Isuzu','MU-X',2023,265,60,18,'MU-X'],

      // ── GREAT WALL / GWM ─────────────────────────────────────────
      ['GWM','Ute',2024,265,60,18,'GWM Ute Ultra/Cannon 18"'],
      ['GWM','Ute',2023,265,60,18,'GWM Ute'],
      ['GWM','Haval H6',2024,235,55,18,'Haval H6 Ultra/GT 18"'],
      ['GWM','Haval H6',2023,235,55,18,'Haval H6'],
      ['GWM','Haval Jolion',2024,215,55,17,'Haval Jolion Ultra 17"'],
      ['GWM','Haval Jolion',2023,215,55,17,'Haval Jolion'],
      ['GWM','Tank 300',2024,255,60,18,'Tank 300 Hi4 18"'],
      ['GWM','Tank 300',2023,255,60,18,'Tank 300'],

      // ── TESLA ────────────────────────────────────────────────────
      ['Tesla','Model 3',2024,235,40,18,'Model 3 RWD/LR/Performance 18"'],
      ['Tesla','Model 3',2023,235,40,18,'Model 3 Highland'],
      ['Tesla','Model 3',2022,235,40,18,'Model 3'],
      ['Tesla','Model Y',2024,255,45,19,'Model Y LR/Performance 19"'],
      ['Tesla','Model Y',2023,255,45,19,'Model Y'],
      ['Tesla','Model Y',2022,255,45,19,'Model Y'],
      ['Tesla','Model S',2024,245,45,21,'Model S Plaid 21"'],
      ['Tesla','Model X',2024,265,45,20,'Model X Plaid 20"'],

      // ── PORSCHE ───────────────────────────────────────────────────
      ['Porsche','911',2024,245,40,20,'911 Carrera S front 245/40R20'],
      ['Porsche','Cayenne',2024,285,40,21,'Cayenne S/GTS 21"'],
      ['Porsche','Macan',2024,235,55,19,'Macan S/GTS 19"'],
      ['Porsche','Macan',2023,235,55,19,'Macan'],

      // ── LAND ROVER ────────────────────────────────────────────────
      ['Land Rover','Defender',2024,255,55,20,'Defender 90/110 SE/X 20"'],
      ['Land Rover','Defender',2023,255,55,20,'Defender'],
      ['Land Rover','Discovery Sport',2024,235,55,19,'Discovery Sport S/SE/HSE'],
      ['Land Rover','Range Rover Evoque',2024,235,50,20,'Evoque R-Dynamic 20"'],

      // ── JEEP ─────────────────────────────────────────────────────
      ['Jeep','Wrangler',2024,255,75,17,'Wrangler Sahara/Rubicon 17"'],
      ['Jeep','Wrangler',2023,255,75,17,'Wrangler'],
      ['Jeep','Compass',2024,215,55,18,'Compass Limited/S-Limited'],
      ['Jeep','Compass',2023,215,55,18,'Compass'],

      // ── POPULAR JAPANESE IMPORTS (used vehicles) ──────────────────
      ['Toyota','Aqua',2022,185,60,15,'Aqua (NHP10/NHP10G hybrid)'],
      ['Toyota','Aqua',2021,185,60,15,'Aqua'],
      ['Toyota','Aqua',2020,185,60,15,'Aqua'],
      ['Toyota','Vitz',2019,175,65,14,'Vitz KSP130 14"'],
      ['Toyota','Vitz',2018,175,65,14,'Vitz'],
      ['Toyota','Wish',2018,205,60,16,'Wish ZGE20 — common import'],
      ['Toyota','Wish',2017,205,60,16,'Wish'],
      ['Toyota','Noah',2022,195,65,15,'Noah ZRR80/ZRR85 15"'],
      ['Toyota','Alphard',2022,215,55,17,'Alphard AGH30 17"'],
      ['Toyota','Alphard',2021,215,55,17,'Alphard'],
      ['Toyota','Hiace',2023,195,80,15,'Hiace commuter 15"'],
      ['Toyota','Hiace',2022,195,80,15,'Hiace'],
      ['Honda','Fit',2020,175,65,14,'Fit GK3/GK5 14"'],
      ['Honda','Fit',2019,175,65,14,'Fit'],
      ['Honda','Freed',2019,185,60,15,'Freed GB5/GB6'],
      ['Honda','Odyssey',2019,215,55,17,'Odyssey RC1/RC2 17"'],
      ['Nissan','Note',2020,185,60,15,'Note E12/E13 15"'],
      ['Nissan','Note',2019,185,60,15,'Note'],
      ['Nissan','Tiida',2018,195,55,16,'Tiida C11'],
      ['Mazda','Demio',2019,185,60,15,'Demio DJ3FS/DJ5FS 15"'],
      ['Mazda','Atenza',2019,225,45,19,'Atenza GJ/GJ2FP 19"'],
      ['Mazda','Axela',2019,205,60,16,'Axela BM2AP 16"'],
      ['Subaru','Legacy',2019,215,55,16,'Legacy BN9/BS9 16"'],
      ['Mitsubishi','Delica',2023,225,70,16,'Delica D5 16"'],
      ['Mitsubishi','Delica',2022,225,70,16,'Delica D5'],
    ];
    db.transaction(rows => rows.forEach(r => ins.run(...r)))(vehicles);
    console.log('✅  Seeded', vehicles.length, 'vehicles');
  }

  console.log('✅  DB ready:', DB_PATH);
  return db;
}
module.exports = { getDb, initDb };
