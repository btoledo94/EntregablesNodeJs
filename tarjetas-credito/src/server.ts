import { createApp } from './app';

const port = Number(process.env.PORT ?? 3000);
createApp().then(({ app }) => {
  app.listen(port, () => console.log(`API disponible en http://localhost:${port}/api/v1/credit-cards`));
}).catch((error: unknown) => {
  console.error('No se pudo iniciar la API:', error);
  process.exitCode = 1;
});
