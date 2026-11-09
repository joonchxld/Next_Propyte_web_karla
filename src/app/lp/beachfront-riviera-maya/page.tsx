// @lp-idioma en
// @lp-par frente-al-mar
import type { Metadata } from 'next';
import PaginaFrenteMar from '../frente-al-mar/_pagina';
import { COPY } from '../frente-al-mar/_copy';

// ============================================================
// Landing frente al mar — INGLÉS. Tráfico pagado de Estados Unidos y Canadá.
//
// Es la MISMA página que `/lp/frente-al-mar` con el diccionario `COPY.en`; el
// idioma va en el slug porque `/lp/*` queda fuera de `[locale]` (ver
// `homes-riviera-maya/page.tsx`). Lead source propia: `lp_frente_mar_en`.
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

export default function LandingBeachfrontRivieraMaya() {
  return <PaginaFrenteMar locale="en" />;
}
