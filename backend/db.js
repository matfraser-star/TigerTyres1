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
      notes TEXT, status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled','completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT
    );
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL, model TEXT NOT NULL, year INTEGER NOT NULL,
      width INTEGER NOT NULL, profile INTEGER NOT NULL, rim INTEGER NOT NULL
    );
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_tyre_ts AFTER UPDATE ON tyres
    BEGIN UPDATE tyres SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; END;
  `);

  if (!db.prepare('SELECT id FROM admins WHERE username=?').get('tiger')) {
    db.prepare('INSERT INTO admins (username,password_hash) VALUES (?,?)').run('tiger', bcrypt.hashSync('tiger123',10));
    console.log('✅  Admin created: tiger / tiger123');
  }

  // All settings with NZ defaults
  const defaults = {
    // Contact & location
    shop_name:       'Tiger Tyres',
    phone:           '06 835 0000',
    email:           'info@tigertyres.co.nz',
    address:         '123 Carlyle Street, Napier 4110, New Zealand',
    abn:             '',
    gst:             '123-456-789',
    whatsapp:        '6468350000',
    instagram:       '',
    maps_embed:      '',
    // Hours
    hours_weekday:   'Mon–Fri: 8am – 5:30pm',
    hours_sat:       'Saturday: 8:30am – 3pm',
    hours_sun:       'Sunday: Closed',
    // Features
    price_match:     'true',
    // SMTP
    smtp_host:       '', smtp_port:'587', smtp_user:'', smtp_pass:'', notify_email:'',
    // Hero section content
    hero_eyebrow:    "NAPIER'S TYRE SPECIALISTS",
    hero_heading:    'FIND YOUR',
    hero_heading_highlight: 'PERFECT TYRE',
    hero_subtext:    "22-inch 285/40s down to budget second-hand — every size, every budget.",
    hero_badge_text: 'PRICE MATCH GUARANTEE — Show us any quote, we\'ll beat it',
    hero_logo_url:   '',
    // Footer
    footer_tagline:  'Premium & budget tyres for every vehicle. Fitting available 6 days a week.',
    footer_about:    'Tiger Tyres has been Napier\'s trusted tyre specialist for over 15 years. From budget second-hand tyres to premium 22" performance rubber — we stock it all and fit it fast.',
    // About page
    about_text1:     'Tiger Tyres has been Hawke\'s Bay\'s trusted tyre specialist for over 15 years. From budget second-hand tyres to premium 22" performance rubber — we stock it all and fit it fast.',
    about_text2:     'Our experienced team handles everything from everyday hatchbacks to high-performance sports cars. We price-match any written quote.',
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
      {brand:'Michelin',model:'Energy Saver+',width:195,profile:65,rim:15,condition:'Used',price:55,qty:3,speed:'H',load_index:91,description:'Second-hand, 5mm tread remaining. Perfect budget option.',warranty:'No warranty — used tyre',featured:0},
      {brand:'Goodyear',model:'Eagle F1 Asymm 5',width:235,profile:40,rim:19,condition:'Used',price:90,qty:2,speed:'Y',load_index:96,description:'Second-hand, 6mm tread. Great shape for the price.',warranty:'No warranty — used tyre',featured:0},
      {brand:'Falken',model:'FK510',width:215,profile:50,rim:17,condition:'Used',price:65,qty:4,speed:'W',load_index:91,description:'Used tyre, good mid-range grip, 5.5mm tread remaining.',warranty:'No warranty — used tyre',featured:0},
    ];
    db.transaction(rows => rows.forEach(r => ins.run(r)))(seed);
    console.log('✅  Seeded tyres');
  }

  // Seed vehicles
  if (!db.prepare('SELECT COUNT(*) as c FROM vehicles').get().c) {
    const ins = db.prepare(`INSERT INTO vehicles (make,model,year,width,profile,rim) VALUES (?,?,?,?,?,?)`);
    const vehicles = [
      ['Toyota','Camry',2023,225,45,18],['Toyota','Camry',2022,225,45,18],['Toyota','Corolla',2023,195,65,15],
      ['Toyota','RAV4',2023,235,55,18],['Toyota','Hilux',2023,265,60,18],['Toyota','Land Cruiser',2023,285,60,18],
      ['Ford','Ranger',2023,265,60,18],['Ford','Mustang',2023,255,40,19],['Ford','Focus',2022,205,55,16],
      ['Holden','Commodore',2020,235,45,18],['Holden','Colorado',2020,265,60,18],
      ['Mazda','CX-5',2023,225,55,19],['Mazda','Mazda3',2023,205,60,16],['Mazda','BT-50',2023,265,60,18],
      ['Subaru','Outback',2023,225,60,17],['Subaru','Forester',2023,225,55,17],['Subaru','WRX',2023,245,40,18],
      ['Volkswagen','Golf',2023,205,55,16],['Volkswagen','Tiguan',2023,235,50,18],
      ['BMW','3 Series',2023,225,45,18],['BMW','5 Series',2023,245,45,18],['BMW','X5',2023,255,50,19],
      ['Mercedes-Benz','C-Class',2023,225,45,17],['Mercedes-Benz','GLC',2023,235,55,19],
      ['Audi','A4',2023,225,50,17],['Audi','Q5',2023,235,55,19],
      ['Nissan','Navara',2023,265,60,17],['Nissan','X-Trail',2023,225,60,17],['Nissan','Leaf',2023,215,50,17],
      ['Hyundai','Tucson',2023,225,55,18],['Hyundai','i30',2023,205,55,16],
      ['Kia','Sportage',2023,235,55,18],['Kia','Cerato',2023,205,55,16],
      ['Tesla','Model 3',2023,235,40,18],['Tesla','Model Y',2023,255,45,19],
      ['Mitsubishi','Triton',2023,265,60,17],['Mitsubishi','Outlander',2023,225,55,18],
      ['Honda','CR-V',2023,235,55,18],['Honda','Civic',2023,215,55,16],
      ['Porsche','911',2023,285,40,20],['Porsche','Cayenne',2023,265,50,19],
      ['Land Rover','Defender',2023,255,55,20],['Land Rover','Discovery',2023,255,55,19],
      ['Isuzu','D-Max',2023,265,65,17],['Great Wall','Cannon',2023,265,60,18],
    ];
    db.transaction(rows => rows.forEach(r => ins.run(...r)))(vehicles);
    console.log('✅  Seeded vehicles');
  }

  console.log('✅  DB ready:', DB_PATH);
  return db;
}
module.exports = { getDb, initDb };
