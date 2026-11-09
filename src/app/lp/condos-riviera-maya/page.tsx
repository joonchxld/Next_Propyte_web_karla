// @lp-idioma en
// @lp-par departamentos-riviera-maya
import type { Metadata } from 'next';
import CorrigeLang from '../_components/v2/CorrigeLang';
import PaginaDepartamentos from '../departamentos-riviera-maya/_pagina';
import { COPY_EN } from '../departamentos-riviera-maya/_copy';

// Landing de condos — INGLÉS. Tráfico pagado de Estados Unidos y Canadá.
// Es la misma página que la española (`departamentos-riviera-maya`) con el
// diccionario `COPY_EN`; vive fuera de `[locale]` por la misma razón que
// `homes-riviera-maya` (el middleware salta `/lp/*`). Precios sin convertir:
// cada monto va en su moneda.

// Mismo ISR que la española: comparten el dato.
export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_EN.meta.title,
  description: COPY_EN.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingCondosRivieraMaya() {
  return (
    <>
      <CorrigeLang locale="en" />
      <PaginaDepartamentos locale="en" />
    </>
  );
}
