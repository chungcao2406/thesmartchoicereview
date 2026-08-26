require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { db, getSetting, init } = require('./db/database');
const SqliteSessionStore = require('./lib/sqliteSessionStore');
const { attachUser } = require('./middleware/auth');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const PORT = process.env.PORT || 3000;
const SITE_NAME = process.env.SITE_NAME || 'TheSmartChoiceReview';

async function main() {
  // The database engine (sql.js) loads its WASM module and seeds starter
  // data asynchronously; everything below must wait for that to finish.
  await init();

  const app = express();

  app.set('trust proxy', 1);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(
    helmet({
      contentSecurityPolicy: false, // keep simple for inline styles/scripts in server-rendered views
    })
  );
  app.use(compression());
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(
    session({
      store: new SqliteSessionStore(db),
      secret: process.env.SESSION_SECRET || getSetting('session_secret'),
      name: 'tscr.sid',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS_COOKIE === 'true',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  app.use(attachUser(db));

  // Global template locals available on every view.
  app.use((req, res, next) => {
    res.locals.siteName = SITE_NAME;
    res.locals.currentYear = new Date().getFullYear();
    res.locals.currentPath = req.path;
    res.locals.navCategories = db
      .prepare('SELECT id, name, slug FROM categories ORDER BY sort_order ASC, name ASC')
      .all();
    next();
  });

  app.use('/admin', adminRoutes);
  app.use('/', publicRoutes);

  // 404
  app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500', { title: 'Something Went Wrong', error: err });
  });

  app.listen(PORT, () => {
    console.log(`${SITE_NAME} running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
