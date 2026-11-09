'use client';

import { useEffect, useState } from 'react';
import type { Ubicacion } from '@/lib/supabase/lp-inventario';
import type { LocaleLp } from '../../_components/v2/i18n';
import { COPY } from '../_copy';

// ============================================================
// Índice fijo de ciudades, solo escritorio.
//
// Una lista vertical en el borde derecho con las ciudades que tienen
// inventario. Pulsar una baja a la primera pantalla de esa ciudad. La ciudad
// activa se sigue con IntersectionObserver sobre las pantallas (atributo
// `data-ciudad`), nunca con un listener de scroll. Cada ciudad es una
// pastilla de vidrio; la activa, New Aqua (ver `lpo-theme.css`).
// ============================================================

function prefiereMenosMovimiento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function IndiceCiudades({ ciudades, locale = 'es' }: { ciudades: Ubicacion[]; locale?: LocaleLp }) {
  const [activa, setActiva] = useState<string | null>(null);

  useEffect(() => {
    const pantallas = Array.from(document.querySelectorAll<HTMLElement>('[data-ciudad]'));
    if (pantallas.length === 0) return;
    const observer = new IntersectionObserver(
      (entradas) => {
        // La pantalla más visible manda; con 100svh cada una, suele ser una.
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiva((visible.target as HTMLElement).dataset.ciudad ?? null);
      },
      { threshold: [0.5] },
    );
    pantallas.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
    // Las pantallas cambian con los filtros: se vuelve a observar cuando
    // cambia la lista de ciudades visibles.
  }, [ciudades]);

  function ir(clave: string) {
    const destino = document.querySelector<HTMLElement>(`[data-ciudad="${clave}"]`);
    destino?.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' });
  }

  if (ciudades.length < 2) return null;

  return (
    <nav
      aria-label={COPY[locale].indice.aria}
      className="lpo-indice fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 lg:flex"
    >
      {ciudades.map((c) => (
        <button
          key={c.clave}
          type="button"
          onClick={() => ir(c.clave)}
          aria-current={activa === c.clave ? 'true' : undefined}
        >
          {c.nombre}
          <span className="marca-cifra opacity-70">{c.total}</span>
        </button>
      ))}
    </nav>
  );
}
