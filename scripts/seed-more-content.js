// One-off content migration: adds 5 new reviews + 4 coupons if they don't
// already exist (safe to run more than once).
//
// IMPORTANT: only run this while the Node.js app is STOPPED. If the live app
// is running, use the safer route instead: log into /admin and visit
// /admin/tools/seed-more-content, which runs inside the same live process
// instead of a separate one (avoiding a stale in-memory copy silently
// overwriting this script's changes when the app process next saves or
// restarts).
const { db, init } = require('../db/database');
const { seedMoreContent } = require('../lib/extraContent');

async function run() {
  await init();
  const result = seedMoreContent(db);
  db._saveSync();
  console.log(result.log.join('\n'));
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
