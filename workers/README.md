# 1. Workers

Cuenta números primos con worker_threads. Ejemplo propuesto: el PDF no incluye un enunciado específico para este entregable.

Desde esta carpeta:

```powershell
node app.js bloqueante 3000000
node app.js worker 3000000
node --test test.js
```

Ambas variantes deben dar la misma cantidad de primos. En modo bloqueante no se ejecutan los latidos durante el cálculo; con worker el hilo principal puede imprimirlos. Si termina muy rápido aumenta el límite, hasta 20000000. Crear el hilo también tiene costo: no se garantiza que termine antes.

app.js crea el Worker, envía workerData y recibe el mensaje. worker.js ejecuta calculo.js y responde por parentPort.postMessage. Se manejan errores y salidas sin resultado. Es una demostración de una tarea, sin pool.

Para exponer: captura ambas ejecuciones y explica el trabajo de CPU, la comunicación entre hilos y por qué el hilo principal puede seguir ejecutando los latidos.
