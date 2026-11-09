# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Compradores e inversionistas que llegan desde anuncios pagados (Google Ads, Meta) a una landing de inventario: mexicanos (español) y de Estados Unidos/Canadá (inglés, rutas `/lp/*` en inglés). Mayoría en móvil, tráfico frío: no conocen Propyte.
- Su trabajo en la página: comprobar que el inventario existe y cuánto cuesta, filtrar por zona/presupuesto y dejar sus datos (o escribir por WhatsApp) para recibir la información completa.
- Del otro lado: asesores de Propyte que reciben el lead en Zoho CRM con la fuente (`lp_*`) y lo contactan por WhatsApp.

## Product Purpose

Propyte es una inmobiliaria (broker) de la Riviera Maya y Mérida. Las landings `/lp/*` existen para convertir tráfico pagado en leads calificados. Éxito = envíos del formulario (o clics a WhatsApp) con ubicación y presupuesto, sin rebote inmediato.

## Positioning

Inventario real publicado desde el Propyte Hub: cada precio, enganche y disponibilidad sale del sistema y cambia solo cuando cambia el inventario. Ninguna cifra se inventa; donde el desarrollador no declaró un dato se dice «Confirmar». Propyte no es la desarrolladora y no nombra desarrollos ni desarrolladores en pauta pagada.

## Operating Context

- Datos en vivo de `v_units` (Supabase del Hub) con ISR de 5 minutos; fotos subidas por cada desarrollador sin dirección de arte (calidad variable).
- Formulario → Zoho CRM con fuente por landing; WhatsApp como canal alterno.
- Despliegue: merge a `main` → Hostinger compila en el VPS.
- 9 landings en español con su par en inglés (casas PDC, casas RM, casas Mérida, departamentos RM, terrenos RM, frente al mar, lotes PDC, terrenos PDC, enganche terrenos PDC).

## Capabilities and Constraints

- Next.js 16 App Router; `/lp/*` vive fuera de `[locale]` (sin next-intl); copy por diccionario `es`/`en`.
- Cero enlaces de salida salvo legales; formulario visible desde el primer pliegue (una landing con compuerta de calificación gastó $991.40 MXN sin envíos).
- Sin urgencia inventada (no contadores, no «quedan 2»). Afirmaciones legales solo como proceso («revisamos…»), nunca garantía.
- Los formularios deben filtrar (ubicación, presupuesto, etc.) con conteos reales.
- Google Maps sin facturación: mapas con Leaflet/OSM.

## Brand Commitments

- Nombre Propyte, logo existente. Voz: concreta, verificable, sin superlativos («luxury», «paraíso», «dream home» quedan fuera).
- Referencias que el usuario hizo vinculantes para el sitio: Élan Court, OnEarth, Capsule, aevum, y la v3 del home (Archivo + Hanken Grotesk, foto a sangre, franja de cifras en negro, carrusel, filetes).
- Rechazado explícitamente por verse «IA»: eyebrows en mayúsculas sobre cada bloque, hero partido 50/50 con panel de formulario oscuro, cuadrículas de tarjetas iguales, pasos 01/02/03, 3 testimonios, FAQ en acordeón como relleno.
- Sí quiere: iconos grandes con las características sobre/junto a las fotos; un gancho concreto arriba con dato verificable.

## Evidence on Hand

- Inventario y fotos del Hub (por unidad y por desarrollo), logo.
- No hay fotos propias del equipo ni de la oficina, ni testimonios publicables: no fabricarlos.

## Product Principles

1. El dato es el argumento: toda cifra visible se deriva del inventario en vivo.
2. Convertir sin fricción: formulario y WhatsApp a la mano en todo momento, sin salidas.
3. Una familia, no un kit: las landings comparten sistema de marca Propyte y cada una tiene su idea visual alrededor de la foto y el dato.
4. Honestidad antes que persuasión: un hueco declarado vale más que un número que el asesor tenga que desmentir.
