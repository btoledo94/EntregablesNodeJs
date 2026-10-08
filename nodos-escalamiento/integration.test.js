const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { crearNodo } = require('./node-server');
const { crearBalanceador } = require('./balancer');
const { solicitar } = require('./test');
test('Round-robin y supervivencia del proxy al caer un nodo', async () => {
  const nodos = ['A', 'B', 'C'].map(nombre => crearNodo(nombre, 1));
  let proxy;
  try {
    for (const nodo of nodos) { nodo.listen(0, '127.0.0.1'); await once(nodo, 'listening'); }
    proxy = crearBalanceador(nodos.map(n => n.address().port), () => {});
    proxy.listen(0, '127.0.0.1'); await once(proxy, 'listening');
    const port = proxy.address().port;
    const respuestas = [];
    for (let i = 0; i < 6; i++) respuestas.push(await solicitar(port));
    assert.deepEqual(respuestas, ['A', 'B', 'C', 'A', 'B', 'C'].map(n => `Respuesta desde ${n}`));
    await new Promise(resolve => nodos[0].close(resolve));
    assert.match(await solicitar(port), /no disponible/);
    assert.equal(await solicitar(port), 'Respuesta desde B');
  } finally {
    await Promise.all([...nodos, proxy].filter(s => s?.listening).map(s => new Promise(resolve => s.close(resolve))));
  }
});
