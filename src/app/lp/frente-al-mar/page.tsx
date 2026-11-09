import type { Metadata } from 'next';
import PaginaFrenteMar from './_pagina';
import { COPY } from './_copy';

// ============================================================
// Landing de pago: PROPIEDADES FRENTE AL MAR — ESPAÑOL (México).
//
// El cuerpo entero vive en `_pagina.tsx`, compartido con la variante en inglés
// de `/lp/beachfront-riviera-maya`. Aquí queda solo lo que Next exige en el
// archivo de la ruta: `metadata` y `revalidate`. Maquetación añadida en este
// archivo quedaría fuera de la versión en inglés sin que nadie se entere.
// ============================================================

export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY.es.meta.title,
  description: COPY.es.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingFrenteAlMar() {
  return <PaginaFrenteMar locale="es" />;
}
