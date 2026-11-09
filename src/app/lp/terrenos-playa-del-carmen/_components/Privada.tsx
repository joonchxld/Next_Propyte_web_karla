import type { ImagenesLanding } from '@/lib/supabase/lp-lotes';
import FiguraTerrenos from './FiguraTerrenos';
import { Escalon, Escalonado, Reveal } from './motion';
import { ORDEN_MOSAICO, type IndiceLaminas } from './laminas';
import { normalizarClave, type CopyTerrenos } from '../_copy';

// ============================================================
// LA PRIVADA, EN IMÁGENES — y la leyenda que las amarra a un dato.
//
// ═══ EL PROBLEMA QUE RESUELVE ═══
//
// Esta variante se publicó con UNA imagen. Después del primer pliegue eran
// cuatro pantallas de tipografía y cifras sobre verde: correcto, medido,
// verificable, y absolutamente abstracto. Alguien que busca «terrenos en playa
// del carmen» quiere VER el sitio antes de dar su teléfono, y no había nada que
// ver. El competidor de referencia publica más de treinta imágenes.
//
// ═══ POR QUÉ NO ES UNA REJILLA DE ICONITOS ═══
//
// El patrón de la categoría es 11 amenidades con su icono redondeado y ni una
// prueba de que existan. Aquí cada amenidad sale de una COLUMNA BOOLEANA del
// registro del desarrollo, y la que además tiene render lo referencia por
// número de lámina, como la leyenda de un plano referencia sus figuras. La que
// no tiene render se publica igual, pero SIN referencia: se ve a simple vista
// cuáles hay que creernos y cuáles se pueden mirar.
//
// ⚠️ EL EMPAREJAMIENTO NO SE ADIVINA. `PRUEBA_VISUAL` es lista blanca sobre el
// nombre normalizado de la amenidad. Una amenidad que el Hub empiece a declarar
// mañana aparece en la leyenda sin lámina, que es lo correcto: es infinitamente
// mejor que emparejarla por parecido con una imagen que muestra otra cosa.
//
// ═══ TODO ES RENDER, Y SE DICE ═══
//
// Doce de las trece láminas son renders del desarrollador y la privada no está
// construida. `FiguraTerrenos` lo rotula una por una, y el rótulo va DENTRO de
// la lámina. Ver también el pie de la sección.
//
// MARCA (9-nov-2026): banda Water Dew. La leyenda pasa de filas con filete a
// pastillas (Onahau con la referencia de figura; la que no tiene lámina, en
// blanco con guion), y el mosaico usa las placas redondeadas de
// `FiguraTerrenos`. Sin número de sección.
// ============================================================

/**
 * Amenidad declarada → lámina que la prueba. Clave = nombre normalizado (sin
 * acentos, minúsculas), porque el catálogo escribe «Área de Niños» y
 * «Seguridad 24h» con grafía humana.
 *
 * Deliberadamente INCOMPLETO: CCTV, Pet Zone, Área de Niños y Seguridad 24h no
 * tienen render propio en la galería y se quedan sin referencia. No se les
 * asigna una imagen «parecida».
 *
 * ⚠️ «Acceso Controlado» TAMPOCO tiene lámina, y no es un olvido. El render de
 * la caseta existe en la galería y se retiró: al recorte que servía la página,
 * el monumento del acceso mostraba el nombre comercial legible. Se publica la
 * amenidad sin imagen antes que publicar la imagen. Ver `ARCHIVOS_RECHAZADOS`
 * en `lp-lotes.ts`.
 */
const PRUEBA_VISUAL: Record<string, keyof ImagenesLanding> = {
  'alberca comunitaria': 'alberca',
  gimnasio: 'gimnasio',
  'salon de eventos': 'casaClub',
  'jardin comunitario': 'andador',
  cancha: 'canchasCenital',
};

/**
 * `\p{M}` en vez del rango literal de diacríticos combinantes: ese rango se
 * escribe con caracteres invisibles en el código fuente, y un `replace` que
 * parece correcto y no hace nada es exactamente el fallo que no se ve en
 * revisión. La clase Unicode dice lo mismo y se puede leer.
 */
const normalizar = normalizarClave;

// Los rótulos cortos de cada lámina viven en el diccionario (`_copy.ts`).

/**
 * Cómo se corta cada lámina y cuánto ocupa. Una hoja de planos mezcla escalas;
 * una rejilla de nueve cuadros iguales se lee como un catálogo de stock.
 *
 * ⚠️ EL ORDEN NO ESTÁ AQUÍ. Lo manda `ORDEN_MOSAICO` en `laminas.ts`, que es
 * también el que numera. Cuando el orden vivía en los dos sitios se desincronizó
 * y el mosaico salió con los números fuera del orden de lectura. Este objeto
 * solo dice CÓMO se corta cada una, no CUÁNDO aparece.
 *
 * ═══ LA CUENTA DE COLUMNAS, QUE NO ES DECORATIVA ═══
 *
 * Son 9 láminas: 7 estrechas, una a dos columnas y una a las tres. En la rejilla
 * de 3 eso suma 7 + 2 + 3 = 12 unidades, o sea CUATRO FILAS EXACTAS. Con la
 * combinación anterior sumaba 11 y la última lámina se quedaba sola en su fila,
 * que en un mosaico se lee como que falta una imagen.
 *
 * En móvil la rejilla es de 2, y ahí `amenidades` también ocupa el ancho
 * completo (`sm:col-span-1` lo devuelve a una columna): sin eso, 7 estrechas en
 * 2 columnas vuelven a dejar una huérfana.
 */
const CORTE: Partial<
  Record<keyof ImagenesLanding, { span: string; aspecto: string }>
> = {
  alberca: { span: '', aspecto: 'aspect-[4/5]' },
  gimnasio: { span: '', aspecto: 'aspect-[4/5]' },
  casaClub: { span: '', aspecto: 'aspect-[4/5]' },
  canchasCenital: { span: '', aspecto: 'aspect-[4/5]' },
  cine: { span: 'col-span-2', aspecto: 'aspect-[16/10]' },
  casaClubComedor: { span: '', aspecto: 'aspect-[4/5]' },
  domingo: { span: '', aspecto: 'aspect-[4/5]' },
  // Ocupa el ancho en móvil, así que ahí va en horizontal: un 4/5 a ancho
  // completo en un teléfono es una lámina de casi 500 px de alto.
  amenidades: {
    span: 'col-span-2 lg:col-span-1',
    aspecto: 'aspect-[16/10] lg:aspect-[4/5]',
  },
  // Cierra el mosaico a todo lo ancho. El original es muy vertical y en 4/5 se
  // recortaba a pura copa de árbol: el andador y las canchas del fondo, que es
  // lo que la lámina tiene que mostrar, quedaban fuera del cuadro. En móvil el
  // 21/9 dejaría una tira de 167 px, así que ahí se abre a 16/9.
  andador: {
    span: 'col-span-2 lg:col-span-3',
    aspecto: 'aspect-[16/9] lg:aspect-[21/9]',
  },
};

export default function Privada({
  imagenes,
  amenidades,
  laminas,
  numeroSeccion,
  copy,
  figura,
}: {
  copy: CopyTerrenos['privada'];
  figura: CopyTerrenos['figura'];
  imagenes: ImagenesLanding;
  /** Array derivado de columnas booleanas de `v_developments`. Nunca prosa. */
  amenidades: string[];
  laminas: IndiceLaminas;
  numeroSeccion: string;
}) {
  // Orden de pintado = orden de numeración, de una sola fuente.
  const plates = ORDEN_MOSAICO.filter((clave) => imagenes[clave] && CORTE[clave]).map(
    (clave) => ({ clave, ...CORTE[clave]! }),
  );
  if (plates.length === 0 && amenidades.length === 0) return null;

  const leyenda = amenidades.map((a) => {
    const clave = PRUEBA_VISUAL[normalizar(a)];
    // En inglés el nombre se traduce si se reconoce; si no, sale como el Hub lo
    // declara. La clave de prueba visual se calcula SIEMPRE sobre el original.
    return {
      nombre: copy.amenidades[normalizar(a)] ?? a,
      lamina: clave ? (laminas[clave] ?? null) : null,
    };
  });
  const conPrueba = leyenda.filter((l) => l.lamina).length;

  return (
    <section className="bg-[var(--marca-dew)]" data-seccion={numeroSeccion}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <p className="lpt-rotulo">{copy.rotulo}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="lpt-titular mt-4 max-w-[24ch] text-[clamp(1.875rem,1.4rem+2.2vw,3rem)] text-[var(--marca-aztec)]">
            {copy.titulo}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lpt-cuerpo mt-6 max-w-[56ch] text-[1.0625rem] leading-relaxed text-[var(--marca-slate)]">
            {copy.intro}
          </p>
        </Reveal>

        {/* ═══ LA LEYENDA ═══
            Va ANTES del mosaico a propósito: primero el dato duro —qué está
            declarado— y luego las imágenes que lo ilustran. Al contrario, las
            imágenes harían la promesa y la lista llegaría a matizarla. */}
        {leyenda.length > 0 && (
          <Escalonado
            className="mt-10 flex flex-wrap gap-2"
            delay={0.05}
          >
            {leyenda.map((l) => (
              <Escalon
                key={l.nombre}
                className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-full py-1.5 pl-4 pr-2 ${
                  l.lamina
                    ? 'bg-[var(--marca-onahau)]'
                    : 'bg-white shadow-[inset_0_0_0_1px_rgb(72_115_121/0.18)]'
                }`}
              >
                <span className="lpt-cuerpo text-[0.9375rem] text-[var(--marca-aztec)]">
                  {l.nombre}
                </span>
                {l.lamina ? (
                  <span className="lpt-cota shrink-0 rounded-full bg-[var(--marca-aztec)] px-2.5 py-1 text-[0.75rem] text-[var(--marca-aqua)]">
                    {l.lamina}
                  </span>
                ) : (
                  /* Sin lámina y se dice. Un guion largo, no un hueco: el hueco
                     se lee como error de maquetación, el guion como dato. */
                  <span
                    className="lpt-cota shrink-0 px-2 text-[0.875rem] text-[var(--marca-teal)]"
                    title={copy.sinLamina}
                  >
                    —
                  </span>
                )}
              </Escalon>
            ))}
          </Escalonado>
        )}

        {leyenda.length > 0 && (
          <Reveal delay={0.1}>
            <p className="lpt-cuerpo mt-5 max-w-[62ch] text-[0.8125rem] leading-relaxed text-[var(--marca-slate)]">
              {/* ⚠️ Decía «no tenemos render de ellas». Dejó de ser verdad al
                  retirar la lámina de la caseta: de ésa SÍ hay render, y no se
                  publica por otra razón. En una página cuya voz entera depende
                  de que cada frase sea literalmente cierta, eso importa. */}
              {copy.leyenda(conPrueba, leyenda.length)}
            </p>
          </Reveal>
        )}

        {/* ═══ EL MOSAICO ═══
            ⚠️ AQUÍ NO SE USA `Escalonado`, Y ES DELIBERADO. Esa primitiva sirve
            `initial={{opacity:0}}`, o sea que el CERO viaja en el HTML del
            servidor y lo levanta Framer al entrar en pantalla. Para un párrafo
            es un riesgo aceptable; para las diez imágenes que son la razón de
            existir de esta sección, no: si el JS no carga, tarda o falla, la
            página se queda sin lo único que la persona vino a ver.

            El movimiento se hace con `.lpt-lamina-entra`, que es CSS con
            `animation-timeline: view()` dentro de un `@supports`. Lo conduce el
            scroll, no un observer, así que no puede quedarse atascado en cero;
            y donde el navegador no lo soporta la lámina simplemente se ve.
            Ver `lpt-theme.css`. */}
        {plates.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {plates.map((m) => {
              const img = imagenes[m.clave]!;
              return (
                <div key={m.clave} className={`lpt-lamina-entra ${m.span}`}>
                  <FiguraTerrenos
                    imagen={img}
                    lamina={laminas[m.clave] ?? 'Fig.'}
                    rotulo={copy.rotulos[m.clave] ?? copy.rotuloDefecto}
                    prefijo={figura}
                    aspecto={m.aspecto}
                    // El mosaico ocupa media pantalla en móvil, un tercio en
                    // escritorio. Sin esto el navegador pide el candidato de
                    // 3840 px para una lámina que se pinta a 380.
                    // El candidato que se pide tiene que seguir al span real, o
                    // el navegador descarga el de 3840 px para una lámina que
                    // se pinta a 360. `andador` es de ancho completo, `cine`
                    // dos tercios, el resto un tercio.
                    sizes={
                      m.clave === 'andador'
                        ? '(min-width: 1024px) 1152px, 100vw'
                        : m.clave === 'cine'
                          ? '(min-width: 1024px) 760px, 100vw'
                          : '(min-width: 1024px) 368px, 50vw'
                    }
                    // Pie fuera: trece pies bajo trece láminas es una columna de
                    // letra chica. El rótulo va en la cartela y el aviso de que
                    // TODAS son renders va una sola vez, abajo.
                    conPie={false}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* El aviso, una vez y en serio. Sustituye a los pies individuales. */}
        {plates.length > 0 && (
          <Reveal delay={0.08}>
            <p className="lpt-cuerpo mt-8 max-w-[62ch] text-[0.8125rem] leading-relaxed text-[var(--marca-slate)]">
              {copy.aviso(plates.length, laminas.urbanizacion ?? copy.aerea)}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
