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
    const travelId = db.prepare('SELECT id FROM categories WHERE slug = ?').get(['travel-outdoors']).id;

    const insertReview = db.prepare(`
      INSERT INTO reviews
        (title, slug, category_id, summary, content, image_url, rating, pros, cons, price, original_price, affiliate_url, affiliate_network, coupon_code, featured, status)
      VALUES (@title, @slug, @category_id, @summary, @content, @image_url, @rating, @pros, @cons, @price, @original_price, @affiliate_url, @affiliate_network, @coupon_code, @featured, @status)
    `);

    insertReview.run({
      title: 'Pocket AI Wearable Recorder Review: Does It Replace Note-Taking?',
      slug: 'pocket-ai-wearable-recorder-review-does-it-replace-note-taking',
      category_id: techId,
      summary:
        "A MagSafe-mountable AI recorder that transcribes and summarizes conversations automatically. We break down what it's actually like to use day to day.",
      content: `<p>Pocket is a small MagSafe-compatible recorder built around one idea: your phone is a terrible place to jot things down mid-conversation. Instead of fumbling for a notes app, you press a single button on the device and it starts recording. When you're done, the companion app turns the audio into a transcript, a summary, and a list of action items.</p>
<p>We looked at the hardware and the software side by side. The device itself is small enough to clip onto the back of an iPhone via MagSafe. It has two "studio" microphones for picking up room audio, plus a separate contact microphone that Pocket says is designed specifically to capture your side of phone calls without needing speakerphone.</p>
<p>Battery life is rated at around 4 days of active use with a 1.5 hour recharge, and there's 64GB of onboard storage, so it keeps working even offline &mdash; it syncs and generates summaries once you're back near your phone.</p>
<p>The core transcription and summary features are free with no subscription required, which is unusual for an AI hardware product. Where Pocket earns recurring revenue is the Pro tier: it unlocks unlimited saved summaries (the free tier keeps them for 30 days), the most accurate transcription models, speaker auto-detection, and deeper integrations with calendars, docs, and task managers.</p>
<p><strong>Who it's for:</strong> people in a lot of meetings or client calls who lose time writing things down afterward &mdash; sales reps, therapists, realtors, founders. If you rarely have conversations worth referencing later, a wearable recorder is probably overkill.</p>
<p><strong>The catch:</strong> like any always-ready recording device, using it around other people means thinking about consent and local recording laws, which vary depending on where you live and work.</p>`,
      image_url: 'https://heypocket.com/cdn/shop/files/Thumnail_1.png?v=1772470703',
      rating: 4.6,
      pros: JSON.stringify([
        'Attaches to your phone via MagSafe in seconds, no app-switching needed',
        '4-day battery life and 64GB of onboard storage',
        'Dual studio mics plus a contact mic that can pick up phone calls',
        'Transcription and core features are free forever, no subscription required',
        'AI summaries, action items and mind maps in 120+ languages',
      ]),
      cons: JSON.stringify([
        'Advanced features like unlimited saved summaries and top-tier AI models need the $16.59/mo Pro plan',
        "It's a second device to carry and remember to charge alongside your phone",
        "Recording other people's conversations raises consent questions depending on where you live",
      ]),
      price: '$129.00',
      original_price: '$199.00',
      affiliate_url:
        'https://heypocket.com/11321948&utm_source=affiliate&utm_medium=affiliate&utm_campaign=pocket-affiliate-program&utm_term=Chung-Cao',
      affiliate_network: 'Pocket Affiliate Program',
      coupon_code: null,
      featured: 1,
      status: 'published',
    });

    insertReview.run({
      title: 'Mangosteen M1P Electric Scooter Review: A Street-Legal E-Chopper for Under €1,800',
      slug: 'mangosteen-m1p-electric-scooter-review-a-street-legal-e-chopper-for-under-1-800',
      category_id: travelId,
      summary:
        "A fat-tire, chopper-styled electric scooter that's road-legal in the EU at 45 km/h. Here's what the 2026 upgrade changes and who it makes sense for.",
      content: `<p>Mangosteen makes "Citycoco"-style electric scooters &mdash; wide, low, fat-tired things that look more like a chopper motorcycle than a kick scooter &mdash; and the M1P is their most popular model, with over 200 verified reviews on their own site. The 2026 "Upgraded" version we're covering here changes a meaningful amount from the original M1P: the front wheel grows from 13" to 14", the rear from 12" to 13", and both ends now get fully enclosed, hydraulic disc brakes instead of the older mechanical setup.</p>
<p>Power comes from a 2000W hub motor rated at 120Nm of torque, which is plenty for city traffic, moderate hills, and the 45 km/h top speed that keeps it street-legal in the EU under an AM or B license (no separate motorcycle license needed, though you should always confirm your own country's rules before riding on public roads). Mangosteen advertises roughly &euro;1 of electricity per 100km, which lines up with typical numbers for hub-motor scooters in this power class.</p>
<p>Where the M1P stands out from a generic e-scooter is the amount of customization Mangosteen sells around it: rear fenders, backrests, Bluetooth audio pods, alternate handlebars, side boxes &mdash; it's clearly built for riders who want to make theirs look distinct, similar to how chopper motorcycle culture works.</p>
<p><strong>Fit and comfort:</strong> Mangosteen recommends this for riders between 160&ndash;195 cm. The seat height sits at 660mm and the whole scooter is nearly a meter wide, so it takes up real space &mdash; factor that into where you'll park and store it.</p>
<p><strong>What buyers say:</strong> the brand's own review section skews very positive, with riders repeatedly calling out the acceleration and ride stability. The most common complaint we found was shipping-related &mdash; a couple of buyers received a dented outer box &mdash; rather than anything about the scooter itself once assembled.</p>`,
      image_url: 'https://www.mangosteenscooter.com/cdn/shop/files/03.webp?v=1761558250&width=1000',
      rating: 4.5,
      pros: JSON.stringify([
        'Street-legal up to 45 km/h in the EU with just an AM or B driver\'s license',
        '2026 upgrade adds bigger 14"/13" wheels and full hydraulic disc brakes front and rear',
        'Roughly €1 in electricity per 100 km, according to the brand',
        'Dual display shows speed, battery, odometer and gear at a glance',
        'Wide, low-slung "chopper" stance feels stable at city speeds',
      ]),
      cons: JSON.stringify([
        "At 930mm wide with a 660mm seat height, it's bulky to store compared to a normal scooter",
        "Best suited to riders between 160-195 cm; check handlebar options if you're outside that range",
        "A couple of buyers reported their box arriving damaged in transit, though it's covered by shipping insurance",
        'Registration/insurance requirements still depend on your country, so check local rules before buying',
      ]),
      price: '€1.799,00',
      original_price: '€1.999,00',
      affiliate_url: 'https://www.mangosteenscooter.com?sca_ref=11406255.N9q4ouPVHfzI',
      affiliate_network: 'Mangosteen Scooter Affiliate Program',
      coupon_code: null,
      featured: 1,
      status: 'published',
    });

    insertReview.run({
      title: 'Leofoto LS-284CXPRO + LH-30LR Tripod Review: Pro-Grade Carbon Fiber Without the Flagship Price',
      slug: 'leofoto-ls-284cxpro-lh-30lr-tripod-review-pro-grade-carbon-fiber-without-the-fla',
      category_id: techId,
      summary:
        'A water-resistant carbon fiber travel tripod with a ball head bundled in. We look at who this Ranger Series X model is really built for.',
      content: `<p>Leofoto has built a reputation as the value alternative to tripod brands like Really Right Stuff and Gitzo &mdash; similar carbon fiber build quality and Arca-standard compatibility, at a noticeably lower price. The LS-284CXPRO is the "Pro" refresh of their long-running Ranger Series, and the version we're looking at comes bundled with the LH-30LR ball head.</p>
<p>The headline upgrade over the standard LS-284C is water resistance: the twist leg locks are now sealed against moisture and grit, which matters if you shoot outdoors in anything other than dry conditions. Leofoto also reworked the angle-stop mechanism (23&deg;, 55&deg;, 85&deg;) to be operated with one hand, useful when you're set up low to the ground and don't have a free hand to fiddle with a second lock.</p>
<p>On paper, the numbers are solid for a travel tripod: 1.51kg total weight with the head attached, folds to 560mm, and a 10kg load rating on the legs &mdash; enough for a mirrorless body with a mid-range zoom, not enough for a big telephoto or a video rig with accessories. The bundled LH-30LR ball head is worth calling out on its own: at 345g it's genuinely light, but it's still rated for 15kg, which is unusually high for a head this compact.</p>
<p><strong>The one real limitation:</strong> max height is 1370mm (about 53.9") without extending it any further. If you're on the taller side, that can put the eyepiece lower than ideal &mdash; this shows up directly in the one detailed customer review currently on Leofoto's site, from a buyer who wanted a taller option for their height.</p>
<p><strong>Who it's for:</strong> travel and landscape photographers who prioritize packed weight and weatherproofing over maximum height or heavy-duty load capacity.</p>`,
      image_url: 'https://leofotousa.com/cdn/shop/files/LS-284CX_PRO_LH-30.jpg?v=1776293573',
      rating: 4.4,
      pros: JSON.stringify([
        'Water-resistant twist leg locks keep grit and moisture out of the leg mechanism',
        'Folds down to 560mm and weighs just 1.51kg with the head attached',
        'Three angle-stop positions (23°/55°/85°) for one-handed low-angle shooting',
        "LH-30LR ball head supports up to 15kg, well beyond what this tripod's weight class usually offers",
        'Comes with a carrying case included',
      ]),
      cons: JSON.stringify([
        "Max height of 1370mm (about 53.9\") can feel short if you're taller than roughly 5'7\"",
        "10kg max load on the legs means it's not built for long telephoto lenses or video rigs",
        "Only one detailed public customer review so far - it's a newer release without a long track record",
      ]),
      price: '$429.00',
      original_price: null,
      affiliate_url: 'https://leofotousa.com?sca_ref=10975682.xJWHdvvYzG',
      affiliate_network: 'Leofoto USA Affiliate Program',
      coupon_code: null,
      featured: 1,
      status: 'published',
    });
  }

  const couponCount = db.prepare('SELECT COUNT(*) AS c FROM coupons').get().c;
  if (couponCount === 0) {
    const techId = db.prepare('SELECT id FROM categories WHERE slug = ?').get(['tech-gadgets']).id;
    const travelId = db.prepare('SELECT id FROM categories WHERE slug = ?').get(['travel-outdoors']).id;
    const insertCoupon = db.prepare(`
      INSERT INTO coupons
        (title, slug, store_name, code, description, category_id, discount_label, affiliate_url, expires_at, featured, status)
      VALUES (@title, @slug, @store_name, @code, @description, @category_id, @discount_label, @affiliate_url, @expires_at, @featured, @status)
    `);

    insertCoupon.run({
      title: 'Pocket AI Recorder - $70 Off Launch Price',
      slug: 'heypocket-70-off-launch-price',
      store_name: 'HeyPocket',
      code: null,
      description: 'Pocket, the AI wearable recorder from HeyPocket, is currently listed at $129 (down from $199) directly on the official site - no code needed, the discount is already applied at checkout.',
      category_id: techId,
      discount_label: '35% OFF',
      affiliate_url: 'https://heypocket.com/11321948&utm_source=affiliate&utm_medium=affiliate&utm_campaign=pocket-affiliate-program&utm_term=Chung-Cao',
      expires_at: null,
      featured: 1,
      status: 'published',
    });

    insertCoupon.run({
      title: 'Mangosteen M1P Scooter - €200 Off',
      slug: 'mangosteen-m1p-200-off',
      store_name: 'Mangosteen Scooter',
      code: null,
      description: 'The upgraded Mangosteen M1P street-legal electric scooter is currently listed at €1,799 (down from €1,999) directly on the official site - no code needed, price is already reduced at checkout.',
      category_id: travelId,
      discount_label: '€200 OFF',
      affiliate_url: 'https://www.mangosteenscooter.com?sca_ref=11406255.N9q4ouPVHfzI',
      expires_at: null,
      featured: 1,
      status: 'published',
    });
  }

  db._saveSync();
}

module.exports = { db, getSetting, setSetting, init };
