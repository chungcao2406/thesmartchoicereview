const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const slugify = require('../lib/slugify');

function uniqueSlug(table, base, excludeId) {
  let slug = slugify(base) || `${table}-${Date.now()}`;
  let candidate = slug;
  let i = 2;
  const stmt = excludeId
    ? db.prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`)
    : db.prepare(`SELECT id FROM ${table} WHERE slug = ?`);
  while (excludeId ? stmt.get(candidate, excludeId) : stmt.get(candidate)) {
    candidate = `${slug}-${i++}`;
  }
  return candidate;
}

function linesToArray(text) {
  return String(text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------- Auth ----------
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin Login', error: null, layout: false });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).render('admin/login', { title: 'Admin Login', error: 'Invalid username or password.' });
  }
  req.session.userId = user.id;
  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// Everything below requires an authenticated admin.
router.use(requireAdmin);

// ---------- Dashboard ----------
router.get('/', (req, res) => {
  const stats = {
    reviews: db.prepare('SELECT COUNT(*) AS c FROM reviews').get().c,
    coupons: db.prepare('SELECT COUNT(*) AS c FROM coupons').get().c,
    categories: db.prepare('SELECT COUNT(*) AS c FROM categories').get().c,
    unreadMessages: db.prepare('SELECT COUNT(*) AS c FROM messages WHERE is_read = 0').get().c,
  };
  const recentReviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 5').all();
  const recentMessages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 5').all();

  res.render('admin/dashboard', { title: 'Dashboard', stats, recentReviews, recentMessages });
});

// ---------- Reviews ----------
router.get('/reviews', (req, res) => {
  const reviews = db
    .prepare(
      `SELECT r.*, c.name AS category_name FROM reviews r
       LEFT JOIN categories c ON c.id = r.category_id
       ORDER BY r.created_at DESC`
    )
    .all();
  res.render('admin/reviews-list', { title: 'Reviews', reviews });
});

router.get('/reviews/new', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
  res.render('admin/review-form', { title: 'New Review', review: null, categories });
});

router.post('/reviews', (req, res) => {
  const b = req.body;
  const slug = uniqueSlug('reviews', b.title);
  db.prepare(
    `INSERT INTO reviews
      (title, slug, category_id, summary, content, image_url, gallery_images, rating, pros, cons, price, original_price, affiliate_url, affiliate_network, coupon_code, featured, status, updated_at)
     VALUES (@title, @slug, @category_id, @summary, @content, @image_url, @gallery_images, @rating, @pros, @cons, @price, @original_price, @affiliate_url, @affiliate_network, @coupon_code, @featured, @status, datetime('now'))`
  ).run({
    title: b.title,
    slug,
    category_id: b.category_id || null,
    summary: b.summary || null,
    content: b.content || null,
    image_url: b.image_url || null,
    gallery_images: JSON.stringify(linesToArray(b.gallery_images)),
    rating: parseFloat(b.rating) || 4.5,
    pros: JSON.stringify(linesToArray(b.pros)),
    cons: JSON.stringify(linesToArray(b.cons)),
    price: b.price || null,
    original_price: b.original_price || null,
    affiliate_url: b.affiliate_url,
    affiliate_network: b.affiliate_network || null,
    coupon_code: b.coupon_code || null,
    featured: b.featured ? 1 : 0,
    status: b.status === 'draft' ? 'draft' : 'published',
  });
  res.redirect('/admin/reviews');
});

router.get('/reviews/:id/edit', (req, res) => {
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).send('Review not found');
  review.pros = (JSON.parse(review.pros || '[]')).join('\n');
  review.cons = (JSON.parse(review.cons || '[]')).join('\n');
  review.gallery_images = (JSON.parse(review.gallery_images || '[]')).join('\n');
  const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
  res.render('admin/review-form', { title: 'Edit Review', review, categories });
});

router.post('/reviews/:id', (req, res) => {
  const b = req.body;
  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).send('Review not found');
  const slug = b.title !== existing.title ? uniqueSlug('reviews', b.title, existing.id) : existing.slug;

  db.prepare(
    `UPDATE reviews SET
      title=@title, slug=@slug, category_id=@category_id, summary=@summary, content=@content,
      image_url=@image_url, gallery_images=@gallery_images, rating=@rating, pros=@pros, cons=@cons, price=@price,
      original_price=@original_price, affiliate_url=@affiliate_url, affiliate_network=@affiliate_network,
      coupon_code=@coupon_code, featured=@featured, status=@status, updated_at=datetime('now')
     WHERE id=@id`
  ).run({
    id: existing.id,
    title: b.title,
    slug,
    category_id: b.category_id || null,
    summary: b.summary || null,
    content: b.content || null,
    image_url: b.image_url || null,
    gallery_images: JSON.stringify(linesToArray(b.gallery_images)),
    rating: parseFloat(b.rating) || 4.5,
    pros: JSON.stringify(linesToArray(b.pros)),
    cons: JSON.stringify(linesToArray(b.cons)),
    price: b.price || null,
    original_price: b.original_price || null,
    affiliate_url: b.affiliate_url,
    affiliate_network: b.affiliate_network || null,
    coupon_code: b.coupon_code || null,
    featured: b.featured ? 1 : 0,
    status: b.status === 'draft' ? 'draft' : 'published',
  });
  res.redirect('/admin/reviews');
});

router.post('/reviews/:id/delete', (req, res) => {
  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  res.redirect('/admin/reviews');
});

// ---------- Coupons ----------
router.get('/coupons', (req, res) => {
  const coupons = db
    .prepare(
      `SELECT co.*, c.name AS category_name FROM coupons co
       LEFT JOIN categories c ON c.id = co.category_id
       ORDER BY co.created_at DESC`
    )
    .all();
  res.render('admin/coupons-list', { title: 'Coupons', coupons });
});

router.get('/coupons/new', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
  res.render('admin/coupon-form', { title: 'New Coupon', coupon: null, categories });
});

router.post('/coupons', (req, res) => {
  const b = req.body;
  const slug = uniqueSlug('coupons', b.title);
  db.prepare(
    `INSERT INTO coupons
      (title, slug, store_name, code, description, category_id, discount_label, affiliate_url, expires_at, featured, status, updated_at)
     VALUES (@title, @slug, @store_name, @code, @description, @category_id, @discount_label, @affiliate_url, @expires_at, @featured, @status, datetime('now'))`
  ).run({
    title: b.title,
    slug,
    store_name: b.store_name,
    code: b.code || null,
    description: b.description || null,
    category_id: b.category_id || null,
    discount_label: b.discount_label,
    affiliate_url: b.affiliate_url,
    expires_at: b.expires_at || null,
    featured: b.featured ? 1 : 0,
    status: b.status === 'draft' ? 'draft' : 'published',
  });
  res.redirect('/admin/coupons');
});

router.get('/coupons/:id/edit', (req, res) => {
  const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(req.params.id);
  if (!coupon) return res.status(404).send('Coupon not found');
  const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
  res.render('admin/coupon-form', { title: 'Edit Coupon', coupon, categories });
});

router.post('/coupons/:id', (req, res) => {
  const b = req.body;
  const existing = db.prepare('SELECT * FROM coupons WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).send('Coupon not found');
  const slug = b.title !== existing.title ? uniqueSlug('coupons', b.title, existing.id) : existing.slug;

  db.prepare(
    `UPDATE coupons SET
      title=@title, slug=@slug, store_name=@store_name, code=@code, description=@description,
      category_id=@category_id, discount_label=@discount_label, affiliate_url=@affiliate_url,
      expires_at=@expires_at, featured=@featured, status=@status, updated_at=datetime('now')
     WHERE id=@id`
  ).run({
    id: existing.id,
    title: b.title,
    slug,
    store_name: b.store_name,
    code: b.code || null,
    description: b.description || null,
    category_id: b.category_id || null,
    discount_label: b.discount_label,
    affiliate_url: b.affiliate_url,
    expires_at: b.expires_at || null,
    featured: b.featured ? 1 : 0,
    status: b.status === 'draft' ? 'draft' : 'published',
  });
  res.redirect('/admin/coupons');
});

router.post('/coupons/:id/delete', (req, res) => {
  db.prepare('DELETE FROM coupons WHERE id = ?').run(req.params.id);
  res.redirect('/admin/coupons');
});

// ---------- Categories ----------
router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, name ASC').all();
  res.render('admin/categories', { title: 'Categories', categories });
});

router.post('/categories', (req, res) => {
  const { name, description } = req.body;
  if (name && name.trim()) {
    db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)').run(
      name.trim(),
      uniqueSlug('categories', name),
      description || null
    );
  }
  res.redirect('/admin/categories');
});

router.post('/categories/:id/delete', (req, res) => {
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.redirect('/admin/categories');
});

// ---------- Messages ----------
router.get('/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.render('admin/messages', { title: 'Messages', messages });
});

router.post('/messages/:id/read', (req, res) => {
  db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});

router.post('/messages/:id/delete', (req, res) => {
  db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});

// ---------- Settings ----------
router.get('/settings', (req, res) => {
  res.render('admin/settings', { title: 'Settings', error: null, success: null });
});

router.post('/settings/password', (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);

  if (!bcrypt.compareSync(current_password || '', user.password_hash)) {
    return res.status(400).render('admin/settings', { title: 'Settings', error: 'Current password is incorrect.', success: null });
  }
  if (!new_password || new_password.length < 8) {
    return res.status(400).render('admin/settings', { title: 'Settings', error: 'New password must be at least 8 characters.', success: null });
  }
  if (new_password !== confirm_password) {
    return res.status(400).render('admin/settings', { title: 'Settings', error: 'New passwords do not match.', success: null });
  }

  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?').run(hash, user.id);
  res.render('admin/settings', { title: 'Settings', error: null, success: 'Password updated successfully.' });
});

// ---------- One-off content tools ----------
// Inserts any starter review/coupon that's missing (by slug) and updates
// the editorial fields on any that already exist, so it's the tool to use
// whenever the built-in starter content is revised in code. Runs inside
// this same live process (unlike a separate script), so it's safe to
// trigger while the app is running: no risk of a second process's stale
// in-memory copy overwriting these writes.
router.get('/tools/sync-content', (req, res) => {
  const { syncContent } = require('../lib/extraContent');
  const result = syncContent(db);
  res.type('text/plain').send(result.log.join('\n'));
});

module.exports = router;
