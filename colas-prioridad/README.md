# 5. Colas y prioridad

Laboratorio 3 del PDF, páginas 14–19: tareas con prioridad 1 a 10, sort descendente y setImmediate entre tareas.

Desde esta carpeta:

```powershell
node app.js
node --test test.js
```

Se cargan 5000 reportes de prioridad 1. A los dos segundos llegan tres transacciones VIP de prioridad 10. El log muestra reportes terminados y tareas pendientes al ejecutar cada VIP.

Cada reporte simula aproximadamente 0.6 ms de CPU para mantener pendientes al llegar los VIP. Sin esta adaptación, el JSON.stringify mínimo de la diapositiva puede vaciar la cola antes de los dos segundos. La duración depende del equipo.

queue.js contiene add, length, next y start. Tareas de igual prioridad conservan FIFO. El flag evita loops simultáneos; start devuelve una promesa de finalización o error. Si agregas tareas después de vaciar, vuelve a llamar start.

setImmediate cede el hilo después de cada tarea; la prioridad adelanta pendientes y no interrumpe JavaScript que ya se ejecuta. No crea otro hilo. La cola vive en memoria y ordenar en cada inserción sirve para este laboratorio pequeño. No garantiza equidad ante tráfico urgente continuo.

Para exponer: captura VIP adelantando reportes pendientes y explica sort, shift, isProcessing y setImmediate. La prueba comprueba una inserción urgente durante el procesamiento, FIFO, ausencia de loops duplicados y reinicio.
