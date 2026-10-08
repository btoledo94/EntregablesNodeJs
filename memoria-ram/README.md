# 4. Memoria RAM

Genera un CSV respetando write()/drain y transforma con ReadStream → Transform → WriteStream mediante pipeline.

Desde esta carpeta:

```powershell
node seed.js 1000000
node pipeline.js
node --test test.js
```

Se crean big.csv y final.txt aquí. El transformador cambia todas las comas por | y conserva UTF-8 dividido entre chunks; es la sustitución del laboratorio, no un analizador general de CSV entrecomillado.

El generador informa filas, bytes y pausas por contrapresión. Para diez millones de filas ejecuta `node seed.js 10000000`. El tamaño depende de la longitud de cada fila: diez millones no garantizan 1 GB. Por defecto se genera un millón para empezar con un volumen pequeño.

Los archivos se crean sin sobrescribir existentes. Antes de repetir, renombra o elimina manualmente big.csv y final.txt. Están excluidos de Git.

El pipeline muestra heapMB, rssMB y externalMB al inicio, cada 500 ms y al terminar. Compara capturas con volúmenes distintos. Se busca memoria acotada respecto al archivo; no se garantiza una cifra exacta de 30 MB. El heap es parte de la RAM del proceso y su límite depende del entorno y configuración de V8. No se intenta agotar la RAM.

Para exponer: explica por qué no se usa readFile, qué significa write() false, para qué sirve drain y cómo pipeline propaga errores y cierra streams. La prueba verifica el contenido transformado, contrapresión y entrada ausente; no sustituye una medición con archivos de gigabytes.
