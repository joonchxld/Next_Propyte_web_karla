'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { PropiedadLanding } from '@/lib/supabase/lp-inventario';
import { ubicacionDe, ubicaciones } from '@/lib/supabase/lp-inventario';
import { Bath, Bed, Eye, KeySquare, Maximize } from '@/lib/icons';
import { dinero, m2 } from '../../_components/format';
import FormInventario from '../../_components/v2/FormInventario';
import GaleriaFicha from '../../_components/v2/GaleriaFicha';
import type { FiltroDef } from '../../_components/v2/filtros';
import { useFiltros } from '../../_components/v2/useFiltros';
import type { LocaleLp } from '../../_components/v2/i18n';
import { estadoTexto, ubicacionCorta } from '../../_components/v2/util';
import IndiceCiudades from './IndiceCiudades';
import { COPY, type CopyFrenteMar } from '../_copy';

// ============================================================
// Las propiedades, una por pantalla, y el formulario como última pantalla.
//
// Cada `section` mide una pantalla completa y es un punto de snap. La
// galería de la propiedad llena la pantalla; el dato va encima, abajo a la
// izquierda, y la única zona clicable es la píldora «Me interesa», para que
// las flechas de la galería sigan recibiendo el clic.
//
// LOS FILTROS MANDAN SOBRE LAS PANTALLAS (30-oct-2026). El mismo estado que
// mueve los chips del formulario y de la portada decide qué pantallas
// existen. Si lo elegido no deja ninguna, hay una pantalla que lo dice y
// ofrece quitar los filtros: un filtro sin salida es un visitante que se fue.
//
// LAS CARACTERÍSTICAS VAN EN GRANDE, CON ICONO. Recámaras, baños, metros,
// vista y entrega, cada una como una cifra grande sobre la foto. Solo lo que
// el Hub declara: lo que falta no se pinta, no se estima.
//
// MARCA (9-nov-2026): velo Aztec del manual, ubicación y contador en
// pastillas de vidrio, precio en New Aqua (sobre el velo), cifras en un panel
// de vidrio con iconos en círculo y el cierre sobre el degradado de marca con
// el formulario en vidrio.
//
// Pulsar la píldora deja la propiedad elegida en el formulario y baja hasta
// él. Es el mismo contrato que en la landing de casas: informar y convertir,
// no navegar.
// ============================================================

function prefiereMenosMovimiento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface Caracteristica {
  icono: typeof Bed;
  valor: string;
  etiqueta: string;
}

/** Las cifras grandes de una pantalla. Gate por dato: null no se pinta. */
function caracteristicas(p: PropiedadLanding, locale: LocaleLp, copy: CopyFrenteMar): Caracteristica[] {
  const t = copy.catalogo.cifras;
  const lista: Caracteristica[] = [];
  if (p.recamaras) {
    lista.push({ icono: Bed, valor: String(p.recamaras), etiqueta: t.recamaras(p.recamaras) });
  }
  if (p.banos) {
    lista.push({ icono: Bath, valor: String(p.banos), etiqueta: t.banos(p.banos) });
  }
  if (p.m2Construidos) {
    lista.push({ icono: Maximize, valor: m2(p.m2Construidos), etiqueta: t.construidos });
  }
  if (p.vista) {
    lista.push({ icono: Eye, valor: copy.vista[p.vista] ?? p.vista, etiqueta: t.vistaDeclarada });
  }
  if (p.estadoComercial === 'entrega_inmediata') {
    lista.push({ icono: KeySquare, valor: t.inmediata, etiqueta: p.entrega ? p.entrega.toLowerCase() : t.entrega });
  } else if (p.entrega) {
    lista.push({ icono: KeySquare, valor: p.entrega, etiqueta: estadoTexto(locale)[p.estadoComercial].toLowerCase() });
  } else if (p.estadoComercial === 'preventa') {
    lista.push({ icono: KeySquare, valor: t.preventa, etiqueta: t.entrega });
  }
  return lista;
}

export default function Catalogo({
  propiedades,
  filtros,
  telefonoWhatsApp,
  locale = 'es',
}: {
  propiedades: PropiedadLanding[];
  filtros: FiltroDef[];
  telefonoWhatsApp: string;
  locale?: LocaleLp;
}) {
  const copy = COPY[locale];
  const t = copy.catalogo;
  const [elegida, setElegida] = useState<string | null>(null);
  const anclaForm = useRef<HTMLElement>(null);
  const { visibles, activos, limpiar } = useFiltros(propiedades, filtros);
  const opciones = propiedades.map((p) => ({ slug: p.slug, titulo: p.titulo }));
  const total = propiedades.length;
  const ciudadesVisibles = useMemo(() => ubicaciones(visibles, 'ciudad'), [visibles]);

  const elegir = useCallback((slug: string) => {
    setElegida(slug);
    anclaForm.current?.scrollIntoView({
      behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  // `data-ciudad` solo en la PRIMERA pantalla de cada ciudad: es el destino
  // del índice y lo que el observador usa para marcar la ciudad activa.
  const vistas = new Set<string>();

  return (
    <>
      {visibles.length === 0 && (
        <section
          id="inventario"
          aria-label={t.sinCoincidenciasAria}
          className="lpo-pantalla marca-oscura relative flex min-h-[100svh] items-center overflow-hidden"
        >
          <div className="marca-reticula" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[92rem] px-5 py-20 sm:px-8 lg:pr-48">
            <h2 className="marca-titular max-w-[16ch] text-[clamp(2rem,1.3rem+3vw,4rem)] text-white">
              {t.sinCoincidenciasTitulo(total)}
            </h2>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-white/80">
              {t.sinCoincidenciasCuerpo}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={limpiar}
                className="marca-boton min-h-[48px] text-[0.9375rem] font-semibold"
              >
                {t.quitarFiltros}
              </button>
              <button
                type="button"
                onClick={() =>
                  anclaForm.current?.scrollIntoView({
                    behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth',
                    block: 'start',
                  })
                }
                className="lpo-contorno"
              >
                {t.pedirInformacion}
              </button>
            </div>
          </div>
        </section>
      )}

      {visibles.map((p, i) => {
        const ciudad = ubicacionDe(p, 'ciudad');
        const esPrimeraDeCiudad = !vistas.has(ciudad);
        vistas.add(ciudad);
        const esElegida = elegida === p.slug;
        const cifras = caracteristicas(p, locale, copy);

        return (
          <section
            key={p.id}
            id={i === 0 ? 'inventario' : undefined}
            data-ciudad={ciudad}
            data-pantalla-ciudad={esPrimeraDeCiudad ? 'si' : undefined}
            aria-label={p.titulo}
            className="lpo-pantalla marca-oscura relative min-h-[100svh] overflow-hidden"
          >
            <GaleriaFicha
              imagenes={p.imagenes}
              alt={`${p.titulo}, ${ubicacionCorta(p)}`}
              aspecto="h-[100svh]"
              sizes="100vw"
              prioridad={i < 1}
              locale={locale}
              tope={6}
              className="!rounded-none"
            />
            <div className="marca-velo" aria-hidden="true" />

            {/* Contador de pantalla: «3 de 9», arriba a la derecha. */}
            <p className="lpo-pastilla-vidrio marca-cifra pointer-events-none absolute right-5 top-4 text-[0.8125rem] sm:right-8 lg:right-48">
              {t.contador(i + 1, visibles.length, activos > 0)}
            </p>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-6 p-5 pb-24 text-white sm:p-8 sm:pb-10 lg:pr-48">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="lpo-pastilla-vidrio text-[0.875rem]">{ubicacionCorta(p)}</p>
                  <h2 className="marca-titular lpo-sobre-foto mt-3 max-w-[20ch] text-[clamp(1.625rem,1.1rem+2.2vw,3.25rem)]">
                    {p.titulo}
                  </h2>
                  <p className="marca-titular marca-acento marca-cifra lpo-sobre-foto mt-3 text-[clamp(1.75rem,1.3rem+1.8vw,3rem)]">
                    {p.precio ? dinero(p.precio) : t.precioPorConfirmar}
                  </p>
                  <p className="lpo-sobre-foto mt-1.5 text-[0.9375rem] text-white/85">
                    {t.enganche(p.enganchePct)}
                  </p>
                </div>

                {/* Única zona clicable del texto. */}
                <button
                  type="button"
                  onClick={() => elegir(p.slug)}
                  aria-pressed={esElegida}
                  className="marca-boton lpo-elegir pointer-events-auto min-h-[48px] shrink-0 text-[0.9375rem] font-semibold"
                >
                  {esElegida ? t.elegida : t.meInteresa}
                </button>
              </div>

              {/* Las características, en grande y con icono. */}
              {cifras.length > 0 && (
                <ul className="lpo-cifras grid grid-cols-2 gap-x-4 gap-y-4 p-4 sm:flex sm:flex-wrap sm:gap-x-10 sm:p-5">
                  {cifras.map((c) => (
                    <li key={c.etiqueta + c.valor} className="flex min-w-0 items-center gap-3">
                      <span className="lpo-cifra-icono" aria-hidden>
                        <c.icono className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                      </span>
                      <span className="min-w-0">
                        <span className="marca-titular marca-cifra block text-[clamp(1.25rem,1rem+1.2vw,2rem)] leading-none text-white">
                          {c.valor}
                        </span>
                        <span className="lpo-cifra-etiqueta mt-1 block text-[0.8125rem]">{c.etiqueta}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}

      {/* Índice fijo de ciudades, solo escritorio. Sigue a las visibles. */}
      <IndiceCiudades ciudades={ciudadesVisibles} locale={locale} />

      {/* ══ ÚLTIMA PANTALLA: el formulario, directo sobre el fondo ══ */}
      <section
        id="solicitar"
        ref={anclaForm}
        className="lpo-pantalla marca-oscura marca-degradado relative min-h-[100svh] scroll-mt-0 overflow-hidden"
      >
        <div className="marca-reticula" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-[92rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:pr-48">
          <div className="lg:col-span-5">
            <h2 className="marca-titular text-[clamp(2.25rem,1.4rem+3.4vw,4.5rem)] text-white">
              {t.cierreTitulo}
            </h2>
            <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-white/80">
              {t.cierreCuerpo}
            </p>
          </div>
          <div className="lpo-hoja marca-vidrio p-6 sm:p-8 lg:col-span-6 lg:col-start-7">
            <FormInventario
              source={copy.source}
              variante="cierre"
              copy={copy.form}
              opciones={opciones}
              seleccion={elegida}
              onSeleccion={setElegida}
              filtros={filtros}
              propiedades={propiedades}
              telefonoWhatsApp={telefonoWhatsApp}
              locale={locale}
              className="!p-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}
