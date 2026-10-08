const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');
const FormateadorCSV = require('./etl');
async function procesar(entrada, salida, log = console.log) {
  const medir = () => {
    const m = process.memoryUsage();
    log({ heapMB: +(m.heapUsed / 1048576).toFixed(2), rssMB: +(m.rss / 1048576).toFixed(2), externalMB: +(m.external / 1048576).toFixed(2) });
  };
  medir();
  const timer = setInterval(medir, 500);
  try {
    await pipeline(fs.createReadStream(entrada), new FormateadorCSV(), fs.createWriteStream(salida, { flags: 'wx' }));
    medir();
    log('Procesamiento terminado');
  } finally { clearInterval(timer); }
}
if (require.main === module) procesar(path.join(__dirname, 'big.csv'), path.join(__dirname, 'final.txt'))
  .catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { procesar };
