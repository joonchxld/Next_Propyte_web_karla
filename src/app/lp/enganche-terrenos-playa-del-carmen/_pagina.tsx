import Image from 'next/image';
import { getLotePlayaDelCarmen } from '@/lib/supabase/lp-lotes';
import { FALLBACK_WHATSAPP } from '@/lib/site-contact';
import FormEnganche from './_components/FormEnganche';
import DesgloseEnganche from './_components/DesgloseEnganche';
import FiguraRedonda from './_components/FiguraRedonda';
import FlotantesEnganche from './_components/FlotantesEnganche';
import EstructuraPago from './_components/EstructuraPago';
import { ICONOS, IconoNeutro, normalizarAmenidad } from './_components/iconos';
import { mxn, m2 } from './_components/formato';
import { rich } from './_components/rich';
import { COPY, localizarImagen } from './_copy';
import type { LocaleLp } from '../_components/v2/i18n';
import '../_components/v2/marca.css';
import './lpe-theme.css';

// ============================================================
// EL CUERPO DE LA LANDING VIVE AQUÍ, NO EN `page.tsx`.
//
// Lo sirven dos rutas: la española (`/lp/enganche-terrenos-playa-del-carmen`) y
// la inglesa (`/lp/down-payment-land-playa-del-carmen`), para el tráfico de
// Estados Unidos y Canadá. Cada `page.tsx` aporta solo lo que Next exige que
// viva en el archivo de la ruta —`metadata`, `revalidate`— y elige el idioma.
// Todo lo demás es literalmente el mismo árbol, con las cadenas de `_copy.ts`.
// Las dos variantes comparten además el `source` por idioma de Zoho (ver
// `FormEnganche.tsx`).
//
// ═══ LO QUE SIGUE ES LA CABECERA ORIGINAL DE LA VARIANTE C ═══
//
// VARIANTE C — EL ENGANCHE COMO PROTAGONISTA.
//
// Tercera landing de lotes de Playa del Carmen. Las otras dos:
//   A · /lp/lotes-playa-del-carmen      — 12 secciones, auditoría completa
//   B · /lp/terrenos-playa-del-carmen   — corta, la MENSUALIDAD es el gancho
//   C · esta                            — el ENGANCHE es el gancho
//
// ═══ LA APUESTA, Y POR QUÉ ES DISTINTA DE LA DE LA B ═══
//
// La B publica «desde $10,280 MXN al mes» porque la mensualidad es lo que la
// gente compara. Esta publica «$202,176 MXN de enganche» porque el enganche es
// lo que DECIDE: la mensualidad se evalúa contra el sueldo, el enganche contra
// el ahorro que ya existe, y es el número que frena a quien no puede juntar el
// 20%.
//
// Es una apuesta con dos filos, dicho sin adornos: la cifra ahuyenta tráfico.
// La hipótesis es que ahuyenta al que nunca iba a comprar, y que el que sí
// puede llega a la conversación sin la sorpresa que hoy mata leads en la
// primera llamada. Si la hipótesis es falsa, esta variante va a traer menos
// leads y MEJORES, y el CPL solo no lo va a decir — ver la nota de medición.
//
// ═══ DE DÓNDE SALE EL ESTILO ═══
//
// La COMPOSICIÓN viene de la landing de un competidor que convierte (cápsula
// de foto en banda oscura, declaración centrada, desglose, galería en
// cápsulas, formulario repetido). La PIEL es la marca oficial de Propyte
// (noviembre-2026, «misma marca, otra composición»): paleta del manual, Inter /
// DM Sans / Space Grotesk, rótulos en caja normal, retícula de nodos en las
// bandas Aztec y el formulario del hero en vidrio oscuro con CTA New Aqua. Ver
// DESIGN.md, `_components/v2/marca.css` y la cabecera de `lpe-theme.css`.
//
// ═══ LO QUE NO CAMBIA, PARA QUE LAS TRES SE PUEDAN COMPARAR ═══
//
// Misma acción de conversión en Ads, mismo `source: 'lp_lotes_pdc'` de Zoho,
// mismo valor de conversión (ninguno), mismo hueco de consentimiento. Lo único
// que cambia es la página. En GA4 las separa `form_type`
// (`lp_enganche_pdc`), en Zoho el `page` → `Nombre_anuncio`.
//
// ⚠️ TRES VARIANTES PARTEN EL TRÁFICO EN TRES. La campaña de Lotes PDC ya
// pierde ~90% de impresiones por rango y con DOS variantes la significancia
// estaba en duda. Con tres, medir el CPL a dos semanas no va a concluir nada.
// Esto no es motivo para no construirla —construida ya está y no cuesta
// tráfico hasta que alguien la conecte— pero sí para no repartir a tres bandas
// sin subir antes la puja.
//
// ═══ CUATRO REGLAS DE DATO QUE NO SE NEGOCIAN ═══
//
//   1. `nombre_desarrollo` JAMÁS llega al DOM. Los textos salen ya saneados de
//      `getLotePlayaDelCarmen`; aquí no se concatena ningún nombre comercial.
//   2. Los disponibles salen de `lotesDisponiblesPrivada`, que es lo que
//      declara el desarrollador. NO del número de registros de `v_units`: el
//      Hub guarda UNA fila por desarrollo y esa fila es un TIPO de lote.
//   3. Toda cifra en pesos lleva «MXN» pegada. El `$` de es-MX se lee como
//      dólar, y aquí se publican precios de siete cifras.
//   4. Cada imagen va rotulada por lo que es. Un render se rotula como render.
//      Y cambiar el recorte de una imagen obliga a REVISARLA otra vez: ver
//      `ARCHIVOS_RECHAZADOS` en `lp-lotes.ts`.
// ============================================================

/**
 * Tipografía: la de la marca (Inter, DM Sans y Space Grotesk), que ya carga el
 * layout raíz. Antes se cargaba Poppins aquí para copiar el estilo de un
 * competidor; con la marca oficial no hace falta ni un byte de fuente extra.
 */

// `revalidate` y `metadata` viven en cada `page.tsx` (Next los exige ahí).

const BLUR_HERO =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAJABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAEF/8QAHhABAAICAQUAAAAAAAAAAAAAAQIDABESMUVRcYL/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABYRAQEBAAAAAAAAAAAAAAAAAAABIf/aAAwDAQACEQMRAD8AJVZVJFCDs2efWW6secGzc4hLprCmaHbqfrJTS//Z';

// `mxn` y `m2` viven en `_components/formato.ts` y NO aquí: el desglose es un
// componente cliente y necesita el mismo formato. Dos definiciones del formato
// del dinero divergen —la que lleva «MXN» y la que se le olvidó—, así que hay
// una sola, en un módulo sin directiva que se empaqueta en los dos lados. El
// motivo completo, y el intento fallido de pasarlo como prop, está en ese
// archivo.

export default async function PaginaEnganche({ locale }: { locale: LocaleLp }) {
  const c = COPY[locale];
  // Pesos y superficie en el formato del idioma. Los pesos NO se convierten.
  const dinero = (n: number) => mxn(n, locale);
  const sup = (n: number) => m2(n, locale);

  const lote = await getLotePlayaDelCarmen();

  // Inventario agotado: es un escenario probable, no un caso borde. Se trata
  // como estado y sin ofrecer otro lote como si fuera el mismo.
  if (!lote) {
    return (
      <div className="lpe-root marca">
        <div className="mx-auto max-w-2xl px-5 py-32">
          <h1 className="lpe-titular text-[clamp(1.75rem,1.3rem+2vw,2.5rem)]">
            {rich(c.agotado.titulo)}
          </h1>
          <p className="lpe-cuerpo mt-5 max-w-[52ch] text-base leading-relaxed text-[var(--lpe-tinta-2)]">
            {c.agotado.cuerpo}
          </p>
        </div>
      </div>
    );
  }

  const plan = lote.plan;
  // Las 12 imágenes curadas traen su alt y su pie en español: en inglés se
  // sustituyen por los de `_copy.ts` (en español pasan tal cual).
  const imgEs = lote.imagenes;
  const img = Object.fromEntries(
    Object.entries(imgEs).map(([clave, imagen]) => [
      clave,
      imagen ? localizarImagen(locale, clave as keyof typeof imgEs, imagen) : imagen,
    ]),
  ) as typeof imgEs;
  const hero = img.hero;
  const superficieM2 = lote.superficieM2;
  const plazos = plan?.opciones.map((o) => o.meses) ?? lote.mesesOpciones ?? [];
  const engancheTexto = plan ? dinero(plan.engancheMxn) : null;

  // Vendidos = declarados menos disponibles. No es escasez inventada: es resta,
  // y no se dramatiza. 81 de 310 es tracción, no «últimos lugares».
  const vendidos =
    lote.lotesDisponiblesPrivada !== null &&
    lote.lotesTotalesPrivada !== null &&
    lote.lotesTotalesPrivada >= lote.lotesDisponiblesPrivada
      ? lote.lotesTotalesPrivada - lote.lotesDisponiblesPrivada
      : null;

  /**
   * La banda de cifras, equivalente al «X en números» del original — pero cada
   * una sale de una columna del registro. Su banda publica «+16% de plusvalía
   * anualizada», que es el tipo de cifra que aquí no se puede publicar porque
   * no tenemos de dónde sacarla. Se arma con lo que hay: si un dato falta, su
   * cifra NO entra y no se rellena el hueco.
   */
  const cifras = [
    superficieM2 ? { valor: sup(superficieM2), pie: c.cifras.porLote } : null,
    lote.precioM2Mxn ? { valor: dinero(lote.precioM2Mxn), pie: c.cifras.porM2 } : null,
    plan?.sinIntereses ? { valor: '0%', pie: c.cifras.deInteres } : null,
    vendidos !== null
      ? { valor: `${vendidos}`, pie: c.cifras.vendidos(lote.lotesTotalesPrivada as number) }
      : null,
  ].filter((c): c is { valor: string; pie: string } => c !== null);

  /**
   * Amenidades declaradas, con su icono de línea. Ver `iconos.tsx`. El icono
   * se busca por el nombre del REGISTRO (español); en inglés solo cambia el
   * texto mostrado, y una amenidad sin traducción conserva el nombre del
   * registro en vez de inventarse uno.
   */
  const amenidades = lote.amenidades.map((nombre) => ({
    nombre: c.amenidades.nombres[normalizarAmenidad(nombre)] ?? nombre,
    Icono: ICONOS[normalizarAmenidad(nombre)] ?? IconoNeutro,
  }));

  /**
   * La galería. Las 8 que no usa ninguna otra sección: el hero se pinta a
   * sangre, `alberca` acompaña a las amenidades y `urbanizacion`/`casasCenital`
   * son el par hoy/proyectado.
   *
   * ⚠️ Los `aspecto` de aquí son recortes NUEVOS respecto a la variante B, así
   * que las 12 imágenes se revisaron otra vez a 2× ya maquetadas. No cambies un
   * `aspecto` sin repetir esa revisión.
   */
  const galeria = [
    { clave: 'gimnasio' as const, aspecto: 'aspect-[4/5]', ancha: false },
    { clave: 'casaClub' as const, aspecto: 'aspect-[4/5]', ancha: false },
    { clave: 'cine' as const, aspecto: 'aspect-[16/10]', ancha: true },
    { clave: 'canchasCenital' as const, aspecto: 'aspect-[4/5]', ancha: false },
    { clave: 'casaClubComedor' as const, aspecto: 'aspect-[4/5]', ancha: false },
    { clave: 'domingo' as const, aspecto: 'aspect-[4/5]', ancha: false },
    { clave: 'amenidades' as const, aspecto: 'aspect-[4/5]', ancha: false },
    { clave: 'andador' as const, aspecto: 'aspect-[16/9] lg:aspect-[21/9]', ancha: true },
  ]
    .map((g) => ({ ...g, etiqueta: c.galeria.etiquetas[g.clave] }))
    .filter((g) => img[g.clave]);

  const mensajeWa = c.whatsapp.mensaje(lote.slug, engancheTexto);

  return (
    <div className="lpe-root marca">
      {/* ═══════════ 01 · Hero ═══════════
          La cápsula de foto inscrita en una banda oscura, que es la composición
          del original. La banda es AZTEC y no blanca por una razón concreta: el
          layout compartido de `/lp` monta el logotipo BLANCO de Propyte flotando
          en `top-0`, y sobre una banda blanca desaparecería. Retintar el logo
          desde este archivo no se puede —vive fuera de `.lpe-root`—, así que la
          banda se adapta al logo y no al contrario.

          El formulario va DENTRO del primer pliegue, debajo de la cápsula. El
          original deja aquí solo un botón, pero eso ya costó $991.40 MXN en 72
          clics con cero envíos en la variante A: el campo de teléfono se ve o no
          existe. */}
      <section className="lpe-sobre-oscuro relative isolate overflow-hidden bg-[var(--lpe-aztec)] px-3 pb-12 pt-16 sm:px-5 sm:pb-16 lg:pb-20">
        {/* Retícula de líneas y nodos del manual, detrás de la cápsula. */}
        <div aria-hidden="true" className="marca-reticula" />
        <div className="relative mx-auto max-w-6xl">
          <div className="lpe-capsula lpe-entra relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
            {hero && (
              <Image
                src={hero.url}
                alt={hero.alt}
                fill
                priority
                // `100vw` a secas hace que el navegador pida el candidato de
                // 3840 px. El original mide 2400: pedir más no añade un píxel
                // real, solo reescala hacia arriba un JPEG en el LCP.
                sizes="(min-width: 1280px) 1216px, 100vw"
                placeholder="blur"
                blurDataURL={BLUR_HERO}
                className="object-cover"
              />
            )}
            {/* Velo local al pie, no una capa a pantalla completa: el centro de
                la fotografía se queda limpio. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--lpe-aztec)] via-[var(--lpe-aztec)]/75 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-12">
              {/* EL H1 ES EL LCP. Solo se mueve, jamás se funde: un `opacity:0`
                  aquí retrasa el LCP de una página que se paga por clic, y si se
                  atasca deja la página sin titular para siempre.

                  Palabra de acento en Inter 600 y New Aqua + la cifra, en la
                  misma línea. */}
              <h1 className="lpe-titular max-w-[22ch] text-[clamp(1.875rem,1.1rem+3.6vw,3.75rem)] text-white">
                {engancheTexto
                  ? rich(c.hero.tituloConEnganche, {
                      cifra: <span className="lpe-cifra">{engancheTexto}</span>,
                    })
                  : rich(c.hero.titulo)}
              </h1>
              <p className="lpe-cuerpo mt-4 text-[0.9375rem] text-white/75 sm:text-base">
                {[lote.zona, lote.ciudad].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          {/* Debajo de la cápsula: el argumento a la izquierda, la conversión a
              la derecha. En móvil el orden del documento es argumento →
              FORMULARIO, y el formulario entra en el primer viewport. */}
          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6 lg:pt-3">
              <p className="lpe-cuerpo text-[1.0625rem] leading-relaxed text-white/80 sm:text-[1.125rem]">
                {c.hero.intro}
              </p>

              {/* Antes aquí había una fila con las MISMAS tres cifras sueltas y
                  debajo 519 px de vacío hasta el fondo de la tarjeta del
                  formulario (medido en 1440 y en 1920). `EstructuraPago` dice
                  lo mismo más la proporción y el cuándo de cada tramo, que es
                  la pregunta que abre un enganche de siete cifras. */}
              {plan && <EstructuraPago plan={plan} locale={locale} />}
            </div>

            <div id="solicitud" className="lpe-vidrio scroll-mt-8 lg:col-span-6">
              <FormEnganche
                variante="hero"
                plazos={plazos}
                loteRef={lote.slug}
                loteTitulo={lote.titulo}
                engancheTexto={engancheTexto}
                locale={locale}
              />
            </div>
          </div>
        </div>

        {/* Sentinela de los elementos fijos. Sin alto: no ocupa layout. */}
        <div id="lpe-sentinela" aria-hidden="true" className="h-px w-full" />
      </section>

      {/* ═══════════ 02 · La declaración ═══════════
          El equivalente exacto de la segunda sección del original: una frase
          centrada, grande, con la cifra dentro y la palabra de acento en
          itálica. Es donde el enganche deja de ser un dato de ficha y se vuelve
          la propuesta. */}
      {plan && (
        <section className="bg-[var(--lpe-blanco)] px-5 py-20 sm:px-8 lg:py-28">
          <p className="lpe-titular mx-auto max-w-[26ch] text-center text-[clamp(1.75rem,1.1rem+3.2vw,3.5rem)]">
            {rich(c.declaracion.titulo, {
              cifra: <span className="lpe-cifra">{dinero(plan.engancheMxn)}</span>,
            })}
          </p>
          <p className="lpe-cuerpo mx-auto mt-8 max-w-[54ch] text-center text-[1.0625rem] leading-relaxed text-[var(--lpe-tinta-2)]">
            {c.declaracion.cuerpo(plan)}
          </p>
        </section>
      )}

      {/* ═══════════ 03 · El desglose ═══════════ */}
      {plan && lote.precioMxn && (
        <section className="bg-[var(--lpe-hueso)] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="lpe-titular max-w-[24ch] text-[clamp(1.75rem,1.3rem+2vw,2.875rem)]">
              {rich(c.desglose.titulo)}
            </h2>
            <p className="lpe-cuerpo mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-[var(--lpe-tinta-2)]">
              {c.desglose.cuerpo(plan.contraentregaPct)}
            </p>

            <div className="mt-12">
              <DesgloseEnganche plan={plan} precioMxn={lote.precioMxn} locale={locale} />
            </div>

            {lote.esquemaPago && (
              <p className="lpe-cuerpo mt-10 max-w-[62ch] border-t border-[var(--lpe-linea)] pt-6 text-[0.8125rem] leading-relaxed text-[var(--lpe-tinta-3-texto)]">
                {c.desglose.esquema(lote.esquemaPago, plan)}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ═══════════ 04 · Amenidades ═══════════
          La composición del original: a la izquierda el titular con acento en
          itálica y la lista con iconos de trazo fino; a la derecha una cápsula
          de imagen. La diferencia está en el dato — sus amenidades son copy,
          las nuestras salen de columnas booleanas del registro. */}
      {amenidades.length > 0 && (
        <section className="bg-[var(--lpe-blanco)] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="lpe-titular max-w-[20ch] text-[clamp(1.75rem,1.3rem+2vw,2.875rem)]">
                {rich(c.amenidades.titulo)}
              </h2>

              <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {amenidades.map(({ nombre, Icono }) => (
                  <li key={nombre} className="flex items-center gap-3">
                    <span className="shrink-0 text-[var(--lpe-teal-texto)]">
                      <Icono />
                    </span>
                    <span className="lpe-cuerpo text-[0.9375rem] text-[var(--lpe-tinta)]">
                      {nombre}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="lpe-cuerpo mt-8 max-w-[52ch] text-[0.8125rem] leading-relaxed text-[var(--lpe-tinta-3-texto)]">
                {c.amenidades.nota(amenidades.length)}
              </p>
            </div>

            {img.alberca && (
              <div className="lpe-aparece">
                <FiguraRedonda
                  imagen={img.alberca}
                  etiqueta={c.galeria.etiquetaAlberca}
                  aspecto="aspect-[4/5]"
                  sizes="(min-width: 1024px) 560px, 100vw"
                  locale={locale}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════ 05 · La galería ═══════════
          El bloque de más peso visual del original —14 imágenes de proyecto— en
          cápsulas de 32 px. Las 8 van diferidas, así que no entran en el LCP. */}
      {galeria.length > 0 && (
        <section className="bg-[var(--lpe-hueso)] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="lpe-titular max-w-[22ch] text-[clamp(1.75rem,1.3rem+2vw,2.875rem)]">
              {rich(c.galeria.titulo)}
            </h2>

            {/* ⚠️ Sin `Reveal` de framer-motion, y es deliberado: esa primitiva
                sirve `initial={{opacity:0}}`, o sea que el CERO viaja en el HTML
                y lo levanta un observer en el cliente. Para un párrafo es un
                riesgo aceptable; para las imágenes que son la razón de ser de la
                sección, no. `.lpe-aparece` es CSS con `animation-timeline:
                view()`: lo conduce el scroll, no puede atascarse en cero, y
                donde no hay soporte la imagen simplemente se ve. */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {galeria.map((g) => (
                <div
                  key={g.clave}
                  className={`lpe-aparece ${g.ancha ? 'col-span-2' : ''}`}
                >
                  <FiguraRedonda
                    imagen={img[g.clave]!}
                    etiqueta={g.etiqueta}
                    aspecto={g.aspecto}
                    // El candidato pedido sigue al span real, o el navegador
                    // descarga el de 3840 px para una cápsula de 368.
                    sizes={
                      g.ancha
                        ? '(min-width: 1024px) 780px, 100vw'
                        : '(min-width: 1024px) 384px, 50vw'
                    }
                    // Pie fuera: ocho pies bajo ocho cápsulas es una columna de
                    // letra chica. El aviso de que son renders va una sola vez,
                    // abajo, y la etiqueta de qué es va dentro de la cápsula.
                    conPie={false}
                    locale={locale}
                  />
                </div>
              ))}
            </div>

            <p className="lpe-cuerpo mt-8 max-w-[62ch] text-[0.8125rem] leading-relaxed text-[var(--lpe-tinta-3-texto)]">
              {c.galeria.nota(galeria.length)}
            </p>
          </div>
        </section>
      )}

      {/* ═══════════ 06 · Solicitud · 02 ═══════════
          El original repite su formulario cinco veces. Aquí van tres, y esta es
          la del punto de máxima intención: justo después de ver el sitio. */}
      <section className="bg-[var(--lpe-aqua-suave)] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="lpe-titular text-[clamp(1.625rem,1.25rem+1.9vw,2.625rem)]">
              {rich(c.solicitud.titulo)}
            </h2>
            <p className="lpe-cuerpo mt-5 max-w-[50ch] text-[1.0625rem] leading-relaxed text-[var(--lpe-tinta-2)]">
              {c.solicitud.cuerpo}
            </p>
          </div>
          <div className="lg:col-span-6">
            <FormEnganche
              variante="medio"
              plazos={plazos}
              loteRef={lote.slug}
              loteTitulo={lote.titulo}
              engancheTexto={engancheTexto}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ 07 · Hoy y proyectado ═══════════
          Esto NO viene del original y es a propósito: su galería es de obra
          entregada y no publica una sola imagen de cómo se ve el terreno el día
          que firmas. Es lo único que ellos no pueden hacer y nosotros sí, y es
          además el par de imágenes que la persona pide en el primer mensaje. */}
      {(img.urbanizacion || img.casasCenital) && (
        <section className="bg-[var(--lpe-blanco)] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="lpe-titular max-w-[26ch] text-[clamp(1.75rem,1.3rem+2vw,2.875rem)]">
              {rich(c.sitio.titulo)}
            </h2>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-12">
              {img.urbanizacion && (
                <div className="lpe-aparece">
                  <FiguraRedonda
                    imagen={img.urbanizacion}
                    etiqueta={c.sitio.hoy}
                    aspecto="aspect-[4/3]"
                    sizes="(min-width: 1024px) 576px, (min-width: 640px) 50vw, 100vw"
                    locale={locale}
                  />
                </div>
              )}
              {img.casasCenital && (
                <div className="lpe-aparece">
                  <FiguraRedonda
                    imagen={img.casasCenital}
                    etiqueta={c.sitio.proyectado}
                    aspecto="aspect-[4/3]"
                    sizes="(min-width: 1024px) 576px, (min-width: 640px) 50vw, 100vw"
                    locale={locale}
                  />
                </div>
              )}
            </div>

            <p className="lpe-cuerpo mt-10 max-w-[60ch] text-[1.0625rem] leading-relaxed text-[var(--lpe-tinta-2)]">
              {c.sitio.cuerpo(superficieM2 ? sup(superficieM2) : null)}
            </p>
          </div>
        </section>
      )}

      {/* ═══════════ 08 · Las cifras ═══════════
          El «X en números» del original, con una diferencia que importa: su
          banda publica «+16% de plusvalía anualizada» y aquí no hay ninguna
          cifra de rendimiento, porque no tenemos de dónde sacarla. Solo entra
          lo que está en una columna. */}
      {cifras.length > 0 && (
        <section className="lpe-sobre-oscuro relative isolate overflow-hidden bg-[var(--lpe-aztec)] px-5 py-20 sm:px-8 lg:py-24">
          <div aria-hidden="true" className="marca-reticula" />
          <div className="relative mx-auto max-w-6xl">
            <h2 className="lpe-titular text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] text-white">
              {c.cifras.rotulo}
            </h2>
            {/* Las etiquetas van ancladas al fondo de la celda, no pegadas a
                su cifra. Medido en producción: «$7,800 MXN» envuelve a dos
                líneas y empujaba su etiqueta 46 px por debajo de las otras
                tres, así que los cuatro pies quedaban a alturas distintas y la
                fila se leía rota. Anclar abajo hace que los pies formen una
                línea sin importar cuántas líneas ocupe el número — y aguanta
                que mañana el dato sea más largo, que es lo que pasará: estas
                cifras salen de la ficha del desarrollador, no de este archivo. */}
            <dl className="mt-10 grid grid-cols-2 items-stretch gap-x-8 gap-y-12 lg:grid-cols-4">
              {cifras.map((c) => (
                <div key={c.pie} className="flex h-full flex-col">
                  <dd className="lpe-cifra text-[clamp(1.875rem,1.3rem+2.4vw,3rem)] tabular-nums text-white">
                    {c.valor}
                  </dd>
                  <dt className="lpe-rotulo mt-auto pt-3 text-[0.8125rem] leading-snug text-[var(--marca-onahau)]">
                    {c.pie}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="lpe-cuerpo mt-12 max-w-[62ch] border-t border-white/15 pt-6 text-[0.8125rem] leading-relaxed text-white/65">
              {c.cifras.nota}
            </p>
          </div>
        </section>
      )}

      {/* ═══════════ 09 · Cierre ═══════════ */}
      <section className="bg-[var(--lpe-blanco)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="lpe-titular text-[clamp(1.875rem,1.35rem+2.4vw,3.25rem)]">
              {rich(c.cierre.titulo)}
            </h2>
            <p className="lpe-cuerpo mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-[var(--lpe-tinta-2)]">
              {c.cierre.cuerpo}
            </p>
          </div>

          <div className="lg:col-span-6">
            <FormEnganche
              variante="cierre"
              plazos={plazos}
              loteRef={lote.slug}
              loteTitulo={lote.titulo}
              engancheTexto={engancheTexto}
              locale={locale}
            />
          </div>
        </div>

        {/* Rótulo del inventario y de las imágenes. Va en el pie porque es
            obligación de honestidad, no argumento de venta, pero va. */}
        <div className="mx-auto mt-16 max-w-6xl">
          <p className="lpe-cuerpo border-t border-[var(--lpe-linea)] pt-6 text-[0.75rem] leading-relaxed text-[var(--lpe-tinta-3-texto)]">
            {lote.estadoComercial && c.cierre.estado
              ? c.cierre.estado(lote.estadoComercial)
              : ''}
            {lote.lotesDisponiblesPrivada && lote.lotesTotalesPrivada
              ? c.cierre.disponibles(lote.lotesDisponiblesPrivada, lote.lotesTotalesPrivada)
              : ''}
            {c.cierre.aviso}
          </p>
        </div>
      </section>

      <FlotantesEnganche
        engancheTexto={engancheTexto}
        whatsapp={lote.asesor?.whatsapp ?? FALLBACK_WHATSAPP}
        mensajeWa={mensajeWa}
        loteSlug={lote.slug}
        locale={locale}
      />
    </div>
  );
}
