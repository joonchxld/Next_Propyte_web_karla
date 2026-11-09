import Figure from './Figure';
import { TituloSeccion } from './ui';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';
import { DOMINGO } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Un domingo aquí.
//
// El único bloque de la página cuyo trabajo es proyectar la vida. Todo lo demás
// es dato, prueba u objeción; sin esto, la página es un informe de due
// diligence cuya conclusión implícita es «no compres».
//
// Regla de escritura: segunda persona, presente, específico, sin adjetivos de
// folleto. Cada frase se apoya en un hecho que la página ya publica —la
// distancia, el acceso controlado, el número de lotes, las amenidades del
// desarrollo— y el último párrafo declara el límite en la misma respiración.
// Eso es lo que lo mantiene dentro de la voz de la marca en vez de convertirlo
// en publicidad: la escena no añade ningún hecho nuevo.
//
// YA NO LLEVA CTA. Tenía un WhatsApp suelto que era el cuarto de la página
// contra tres al formulario, y encima sobre fondo claro, donde el componente ni
// siquiera tiene estilo definido. La página se queda con tres puntos de
// conversión —hero, formulario junto al plan de pagos, cierre— y este bloque
// hace solo su trabajo: construir el deseo que el formulario cobra dos
// secciones más abajo. Interrumpir la escena para pedir un WhatsApp la anulaba.
// ============================================================

export default function UnDomingoAqui({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const t = DOMINGO[locale];
  const imagen = lote.imagenes.domingo;

  return (
    <section aria-labelledby="domingo-titulo" className="border-b border-[var(--lp-line)] bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <TituloSeccion id="domingo-titulo">{t.titulo}</TituloSeccion>

            <div className="mt-6 flex max-w-[58ch] flex-col gap-4 text-base leading-relaxed text-[var(--lp-ink-soft)]">
              <p>{t.p1}</p>
              <p>
                {t.p2A}{' '}
                {lote.lotesTotalesPrivada ? (
                  <span className="lp-num">
                    {lote.lotesTotalesPrivada}
                  </span>
                ) : (
                  t.p2Cientos
                )}{' '}
                {t.p2B}
              </p>
              <p>{t.p3}</p>
              {/* El párrafo que hace que esto sea Sage y no folleto. No se quita. */}
              <p className="text-[var(--lp-muted)]">
                {t.p4}
              </p>
            </div>
          </div>

          {imagen && (
            <Figure
              imagen={imagen}
              sizes="(max-width: 1024px) 100vw, 46vw"
              aspecto="aspect-[4/3] lg:aspect-[5/4]"
              locale={locale}
            />
          )}
        </div>
      </div>
    </section>
  );
}
