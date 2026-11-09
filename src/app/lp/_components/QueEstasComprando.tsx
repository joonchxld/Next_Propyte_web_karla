import Figure from './Figure';
import { TituloSeccion } from './ui';
import { m2, mxn, mxnExacto } from './format';

import type { LoteLanding } from '@/lib/supabase/lp-lotes';
import { QUE } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Qué estás comprando.
//
// El bloque que faltaba. La página tenía pruebas y no tenía promesa: cuatro
// bloques defensivos consecutivos antes de un solo argumento a favor. Esto va
// arriba, antes de cualquier objeción, para que exista una razón de seguir
// leyendo.
//
// Las amenidades salen de las columnas booleanas del desarrollo vía
// `v_developments.amenities`, no de prosa: si el Hub desmarca una, desaparece de
// aquí sin tocar código. Pádel y pickleball no están estructurados, así que no
// se nombran individualmente aunque aparezcan en el texto editorial.
//
// Ya no se imprimen como volcado de base de datos. Diez sustantivos en title
// case («Alberca Comunitaria · Gimnasio · Cancha») son cero significado: nadie
// compra un lote por leer la palabra «gimnasio». Cada amenidad se publica con
// su consecuencia en una línea, en presente y en segunda persona.
//
// Regla dura: si una amenidad no tiene consecuencia escribible, NO se lista. Es
// relleno, y el relleno es justo lo que hace que el resto suene a folleto.
// ============================================================

/**
 * Consecuencia por amenidad. La clave se normaliza (sin acentos, minúsculas)
 * para que un cambio de capitalización en el Hub no rompa el match.
 *
 * Deliberadamente NO hay fallback genérico: una amenidad sin entrada aquí se
 * omite. Preferimos publicar seis amenidades que signifiquen algo a diez que no.
 */

/**
 * Territorio de cada amenidad.
 *
 * Once amenidades en lista plana obligan a leerlas todas para saber si hay
 * alguna que importe. Agrupadas en tres territorios, el visitante encuentra el
 * suyo de un vistazo: quien compra por los hijos busca «familia», quien viene
 * de otra ciudad busca «seguridad». El copy de cada una NO cambia — la lista
 * ya estaba bien escrita; lo que faltaba era el orden.
 *
 * Una amenidad sin territorio cae en «vida diaria», que es el cajón correcto
 * para lo que no es ni infantil ni perimetral.
 */
const TERRITORIO: Record<string, 'familia' | 'seguridad' | 'vida diaria'> = {
  'alberca comunitaria': 'familia',
  'area de ninos': 'familia',
  'jardin comunitario': 'familia',
  cancha: 'familia',
  'seguridad 24h': 'seguridad',
  cctv: 'seguridad',
  'acceso controlado': 'seguridad',
  gimnasio: 'vida diaria',
  'salon de eventos': 'vida diaria',
  'pet zone': 'vida diaria',
  'casa club': 'vida diaria',
};

/** Orden de presentación. Familia primero: es el motivo de compra dominante. */
const ORDEN_TERRITORIOS = ['familia', 'seguridad', 'vida diaria'] as const;


/** Quita acentos y normaliza para hacer match con `CONSECUENCIA`. */
function clave(amenidad: string): string {
  return amenidad
    .toLowerCase()
    .normalize('NFD')
    // Escapes unicode y no marcas combinantes literales: sobreviven a un
    // guardado en otra codificación.
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function QueEstasComprando({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const c = QUE[locale];
  // Sólo sobreviven las amenidades con consecuencia escribible.
  const amenidades = lote.amenidades
    .map((a) => ({
      nombre: c.amenidadNombre[clave(a)] ?? a,
      consecuencia: c.consecuencia[clave(a)],
      territorio: TERRITORIO[clave(a)] ?? ('vida diaria' as const),
    }))
    .filter((a) => Boolean(a.consecuencia));

  const imagen = lote.imagenes.amenidades;
  const apr = lote.aprovechamiento;
  const plazoMax = lote.plan?.opciones.at(-1) ?? null;

  return (
    <section aria-labelledby="comprando-titulo">
      <TituloSeccion id="comprando-titulo">{c.titulo}</TituloSeccion>

      {/* Resumen en una frase. Bajó del hero, donde ocupaba la banda entera
          justo después de las cifras y repetía en prosa lo que las cifras
          acababan de decir en números. Aquí abre el bloque que sí desarrolla el
          argumento, y la afirmación que de verdad hace trabajo —propiedad
          privada, no ejidal— aterriza donde el visitante ya se está preguntando
          qué está comprando. */}
      <p className="mt-5 max-w-[58ch] lp-display text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] leading-[1.5] text-[var(--lp-ink)]">
        {c.introA}{' '}
        <span className="lp-num">
          {lote.superficieM2 ? m2(lote.superficieM2) : c.superficiePorConfirmar}
        </span>{' '}
        {c.introB}{' '}
        <span className="lp-num">
          {lote.precioMxn ? `${mxn(lote.precioMxn)}` : c.precioPorConfirmar}
        </span>
        {lote.precioM2Mxn && (
          <>
            {c.porM2A} <span className="lp-num">{mxnExacto(lote.precioM2Mxn)}</span>{' '}
            {c.porM2B}
          </>
        )}
        {c.introC}
        {lote.plan?.sinIntereses && <>{c.sinIntereses}</>}
        {/* El porcentaje NO depende del plan: vive en `lote.enganchePct`. Leerlo
            de `plan` producía «enganche de enganche» cuando faltaba la tasa. */}
        {lote.enganchePct && <>{c.enganche(lote.enganchePct)}</>}
        {plazoMax && <>{c.hasta(plazoMax.meses)}</>}
        {c.introD}
      </p>

      {/* UNA columna, no dos. Esta sección ya vive dentro de la columna
          izquierda del grid de la página (~550 px, porque el formulario ocupa
          la derecha). Abrir aquí un segundo grid de texto + imagen dejaba la
          prosa en **276 px**: unos 34 caracteres por línea, la mitad de la
          medida legible, con la imagen flotando al lado y un hueco muerto
          debajo. Medido, no estimado.

          Apilado, el texto recupera los ~62ch de `max-w` y la imagen se lee
          como imagen en vez de como columna lateral. */}
      <div className="mt-8 flex flex-col gap-8">
        <div className="flex max-w-[62ch] flex-col gap-4 text-base leading-relaxed text-[var(--lp-ink-soft)]">
          <p>{c.p1}</p>
          <p>{c.p2}</p>
          {/* La consecuencia del uso de suelo, no el uso de suelo. COS y CUS
              siguen publicados en el bloque jurídico; aquí va lo que significan. */}
          {apr && lote.superficieM2 && (
            <p>
              {c.aprA} {m2(lote.superficieM2)}
              {c.aprB}{' '}
              <span className="lp-num">{m2(apr.huellaM2)}</span> {c.aprC}{' '}
              <strong className="font-semibold text-[var(--lp-ink)]">
                <span className="lp-num">{m2(apr.construibleM2)}</span>{' '}
                {c.aprD}
              </strong>
              {c.aprE(apr.niveles === 2 ? c.nivelesDos : String(apr.niveles))}
            </p>
          )}

          <p>{c.p4}</p>

          {amenidades.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-[var(--lp-ink-soft)]">
                {c.amenA}
                {lote.lotesTotalesPrivada && (
                  <>
                    {' '}
                    {c.amenDe}{' '}
                    <span className="lp-num">
                      {lote.lotesTotalesPrivada}
                    </span>{' '}
                    {c.amenLotes}
                  </>
                )}
                {c.amenB}
              </p>
              {/* Agrupadas en tres territorios, no en lista plana. Once
                  amenidades seguidas obligan a leerlas todas para saber si hay
                  alguna que te importe; en territorios, cada perfil encuentra
                  el suyo de un vistazo. Dentro de cada uno, dos columnas: once
                  filas apiladas con hairline se comían el 20% del scroll y
                  leían como hoja de cálculo. */}
              <div className="mt-5 flex flex-col gap-6">
                {ORDEN_TERRITORIOS.map((t) => {
                  const delGrupo = amenidades.filter((a) => a.territorio === t);
                  if (delGrupo.length === 0) return null;
                  return (
                    <div key={t}>
                      <p className="lp-rotulo text-[var(--lp-muted)]">
                        {c.rotulo[t]}
                      </p>
                      <dl className="mt-3 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                        {delGrupo.map((a) => (
                          <div key={a.nombre}>
                            <dt className="lp-rotulo text-[var(--lp-accent)]">
                              {a.nombre}
                            </dt>
                            <dd className="mt-1 text-sm leading-relaxed text-[var(--lp-ink-soft)]">
                              {a.consecuencia}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-[var(--lp-muted)]">
                {c.amenNota}
              </p>
            </div>
          )}
        </div>

        {/* Imagen curada, distinta de la del hero. Antes era el MISMO archivo:
            una aérea repetida bajo el rótulo «áreas comunes». */}
        {/* `self-start` + relación de aspecto FIJA, y sticky en desktop.
            Antes era `lg:aspect-auto lg:min-h-[360px]`: dentro de un grid eso
            estira la celda hasta la altura de la columna de texto, que aquí es
            larguísima. El resultado era una tira vertical estrecha con
            `object-cover` recortando el centro de un render horizontal, o sea
            árboles desenfocados. Con la relación fija la foto vuelve a leerse
            como foto, y el sticky la acompaña mientras se lee el texto en vez
            de dejar un hueco muerto debajo. */}
        {imagen && (
          // Ya no es `sticky`: eso tenía sentido cuando acompañaba a una
          // columna de texto larguísima a su izquierda. Apilada, seguir a la
          // vista mientras se lee lo de abajo sería una imagen persiguiendo al
          // lector.
          <Figure imagen={imagen} sizes="(max-width: 1024px) 100vw, 46vw" locale={locale} />
        )}
      </div>
    </section>
  );
}
