'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from '@/lib/icons';
import { trackGenerateLead } from '@/lib/analytics/track';
import PhoneInputField, { isValidPhoneNumber } from '@/components/ui/PhoneInput';
import { FORM } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Formulario de UN paso.
//
// Resuelve una tensión real en vez de promediarla: la evidencia de conversión
// empuja a formularios cortos, y la operación de Propyte necesita calificar para
// no quemar tiempo de asesor. La salida es un formulario corto con la
// calificación DESPUÉS del contacto, donde ya no puede costar un lead.
//
// ERAN TRES PASOS, luego dos, ahora uno. El de presupuesto se quitó por ser
// «el único paso que no producía ni contacto ni intención, y llegaba antes de
// que el visitante hubiera dado un solo dato suyo — el punto de abandono más
// caro del embudo, porque ya había invertido un tap». Ese argumento aplicaba
// igual al paso del objetivo, y se comprobó midiendo:
//
//   Google Ads gastó $991.40 MXN en 72 clics en 6 días con CERO envíos. La
//   medición estaba sana — probada de punta a punta el 2026-08-20: POST 200,
//   fila en Supabase, sync a Zoho y ping de conversión a Ads. Lo que estaba
//   roto era esto: `document.querySelectorAll('form').length === 0` al cargar.
//   El visitante que costó $13.77 no veía un formulario, veía una pregunta.
//
// Un formulario detrás de una compuerta no es un formulario corto: es un
// formulario invisible. El objetivo sigue preguntándose —es señal útil para el
// asesor— pero como chips OPCIONALES junto a los campos, nunca como puerta.
//
// EL PLAZO SÍ SE PREGUNTA, y sustituye al presupuesto como señal de
// calificación: es la que de verdad cambia la conversación (48 o 60 meses
// implica mensualidades muy distintas) y se contesta con un tap, sin sacar al
// visitante del formulario donde ya está escribiendo.
//
// DOS VARIANTES, un solo componente. `hero` es el par nombre+WhatsApp que va
// arriba del documento —el formulario completo vivía a y ≈ 3,374 px, tres
// pantallas y media de scroll—. `principal` es el de la columna, con plazo,
// objetivo y el detalle de qué recibes. El contrato de marcado que las verifica
// está en `tests/lp-lotes-form.mjs`; si cambian los `data-lp-contacto`, ese
// test falla y el build de la LP deja de tener red.
//
// Atribución: `gclid`/`wbraid`/UTMs se leen de la URL y viven en estado React
// hasta el POST. Deliberadamente NO se usa `useUTMCapture`, que los persiste en
// sessionStorage.
// ============================================================

const CLAVES_URL = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'wbraid',
  'fbclid',
  // `short_code` del QR fisico (lo estampa /q/[code] del Hub). Esta LP vive
  // fuera de [locale], asi que <UTMCapture /> no se monta aqui: la lista de
  // claves esta duplicada a proposito y hay que tocar AMBAS.
  'qr',
] as const;

type Atribucion = Partial<Record<(typeof CLAVES_URL)[number], string>>;

/**
 * Eventos secundarios de observación, no de puja. No hay helper canónico porque
 * son específicos de esta landing; gtag hace queue antes de cargar, así que es
 * seguro llamarlo dentro del handler.
 */
function emitirEvento(evento: string, formType: string) {
  if (typeof window === 'undefined') return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', evento, { form_type: formType });
}

/**
 * El objetivo pasó de ser tres botones de 56px que ocupaban un paso entero a
 * ser tres chips opcionales. Mismo dato para el asesor, cero coste de entrada.
 */
function chip(activo: boolean) {
  return `min-h-[40px] cursor-pointer border px-3 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lp-accent)] ${
    activo
      ? 'border-[var(--lp-accent)] bg-[var(--lp-accent)]/8 text-[var(--lp-accent)]'
      : 'border-[var(--lp-line)] bg-white text-[var(--lp-ink-soft)] hover:border-[var(--lp-accent)]/50'
  }`;
}

const INPUT =
  'min-h-[52px] w-full border border-[var(--lp-line)] bg-white px-4 font-mono text-sm text-[var(--lp-ink-soft)] transition-colors duration-200 placeholder:font-sans placeholder:text-[var(--lp-ink-soft)]/35 focus:border-[var(--lp-accent)] focus:outline-2 focus:outline-offset-0 focus:outline-[var(--lp-accent)]';

const ETIQUETA = 'text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--lp-muted)]';

export default function LeadFormLotes({
  loteNombre,
  loteRef,
  plazosDisponibles,
  /**
   * ⚠️ COMPROMISO OPERATIVO, no copy: define qué promete la marca al pulsar
   * enviar. El default es el más conservador que sigue siendo un compromiso;
   * cambiarlo es decisión de negocio, no de diseño.
   */
  tiempoRespuesta,
  /**
   * `hero` = par nombre+WhatsApp, arriba del documento. `principal` = el
   * formulario completo de la columna. Ver el bloque de arriba.
   */
  variante = 'principal',
  locale = 'es',
}: {
  loteNombre: string;
  /** Slug del lote, para que el lead llegue al CRM ya referenciado. */
  loteRef: string;
  /** Plazos publicados (48/60). Vacío ⇒ no se pregunta. */
  plazosDisponibles: number[];
  tiempoRespuesta?: string;
  variante?: 'principal' | 'hero';
  locale?: LocaleLp;
}) {
  const t = FORM[locale];
  const tiempo = tiempoRespuesta ?? t.tiempoRespuesta;
  const esHero = variante === 'hero';
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [plazo, setPlazo] = useState<number | null>(plazosDisponibles.at(-1) ?? null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const atribucion = useRef<Atribucion>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const refNombre = useRef<HTMLInputElement>(null);
  const refEmail = useRef<HTMLInputElement>(null);

  // Atribución leída una vez, al montar. Sin storage.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captura: Atribucion = {};
    for (const clave of CLAVES_URL) {
      const valor = params.get(clave);
      if (valor) captura[clave] = valor;
    }
    atribucion.current = captura;
  }, []);

  /**
   * ═══ RESCATE DE LO QUE SE RELLENÓ ANTES DE HIDRATAR ═══
   *
   * Este efecto es CONSECUENCIA de quitar la compuerta, no algo independiente.
   *
   * Mientras el formulario vivía detrás de «¿Qué estás buscando?», este bug era
   * imposible: no se llegaba a un campo sin que React ya hubiera hidratado, dado
   * que el avance de paso lo hacía el propio React. Al servirse ahora el
   * formulario en el HTML del servidor, se abre una ventana entre que los campos
   * se ven —~600 ms— y que React responde —~2.2 s en escritorio, más en un móvil
   * con 4G, porque compiten GA4, el Pixel de Meta, Hotjar y el de OpenAI por el
   * hilo principal—.
   *
   * Quien rellena en esa ventana deja su texto en el DOM, pero `nombre` y
   * `whatsapp` siguen valiendo `''`: React nunca lee de vuelta un input
   * controlado al hidratar. El resultado en pantalla es el peor posible: el
   * campo SE VE lleno y al enviar responde «Necesitamos tu nombre y un
   * WhatsApp». Sin error de consola, sin POST, sin lead, y sin curarse solo.
   *
   * El disparador más común no es teclear rápido: es el AUTOCOMPLETADO del
   * navegador, que rellena de golpe y en muchos navegadores no dispara el
   * `onChange` que React escucha. Le toca justo a quien venía con menos
   * fricción.
   *
   * Medido contra producción en la variante corta el 2026-08-21 y cubierto por
   * el escenario B de `tests/lp-terrenos-conversion.mjs`. Va aquí también para
   * que las dos variantes del A/B se comporten igual: arreglarlo solo en una
   * sesgaría la prueba a su favor.
   */
  useEffect(() => {
    const pares: Array<[string, (v: string) => void]> = [
      [refNombre.current?.value ?? '', setNombre],
      [refEmail.current?.value ?? '', setEmail],
    ];
    for (const [valorDom, fijar] of pares) {
      if (valorDom) fijar(valorDom);
    }
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setError(null);

    if (!nombre.trim() || !email.trim() || !whatsapp) {
      setError(t.errorFaltan);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.errorCorreo);
      return;
    }
    // La validación por país la hace el selector de lada, no un conteo de
    // dígitos: un comprador extranjero no puede perder el lead por la lada.
    if (!isValidPhoneNumber(whatsapp)) {
      setError(t.errorTelefono);
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: t.leadSource,
          locale,
          name: nombre.trim(),
          phone: whatsapp,
          whatsapp: whatsapp,
          email: email.trim(),
          investmentType: objetivo ?? undefined,
          propertyName: loteNombre,
          // Referencia y plazo en el mensaje: el asesor abre la conversación
          // sabiendo de qué lote y de qué plan se habla, sin preguntarlo.
          message: [
            t.lead.ref(loteRef),
            plazo ? t.lead.plan(plazo) : t.lead.sinPlan,
            objetivo ? t.lead.objetivo(objetivo.toLowerCase()) : null,
          ]
            .filter(Boolean)
            .join(' '),
          page: window.location.href,
          website: honeypot.current?.value || '',
          ...atribucion.current,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackGenerateLead({ formType: t.formType });
      setEnviado(true);
    } catch {
      setError(t.errorEnvio);
    } finally {
      setEnviando(false);
    }
  }

  // Agradecimiento en la misma ruta: redirigir a /gracias perdería el contexto
  // de medición y el gclid de la URL.
  if (enviado) {
    return (
      <div
        data-lp-contacto={variante}
        className="border-t-2 border-[var(--lp-accent)] bg-white p-6"
        role="status"
        aria-live="polite"
      >
        <Check className="size-5 text-[var(--lp-accent)]" aria-hidden="true" />
        <p className="mt-3 lp-display text-lg leading-snug text-[var(--lp-ink)]">
          {t.gracias(nombre.trim().split(' ')[0])}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--lp-ink-soft)]">
          {t.graciasA}{' '}
          <span className="font-mono">{whatsapp}</span> {tiempo} {t.graciasB}
          {plazo ? t.graciasPlazo(plazo) : ''} {t.graciasC}
        </p>
        {!esHero && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--lp-ink-soft)]">
            {t.graciasNoEncaja}
          </p>
        )}
      </div>
    );
  }

  // Los campos que de verdad convierten, idénticos en ambas variantes.
  // Extraídos a una constante para que la copia de arriba y la de la columna no
  // puedan divergir: si un día se añade un campo requerido, entra en las dos o
  // en ninguna.
  const camposContacto = (
    <>
      <label className="flex flex-col gap-1.5">
        <span className={ETIQUETA}>{t.nombre}</span>
        <input
          className={INPUT}
          type="text"
          ref={refNombre}
          name="name"
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={ETIQUETA}>{t.email}</span>
        <input
          className={INPUT}
          type="email"
          ref={refEmail}
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={ETIQUETA}>{t.whatsapp}</span>
        <PhoneInputField
          id="lp-lotes-whatsapp"
          name="phone"
          value={whatsapp}
          onChange={setWhatsapp}
          placeholder={t.placeholderTelefono}
          defaultCountry={t.paisTelefono}
          required
          className={INPUT}
        />
      </label>
    </>
  );

  // Honeypot. Un captcha visible cuesta conversión; esto no.
  const trampaBots = (
    <input
      ref={honeypot}
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
    />
  );

  const aviso = error ? (
    <p className="text-xs text-error" role="alert">
      {error}
    </p>
  ) : null;

  // ── Variante hero ─────────────────────────────────────────────────────────
  // El formulario completo vive a tres pantallas y media de scroll. Esto es el
  // mínimo viable para capturar a quien ya está convencido con el titular: dos
  // campos y un botón, sin plazo ni objetivo, que se preguntan luego por
  // WhatsApp. No sustituye al de la columna, lo adelanta.
  if (esHero) {
    return (
      <div
        data-lp-contacto="hero"
        className="border-t-[3px] border-[var(--lp-accent)] bg-white p-5 shadow-[0_8px_28px_rgb(22_25_28/0.18)] sm:p-6"
      >
        <p className="lp-display text-base leading-snug text-[var(--lp-ink)]">
          {t.heroTitulo}
        </p>
        <form className="mt-4 flex flex-col gap-3" onSubmit={enviar} noValidate>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 flex-col gap-3">{camposContacto}</div>
          </div>

          {trampaBots}
          {aviso}

          <button
            type="submit"
            disabled={enviando}
            className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 bg-[var(--lp-accent)] px-5 text-base font-semibold text-white shadow-[0_2px_10px_rgb(168_64_42/0.28)] transition-colors duration-200 hover:bg-[var(--lp-accent-strong)] disabled:cursor-default disabled:opacity-60"
          >
            {enviando ? t.enviando : t.heroBoton}
            {!enviando && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>

          <p className="text-xs leading-relaxed text-[var(--lp-ink-soft)]/70">
            {t.heroNotaA} {tiempo} {t.heroNotaB}
          </p>
        </form>
      </div>
    );
  }

  // ── Variante principal ────────────────────────────────────────────────────
  return (
    <div
      data-lp-contacto="principal"
      className="border-t-[3px] border-[var(--lp-accent)] bg-white shadow-[0_8px_28px_rgb(22_25_28/0.10)]"
    >
      <div className="border-x border-b border-[var(--lp-line)] p-5 sm:p-6">
        {/* `p` y no `h3`: `globals.css` pisa el font-size de los headings
            fuera de `.lp-root`… y aquí sí estamos dentro, pero el encabezado
            real de la conversión es el `TituloSeccion` de la columna de al
            lado. Dos h3 compitiendo confunden el índice del documento. */}
        <p className="lp-display text-lg leading-snug text-[var(--lp-ink)]">
          {t.principalTitulo}
        </p>

        <form className="mt-5 flex flex-col gap-4" onSubmit={enviar} noValidate>
          {camposContacto}

          {/* Radios nativos: flechas y anuncio del grupo salen gratis, y no
              cuesta escritura. */}
          {plazosDisponibles.length > 0 && (
            <fieldset className="flex flex-col gap-1.5">
              <legend className={ETIQUETA}>{t.plazoLegend}</legend>
              <div className="mt-1.5 flex gap-2">
                {plazosDisponibles.map((m) => (
                  <label
                    key={m}
                    className={`flex min-h-[48px] flex-1 cursor-pointer items-center justify-center border text-sm transition-colors duration-200 ${
                      plazo === m
                        ? 'border-[var(--lp-accent)] bg-[var(--lp-accent)]/8 text-[var(--lp-accent)]'
                        : 'border-[var(--lp-line)] bg-white text-[var(--lp-ink-soft)] hover:border-[var(--lp-accent)]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plazo"
                      value={m}
                      checked={plazo === m}
                      onChange={() => setPlazo(m)}
                      className="sr-only"
                    />
                    <span className="lp-num">{m} {t.meses}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* El objetivo: era un paso entero que bloqueaba el formulario. Ahora
              es opcional y va después del contacto, donde no puede costar un
              lead. Un solo tap, y el asesor abre la conversación sabiéndolo. */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className={ETIQUETA}>
              {t.objetivoLegend} <span className="lowercase tracking-normal">{t.opcional}</span>
            </legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {t.objetivos.map((o) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={objetivo === o}
                  className={chip(objetivo === o)}
                  onClick={() => {
                    const siguiente = objetivo === o ? null : o;
                    setObjetivo(siguiente);
                    if (siguiente) emitirEvento('objetivo_elegido', t.formType);
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>

          {trampaBots}
          {aviso}

          <button
            type="submit"
            disabled={enviando}
            className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 bg-[var(--lp-accent)] px-5 text-base font-semibold text-white shadow-[0_2px_10px_rgb(168_64_42/0.28)] transition-colors duration-200 hover:bg-[var(--lp-accent-strong)] disabled:cursor-default disabled:opacity-60"
          >
            {enviando ? t.enviando : t.principalBoton}
            {!enviando && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>

          {/* Qué pasa cuando envías. Va DEBAJO del botón, no encima: encima
              es una lista de requisitos antes de actuar; debajo es lo que
              recibes por haber actuado. La oferta no puede ser lo que la
              página ya publica — son tres cosas que solo existen fuera. */}
          <div className="border-t border-[var(--lp-line)] pt-4">
            <p className={ETIQUETA}>{t.quePasa}</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs leading-relaxed text-[var(--lp-ink-soft)]">
              <li>
                {t.quePasa1A}{' '}
                <span className="text-[var(--lp-ink)]">{tiempo}</span>.
              </li>
              <li>{t.quePasa2}</li>
              <li>
                {t.quePasa3A}
                {plazo ? t.graciasPlazo(plazo) : ''}
                {t.quePasa3B}
              </li>
              <li>
                {t.quePasa4}
              </li>
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-[var(--lp-ink-soft)]/60">
            {t.consentimiento}
          </p>
        </form>
      </div>
    </div>
  );
}
