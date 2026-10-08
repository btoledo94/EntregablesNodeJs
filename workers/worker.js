const { parentPort, workerData } = require('node:worker_threads');
const { contarPrimos } = require('./calculo');
parentPort.postMessage(contarPrimos(workerData.limite));
