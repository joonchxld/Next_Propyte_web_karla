'use client';

import { useId, useState } from 'react';
import { mxn } from './format';
import { SELECTOR } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';
import type { OpcionPlazo } from '@/lib/supabase/lp-lotes';

// ============================================================
// Selector de plazo.
//
// La única pieza interactiva del bloque de pagos, y a propósito la más chica
// posible: recibe las opciones YA CALCULADAS en el servidor y solo elige cuál
// mostrar. Ninguna aritmética de dinero cruza al cliente — si mañana el
// esquema del desarrollador cambia, sigue habiendo un solo lugar donde se
// calcula (`construirPlan`), y este componente no se entera.
//
// Radios nativos en vez de botones con `role="radio"`: el manejo de flechas,
// Home/End y el anuncio del grupo salen gratis y correctos. Los inputs van
// `sr-only` y el chip visible es el `<label>`, enganchado con `peer-checked`.
// ============================================================

export default function SelectorPlazo({
  opciones,
  sinIntereses,
  locale = 'es',
}: {
  opciones: OpcionPlazo[];
  sinIntereses: boolean;
  locale?: LocaleLp;
}) {
  const t = SELECTOR[locale];
  // Default al plazo más largo: es la mensualidad más baja y, sobre todo, es la
  // cifra que ya publica el hero. Que el hero y este bloque mostraran números
  // distintos al cargar se leería como un error de la página, no como opción.
  const [meses, setMeses] = useState(
    () => opciones[opciones.length - 1]?.meses ?? null,
  );
  const grupo = useId();

  const activa = opciones.find((o) => o.meses === meses) ?? opciones[0];
  if (!activa) return null;

  const CHIP_BASE =
    'block min-h-[44px] cursor-pointer select-none rounded-full border px-5 py-2.5 text-sm ' +
    'transition-colors duration-150';
  const CHIP_OFF =
    'border-[var(--lp-line)] bg-white text-[var(--lp-ink-soft)] hover:border-[var(--lp-ink-soft)]';
  const CHIP_ON =
    'peer-checked:border-[var(--lp-ink)] peer-checked:bg-[var(--lp-ink)] ' +
    'peer-checked:text-[var(--lp-on-ink)] peer-checked:font-medium';
  const CHIP_FOCUS =
    'peer-focus-visible:outline peer-focus-visible:outline-2 ' +
    'peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--lp-accent)]';

  return (
    <div className="mt-6 rounded-[var(--lp-r-media)] bg-[var(--lp-panel)] p-5 sm:p-6">
      {opciones.length > 1 && (
        <fieldset>
          <legend className="lp-rotulo text-[var(--lp-muted)]">
            {t.elige}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {opciones.map((o) => {
              const id = `${grupo}-${o.meses}`;
              return (
                <div key={o.meses}>
                  <input
                    type="radio"
                    id={id}
                    name={grupo}
                    className="peer sr-only"
                    checked={o.meses === activa.meses}
                    onChange={() => setMeses(o.meses)}
                  />
                  <label htmlFor={id} className={`${CHIP_BASE} ${CHIP_OFF} ${CHIP_ON} ${CHIP_FOCUS}`}>
                    {o.meses} {t.meses}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* `aria-live` para que el cambio de chip se anuncie: sin esto, un lector
          de pantalla mueve el foco entre radios y la cifra cambia en silencio. */}
      <div className="mt-5" aria-live="polite">
        <p className="lp-num text-4xl leading-none text-[var(--lp-ink)]">
          {mxn(activa.mensualidadMxn)}
        </p>
        <p className="mt-2 text-sm text-[var(--lp-ink-soft)]">
          {t.alMes} · {activa.pagos} {t.pagos}
          {sinIntereses && t.sinIntereses}
        </p>
      </div>

      {opciones.length > 1 && (
        <p className="mt-4 max-w-[52ch] text-xs leading-relaxed text-[var(--lp-muted)]">
          {t.nota}
        </p>
      )}
    </div>
  );
}
