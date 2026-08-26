// Shared content for the 5 affiliate reviews + 4 coupons added after launch.
// Used by both scripts/seed-more-content.js (standalone, server stopped) and
// routes/admin.js's /admin/tools/seed-more-content (safe to run while the
// server is live, since it reuses the same in-memory db instance).
function buildContent(db) {
  const categoryId = (slug) => {
    const row = db.prepare('SELECT id FROM categories WHERE slug = ?').get([slug]);
    return row ? row.id : null;
  };

  const fashionId = categoryId('fashion-beauty');
  const healthId = categoryId('health-fitness');
  const travelId = categoryId('travel-outdoors');

  const reviews = [
    {
      title: 'Babylon Leather Kelly-Style DIY Bag Kit Review: Worth the Stitching?',
      slug: 'babylon-leather-kelly-style-diy-bag-kit-review',
      category_id: fashionId,
      summary:
        "A hand-stitched, designer-inspired leather bag kit with no sewing machine required. Here's what's actually in the box and who should try it.",
      content: `<p>Babylon Leather sells DIY kits that let you hand-stitch designer-inspired leather bags yourself, no sewing machine required. The Kelly-Style Bag Kit with Lychee Pattern Leather is one of their most popular kits, with hundreds of finished projects shared by customers online.</p>
<p>Every kit ships with pre-cut, pre-punched leather panels (top or full-grain exterior, PU interior), waxed thread, an awl, needles, and a printed step-by-step tutorial. You're sewing the classic structured "Kelly" silhouette by hand using a saddle stitch, the same technique used on genuine luxury leather goods.</p>
<p>Beyond the base kit, Babylon Leather sells a long list of upgrades: a custom leather color swap (+$45), a full genuine-leather lining instead of the standard PU lining (+$65), and even a "we sew it for you" service (+$65) if you want the finished bag without doing the stitching yourself. There's also a cheaper "Eco Refill Kit" option that skips the needle, scissors, screwdriver and clips if you already have tools from a previous order.</p>
<p><strong>Who it's for:</strong> crafters who want a genuinely challenging, rewarding project and are comfortable with several hours of hand-stitching, not a same-day project. If you want a finished bag with zero effort, the "we sew it for you" add-on covers that too.</p>
<p><strong>What buyers say:</strong> the kit consistently gets close to a perfect rating, with customers frequently praising the pre-cut precision and how clear the tutorial video is for first-time leatherworkers.</p>`,
      image_url:
        'https://www.babylonleather.com/cdn/shop/files/kelly-style-leather-bag-diy-kit-with-lychee-pattern-leather-babylon-leatherbabylon-leathersy34-lychee-peacock-blue-large-gold-white-6337691.jpg?v=1762328971&width=2048',
      rating: 4.9,
      pros: JSON.stringify([
        'Pre-cut, pre-punched leather panels make hand-stitching far more approachable for beginners',
        'Step-by-step tutorial video walks through the entire build',
        'Multiple color, size, and hardware finish combinations to choose from',
        "Optional \"sewn for you\" service if you'd rather skip the stitching yourself",
        'Eco Refill Kit option available if you already own the tools',
      ]),
      cons: JSON.stringify([
        'A full hand-stitched build realistically takes several hours, not a quick weekend craft',
        'Custom color and genuine leather lining upgrades add meaningfully to the base price',
        'PU (not leather) interior lining unless you pay extra for the upgrade',
      ]),
      price: '$148.23',
      original_price: null,
      affiliate_url: 'https://www.babylonleather.com?sca_ref=10819330.4eaEmrytEf',
      affiliate_network: 'Babylon Leather Affiliate Program',
      coupon_code: 'Chung10',
      featured: 1,
      status: 'published',
    },
    {
      title: 'Watch & Sea Beauty Slickback Glaze Review: Shine Without the Crunch',
      slug: 'watch-and-sea-beauty-slickback-glaze-review',
      category_id: fashionId,
      summary:
        "Courtney Adeleye's hair care line now sits on shelves at CVS, Target and Walmart. We look at the brand's most-reviewed slickback styling gel.",
      content: `<p>Watch & Sea Beauty is the hair care line from Courtney Adeleye, the founder behind The Mane Choice, and it's now sold in major US retailers including CVS, Target, Walmart, H-E-B and Meijer. The "SEA THIS HOLD" Slickback Glaze is one of the brand's most-reviewed products, built specifically for slicked-back styles and laid edges.</p>
<p>Unlike a lot of edge control gels that flake or leave a stiff, cast-like finish, this one is formulated to give a shimmery, glass-like finish while staying flexible enough to move naturally through the day. It's designed to be layered under a silk scarf or bonnet for overnight setting, or worn straight out for a same-day sleek look.</p>
<p><strong>Who it's for:</strong> anyone doing slickbacks, ponytails, or laying edges who wants shine and hold without the crunchy, flaky finish some styling gels leave behind.</p>
<p><strong>Worth knowing:</strong> the brand ships from Orlando, FL and also sells the glaze bundled with their curl-defining jelly in "Slickback & Curl Poppin" sets if you want to try more than one product at once.</p>`,
      image_url: 'https://watchandseabeauty.com/cdn/shop/files/IMG-0161.png?v=1786500758&width=1024',
      rating: 4.7,
      pros: JSON.stringify([
        'Shimmery, glass-like finish without the stiff, flaky cast some gels leave',
        "Also sold in-store at CVS, Target, Walmart and Meijer, so it's easy to find locally too",
        'Works for slickbacks, ponytails, and laying edges',
        "Backed by 195+ product reviews on the brand's own site",
      ]),
      cons: JSON.stringify([
        'A styling gel like this works best paired with a proper brush/comb technique; results vary by hair texture',
        'Best held in place overnight with a scarf or bonnet for max longevity, an extra step some may skip',
      ]),
      price: '$17.99',
      original_price: null,
      affiliate_url: 'https://watchandseabeauty.com/chungcao10858176',
      affiliate_network: 'Watch & Sea Beauty Affiliate Program',
      coupon_code: 'CHUNGCAO10',
      featured: 0,
      status: 'published',
    },
    {
      title: 'Lauren Brooke Organic Facial Serum Review: A Clean-Beauty Best Seller',
      slug: 'lauren-brooke-organic-facial-serum-review',
      category_id: fashionId,
      summary:
        "A 99.5% certified organic facial serum from a brand built around non-toxic skincare. We look at what's in it and how people actually use it.",
      content: `<p>Lauren Brooke Organic Cosmetiques was started by its founder after she traced years of chronic autoimmune symptoms back to toxic ingredients in everyday skincare and cosmetics. The brand is built around 99.5% certified organic, non-GMO formulas made in the USA, and the Organic Facial Serum is one of its longest-running best sellers.</p>
<p>The serum is a cold-pressed blend of organic plant oils, built around jojoba oil for hydration and evening primrose oil for its soothing, anti-inflammatory properties, along with beta-carotene, omega-3 and vitamin E for an anti-aging effect. It's formulated for normal, dry, oily and combination skin types, so it's not narrowly targeted at one skin type only.</p>
<p><strong>How people use it:</strong> most reviewers apply it morning and night, either alone or mixed into foundation for a dewier finish before makeup. Several long-time customers specifically call out the scent as part of what keeps them repurchasing.</p>
<p><strong>Worth knowing:</strong> because it's a 100% natural, cold-pressed oil blend, it should be stored away from direct sunlight, and like any oil-based serum, a little goes a long way, don't over-apply.</p>`,
      image_url: 'https://www.laurenbrookecosmetiques.com/cdn/shop/files/OrganicFacialSerum72.png?v=1743546141',
      rating: 4.8,
      pros: JSON.stringify([
        '99.5% certified organic, non-GMO, made in the USA',
        'Formulated for all skin types, not narrowly targeted',
        'Doubles as a primer boost when mixed into foundation',
        "One of the brand's longest-running, most-repurchased products",
      ]),
      cons: JSON.stringify([
        "Oil-based serums aren't for everyone; very oily skin types may prefer a lighter formula",
        'Must be stored out of direct sunlight to preserve the natural oils',
      ]),
      price: '$32.50',
      original_price: null,
      affiliate_url: 'https://www.laurenbrookecosmetiques.com?sca_ref=11859867.Ed98eyh57C',
      affiliate_network: 'Lauren Brooke Organic Cosmetiques Affiliate Program',
      coupon_code: 'LINDSEYREM',
      featured: 0,
      status: 'published',
    },
    {
      title: 'Lag Shot 7 Iron Golf Swing Trainer Review: Does It Actually Fix Your Swing?',
      slug: 'lag-shot-7-iron-golf-swing-trainer-review',
      category_id: healthId,
      summary:
        'A Golf Digest-recognized swing trainer built around a hyper-flexible shaft. We look at how it works and who benefits most.',
      content: `<p>Lag Shot bills itself as the #1 swing trainer in golf, and the 7 Iron version is the one most golfers start with. The design pairs a weighted clubhead with a deliberately "whippy," hyper-flexible shaft, forcing your swing to load the club correctly rather than muscling through impact.</p>
<p>The idea is simple: most amateur golfers lose power and consistency because they don't create enough lag (the angle between the shaft and lead arm) before impact. Because the Lag Shot's shaft is so flexible, it physically won't perform well unless you swing with the right sequencing and tempo, so your body learns the correct feel through repetition instead of swing thoughts.</p>
<p>Every 7 Iron ships with a bonus video course from Adam Bazalgette, a 3-time PGA Teacher of the Year, covering transition drills and impact position work, on top of the physical club itself.</p>
<p><strong>Who it's for:</strong> mid-to-high handicap golfers looking to add distance and consistency to their iron shots without a full swing overhaul. Better players may find less benefit since the training effect is most dramatic for golfers still building a repeatable swing.</p>
<p><strong>Worth knowing:</strong> it's sold with a 30-day money-back guarantee, and Lag Shot frequently runs bundle deals (Driver + 7-Iron + Wedge as a "Triple Threat" set) if you want more than one trainer.</p>`,
      image_url: 'https://cdn.shopify.com/s/files/1/0572/8524/7182/files/7iron-copy_1.webp?v=1763586786',
      rating: 4.8,
      pros: JSON.stringify([
        'Physically forces correct lag and tempo through the flexible shaft, rather than relying on swing thoughts',
        'Golf Digest-recognized training aid, used by PGA instructors',
        'Includes a bonus video course from a 3-time PGA Teacher of the Year',
        '30-day money-back guarantee',
      ]),
      cons: JSON.stringify([
        'Advanced players with an already-grooved swing may see less dramatic benefit',
        "It's a training tool, not a playable club, you'll still need to transfer the feel to your real irons on the course",
      ]),
      price: '$119.00',
      original_price: null,
      affiliate_url: 'https://lagshotgolf.com/okenachae?utm_source=affiliates&utm_medium=affiliates&utm_campaign=affiliates',
      affiliate_network: 'Lag Shot Golf Affiliate Program',
      coupon_code: 'OKENACHAE15',
      featured: 0,
      status: 'published',
    },
    {
      title: 'Westwind Moto Hussar Panniers Set Review: Dakar-Tested Adventure Luggage',
      slug: 'westwind-moto-hussar-panniers-set-review',
      category_id: travelId,
      summary:
        "Semi-rigid adventure motorcycle panniers from the official luggage sponsor of the KOVE Dakar Team. Here's how they hold up for long-distance touring.",
      content: `<p>Westwind Moto is the official luggage sponsor for the KOVE Dakar Team and Ultra Dakar, which gives its adventure-touring gear a level of real-world testing most motorcycle luggage brands don't have. The Hussar Panniers Set is the brand's flagship semi-rigid pannier system, built for serious long-distance adventure riders rather than casual weekend trips.</p>
<p>"Semi-rigid" is the key design choice here: the panniers hold their shape better than soft throw-over saddlebags, so gear doesn't shift and sag over rough terrain, while staying considerably lighter than full hard-shell aluminum cases. They're built to survive drops, mud, and the kind of abuse that comes with genuine off-road touring, not just highway miles.</p>
<p><strong>Fit and compatibility:</strong> the Hussar set is designed to mount without permanent modifications to the bike, and Westwind maintains a dedicated rack-compatibility page so you can confirm your specific model and rack combination before ordering.</p>
<p><strong>Worth knowing:</strong> Westwind frequently bundles this set with a free accessory (a Pathfinder backpack, hydration pack, or tank bag) depending on current promotions, so it's worth checking what's included before checkout.</p>`,
      image_url: 'https://cdn.shopify.com/s/files/1/0857/4323/9456/files/RW3.png?v=1756638528',
      rating: 4.7,
      pros: JSON.stringify([
        'Semi-rigid construction holds its shape better than soft bags without the full weight of hard cases',
        'Designed and tested through real Dakar Rally sponsorship, not just marketing claims',
        'No permanent bike modifications required to mount',
        'Frequently bundled with a free accessory (backpack, hydration pack, or tank bag)',
      ]),
      cons: JSON.stringify([
        'Premium price point compared to basic soft saddlebags',
        'Always double-check the rack-compatibility page for your specific bike before ordering',
        "At this size, you'll want a rack system built for the added width during off-road riding",
      ]),
      price: '$879.00',
      original_price: null,
      affiliate_url: 'https://www.westwindmoto.com?sca_ref=11297653.k2t8yJI52wMEb5rz',
      affiliate_network: 'Westwind Moto Affiliate Program',
      coupon_code: null,
      featured: 0,
      status: 'published',
    },
  ];

  const coupons = [
    {
      title: 'Babylon Leather: 10% off DIY leather bag kits',
      slug: 'babylon-leather-10-off',
      store_name: 'Babylon Leather',
      code: 'Chung10',
      description: '10% off DIY leather bag kits and materials.',
      category_id: fashionId,
      discount_label: '10% OFF',
      affiliate_url: 'https://www.babylonleather.com?sca_ref=10819330.4eaEmrytEf',
      expires_at: null,
      featured: 1,
      status: 'published',
    },
    {
      title: 'Watch & Sea Beauty: 10% off hair care',
      slug: 'watch-and-sea-beauty-10-off',
      store_name: 'Watch & Sea Beauty',
      code: 'CHUNGCAO10',
      description: '10% off styling glazes, jellies, oils and hair care essentials.',
      category_id: fashionId,
      discount_label: '10% OFF',
      affiliate_url: 'https://watchandseabeauty.com/chungcao10858176',
      expires_at: null,
      featured: 0,
      status: 'published',
    },
    {
      title: 'Lauren Brooke Organic Cosmetiques: 10% off organic skincare',
      slug: 'lauren-brooke-cosmetiques-10-off',
      store_name: 'Lauren Brooke Organic Cosmetiques',
      code: 'LINDSEYREM',
      description: '10% off certified organic skincare and cosmetics.',
      category_id: fashionId,
      discount_label: '10% OFF',
      affiliate_url: 'https://www.laurenbrookecosmetiques.com?sca_ref=11859867.Ed98eyh57C',
      expires_at: null,
      featured: 0,
      status: 'published',
    },
    {
      title: 'Lag Shot Golf: 15% off swing trainers',
      slug: 'lag-shot-golf-15-off',
      store_name: 'Lag Shot Golf',
      code: 'OKENACHAE15',
      description: '15% off Lag Shot swing trainers, including the 7 Iron, Driver, and Triple Threat bundle.',
      category_id: healthId,
      discount_label: '15% OFF',
      affiliate_url: 'https://lagshotgolf.com/okenachae?utm_source=affiliates&utm_medium=affiliates&utm_campaign=affiliates',
      expires_at: null,
      featured: 1,
      status: 'published',
    },
  ];

  return { reviews, coupons };
}

function seedMoreContent(db) {
  const { reviews, coupons } = buildContent(db);

  const insertReview = db.prepare(`
    INSERT INTO reviews
      (title, slug, category_id, summary, content, image_url, rating, pros, cons, price, original_price, affiliate_url, affiliate_network, coupon_code, featured, status)
    VALUES (@title, @slug, @category_id, @summary, @content, @image_url, @rating, @pros, @cons, @price, @original_price, @affiliate_url, @affiliate_network, @coupon_code, @featured, @status)
  `);

  const insertCoupon = db.prepare(`
    INSERT INTO coupons
      (title, slug, store_name, code, description, category_id, discount_label, affiliate_url, expires_at, featured, status)
    VALUES (@title, @slug, @store_name, @code, @description, @category_id, @discount_label, @affiliate_url, @expires_at, @featured, @status)
  `);

  const log = [];
  let addedReviews = 0;
  let addedCoupons = 0;

  reviews.forEach((r) => {
    const exists = db.prepare('SELECT id FROM reviews WHERE slug = ?').get([r.slug]);
    if (!exists) {
      insertReview.run(r);
      addedReviews++;
      log.push(`Added review: ${r.title}`);
    } else {
      log.push(`Skipped (already exists): ${r.title}`);
    }
  });

  coupons.forEach((c) => {
    const exists = db.prepare('SELECT id FROM coupons WHERE slug = ?').get([c.slug]);
    if (!exists) {
      insertCoupon.run(c);
      addedCoupons++;
      log.push(`Added coupon: ${c.title}`);
    } else {
      log.push(`Skipped (already exists): ${c.title}`);
    }
  });

  log.push(`\nDone. Added ${addedReviews} review(s) and ${addedCoupons} coupon(s).`);
  return { addedReviews, addedCoupons, log };
}

module.exports = { seedMoreContent };
