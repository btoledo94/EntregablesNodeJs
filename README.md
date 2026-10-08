# Cinco entregables de Node.js

Cada entregable se guarda en su propia carpeta.

- [Workers](workers/README.md): cálculo en un hilo secundario.
- [API RESTful de tarjetas](tarjetas-credito/README.md): Express, TypeScript y SQLite.
- [Nodos de escalamiento](nodos-escalamiento/README.md): laboratorio 1 del PDF, páginas 2–7.
- [Memoria RAM](memoria-ram/README.md): laboratorio 2 del PDF, páginas 8–13.
- [Colas y prioridad](colas-prioridad/README.md): laboratorio 3 del PDF, páginas 14–19.

Requiere Node.js 20 o superior. Los cuatro ejercicios nuevos usan módulos nativos y no necesitan instalar dependencias. La API conserva su configuración existente.

## Verificar todos los ejercicios

```powershell
node --test workers/test.js nodos-escalamiento/integration.test.js memoria-ram/test.js colas-prioridad/test.js
cd tarjetas-credito
npm install
npm test
npm run build
```

## Entrega

Ejecuta cada ejercicio, guarda capturas reales y revisa su README para preparar la explicación. La API de tarjetas corresponde al segundo entregable según tu confirmación. El ejemplo de Workers es una propuesta con worker_threads: el PDF solo desarrolla los otros tres laboratorios.

Repositorio: https://github.com/btoledo94/EntregablesNodeJs. Las cinco carpetas se entregan juntas. El .gitignore excluye dependencias, bases, archivos masivos y herramientas temporales. No uses tarjetas reales.
