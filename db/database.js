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

  const reviewCount = db.prepare('SELECT COUNT(*) AS c FROM reviews').get().c;
  if (reviewCount === 0) {
    const techId = db.prepare('SELECT id FROM categories WHERE slug = ?').get(['tech-gadgets']).id;
    const softwareId = db.prepare('SELECT id FROM categories WHERE slug = ?').get(['software-apps']).id;

    const insertReview = db.prepare(`
      INSERT INTO reviews
        (title, slug, category_id, summary, content, image_url, rating, pros, cons, price, original_price, affiliate_url, affiliate_network, coupon_code, featured, status)
      VALUES (@title, @slug, @category_id, @summary, @content, @image_url, @rating, @pros, @cons, @price, @original_price, @affiliate_url, @affiliate_network, @coupon_code, @featured, @status)
    `);

    insertReview.run({
      title: 'Sample Review: Wireless Noise-Cancelling Headphones (Edit or delete this)',
      slug: 'sample-review-wireless-headphones',
      category_id: techId,
      summary:
        'This is a placeholder review so you can see how a review page looks. Replace it with a real product from the Admin panel.',
      content:
        '<p>This is sample content. Go to <strong>Admin &rarr; Reviews</strong> to edit or delete this entry and add your own real product reviews.</p><p>A good review usually covers: what the product does, who it is for, what you liked, what could be better, and a clear final verdict.</p>',
      image_url: '/images/placeholder-product.svg',
      rating: 4.5,
      pros: JSON.stringify(['Great sound quality', 'Comfortable for long sessions', 'Long battery life']),
      cons: JSON.stringify(['Case feels a bit bulky', 'App could be more polished']),
      price: '$79.99',
      original_price: '$99.99',
      affiliate_url: 'https://example.com/?ref=your-affiliate-id',
      affiliate_network: 'Sample Network',
      coupon_code: 'SAVE20',
      featured: 1,
      status: 'published',
    });

    insertReview.run({
      title: 'Sample Review: Productivity App Suite (Edit or delete this)',
      slug: 'sample-review-productivity-app',
      category_id: softwareId,
      summary: 'A second placeholder review, this time for a software product, so you can see category variety.',
      content:
        '<p>Replace this with a real software or app review. You can format the body with basic HTML: paragraphs, <strong>bold</strong>, and lists.</p>',
      image_url: '/images/placeholder-product.svg',
      rating: 4,
      pros: JSON.stringify(['Clean interface', 'Useful free tier', 'Fast performance']),
      cons: JSON.stringify(['Limited integrations on the free plan']),
      price: '$9/mo',
      original_price: '$15/mo',
      affiliate_url: 'https://example.com/?ref=your-affiliate-id',
      affiliate_network: 'Sample Network',
      coupon_code: null,
      featured: 0,
      status: 'published',
    });
  }

  const couponCount = db.prepare('SELECT COUNT(*) AS c FROM coupons').get().c;
  if (couponCount === 0) {
    const homeId = db.prepare('SELECT id FROM categories WHERE slug = ?').get(['home-kitchen']).id;
    const insertCoupon = db.prepare(`
      INSERT INTO coupons
        (title, slug, store_name, code, description, category_id, discount_label, affiliate_url, expires_at, featured, status)
      VALUES (@title, @slug, @store_name, @code, @description, @category_id, @discount_label, @affiliate_url, @expires_at, @featured, @status)
    `);

    insertCoupon.run({
      title: 'Sample Coupon: 20% off storewide (Edit or delete this)',
      slug: 'sample-coupon-20-off',
      store_name: 'Sample Store',
      code: 'SAVE20',
      description: 'Placeholder coupon so you can see how the coupons page looks. Replace it in Admin -> Coupons.',
      category_id: homeId,
      discount_label: '20% OFF',
      affiliate_url: 'https://example.com/?ref=your-affiliate-id',
      expires_at: null,
      featured: 1,
      status: 'published',
    });
  }

  db._saveSync();
}

module.exports = { db, getSetting, setSetting, init };
