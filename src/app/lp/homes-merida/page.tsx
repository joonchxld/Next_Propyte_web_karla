// @lp-idioma en
// @lp-par casas-merida
import type { Metadata } from 'next';
import CorrigeLang from '../_components/v2/CorrigeLang';
import PaginaCasasMerida from '../casas-merida/_pagina';
import { COPY_EN } from '../casas-merida/_copy';

// Landing de casas en Mérida — INGLÉS (tráfico de EE. UU. y Canadá). Es la
// MISMA página que la española con el diccionario `COPY_EN`; el idioma va en
// el slug porque `/lp/*` queda fuera de `[locale]`.
//
// DECISIÓN: sin el gancho de crédito Infonavit/Fovissste. Son créditos de
// vivienda del gobierno mexicano que un comprador extranjero no puede usar ni
// conoce; en inglés el titular es neutro (casas en Mérida, Yucatán), no se
// construye el filtro de crédito y no se pintan sellos de crédito. Detalle en
// `casas-merida/_copy.ts`. Fuente de lead: `lp_casas_merida_en`.

// Mismo ISR que la española: comparten el dato.
export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_EN.meta.title,
  description: COPY_EN.meta.description,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LandingHomesMerida() {
  return (
    <>
      <CorrigeLang locale="en" />
      <PaginaCasasMerida locale="en" />
    </>
  );
}
