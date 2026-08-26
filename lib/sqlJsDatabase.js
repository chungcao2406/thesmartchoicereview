const fs = require('fs');
const initSqlJs = require('sql.js');

// Mirrors better-sqlite3's flexible bind-argument convention so existing
// call sites (.get(x), .get(x, y), .all({...}), .all()) keep working:
//   - no args                         -> unbound
//   - one array arg                   -> positional ? params, in order
//   - one plain-object arg            -> named @param params
//   - one bare scalar, or 2+ args     -> positional ? params, in order
// Named params in this codebase are written as @name in SQL and passed as
// plain-key objects (e.g. { categoryId: 5 }); sql.js needs the sigil on the
// bind object's keys (e.g. '@categoryId'), so that translation happens here.
function normalizeArgs(args) {
  if (args.length === 0) return undefined;
  if (args.length === 1) {
    const only = args[0];
    if (Array.isArray(only)) return only;
    if (only !== null && typeof only === 'object') {
      const out = {};
      for (const key of Object.keys(only)) out['@' + key] = only[key];
      return out;
    }
    return [only];
  }
  return Array.from(args);
}

class Statement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }

  get(...args) {
    this.db._ensureReady();
    const stmt = this.db._raw.prepare(this.sql);
    try {
      const p = normalizeArgs(args);
      if (p !== undefined) stmt.bind(p);
      const row = stmt.step() ? stmt.getAsObject() : undefined;
      return row;
    } finally {
      stmt.free();
    }
  }

  all(...args) {
    this.db._ensureReady();
    const stmt = this.db._raw.prepare(this.sql);
    const rows = [];
    try {
      const p = normalizeArgs(args);
      if (p !== undefined) stmt.bind(p);
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      return rows;
    } finally {
      stmt.free();
    }
  }

  run(...args) {
    this.db._ensureReady();
    const stmt = this.db._raw.prepare(this.sql);
    try {
      const p = normalizeArgs(args);
      if (p !== undefined) stmt.bind(p);
      stmt.step();
    } finally {
      stmt.free();
    }
    this.db._scheduleSave();
    return { changes: this.db._raw.getRowsModified() };
  }
}

class LazyDatabase {
  constructor(filePath) {
    this.filePath = filePath;
    this._raw = null;
    this._saveTimer = null;
  }

  async init() {
    const SQL = await initSqlJs();
    if (fs.existsSync(this.filePath)) {
      const fileBuffer = fs.readFileSync(this.filePath);
      this._raw = new SQL.Database(fileBuffer);
    } else {
      this._raw = new SQL.Database();
    }

    const flush = () => this._saveSync();
    process.on('exit', flush);
    process.on('SIGINT', () => {
      flush();
      process.exit(0);
    });
    process.on('SIGTERM', () => {
      flush();
      process.exit(0);
    });
  }

  _ensureReady() {
    if (!this._raw) throw new Error('Database accessed before initialization completed');
  }

  exec(sql) {
    this._ensureReady();
    this._raw.run(sql);
    this._scheduleSave();
  }

  pragma(str) {
    this._ensureReady();
    try {
      this._raw.run('PRAGMA ' + str);
    } catch (_) {
      // Some pragmas (e.g. journal_mode) don't apply to an in-memory engine; ignore.
    }
  }

  prepare(sql) {
    return new Statement(this, sql);
  }

  _scheduleSave() {
    if (this._saveTimer) return;
    this._saveTimer = setTimeout(() => {
      this._saveTimer = null;
      this._saveSync();
    }, 250);
    if (this._saveTimer.unref) this._saveTimer.unref();
  }

  _saveSync() {
    if (!this._raw) return;
    try {
      const data = this._raw.export();
      fs.writeFileSync(this.filePath, Buffer.from(data));
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }
}

module.exports = { LazyDatabase };
