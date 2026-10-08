const net = require('node:net');
function solicitar(port = 8080) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ port, host: '127.0.0.1' });
    let respuesta = '';
    socket.setTimeout(7000, () => socket.destroy(new Error('Tiempo agotado')));
    socket.on('connect', () => socket.write('Ping\n'));
    socket.on('data', chunk => { respuesta += chunk; });
    socket.on('end', () => resolve(respuesta.trim()));
    socket.on('error', reject);
  });
}
if (require.main === module) {
  Promise.all(Array.from({ length: 6 }, async (_, i) => console.log(`Petición ${i + 1}: ${await solicitar()}`)))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { solicitar };
