'use client';

import { ArrowDown } from '@/lib/icons';
import type { FiltroDef } from '../../_components/v2/filtros';
import type { LocaleLp } from '../../_components/v2/i18n';
import { emitirFiltro, useSeleccionFiltros } from '../../_components/v2/useFiltros';
import { COPY } from '../_copy';

// ============================================================
// Acceso temprano al filtro desde la portada: las ciudades con inventario
// como chips y un botón que baja a la primera pantalla. Pulsar una ciudad
// filtra las pantallas (el Catálogo escucha el mismo evento) y baja.
//
// Es el gancho de retención que pidió el brief del 30-oct-2026: quien llega
// elige dónde antes de ver nada, y lo que ve después ya es suyo.
// Marca (9-nov-2026): «ver todas» en pastilla New Aqua; ciudades en
// pastillas de vidrio Aztec (`.lpo-chip`), la elegida en Onahau.
// ============================================================

function prefiereMenosMovimiento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function ChipsPortada({
  ubicacion,
  total,
  etiquetaTodas,
  locale = 'es',
}: {
  ubicacion: FiltroDef | null;
  total: number;
  /** Texto del botón que baja sin filtrar, p. ej. «Ver las 9». */
  etiquetaTodas: string;
  locale?: LocaleLp;
}) {
  const { seleccion } = useSeleccionFiltros();

  function bajar() {
    document
      .getElementById('inventario')
      ?.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <div role="group" aria-label={COPY[locale].portada.ariaCiudad} className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          emitirFiltro('ubicacion', null);
          bajar();
        }}
        className="marca-boton min-h-[48px] text-[0.9375rem] font-semibold"
      >
        {etiquetaTodas}
        <ArrowDown className="h-4 w-4" aria-hidden />
      </button>
      {ubicacion?.opciones.map((o) => {
        const activo = seleccion.ubicacion === o.valor;
        return (
          <button
            key={o.valor}
            type="button"
            aria-pressed={activo}
            onClick={() => emitirFiltro('ubicacion', o.valor, true)}
            className="lpo-chip"
          >
            {o.etiqueta}
            <span className="marca-cifra opacity-70">{o.total}</span>
          </button>
        );
      })}
    </div>
  );
}
