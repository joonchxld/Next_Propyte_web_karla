'use client';

import type { OpcionFiltro } from '../../_components/v2/filtros';
import { emitirFiltro } from '../../_components/v2/useFiltros';

// Chips de zona sobre la foto del hero. No filtran aquí: mandan el filtro de
// ubicación al catálogo y al formulario (mismo estado, por evento) y bajan.

export default function ChipsHeroFiltro({ opciones, ariaLabel }: { opciones: OpcionFiltro[]; ariaLabel: string }) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          onClick={() => emitirFiltro('ubicacion', o.valor, true)}
          className="lpx-chip-foto marca-detalle inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.9375rem] leading-none active:translate-y-px"
        >
          {o.etiqueta}
          <span className="lpv-cifra text-[var(--marca-onahau)]">{o.total}</span>
        </button>
      ))}
    </div>
  );
}
