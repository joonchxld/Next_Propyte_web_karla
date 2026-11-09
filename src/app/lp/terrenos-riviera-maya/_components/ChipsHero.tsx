'use client';

import type { FiltroDef } from '../../_components/v2/filtros';
import { useSeleccionFiltros } from '../../_components/v2/useFiltros';

// ============================================================
// Chips del hero: ciudad y plazo desde el primer pliegue (brief 30-oct-2026:
// «que el visitante elija cómo quiere pagar antes de bajar»).
//
// No filtran aquí: mandan el filtro al catálogo por el evento compartido y
// bajan hasta él. Comparten estado con la barra pegajosa y el formulario, así
// que un chip elegido arriba aparece elegido abajo.
//
// Marca (9-nov-2026): pastillas con filete Aqua sobre la banda Aztec del hero;
// la elegida se vuelve Aqua con texto Aztec (`lpt2-theme.css`).
// ============================================================

export default function ChipsHero({ defs }: { defs: FiltroDef[] }) {
  const { seleccion, alternar } = useSeleccionFiltros();
  return (
    <div className="flex flex-col gap-4">
      {defs.map((def) => (
        <div key={def.id} role="group" aria-label={def.etiqueta} className="flex items-center gap-4">
          <span className="marca-detalle w-[6ch] shrink-0 text-[0.875rem] text-[var(--lpv-fg-3)]">{def.etiqueta}</span>
          <div className="marca-sin-barra -mr-5 flex min-w-0 gap-2 overflow-x-auto pr-5 sm:mr-0 sm:flex-wrap sm:pr-0">
            {def.opciones.map((o) => (
              <button
                key={o.valor}
                type="button"
                aria-pressed={seleccion[def.id] === o.valor}
                onClick={() => alternar(def.id, o.valor, true)}
                className="lpt2-chip"
              >
                {o.etiqueta} <span className="lpt2-chip-n">{o.total}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
