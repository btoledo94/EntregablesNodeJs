class PriorityQueue {
  constructor(procesar = tarea => JSON.stringify(tarea.data)) {
    this.tareas = [];
    this.isProcessing = false;
    this.procesar = procesar;
  }
  add(id, data, priority = 1) {
    if (!Number.isInteger(priority) || priority < 1 || priority > 10) throw new Error('Prioridad entre 1 y 10');
    this.tareas.push({ id, data, priority });
    // El sort estable mantiene FIFO entre tareas de igual prioridad.
    this.tareas.sort((a, b) => b.priority - a.priority);
  }
  get length() { return this.tareas.length; }
  next() { return this.tareas.shift(); }
  start() {
    if (this.isProcessing) return this.finalizacion;
    this.isProcessing = true;
    this.finalizacion = new Promise((resolve, reject) => {
      const loop = () => {
        if (!this.length) { this.isProcessing = false; resolve(); return; }
        try { this.procesar(this.next()); }
        catch (error) { this.isProcessing = false; reject(error); return; }
        // Cede el hilo después de cada tarea; no crea otro hilo.
        setImmediate(loop);
      };
      setImmediate(loop);
    });
    return this.finalizacion;
  }
}
module.exports = PriorityQueue;
