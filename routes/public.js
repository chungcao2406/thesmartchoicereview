const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { paginate } = require('../lib/paginate');

function parseJsonArray(str) {
  if (!str) return [];
  try {
    const val = JSON.parse(str);
    return Array.isArray(val) ? val : [];
  } catch (_) {
    return [];
  }
}

function withParsedFields(review) {
  if (!review) return review;
  return {
    ...review,
    pros: parseJsonArray(review.pros),
    cons: parseJsonArray(review.cons),
    gallery_images: parseJsonArray(review.gallery_images),
  };
}

// Home page
router.get('/', (req, res) => {
  const featuredReviews = db
    .prepare(
      `SELECT r.*, c.name AS category_name, c.slug AS category_slug
       FROM reviews r LEFT JOIN categories c ON c.id = r.category_id
       WHERE r.status = 'published' AND r.featured = 1
       ORDER BY r.created_at DESC LIMIT 3`
    )
    .all()
    .map(withParsedFields);

  const latestReviews = db
    .prepare(
      `SELECT r.*, c.name AS category_name, c.slug AS category_slug
       FROM reviews r LEFT JOIN categories c ON c.id = r.category_id
       WHERE r.status = 'published'
       ORDER BY r.created_at DESC LIMIT 8`
    )
    .all()
    .map(withParsedFields);

  const featuredCoupons = db
    .prepare(
      `SELECT co.*, c.name AS category_name, c.slug AS category_slug
       FROM coupons co LEFT JOIN categories c ON c.id = co.category_id
       WHERE co.status = 'published'
       ORDER BY co.featured DESC, co.created_at DESC LIMIT 4`
    )
    .all();

  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, name ASC').all();

  res.render('index', {
    title: 'Honest Product Reviews & Verified Coupons',
    featuredReviews,
    latestReviews,
    featuredCoupons,
    categories,
  });
});

// Reviews listing
router.get('/reviews', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const categorySlug = req.query.category || null;

  let category = null;
  let where = "r.status = 'published'";
  const params = {};

  if (categorySlug) {
    category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(categorySlug);
    if (category) {
      where += ' AND r.category_id = @categoryId';
      params.categoryId = category.id;
    }
  }

  const totalItems = db.prepare(`SELECT COUNT(*) AS c FROM reviews r WHERE ${where}`).get(params).c;
  const { pageSize, totalPages, currentPage, offset } = paginate(page, totalItems);

  const reviews = db
    .prepare(
      `SELECT r.*, c.name AS category_name, c.slug AS category_slug
       FROM reviews r LEFT JOIN categories c ON c.id = r.category_id
       WHERE ${where}
       ORDER BY r.created_at DESC LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: pageSize, offset })
    .map(withParsedFields);

  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, name ASC').all();

  res.render('reviews-list', {
    title: category ? `${category.name} Reviews` : 'All Reviews',
    reviews,
    categories,
    activeCategory: category,
    currentPage,
    totalPages,
  });
});

// Review detail
router.get('/reviews/:slug', (req, res) => {
  const review = db
    .prepare(
      `SELECT r.*, c.name AS category_name, c.slug AS category_slug
       FROM reviews r LEFT JOIN categories c ON c.id = r.category_id
       WHERE r.slug = ? AND r.status = 'published'`
    )
    .get(req.params.slug);

  if (!review) return res.status(404).render('404', { title: 'Review Not Found' });

  db.prepare('UPDATE reviews SET views = views + 1 WHERE id = ?').run(review.id);

  const related = db
    .prepare(
      `SELECT r.*, c.name AS category_name, c.slug AS category_slug
       FROM reviews r LEFT JOIN categories c ON c.id = r.category_id
       WHERE r.status = 'published' AND r.category_id = ? AND r.id != ?
       ORDER BY r.created_at DESC LIMIT 3`
    )
    .all(review.category_id, review.id)
    .map(withParsedFields);

  res.render('review-detail', {
    title: review.title,
    review: withParsedFields(review),
    related,
  });
});

// Coupons listing
router.get('/coupons', (req, res) => {
  const categorySlug = req.query.category || null;
  let category = null;
  let where = "co.status = 'published' AND (co.expires_at IS NULL OR co.expires_at >= date('now'))";
  const params = {};

  if (categorySlug) {
    category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(categorySlug);
    if (category) {
      where += ' AND co.category_id = @categoryId';
      params.categoryId = category.id;
    }
  }

  const coupons = db
    .prepare(
      `SELECT co.*, c.name AS category_name, c.slug AS category_slug
       FROM coupons co LEFT JOIN categories c ON c.id = co.category_id
       WHERE ${where}
       ORDER BY co.featured DESC, co.created_at DESC`
    )
    .all(params);

  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, name ASC').all();

  res.render('coupons-list', {
    title: category ? `${category.name} Coupons & Deals` : 'All Coupons & Deals',
    coupons,
    categories,
    activeCategory: category,
  });
});

router.post('/coupons/:id/track', (req, res) => {
  db.prepare('UPDATE coupons SET uses = uses + 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Category page (reviews + coupons combined)
router.get('/category/:slug', (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!category) return res.status(404).render('404', { title: 'Category Not Found' });

  const reviews = db
    .prepare(
      `SELECT r.*, c.name AS category_name, c.slug AS category_slug
       FROM reviews r LEFT JOIN categories c ON c.id = r.category_id
       WHERE r.status = 'published' AND r.category_id = ?
       ORDER BY r.created_at DESC LIMIT 9`
    )
    .all(category.id)
    .map(withParsedFields);

  const coupons = db
    .prepare(
      `SELECT co.*, c.name AS category_name, c.slug AS category_slug
       FROM coupons co LEFT JOIN categories c ON c.id = co.category_id
       WHERE co.status = 'published' AND co.category_id = ?
       ORDER BY co.featured DESC, co.created_at DESC LIMIT 6`
    )
    .all(category.id);

  res.render('category', {
    title: category.name,
    category,
    reviews,
    coupons,
  });
});

// Search
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  let reviews = [];
  if (q) {
    reviews = db
      .prepare(
        `SELECT r.*, c.name AS category_name, c.slug AS category_slug
         FROM reviews r LEFT JOIN categories c ON c.id = r.category_id
         WHERE r.status = 'published' AND (r.title LIKE @q OR r.summary LIKE @q)
         ORDER BY r.created_at DESC LIMIT 24`
      )
      .all({ q: `%${q}%` })
      .map(withParsedFields);
  }
  res.render('search', { title: q ? `Search results for "${q}"` : 'Search', q, reviews });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us', sent: false });
});

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).render('contact', {
      title: 'Contact Us',
      sent: false,
      error: 'Please fill in your name, email, and message.',
    });
  }
  db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(
    name,
    email,
    subject || null,
    message
  );
  res.render('contact', { title: 'Contact Us', sent: true });
});

router.get('/affiliate-disclosure', (req, res) => {
  res.render('disclosure', { title: 'Affiliate Disclosure' });
});

router.get('/privacy-policy', (req, res) => {
  res.render('privacy', { title: 'Privacy Policy' });
});

router.get('/terms', (req, res) => {
  res.render('terms', { title: 'Terms of Service' });
});

router.get('/sitemap.xml', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const reviews = db.prepare("SELECT slug, updated_at FROM reviews WHERE status = 'published'").all();
  const categories = db.prepare('SELECT slug FROM categories').all();

  const staticPaths = ['/', '/reviews', '/coupons', '/about', '/contact', '/affiliate-disclosure', '/privacy-policy', '/terms'];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  staticPaths.forEach((p) => {
    xml += `  <url><loc>${baseUrl}${p}</loc></url>\n`;
  });
  categories.forEach((c) => {
    xml += `  <url><loc>${baseUrl}/category/${c.slug}</loc></url>\n`;
  });
  reviews.forEach((r) => {
    xml += `  <url><loc>${baseUrl}/reviews/${r.slug}</loc><lastmod>${r.updated_at.slice(0, 10)}</lastmod></url>\n`;
  });
  xml += '</urlset>';

  res.type('application/xml').send(xml);
});

module.exports = router;
