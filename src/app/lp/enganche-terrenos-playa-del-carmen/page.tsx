import type { Metadata } from 'next';
import PaginaEnganche from './_pagina';
import { COPY_ES } from './_copy';

// ============================================================
// Landing de ENGANCHE (variante C de lotes de Playa del Carmen) — ESPAÑOL.
// Tráfico de México.
//
// El cuerpo entero vive en `_pagina.tsx`, compartido con la variante en inglés
// de `/lp/down-payment-land-playa-del-carmen`; la cabecera con las decisiones de
// la variante (la apuesta del enganche, las cuatro reglas de dato) está allí.
// Aquí queda solo lo que Next exige que viva en el archivo de la ruta:
// `metadata` y `revalidate`. Añadir maquetación en este archivo la deja fuera
// de la versión en inglés sin que nadie se entere.
// ============================================================

export const revalidate = 300;

export const metadata: Metadata = {
  // Sin «| Propyte» al final: el layout raíz ya aplica `template: '%s | Propyte'`
  // y el título salía duplicado en producción («... | Propyte | Propyte»).
  title: COPY_ES.meta.title,
  description: COPY_ES.meta.description,
  // El layout de /lp ya declara noindex; se repite aquí para que la variante no
  // dependa de que nadie toque el layout compartido.
  robots: { index: false, follow: true },
};

export default function LandingEngancheTerrenos() {
  return <PaginaEnganche locale="es" />;
}
