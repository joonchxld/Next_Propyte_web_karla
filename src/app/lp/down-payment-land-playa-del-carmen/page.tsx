// @lp-idioma en
// @lp-par enganche-terrenos-playa-del-carmen
import type { Metadata } from 'next';
import CorrigeLang from '../_components/v2/CorrigeLang';
import PaginaEnganche from '../enganche-terrenos-playa-del-carmen/_pagina';
import { COPY_EN } from '../enganche-terrenos-playa-del-carmen/_copy';

// ============================================================
// Landing de ENGANCHE — INGLÉS. Tráfico pagado de Estados Unidos y Canadá.
//
// Es la MISMA página que `/lp/enganche-terrenos-playa-del-carmen`: mismo
// componente, mismo inventario, mismo formulario. Lo único propio es el
// diccionario `COPY_EN`. Si alguien arregla el formulario, se arregla en los
// dos idiomas el mismo día.
//
// El idioma va en el SLUG y no en `/en/lp/...` por la misma razón que
// `/lp/homes-riviera-maya`: `middleware.ts` deja `/lp/*` fuera de `[locale]`
// para que las landings de pago no hereden el chrome del sitio.
//
// ═══ LO QUE ESTA PÁGINA NO HACE ═══
//
//   · NO convierte pesos a dólares. Todo va como «$202,176 MXN». Un tipo de
//     cambio aquí es una cifra que el asesor desmiente en la primera llamada.
//   · NO convierte m² a pies cuadrados, por lo mismo.
//   · NO explica el fideicomiso para extranjeros en zona restringida: es tema
//     de la llamada, no de una página cuyo trabajo es capturar el contacto.
//   · NO declara `hreflang` contra la española: las dos son `noindex`.
//
// Lead: `source: 'lp_lotes_pdc_en'` (Zoho), GA4 `form_type: 'lp_enganche_pdc_en'`.
// ============================================================

// Mismo ISR que la española: comparten el dato.
export const revalidate = 300;

export const metadata: Metadata = {
  title: COPY_EN.meta.title,
  description: COPY_EN.meta.description,
  robots: { index: false, follow: true },
};

export default function LandingDownPaymentLandPlayaDelCarmen() {
  return (
    <>
      <CorrigeLang locale="en" />
      <PaginaEnganche locale="en" />
    </>
  );
}
