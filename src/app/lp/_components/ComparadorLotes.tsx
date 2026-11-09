'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@/lib/icons';
import { m2, mxn } from './format';
import { COMPARADOR } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';
import { DisclaimerCifras } from './ui';
import GaleriaFicha from './v2/GaleriaFicha';
import { ANCLA_INVENTARIO, ChipsUbicacion, TODAS, useFiltroUbicacion } from './v2/ChipsUbicacion';
import type { LoteComparable } from '@/lib/supabase/lp-lotes-comparador';
import type { PropiedadLanding } from '@/lib/supabase/lp-inventario';

// ============================================================
// Terrenos de la Riviera Maya: fichas con galería + plan por plazo.
//
// Cambios del brief de octubre-2026 sobre la versión anterior (chips de texto
// y un solo bloque de cifras):
//   · Cada lote es una FICHA con sus fotos en carrusel, no un chip. Las
//     imágenes vienen del Hub y pueden ser renders: se rotula debajo.
//   · Botones de UBICACIÓN como filtro, también disparables desde el hero
//     (`ChipsHero` en la página emite el evento que `useFiltroUbicacion`
//     escucha). Solo aparecen si hay más de una ciudad.
//   · El texto queda en una sola línea de comercializadora. La regla de la
//     mensualidad baja al pie de la sección, pequeña.
//
// CAMINO A intacto: la etiqueta es ubicación + superficie + precio. El data
// layer no selecciona nombres de desarrollo.
//
// EL PRECIO PUEDE CAMBIAR CON EL PLAZO. Se publica el precio de ESE plazo.
// ============================================================

/** Adaptador mínimo para reutilizar el filtro de ubicación de la familia v2. */
function comoPropiedad(l: LoteComparable): PropiedadLanding {
  return {
    id: l.id,
    slug: l.id,
    titulo: l.etiqueta,
    tipo: 'Lote',
    ciudad: l.ciudad,
    estado: '',
    zona: null,
    recamaras: null,
    banos: null,
    m2Construidos: null,
    m2Terreno: l.superficieM2,
    precio: { monto: l.precioListaMxn, moneda: 'MXN' },
    precioM2Mxn: null,
    enganchePct: null,
    engancheMxn: null,
    mesesOpciones: l.plazos.map((p) => p.meses),
    estacionamientos: null,
    alberca: false,
    entrega: null,
    estadoComercial: 'disponible',
    vista: null,
    frenteAlMar: false,
    imagen: l.imagenes[0] ?? null,
    imagenes: l.imagenes,
    creditos: { infonavit: false, fovissste: false, hipotecario: false, directo: false },
    mensualidadMxn: null,
    amueblado: false,
    equipado: false,
    descuentoPct: null,
    desarrolloId: null,
    coordenadas: null,
  };
}

export default function ComparadorLotes({
  lotes,
  locale = 'es',
}: {
  lotes: LoteComparable[];
  locale?: LocaleLp;
}) {
  const t = COMPARADOR[locale];
  // En español se usa la etiqueta que ya trae el data layer; en inglés se
  // rearma desde los campos crudos (ciudad, superficie, precio).
  const etiquetaDe = (l: LoteComparable) =>
    t.etiqueta
      ? t.etiqueta(l.ciudad, l.superficieM2 ? m2(l.superficieM2) : null, mxn(l.precioListaMxn))
      : l.etiqueta;
  const grupoPlazo = useId();
  const propiedades = useMemo(() => lotes.map(comoPropiedad), [lotes]);
  const { activa, setActiva, visibles, ubicaciones } = useFiltroUbicacion(propiedades, 'ciudad');
  const [loteId, setLoteId] = useState(() => lotes[0]?.id ?? null);
  const [plazoIdx, setPlazoIdx] = useState<number | null>(null);
  // Carrusel de fichas (ejemplo del brief del 30-oct-2026): riel con
  // scroll-snap, flechas y contador «01 / 06». El índice sigue al scroll.
  const riel = useRef<HTMLUListElement>(null);
  const [tarjeta, setTarjeta] = useState(0);
  useEffect(() => {
    const el = riel.current;
    if (!el) return;
    let marco = 0;
    function onScroll() {
      cancelAnimationFrame(marco);
      marco = requestAnimationFrame(() => {
        if (!el) return;
        const ancho = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
        setTarjeta(Math.round(el.scrollLeft / (ancho + 16)));
      });
    }
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(marco);
    };
  }, []);
  const desplazar = (delta: number) => {
    const el = riel.current;
    if (!el) return;
    const ancho = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 320;
    el.scrollBy({ left: delta * (ancho + 16), behavior: 'smooth' });
  };

  // Si el filtro deja fuera al lote elegido, se elige el primero visible.
  useEffect(() => {
    if (visibles.length > 0 && !visibles.some((v) => v.id === loteId)) {
      setLoteId(visibles[0].id);
      setPlazoIdx(null);
    }
  }, [visibles, loteId]);

  if (lotes.length < 2) return null;

  const lote = lotes.find((l) => l.id === loteId) ?? lotes[0];
  if (!lote) return null;

  const idxActivo = plazoIdx ?? lote.plazos.length - 1;
  const plazo = lote.plazos[Math.min(idxActivo, lote.plazos.length - 1)] ?? null;
  const hayDescuento = plazo !== null && plazo.descuentoPct > 0;
  const lotesVisibles = visibles.map((v) => lotes.find((l) => l.id === v.id)!).filter(Boolean);

  const CHIP =
    'lp-num block cursor-pointer select-none rounded-[var(--lp-r-control)] border px-4 py-2.5 text-sm ' +
    'transition-colors duration-150 border-[var(--lp-line-dark)] text-[var(--lp-on-dark-soft)] ' +
    'hover:border-[var(--lp-on-dark-soft)] hover:text-[var(--lp-on-dark)] ' +
    'peer-checked:border-[var(--lp-accent-on-dark)] peer-checked:bg-[var(--lp-accent-on-dark)] ' +
    'peer-checked:text-[var(--lp-dark)] peer-checked:font-medium ' +
    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ' +
    'peer-focus-visible:outline-[var(--lp-accent-on-dark)]';

  return (
    <section
      id={ANCLA_INVENTARIO}
      aria-labelledby="comparador-titulo"
      className="scroll-mt-2 bg-[var(--lp-dark-2)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2
          id="comparador-titulo"
          className="max-w-[24ch] lp-display text-[clamp(1.5rem,1.2rem+1.1vw,2.125rem)] leading-tight tracking-[-0.02em] text-balance text-[var(--lp-on-dark)]"
        >
                    {t.titulo}
        </h2>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-[var(--lp-on-dark-soft)]">
          {t.intro}
        </p>

        {ubicaciones.length > 1 && (
          <div className="mt-7">
            <ChipsUbicacion
              ubicaciones={ubicaciones}
              activa={activa}
              onChange={(clave) => {
                setActiva(clave);
                setPlazoIdx(null);
              }}
              locale={locale}
              tono="oscuro"
            />
          </div>
        )}

        {/* Fichas con galería en carrusel. La ficha entera es el control de
            selección; las flechas y el contador van arriba a la derecha. */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="lp-num text-xs text-[var(--lp-on-dark-soft)]">
            {String(Math.min(tarjeta, Math.max(lotesVisibles.length - 1, 0)) + 1).padStart(2, '0')} / {String(lotesVisibles.length).padStart(2, '0')}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => desplazar(-1)} aria-label={t.anterior} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--lp-line-dark)] text-[var(--lp-on-dark)] transition-colors hover:border-[var(--lp-on-dark)]">
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => desplazar(1)} aria-label={t.siguiente} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--lp-line-dark)] text-[var(--lp-on-dark)] transition-colors hover:border-[var(--lp-on-dark)]">
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul ref={riel} className="lpv-galeria mt-4 flex gap-4 overflow-x-auto pb-1">
          {lotesVisibles.map((l) => {
            const elegido = l.id === lote.id;
            return (
              <li
                key={l.id}
                className={`w-[min(78vw,22rem)] shrink-0 snap-start overflow-hidden rounded-[var(--lp-r-media)] border transition-colors duration-150 ${
                  elegido
                    ? 'border-[var(--lp-accent-on-dark)] bg-[var(--lp-dark)]'
                    : 'border-[var(--lp-line-dark)] hover:border-[var(--lp-on-dark-soft)]'
                }`}
              >
                {/* La galeria va FUERA del boton: un <button> no puede
                    contener los botones de las flechas (HTML invalido y
                    error de hidratacion). El pie es el control de seleccion. */}
                <GaleriaFicha
                    imagenes={l.imagenes}
                    alt={etiquetaDe(l)}
                    locale={locale}
                    aspecto="aspect-[4/3]"
                    sizes="(min-width: 1024px) 30vw, 46vw"
                    tope={8}
                    className="!rounded-none"
                  />
                <button
                  type="button"
                  aria-pressed={elegido}
                  onClick={() => {
                    setLoteId(l.id);
                    setPlazoIdx(null);
                  }}
                  className="block w-full text-left"
                >
                  <div className="p-3 sm:p-4">
                    <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--lp-on-dark-soft)]">
                      {l.ciudad}
                      {l.esDeEstaLanding ? t.esDeEstaLanding : ''}
                    </p>
                    <p className="lp-num mt-1 text-sm text-[var(--lp-on-dark)]">
                      {l.superficieM2 ? `${l.superficieM2} m²` : t.superficiePorConfirmar}
                    </p>
                    <p className="lp-num mt-1 text-base font-medium text-[var(--lp-on-dark)]">
                      {mxn(l.precioListaMxn)}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-[var(--lp-on-dark-soft)]">
          {t.imagenes}
        </p>

        <div className="mt-8 rounded-[var(--lp-r-media)] border border-[var(--lp-line-dark)] p-6">
          <p className="lp-num text-sm text-[var(--lp-on-dark)]">{etiquetaDe(lote)}</p>

          {lote.plazos.length > 1 && (
            <fieldset className="mt-5">
              <legend className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--lp-on-dark-soft)]">
                                {t.plazo}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {lote.plazos.map((p, i) => {
                  const id = `${grupoPlazo}-${lote.id}-${p.meses}`;
                  return (
                    <div key={p.meses}>
                      <input
                        type="radio"
                        id={id}
                        name={`${grupoPlazo}-${lote.id}`}
                        className="peer sr-only"
                        checked={p.meses === plazo?.meses}
                        onChange={() => setPlazoIdx(i)}
                      />
                      <label htmlFor={id} className={CHIP}>
                        {p.meses} {t.meses}
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-6" aria-live="polite">
            {plazo ? (
              <>
                <p className="lp-num text-4xl leading-none text-[var(--lp-on-dark)]">
                  {mxn(plazo.mensualidadMxn)}
                </p>
                <p className="mt-2 text-sm text-[var(--lp-on-dark-soft)]">
                  {t.alMes} · {t.pagosSinIntereses(plazo.pagos)}
                </p>

                {hayDescuento ? (
                  <p className="mt-4 text-sm text-[var(--lp-on-dark-soft)]">
                    {t.descuentoA(plazo.meses)}{' '}
                    <span className="lp-num text-[var(--lp-on-dark)]">{mxn(plazo.precioMxn)}</span>
                    {t.descuentoB(plazo.descuentoPct.toFixed(1))}{' '}
                    {mxn(lote.precioListaMxn)} {t.descuentoC}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-[var(--lp-on-dark-soft)]">
                    {t.precio}{' '}
                    <span className="lp-num text-[var(--lp-on-dark)]">{mxn(plazo.precioMxn)}</span>
                  </p>
                )}

                <dl className="mt-5 border-t border-[var(--lp-line-dark)]">
                  {[
                    { k: t.enganche, v: plazo.engancheMxn, nota: t.alFirmar },
                    {
                      k: t.mensualidades,
                      v: plazo.mensualidadMxn * plazo.pagos,
                      nota: t.pagosDe(plazo.pagos, mxn(plazo.mensualidadMxn)),
                    },
                    {
                      k: t.contraentrega,
                      v: plazo.contraentregaMxn,
                      nota:
                        plazo.contraentregaVia === 'hipotecario'
                          ? t.alEntregarHipotecario
                          : t.alEntregar,
                    },
                  ]
                    .filter((f) => f.v > 0)
                    .map((f) => (
                      <div
                        key={f.k}
                        className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[var(--lp-line-dark)] py-3.5"
                      >
                        <dt className="text-sm text-[var(--lp-on-dark-soft)]">
                          {f.k}
                          <span className="lp-num block text-xs opacity-70">{f.nota}</span>
                        </dt>
                        <dd className="lp-num text-right text-sm text-[var(--lp-on-dark)]">{mxn(f.v)}</dd>
                      </div>
                    ))}
                </dl>
              </>
            ) : (
              <>
                <p className="lp-num text-3xl leading-none text-[var(--lp-on-dark)]">
                  {mxn(lote.precioListaMxn)}
                </p>
                <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-[var(--lp-on-dark-soft)]">
                  {t.motivo && lote.motivoSinPlanCodigo
                    ? t.motivo(lote.motivoSinPlanCodigo, lote.contado)
                    : lote.motivoSinPlan}
                </p>
                {lote.contado && lote.contado.descuentoPct > 0 && (
                  <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-[var(--lp-on-dark-soft)]">
                    {t.contadoA}{' '}
                    {lote.contado.descuentoPct.toFixed(0)}%:{' '}
                    <span className="lp-num text-[var(--lp-on-dark)]">{mxn(lote.contado.precioMxn)}</span>.
                  </p>
                )}
              </>
            )}

            {lote.apartadoMxn !== null && (
              <p className="mt-4 text-sm text-[var(--lp-on-dark-soft)]">
                {t.apartadoA}{' '}
                <span className="lp-num text-[var(--lp-on-dark)]">{mxn(lote.apartadoMxn)}</span>.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <DisclaimerCifras tono="oscuro" alcance="cadaDesarrollador" locale={locale} />
          <p className="mt-2 max-w-[62ch] text-xs leading-relaxed text-[var(--lp-on-dark-soft)]">
            {t.soloPublicamos}
          </p>
        </div>

        <div className="mt-7">
          <a
            href="#solicitar"
            className="inline-flex min-h-[52px] cursor-pointer items-center justify-center rounded-[var(--lp-r-control)] border border-[var(--lp-accent-on-dark)]/45 px-7 text-sm font-medium text-[var(--lp-accent-on-dark)] transition-colors duration-200 hover:border-[var(--lp-accent-on-dark)] hover:bg-[var(--lp-accent-on-dark)]/10"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
