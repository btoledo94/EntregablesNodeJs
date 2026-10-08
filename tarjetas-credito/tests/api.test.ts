import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app';
import { validateCardNumber } from '../src/card-validation';

test('CRUD, validaciones y eliminación lógica', async () => {
  const { app, db } = await createApp(':memory:');
  const base = '/api/v1/credit-cards';
  try {
    await request(app).get(base).expect(200, []);
    await request(app).post(base).send({ userId: 1 }).expect(400);
    await request(app).post(base).send({ creditLimit: 100 }).expect(400);
    await request(app).post(base).send({ userId: 999, creditLimit: 100 }).expect(400);
    await request(app).post(base).send({ userId: 1, creditLimit: -1 }).expect(400);
    await request(app).post(base).send({ userId: 1, creditLimit: 1500 }).expect(400);
    for (const cardNumber of ['4111111111111112', '0000000000000000', '411111111111', '4111abc1111111111', 4111111111111111]) {
      await request(app).post(base).send({ userId: 1, creditLimit: 1500, cardNumber }).expect(400);
    }
    const created = await request(app).post(base).send({ userId: 1, creditLimit: 1500, cardNumber: '4111 1111 1111 1111' }).expect(201);
    const id: number = created.body.id;
    assert.equal(created.body.status, 'active');
    assert.equal(created.body.brand, 'visa');
    assert.equal(created.body.last4, '1111');
    assert.equal(created.body.cardNumber, '4111111111111111');
    assert.equal(db.exec('SELECT card_number FROM credit_cards')[0]?.values[0]?.[0], '4111111111111111');
    const detail = await request(app).get(`${base}/${id}`).expect(200);
    assert.equal(detail.body.cardNumber, '4111111111111111');
    const list = await request(app).get(base).expect(200);
    assert.equal(list.body.length, 1);
    assert.equal(list.body[0].cardNumber, '4111111111111111');
    const updated = await request(app).patch(`${base}/${id}`).send({ creditLimit: 2000 }).expect(200);
    assert.equal(updated.body.creditLimit, 2000);
    assert.equal(updated.body.cardNumber, '4111111111111111');
    await request(app).patch(`${base}/${id}`).send({}).expect(400);
    await request(app).patch(`${base}/${id}`).send({ status: 'invalid' }).expect(400);
    await request(app).patch(`${base}/${id}`).send({ status: 'inactive' }).expect(200);
    await request(app).get(base).expect(200, []);
    await request(app).get(`${base}/${id}`).expect(200);
    await request(app).delete(`${base}/${id}`).expect(204, '');
    await request(app).get(`${base}/${id}`).expect(404);
    await request(app).patch(`${base}/${id}`).send({ status: 'active' }).expect(404);
    await request(app).delete(`${base}/${id}`).expect(404);
    assert.equal(db.exec('SELECT COUNT(*) FROM credit_cards')[0]?.values[0]?.[0], 1);
    assert.ok(db.exec('SELECT deleted_at FROM credit_cards')[0]?.values[0]?.[0]);
    await request(app).get(`${base}/abc`).expect(400);
    await request(app).post(base).set('Content-Type', 'application/json').send('{').expect(400);
  } finally {
    db.close();
  }
});

test('identifica marcas y admite distintas longitudes', () => {
  const examples = [
    ['4111111111111111', 'visa'],
    ['5555555555554444', 'mastercard'],
    ['378282246310005', 'american-express'],
    ['6011111111111117', 'discover'],
    ['30569309025904', 'diners-club'],
    ['3530111333300000', 'jcb'],
    ['6759649826438453', 'maestro'],
    ['6200000000000000', 'unionpay']
  ];
  for (const [number, brand] of examples) {
    assert.equal(validateCardNumber(number)?.brand, brand, `Marca esperada: ${brand}`);
  }
  assert.equal(validateCardNumber('4111-1111-1111-1111')?.brand, 'visa');
  assert.equal(validateCardNumber(null), undefined);
  assert.equal(validateCardNumber(''), undefined);
});
