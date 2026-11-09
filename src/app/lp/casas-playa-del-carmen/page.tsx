import type { Metadata } from 'next';
import PaginaCasasPlayaDelCarmen from './_pagina';
import { COPY_ES } from './_copy';

// Landing de casas en Playa del Carmen — ESPAÑOL. El cuerpo vive en
// `_pagina.tsx`, compartido con `/lp/homes-playa-del-carmen`. Aquí queda solo
// lo que Next exige en el archivo de la ruta: `metadata` y `revalidate`.

export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_ES.meta.title,
  description: COPY_ES.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingCasasPlayaDelCarmen() {
  return <PaginaCasasPlayaDelCarmen locale="es" />;
}
