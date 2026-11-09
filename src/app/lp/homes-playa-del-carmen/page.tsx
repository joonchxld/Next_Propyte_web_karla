// @lp-idioma en
// @lp-par casas-playa-del-carmen
import type { Metadata } from 'next';
import CorrigeLang from '../_components/v2/CorrigeLang';
import PaginaCasasPlayaDelCarmen from '../casas-playa-del-carmen/_pagina';
import { COPY_EN } from '../casas-playa-del-carmen/_copy';

// Landing de casas en Playa del Carmen — INGLÉS (tráfico de EE. UU. y Canadá).
// Es la MISMA página que la española con el diccionario `COPY_EN`; el idioma
// va en el slug porque `/lp/*` queda fuera de `[locale]` (ver
// `homes-riviera-maya/page.tsx`). Los precios no se convierten: cada uno sale
// en su moneda con el código impreso. Fuente de lead: `lp_casas_pdc_en`.

// Mismo ISR que la española: comparten el dato.
export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_EN.meta.title,
  description: COPY_EN.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingHomesPlayaDelCarmen() {
  return (
    <>
      <CorrigeLang locale="en" />
      <PaginaCasasPlayaDelCarmen locale="en" />
    </>
  );
}
