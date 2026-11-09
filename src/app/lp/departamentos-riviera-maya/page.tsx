import type { Metadata } from 'next';
import PaginaDepartamentos from './_pagina';
import { COPY_ES } from './_copy';

// Landing de pago: DEPARTAMENTOS EN LA RIVIERA MAYA (español). El cuerpo y la
// lógica viven en `_pagina.tsx`, compartidos con la versión inglesa
// (`/lp/condos-riviera-maya`); el texto, en `_copy.ts`.

export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_ES.meta.title,
  description: COPY_ES.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingDepartamentosRivieraMaya() {
  return <PaginaDepartamentos locale="es" />;
}
