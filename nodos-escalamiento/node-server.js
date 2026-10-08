const net = require('node:net');
function crearNodo(nombre, demora = 500) {
  return net.createServer(socket => {
    socket.on('error', () => {});
    socket.resume();
    // Simula latencia; setTimeout no representa trabajo intensivo de CPU.
    const timer = setTimeout(() => socket.end(`Respuesta desde ${nombre}\n`), demora);
    socket.once('close', () => clearTimeout(timer));
  });
}
if (require.main === module) {
  const port = Number(process.argv[2] ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Puerto inválido');
  const server = crearNodo(`Nodo-${port} (PID ${process.pid})`);
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Nodo-${port} escuchando`));
}
module.exports = { crearNodo };
