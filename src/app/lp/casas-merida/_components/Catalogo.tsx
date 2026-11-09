'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import type { PropiedadLanding } from '@/lib/supabase/lp-inventario';
import { BadgeCheck, Bath, Bed, Key, Ruler, Square } from '@/lib/icons';
import { dinero, m2, mxn } from '../../_components/format';
import FormInventario from '../../_components/v2/FormInventario';
import GaleriaFicha from '../../_components/v2/GaleriaFicha';
import type { FiltroDef } from '../../_components/v2/filtros';
import { useFiltros } from '../../_components/v2/useFiltros';
import { estadoTexto, ubicacionCorta } from '../../_components/v2/util';
import type { LocaleLp } from '../../_components/v2/i18n';
import type { CopyForm } from '../../_components/v2/FormInventario';
import type { CopyCatalogoMerida } from '../_copy';

// ============================================================
// El dossier: la casa principal en una sola vista, y debajo lo demás.
//
// Segunda pasada (30-oct-2026): la página abre con un GANCHO, no con el
// precio. Si el desarrollador declara que acepta Infonavit o Fovissste, el
// titular lo dice y los créditos aparecen como chips que filtran y bajan al
// formulario. Es el dato que más decide en este segmento, y es el que casi
// nadie publica de frente.
//
// LOS FILTROS SON UNO SOLO. El estado vive en `useFiltros`: los chips del
// encabezado, los del formulario y la lista comparten la selección por
// evento. El dossier es siempre la primera casa visible; el resto va abajo.
//
// LA PÁGINA ES LA FICHA. Izquierda: la galería, fija al hacer scroll en
// escritorio. Derecha: el gancho, la hoja de solicitud y la ficha (precio
// enorme, título, características con icono).
//
// MARCA (9-nov-2026): el gancho entra en la columna derecha y la hoja sube
// tras él, en vidrio Aztec, para que el formulario quede en el primer pliegue
// (también en móvil, con la galería más baja). Características en tabla
// Water Dew con iconos en círculo, créditos en pastillas Onahau, galería y
// mosaico redondeados, todo lo pulsable en pastilla.
// ============================================================

interface Spec {
  icono: typeof Bed;
  valor: string;
  etiqueta: string;
}

/** Solo lo que el Hub declara. Ningún dato se estima. */
function specs(casa: PropiedadLanding, t: CopyCatalogoMerida): Spec[] {
  const lista: Spec[] = [];
  if (casa.recamaras) {
    lista.push({ icono: Bed, valor: String(casa.recamaras), etiqueta: casa.recamaras === 1 ? t.recamara[0] : t.recamara[1] });
  }
  if (casa.banos) {
    lista.push({ icono: Bath, valor: String(casa.banos), etiqueta: casa.banos === 1 ? t.bano[0] : t.bano[1] });
  }
  if (casa.m2Construidos) lista.push({ icono: Ruler, valor: m2(casa.m2Construidos), etiqueta: t.construidos });
  if (casa.m2Terreno) lista.push({ icono: Square, valor: m2(casa.m2Terreno), etiqueta: t.deTerreno });
  return lista;
}

/** Sin sellos de crédito cuando `mostrarCreditos` es false (inglés; ver `_copy.ts`). */
function creditosDe(casa: PropiedadLanding, t: CopyCatalogoMerida): string[] {
  if (!t.mostrarCreditos) return [];
  const lista: string[] = [];
  if (casa.creditos.infonavit) lista.push(t.aceptaInfonavit);
  if (casa.creditos.fovissste) lista.push(t.aceptaFovissste);
  if (casa.creditos.hipotecario) lista.push(t.aceptaBancario);
  return lista;
}

function Creditos({ casa, t, tamano = 'md' }: { casa: PropiedadLanding; t: CopyCatalogoMerida; tamano?: 'md' | 'sm' }) {
  const lista = creditosDe(casa, t);
  if (lista.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {lista.map((texto) => (
        <li key={texto} className={`marca-pastilla ${tamano === 'md' ? 'lpme-pastilla-md' : ''}`}>
          <BadgeCheck className={tamano === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden />
          {texto}
        </li>
      ))}
    </ul>
  );
}

/** Pastilla de índice: blanca con filete; pulsada, Aztec con texto New Aqua. */
function chipHook(activo: boolean) {
  return `lpme-chip marca-detalle inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.9375rem] leading-none active:translate-y-px ${
    activo ? 'lpme-chip-activo' : ''
  }`;
}

export default function Catalogo({
  casas,
  filtros: defs,
  telefonoWhatsApp,
  locale = 'es',
  copy: t,
  form,
  source,
}: {
  casas: PropiedadLanding[];
  filtros: FiltroDef[];
  telefonoWhatsApp: string;
  locale?: LocaleLp;
  copy: CopyCatalogoMerida;
  form: CopyForm;
  /** Fuente del lead: cambia por idioma (`lp_casas_merida` / `lp_casas_merida_en`). */
  source: 'lp_casas_merida' | 'lp_casas_merida_en';
}) {
  const estados = estadoTexto(locale);
  const { seleccion, alternar, limpiar, visibles, activos } = useFiltros(casas, defs);
  const principal = visibles[0] ?? casas[0];
  const otras = visibles.slice(1);
  const opciones = casas.map((c) => ({ slug: c.slug, titulo: c.titulo }));
  const [elegida, setElegida] = useState<string | null>(principal?.slug ?? null);

  const irAlFormulario = useCallback(() => {
    document.getElementById('solicitar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const elegir = useCallback(
    (slug: string) => {
      setElegida(slug);
      irAlFormulario();
    },
    [irAlFormulario],
  );

  if (!principal) return null;

  const conCredito = t.mostrarCreditos && casas.some((c) => c.creditos.infonavit || c.creditos.fovissste);
  const filtroCredito = defs.find((d) => d.id === 'credito');
  const desde = casas[0]?.precio ?? null;
  const enganches = casas.map((c) => c.enganchePct).filter((e): e is number => e !== null && e > 0);
  const enganche = enganches.length > 0 ? Math.min(...enganches) : null;
  const zonas = [...new Set(casas.map(ubicacionCorta))];
  const fotos = principal.imagenes;
  const listaSpecs = specs(principal, t);

  const apoyo = [
    desde ? (casas.length > 1 ? t.desde.replace('{precio}', dinero(desde)) : dinero(desde)) : null,
    enganche ? t.enganche.replace('{pct}', String(enganche)) : null,
    zonas.length > 0 ? t.en.replace('{zona}', zonas.join(` ${t.unir} `)) : null,
  ]
    .filter((t): t is string => t !== null)
    .join(', ');

  return (
    <>
      {/* ══ EL DOSSIER: galería fija a la izquierda; a la derecha el gancho, la
          hoja de solicitud y la ficha completa ══ */}
      <section id="hero" className="grid lg:min-h-[100svh] lg:grid-cols-2">
        <div className="lpme-galeria lg:sticky lg:top-0 lg:h-[100svh] lg:p-3">
          <GaleriaFicha
            key={principal.id}
            imagenes={fotos}
            alt={`${principal.titulo}, ${ubicacionCorta(principal)}`}
            locale={locale}
            aspecto="h-[max(38svh,17rem)] lg:h-[calc(100svh-1.5rem)]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            prioridad
            tope={10}
          />
        </div>

        <div className="px-5 pb-16 pt-7 sm:px-10 lg:px-12 lg:pb-24 lg:pt-24 xl:px-16">
          {/* El gancho: titular de crédito (o neutro) y el dato de apoyo. */}
          <h1 className="marca-titular max-w-[22ch] text-[clamp(1.75rem,1.2rem+1.8vw,3rem)] text-[var(--lpv-fg)]">
            {conCredito ? t.tituloCredito : t.tituloBase}
          </h1>
          {apoyo && (
            <p className="marca-cifra mt-3 max-w-[44ch] text-[clamp(1.0625rem,1rem+0.4vw,1.3125rem)] leading-snug text-[var(--lpv-fg-2)]">
              {apoyo}.
            </p>
          )}

          {/* Cómo pagar: en móvil se omite porque el mismo filtro va dentro
              de la hoja, justo debajo, y así el formulario entra en el
              primer pliegue. */}
          {filtroCredito && t.mostrarCreditos && (
            <div className="mt-6 hidden sm:block">
              <p className="marca-detalle text-[0.9375rem] text-[var(--lpv-fg-3)]">{t.comoPagar}</p>
              <div role="group" aria-label={t.comoPagar} className="mt-3 flex flex-wrap gap-2">
                {filtroCredito.opciones.map((o) => {
                  const activo = seleccion.credito === o.valor;
                  return (
                    <button
                      key={o.valor}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => {
                        alternar('credito', o.valor);
                        irAlFormulario();
                      }}
                      className={chipHook(activo)}
                    >
                      <BadgeCheck className="h-4 w-4" aria-hidden />
                      {o.etiqueta}
                      {casas.length > 1 && <span className="lpv-cifra opacity-70">{o.total}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* La hoja: vidrio Aztec, en el primer pliegue. */}
          <div id="solicitar" className="lpme-hoja marca-vidrio mt-6 scroll-mt-6 overflow-hidden sm:mt-8">
            <FormInventario
              source={source}
              variante="hero"
              locale={locale}
              copy={form}
              opciones={opciones}
              seleccion={elegida}
              onSeleccion={setElegida}
              filtros={defs}
              propiedades={casas}
              telefonoWhatsApp={telefonoWhatsApp}
            />
          </div>

          {/* La ficha de la casa. */}
          <div className="mt-12 lg:mt-16">
            <p className="marca-detalle text-[0.9375rem] text-[var(--lpv-fg-2)]">
              {t.casaEnVenta.replace('{ubicacion}', ubicacionCorta(principal))}
            </p>
            <p className="marca-titular marca-cifra mt-3 whitespace-nowrap text-[clamp(2.25rem,1.2rem+2.6vw,3.75rem)] text-[var(--lpv-fg)]">
              {principal.precio ? dinero(principal.precio) : t.precioPorConfirmar}
            </p>
            <h2 className="lpme-titulo mt-3 max-w-[28ch] text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] text-[var(--lpv-fg)]">
              {principal.titulo}
            </h2>

            {listaSpecs.length > 0 && (
              <dl className="marca-vidrio-claro mt-7 grid grid-cols-2 overflow-hidden">
                {listaSpecs.map((s) => (
                  <div key={s.etiqueta} className="flex items-center gap-3 border-b border-[rgb(72_115_121/0.12)] px-3.5 py-3.5">
                    <span className="marca-icono">
                      <s.icono className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <dt className="sr-only">{s.etiqueta}</dt>
                      <dd className="marca-cifra text-[1.0625rem] font-semibold leading-tight text-[var(--lpv-fg)]">{s.valor}</dd>
                      <dd aria-hidden className="text-[0.8125rem] leading-tight text-[var(--lpv-fg-3)]">
                        {s.etiqueta}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}

            <dl className="marca-tarjeta mt-4 px-5 py-1">
              {principal.estacionamientos ? (
                <div className="grid grid-cols-[9rem_1fr] items-baseline gap-4 border-b border-[var(--lpv-line)] py-3.5">
                  <dt className="marca-detalle text-[0.9375rem] text-[var(--lpv-fg-3)]">{t.estacionamiento}</dt>
                  <dd className="marca-cifra text-[1.0625rem] font-semibold text-[var(--lpv-fg)]">
                    {principal.estacionamientos} {principal.estacionamientos === 1 ? t.auto[0] : t.auto[1]}
                  </dd>
                </div>
              ) : null}
              {principal.enganchePct ? (
                <div className="grid grid-cols-[9rem_1fr] items-baseline gap-4 border-b border-[var(--lpv-line)] py-3.5">
                  <dt className="marca-detalle text-[0.9375rem] text-[var(--lpv-fg-3)]">{t.engancheEtiqueta}</dt>
                  <dd className="marca-cifra text-[1.0625rem] font-semibold text-[var(--lpv-fg)]">
                    {principal.enganchePct}%{principal.engancheMxn ? ` · ${mxn(principal.engancheMxn)}` : ''}
                  </dd>
                </div>
              ) : null}
              <div className="grid grid-cols-[9rem_1fr] items-baseline gap-4 py-3.5">
                <dt className="marca-detalle text-[0.9375rem] text-[var(--lpv-fg-3)]">{t.estado}</dt>
                <dd className="inline-flex items-center gap-2 text-[1.0625rem] font-semibold text-[var(--lpv-fg)]">
                  <Key className="h-4 w-4 text-[var(--lpv-fg-3)]" aria-hidden />
                  {estados[principal.estadoComercial]}
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <Creditos casa={principal} t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ MOSAICO: todas las fotos de la casa principal, sin rótulos ══ */}
      {fotos.length > 1 && (
        <section className="lpme-mosaico bg-[var(--lpv-bg-2)]">
          <div className="mx-auto max-w-[96rem] px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="marca-titular text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] text-[var(--lpv-fg)]">
              {t.fotos.replace('{n}', String(fotos.length))}
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
              {fotos.map((src, i) => (
                <figure
                  key={src}
                  className={`relative overflow-hidden rounded-[var(--marca-r-s)] bg-[var(--lpv-bg)] sm:rounded-[var(--marca-r)] ${
                    i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={src}
                    alt={t.fotoAlt.replace('{titulo}', principal.titulo).replace('{n}', String(i + 1))}
                    fill
                    loading="lazy"
                    sizes={i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ OTRAS CASAS, el aviso de filtro vacío, o la línea de comercializadora ══ */}
      {visibles.length === 0 ? (
        <section className="mx-auto max-w-[60rem] px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="lpme-titulo text-[clamp(1.375rem,1.1rem+1.4vw,2.25rem)] text-[var(--lpv-fg)]">
            {t.sinCoincidencias}
          </p>
          <button
            type="button"
            onClick={limpiar}
            className="lpme-chip marca-detalle mt-7 inline-flex min-h-[48px] cursor-pointer items-center rounded-full border px-6 text-[1rem]"
          >
            {t.quitarFiltros}
          </button>
        </section>
      ) : otras.length > 0 || activos > 0 ? (
        <section className="mx-auto max-w-[96rem] px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="marca-titular text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] text-[var(--lpv-fg)]">
              {otras.length > 0 ? t.otras : t.unaCoincide}
            </h2>
            {activos > 0 && (
              <button
                type="button"
                onClick={limpiar}
                className="lpme-chip marca-detalle inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-5 text-[0.9375rem]"
              >
                {t.quitarFiltros}
              </button>
            )}
          </div>
          {otras.length > 0 && (
            <ul className="mt-10 grid gap-4">
              {otras.map((casa) => {
                const lista = specs(casa, t);
                const esElegida = elegida === casa.slug;
                return (
                  <li key={casa.id} className="marca-tarjeta grid gap-6 p-3 lg:grid-cols-12 lg:p-4">
                    <figure className="relative aspect-[4/3] overflow-hidden rounded-[var(--marca-r)] bg-[var(--lpv-bg-2)] lg:col-span-4">
                      {casa.imagen && (
                        <Image
                          src={casa.imagen}
                          alt={`${casa.titulo}, ${ubicacionCorta(casa)}`}
                          fill
                          sizes="(min-width: 1024px) 30vw, 100vw"
                          className="object-cover"
                        />
                      )}
                    </figure>
                    <div className="px-2 pb-3 lg:col-span-8 lg:px-0 lg:py-2">
                      <p className="marca-titular marca-cifra text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] text-[var(--lpv-fg)]">
                        {casa.precio ? dinero(casa.precio) : t.precioPorConfirmar}
                      </p>
                      <p className="lpme-titulo mt-3 text-[1.125rem] text-[var(--lpv-fg)]">{casa.titulo}</p>
                      <p className="marca-detalle mt-1 text-[0.9375rem] text-[var(--lpv-fg-3)]">{ubicacionCorta(casa)}</p>
                      {lista.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                          {lista.map((s) => (
                            <li key={s.etiqueta} className="inline-flex items-center gap-2 text-[var(--lpv-fg-2)]">
                              <span className="marca-icono lpme-icono-s">
                                <s.icono className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                              </span>
                              <span className="marca-cifra text-[1.0625rem] font-semibold text-[var(--lpv-fg)]">{s.valor}</span>
                              <span className="text-[0.875rem] text-[var(--lpv-fg-3)]">{s.etiqueta}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-4">
                        <Creditos casa={casa} t={t} tamano="sm" />
                      </div>
                      <button
                        type="button"
                        onClick={() => elegir(casa.slug)}
                        aria-pressed={esElegida}
                        className={`marca-boton mt-6 cursor-pointer ${esElegida ? 'lpme-boton-elegido' : ''}`}
                      >
                        {esElegida ? t.elegida : t.meInteresa}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : (
        <section className="marca-degradado relative overflow-hidden">
          <div className="marca-reticula" aria-hidden="true" />
          <div className="relative mx-auto max-w-[60rem] px-5 py-20 text-center sm:px-8 sm:py-28">
            <p className="lpme-titulo text-[clamp(1.375rem,1.1rem+1.4vw,2.25rem)] text-white">{t.otraOpcion}</p>
            <a href="#solicitar" className="marca-boton lpme-boton-claro mt-8">
              {t.pedirOtra}
            </a>
          </div>
        </section>
      )}
    </>
  );
}
