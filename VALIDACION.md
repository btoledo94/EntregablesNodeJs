# Verificación realizada el 8 de octubre de 2026

- Pruebas automáticas de los cuatro ejercicios nuevos: 4 aprobadas.
- API existente: 2 pruebas aprobadas y compilación TypeScript correcta.
- Workers: ambas variantes contaron 216816 primos hasta 3000000. El worker permitió 33 latidos del hilo principal; la variante bloqueante, 0. Son resultados de esta ejecución, dependientes del equipo.
- Escalamiento: la prueba verificó A, B, C, A, B, C; después cerró A, recibió el error correspondiente y comprobó que B seguía respondiendo. La prueba utiliza servidores TCP en el proceso de pruebas; para mostrar procesos separados ejecuta las terminales del README.
- RAM: se generaron y transformaron 1000000 de filas, 21546890 bytes, con 1314 pausas por contrapresión. Heap observado: 3.47–5.11 MB; RSS observado: 26.39–45.25 MB. Son muestras, no máximos absolutos ni una prueba con gigabytes. Los dos archivos quedaron en memoria-ram, excluidos de Git; renómbralos o elimínalos manualmente antes de repetir.
- Colas: los VIP A, B y C se ejecutaron tras 2908 reportes normales, antes de los 2092 restantes. Se completaron los 5000 reportes.

Cada carpeta contiene comandos de ejecución y puntos para la exposición. Las capturas de pantalla de la entrega deben obtenerse ejecutando las demostraciones. Repositorio de entrega: https://github.com/btoledo94/EntregablesNodeJs.
