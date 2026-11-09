import { TIPOS_CASA, getInventario, enIdioma } from '@/lib/supabase/lp-inventario';
import { FALLBACK_WHATSAPP } from '@/lib/site-contact';
import { dinero } from '../_components/format';
import type { LocaleLp } from '../_components/v2/i18n';
import FaqAcordeon from '../_components/v2/FaqAcordeon';
import BarraMovil from '../_components/v2/BarraMovil';
import PieLegal from '../_components/v2/PieLegal';
import { FAQ_COMPRA_Y_FINANCIAMIENTO, FAQ_COMPRA_Y_FINANCIAMIENTO_EN } from '../_components/v2/faqs';
import { filtroCredito, filtroPresupuesto, filtroRecamaras, filtros } from '../_components/v2/filtros';
import { ubicacionCorta } from '../_components/v2/util';
import Catalogo from './_components/Catalogo';
import { COPY } from './_copy';
import '../_components/v2/tokens.css';
import '../_components/v2/marca.css';
import './lpme-theme.css';

// ============================================================
// Landing de pago: CASAS EN MÉRIDA (segunda versión, 30-oct-2026).
//
// Lógica propia, distinta del resto de la familia: EL DOSSIER. El Hub publica
// hoy una sola casa en Mérida, y la página es su ficha completa en una vista:
// galería fija a la izquierda; precio, datos y formulario a la derecha.
// Después, todas las fotos en mosaico y las preguntas. Si entran más casas,
// aparecen como filas debajo del mosaico y se pueden elegir para el
// formulario; el dossier sigue siendo la primera visible.
//
// Tercera pasada (30-oct-2026): la página abre con el GANCHO de crédito
// (Infonavit / Fovissste) cuando el Hub lo declara, y los filtros del
// formulario (crédito, presupuesto, recámaras) se construyen aquí desde el
// inventario real: una opción sin casas no existe.
//
// Reglas heredadas: toda cifra sale del inventario; ningún nombre de
// desarrollo llega al DOM; cero urgencia inventada.
//
// El cuerpo vive AQUÍ porque lo sirven dos rutas: la española
// (`/lp/casas-merida`) y la inglesa (`/lp/homes-merida`). Cada `page.tsx`
// aporta `metadata` y `revalidate`; el texto sale de `COPY[locale]`. En inglés
// no hay gancho de crédito Infonavit/Fovissste (ver `_copy.ts`).
//
// MARCA (9-nov-2026): misma composición, piel del manual oficial (capa
// `marca.css`, ver DESIGN.md). El prefijo de esta landing es `.lpme-`: el
// anterior chocaba con clases sin ámbito de casas-riviera-maya.
// ============================================================

export default async function PaginaCasasMerida({ locale = 'es' }: { locale?: LocaleLp }) {
  const t = COPY[locale];
  const en = locale === 'en';
  const source = en ? 'lp_casas_merida_en' : 'lp_casas_merida';
  const casas = enIdioma(await getInventario({ tipos: TIPOS_CASA, ciudades: ['Mérida'] }), locale);
  const mensajeWa = t.form.whatsappGenerico;

  if (casas.length === 0) {
    return (
      <div className="lpv marca lpme-root min-h-[70vh]">
        <div className="mx-auto max-w-2xl px-5 py-32 sm:px-8">
          <h1 className="marca-titular text-[clamp(2rem,1.3rem+2.5vw,3.25rem)]">
            {t.vacio.titulo}
          </h1>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--lpv-fg-2)]">
            {t.vacio.cuerpo}
          </p>
          <a
            href={`https://wa.me/${FALLBACK_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="marca-boton mt-9"
          >
            {t.vacio.cta}
          </a>
        </div>
      </div>
    );
  }

  const principal = casas[0];
  const desde = casas[0]?.precio ?? null;
  const hasta = casas[casas.length - 1]?.precio ?? null;
  // En inglés no se construye el filtro de crédito: Infonavit/Fovissste son
  // créditos del gobierno mexicano que un comprador extranjero no puede usar.
  const defs = filtros(
    en ? null : filtroCredito(casas),
    filtroPresupuesto(casas, [1_500_000, 2_000_000], undefined, locale),
    filtroRecamaras(casas, undefined, locale),
  );

  return (
    <div className="lpv marca lpme-root">
      <Catalogo
        casas={casas}
        filtros={defs}
        telefonoWhatsApp={FALLBACK_WHATSAPP}
        locale={locale}
        copy={t.catalogo}
        form={t.form}
        source={source}
      />

      {/* ══ PREGUNTAS ══ */}
      <div className="mx-auto max-w-[96rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="marca-titular text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] text-[var(--lpv-fg)] lg:col-span-4">
            {t.faqTitulo}
          </h2>
          <div className="marca-tarjeta px-5 py-3 sm:px-8 sm:py-5 lg:col-span-8 lg:col-start-5">
            <FaqAcordeon
              faqs={en ? FAQ_COMPRA_Y_FINANCIAMIENTO_EN : FAQ_COMPRA_Y_FINANCIAMIENTO}
              locale={locale}
              titulo="" className="[&>h2]:hidden [&>div]:mt-0 [&>div]:border-y-0" />
          </div>
        </div>
      </div>

      <PieLegal
        tono="oscuro"
        locale={locale}
        aviso={t.pieAviso}
        inventario={
          desde && hasta
            ? casas.length === 1
              ? t.inventarioUna(ubicacionCorta(principal), dinero(desde))
              : t.inventarioVarias(casas.length, dinero(desde), dinero(hasta))
            : null
        }
      />

      <BarraMovil
        etiqueta={t.barraEtiqueta}
        telefonoWhatsApp={FALLBACK_WHATSAPP}
        mensajeWhatsApp={mensajeWa}
        locale={locale}
        surface={`${source}_barra_movil`}
        href="#solicitar"
      />
    </div>
  );
}
