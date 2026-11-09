'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ArrowRight, Bath, Bed, Car, KeyRound, Maximize, Trees, Waves } from '@/lib/icons';
import type { CasaLanding } from '@/lib/supabase/lp-casas';
import type { PropiedadLanding } from '@/lib/supabase/lp-inventario';
import { dinero, m2, mxn } from '../../_components/format';
import { ANCLA_INVENTARIO, TODAS, emitirUbicacion, useFiltroUbicacion } from '../../_components/v2/ChipsUbicacion';
import GaleriaFicha from '../../_components/v2/GaleriaFicha';
import FormCasas from './FormCasas';
import { COPY, type CopyCasas, type LocaleCasas } from '../_copy';

// ============================================================
// Las láminas: una casa por pliego, foto grande y columna de datos,
// alternando lado. La primera lámina va a mayor escala (la casa de entrada),
// las demás alternan 7/5 para que el ritmo no sea una cuadrícula de tarjetas.
//
// Igual que en producción: las láminas NO enlazan fuera. «Solicitar ficha
// técnica» deja la casa elegida en el formulario de cierre y lleva el foco
// hasta él.
// ============================================================

function sinPortadasRepetidas(casas: CasaLanding[]): Map<string, string[]> {
  const usadas = new Set<string>();
  const resultado = new Map<string, string[]>();
  for (const casa of casas) {
    let fotos = casa.imagenes;
    const libre = fotos.findIndex((f) => !usadas.has(f));
    if (libre > 0) fotos = [...fotos.slice(libre), ...fotos.slice(0, libre)];
    if (fotos[0]) usadas.add(fotos[0]);
    resultado.set(casa.id, fotos);
  }
  return resultado;
}

function comoPropiedad(c: CasaLanding): PropiedadLanding {
  return {
    ...c,
    tipo: 'Casa',
    estado: '',
    precioM2Mxn: null,
    mesesOpciones: [],
    estadoComercial: c.preventa ? 'preventa' : 'disponible',
    vista: null,
    frenteAlMar: false,
    creditos: { infonavit: false, fovissste: false, hipotecario: false, directo: false },
    mensualidadMxn: null,
    amueblado: false,
    equipado: false,
    descuentoPct: null,
    desarrolloId: null,
    coordenadas: null,
  };
}

function Confirmar({ copy }: { copy: CopyCasas }) {
  return <span className="lpm-confirmar">{copy.inventario.confirmar}</span>;
}

/** Datos de la lámina con su icono. Solo se imprime lo que existe. */
function datosDe(casa: CasaLanding, copy: CopyCasas) {
  const s = copy.inventario.specs;
  const filas: { icono: typeof Bed; valor: string; etiqueta: string }[] = [];
  if (casa.recamaras) filas.push({ icono: Bed, valor: String(casa.recamaras), etiqueta: copy.monografia.recamaras(casa.recamaras) });
  if (casa.banos) filas.push({ icono: Bath, valor: String(casa.banos), etiqueta: copy.monografia.banos(casa.banos) });
  if (casa.m2Construidos) filas.push({ icono: Maximize, valor: m2(casa.m2Construidos), etiqueta: copy.monografia.construidos });
  if (casa.m2Terreno) filas.push({ icono: Trees, valor: m2(casa.m2Terreno), etiqueta: s.terreno });
  if (casa.estacionamientos) filas.push({ icono: Car, valor: String(casa.estacionamientos), etiqueta: copy.monografia.estacionamientos(casa.estacionamientos) });
  if (casa.alberca) filas.push({ icono: Waves, valor: s.alberca, etiqueta: copy.monografia.albercaDetalle });
  return filas;
}

function entregaDe(casa: CasaLanding, copy: CopyCasas) {
  return casa.entregaInmediata
    ? copy.inventario.entregaInmediata
    : casa.preventa
      ? copy.inventario.preventa
      : copy.inventario.disponible;
}

export default function Laminas({
  casas,
  telefonoWhatsApp,
  locale = 'es',
}: {
  casas: CasaLanding[];
  telefonoWhatsApp: string;
  locale?: LocaleCasas;
}) {
  const copy = COPY[locale];
  const [casaSeleccionada, setCasaSeleccionada] = useState<string | null>(null);
  const anclaForm = useRef<HTMLElement>(null);

  const opciones = casas.map((c) => ({ slug: c.slug, titulo: c.titulo }));
  const propiedades = useMemo(() => casas.map(comoPropiedad), [casas]);
  const { activa, visibles, ubicaciones } = useFiltroUbicacion(propiedades, 'ciudad');
  const galerias = useMemo(() => sinPortadasRepetidas(casas), [casas]);
  const casasVisibles = casas.filter((c) => visibles.some((v) => v.id === c.id));

  const elegir = useCallback((slug: string) => {
    setCasaSeleccionada(slug);
    anclaForm.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    anclaForm.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <section id={ANCLA_INVENTARIO} className="scroll-mt-2 bg-[var(--lpm-tech)] pb-16 lg:pb-24">
        {/* Índice del libro: ciudades con su conteo, alineado al filete. */}
        <div className="mx-auto max-w-[92rem] px-5 pt-16 sm:px-8 lg:pt-24">
          <div className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="lpm-display text-[clamp(2rem,1.3rem+2.6vw,3.75rem)]">
              {casasVisibles.length} {copy.monografia.casas(casasVisibles.length)}
              {activa !== TODAS ? <span className="text-[var(--lpm-teal)]"> {copy.monografia.en} {ubicaciones.find((u) => u.clave === activa)?.nombre}</span> : null}
            </h2>
            {ubicaciones.length > 1 && (
              <div role="group" aria-label={copy.monografia.ariaInventario} className="flex flex-wrap gap-2">
                {[{ clave: TODAS, etiqueta: copy.inventario.todas }, ...ubicaciones.map((u) => ({ clave: u.clave, etiqueta: `${u.nombre} · ${u.total}` }))].map((o) => (
                  <button
                    key={o.clave}
                    type="button"
                    aria-pressed={activa === o.clave}
                    onClick={() => emitirUbicacion(o.clave === TODAS ? '' : o.clave)}
                    className="lpm-indice-opcion"
                  >
                    {o.etiqueta}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <ol className="mx-auto grid max-w-[92rem] grid-cols-[minmax(0,1fr)] gap-6 px-5 sm:px-8 lg:gap-8">
          {casasVisibles.map((casa, i) => {
            const elegida = casaSeleccionada === casa.slug;
            const primera = i === 0;
            const derecha = i % 2 === 1;
            const datos = datosDe(casa, copy);
            return (
              <li
                key={casa.id}
                className="lpm-lamina grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-6 lg:grid-cols-12"
              >
                <div
                  className={`min-w-0 ${primera ? 'lg:col-span-8' : 'lg:col-span-7'} ${derecha ? 'lg:order-2' : ''}`}
                >
                  <GaleriaFicha
                    imagenes={galerias.get(casa.id) ?? casa.imagenes}
                    alt={copy.inventario.altFicha(casa.titulo, casa.ciudad)}
                    sizes="(min-width: 1024px) 60vw, 92vw"
                    sinFoto={copy.inventario.sinFoto}
                    controles="abajo"
                    pie={`${String(i + 1)} ${copy.monografia.de} ${casasVisibles.length} · ${casa.zona ? `${casa.zona}, ` : ''}${casa.ciudad}`}
                    className="lpm-galeria"
                  />
                </div>

                <div
                  className={`flex flex-col px-2 pb-3 lg:py-4 ${primera ? 'lg:col-span-4' : 'lg:col-span-5'} ${
                    derecha ? 'lg:order-1 lg:pl-6' : 'lg:pr-6'
                  }`}
                >
                  <p>
                    <span className="lpm-chip">
                      <KeyRound className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      {entregaDe(casa, copy)}
                    </span>
                  </p>
                  <h3 className="lpm-titulo mt-3 text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)]">{casa.titulo}</h3>

                  <p className="lpm-display lpm-cifra mt-6 text-[clamp(2rem,1.5rem+1.8vw,3rem)]">
                    {casa.precio ? dinero(casa.precio) : <Confirmar copy={copy} />}
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-[var(--lpm-slate)]">
                    {copy.inventario.enganche}{' '}
                    {casa.enganchePct ? (
                      <span className="lpm-cifra text-[var(--lpc-ink)]">
                        {casa.enganchePct}%{casa.engancheMxn ? ` · ${mxn(casa.engancheMxn)}` : ''}
                      </span>
                    ) : (
                      <Confirmar copy={copy} />
                    )}
                  </p>

                  {datos.length > 0 && (
                    <dl className="lpm-datos mt-8 grid grid-cols-2">
                      {datos.map(({ icono: Icono, valor, etiqueta }) => (
                        <div key={etiqueta} className="flex items-center gap-3 border-b border-[rgb(72_115_121/0.12)] px-3.5 py-3.5">
                          <span className="lpm-dato-icono">
                            <Icono className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                          </span>
                          <div className="min-w-0">
                            <dt className="sr-only">{etiqueta}</dt>
                            <dd className="lpm-cifra text-[1.0625rem] font-semibold leading-tight">{valor}</dd>
                            <dd className="text-[0.8125rem] leading-tight text-[var(--lpm-teal)]">{etiqueta}</dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-auto pt-8">
                    <button
                      type="button"
                      onClick={() => elegir(casa.slug)}
                      aria-pressed={elegida}
                      className={`lpm-boton w-full justify-between ${elegida ? 'lpm-boton-elegido' : ''}`}
                    >
                      {elegida ? copy.inventario.elegida : copy.inventario.elegir}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Cierre: la única superficie negra completa, con la hoja blanca. */}
      <section
        id="solicitar"
        ref={anclaForm}
        tabIndex={-1}
        className="lpm-cierre scroll-mt-4 pb-28 pt-20 outline-none sm:pb-24 lg:pt-28"
      >
        <div className="lpm-reticula" aria-hidden />
        <div className="relative mx-auto grid max-w-[92rem] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-20">
          <div>
            <h2 className="lpm-display text-[clamp(2.25rem,1.4rem+3vw,4.5rem)] text-white">
              {copy.cierre.titulo(casas.length)}
            </h2>
            <dl className="mt-12 max-w-[56ch] border-t border-white/25">
              {copy.cierre.puntos.map(([titulo, detalle]) => (
                <div key={titulo} className="grid gap-1 border-b border-white/15 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="lpm-subtitulo text-white">{titulo}</dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-white/85">{detalle}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lpm-hoja lg:sticky lg:top-8 lg:self-start">
            <FormCasas
              variante="cierre"
              casas={opciones}
              casaSeleccionada={casaSeleccionada}
              onCasaChange={setCasaSeleccionada}
              telefonoWhatsApp={telefonoWhatsApp}
              locale={locale}
            />
          </div>
        </div>
      </section>
    </>
  );
}
