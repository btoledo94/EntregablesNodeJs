# 3. Nodos de escalamiento

Tres procesos TCP y un balanceador de capa 4 con Round-Robin por conexión.

Abre cuatro terminales en esta carpeta y ejecuta un comando en cada una:

```powershell
node node-server.js 3001
node node-server.js 3002
node node-server.js 3003
node balancer.js
```

En una quinta terminal:

```powershell
node test.js
```

Las seis conexiones se reparten dos por nodo; las respuestas pueden llegar en distinto orden. El proxy escucha en 127.0.0.1:8080 y conecta flujos con pipe en ambas direcciones. Los nodos responden tras 500 ms; setTimeout simula latencia, no carga de CPU. El protocolo es TCP de texto: utiliza el cliente incluido.

Detén un nodo con Ctrl+C y repite el cliente: algunas peticiones recibirán error y el proxy seguirá atendiendo las demás. Como en el código del PDF, no hay detección de salud ni reintentos: el nodo caído sigue entrando en la rotación. Detén todas las terminales con Ctrl+C al terminar.

Prueba automática con puertos libres y cierre de servidores:

```powershell
node --test integration.test.js
```

Para exponer: captura los PID distintos, las seis respuestas y el log del proxy. Explica el contador módulo cantidad de nodos, el aislamiento de procesos y el manejo del error cuando un puerto no responde.
