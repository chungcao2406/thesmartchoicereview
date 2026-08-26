# TheSmartChoiceReview

An independent product review and coupon site built with Node.js, Express, EJS and SQLite. No build step required.

## Features

- Public site: homepage, review listings, review detail pages (with pros/cons, star rating, sticky affiliate CTA, coupon code box), coupons/deals page, category pages, search, about/contact, affiliate disclosure, privacy policy, terms, sitemap.xml, robots.txt.
- Admin panel at `/admin`: login, dashboard, full CRUD for reviews, coupons and categories, contact message inbox, password change.
- SQLite database (file-based, zero extra setup) with an automatic first-run migration + seed (default admin account + starter categories + sample content).
- Session-backed auth (bcrypt-hashed passwords), sessions persisted in SQLite so logins survive restarts.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:3000`. On first run the server prints a generated admin username/password to the console — log in at `/admin/login` and change it immediately from **Admin → Settings**.

## Project structure

```
server.js              Express app entry point
db/schema.sql           SQLite schema
db/database.js          DB connection, migrations, first-run seed data
lib/                     Small helpers (slugify, pagination, session store)
middleware/auth.js       Admin auth guard
routes/public.js         Public-facing routes
routes/admin.js          Admin panel routes
views/                   EJS templates (public pages + views/admin)
public/                  Static assets: css/style.css, js/, images/
data/app.db              SQLite database file (created automatically, gitignored)
```

## Content management

Everything (reviews, coupons, categories, contact messages) is managed from `/admin` — no need to edit code or redeploy to publish new content. The two sample reviews and one sample coupon seeded on first run are placeholders; edit or delete them from the admin panel once you add real content.

## Deploying to tenten.vn Vibe Code Hosting

Vibe Code Hosting auto-detects and runs Node.js projects. A few things this project is already set up for:

1. **Root-level structure.** `package.json` and `server.js` sit at the repository root (not in a subfolder), as required by Vibe Code Hosting.
2. **Start command.** `package.json` defines `"start": "node server.js"`, and the server listens on `process.env.PORT` (falling back to 3000), matching how most Node auto-detect platforms run apps.
3. **No env vars required.** If the platform doesn't expose a way to set custom environment variables, the app still works out of the box:
   - A random session secret is generated once and stored in the SQLite database.
   - A default admin account (`admin` / `ChangeMe123!`) is created on first boot if `ADMIN_USERNAME`/`ADMIN_PASSWORD` aren't set. **Change this password immediately** from `/admin/settings` after your first deploy.
4. **SQLite lives in `data/app.db`**, created automatically on first boot. It's gitignored, so each fresh deploy starts with a clean database (which then seeds itself again). If you redeploy by re-syncing from Git, note that this will **not** wipe existing production data, since `data/` isn't tracked by git and Vibe Code Hosting's Git sync only touches tracked files — but always keep your own backups before major changes.

### Steps

1. Push this project to your GitHub repository (see below).
2. In the tenten.vn control panel, open **Vibe Code Hosting** and choose **1-Click Launch**.
3. Connect the GitHub repository (public repos: paste the link directly; private repos: authorize via GitHub login).
4. Choose or create the domain/subdomain to attach.
5. Click **Deploy** and wait for the completion notification. SSL is configured automatically.
6. Visit the site, then immediately log in at `/admin/login` with the console-printed (or default) credentials and change the password from **Settings**.

If `npm install` ever fails on the host due to the native `better-sqlite3` module not having a prebuilt binary for their environment, contact tenten support to confirm build-tool availability, or swap the database layer for a pure-JS alternative (e.g. `lowdb`) — the rest of the app is unaffected since all DB access goes through `db/database.js`.

## Pushing to GitHub

```bash
cd thesmartchoicereview
git init
git add .
git commit -m "Initial commit: TheSmartChoiceReview"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Before going live

- [ ] Change the default admin password.
- [ ] Replace the two sample reviews and one sample coupon with real content (or delete them).
- [ ] Update `/about`, `/privacy-policy` and `/terms` with details specific to your business.
- [ ] Set `SITE_NAME` and double-check all affiliate links use your real affiliate IDs.
- [ ] Confirm the domain is connected and SSL is active in the tenten.vn panel.
