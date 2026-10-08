const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarWorker } = require('./app');
test('El worker devuelve la cantidad conocida de primos hasta 100', async () => {
  assert.equal(await ejecutarWorker(100), 25);
});
