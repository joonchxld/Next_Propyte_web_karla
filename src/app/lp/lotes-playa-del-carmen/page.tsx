import type { Metadata } from 'next';
import PaginaLotes from './_pagina';
import { PAGINA } from './_copy';

// ============================================================
// Landing de lotes — ESPAÑOL. Tráfico de México.
//
// El cuerpo entero vive en `_pagina.tsx`, compartido con la variante en inglés
// de `/lp/lots-playa-del-carmen`. Aquí queda solo lo que Next exige que viva en
// el archivo de la ruta: `metadata` y `revalidate`. Añadir maquetación en este
// archivo la deja fuera de la versión en inglés sin que nadie se entere.
// ============================================================

// ISR: el inventario cambia sin deploy. 5 min es suficientemente fresco para que
// un anuncio no cite un precio que la página ya no muestra, y evita pegarle a
// Supabase en cada impresión pagada.
export const revalidate = 300;

// El título y la descripción hablan en PLURAL a propósito.
//
// Las cinco keywords que compra esta campaña son plurales —«terrenos
// residenciales», «lotes residenciales», «terrenos en playa del carmen»— y
// todas traían `post_click_quality_score = BELOW_AVERAGE`. La página describía
// un solo lote, así que Google leía una ficha de producto único contra una
// consulta de exploración. El inventario real que se puede ofrecer aquí son
// varios lotes publicados en Playa del Carmen, y el texto ahora lo dice.
export const metadata: Metadata = {
  title: PAGINA.es.meta.title,
  description: PAGINA.es.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingLotesPlayaDelCarmen() {
  return <PaginaLotes locale="es" />;
}
