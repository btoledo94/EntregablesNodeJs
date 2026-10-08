import initSqlJs, { Database } from 'sql.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export async function openDatabase(filename = resolve('data/cards.sqlite')) {
  const SQL = await initSqlJs();
  const db = new SQL.Database(filename !== ':memory:' && existsSync(filename)
    ? readFileSync(filename) : undefined);
  db.run(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS credit_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      credit_limit REAL NOT NULL CHECK (credit_limit > 0),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TEXT DEFAULT NULL,
      brand TEXT,
      last4 TEXT,
      card_number TEXT
    );
    INSERT OR IGNORE INTO users (id, name, email)
    VALUES (1, 'Byron Toledo', 'btoledo@gmail.com');
  `);
  // Actualiza bases anteriores sin borrar las tarjetas que ya existen.
  const columns = db.exec('PRAGMA table_info(credit_cards)')[0]?.values.map(row => row[1]) ?? [];
  if (!columns.includes('brand')) db.run('ALTER TABLE credit_cards ADD COLUMN brand TEXT');
  if (!columns.includes('last4')) db.run('ALTER TABLE credit_cards ADD COLUMN last4 TEXT');
  if (!columns.includes('card_number')) db.run('ALTER TABLE credit_cards ADD COLUMN card_number TEXT');
  const save = () => {
    if (filename === ':memory:') return;
    mkdirSync(dirname(filename), { recursive: true });
    writeFileSync(filename, db.export());
  };
  save();
  return { db, save };
}

export function findCard(db: Database, id: number) {
  const statement = db.prepare(`
    SELECT id, user_id AS userId, credit_limit AS creditLimit,
           status, brand, last4, card_number AS cardNumber, created_at AS createdAt
    FROM credit_cards WHERE id = ? AND deleted_at IS NULL
  `);
  try {
    statement.bind([id]);
    return statement.step() ? statement.getAsObject() : undefined;
  } finally {
    statement.free();
  }
}
