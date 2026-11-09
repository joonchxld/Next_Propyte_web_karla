'use client';

import { useCallback, useRef, useState } from 'react';
import type { PropiedadLanding } from '@/lib/supabase/lp-inventario';
import { ArrowRight, Calendar, Percent, Ruler } from '@/lib/icons';
import { dinero, m2, mxn, mxnExacto } from '../../_components/format';
import { ANCLA_INVENTARIO } from '../../_components/v2/ChipsUbicacion';
import type { FiltroDef } from '../../_components/v2/filtros';
import { useFiltros } from '../../_components/v2/useFiltros';
import FormInventario from '../../_components/v2/FormInventario';
import GaleriaFicha from '../../_components/v2/GaleriaFicha';
import type { LocaleLp } from '../../_components/v2/i18n';
import { estadoTexto, ubicacionCorta } from '../../_components/v2/util';
import { COPY } from '../_copy';
import MapaLotes from './MapaLotes';

// ============================================================
// El catálogo: filas de ancho completo, una por lote.
//
// Cada fila es una línea de tabla que se puede abrir. Cerrada, muestra lo
// que se compara entre lotes: superficie (grande), título y ubicación,
// precio total y precio por metro. Abierta, enseña las fotos y el plan por
// plazo, con el botón que elige el lote para el formulario. Solo una fila
// está abierta a la vez; la primera arranca abierta para que la página no
// parezca una lista de títulos.
//
// La mensualidad se CALCULA aquí, no viene del Hub: (precio - enganche) /
// meses, sin intereses, y solo cuando el registro declara enganche y plazos
// en pesos. Donde no, se dice por qué no hay cifra en vez de inventarla.
//
// FILTROS (30-oct-2026): ciudad, plazo y presupuesto comparten estado con el
// hero y el formulario por `useFiltros`. El plazo elegido arriba manda sobre
// el selector de la fila: si alguien pidió «24 meses», la cuota que ve es la
// de 24 meses, no la del plazo más largo.
//
// MAPA (30-oct-2026): `MapaLotes` vive aquí, entre la barra de filtros y las
// filas, porque comparte las tres cosas que ya tiene el catálogo: la lista
// filtrada, la fila abierta y el lote elegido para el formulario. Pulsar un
// marcador abre su fila; abrir una fila resalta su marcador. Si no hay clave
// de Google Maps, el componente no pinta nada y el catálogo sigue igual.
//
// MARCA (9-nov-2026): misma tabla, otra piel. Cada fila es una tarjeta blanca
// redondeada sobre Tech White; la abierta lleva su plan en la tabla Water Dew
// con el icono en círculo; filtros y plazos son pastillas; el cierre va sobre
// el degradado de marca con el formulario en vidrio Aztec.
// ============================================================

const ICONO = 'h-3.5 w-3.5 shrink-0 text-[var(--marca-teal)]';

function mensualidad(p: PropiedadLanding, meses: number): number | null {
  if (!p.precio || p.precio.moneda !== 'MXN' || !p.enganchePct || meses <= 0) return null;
  const enganche = p.engancheMxn ?? (p.precio.monto * p.enganchePct) / 100;
  return Math.round((p.precio.monto - enganche) / meses);
}

function Fila({
  lote,
  abierta,
  onToggle,
  onElegir,
  elegido,
  prioridad,
  plazoFiltro,
  locale,
}: {
  lote: PropiedadLanding;
  abierta: boolean;
  onToggle: () => void;
  onElegir: () => void;
  elegido: boolean;
  prioridad: boolean;
  /** Plazo elegido en los filtros, si lo hay y este lote lo ofrece. */
  plazoFiltro: number | null;
  locale: LocaleLp;
}) {
  const t = COPY[locale].catalogo;
  const plazos = lote.mesesOpciones;
  // El plazo del filtro manda; la elección manual en la fila solo vale
  // mientras el filtro no cambie (se guarda junto con el filtro que la vio
  // nacer). Derivado, sin efecto: no hay estado que sincronizar.
  const [manual, setManual] = useState<{ base: number | null; valor: number } | null>(null);
  const porDefecto =
    plazoFiltro && plazos.includes(plazoFiltro) ? plazoFiltro : plazos.length > 0 ? Math.max(...plazos) : 0;
  const plazo = manual && manual.base === plazoFiltro ? manual.valor : porDefecto;
  const setPlazo = (valor: number) => setManual({ base: plazoFiltro, valor });
  const cuota = plazos.length > 0 ? mensualidad(lote, plazo) : null;
  const enganche =
    lote.precio && lote.enganchePct
      ? (lote.engancheMxn ?? (lote.precio.monto * lote.enganchePct) / 100)
      : null;
  const estado = lote.estadoComercial !== 'disponible' ? estadoTexto(locale)[lote.estadoComercial] : null;
  const idDetalle = `detalle-${lote.id}`;

  return (
    <li id={`lote-${lote.id}`} className="lpt2-fila scroll-mt-20" data-abierta={abierta}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierta}
        aria-controls={idDetalle}
        className="grid w-full grid-cols-1 gap-x-8 gap-y-3 px-5 py-6 text-left sm:px-7 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:py-7"
      >
        {/* Superficie: la cifra que se compara primero. */}
        <p className="lpt2-display text-[clamp(2.5rem,1.6rem+3vw,5rem)] text-[var(--lpv-fg)] lg:min-w-[11ch]">
          {lote.m2Terreno ? (
            <>
              {m2(lote.m2Terreno).replace(' m²', '')}
              <span className="marca-detalle ml-1.5 align-top text-[0.4em] font-normal text-[var(--lpv-fg-3)]">m²</span>
            </>
          ) : (
            <span className="lpt2-display-ligero text-[0.45em] text-[var(--lpv-fg-3)]">{t.fila.superficiePorConfirmar}</span>
          )}
        </p>

        <div className="min-w-0">
          <h3 className="font-[family-name:var(--marca-display)] text-[1.125rem] font-medium leading-snug tracking-[-0.015em] text-[var(--lpv-fg)] lg:text-[1.25rem]">
            {lote.titulo}
          </h3>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-[0.9375rem] text-[var(--lpv-fg-2)]">
            <span>{ubicacionCorta(lote)}</span>
            {estado ? <span className="marca-pastilla">{estado}</span> : null}
          </p>
        </div>

        <div className="lg:text-right">
          <p className="lpt2-display text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)] text-[var(--lpv-fg)]">
            {lote.precio ? dinero(lote.precio) : t.fila.precioPorConfirmar}
          </p>
          <p className="lpt2-meta mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.875rem] text-[var(--lpv-fg-2)] lg:justify-end">
            <span className="inline-flex items-center gap-1.5">
              <Ruler className={ICONO} aria-hidden />
              {lote.precioM2Mxn ? `${mxnExacto(lote.precioM2Mxn)} / m²` : t.fila.precioM2PorConfirmar}
            </span>
            {plazos.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className={ICONO} aria-hidden />
                {t.fila.hastaMeses(Math.max(...plazos))}
              </span>
            )}
            {lote.enganchePct ? (
              <span className="inline-flex items-center gap-1.5">
                <Percent className={ICONO} aria-hidden />
                {t.fila.enganchePct(lote.enganchePct)}
              </span>
            ) : null}
          </p>
        </div>
      </button>

      {abierta && (
        <div id={idDetalle} className="lpt2-detalle grid gap-6 px-3 pb-3 sm:px-4 sm:pb-4 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <GaleriaFicha
              imagenes={lote.imagenes}
              alt={`${lote.titulo}, ${ubicacionCorta(lote)}`}
              aspecto="aspect-[3/2]"
              sizes="(min-width: 1024px) 56vw, 100vw"
              tope={8}
              prioridad={prioridad}
              locale={locale}
            />
          </div>

          <div className="lpt2-plan p-5 sm:p-7 lg:col-span-5">
            {plazos.length > 0 && cuota !== null ? (
              <>
                <p className="marca-detalle inline-flex items-center gap-2.5 text-[0.9375rem] text-[var(--lpv-fg-2)]">
                  <span className="marca-icono" aria-hidden>
                    <Calendar className="h-[18px] w-[18px]" />
                  </span>
                  {t.fila.plazo}
                </p>
                <div role="group" aria-label={t.fila.plazoAria} className="mt-3 flex flex-wrap gap-2">
                  {plazos.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={m === plazo}
                      onClick={() => setPlazo(m)}
                      className="lpt2-plazo min-h-[44px] px-4 text-[0.9375rem]"
                    >
                      {t.fila.meses(m)}
                    </button>
                  ))}
                </div>
                <p className="lpt2-display mt-6 text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] text-[var(--lpv-fg)]">
                  {mxn(cuota)}
                </p>
                <p className="mt-1 text-[0.9375rem] text-[var(--lpv-fg-2)]">
                  {t.fila.alMes(plazo)}
                </p>
                {enganche ? (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[0.9375rem] text-[var(--lpv-fg-2)]">
                    <Percent className={ICONO} aria-hidden />
                    {t.fila.engancheDe(mxn(enganche), lote.enganchePct as number)}
                  </p>
                ) : null}
                <p className="mt-4 max-w-[48ch] text-[0.8125rem] leading-relaxed text-[var(--lpv-fg-2)]">
                  {t.notaMensualidad}
                </p>
              </>
            ) : (
              <>
                <p className="lpt2-display text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] text-[var(--lpv-fg)]">
                  {lote.precio ? dinero(lote.precio) : t.fila.precioPorConfirmar}
                </p>
                {enganche ? (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[0.9375rem] text-[var(--lpv-fg-2)]">
                    <Percent className={ICONO} aria-hidden />
                    {t.fila.engancheLinea(lote.enganchePct as number, mxn(enganche))}
                  </p>
                ) : null}
                <p className="mt-4 max-w-[48ch] text-[0.8125rem] leading-relaxed text-[var(--lpv-fg-2)]">{t.sinPlan}</p>
              </>
            )}

            <button
              type="button"
              onClick={onElegir}
              aria-pressed={elegido}
              className="lpt2-elegir mt-7 w-full justify-between"
            >
              {elegido ? t.fila.elegido : t.fila.quieroEste}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default function Catalogo({
  lotes,
  defs,
  telefonoWhatsApp,
  locale = 'es',
}: {
  lotes: PropiedadLanding[];
  defs: FiltroDef[];
  telefonoWhatsApp: string;
  locale?: LocaleLp;
}) {
  const copy = COPY[locale];
  const t = copy.catalogo;
  const { seleccion, alternar, limpiar, visibles, activos } = useFiltros(lotes, defs);
  const plazoFiltro = seleccion.plazo ? Number(seleccion.plazo) : null;
  const [abierta, setAbierta] = useState<string | null>(lotes[0]?.id ?? null);
  const [elegido, setElegido] = useState<string | null>(null);
  const anclaForm = useRef<HTMLDivElement>(null);
  const opciones = lotes.map((l) => ({ slug: l.slug, titulo: l.titulo }));

  // Al cambiar el filtro, la primera fila visible queda abierta: una lista
  // de filas cerradas se lee como índice, no como catálogo. Derivado del
  // estado, sin efecto.
  const abiertaEfectiva = visibles.some((v) => v.id === abierta) ? abierta : (visibles[0]?.id ?? null);

  const elegir = useCallback((slug: string) => {
    setElegido(slug);
    anclaForm.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <section id={ANCLA_INVENTARIO} className="scroll-mt-2 bg-[var(--marca-tech)]">
        <div className="lpt2-filtros">
          <div className="marca-sin-barra mx-auto flex max-w-[96rem] items-center gap-2 overflow-x-auto px-5 py-3 sm:px-8">
            <button type="button" aria-pressed={activos === 0} onClick={limpiar} className="lpt2-chip">
              {t.todos}
            </button>
            {defs.map((def) => (
              <div
                key={def.id}
                role="group"
                aria-label={def.etiqueta}
                className="ml-1 flex shrink-0 items-center gap-2 border-l border-[var(--lpv-line)] pl-3"
              >
                {def.opciones.map((o) => (
                  <button
                    key={o.valor}
                    type="button"
                    aria-pressed={seleccion[def.id] === o.valor}
                    onClick={() => alternar(def.id, o.valor)}
                    className="lpt2-chip"
                  >
                    {o.etiqueta} <span className="lpt2-chip-n">{o.total}</span>
                  </button>
                ))}
              </div>
            ))}
            <p className="marca-detalle marca-cifra ml-auto shrink-0 whitespace-nowrap pl-6 text-sm text-[var(--lpv-fg-3)]" aria-live="polite">
              {t.conteo(visibles.length)}
            </p>
          </div>
        </div>

        <MapaLotes
          lotes={lotes}
          visibles={visibles}
          abierta={abiertaEfectiva}
          onAbrir={setAbierta}
          onElegir={elegir}
          elegido={elegido}
          plazoFiltro={plazoFiltro}
          locale={locale}
        />

        {visibles.length === 0 ? (
          <p className="mx-auto max-w-[96rem] px-5 py-24 text-[var(--lpv-fg-2)] sm:px-8">
            {t.sinResultados}
          </p>
        ) : (
          <ul className="mx-auto flex max-w-[96rem] flex-col gap-3 px-3 sm:px-8">
            {visibles.map((lote, i) => (
              <Fila
                key={lote.id}
                lote={lote}
                abierta={abiertaEfectiva === lote.id}
                onToggle={() => setAbierta(abiertaEfectiva === lote.id ? null : lote.id)}
                onElegir={() => elegir(lote.slug)}
                elegido={elegido === lote.slug}
                prioridad={i === 0}
                plazoFiltro={plazoFiltro}
                locale={locale}
              />
            ))}
          </ul>
        )}

        <div className="mx-auto max-w-[96rem] px-5 py-16 sm:px-8 sm:py-24">
          <p className="marca-titular max-w-[24ch] text-[clamp(1.5rem,1.1rem+1.8vw,2.75rem)] text-[var(--lpv-fg)]">
            {t.comercializadora}
          </p>
        </div>
      </section>

      {/* ══ FORMULARIO sobre el degradado de marca ══ */}
      <section
        id="solicitar"
        ref={anclaForm}
        className="marca-oscura marca-degradado lpt2-cierre scroll-mt-4 pb-28 text-white sm:pb-0"
      >
        <div className="marca-reticula" aria-hidden />
        <div className="mx-auto grid max-w-[96rem] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <h2 className="marca-titular max-w-[14ch] text-[clamp(2.25rem,1.4rem+3.4vw,4.5rem)] lg:col-span-6">
            {t.cierreTitulo}
          </h2>
          <div className="lg:col-span-6">
            <FormInventario
              source={copy.source}
              variante="cierre"
              copy={copy.form}
              opciones={opciones}
              seleccion={elegido}
              onSeleccion={setElegido}
              telefonoWhatsApp={telefonoWhatsApp}
              filtros={defs}
              propiedades={lotes}
              locale={locale}
            />
          </div>
        </div>
      </section>
    </>
  );
}
