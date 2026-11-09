import Image from 'next/image';
import { ExternalLink } from '@/lib/icons';
import { EnlaceGate, RULE_LIGHT } from './ui';
import PasosDinamicos from './PasosDinamicos';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';
import { COMUN, PRUEBA } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Prueba de que existimos.
//
// Sustituye los tres bullets genéricos de "Por qué a través de Propyte". En un
// mercado donde la objeción dominante es el fraude, lo que convierte no es un
// testimonio: es verificabilidad. Una dirección a la que puedes ir, una persona
// con nombre y cara, y un contrato que puede revisar tu abogado.
//
// Brief de octubre-2026: sin título de sección (la oficina y el asesor hablan
// solos) y los tres bloques de abajo como PASOS numerados con línea de
// recorrido, no como filas de un listado.
//
// Dirección, horario y asesor vienen del Hub, no de un documento.
// ============================================================

/** Destino de la barra de credibilidad del inicio, que resume este bloque. */
export const ANCLA_PRUEBA = 'comprobar';

export default function PruebaDeQueExistimos({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const t = PRUEBA[locale];
  const { asesor, oficina, costos } = lote;
  const apartado = costos?.cargosUnicos.find((c) =>
    c.concepto.toLowerCase().includes('apartado'),
  );

  const pasos = [
    {
      titulo: t.paso1Titulo,
      cuerpo: <>{t.paso1}</>,
    },
    {
      titulo: t.paso2Titulo,
      cuerpo: (
        <>
          {apartado ? (
            <>
              {apartado.monto}, {apartado.momento}.{' '}
            </>
          ) : (
            <>{t.apartadoConfirmamos} </>
          )}
          {t.paso2}{' '}
          <EnlaceGate que={COMUN[locale].gate.devolucionApartado} locale={locale} />
        </>
      ),
    },
    {
      titulo: t.paso3Titulo,
      cuerpo: (
        <>
          {t.paso3}{' '}
          <a
            href={t.hrefMetodologia}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-1 text-[var(--lp-accent)] underline decoration-[var(--lp-accent)]/40 underline-offset-4 transition-colors duration-200 hover:decoration-[var(--lp-accent)]"
          >
            {t.metodologia}
            <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
          </a>
        </>
      ),
    },
  ];

  return (
    <section id={ANCLA_PRUEBA} aria-label={t.ariaLabel} className="scroll-mt-6">
      <div className="grid gap-px border-t-2 border-[var(--lp-accent)] bg-[var(--lp-line)] sm:grid-cols-2">
        {oficina && (
          <div className="bg-white p-5">
            <h3 className="text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--lp-muted)]">
              {t.oficina}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--lp-ink-soft)]">
              {oficina.direccion}
            </p>
            <p className="mt-1 lp-num text-xs text-[var(--lp-muted)]">{oficina.horario}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--lp-ink)]">
              {t.oficinaNota}
            </p>
          </div>
        )}

        {asesor && (
          <div className="bg-white p-5">
            <h3 className="text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--lp-muted)]">
              {t.asesor}
            </h3>
            <div className="mt-3 flex items-center gap-3">
              {asesor.fotoUrl && (
                <Image
                  src={asesor.fotoUrl}
                  alt={asesor.nombre}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="size-12 shrink-0 object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-[var(--lp-ink)]">{asesor.nombre}</p>
                <p className="text-xs text-[var(--lp-muted)]">{asesor.rol}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--lp-ink-soft)]">
              {t.asesorNotaA}{' '}
              <a
                href={t.hrefEquipo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-1 text-[var(--lp-accent)] underline decoration-[var(--lp-accent)]/40 underline-offset-4 transition-colors duration-200 hover:decoration-[var(--lp-accent)]"
              >
                {t.asesorLink}
                <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Pasos como lista numerada dinámica (ejemplo del brief del
          30-oct-2026): el activo se abre, los demás se quedan en una línea. */}
      <div className={`mt-8 border-t ${RULE_LIGHT} pt-8`}>
        <PasosDinamicos pasos={pasos} />
      </div>
    </section>
  );
}
