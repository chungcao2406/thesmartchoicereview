// Single source of truth for all review + coupon content. Used by:
//   - db/database.js on first boot (fresh installs, via INSERT)
//   - the protected /admin/tools/sync-content route (existing installs,
//     via UPDATE-by-slug) — safe to run inside the live server process,
//     since it shares that process's in-memory db instance.
function buildContent(db) {
  const categoryId = (slug) => {
    const row = db.prepare('SELECT id FROM categories WHERE slug = ?').get([slug]);
    return row ? row.id : null;
  };

  const techId = categoryId('tech-gadgets');
  const fashionId = categoryId('fashion-beauty');
  const healthId = categoryId('health-fitness');
  const travelId = categoryId('travel-outdoors');

  const reviews = [
    {
      title: 'Pocket AI Wearable Recorder Review: Does It Replace Note-Taking?',
      slug: 'pocket-ai-wearable-recorder-review-does-it-replace-note-taking',
      category_id: techId,
      summary:
        "Stop losing your best ideas mid-conversation. Pocket clips onto your phone, listens when you need it to, and turns every conversation into a searchable transcript, summary and action list, automatically.",
      content: `<p><strong>If you've ever walked out of a meeting and immediately forgotten half of what was said, Pocket solves exactly that problem.</strong> It's a small, MagSafe-mountable recorder: press the button, it starts capturing, and the companion app turns the audio into a transcript, summary and action items before you've even sat back down.</p>
<p>What makes it worth buying over just using your phone's voice memo app is what happens after you record. Pocket's AI (built on top of models like GPT-5 and Claude) breaks the conversation down automatically &mdash; key takeaways, a visual mind map, and action items pulled out without you lifting a finger. For anyone who's tried to manually re-listen to a 45-minute call to find one detail, that alone is worth the price.</p>
<p>The hardware backs it up: two studio microphones plus a dedicated contact mic for phone calls, 4 days of battery on a single charge, and 64GB of onboard storage so it keeps recording even without a phone connection nearby.</p>
<p>And unlike most AI hardware, you're not locked into a subscription to get real use out of it &mdash; transcription and the core features are free, forever. The $16.59/month Pro plan is there if you want unlimited saved history and the most accurate models, but it's an upgrade, not a requirement.</p>
<p><strong>Who it's for:</strong> anyone whose job runs on conversations &mdash; sales calls, client meetings, therapy sessions, interviews &mdash; and who's tired of choosing between being present and taking notes.</p>
<p><strong>Bottom line:</strong> at $129 (down from $199) with no subscription required to start, Pocket is one of the easier "try it and see" purchases in this list. If you're constantly saying "wait, what did they say about that?" after a call, this pays for itself in the first week.</p>`,
      image_url: 'https://heypocket.com/cdn/shop/files/Thumnail_1.png?v=1772470703',
      gallery_images: JSON.stringify([
        'https://heypocket.com/cdn/shop/files/pkt_04_gr-2min.jpg?v=1771399636',
        'https://heypocket.com/cdn/shop/files/pkt_06_pink-2min_462804f8-6868-4ad9-b596-2c78d462ecd3.jpg?v=1771399636',
        'https://heypocket.com/cdn/shop/files/pkt_13_wh-min.jpg?v=1774687880',
      ]),
      rating: 4.6,
      pros: JSON.stringify([
        'Captures everything so you can stay fully present in the conversation instead of scribbling notes',
        'Free core features forever, no subscription needed to get real value',
        '4-day battery and 64GB storage mean it\'s always ready',
        'Dual mics + contact mic reliably pick up both in-person talk and phone calls',
        'Currently $70 off list price ($129 vs $199)',
      ]),
      cons: JSON.stringify([
        'Pro plan required to unlock unlimited saved history and the top-tier AI models',
        'One more device to charge and carry alongside your phone',
        'Always check local consent laws before recording other people',
      ]),
      price: '$129.00',
      original_price: '$199.00',
      affiliate_url:
        'https://heypocket.com/11321948?utm_source=affiliate&utm_medium=affiliate&utm_campaign=pocket-affiliate-program&utm_term=Chung-Cao',
      affiliate_network: 'Pocket Affiliate Program',
      coupon_code: null,
      featured: 1,
      status: 'published',
    },
    {
      title: 'Mangosteen M1P Electric Scooter Review: A Street-Legal E-Chopper for Under €1,800',
      slug: 'mangosteen-m1p-electric-scooter-review-a-street-legal-e-chopper-for-under-1-800',
      category_id: travelId,
      summary:
        "A street-legal, fat-tire e-chopper that turns heads and cuts your commute cost to pennies. Here's why the 2026 upgrade makes this the easiest Mangosteen model to recommend yet.",
      content: `<p><strong>The M1P is the reason Mangosteen has built a 10,000+ rider community across the EU.</strong> It looks like a chopper motorcycle, rides like one, and is fully street-legal at 45 km/h with nothing more than a standard AM or B driver's license &mdash; no motorcycle endorsement needed.</p>
<p>The 2026 Upgraded version fixes the two things riders actually complain about on cheaper e-scooters: wheel size and braking. Front wheels grow from 13" to 14", rear from 12" to 13", and both ends now run fully enclosed hydraulic disc brakes instead of the mechanical setup older models used. Bigger wheels mean better stability over potholes and less wobble at speed; better brakes mean shorter stopping distances when it matters.</p>
<p>Running costs are where this really sells itself: about &euro;1 of electricity per 100km. That's a fraction of fuel or public transit costs for daily riders, and the 2000W hub motor with 120Nm of torque means you're not sacrificing power to get there.</p>
<p>Mangosteen also backs the M1P with a genuinely deep customization catalog &mdash; fenders, backrests, Bluetooth audio, alternate handlebars &mdash; so your bike doesn't have to look like everyone else's.</p>
<p><strong>Who it's for:</strong> city commuters and weekend riders who want the presence of a motorcycle without the licensing hurdles, and who care about running costs as much as style.</p>
<p><strong>Bottom line:</strong> at &euro;1.799 (down from &euro;1.999), with free shipping and an 18-month warranty included, this is one of the more complete street-legal e-mopeds you can order online right now. If you've been eyeing the Citycoco look, the 2026 brake and wheel upgrade is the version to buy.</p>`,
      image_url: 'https://www.mangosteenscooter.com/cdn/shop/files/03.webp?v=1761558250&width=1000',
      gallery_images: JSON.stringify([
        'https://www.mangosteenscooter.com/cdn/shop/files/2_eec9526d-10d8-49b5-997d-0038d9e99b7c.webp?v=1774596645',
        'https://www.mangosteenscooter.com/cdn/shop/files/4_b1813d59-6006-4c43-ab7c-d1bfc5a89271.webp?v=1774596645',
        'https://www.mangosteenscooter.com/cdn/shop/files/7_aa0507c7-b37e-4a22-9391-447fab934372.webp?v=1774596645',
      ]),
      rating: 4.5,
      pros: JSON.stringify([
        'Street-legal at 45 km/h with just a standard AM or B license, no motorcycle test required',
        '2026 upgrade adds bigger wheels and full hydraulic disc brakes front and rear',
        'Roughly €1 in electricity per 100 km, dramatically cheaper than fuel or transit',
        '18-month warranty and free shipping included',
        'Huge customization catalog if you want to make yours unique',
      ]),
      cons: JSON.stringify([
        'Wide, low-slung frame takes up more storage space than a standard scooter',
        "Best suited to riders 160-195cm; check handlebar options outside that range",
        'Confirm registration/insurance rules in your country before ordering',
      ]),
      price: '€1.799,00',
      original_price: '€1.999,00',
      affiliate_url: 'https://www.mangosteenscooter.com?sca_ref=11406255.N9q4ouPVHfzI',
      affiliate_network: 'Mangosteen Scooter Affiliate Program',
      coupon_code: null,
      featured: 1,
      status: 'published',
    },
    {
      title: 'Leofoto LS-284CXPRO + LH-30LR Tripod Review: Pro-Grade Carbon Fiber Without the Flagship Price',
      slug: 'leofoto-ls-284cxpro-lh-30lr-tripod-review-pro-grade-carbon-fiber-without-the-fla',
      category_id: techId,
      summary:
        "A weatherproof, professional-grade carbon fiber tripod at a fraction of the price of the big names. If you've been putting off upgrading your tripod because of cost, this is the one that removes the excuse.",
      content: `<p><strong>Leofoto exists to answer one question: why does a good tripod have to cost $700+?</strong> The LS-284CXPRO Ranger Series delivers the same carbon fiber build quality and Arca-standard compatibility as flagship brands like Really Right Stuff and Gitzo, at less than two-thirds the price, bundled here with the LH-30LR ball head.</p>
<p>The 2026 Pro refresh isn't just a name change. The leg tubes use a higher-density carbon fiber layup for more rigidity, and the twist locks are now genuinely water-resistant, sealing out the grit and moisture that eventually wear out cheaper tripods. The angle-stop mechanism was also redesigned for one-handed operation, so getting into a low-angle shot doesn't mean fighting with two locks at once.</p>
<p>The numbers hold up under scrutiny: 1.51kg total weight with the head attached, folds to just 560mm for travel, and a 10kg load rating that comfortably handles a mirrorless body with a mid-range zoom. The LH-30LR head alone is worth calling out &mdash; 345g, yet rated to 15kg, which is unusually strong for a head this size and weight.</p>
<p><strong>Who it's for:</strong> travel and landscape photographers who want pro-level stability and weatherproofing without pro-level weight or pro-level price. If you're carrying a full-frame mirrorless setup and shooting outdoors regularly, this is a legitimate upgrade from a beginner tripod.</p>
<p><strong>Bottom line:</strong> at $429 for a weatherproof carbon fiber tripod and ball head together, this is genuinely hard to beat on value. The one caveat &mdash; max height tops out around 53.9", so taller shooters should factor that in before buying.</p>`,
      image_url: 'https://leofotousa.com/cdn/shop/files/LS-284CX_PRO_LH-30.jpg?v=1776293573',
      gallery_images: JSON.stringify([
        'https://leofotousa.com/cdn/shop/files/LS-284CX_PRO_LH-30-1.jpg?v=1776293573',
        'https://leofotousa.com/cdn/shop/files/LS-284CX_PRO_LH-30-3.jpg?v=1776293573',
        'https://leofotousa.com/cdn/shop/files/LS-284CX_PRO.jpg?v=1776293573',
      ]),
      rating: 4.4,
      pros: JSON.stringify([
        'Carbon fiber build quality and Arca compatibility at well below flagship pricing',
        'New water-resistant twist locks handle real outdoor conditions',
        'Extremely light (1.51kg) without sacrificing a 10kg load rating',
        'One-handed angle-stop adjustment speeds up low-angle setups',
        'Included LH-30LR ball head punches well above its 345g weight',
      ]),
      cons: JSON.stringify([
        "Max height of ~53.9\" can feel short for shooters over roughly 5'7\"",
        '10kg load limit isn\'t built for large telephoto or video rigs',
        'Still a newer release, so the public review history is thin so far',
      ]),
      price: '$429.00',
      original_price: null,
      affiliate_url: 'https://leofotousa.com?sca_ref=10975682.xJWHdvvYzG',
      affiliate_network: 'Leofoto USA Affiliate Program',
      coupon_code: null,
      featured: 1,
      status: 'published',
    },
    {
      title: 'Babylon Leather Kelly-Style DIY Bag Kit Review: Worth the Stitching?',
      slug: 'babylon-leather-kelly-style-diy-bag-kit-review',
      category_id: fashionId,
      summary:
        "Sew your own designer-inspired leather bag by hand, no machine, no experience required. This is the kit that turns 'I could never make that' into a finished bag you'll actually carry.",
      content: `<p><strong>Babylon Leather built its entire business around one satisfying idea: you can hand-stitch a genuinely beautiful leather bag yourself, even if you've never touched a needle and thread before.</strong> The Kelly-Style Bag Kit with Lychee Pattern Leather is their most-reviewed kit for a reason &mdash; it's approachable enough for a first project and good-looking enough to actually carry once it's done.</p>
<p>Everything ships pre-cut and pre-punched: full-grain or top-grain leather panels, waxed thread, an awl, needles, and a printed tutorial that walks you through the same saddle-stitch technique used on real luxury leather goods. There's no guesswork in the cutting or measuring, which is where most first-time leather projects go wrong.</p>
<p>If you want to make it your own, the customization list is long: swap in a different leather color for $45, upgrade to a full genuine-leather lining for $65, or if you'd rather skip the stitching entirely, Babylon Leather will hand-sew it for you for $65. Already own the tools from a previous kit? The Eco Refill option knocks a bit off the price.</p>
<p><strong>Who it's for:</strong> crafters who want a genuinely rewarding weekend (or few-evenings) project, and anyone who'd rather make a designer-look bag than buy one at ten times the price.</p>
<p><strong>Bottom line:</strong> at $148.23, with a 10% discount code available, this is one of the more satisfying DIY purchases you can make &mdash; you end the project with a bag you'll actually use, not a craft project that ends up in a drawer.</p>`,
      image_url:
        'https://www.babylonleather.com/cdn/shop/files/kelly-style-leather-bag-diy-kit-with-lychee-pattern-leather-babylon-leatherbabylon-leathersy34-lychee-peacock-blue-large-gold-white-6337691.jpg?v=1762328971&width=2048',
      gallery_images: JSON.stringify([
        'https://www.babylonleather.com/cdn/shop/files/kelly-style-leather-bag-diy-kit-with-lychee-pattern-leather-babylon-leatherbabylon-leathersy34-lychee-peacock-blue-large-gold-white-259478.jpg?v=1762243796',
        'https://www.babylonleather.com/cdn/shop/files/kelly-style-leather-bag-diy-kit-with-lychee-pattern-leather-babylon-leatherbabylon-leathersy34-lychee-peacock-blue-large-gold-white-894263.jpg?v=1762243796',
        'https://www.babylonleather.com/cdn/shop/files/kelly-style-leather-bag-diy-kit-with-lychee-pattern-leather-babylon-leatherbabylon-leathersy34-lychee-peacock-blue-large-gold-white-330252.jpg?v=1762243796',
      ]),
      rating: 4.9,
      pros: JSON.stringify([
        'Pre-cut, pre-punched panels make hand-stitching genuinely beginner-friendly',
        'Step-by-step video tutorial removes the guesswork',
        'Deep customization: colors, lining upgrades, even a "we sew it for you" option',
        'Eco Refill pricing available if you already own the tools',
        'Save 10% with code Chung10',
      ]),
      cons: JSON.stringify([
        'A full hand-stitched build takes several hours, plan a weekend, not an afternoon',
        'Custom color and leather lining upgrades add to the base price',
        'Standard lining is PU, not leather, unless you pay for the upgrade',
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
        "The slickback glaze built by the founder of The Mane Choice, now on shelves at CVS, Target and Walmart. Get glass-like shine and real hold without the flaky, crunchy finish other gels leave behind.",
      content: `<p><strong>Courtney Adeleye built The Mane Choice into a fixture of Black hair care, then started Watch & Sea Beauty to do it again.</strong> The brand is now stocked in CVS, Target, Walmart, H-E-B and Meijer, and the "SEA THIS HOLD" Slickback Glaze is one of its most-reviewed products for a reason: it delivers the shine and hold slickback styles need without the stiff, flaky cast a lot of edge gels leave behind.</p>
<p>The formula is built to stay flexible through the day instead of hardening into a crunchy layer. Use it under a scarf or bonnet overnight for maximum hold by morning, or apply and go for a same-day sleek finish &mdash; either way, you get the glass-like shine the name promises.</p>
<p>It's also genuinely versatile: slickbacks, ponytails, and laying edges all work with the same jar, so you're not buying three different products for three different styles.</p>
<p><strong>Who it's for:</strong> anyone doing slickbacks, ponytails, or edge styles who's tired of gels that flake by midday or leave hair feeling stiff instead of styled.</p>
<p><strong>Bottom line:</strong> at $17.99, with 10% off using code CHUNGCAO10, this is an easy add to your routine &mdash; and if it doesn't work out, you can find it at a CVS or Target near you instead of waiting on shipping.</p>`,
      image_url: 'https://watchandseabeauty.com/cdn/shop/files/IMG-0161.png?v=1786500758&width=1024',
      gallery_images: JSON.stringify([
        'https://watchandseabeauty.com/cdn/shop/files/IMG-0151.png?v=1786489956',
        'https://watchandseabeauty.com/cdn/shop/files/E832C29E-8BEA-42A1-BF18-B07DAD177075.png?v=1779993963',
        'https://watchandseabeauty.com/cdn/shop/files/F83A2034-DAD8-402E-A2D7-F7B32A41F775.png?v=1779993963',
      ]),
      rating: 4.7,
      pros: JSON.stringify([
        'Shimmery, glass-like finish without the stiff, flaky cast of many edge gels',
        'One product covers slickbacks, ponytails, and laid edges',
        'Also sold in-store at CVS, Target, Walmart and Meijer for easy access',
        'Backed by 195+ verified reviews',
        'Save 10% with code CHUNGCAO10',
      ]),
      cons: JSON.stringify([
        'Best results still depend on proper brush/comb technique',
        'Overnight scarf or bonnet setting gets the longest-lasting hold, an extra step',
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
        "Founded by someone who healed her own autoimmune symptoms by cutting toxic skincare ingredients. This 99.5% organic facial serum is the product that started it all, and it's still one of their best sellers.",
      content: `<p><strong>Lauren Brooke didn't start this brand as a business idea first &mdash; she started it after tracing years of chronic autoimmune symptoms back to the toxic ingredients in her own skincare routine.</strong> Every product is built to 99.5% certified organic, non-GMO standards, made in the USA, and the Organic Facial Serum is where the brand's reputation was built.</p>
<p>The formula is a cold-pressed blend of organic plant oils: jojoba oil for deep hydration, evening primrose oil for its soothing, anti-inflammatory properties, plus beta-carotene, omega-3 and vitamin E for anti-aging support. It's formulated for normal, dry, oily and combination skin, so you're not gambling on whether it fits your skin type.</p>
<p>Most customers apply it morning and night, either on its own or mixed into foundation for a dewy, healthy finish before makeup &mdash; a trick worth trying if you've never combined a serum with your base makeup before.</p>
<p><strong>Who it's for:</strong> anyone trying to move away from synthetic skincare ingredients without giving up results, especially if dry or reactive skin has made "clean beauty" feel like a compromise in the past.</p>
<p><strong>Bottom line:</strong> at $32.50, with 10% off using code LINDSEYREM, this is a low-risk way to try a genuinely organic-first skincare brand with thousands of reviews behind it, not a startup's first product.</p>`,
      image_url: 'https://www.laurenbrookecosmetiques.com/cdn/shop/files/OrganicFacialSerum72.png?v=1743546141',
      gallery_images: JSON.stringify([
        'https://cdn.shopify.com/s/files/1/0211/2400/files/Jojoba.jpg',
        'https://cdn.shopify.com/s/files/1/0211/2400/files/Evening_primrose.jpg',
        'https://www.laurenbrookecosmetiques.com/cdn/shop/files/Cert_Clean_Skincare-EU_Certified_Makeup-Cruelty_Free_Cosmetics-Natural_Clean_Non-toxic_Gluten-Free_Badges_2_1.png',
      ]),
      rating: 4.8,
      pros: JSON.stringify([
        '99.5% certified organic, non-GMO, made in the USA',
        'Formulated for all skin types, including sensitive and reactive skin',
        'Doubles as a makeup primer boost when mixed into foundation',
        "One of the brand's longest-running, most-repurchased products",
        'Save 10% with code LINDSEYREM',
      ]),
      cons: JSON.stringify([
        'Oil-based formula may feel heavier than a gel serum for very oily skin',
        'Must be stored out of direct sunlight to protect the natural oils',
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
        'The Golf Digest-recognized swing trainer that fixes your tempo by physically forcing you to swing correctly. If inconsistent iron shots are costing you strokes, this is the fastest way to feel the fix.',
      content: `<p><strong>Most golfers don't lack knowledge about the golf swing, they lack the feel for it.</strong> Lag Shot solves that by building the correction directly into the club: a weighted head paired with a deliberately "whippy," hyper-flexible shaft that simply won't perform unless you swing with the right sequencing, tempo and lag.</p>
<p>Because you can't muscle your way through a bad swing with this club, your body learns the correct motion through repetition instead of swing thoughts you have to consciously remember on the course. That's the whole appeal: it trains the feel, not just the theory.</p>
<p>Every 7 Iron comes with a bonus video course from Adam Bazalgette, a 3-time PGA Teacher of the Year, covering the transition drills and impact positions that most amateur golfers never get proper instruction on. You're not just buying a training club, you're getting a structured way to practice with it.</p>
<p><strong>Who it's for:</strong> mid-to-high handicap golfers looking to add distance and consistency to their iron game without a full swing rebuild. It's sold with a 30-day money-back guarantee, so there's minimal risk in trying it for yourself.</p>
<p><strong>Bottom line:</strong> at $119, backed by Golf Digest recognition and a money-back guarantee, this is one of the lower-risk ways to genuinely improve your ball-striking before your next round.</p>`,
      image_url: 'https://cdn.shopify.com/s/files/1/0572/8524/7182/files/7iron-copy_1.webp?v=1763586786',
      gallery_images: JSON.stringify([
        'https://cdn.shopify.com/s/files/1/0572/8524/7182/files/golf-swing-traing-for-clubs.webp?v=1712752625',
        'https://cdn.shopify.com/s/files/1/0572/8524/7182/files/7-iron-lag-swing-trainer.webp?v=1712752625',
        'https://cdn.shopify.com/s/files/1/0572/8524/7182/files/adam-bazalgette-golf-swing-training.webp?v=1712752625',
      ]),
      rating: 4.8,
      pros: JSON.stringify([
        'Physically forces correct lag and tempo, you feel the fix, not just read about it',
        'Golf Digest-recognized, used by PGA instructors',
        'Includes a bonus video course from a 3-time PGA Teacher of the Year',
        '30-day money-back guarantee removes the risk of trying it',
        'Save 15% with code OKENACHAE15',
      ]),
      cons: JSON.stringify([
        'Advanced players with an already-grooved swing may see a smaller improvement',
        "It's a training tool, not a playable club, you'll still need to transfer the feel to your irons on the course",
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
        "Dakar Rally-tested adventure luggage, built to survive terrain most panniers never see. If you're planning real off-road touring, this is the set that won't fail you halfway through.",
      content: `<p><strong>Westwind Moto doesn't just sell adventure luggage, it's the official luggage sponsor for the KOVE Dakar Team and Ultra Dakar, which means the Hussar Panniers Set has already been tested in conditions most riders will never actually face.</strong> That's a level of real-world validation most motorcycle luggage brands simply can't claim.</p>
<p>The "semi-rigid" construction is the key design decision: it holds its shape far better than soft throw-over saddlebags, so your gear doesn't shift and sag over rough terrain, while staying meaningfully lighter than full hard-shell aluminum cases. You get structure without the weight penalty.</p>
<p>Mounting doesn't require permanent modifications to your bike, and Westwind maintains a dedicated rack-compatibility page so you can confirm fit for your exact model before you order, worth doing, since luggage that doesn't fit right is worse than no luggage at all.</p>
<p><strong>Who it's for:</strong> long-distance adventure riders who need their gear to survive drops, mud and genuine off-road abuse, not just highway miles to a campsite.</p>
<p><strong>Bottom line:</strong> at $879, this isn't an impulse buy, but it's priced like what it is: gear tested by a Dakar-sponsored team, not a weekend accessory. Westwind also frequently bundles a free accessory (backpack, hydration pack, or tank bag) with this set, so it's worth checking current promotions before checkout.</p>`,
      image_url: 'https://cdn.shopify.com/s/files/1/0857/4323/9456/files/RW3.png?v=1756638528',
      gallery_images: JSON.stringify([
        'https://cdn.shopify.com/s/files/1/0857/4323/9456/files/01abdb5918ff4c6ffc566311792ee928_2.png?v=1756809396',
        'https://cdn.shopify.com/s/files/1/0857/4323/9456/files/RW3-Black.png?v=1756809396',
        'https://cdn.shopify.com/s/files/1/0857/4323/9456/files/e94c2f2dcf4b38976aa4ab86d6cdfd2f.png?v=1756809396',
      ]),
      rating: 4.7,
      pros: JSON.stringify([
        'Semi-rigid build holds its shape without the full weight of hard cases',
        'Tested through real Dakar Rally sponsorship, not just marketing claims',
        'No permanent bike modifications required to mount',
        'Frequently bundled with a free accessory during promotions',
      ]),
      cons: JSON.stringify([
        'Premium price point compared to basic soft saddlebags',
        'Always confirm rack compatibility for your specific bike before ordering',
        'Added width means planning for a rack system built to match',
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
      title: 'Pocket AI Recorder - $70 Off Launch Price',
      slug: 'heypocket-70-off-launch-price',
      store_name: 'HeyPocket',
      code: null,
      description:
        'Pocket, the AI wearable recorder from HeyPocket, is currently listed at $129 (down from $199) directly on the official site - no code needed, the discount is already applied at checkout.',
      category_id: techId,
      discount_label: '35% OFF',
      affiliate_url:
        'https://heypocket.com/11321948?utm_source=affiliate&utm_medium=affiliate&utm_campaign=pocket-affiliate-program&utm_term=Chung-Cao',
      expires_at: null,
      featured: 1,
      status: 'published',
    },
    {
      title: 'Mangosteen M1P Scooter - €200 Off',
      slug: 'mangosteen-m1p-200-off',
      store_name: 'Mangosteen Scooter',
      code: null,
      description:
        'The upgraded Mangosteen M1P street-legal electric scooter is currently listed at €1,799 (down from €1,999) directly on the official site - no code needed, price is already reduced at checkout.',
      category_id: travelId,
      discount_label: '€200 OFF',
      affiliate_url: 'https://www.mangosteenscooter.com?sca_ref=11406255.N9q4ouPVHfzI',
      expires_at: null,
      featured: 1,
      status: 'published',
    },
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

// Inserts any review/coupon missing by slug, and updates the editorial
// fields (title, summary, content, image, gallery, rating, pros/cons,
// price, affiliate info, coupon code) on any that already exist. Category
// assignments and status/featured flags are left alone on update, so any
// manual admin changes to those aren't clobbered by a re-sync.
function syncContent(db) {
  const { reviews, coupons } = buildContent(db);

  const insertReview = db.prepare(`
    INSERT INTO reviews
      (title, slug, category_id, summary, content, image_url, gallery_images, rating, pros, cons, price, original_price, affiliate_url, affiliate_network, coupon_code, featured, status)
    VALUES (@title, @slug, @category_id, @summary, @content, @image_url, @gallery_images, @rating, @pros, @cons, @price, @original_price, @affiliate_url, @affiliate_network, @coupon_code, @featured, @status)
  `);

  const updateReview = db.prepare(`
    UPDATE reviews SET
      title=@title, summary=@summary, content=@content, image_url=@image_url,
      gallery_images=@gallery_images, rating=@rating, pros=@pros, cons=@cons,
      price=@price, original_price=@original_price, affiliate_url=@affiliate_url,
      affiliate_network=@affiliate_network, coupon_code=@coupon_code, updated_at=datetime('now')
    WHERE slug=@slug
  `);

  const insertCoupon = db.prepare(`
    INSERT INTO coupons
      (title, slug, store_name, code, description, category_id, discount_label, affiliate_url, expires_at, featured, status)
    VALUES (@title, @slug, @store_name, @code, @description, @category_id, @discount_label, @affiliate_url, @expires_at, @featured, @status)
  `);

  const updateCoupon = db.prepare(`
    UPDATE coupons SET
      title=@title, store_name=@store_name, code=@code, description=@description,
      discount_label=@discount_label, affiliate_url=@affiliate_url, updated_at=datetime('now')
    WHERE slug=@slug
  `);

  const log = [];
  let inserted = 0;
  let updated = 0;

  reviews.forEach((r) => {
    const exists = db.prepare('SELECT id FROM reviews WHERE slug = ?').get([r.slug]);
    if (exists) {
      updateReview.run(r);
      updated++;
      log.push(`Updated review: ${r.title}`);
    } else {
      insertReview.run(r);
      inserted++;
      log.push(`Added review: ${r.title}`);
    }
  });

  coupons.forEach((c) => {
    const exists = db.prepare('SELECT id FROM coupons WHERE slug = ?').get([c.slug]);
    if (exists) {
      updateCoupon.run(c);
      updated++;
      log.push(`Updated coupon: ${c.title}`);
    } else {
      insertCoupon.run(c);
      inserted++;
      log.push(`Added coupon: ${c.title}`);
    }
  });

  log.push(`\nDone. Inserted ${inserted}, updated ${updated}.`);
  return { inserted, updated, log };
}

module.exports = { buildContent, syncContent };
