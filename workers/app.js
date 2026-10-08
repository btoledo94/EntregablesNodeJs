const { Worker } = require('node:worker_threads');
const { performance } = require('node:perf_hooks');
const path = require('node:path');
const { contarPrimos } = require('./calculo');

function ejecutarWorker(limite) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker.js'), { workerData: { limite } });
    let recibido = false;
    worker.once('message', resultado => { recibido = true; resolve(resultado); });
    worker.once('error', reject);
    worker.once('exit', code => {
      if (code !== 0 || !recibido) reject(new Error(`Worker terminó sin resultado (código ${code})`));
    });
  });
}

async function main() {
  const modo = process.argv[2] ?? 'worker';
  const limite = Number(process.argv[3] ?? 3000000);
  if (!['worker', 'bloqueante'].includes(modo) || !Number.isSafeInteger(limite) || limite < 2 || limite > 20000000) {
    throw new Error('Uso: node app.js worker|bloqueante [límite entero entre 2 y 20000000]');
  }
  const inicio = performance.now();
  let latidos = 0;
  const reloj = setInterval(() => console.log(`Hilo principal disponible: latido ${++latidos}`), 100);
  try {
    const total = modo === 'worker' ? await ejecutarWorker(limite) : contarPrimos(limite);
    console.log({ modo, limite, primos: total, milisegundos: Math.round(performance.now() - inicio), latidos });
  } finally { clearInterval(reloj); }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { ejecutarWorker };
