'use client';

import { useEffect, useState } from 'react';
import { TODAS, emitirUbicacion } from '../../_components/v2/ChipsUbicacion';
import { COPY, type LocaleCasas } from '../_copy';

// ============================================================
// Colofón: la franja negra bajo la portada.
//
// Hace dos trabajos con las mismas cifras: dice cuánto inventario hay y
// dónde, y las ciudades SON el filtro de las láminas (emite el mismo evento
// `lpv:ubicacion` que escucha `useFiltroUbicacion`, que además baja al
// inventario). También escucha el evento, para quedar sincronizado cuando el
// filtro se cambia desde el índice de las láminas.
// ============================================================

export interface CiudadColofon {
  clave: string;
  etiqueta: string;
  total: number;
}

export default function Colofon({
  ciudades,
  total,
  datos,
  locale = 'es',
}: {
  ciudades: CiudadColofon[];
  total: number;
  datos: string[];
  locale?: LocaleCasas;
}) {
  const copy = COPY[locale];
  const [activa, setActiva] = useState<string>(TODAS);

  useEffect(() => {
    function onEvento(e: Event) {
      setActiva((e as CustomEvent<string>).detail || TODAS);
    }
    window.addEventListener('lpv:ubicacion', onEvento);
    return () => window.removeEventListener('lpv:ubicacion', onEvento);
  }, []);

  const opciones = [{ clave: TODAS, etiqueta: copy.inventario.todas, total }, ...(ciudades.length > 1 ? ciudades : [])];

  return (
    <div className="lpm-colofon">
      <div className="lpm-reticula" aria-hidden />
      <div className="relative mx-auto flex max-w-[92rem] flex-col gap-4 px-5 py-4 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:gap-10">
        <div role="group" aria-label={copy.monografia.ariaPortada} className="lpm-sin-barra -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0">
          {opciones.map((o) => {
            const sel = activa === o.clave;
            return (
              <button
                key={o.clave}
                type="button"
                aria-pressed={sel}
                onClick={() => emitirUbicacion(o.clave === TODAS ? '' : o.clave)}
                className="lpm-colofon-opcion shrink-0"
              >
                <span className="lpm-cifra lpm-colofon-num">{o.total}</span>
                <span>{o.clave === TODAS ? copy.monografia.casas(o.total) : o.etiqueta}</span>
              </button>
            );
          })}
        </div>
        <p className="lpm-pie lpm-cifra hidden text-[0.9375rem] text-[var(--lpm-onahau)] sm:block lg:ml-auto">{datos.join('  ·  ')}</p>
      </div>
    </div>
  );
}
