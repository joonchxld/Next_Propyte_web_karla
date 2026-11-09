import Figure from './Figure';
import { EnlaceGate, EstadoServicio, RULE_DARK } from './ui';
import { COMUN, URBA, mesAnioL } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';

// ============================================================
// Urbanización real. La sección va sobre fondo oscuro a propósito.
//
// Los competidores de este SERP anuncian "100% urbanizado" sin evidencia. El
// registro de este lote declara lo contrario, servicio por servicio y con
// fechas. Publicar eso es el activo de conversión más fuerte de la página y
// también el filtro más eficaz, así que merece su propio mundo visual: es el
// único bloque donde el cian de marca hace de tinta de datos.
//
// El registro advierte que las fechas son de otra etapa y que la de ESTE lote
// no está confirmada. Esa advertencia se publica: presentar las fechas como si
// fueran del lote sería tergiversación.
// ============================================================

/** Destino de las referencias al estado real de urbanización. */
export const ANCLA_URBANIZACION = 'urbanizacion';

export default function UrbanizacionReal({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const t = URBA[locale];
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div>
        {lote.ningunServicioHoy && (
              <p className="max-w-[46ch] text-base leading-relaxed text-white/75">
                <strong className="font-semibold text-[var(--lp-accent-on-dark)]">
                  {t.hoyNinguno}
                </strong>{' '}
                {t.hoyNingunoCuerpo}
              </p>
            )}

            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-white/50">
              {t.fechas}
            </p>

            <div className="mt-5">
              <EnlaceGate que={COMUN[locale].gate.etapa} tono="oscuro" locale={locale} />
            </div>

            {/* Aérea REAL del polígono, no render. Es la única imagen de la
                página que muestra el lote como está hoy: vialidades trazadas y
                terreno sin construir. Va justo aquí porque la sección afirma
                que no hay ningún servicio conectado, y una foto que lo confirma
                vale más que la tabla. Los renders viven arriba, etiquetados
                como lo que son. */}
            {lote.imagenes.urbanizacion && (
              <Figure
                imagen={lote.imagenes.urbanizacion}
                sizes="(max-width: 1024px) 100vw, 38vw"
                aspecto="aspect-[16/10]"
                tono="oscuro"
                locale={locale}
                className="mt-8"
              />
            )}
          </div>

      {lote.servicios.length > 0 ? (
        <div className={`border-t-2 border-[var(--lp-accent-on-dark)]`}>
          <dl className={`border-x border-b ${RULE_DARK}`}>
            {lote.servicios.map((s) => {
              const fecha = mesAnioL(s.fechaEstimada, locale);
              return (
                <div
                  key={s.clave}
                  className={`grid grid-cols-[1fr_auto] items-baseline gap-4 border-t ${RULE_DARK} px-4 py-3.5`}
                >
                  <dt className="text-sm text-white/85">
                    <span className="capitalize">{s.etiqueta}</span>
                    {s.detalle && (
                      <span className="block text-xs text-white/40">{s.detalle}</span>
                    )}
                  </dt>
                  <dd className="text-right lp-num text-xs">
                    <EstadoServicio estado={s.estado} locale={locale} />
                    {fecha && <span className="block text-white/45">{fecha}</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ) : (
        <div className="self-start">
          <EnlaceGate
            que={COMUN[locale].gate.serviciosPorServicio}
            tono="oscuro"
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
