import { Campo, BloqueCampos, EnlaceGate } from './ui';
import { mxn } from './format';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';
import { COMUN, COSTOS } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Lo que no está en el precio.
//
// El bloque que nadie publica: gastos de cierre, mantenimiento y los cargos
// únicos que aparecen al escriturar o al iniciar obra. Va antes del formulario
// a propósito, porque filtra al visitante cuyo presupuesto no alcanza el precio
// del lote más los costos reales, y ese filtro ahorra tiempo de asesor, que es
// el cuello de botella de la operación.
// ============================================================

/** Detecta montos expresados en unidades indexadas en vez de en pesos. */
function esIndexado(monto: string): boolean {
  const m = monto.toLowerCase();
  return (
    m.includes('salario') || m.includes('uma') || m.includes('cuotas de mantenimiento')
  );
}

export default function CostosNoIncluidos({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const c = lote.costos;
  const t = COSTOS[locale];

  const cierre =
    c?.cierrePctMin && c?.cierrePctMax
      ? t.cierre(c.cierrePctMin, c.cierrePctMax)
      : null;

  const mantenimiento =
    c?.mantenimientoMxnMin && c?.mantenimientoMxnMax
      ? t.mantenimientoRango(mxn(c.mantenimientoMxnMin), mxn(c.mantenimientoMxnMax))
      : null;

  return (
    <div>
      <p className="max-w-[62ch] text-base leading-relaxed text-white/75">
        {t.intro}
      </p>

      <div className="mt-6">
        <BloqueCampos tono="oscuro">
          <Campo etiqueta={t.escrituracion} tono="oscuro">
            {cierre ?? <EnlaceGate
                que={COMUN[locale].gate.gastosEscrituracion}
                tono="oscuro"
                locale={locale}
              />}
            {c?.cierreExcluye && (
              <span className="block text-xs text-white/45">
                {t.noIncluye} {c.cierreExcluye}
              </span>
            )}
          </Campo>

          <Campo etiqueta={t.mantenimiento} tono="oscuro">
            {mantenimiento ?? <EnlaceGate
                que={COMUN[locale].gate.mantenimiento}
                tono="oscuro"
                locale={locale}
              />}
            {c?.mantenimientoPorDefinir && (
              <span className="block text-xs text-white/45">
                {t.mantenimientoPorDefinir}
              </span>
            )}
          </Campo>

          {(c?.cargosUnicos ?? []).map((cargo) => (
            <Campo key={cargo.concepto} etiqueta={cargo.concepto} tono="oscuro">
              {cargo.monto}
              <span className="block text-xs text-white/45">
                {cargo.momento}
                {cargo.reembolsable === true && t.reembolsable}
                {cargo.reembolsable === false && t.noReembolsable}
              </span>
              {/* Un cargo indexado a salarios mínimos no es un monto: es una
                  fórmula. Publicarlo sin decir eso deja al comprador creyendo
                  que sabe cuánto va a pagar. No convertimos a pesos porque
                  requiere fijar QUÉ salario mínimo y de qué año aplica, y eso
                  lo define el contrato, no nosotros. */}
              {esIndexado(cargo.monto) && (
                <span className="mt-1.5 block text-xs leading-relaxed text-white/45">
                  {t.indexado}
                </span>
              )}
            </Campo>
          ))}
        </BloqueCampos>
      </div>

      <p className="mt-5 max-w-[62ch] text-xs leading-relaxed text-white/45">
        {t.pie}
      </p>
    </div>
  );
}
