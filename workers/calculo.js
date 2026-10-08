// El mismo cálculo permite comparar el hilo principal con un worker.
function contarPrimos(limite) {
  let total = 0;
  for (let n = 2; n <= limite; n++) {
    let primo = true;
    for (let divisor = 2; divisor * divisor <= n; divisor++) {
      if (n % divisor === 0) { primo = false; break; }
    }
    if (primo) total++;
  }
  return total;
}
module.exports = { contarPrimos };
