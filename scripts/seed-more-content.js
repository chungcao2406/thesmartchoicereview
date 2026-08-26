// Syncs the starter reviews + coupons from lib/extraContent.js: inserts
// anything missing by slug, updates the editorial fields on anything that
// already exists.
//
// IMPORTANT: only run this while the Node.js app is STOPPED. If the live
// app is running, use the safer route instead: log into /admin and visit
// /admin/tools/sync-content, which runs inside the same live process
// instead of a separate one (avoiding a stale in-memory copy silently
// overwriting this script's changes when the app process next saves or
// restarts).
const { db, init } = require('../db/database');
const { syncContent } = require('../lib/extraContent');

async function run() {
  await init();
  const result = syncContent(db);
  db._saveSync();
  console.log(result.log.join('\n'));
  process.exit(0);
}

run().catch((err) => {
  console.error('Sync script failed:', err);
  process.exit(1);
});
