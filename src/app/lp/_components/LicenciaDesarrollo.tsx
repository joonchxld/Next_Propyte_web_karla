import { RULE_DARK } from './ui';
import { fechaLargaL, LICENCIA } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';
import PendingStatus from './PendingStatus';
import type { LicenciaDesarrollo as Licencia } from '@/lib/supabase/lp-lotes';

// ============================================================
// Licencia del desarrollo y autorización de venta municipal.
//
// Ley de Asentamientos Urbanos del Estado de Quintana Roo, artículo 69, último
// párrafo: toda publicidad donde se oferten lotes debe citar el número y la
// fecha de la licencia del desarrollo y de la autorización de venta del
// Ayuntamiento. Una landing de pago que oferta lotes es publicidad en el
// sentido más literal de la norma.
//
// DOS ESTADOS, NUNCA UNA REJA VACÍA. Cuando los cuatro datos existen se dibuja
// como el sello de un documento oficial: cuatro campos en reja. Cuando no
// existen —que es hoy— la reja de cuatro huecos se leía como un formulario a
// medio llenar, y publicar el incumplimiento así hacía más daño que declararlo
// en una frase. En su lugar va un solo estado con dueño y fecha.
//
// Lo que NO cambia: el hueco se sigue publicando. Omitirlo sería incumplir en
// silencio, que es justo lo que el artículo 69 persigue.
// ============================================================

export default function LicenciaDesarrollo({
  licencia,
  actualizado,
  locale = 'es',
}: {
  licencia: Licencia;
  /** Fecha de corte de la consulta: cuándo se verificó por última vez. */
  actualizado: string | null;
  locale?: LocaleLp;
}) {
  const t = LICENCIA[locale];
  return (
    <section
      aria-labelledby="licencia-titulo"
      className={`border ${RULE_DARK} bg-white/[0.03] p-5 sm:p-6`}
    >
      <h3
        id="licencia-titulo"
        className="lp-display text-base font-semibold tracking-tight text-white"
      >
        {t.titulo}
      </h3>

      {licencia.completa ? (
        <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {[
            { etiqueta: t.licencia, valor: licencia.licenciaNumero },
            {
              etiqueta: t.fechaLicencia,
              valor: licencia.licenciaFecha ? fechaLargaL(licencia.licenciaFecha, locale) : null,
            },
            { etiqueta: t.autorizacion, valor: licencia.autorizacionNumero },
            {
              etiqueta: t.fechaAutorizacion,
              valor: licencia.autorizacionFecha
                ? fechaLargaL(licencia.autorizacionFecha, locale)
                : null,
            },
          ].map((c) => (
            <div key={c.etiqueta}>
              <dt className="lp-rotulo text-white/65">
                {c.etiqueta}
              </dt>
              <dd className="mt-1.5 font-mono text-sm text-white/85">{c.valor}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="mt-5">
          <PendingStatus
            tono="oscuro"
            titulo={t.pendienteTitulo}
            locale={locale}
            actualizado={actualizado}
            cta={
              <>
                {t.cta}{' '}
                <a
                  href="#solicitar"
                  className="underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-white"
                >
                  {t.ctaLink}
                </a>
                .
              </>
            }
          >
            {t.cuerpo}{' '}
            <a
              href="#falta-confirmar"
              className="underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-white"
            >
              {t.cuerpoLink}
            </a>
            .
          </PendingStatus>
        </div>
      )}
    </section>
  );
}
