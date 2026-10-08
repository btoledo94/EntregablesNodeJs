import express, { ErrorRequestHandler } from 'express';
import { findCard, openDatabase } from './database';
import { validateCardNumber } from './card-validation';

const validId = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const validLimit = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;
const validStatus = (value: unknown) => value === 'active' || value === 'inactive';

export async function createApp(filename?: string) {
  const { db, save } = await openDatabase(filename);
  const app = express();
  app.use(express.json());
  const base = '/api/v1/credit-cards';

  app.get(base, (_req, res) => {
    const result = db.exec(`
      SELECT id, user_id AS userId, credit_limit AS creditLimit,
             status, brand, last4, card_number AS cardNumber, created_at AS createdAt
      FROM credit_cards WHERE status = 'active' AND deleted_at IS NULL ORDER BY id
    `)[0];
    const cards = result ? result.values.map(row =>
      Object.fromEntries(result.columns.map((key, index) => [key, row[index]]))) : [];
    res.json(cards);
  });

  app.post(base, (req, res) => {
    const body: unknown = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ message: 'El cuerpo debe ser un objeto JSON.' });
      return;
    }
    const { userId, creditLimit, cardNumber } = body as Record<string, unknown>;
    if (!validId(userId) || !validLimit(creditLimit)) {
      res.status(400).json({ message: 'userId debe ser un entero positivo y creditLimit un número mayor que cero.' });
      return;
    }
    const card = validateCardNumber(cardNumber);
    if (!card) {
      res.status(400).json({ message: 'No es una tarjeta valida' });
      return;
    }
    const user = db.exec('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user.length) {
      res.status(400).json({ message: 'El usuario indicado no existe.' });
      return;
    }
    db.run('INSERT INTO credit_cards (user_id, credit_limit, brand, last4, card_number) VALUES (?, ?, ?, ?, ?)',
      [userId, creditLimit, card.brand, card.last4, card.cardNumber]);
    const id = Number(db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0]);
    save();
    res.location(`${base}/${id}`).status(201).json(findCard(db, id));
  });

  app.use(`${base}/:id`, (req, res, next) => {
    if (!/^\d+$/.test(req.params.id ?? '') || !validId(Number(req.params.id))) {
      res.status(400).json({ message: 'El id debe ser un entero positivo.' });
      return;
    }
    next();
  });

  app.get(`${base}/:id`, (req, res) => {
    const card = findCard(db, Number(req.params.id));
    if (!card) {
      res.status(404).json({ message: 'Tarjeta no encontrada.' });
      return;
    }
    res.json(card);
  });

  app.patch(`${base}/:id`, (req, res) => {
    const id = Number(req.params.id);
    if (!findCard(db, id)) {
      res.status(404).json({ message: 'Tarjeta no encontrada.' });
      return;
    }
    const body: unknown = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ message: 'El cuerpo debe ser un objeto JSON.' });
      return;
    }
    const fields = body as Record<string, unknown>;
    if (!Object.keys(fields).length || Object.keys(fields).some(key => !['creditLimit', 'status'].includes(key))
      || ('creditLimit' in fields && !validLimit(fields.creditLimit))
      || ('status' in fields && !validStatus(fields.status))) {
      res.status(400).json({ message: 'Envía creditLimit mayor que cero o status: active / inactive.' });
      return;
    }
    const card = findCard(db, id)!;
    db.run('UPDATE credit_cards SET credit_limit = ?, status = ? WHERE id = ?', [
      fields.creditLimit as number ?? card.creditLimit!,
      fields.status as string ?? card.status!, id
    ]);
    save();
    res.json(findCard(db, id));
  });

  app.delete(`${base}/:id`, (req, res) => {
    const id = Number(req.params.id);
    if (!findCard(db, id)) {
      res.status(404).json({ message: 'Tarjeta no encontrada.' });
      return;
    }
    db.run("UPDATE credit_cards SET deleted_at = CURRENT_TIMESTAMP, status = 'inactive' WHERE id = ?", [id]);
    save();
    res.status(204).end();
  });

  app.use((_req, res) => { res.status(404).json({ message: 'Ruta no encontrada.' }); });
  const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
    if (status === 400 || status === 413 || status === 415) {
      res.status(status).json({ message: 'Revisa el formato y tamaño del JSON.' });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  };
  app.use(errorHandler);
  return { app, db };
}
