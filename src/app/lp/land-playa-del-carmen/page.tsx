// @lp-idioma en
// @lp-par terrenos-playa-del-carmen
import type { Metadata } from 'next';
import CorrigeLang from '../_components/v2/CorrigeLang';
import PaginaTerrenos from '../terrenos-playa-del-carmen/_pagina';
import { COPY_EN } from '../terrenos-playa-del-carmen/_copy';

// ============================================================
// Landing corta de terrenos — INGLÉS. Tráfico pagado de EE. UU. y Canadá.
//
// Es la MISMA página que `/lp/terrenos-playa-del-carmen`, con el diccionario
// `COPY_EN`. El idioma va en el slug porque `middleware.ts` deja `/lp/*` fuera
// de `[locale]` (ver `homes-riviera-maya/page.tsx`).
//
// Lo que NO hace: no convierte precios a dólares (todo sigue en MXN) y no
// declara `hreflang` (las dos son `noindex`).
// ============================================================

// Mismo ISR que la española: comparten el dato.
export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_EN.meta.title,
  description: COPY_EN.meta.description,
  robots: { index: false, follow: true },
};

export default function LandingLandPlayaDelCarmen() {
  return (
    <>
      <CorrigeLang locale="en" />
      <PaginaTerrenos locale="en" />
    </>
  );
}
