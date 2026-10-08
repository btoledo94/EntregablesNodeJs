const { test } = require('node:test');
const assert = require('node:assert/strict');
const PriorityQueue = require('./queue');
test('VIP insertado durante el proceso adelanta pendientes y conserva FIFO', async () => {
  const orden = [];
  const q = new PriorityQueue(t => {
    orden.push(t.id);
    if (t.id === 'normal-1') setImmediate(() => { q.add('VIP-A', {}, 10); q.add('VIP-B', {}, 10); });
  });
  q.add('normal-1', {}); q.add('normal-2', {}); q.add('normal-3', {});
  const fin = q.start();
  assert.equal(q.start(), fin);
  await fin;
  assert.deepEqual(orden, ['normal-1', 'VIP-A', 'VIP-B', 'normal-2', 'normal-3']);
  assert.equal(q.isProcessing, false);
  q.add('reinicio', {}); await q.start();
  assert.equal(orden.at(-1), 'reinicio');
});
