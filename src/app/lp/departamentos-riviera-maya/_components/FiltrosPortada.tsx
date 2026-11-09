'use client';

import type { PropiedadLanding } from '@/lib/supabase/lp-inventario';
import { filtrar, type FiltroDef } from '../../_components/v2/filtros';
import { useSeleccionFiltros } from '../../_components/v2/useFiltros';
import type { LocaleLp } from '../../_components/v2/i18n';
import { plural } from '../../_components/v2/util';
import { COPY } from '../_copy';

// ============================================================
// El gancho de la portada (30-oct-2026): «dinos presupuesto y ciudad».
//
// Marca (9-nov-2026): presupuesto en pastillas y el índice en filas-pastilla
// sobre la banda Aztec; la lógica no cambia.
//
// El índice de capítulos ya existía como tabla de contenido; ahora ES el
// filtro de ciudad: tocar una ciudad deja solo su capítulo y baja a él. Los
// conteos del índice responden al presupuesto elegido, así la persona ve
// cuántos le quedan en cada ciudad antes de bajar. Mismo estado que el
// formulario y los capítulos, por evento (`useSeleccionFiltros`).
//
// Nada se calcula a mano: las opciones vienen de `filtros.ts` con su conteo
// real y aquí solo se vuelven a contar con el otro filtro aplicado.
// ============================================================

const TODAS = '__todas__';

export default function FiltrosPortada({
  defs,
  todos,
  locale = 'es',
}: {
  defs: FiltroDef[];
  todos: PropiedadLanding[];
  locale?: LocaleLp;
}) {
  const t = COPY[locale];
  const { seleccion, elegir, alternar } = useSeleccionFiltros();
  const ubicacion = defs.find((d) => d.id === 'ubicacion');
  const presupuesto = defs.find((d) => d.id === 'presupuesto');

  // Conteo cruzado: ciudades con el presupuesto aplicado y viceversa.
  const soloPresupuesto = filtrar(todos, { presupuesto: seleccion.presupuesto }, defs);
  const soloUbicacion = filtrar(todos, { ubicacion: seleccion.ubicacion }, defs);
  const porCiudad = (clave: string) => filtrar(soloPresupuesto, { ubicacion: clave }, defs).length;
  const porRango = (valor: string) => filtrar(soloUbicacion, { presupuesto: valor }, defs).length;

  const ciudadActiva = seleccion.ubicacion ?? TODAS;

  return (
    <div className="mt-6 max-w-[34rem]">
      {presupuesto && (
        <div role="group" aria-label={presupuesto.etiqueta}>
          <p className="marca-detalle text-[0.9375rem] font-medium text-white/80">{presupuesto.etiqueta}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {presupuesto.opciones.map((o) => {
              const activo = seleccion.presupuesto === o.valor;
              const n = porRango(o.valor);
              return (
                <button
                  key={o.valor}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => alternar('presupuesto', o.valor, true)}
                  className={`lpd-chip ${activo ? 'lpd-chip-activo' : ''}`}
                >
                  {o.etiqueta}
                  <span className="marca-cifra opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {ubicacion && (
        <nav aria-label={t.portada.ciudadesAria} className="lpd-indice mt-6">
          <button
            type="button"
            aria-pressed={ciudadActiva === TODAS}
            onClick={() => elegir('ubicacion', null, true)}
          >
            <span className="lpd-indice-ciudad">{t.portada.todasCiudades}</span>
            <span className="lpd-indice-n">
              {plural(soloPresupuesto.length, ...t.departamento)}
            </span>
          </button>
          {ubicacion.opciones.map((o) => {
            const n = porCiudad(o.valor);
            return (
              <button
                key={o.valor}
                type="button"
                aria-pressed={ciudadActiva === o.valor}
                disabled={n === 0}
                onClick={() => elegir('ubicacion', o.valor, true)}
              >
                <span className="lpd-indice-ciudad">{o.etiqueta}</span>
                <span className="lpd-indice-n">
                  {n === 0 ? t.portada.ningunoEnPresupuesto : plural(n, ...t.departamento)}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
