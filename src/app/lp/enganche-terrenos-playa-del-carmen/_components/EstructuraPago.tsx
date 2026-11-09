import type { PlanPago } from '@/lib/supabase/lp-lotes';
import { mxn } from './formato';
import { COPY } from '../_copy';
import type { LocaleLp } from '../../_components/v2/i18n';

// ============================================================
// EL PAGO COMPLETO, EN PROPORCIÓN — bloque izquierdo del hero.
//
// Ese bloque estaban 519 px × 548 px vacíos (medido en 1440 y en 1920, idéntico:
// el hueco no depende del ancho). Debajo de la tarjeta de conversión, en el
// primer pliegue, y solo tenía tres cifras sueltas en fila.
//
// Lo que va aquí responde la pregunta que deja abierta el titular. La variante C
// publica el ENGANCHE como gancho, y un enganche grande dispara «¿y el resto
// cómo se paga?». Hoy esa respuesta vive en la sección 2, a un scroll de
// distancia. Ponerla al lado del formulario la contesta antes de que estorbe.
//
// ═══ NADA DE ESTO ESTÁ ESCRITO A MANO ═══
//
// Los tres porcentajes salen de `parsearEsquema`, que los lee del texto de
// `ext_esquema_pago` del desarrollador y EXIGE que sumen 100. Los importes se
// calculan sobre `precioMxn`. Si el esquema deja de parsear, `plan` es null y
// este bloque no se monta: la página publica un hueco antes que una cifra
// inventada. Por eso las anchuras de la barra salen de `pct` y no de un `w-1/5`
// literal — si el desarrollador cambia a 30/50/20, la figura cambia sola y
// nadie tiene que acordarse de venir aquí.
//
// «Sin intereses» va detrás de `plan.sinIntereses`, que solo es true si la tasa
// está declarada explícitamente en 0. No se deduce de que no haya tasa.
// ============================================================

type Tramo = {
  clave: string;
  rotulo: string;
  pct: number;
  monto: string;
  cuando: string;
  /** Clase de relleno del tramo en la barra. */
  relleno: string;
};

export default function EstructuraPago({
  plan,
  locale = 'es',
}: {
  plan: PlanPago;
  /** Idioma. Por defecto español. */
  locale?: LocaleLp;
}) {
  const c = COPY[locale].estructura;
  const dinero = (n: number) => mxn(n, locale);
  // El plazo más largo: es el que sostiene la mensualidad más baja y el que el
  // formulario trae preseleccionado.
  const largo = plan.opciones.at(-1);

  const tramos: Tramo[] = [
    {
      clave: 'enganche',
      rotulo: c.tramos.enganche,
      pct: plan.enganchePct,
      monto: dinero(plan.engancheMxn),
      cuando: c.cuando.enganche,
      relleno: 'bg-[var(--lpe-teal)]',
    },
    {
      clave: 'mensualidades',
      rotulo: c.tramos.mensualidades,
      pct: plan.mensualidadesPct,
      monto: largo
        ? `${largo.pagos} × ${dinero(largo.mensualidadMxn)}`
        : dinero(plan.mensualidadesTotalMxn),
      cuando: c.cuando.mensualidades(plan.sinIntereses),
      // Rayado: es el único tramo que ocurre A LO LARGO del tiempo, y la
      // textura lo dice sin necesidad de una leyenda.
      relleno:
        'bg-[repeating-linear-gradient(115deg,rgb(255_255_255/0.22)_0_6px,rgb(255_255_255/0.08)_6px_12px)]',
    },
    {
      clave: 'contraentrega',
      rotulo: c.tramos.contraentrega,
      pct: plan.contraentregaPct,
      monto: dinero(plan.contraentregaMxn),
      cuando: c.cuando.contraentrega,
      relleno: 'bg-white/30',
    },
  ];

  return (
    <figure className="mt-9 border-t border-white/15 pt-8">
      <figcaption className="lpe-rotulo text-[var(--lpe-teal)]">
        {c.rotulo}
      </figcaption>

      {/* La barra. `flexBasis` en porcentaje = la proporción real del esquema.
          `aria-hidden` porque es la MISMA información que la lista de abajo
          dicha en gráfico: a un lector de pantalla le tocaría dos veces. */}
      <div aria-hidden="true" className="mt-5 flex gap-1.5">
        {tramos.map((t) => (
          <div
            key={t.clave}
            style={{ flexBasis: `${t.pct}%` }}
            className={`h-2.5 rounded-full ${t.relleno}`}
          />
        ))}
      </div>

      {/* El detalle va en filas y no bajo cada tramo: al 20 % de 548 px un
          rótulo tiene 110 px, y «$202,176 MXN» no cabe sin romperse. La barra
          da la proporción; las filas dan las cifras. */}
      <dl className="mt-7 space-y-5">
        {tramos.map((t) => (
          <div key={t.clave} className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 self-start rounded-full ${t.relleno}`}
            />
            <div className="min-w-0 flex-1">
              <dt className="lpe-rotulo text-[0.8125rem] text-white/70">
                {t.rotulo} · {t.pct}%
              </dt>
              <dd className="lpe-cifra mt-1 text-[1.375rem] tabular-nums text-[var(--lpe-teal)]">
                {t.monto}
              </dd>
              <dd className="lpe-cuerpo mt-1 text-[0.8125rem] leading-snug text-white/55">
                {t.cuando}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {/* `white/55` y no `/40`: medido contra el píxel real del fondo (#0f1923),
          el 40 % daba 3.81:1 y AA pide 4.5 para texto normal. El 55 % da ~8:1 y
          es el mismo tono que usa el resto de los descargos de la página. */}
      <p className="lpe-cuerpo mt-7 max-w-[46ch] text-[0.75rem] leading-relaxed text-white/55">
        {c.nota}
      </p>
    </figure>
  );
}
