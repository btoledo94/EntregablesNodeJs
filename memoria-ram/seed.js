const fs = require('node:fs');
const path = require('node:path');
function sembrar(archivo, filas) {
  return new Promise((resolve, reject) => {
    const salida = fs.createWriteStream(archivo, { flags: 'wx' });
    let i = 0;
    let pausas = 0;
    salida.on('error', reject);
    salida.on('finish', () => resolve({ filas: i, pausas, bytes: salida.bytesWritten }));
    function escribirBloque() {
      while (i < filas) {
        const fila = `${i},${(i % 500000) / 100},ACTIVO\n`;
        i++;
        if (!salida.write(fila)) {
          pausas++;
          salida.once('drain', escribirBloque);
          return;
        }
      }
      salida.end();
    }
    escribirBloque();
  });
}
if (require.main === module) {
  const filas = Number(process.argv[2] ?? 1000000);
  if (!Number.isSafeInteger(filas) || filas < 1) throw new Error('Indica una cantidad entera positiva');
  sembrar(path.join(__dirname, 'big.csv'), filas).then(console.log)
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { sembrar };
