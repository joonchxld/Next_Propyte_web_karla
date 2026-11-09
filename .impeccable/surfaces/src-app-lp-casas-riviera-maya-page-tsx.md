---
version: 1
slug: "src-app-lp-casas-riviera-maya-page-tsx"
primary_target: "src/app/lp/casas-riviera-maya/page.tsx"
related_targets: []
---

Scope: /lp/casas-riviera-maya y su par en inglés /lp/homes-riviera-maya. Modo: Persuade. Piloto del sistema de familia para las 9 landings.
Audiencia: comprador frío desde Ads, mayoría móvil. Acción: dejar datos para recibir el dossier o escribir por WhatsApp. Prueba: inventario real del Hub (precio, enganche, entrega). Restricciones: PRODUCT.md (sin salidas, form visible pronto, sin urgencia inventada, sin nombres de desarrollo).

## Direction contract

THESIS: Monografía de arquitectura: cada casa es una lámina a sangre con su columna de datos; la página es el libro del inventario. Rechaza el hero partido con panel oscuro y la cuadrícula de tarjetas iguales.

OWN-WORLD: Papel blanco puro, tinta #0b0b0c, filetes de 1px, cero radio. Una sola franja negra (colofón) con cifras vivas. Azul de plano #1d3f73 solo para estado y selección. Archivo semicondensado 600 para titulares y precios; Hanken Grotesk para texto y pies, en caja normal (sin versalitas espaciadas). Iconos Lucide grandes, trazo 1.5, en la tabla de datos.

STORY: El visitante ve una casa real a sangre con su precio, entiende cuántas hay y en qué ciudad (colofón), recorre las láminas, elige una y pide la ficha; el formulario ya la trae elegida.

FIRST VIEWPORT: Foto a sangre de la casa de entrada (100vw × ~84svh), titular blanco abajo-izquierda en dos líneas hasta 6rem: «Casas en la Riviera Maya / desde $X». Hoja blanca de solicitud (400px) anclada a la derecha sobre la foto, con nombre/WhatsApp/correo visibles, que baja hasta montarse sobre la franja negra. Franja negra a todo lo ancho bajo la foto: filtros por ciudad con conteo + rango + enganche mínimo. Móvil: foto 58svh con titular, franja, hoja de solicitud inmediatamente después.

FORM: Monografía de arquitectura, candidato 1 de mi lista (IMPECCABLE’S PICK elegido por el usuario). seed:5f7cca8c525bf049

SIGNATURE: Tocar una ciudad en el colofón filtra las láminas y su conteo cambia en el mismo lugar; «Solicitar ficha técnica» en una lámina lleva al formulario de cierre con esa casa elegida. Motion: la foto del hero asienta de 1.04 a 1 al cargar; las láminas aparecen con un barrido de clip-path una vez.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
