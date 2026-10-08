const { performance } = require('node:perf_hooks');
const PriorityQueue = require('./queue');
let normales = 0;
const inicio = performance.now();
const q = new PriorityQueue(tarea => {
  // Un fragmento corto de CPU hace visible el adelanto de los VIP a los 2 s.
  const fin = performance.now() + 0.6;
  while (performance.now() < fin) JSON.stringify(tarea.data);
  if (tarea.priority === 10) console.log(`[VIP] ${tarea.id}, normales completadas: ${normales}, pendientes: ${q.length}`);
  else { normales++; if (normales % 1000 === 0) console.log(`Reportes: ${normales}/5000`); }
});
console.log('Cargando 5000 reportes de prioridad 1');
for (let i = 0; i < 5000; i++) q.add(`Rep-${i}`, { mock: true }, 1);
const timer = setTimeout(() => {
  console.log('Llegan 3 transacciones VIP de prioridad 10');
  for (const id of ['A', 'B', 'C']) q.add(`Transf-${id}`, { user: 'VIP' }, 10);
  q.start().catch(error => { console.error(error); process.exitCode = 1; });
}, 2000);
q.start().then(() => console.log(`Cola vaciada en ${Math.round(performance.now() - inicio)} ms`))
  .catch(error => { clearTimeout(timer); console.error(error); process.exitCode = 1; });
