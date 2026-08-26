const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { LazyDatabase } = require('../lib/sqlJsDatabase');
const slugify = require('../lib/slugify');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'app.db');
const db = new LazyDatabase(DB_PATH);

function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get([key]);
  return row ? row.value : null;
}

function setSetting(key, value) {
  db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  ).run([key, value]);
}

async function init() {
  await db.init();

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  db.pragma('foreign_keys = ON');

  // Migration: add gallery_images to reviews if upgrading from an older DB
  // that predates it (CREATE TABLE IF NOT EXISTS above won't add columns to
  // an existing table).
  const reviewColumns = db.prepare('PRAGMA table_info(reviews)').all();
  if (!reviewColumns.some((c) => c.name === 'gallery_images')) {
    db.exec('ALTER TABLE reviews ADD COLUMN gallery_images TEXT');
  }

  // Session secret: generated once and persisted, so it survives restarts
  // without needing the hosting platform to support custom env vars.
  if (!getSetting('session_secret')) {
    setSetting('session_secret', crypto.randomBytes(48).toString('hex'));
  }

  // Seed default admin account on first boot.
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const hash = bcrypt.hashSync(password, 10);
    db.prepare(
      'INSERT INTO users (username, password_hash, must_change_password) VALUES (?, ?, 1)'
    ).run([username, hash]);
    console.log('----------------------------------------------------------');
    console.log(' First run: an admin account was created.');
    console.log(` Username: ${username}`);
    console.log(` Password: ${password}`);
    console.log(' Please log in at /admin/login and change this password immediately.');
    console.log('----------------------------------------------------------');
  }

  // Seed starter categories + sample content so the site isn't empty on first deploy.
  const categoryCount = db.prepare('SELECT COUNT(*) AS c FROM categories').get().c;
  if (categoryCount === 0) {
    const categories = [
      ['Tech & Gadgets', 'Reviews and deals on electronics, gadgets and smart devices.'],
      ['Home & Kitchen', 'Reviews and deals on home essentials, appliances and kitchen gear.'],
      ['Fashion & Beauty', 'Reviews and deals on clothing, accessories and beauty products.'],
      ['Software & Apps', 'Reviews and deals on software, SaaS tools and apps.'],
      ['Health & Fitness', 'Reviews and deals on fitness gear, wellness and health products.'],
      ['Travel & Outdoors', 'Reviews and deals on travel gear and outdoor equipment.'],
    ];
    const insertCat = db.prepare(
      'INSERT INTO categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)'
    );
    categories.forEach(([name, description], i) => {
      insertCat.run([name, slugify(name), description, i]);
    });
  }

  // Seed the starter reviews + coupons from the shared content module, but
  // only on a genuinely fresh install (empty reviews table). Once seeded,
  // these become normal admin-editable content and are never silently
  // overwritten again on restart. To push an updated version of this
  // starter content onto an already-running site, use the explicit
  // /admin/tools/sync-content route instead (runs the same syncContent()
  // but as a deliberate, logged-in action).
  const reviewCount = db.prepare('SELECT COUNT(*) AS c FROM reviews').get().c;
  if (reviewCount === 0) {
    const { syncContent } = require('../lib/extraContent');
    syncContent(db);
  }

  db._saveSync();
}

module.exports = { db, getSetting, setSetting, init };
