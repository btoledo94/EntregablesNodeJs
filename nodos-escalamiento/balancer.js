const net = require('node:net');
function crearBalanceador(puertos, log = console.log) {
  let indice = 0;
  return net.createServer(client => {
    const port = puertos[indice];
    indice = (indice + 1) % puertos.length;
    log(`Enrutando a ${port}`);
    const destino = net.createConnection({ port, host: '127.0.0.1' });
    destino.setTimeout(5000, () => destino.destroy(new Error('Tiempo agotado')));
    client.on('error', () => destino.destroy());
    client.once('close', () => destino.destroy());
    destino.on('error', error => {
      log(`Nodo ${port} no disponible: ${error.message}`);
      client.unpipe(destino);
      client.resume();
      if (!client.destroyed) client.end('Error: nodo no disponible\n');
    });
    // Proxy de capa 4: no interpreta HTTP y aplica contrapresión.
    client.pipe(destino);
    destino.pipe(client);
  });
}
if (require.main === module) {
  const server = crearBalanceador([3001, 3002, 3003]);
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(8080, '127.0.0.1', () => console.log('Balanceador TCP en 8080'));
}
module.exports = { crearBalanceador };
