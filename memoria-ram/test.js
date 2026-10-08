const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { sembrar } = require('./seed');
const { procesar } = require('./pipeline');
test('Seed aplica contrapresión y pipeline conserva las filas transformadas', async () => {
  const carpeta = await fs.mkdtemp(path.join(os.tmpdir(), 'lab-ram-'));
  try {
    const entrada = path.join(carpeta, 'big.csv');
    const salida = path.join(carpeta, 'final.txt');
    const resultado = await sembrar(entrada, 10000);
    assert.ok(resultado.pausas > 0);
    await procesar(entrada, salida, () => {});
    assert.equal(await fs.readFile(salida, 'utf8'), (await fs.readFile(entrada, 'utf8')).replace(/,/g, '|'));
    await assert.rejects(procesar(path.join(carpeta, 'ausente.csv'), path.join(carpeta, 'error.txt'), () => {}));
  } finally { await fs.rm(carpeta, { recursive: true, force: true }); }
});
