// @lp-idioma en
// @lp-par terrenos-riviera-maya
import type { Metadata } from 'next';
import PaginaTerrenos from '../terrenos-riviera-maya/_pagina';
import { COPY } from '../terrenos-riviera-maya/_copy';

// ============================================================
// Landing de terrenos — INGLÉS. Tráfico pagado de Estados Unidos y Canadá.
//
// Es la MISMA página que `/lp/terrenos-riviera-maya` con el diccionario
// `COPY.en`; el idioma va en el slug porque `/lp/*` queda fuera de `[locale]`
// (ver `homes-riviera-maya/page.tsx`). Lead source propia: `lp_terrenos_rm_en`.
//
// No convierte precios a dólares (cada precio sale en la moneda del dato) ni
// declara `hreflang`: las dos versiones son `noindex`.
// ============================================================

// Mismo ISR que la española: comparten el dato.
export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY.en.meta.title,
  description: COPY.en.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingLandRivieraMaya() {
  return <PaginaTerrenos locale="en" />;
}
