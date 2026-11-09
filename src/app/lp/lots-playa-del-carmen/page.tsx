// @lp-idioma en
// @lp-par lotes-playa-del-carmen
import type { Metadata } from 'next';
import CorrigeLang from '../_components/v2/CorrigeLang';
import PaginaLotes from '../lotes-playa-del-carmen/_pagina';
import { PAGINA } from '../lotes-playa-del-carmen/_copy';

// ============================================================
// Landing de lotes — INGLÉS. Tráfico pagado de EE. UU. y Canadá.
//
// Es la MISMA página que `/lp/lotes-playa-del-carmen`, con el diccionario en
// inglés de `_copy.ts`. El idioma va en el slug porque `middleware.ts` deja
// `/lp/*` fuera de `[locale]` (ver `homes-riviera-maya/page.tsx`).
//
// Lo que NO hace: no convierte precios a dólares (todo sigue en MXN y las
// superficies en m²) y no declara `hreflang` (las dos son `noindex`).
// ============================================================

// Mismo ISR que la española: comparten el dato.
export const revalidate = 300;

export const metadata: Metadata = {
  title: PAGINA.en.meta.title,
  description: PAGINA.en.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingLotsPlayaDelCarmen() {
  return (
    <>
      <CorrigeLang locale="en" />
      <PaginaLotes locale="en" />
    </>
  );
}
