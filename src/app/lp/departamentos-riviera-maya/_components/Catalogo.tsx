'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Bath, Bed, Calendar, ChevronLeft, ChevronRight, Eye, Home, Key, Maximize, Waves } from '@/lib/icons';
import type { PropiedadLanding, Ubicacion } from '@/lib/supabase/lp-inventario';
import { claveUbicacion, ubicaciones } from '@/lib/supabase/lp-inventario';
import { dinero, dineroCompacto, m2 } from '../../_components/format';
import type { FiltroDef } from '../../_components/v2/filtros';
import FormInventario from '../../_components/v2/FormInventario';
import GaleriaFicha from '../../_components/v2/GaleriaFicha';
import { ANCLA_INVENTARIO } from '../../_components/v2/ChipsUbicacion';
import { useFiltros } from '../../_components/v2/useFiltros';
import type { LocaleLp } from '../../_components/v2/i18n';
import { estadoTexto, plural, ubicacionCorta } from '../../_components/v2/util';
import { COPY } from '../_copy';

// ============================================================
// Capitulos por ciudad + formulario en linea.
//
// Un capitulo = la ciudad enorme en serif, una linea con el conteo y el
// «desde», y un riel horizontal de laminas verticales. El pie de cada lamina
// va DEBAJO de la foto, como en una revista: la foto no carga texto encima.
//
// FILTROS (30-oct-2026): los capitulos se arman aqui a partir de lo visible.
// La portada, los chips del formulario y esta cuadricula comparten el mismo
// estado por evento (`useFiltros`). Un capitulo sin propiedades no se pinta;
// si no queda nada, un aviso con «quitar filtros» en vez de una pagina vacia.
//
// MARCA (9-nov-2026): laminas en tarjeta blanca redondeada sobre Tech White,
// caracteristicas en tabla Water Dew con iconos en circulo, «Me interesa» en
// pastilla y el formulario en vidrio Aztec sobre el degradado de marca.
//
// Capitulos y formulario viven en el mismo componente porque comparten el
// estado que es el eje de la pagina: «Me interesa» en una lamina deja ese
// departamento elegido abajo y baja hasta el formulario.
// ============================================================

export interface Capitulo {
  ubicacion: Ubicacion;
  propiedades: PropiedadLanding[];
}

/**
 * Caracteristicas grandes con icono, como pidio el brief: lo que tiene cada
 * departamento de un vistazo. Solo datos existentes; lo que falta no sale.
 */
function Specs({ p, locale }: { p: PropiedadLanding; locale: LocaleLp }) {
  const t = COPY[locale].specs;
  const items: { icono: typeof Bed; valor: string; etiqueta: string; clave: string }[] = [];
  if (p.recamaras) items.push({ clave: 'rec', icono: Bed, valor: String(p.recamaras), etiqueta: p.recamaras === 1 ? t.recamara[0] : t.recamara[1] });
  if (p.banos) items.push({ clave: 'ban', icono: Bath, valor: String(p.banos), etiqueta: p.banos === 1 ? t.bano[0] : t.bano[1] });
  if (p.m2Construidos) items.push({ clave: 'm2', icono: Maximize, valor: m2(p.m2Construidos), etiqueta: t.construidos });
  if (p.vista) items.push({ clave: 'vista', icono: p.frenteAlMar ? Waves : Eye, valor: p.vista, etiqueta: t.vista });
  if (p.estadoComercial !== 'disponible') {
    items.push({
      clave: 'estado',
      icono: p.estadoComercial === 'preventa' ? Calendar : Key,
      valor: estadoTexto(locale)[p.estadoComercial],
      etiqueta: t.entrega,
    });
  }
  if (p.entrega) items.push({ clave: 'entrega', icono: Home, valor: p.entrega, etiqueta: t.seEntrega });
  if (items.length === 0) return null;
  return (
    <ul className="lpd-specs marca-vidrio-claro mt-4 grid grid-cols-2 gap-x-3 gap-y-3 p-3" aria-label={t.aria}>
      {items.map(({ clave, icono: Icono, valor, etiqueta }) => (
        <li key={clave} className="flex min-w-0 items-center gap-2.5">
          <span className="marca-icono" aria-hidden>
            <Icono className="h-4 w-4" />
          </span>
          <span className="min-w-0 leading-none">
            <span className="lpd-spec-valor block truncate text-[1rem] text-[var(--marca-aztec)]">{valor}</span>
            <span className="lpd-spec-etiqueta mt-1 block truncate text-[0.75rem]">{etiqueta}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Riel({
  capitulo,
  elegida,
  onElegir,
  prioridad,
  locale,
}: {
  locale: LocaleLp;
  capitulo: Capitulo;
  elegida: string | null;
  onElegir: (slug: string) => void;
  prioridad: boolean;
}) {
  const pista = useRef<HTMLUListElement>(null);
  const t = COPY[locale];
  const { ubicacion, propiedades } = capitulo;
  const desde = propiedades[0]?.precio ?? null;

  const desplazar = useCallback((dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const paso = Math.min(el.clientWidth * 0.8, 3 * 22 * 16);
    el.scrollBy({ left: dir * paso, behavior: 'smooth' });
  }, []);

  return (
    <section id={ubicacion.clave} aria-labelledby={`cap-${ubicacion.clave}`} className="scroll-mt-6 bg-[var(--marca-tech)]">
      <div className="mx-auto max-w-[92rem] px-5 pt-12 sm:px-8 sm:pt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <h2 id={`cap-${ubicacion.clave}`} className="marca-titular text-[clamp(3rem,1.6rem+6vw,7rem)] text-[var(--marca-aztec)]">
            {ubicacion.nombre}
          </h2>
          <div className="flex items-center gap-5 pb-2 sm:pb-4">
            <p className="marca-detalle marca-cifra text-[0.9375rem] font-medium text-[var(--marca-slate)]">
              {plural(propiedades.length, ...t.departamento)}
              {desde ? `${t.riel.desde}${dineroCompacto(desde)}` : ''}
            </p>
            {propiedades.length > 2 && (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => desplazar(-1)}
                  aria-label={t.riel.anteriores(ubicacion.nombre)}
                  className="lpd-flecha h-11 w-11 items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => desplazar(1)}
                  aria-label={t.riel.siguientes(ubicacion.nombre)}
                  className="lpd-flecha h-11 w-11 items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ul
        ref={pista}
        className="lpd-riel mx-auto mt-6 flex max-w-[92rem] gap-5 overflow-x-auto px-5 pb-14 pt-2 sm:px-8 sm:pb-20"
        aria-label={t.riel.lista(ubicacion.nombre)}
      >
        {propiedades.map((p, i) => {
          const esElegida = elegida === p.slug;
          return (
            <li key={p.id} className="lpd-lamina marca-tarjeta w-[min(80vw,22rem)] shrink-0 p-3">
              <GaleriaFicha
                imagenes={p.imagenes}
                alt={`${p.titulo}, ${ubicacionCorta(p)}`}
                aspecto="aspect-[4/5]"
                sizes="(min-width: 640px) 22rem, 80vw"
                prioridad={prioridad && i < 2}
                tope={6}
                locale={locale}
              />
              <div className="mt-4 px-1 pb-1">
                <p className="marca-titular marca-cifra text-[1.5rem] text-[var(--marca-aztec)]">
                  {p.precio ? dinero(p.precio) : t.riel.precioPorConfirmar}
                </p>
                <p className="mt-1.5 line-clamp-2 text-[0.9375rem] leading-snug text-[var(--marca-aztec)]">{p.titulo}</p>
                <p className="marca-detalle mt-1 text-[0.8125rem] text-[var(--marca-teal)]">{ubicacionCorta(p)}</p>
                <Specs p={p} locale={locale} />
                <p className="mt-3 text-[0.8125rem] text-[var(--marca-slate)]">
                  {p.enganchePct ? (
                    <>{t.riel.enganche(p.enganchePct)}</>
                  ) : (
                    <span className="border-b border-dotted border-[var(--marca-teal)] text-[var(--marca-teal)]">
                      {t.riel.enganchePorConfirmar}
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => onElegir(p.slug)}
                  aria-pressed={esElegida}
                  className="marca-boton lpd-elegir mt-4"
                >
                  {esElegida ? t.riel.elegido : t.riel.meInteresa}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function Catalogo({
  todos,
  defs,
  telefonoWhatsApp,
  locale = 'es',
}: {
  locale?: LocaleLp;
  todos: PropiedadLanding[];
  defs: FiltroDef[];
  telefonoWhatsApp: string;
}) {
  const t = COPY[locale];
  const [elegida, setElegida] = useState<string | null>(null);
  const anclaForm = useRef<HTMLDivElement>(null);
  const { visibles, activos, limpiar } = useFiltros(todos, defs);

  // Las opciones del formulario siguen el filtro: lo elegido arriba es lo
  // que se puede marcar abajo. Si la elegida sale del filtro, se suelta.
  const opciones = visibles.map((p) => ({ slug: p.slug, titulo: p.titulo }));
  const elegidaVisible = elegida && visibles.some((p) => p.slug === elegida) ? elegida : null;

  // Capitulos: una ciudad por capitulo, de mas a menos inventario. Dentro de
  // cada uno el orden es el del inventario (precio ascendente).
  const capitulos = useMemo<Capitulo[]>(
    () =>
      ubicaciones(visibles, 'ciudad').map((u) => ({
        ubicacion: u,
        propiedades: visibles.filter((p) => claveUbicacion(p.ciudad) === u.clave),
      })),
    [visibles],
  );

  const elegir = useCallback((slug: string) => {
    setElegida(slug);
    anclaForm.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <div id={ANCLA_INVENTARIO} className="scroll-mt-4 bg-[var(--marca-tech)]">
        {activos > 0 && (
          <div className="mx-auto flex max-w-[92rem] flex-wrap items-center justify-between gap-3 px-5 pt-8 sm:px-8">
            <p aria-live="polite" className="marca-cifra text-[0.9375rem] text-[var(--marca-slate)]">
              {visibles.length === 0
                ? t.catalogo.ninguno
                : `${plural(visibles.length, t.catalogo.coincidenSing, t.catalogo.coincidenPlural)}${t.catalogo.coincidenResto}`}
            </p>
            <button type="button" onClick={limpiar} className="lpd-contorno">
              {t.catalogo.quitarFiltros}
            </button>
          </div>
        )}

        {capitulos.map((c, i) => (
          <Riel key={c.ubicacion.clave} capitulo={c} elegida={elegidaVisible} onElegir={elegir} prioridad={i === 0} locale={locale} />
        ))}

        {visibles.length === 0 && (
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <p className="marca-titular max-w-[22ch] text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-[var(--marca-aztec)]">
              {t.catalogo.sinResultadosTitulo}
            </p>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-[var(--marca-slate)]">
              {t.catalogo.sinResultadosCuerpo}
            </p>
          </div>
        )}
      </div>

      <section
        id="solicitar"
        ref={anclaForm}
        className="marca-oscura marca-degradado relative scroll-mt-6 overflow-hidden pb-28 sm:pb-0"
      >
        <div className="marca-reticula" aria-hidden />
        <div className="relative mx-auto max-w-[36rem] px-5 py-16 sm:px-0 sm:py-24">
          <h2 className="marca-titular text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-white">
            {activos > 0 && visibles.length > 0
              ? visibles.length === 1
                ? t.catalogo.cierreUno
                : t.catalogo.cierreVarios(visibles.length)
              : t.catalogo.cierreTodos(todos.length)}
          </h2>
          <div className="lpd-hoja marca-vidrio mt-10 p-6 sm:p-8">
            <FormInventario
              source={t.fuente}
              variante="cierre"
              copy={t.form}
              locale={locale}
              opciones={opciones}
              seleccion={elegidaVisible}
              onSeleccion={setElegida}
              filtros={defs}
              propiedades={todos}
              telefonoWhatsApp={telefonoWhatsApp}
              className="!p-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}
