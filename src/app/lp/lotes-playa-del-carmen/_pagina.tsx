import Image from 'next/image';
import Link from 'next/link';
import { getLotePlayaDelCarmen, type ImagenLanding } from '@/lib/supabase/lp-lotes';
import { getLotesComparables } from '@/lib/supabase/lp-lotes-comparador';
import { FALLBACK_WHATSAPP } from '@/lib/site-contact';
import FichaLote from '../_components/FichaLote';
import DisclosureModule from '../_components/DisclosureModule';
import LeadFormLotes from '../_components/LeadFormLotes';
import StickyCta from '../_components/StickyCta';
import QueEstasComprando from '../_components/QueEstasComprando';
import PlanDePagos from '../_components/PlanDePagos';
import PruebaDeQueExistimos from '../_components/PruebaDeQueExistimos';
import WhatsAppCta from '../_components/WhatsAppCta';
import UnDomingoAqui from '../_components/UnDomingoAqui';
import ComparadorLotes from '../_components/ComparadorLotes';
import AvailabilityBadge from '../_components/AvailabilityBadge';
import { ChipsHero } from '../_components/v2/ChipsUbicacion';
import {
  FAQ_COMPRA,
  FAQ_FINANCIAMIENTO,
  FAQ_COMPRA_EN,
  FAQ_FINANCIAMIENTO_EN,
} from '../_components/v2/faqs';
import { rutaLegal, type LocaleLp } from '../_components/v2/i18n';
import FaqCategorias from '../_components/v2/FaqCategorias';
import { claveUbicacion } from '@/lib/supabase/lp-inventario';
import '../_components/v2/tokens.css';
import '../_components/v2/marca.css';
import './lpl-marca.css';
import { TituloSeccion, BotonPrimario } from '../_components/ui';
import { mxn, mxnExacto, m2 } from '../_components/format';
import { PAGINA } from './_copy';
import { localizarLote } from './_localizar';

/**
 * Placeholder borroso del hero: la imagen curada reducida a 16 px de ancho.
 *
 * Constante y no generado en tiempo de render a propósito. La alternativa
 * (`plaiceholder`) añade una dependencia y una descarga de 1 MB en cada
 * revalidación de ISR para producir estos 306 bytes. La imagen del hero está
 * fijada por nombre de archivo en `IMAGENES_CURADAS`, así que solo puede
 * cambiar cuando alguien edite esa lista a mano — y ese es el momento de
 * regenerar esto. Si la foto cambiara sin regenerarlo, el peor caso es un
 * degradado de otros colores durante unos milisegundos.
 */
const BLUR_HERO =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAJABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAEF/8QAHhABAAICAQUAAAAAAAAAAAAAAQIDABESMUVRcYL/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABYRAQEBAAAAAAAAAAAAAAAAAAABIf/aAAwDAQACEQMRAD8AJVZVJFCDs2efWW6secGzc4hLprCmaHbqfrJTS//Z';

/**
 * Cuerpo de la landing de lotes. Lo sirven DOS rutas: la española
 * (`/lp/lotes-playa-del-carmen`) y la inglesa (`/lp/lots-playa-del-carmen`),
 * que solo aportan `metadata`, `revalidate` y el idioma. Mismo árbol, mismo
 * dato, mismo formulario: lo único propio de cada idioma está en `_copy.ts`.
 */
export default async function PaginaLotes({ locale }: { locale: LocaleLp }) {
  const c = PAGINA[locale];
  // En paralelo: el comparador es contenido secundario y no debe sumar su
  // latencia a la del lote protagonista.
  // Brief de octubre-2026: la landing habla de la Riviera Maya, así que el
  // comparador trae también Tulum y la cabecera ofrece las ciudades como filtro.
  const [loteCrudo, lotesComparables] = await Promise.all([
    getLotePlayaDelCarmen(locale),
    getLotesComparables(['Playa del Carmen', 'Tulum']),
  ]);

  // Textos curados del dato (pies de foto, servicios, estados) en el idioma
  // de la página. En español devuelve el mismo objeto.
  const lote = loteCrudo ? localizarLote(loteCrudo, locale) : null;

  // Inventario de una unidad: que se venda o se aparte es un escenario probable,
  // no un caso borde. La página lo trata como estado, no como error.
  if (!lote) {
    return (
      <div className="lpl-root lpv marca marca-oscura lpl-oscuro relative isolate overflow-hidden">
        <div aria-hidden="true" className="marca-reticula" />
        <div className="relative mx-auto max-w-2xl px-5 py-24">
          <h1 className="lp-display text-[clamp(1.75rem,1.3rem+2vw,2.5rem)] leading-[1.05] text-white">
            {c.agotado.titulo}
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-white/70">
            {c.agotado.cuerpo}
          </p>
          <div className="mt-8">
            <WhatsAppCta
              loteSlug="agotado"
              telefono={FALLBACK_WHATSAPP}
              mensaje={c.agotado.mensajeWa}
              surface={c.surface.agotado}
              locale={locale}
            />
          </div>
        </div>
      </div>
    );
  }

  const plan = lote.plan;
  const plazoMax = plan?.opciones.at(-1) ?? null;
  const apr = lote.aprovechamiento;
  // Imagen curada; `imagenPortada` queda como respaldo si la galería del
  // desarrollo cambia y el archivo de la lista blanca deja de existir.
  const heroImg =
    lote.imagenes.hero ??
    (lote.imagenPortada
      ? ({
          url: lote.imagenPortada,
          alt: c.heroRespaldo.alt,
          // El respaldo se rotula como render por defecto. La portada del Hub
          // no declara su tipo, y en este catálogo la portada es casi siempre
          // un render: ante la duda, la etiqueta conservadora es la que no
          // presenta una imagen del proyecto como si fuera obra existente.
          tipo: 'render',
          caption: c.heroRespaldo.caption,
        } satisfies ImagenLanding)
      : null);

  // Ciudades con lotes publicados, para los chips del hero. Se derivan del
  // comparador, que es lo que esos chips filtran.
  const conteoCiudades = new Map<string, number>();
  for (const l of lotesComparables) {
    conteoCiudades.set(l.ciudad, (conteoCiudades.get(l.ciudad) ?? 0) + 1);
  }
  const ciudades = [...conteoCiudades.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([nombre, total]) => ({ clave: claveUbicacion(nombre), nombre, total }));

  const mensajeWa = [
    c.mensajeWa.interes(lote.slug),
    lote.superficieM2 && lote.precioMxn
      ? c.mensajeWa.sonDe(m2(lote.superficieM2), mxn(lote.precioMxn))
      : null,
    plazoMax ? c.mensajeWa.plan(plazoMax.meses) : c.mensajeWa.sinPlan,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="lpl-root lpv marca">
      {/* ═══════════ 1 · Hero ═══════════
          Antes: dos columnas, texto a la izquierda sobre aztec plano, foto
          arrinconada a la derecha. La foto no hacía trabajo y el bloque de
          texto cargaba con siete elementos.

          Ahora: imagen a sangre con degradado, y sólo cuatro elementos encima
          (cintillo, titular, subtítulo, CTAs). Las cifras y la línea de
          honestidad bajan a su propia banda: son la segunda respiración, no
          parte del primer golpe. */}
      <section className="lpl-oscuro relative isolate min-h-[92svh] overflow-hidden bg-[var(--lp-dark)] lg:min-h-[100svh]">
        {heroImg && (
          <Image
            src={heroImg.url}
            alt={heroImg.alt}
            fill
            priority
            // `100vw` a secas hacía que el navegador pidiera el candidato de
            // 3840 px: 691 KB de JPEG para el LCP. El original de Supabase mide
            // 2400 px de ancho, así que pedir más no añade un solo píxel real,
            // solo lo reescala hacia arriba. Con este tope se sirve 2048.
            sizes="(min-width: 2048px) 2048px, 100vw"
            // Sin placeholder, el hueco se pintaba con el fondo oscuro de la
            // sección mientras bajaba la foto, y en una conexión lenta la
            // página se veía como un rectángulo negro con texto encima. Ahora
            // entra el degradado de la propia imagen desde el primer frame.
            placeholder="blur"
            blurDataURL={BLUR_HERO}
            className="object-cover"
          />
        )}
        {/* Velo Aztec de marca, no capa plana: oscurece el lado del texto y
            deja limpia la foto bajo el formulario de vidrio. Encima, la
            retícula de líneas y nodos del manual. */}
        <div aria-hidden="true" className="marca-velo" />
        <div aria-hidden="true" className="marca-reticula" />

        <div className="relative mx-auto grid min-h-[92svh] max-w-6xl content-end gap-10 px-5 pb-14 pt-28 sm:px-8 lg:min-h-[100svh] lg:grid-cols-[1.1fr_minmax(0,26rem)] lg:items-end lg:gap-16 lg:pb-20">
          <div>
          {/* Estado real, no escasez. Decía «Uno disponible» leyendo el número
              de REGISTROS de `v_units`, y el desarrollador declara 229 lotes
              disponibles de 310: ver `AvailabilityBadge`. */}
          <div>
            <AvailabilityBadge
              estado={lote.estadoComercial}
              disponibles={lote.lotesDisponiblesPrivada}
              fechaCorte={lote.fechaCorte}
              locale={locale}
            />
          </div>

          {/* H1. Antes abría con «Aquí puedes construir una casa de dos
              niveles»: la consecuencia, no la categoría. Era buen copy y mal
              anuncio — la palabra que la persona acababa de teclear
              («terrenos», «Playa del Carmen») no aparecía en el primer pliegue,
              y la primera que sí aparecía era «casa», que es otro producto.

              Ahora la categoría y la ciudad van delante, y la consecuencia
              —que sigue siendo aritmética verificable de COS y CUS, no una
              promesa— queda inmediatamente después, en la misma frase. Se gana
              relevancia sin perder el gancho. */}
          {/* Brief de octubre-2026: solo la categoría y la región. La
              aritmética de niveles construibles sigue en la ficha. */}
          <h1 className="lp-display mt-5 max-w-[18ch] text-[clamp(2.25rem,1.5rem+3.6vw,4.5rem)] leading-[1.02] text-balance text-[var(--lp-on-dark)]">
            {c.hero.h1}
          </h1>

          {/* Recortado de cinco líneas a dos. Cada línea de aquí empuja los CTA
              hacia abajo, y medido en 390x844 los dos botones quedaban fuera de
              alcance visual. El dato de la privada de 310 lotes y el aviso de
              que abajo hay más terrenos no se pierden: viven en la banda de
              cifras y en el comparador, que ahora está a dos pantallas. */}
          {/* Ubicaciones como filtro desde el primer pliegue: bajan al
              comparador con la ciudad ya elegida. */}
          {ciudades.length > 1 && (
            <div className="mt-7">
              <ChipsHero ubicaciones={ciudades} tono="oscuro" locale={locale} />
            </div>
          )}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotonPrimario href="#solicitar">
              {plan ? c.hero.ctaPlan : c.hero.ctaDetalle}
            </BotonPrimario>
            <WhatsAppCta
              loteSlug={lote.slug}
              telefono={FALLBACK_WHATSAPP}
              mensaje={mensajeWa}
              surface={c.surface.hero}
              locale={locale}
            />
          </div>

          {/* El render más grande de la página era el único sin rotular. No
              puede ir en un `<figure>` —es el fondo, con el texto encima— así
              que el rótulo va aquí, discreto y al pie, como en una publicación:
              se lee si lo buscas y no compite con el titular. Sin él, la página
              abre contradiciendo su propia tesis. */}
          {heroImg && (
            <p className="lp-rotulo mt-8 text-[0.75rem] font-normal leading-relaxed text-[var(--lp-on-dark)]/65">
              {c.hero.renderDe} {heroImg.caption}
            </p>
          )}
          </div>

          {/* Captura arriba del documento, AL LADO del titular (brief de
              octubre-2026). Los dos CTA de arriba son ancla y enlace; el
              formulario real vivía a tres pantallas y media y la campaña gastó
              $991 MXN en 72 clics sin un envío. */}
          <div className="max-w-[26rem] lg:max-w-none">
            <LeadFormLotes
              variante="hero"
              loteNombre={lote.titulo}
              loteRef={lote.slug}
              plazosDisponibles={lote.mesesOpciones}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ 1.5 · Las cifras ═══════════
          Banda propia, inmediatamente bajo el hero. Orden deliberado: lo que
          cuesta entrar, lo que se paga cada mes, lo construible, y sólo al
          final el precio total.

          La tercera celda es la que cambia la percepción del precio: el total
          sobre la superficie del lote se lee caro; sobre los metros
          construibles se lee distinto. Mismo número, marco distinto, cero
          engaño, y el precio total sigue presente.

          El enganche NO se lee de `plan`: se lee de `lote.engancheMxn`, que no
          depende de la tasa. Antes esta celda decía «sin dato» mientras la
          ficha, cuatro bloques abajo, publicaba la cifra. */}
      <section className="bg-[var(--lp-paper-2)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-12">
          <dl className="marca-tarjeta grid grid-cols-2 gap-x-6 gap-y-7 p-6 sm:grid-cols-4 sm:p-8">
            {[
              {
                k: c.cifras.enganche,
                v: lote.engancheMxn !== null ? mxn(lote.engancheMxn) : null,
                destacado: true,
              },
              {
                k: plazoMax ? c.cifras.alMesPlazo(plazoMax.meses) : c.cifras.alMes,
                v: plazoMax ? mxn(plazoMax.mensualidadMxn) : null,
                destacado: true,
              },
              { k: c.cifras.construible, v: apr ? m2(apr.construibleM2) : null },
              { k: c.cifras.precioTotal, v: lote.precioMxn ? mxn(lote.precioMxn) : null },
            ].map((cifra) => (
              <div key={cifra.k}>
                <dt className="lp-rotulo text-[var(--lp-muted)]">
                  {cifra.k}
                </dt>
                <dd
                  className={`lp-display lp-num mt-2 text-[clamp(1.5rem,1.1rem+1.4vw,2.125rem)] leading-none ${
                    cifra.destacado
                      ? 'font-semibold text-[var(--lp-ink)]'
                      : 'text-[var(--lp-ink-soft)]'
                  }`}
                >
                  {cifra.v ?? (
                    <a href="#falta-confirmar" className="lp-gate text-base">
                                            {c.cifras.faltaConfirmar}
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 grid gap-x-12 gap-y-4 px-1 md:grid-cols-2">
            {/* La contraentrega no es letra chica: es parte del número de arriba. */}
            {plan ? (
              <p className="max-w-[54ch] text-sm leading-relaxed text-[var(--lp-muted)]">
                {c.cifras.contraentregaA}{' '}
                <span className="lp-num text-[var(--lp-ink-soft)]">
                  {mxn(plan.contraentregaMxn)}
                </span>{' '}
                {c.cifras.contraentregaB(plan.contraentregaPct)}
              </p>
            ) : (
              <p className="max-w-[54ch] text-sm leading-relaxed text-[var(--lp-muted)]">
                {c.cifras.precioM2A}{' '}
                {lote.precioM2Mxn ? mxnExacto(lote.precioM2Mxn) : c.cifras.porConfirmar}
                {c.cifras.precioM2B}
              </p>
            )}

            {/* Honestidad en una línea, DESPUÉS del valor. El detalle vive abajo.
                No se suaviza la objeción, se recoloca. */}
            <p className="max-w-[54ch] text-sm leading-relaxed text-[var(--lp-ink-soft)]">
              {c.cifras.honestidadA}{' '}
              <a href="#falta-confirmar" className="lp-gate">
                                {c.cifras.honestidadLink}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ 1.6 · Barra de credibilidad ═══════════
          Va aquí y no pegada al hero: la banda de cifras es la segunda
          respiración del hero y romperla dejaría el precio flotando lejos del
          titular. Este es el primer hueco real, y sigue estando dos pantallas
          antes del primer punto de conversión.

          Resume el bloque «Cómo compruebas que existimos», que vive al 90% del
          scroll y que nadie que dude de nosotros alcanza a leer. Ese bloque no
          se toca: aquí solo se declara que hay algo verificable, con enlace. */}
      {/* La barra de credibilidad de cuatro celdas se quitó (brief de
          octubre-2026): hablaba de un lote en específico y la página ya no. */}

      {/* ═══════════ 2.6 · Los demás terrenos de Playa del Carmen ═══════════
          SUBIDO desde el final de la página (iba tras el cierre, a ~2,900
          palabras del hero).

          El razonamiento original para ponerlo abajo era bueno para conversión:
          la página no tiene rutas de salida a propósito, y el comparador se
          colocó después del cierre para captar solo a quien ya había descartado
          este lote, sin desviar a quien iba a convertir.

          Lo que ese razonamiento no contemplaba es de dónde llega el tráfico.
          La campaña compra términos en PLURAL —«terrenos residenciales»,
          «terrenos en playa del carmen»— y las cinco keywords traían
          `post_click_quality_score = BELOW_AVERAGE`. Quien busca en plural y
          aterriza en la ficha de UN lote ve un callejón sin salida, y eso es
          exactamente lo que mide Google. El inventario existía; estaba
          enterrado.

          Sigue siendo el mismo componente, con los mismos datos y el mismo gate
          Camino A: `getLotesComparables` no selecciona `development_name` ni
          `developer_name`, así que ningún nombre interno puede llegar al HTML.
          Se oculta solo si hay menos de dos lotes que comparar. */}
      <ComparadorLotes lotes={lotesComparables} locale={locale} />

      {/* ═══════════ 2.5 · Un domingo aquí ═══════════
          Va inmediatamente después de la respuesta directa, antes de cualquier
          objeción. Es el único bloque de la página cuyo trabajo es proyectar la
          vida, y el único punto donde se agrega un ancla de CTA. */}
      <UnDomingoAqui lote={lote} locale={locale} />

      {/* ═══════════ 3-4 · Promesa y plan, con el formulario al lado ═══════════
          El formulario vive aquí y no al final: en móvil aparece justo después del
          plan de pagos, a dos pantallas del hero. */}
      <div className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-16">
            <QueEstasComprando lote={lote} locale={locale} />
            <PlanDePagos lote={lote} locale={locale} />
          </div>

          <aside id="solicitar" className="lg:sticky lg:top-6">
            <LeadFormLotes
              loteNombre={lote.titulo}
              loteRef={lote.slug}
              plazosDisponibles={lote.mesesOpciones}
              locale={locale}
            />
            <p className="mt-5 max-w-[46ch] text-xs leading-relaxed text-[var(--lp-muted)]">
              {c.aside.nota}
            </p>
          </aside>
        </div>

        {/* ═══════════ 5 · Ficha ═══════════ */}
        <div className="mt-16 lg:mt-20 lg:max-w-3xl">
          <FichaLote lote={lote} locale={locale} />
        </div>
      </div>

      {/* ═══════════ 6 · Antes de firmar: los cinco bloques de riesgo ═══════════
          Eran cinco secciones consecutivas —urbanización, lo que no sabemos,
          jurídico, costos, para quién no es— y el scroll medio de la página era
          un descargo de responsabilidad de varias pantallas. Van íntegras,
          agrupadas en acordeón nativo. Ver `DisclosureModule`. */}
      <DisclosureModule lote={lote} locale={locale} />

      {/* ═══════════ 6.5 · El calendario, reencuadrado ═══════════
          El cambio de mayor palanca de la página, y no cambia un solo hecho:
          mismas fechas, misma advertencia, ninguna omisión. Lo que cambia es
          que el calendario largo deja de ser sólo un costo y se nombra también
          como lo que es —la razón por la que el producto es barato y financiado
          sin intereses— y el costo se declara acto seguido, en el mismo bloque.

          Va DESPUÉS de la tabla de servicios a propósito: primero el visitante
          ve que hoy no hay nada conectado, y sólo entonces lee por qué eso es
          el precio de la ventana de cinco años. Al revés sería suavizar. */}
      <section aria-labelledby="ventana-titulo" className="bg-[var(--lp-panel)]">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <TituloSeccion id="ventana-titulo">
              {c.ventana.titulo}
            </TituloSeccion>

            <div className="flex max-w-[62ch] flex-col gap-4 text-base leading-relaxed text-[var(--lp-ink-soft)]">
              <p>
                {c.ventana.p1}
              </p>
              <p>
                {c.ventana.p2Inicio}
                {plan?.sinIntereses && lote.mesesOpciones.length > 0 ? (
                  <>{c.ventana.p2SinIntereses(lote.mesesOpciones.join(c.ventana.plazosUnion))}</>
                ) : (
                  <>{c.ventana.p2Conforme}</>
                )}
                {c.ventana.p2Fin}
              </p>
              {/* El costo de la ventana, sin suavizar y en el mismo bloque. */}
              <p>
                {c.ventana.p3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 7-8 · Prueba y FAQ ═══════════
          Urbanización, pendientes, jurídico, costos y «para quién no es» subieron
          al módulo `DisclosureModule`. Aquí queda lo que NO es una objeción: la
          prueba de que existimos y las preguntas. */}
      <div className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
        <div className="flex flex-col gap-16">
          <PruebaDeQueExistimos lote={lote} locale={locale} />

          {/* ───── 11 · FAQ ─────
              Acordeón nativo con chevron (brief de octubre-2026) y las
              preguntas de «compra» y «financiamiento» del sitio, no unas
              escritas para la landing. */}
          <FaqCategorias
            locale={locale}
            categorias={[
              { nombre: c.faq.compra, faqs: locale === 'en' ? FAQ_COMPRA_EN : FAQ_COMPRA },
              {
                nombre: c.faq.financiamiento,
                faqs: locale === 'en' ? FAQ_FINANCIAMIENTO_EN : FAQ_FINANCIAMIENTO,
              },
            ]}
            className="lp-faq"
          />
        </div>
      </div>

      {/* ═══════════ 12 · Cierre ═══════════
          Un solo formulario en la página, arriba. Aquí sólo el ancla de vuelta,
          para no duplicar componente ni eventos de medición. */}
      <section className="lpl-oscuro marca-degradado relative isolate overflow-hidden">
        <div aria-hidden="true" className="marca-reticula" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:py-20">
          {/* Segunda y última instancia. Quien llega hasta aquí leyó los cinco
              bloques de riesgo: recordarle en qué estado está el lote y a qué
              fecha lo verificamos es información, no presión. */}
          <div className="mb-6">
            <AvailabilityBadge
              estado={lote.estadoComercial}
              disponibles={lote.lotesDisponiblesPrivada}
              fechaCorte={lote.fechaCorte}
              locale={locale}
            />
          </div>
          <p className="max-w-[40ch] lp-display text-[clamp(1.5rem,1.2rem+1.4vw,2.5rem)] leading-[1.08] text-balance text-white">
            {plan ? c.cierre.conPlan : c.cierre.sinPlan}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {/* Usa el componente, no una copia de sus clases. Estas clases
                estaban duplicadas a mano y al reforzar `BotonPrimario` este CTA
                se quedó atrás: 14px/500 sin elevación contra 16px/600 con ella,
                o sea el botón del cierre pesaba MENOS que el del hero. */}
            <BotonPrimario href="#solicitar">
              {plan ? c.cierre.ctaPlan : c.cierre.ctaDetalle}
            </BotonPrimario>
            <WhatsAppCta
              loteSlug={lote.slug}
              telefono={FALLBACK_WHATSAPP}
              mensaje={mensajeWa}
              surface={c.surface.cierre}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ 13 · Pie legal ═══════════ */}
      <footer className="border-t border-[var(--lp-line-dark)] bg-[var(--lp-dark)]">
        <div className="mx-auto max-w-6xl px-5 py-10 pb-24 lg:pb-10">
          <div className="flex max-w-[80ch] flex-col gap-3 text-xs leading-relaxed text-white/50">
            <p>
              {c.pie.precios}
            </p>
            {/* Condicional a propósito: si la licencia no está completa, afirmar
                que los datos "se indican" sería exactamente el tipo de declaración
                falsa que el artículo 69 pretende evitar.

                Cuando NO está completa, el pie no repite el párrafo: el
                incumplimiento se declara una sola vez, en el bloque de
                pendientes, y aquí sólo se enlaza. Tres copias del mismo texto
                legal en una página leen como plantilla, y la plantilla es
                justo lo que esta página no puede permitirse. */}
            {lote.licencia.completa ? (
              <p>
                {c.pie.licenciaCompleta}
              </p>
            ) : (
              <p>
                {c.pie.licenciaPendienteA}{' '}
                <a
                  href="#falta-confirmar"
                  className="underline decoration-white/30 transition-colors duration-200 hover:text-white/80"
                >
                                    {c.pie.licenciaPendienteLink}
                </a>
                {c.pie.licenciaPendienteB}
              </p>
            )}
            <p>
              <Link
                href={rutaLegal(locale, 'privacidad')}
                className="underline decoration-white/30 transition-colors duration-200 hover:text-white/80"
              >
                                {c.pie.privacidad}
              </Link>
            </p>
          </div>
        </div>
      </footer>

      <StickyCta
        precioTotal={lote.precioMxn ? mxn(lote.precioMxn) : null}
        mensualidad={plazoMax ? mxn(plazoMax.mensualidadMxn) : null}
        locale={locale}
      />
    </div>
  );
}
