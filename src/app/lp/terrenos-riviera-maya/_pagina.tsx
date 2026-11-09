import Image from 'next/image';
import {
  TIPOS_TERRENO,
  getInventario,
  resumenInventario,
  type PropiedadLanding,
  enIdioma,
} from '@/lib/supabase/lp-inventario';
import { FALLBACK_WHATSAPP } from '@/lib/site-contact';
import { Banknote, FileCheck, Map } from '@/lib/icons';
import { dinero, mxn } from '../_components/format';
import { filtroPlazo, filtroPresupuesto, filtroUbicacion, filtros } from '../_components/v2/filtros';
import FaqAcordeon from '../_components/v2/FaqAcordeon';
import FormInventario from '../_components/v2/FormInventario';
import BarraMovil from '../_components/v2/BarraMovil';
import PieLegal from '../_components/v2/PieLegal';
import type { LocaleLp } from '../_components/v2/i18n';
import { ubicacionCorta } from '../_components/v2/util';
import Catalogo from './_components/Catalogo';
import ChipsHero from './_components/ChipsHero';
import { COPY } from './_copy';
import '../_components/v2/tokens.css';
import '../_components/v2/marca.css';
import './lpt2-theme.css';

// ============================================================
// Landing de pago: TERRENOS EN LA RIVIERA MAYA (segunda versión, 30-oct-2026).
//
// El cuerpo vive AQUÍ y no en `page.tsx` porque lo sirven dos rutas: la
// española (`/lp/terrenos-riviera-maya`) y la inglesa (`/lp/land-riviera-maya`,
// 9-nov-2026, tráfico de Estados Unidos y Canadá). Cada `page.tsx` aporta solo
// `metadata` y `revalidate`; todo el texto sale de `_copy.ts` por `locale`.
//
// Lógica: CATÁLOGO TÉCNICO. Quien compra suelo compara superficie, precio,
// precio por metro y plazo, así que la página es una tabla grande que se
// abre fila por fila, no una galería. Cuatro movimientos:
//
//   1. Hero tipográfico sobre blanco (brief del 30-oct-2026): «Invierte en
//      la Riviera Maya desde $X» con «Lotes residenciales» debajo, subtítulo
//      con ciudades, enganche y plazo reales, tres datos con filete (lotes,
//      documentación, financiamiento), ciudad y plazo como filtro, y el
//      FORMULARIO FIJO a la derecha del titular. La foto aérea va bajo el
//      texto, en la columna izquierda, sin nada encima.
//   2. El catálogo: un mapa con los puntos del inventario (el que pidió el
//      brief) y filas de ancho completo con la superficie como cifra
//      principal; cada una se abre con fotos y plan por plazo.
//   3. La línea de comercializadora, sola y grande.
//   4. El formulario sobre el degradado de marca, y las preguntas.
//
// MARCA (9-nov-2026, «misma marca, otra composición»): la composición de
// arriba se conserva; lo visual pasa al manual de Propyte (DESIGN.md,
// `_components/v2/marca.css`). El hero tipográfico es una banda Aztec con
// retícula y la cifra «desde» en New Aqua; el formulario es vidrio; filtros y
// plazos son pastillas; el mapa va en tarjeta; cada fila es una tarjeta. En
// móvil la foto aérea pasa DETRÁS del formulario (antes iba delante), así el
// formulario sube en el primer pliegue sin perder la foto.
//
// Reglas heredadas: toda cifra sale del inventario; ningún nombre de
// desarrollo llega al DOM; la mensualidad se calcula y se rotula como
// orientativa; cero urgencia inventada.
// ============================================================

/**
 * Cortes de presupuesto que caen DENTRO del rango real de precios: así cada
 * rango tiene lotes y ninguno se publica vacío (`filtroPresupuesto` descarta
 * los que queden sin propiedades de todos modos).
 */
function cortesPresupuesto(lotes: PropiedadLanding[]): number[] {
  const montos = lotes.filter((l) => l.precio?.moneda === 'MXN').map((l) => l.precio!.monto);
  if (montos.length < 2) return [];
  const min = Math.min(...montos);
  const max = Math.max(...montos);
  const escalera = [500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000];
  return escalera.filter((c) => c > min && c <= max).slice(0, 3);
}

/**
 * Corrige `<html lang>` antes de la hidratación. El root layout lo deja
 * estático en `"es"` (resolverlo ahí volvería dinámico todo el sitio) y `/lp/*`
 * vive fuera de `[locale]`; sin esto la versión en inglés se anunciaría como
 * española al lector de pantalla y al traductor del navegador. En español no
 * hace falta, así que no emite nada.
 */
function CorrigeLang({ locale }: { locale: LocaleLp }) {
  if (locale === 'es') return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
      }}
    />
  );
}

export default async function PaginaTerrenos({ locale = 'es' }: { locale?: LocaleLp }) {
  const copy = COPY[locale];
  const lotes = enIdioma(await getInventario({ tipos: TIPOS_TERRENO }), locale);
  const resumen = resumenInventario(lotes);
  const mesesMax = Math.max(0, ...lotes.flatMap((l) => l.mesesOpciones));
  const mensajeWa = copy.form.whatsappGenerico;

  // Tercer dato del hero: la mensualidad solo si algún desarrollador la
  // declara (hoy dos lotes); si no, el plazo máximo. Nunca una cifra calculada.
  const mensualidades = lotes.map((l) => l.mensualidadMxn).filter((m): m is number => m !== null);
  const datoFinanciamiento =
    mensualidades.length > 0
      ? copy.hero.datoMensualidad(mxn(Math.min(...mensualidades)))
      : mesesMax > 0
        ? copy.hero.datoPlazo(mesesMax)
        : null;
  const datos = [
    { Icono: Map, texto: copy.hero.datoLotes(resumen.total) },
    { Icono: FileCheck, texto: copy.hero.datoDocumentacion },
    ...(datoFinanciamiento ? [{ Icono: Banknote, texto: datoFinanciamiento }] : []),
  ];
  const opciones = lotes.map((l) => ({ slug: l.slug, titulo: l.titulo }));

  // Filtros con conteo real. Ciudad y plazo van también en el hero; los tres
  // viven en la barra pegajosa del catálogo y en el formulario. En español la
  // etiqueta de ubicación es «Ciudad»; en inglés se usa el default del kit.
  const defs = filtros(
    filtroUbicacion(lotes, 'ciudad', locale === 'es' ? 'Ciudad' : 'City', locale),
    filtroPlazo(lotes, undefined, locale),
    filtroPresupuesto(lotes, cortesPresupuesto(lotes), undefined, locale),
  );
  const defsHero = defs.filter((d) => d.id === 'ubicacion' || d.id === 'plazo');

  if (lotes.length === 0) {
    return (
      <div className={`lpv marca lpt2-root min-h-[70vh]`}>
        <CorrigeLang locale={locale} />
        <div className="mx-auto max-w-2xl px-5 py-32 sm:px-8">
          <h1 className="marca-titular text-[clamp(2rem,1.3rem+2.5vw,3.25rem)]">{copy.vacio.titulo}</h1>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--lpv-fg-2)]">{copy.vacio.cuerpo}</p>
          <a
            href={`https://wa.me/${FALLBACK_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="marca-boton mt-9"
          >
            {copy.vacio.cta}
          </a>
        </div>
      </div>
    );
  }

  // Banda aérea: el lote con más fotos propias, que suele ser el mejor
  // fotografiado desde el aire.
  const banda = [...lotes].filter((l) => l.imagen).sort((a, b) => b.imagenes.length - a.imagenes.length)[0] ?? null;

  return (
    <div className="lpv marca lpt2-root">
      <CorrigeLang locale={locale} />
      {/* ══ 1 · HERO tipográfico con el formulario fijo a la derecha ══
          Banda Aztec con la retícula de nodos de marca. La cifra «desde» va en
          New Aqua (Aqua solo sobre oscuro). Orden del documento: texto →
          FORMULARIO → foto; en escritorio el formulario ocupa la columna
          derecha a la altura del titular y la foto queda bajo el texto. */}
      <section id="hero" className="marca-oscura lpt2-hero">
        <div className="marca-reticula" aria-hidden />
        {/* `minmax(0,1fr)` + `min-w-0`: la fila de chips desplazable no puede
            ensanchar la columna en móvil (desbordaba 230 px a 375). */}
        <div className="mx-auto grid max-w-[96rem] grid-cols-[minmax(0,1fr)] gap-8 px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10 lg:items-start lg:pb-16">
          <div className="min-w-0 lg:col-span-7 lg:row-start-1">
            <h1 className="marca-titular text-white">
              <span className="block text-[clamp(2.5rem,1.4rem+3.6vw,4.75rem)]">
                {copy.hero.titulo}
                {resumen.desde && (
                  <>
                    {' '}
                    {copy.hero.desde}{' '}
                    <span className="marca-acento marca-cifra whitespace-nowrap">{dinero(resumen.desde)}</span>
                  </>
                )}
              </span>
              <span className="lpt2-display-ligero mt-3 block text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] text-[var(--lpv-fg-2)]">
                {copy.hero.tituloLigero}
              </span>
            </h1>

            <p className="mt-6 max-w-[58ch] text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-relaxed text-[var(--lpv-fg-2)]">
              {copy.hero.subtitulo({
                ciudades: resumen.ciudades,
                engancheMinimoPct: resumen.engancheMinimoPct,
                mesesMax,
              })}
            </p>

            {/* Tres datos con su icono en círculo, no tres tarjetas. */}
            <ul className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
              {datos.map(({ Icono, texto }) => (
                <li key={texto} className="flex items-center gap-3">
                  <span className="lpt2-dato-icono" aria-hidden>
                    <Icono className="h-[18px] w-[18px]" />
                  </span>
                  <span className="marca-detalle text-[0.9375rem] leading-snug text-white">{texto}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <ChipsHero defs={defsHero} />
            </div>
          </div>

          {/* El formulario acompaña al titular y se queda fijo mientras la
              columna izquierda baja hasta la foto. */}
          <div className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-6 lg:self-start">
            <FormInventario
              source={copy.source}
              variante="hero"
              copy={copy.form}
              opciones={opciones}
              telefonoWhatsApp={FALLBACK_WHATSAPP}
              filtros={defs}
              propiedades={lotes}
              locale={locale}
            />
          </div>

          {/* Foto aérea, sin texto encima, en esquina de marca. */}
          {banda?.imagen && (
            <figure className="lpt2-foto relative aspect-[4/3] w-full min-w-0 sm:aspect-[16/9] lg:col-span-7 lg:col-start-1 lg:row-start-2">
              <Image
                src={banda.imagen}
                alt={`${banda.titulo}, ${ubicacionCorta(banda)}`}
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </figure>
          )}
        </div>
      </section>
      {/* ══ 2 · CATÁLOGO + 3 · COMERCIALIZADORA + 4 · FORMULARIO ══ */}
      <Catalogo lotes={lotes} defs={defs} telefonoWhatsApp={FALLBACK_WHATSAPP} locale={locale} />

      {/* ══ 5 · PREGUNTAS ══ */}
      <div className="mx-auto max-w-[96rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="marca-titular text-[clamp(1.75rem,1.2rem+2vw,3rem)] lg:col-span-4">{copy.preguntas.titulo}</h2>
          <div className="lg:col-span-8 lg:col-start-5">
            <FaqAcordeon
              faqs={copy.preguntas.faqs}
              titulo=""
              locale={locale}
              className="[&>h2]:hidden [&>div]:mt-0"
            />
          </div>
        </div>
      </div>

      <PieLegal
        tono="claro"
        aviso={copy.pie.aviso}
        locale={locale}
        inventario={
          resumen.desde && resumen.hasta
            ? copy.pie.inventario(resumen.total, dinero(resumen.desde), dinero(resumen.hasta))
            : null
        }
      />

      <BarraMovil
        etiqueta={copy.barra}
        telefonoWhatsApp={FALLBACK_WHATSAPP}
        mensajeWhatsApp={mensajeWa}
        surface={copy.surfaceBarra}
        locale={locale}
      />
    </div>
  );
}
