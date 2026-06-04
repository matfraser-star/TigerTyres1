// db.js — SQLite database initialisation and seed data
'use strict';

const Database = require('better-sqlite3');
const path     = require('path');
const bcrypt   = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'tigertyres.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS tyres (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      brand       TEXT NOT NULL,
      model       TEXT NOT NULL,
      width       INTEGER NOT NULL,
      profile     INTEGER NOT NULL,
      rim         INTEGER NOT NULL,
      condition   TEXT NOT NULL DEFAULT 'New' CHECK(condition IN ('New','Used')),
      price       REAL NOT NULL,
      qty         INTEGER NOT NULL DEFAULT 0,
      speed       TEXT NOT NULL DEFAULT 'V',
      load_index  INTEGER NOT NULL DEFAULT 91,
      description TEXT,
      image_url   TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admins (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      email      TEXT,
      message    TEXT,
      items_json TEXT,
      status     TEXT DEFAULT 'new' CHECK(status IN ('new','contacted','completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_tyre_timestamp
    AFTER UPDATE ON tyres
    BEGIN
      UPDATE tyres SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  // Default admin
  const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get('tiger');
  if (!adminExists) {
    const hash = bcrypt.hashSync('tiger123', 10);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('tiger', hash);
    console.log('✅  Default admin created: tiger / tiger123');
  }

  // Default settings
  const defaults = {
    shop_name:     'Tiger Tyres',
    phone:         '(03) 9999 1234',
    email:         'sales@tigertyres.com.au',
    address:       '123 Motorway Rd, Melbourne VIC 3000',
    hours_weekday: 'Mon–Fri: 8am – 6pm',
    hours_sat:     'Saturday: 8am – 4pm',
    hours_sun:     'Sunday: 9am – 2pm',
    abn:           '00 000 000 000',
  };
  const upsertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(defaults)) upsertSetting.run(k, v);

  // Seed tyres
  const tyreCount = db.prepare('SELECT COUNT(*) as c FROM tyres').get().c;
  if (tyreCount === 0) {
    const insert = db.prepare(`
      INSERT INTO tyres (brand, model, width, profile, rim, condition, price, qty, speed, load_index, description)
      VALUES (@brand, @model, @width, @profile, @rim, @condition, @price, @qty, @speed, @load_index, @description)
    `);
    const seed = [
      { brand:'Michelin',    model:'Pilot Sport 5',    width:285, profile:40, rim:22, condition:'New',  price:420, qty:4,  speed:'Y', load_index:106, description:'Ultra-high-performance summer tyre. Exceptional dry and wet grip.' },
      { brand:'Pirelli',     model:'P Zero PZ4',       width:275, profile:35, rim:21, condition:'New',  price:390, qty:2,  speed:'Y', load_index:103, description:'OEM fitment for Ferrari & Lamborghini. Razor-sharp handling.' },
      { brand:'Continental', model:'SportContact 7',   width:265, profile:35, rim:20, condition:'New',  price:310, qty:6,  speed:'Y', load_index:99,  description:'Track-tested performance with outstanding longevity.' },
      { brand:'Bridgestone', model:'Potenza Sport',    width:245, profile:45, rim:19, condition:'New',  price:270, qty:8,  speed:'Y', load_index:98,  description:'Balanced high-performance with excellent wet weather confidence.' },
      { brand:'Yokohama',    model:'Advan Sport V107', width:255, profile:40, rim:20, condition:'New',  price:255, qty:4,  speed:'Y', load_index:101, description:'Japanese engineering meets European performance standards.' },
      { brand:'Dunlop',      model:'Sport Maxx RT2',   width:225, profile:45, rim:18, condition:'New',  price:195, qty:10, speed:'W', load_index:95,  description:'Everyday performance tyre with strong all-round capability.' },
      { brand:'Pirelli',     model:'Cinturato P7',     width:205, profile:55, rim:16, condition:'New',  price:145, qty:12, speed:'V', load_index:91,  description:'Eco-focused touring tyre, low rolling resistance.' },
      { brand:'Michelin',    model:'Energy Saver+',    width:195, profile:65, rim:15, condition:'Used', price:55,  qty:3,  speed:'H', load_index:91,  description:'Second-hand, 5mm tread remaining. Perfect budget option.' },
      { brand:'Goodyear',    model:'Eagle F1 Asymm 5', width:235, profile:40, rim:19, condition:'Used', price:90,  qty:2,  speed:'Y', load_index:96,  description:'Second-hand, 6mm tread. Great shape for the price.' },
      { brand:'Falken',      model:'FK510',            width:215, profile:50, rim:17, condition:'Used', price:65,  qty:4,  speed:'W', load_index:91,  description:'Used tyre, good mid-range grip, 5.5mm tread remaining.' },
    ];
    const insertMany = db.transaction((rows) => { for (const r of rows) insert.run(r); });
    insertMany(seed);
    console.log(`✅  Seeded ${seed.length} tyres`);
  }

  console.log('✅  Database ready:', DB_PATH);
  return db;
}

module.exports = { getDb, initDb };
