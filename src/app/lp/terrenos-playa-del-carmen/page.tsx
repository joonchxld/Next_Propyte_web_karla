import type { Metadata } from 'next';
import PaginaTerrenos from './_pagina';
import { COPY_ES } from './_copy';

// ============================================================
// Landing corta de terrenos — ESPAÑOL. Tráfico de México.
//
// El cuerpo vive en `_pagina.tsx`, compartido con la variante en inglés de
// `/lp/land-playa-del-carmen`. Aquí queda solo lo que Next exige que viva en el
// archivo de la ruta: `metadata` y `revalidate`.
// ============================================================

export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_ES.meta.title,
  description: COPY_ES.meta.description,
  // El layout de /lp ya declara noindex; se repite aquí para que la variante no
  // dependa de que nadie toque el layout compartido.
  robots: { index: false, follow: true },
};

export default function LandingTerrenosPlayaDelCarmen() {
  return <PaginaTerrenos locale="es" />;
}
