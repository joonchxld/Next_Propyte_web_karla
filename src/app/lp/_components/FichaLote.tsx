import { Campo, BloqueCampos, EnlaceGate, TituloSeccion } from './ui';
import { mxn, mxnExacto, m2 } from './format';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';
import { COMUN, FICHA } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Ficha del lote.
//
// El brief pedía una tabla comparativa ordenable por MXN/m². Con un solo lote
// disponible no hay nada que ordenar, así que es una ficha de campos. Lo que se
// conserva es lo que ningún competidor de este SERP publica: el precio por
// metro cuadrado y el estatus real de urbanización, sin eufemismos.
//
// Gramática de plano catastral: campos reglados con regla vertical entre
// etiqueta y dato. En móvil las columnas se estrechan pero no se apilan: la
// lectura de documento depende de que la reja se mantenga.
// ============================================================

export default function FichaLote({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const t = FICHA[locale];
  const g = COMUN[locale].gate;
  const plazoMax = lote.plan?.opciones.at(-1) ?? null;

  return (
    <section aria-labelledby="ficha-titulo">
      <TituloSeccion id="ficha-titulo">{t.titulo}</TituloSeccion>

      <div className="mt-6">
        <BloqueCampos>
          <Campo etiqueta={t.superficie}>
            {lote.superficieM2 ? m2(lote.superficieM2) : <EnlaceGate que={g.superficie} locale={locale} />}
          </Campo>

          <Campo etiqueta={t.precio}>
            {lote.precioMxn ? `${mxn(lote.precioMxn)}` : <EnlaceGate que={g.precio} locale={locale} />}
          </Campo>

          <Campo etiqueta={t.precioM2} destacado>
            {lote.precioM2Mxn ? (
              `${mxnExacto(lote.precioM2Mxn)}`
            ) : (
              <EnlaceGate que={g.precioM2} locale={locale} />
            )}
          </Campo>

          {/* Consecuencia del uso de suelo. Va junto al precio a propósito: es
              el denominador que cambia cómo se lee el precio por m². */}
          <Campo etiqueta={t.construible} destacado>
            {lote.aprovechamiento ? (
              <>
                {m2(lote.aprovechamiento.construibleM2)}
                <span className="block text-xs text-[var(--lp-muted)]">
                  {t.cos} {lote.aprovechamiento.cos} · {t.cus} {lote.aprovechamiento.cus},{' '}
                  {t.hasta} {m2(lote.aprovechamiento.huellaM2)} {t.enPlanta}
                </span>
              </>
            ) : (
              <EnlaceGate que={g.construible} locale={locale} />
            )}
          </Campo>

          <Campo etiqueta={t.enganche}>
            {lote.enganchePct && lote.engancheMxn !== null ? (
              <>
                {t.desde} {lote.enganchePct}%
                <span className="text-[var(--lp-muted)]">
                  {'  '}
                  {mxn(lote.engancheMxn)}
                </span>
              </>
            ) : (
              <EnlaceGate que={g.enganche} locale={locale} />
            )}
          </Campo>

          {/* La mensualidad es la cifra de mayor palanca de conversión en este
              segmento, y por eso mismo publicarla asumiendo 0% de interés y
              descubrir después que hay tasa convertiría la página en publicidad
              engañosa. Se publica sólo cuando `construirPlan` devuelve plan, y
              eso exige que la tasa esté declarada como dato. */}
          <Campo etiqueta={t.mensualidad} destacado>
            {plazoMax ? (
              <>
                {mxn(plazoMax.mensualidadMxn)}
                <span className="block text-xs text-[var(--lp-muted)]">
                  {t.pagosA(plazoMax.pagos, plazoMax.meses)}
                </span>
              </>
            ) : (
              <EnlaceGate que={g.tasa} locale={locale} />
            )}
          </Campo>

          <Campo etiqueta={t.plazos}>
            {lote.mesesOpciones.length > 0 ? (
              t.hastaMeses(Math.max(...lote.mesesOpciones))
            ) : lote.mesesNota ? (
              lote.mesesNota
            ) : (
              <EnlaceGate que={g.plazos} locale={locale} />
            )}
          </Campo>

          <Campo etiqueta={t.urbanizacion} destacado>
            {lote.ningunServicioHoy
              ? t.ningunServicio
              : lote.subtipoLiteral ?? <EnlaceGate que={g.urbanizacion} locale={locale} />}
          </Campo>

          <Campo etiqueta={t.escrituracion}>
            {lote.escrituraDisponibleHoy
              ? t.escrituraInmediata
              : t.escrituraProyectada}
          </Campo>
        </BloqueCampos>
      </div>

      {/* ───── Cómo leer este precio ─────
          La versión anterior invitaba a comparar precio por m² contra cualquier
          otro terreno y ahí se detenía. Es honesto y, tal cual, trabajaba para
          la competencia: en el mismo fraccionamiento hay lotes anunciados a la
          mitad de este precio por metro, y varios ya tienen servicios o son
          reventa con escritura inmediata.

          La invitación a comparar se conserva —quitarla sería exactamente lo
          contrario de la marca— pero se completa con los cuatro renglones que
          hacen que la comparación signifique algo. No es un truco retórico:
          cada uno es verificable en el otro terreno. */}
      <div className="mt-5 max-w-[62ch] text-sm leading-relaxed text-[var(--lp-ink-soft)]">
        {lote.precioM2Mxn && lote.superficieM2 ? (
          <>
            <p>
              <strong className="font-semibold text-[var(--lp-ink)]">
                {t.comoLeer}
              </strong>{' '}
              {t.sonA} {mxnExacto(lote.precioM2Mxn)} {t.sonB}{' '}
              {m2(lote.superficieM2)}
              {t.sonC}
            </p>
            <ol className="mt-3 flex flex-col gap-2">
              {[
                ...t.criterios,
              ].map((criterio, i) => (
                <li key={criterio} className="grid grid-cols-[1.5rem_1fr] gap-x-2">
                  <span
                    aria-hidden="true"
                    className="lp-num text-xs text-[var(--lp-muted)]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{criterio}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3">
              {t.cierre}
            </p>
          </>
        ) : (
          <p>
            <strong className="font-semibold text-[var(--lp-ink)]">{t.comoLeer}</strong>{' '}
            {t.sinPrecio}
          </p>
        )}
      </div>
    </section>
  );
}
