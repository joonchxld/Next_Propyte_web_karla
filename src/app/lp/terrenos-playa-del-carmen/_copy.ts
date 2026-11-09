// ============================================================
// Copy de la landing corta de terrenos, en los dos idiomas que sirve.
//
// Es la MISMA página (`_pagina.tsx`) con otro diccionario: la variante en
// inglés vive en `/lp/land-playa-del-carmen` y solo aporta `metadata` y el
// idioma. Mismo patrón que `casas-riviera-maya/_copy.ts`.
//
// ═══ LO QUE NO SE TRADUCE, Y POR QUÉ ═══
//
//   · Precios: siguen en pesos con «MXN» pegado (nunca se convierten a dólares).
//   · Nombres de ciudad, zona y desarrollo: vienen del Hub tal cual.
//   · Texto libre del catálogo que no podemos mapear (`esquemaPago`, y los
//     valores desconocidos de régimen, subtipo, estado y amenidades): en inglés
//     las amenidades y estados conocidos se traducen con los mapas de abajo y lo
//     desconocido se publica tal cual viene del Hub; `esquemaPago` se omite en
//     inglés porque es una frase en español y el desglose 20/60/20 ya sale de
//     las cifras de la sección del plan.
//   · `src/lib/supabase/lp-lotes.ts` NO se toca (lo comparten otras landings):
//     los alt y pies de las imágenes curadas se sobrescriben aquí en inglés y se
//     aplican en `_pagina.tsx`.
// ============================================================

import type { ImagenesLanding } from '@/lib/supabase/lp-lotes';
import type { LocaleLp } from '../_components/v2/i18n';

type TextoImagen = { alt: string; caption: string };

export interface CopyTerrenos {
  /** Va al lead y a `Intl`: el CRM decide en qué idioma se contesta. */
  locale: LocaleLp;
  /** `source` del lead. Literal de `KNOWN_SOURCES`: no inventar uno nuevo. */
  leadSource: string;
  /** `form_type` de GA4 (segmenta el A/B sin tocar la conversión de Ads). */
  formType: string;
  /** `surface` del clic de WhatsApp. */
  waSurface: string;
  /** País por defecto del selector de lada. */
  paisTelefono: 'MX' | 'US';

  meta: { title: string; description: string };

  agotado: { titulo: string; cuerpo: string; mensajeWa: string };

  hero: {
    h1: string;
    /** Va en naranja, tras el H1. Recibe la cifra ya formateada. */
    desdeAlMes: (mxn: string) => string;
    subtitulo: string;
    pruebas: {
      enganche: string;
      libres: (total: number) => string;
      porLote: string;
    };
  };

  verificables: {
    licencia: {
      rotulo: string;
      titulo: (numero: string) => string;
      nota: (fecha: string | null) => string;
    };
    regimen: { rotulo: string; nota: string };
    queEs: { rotulo: string; nota: (uso: string | null) => string };
    aprovechamiento: {
      rotulo: string;
      nota: (huella: string) => string;
    };
  };

  mensajeWa: { saludo: (slug: string) => string; superficie: (m2: string) => string; pide: string };

  sitio: {
    rotulo: string;
    titulo: string;
    hoy: string;
    proyectado: string;
    texto: (superficie: string | null) => string;
    vendidos: (totales: number) => string;
    aviso: string;
  };

  plan: {
    rotulo: string;
    /** `esquema` es la frase libre del catálogo; en inglés se ignora. */
    precioLista: (a: {
      precio: string;
      superficie: string | null;
      porM2: string | null;
      esquema: string;
    }) => string;
  };

  lote: {
    rotulo: string;
    titulo: string;
    terreno: { etiqueta: string; nota: string };
    construible: { etiqueta: string; nota: (niveles: number, cus: number | string) => string };
  };

  privada: {
    rotulo: string;
    titulo: string;
    intro: string;
    sinLamina: string;
    leyenda: (conPrueba: number, total: number) => string;
    aviso: (laminas: number, urbanizacion: string) => string;
    /** Rótulo por defecto de una lámina sin rótulo propio. */
    rotuloDefecto: string;
    /** «aérea» cuando la lámina de urbanización no resolvió. */
    aerea: string;
    rotulos: Partial<Record<keyof ImagenesLanding, string>>;
    /** Nombre de amenidad (normalizado) → nombre publicado. Vacío en español. */
    amenidades: Record<string, string>;
  };

  figura: { render: string; foto: string };

  solicitud2: { titulo: string; cuerpo: string };

  cierre: {
    rotulo: string;
    titulo: string;
    cuerpo: string;
    whatsapp: string;
    /** Estados del catálogo traducidos (clave normalizada). Vacío en español. */
    estados: Record<string, string>;
    pie: (a: {
      render: number;
      foto: number;
      estado: string | null;
      disponibles: number | null;
      totales: number | null;
    }) => string;
  };

  barra: { desde: string; alMes: (mxn: string) => string; cta: string };

  form: {
    solicitud: string;
    campos: string;
    titulo: string;
    plazoPregunta: string;
    meses: (n: number) => string;
    nombre: string;
    correo: string;
    whatsapp: string;
    /** Compromiso operativo: define qué promete la marca al enviar. */
    tiempoRespuesta: string;
    errFaltan: string;
    errCorreo: string;
    errTelefono: string;
    errEnvio: string;
    enviando: string;
    enviar: string;
    gracias: { rotulo: string; listo: (nombre: string) => string; cuerpo: (tiempo: string, plazo: number | null) => string };
    pie: (tiempo: string) => string;
    /** Texto del lead que lee el asesor. */
    lead: { lote: (ref: string) => string; plazo: (n: number | null) => string; origen: (bloque: string) => string };
  };

  mensualidad: {
    grupoAria: string;
    plazo: (n: number) => string;
    tuMensualidad: string;
    pagos: (n: number, sinIntereses: boolean) => string;
    repartoAria: (tramos: string) => string;
    tramos: {
      enganche: { etiqueta: string; momento: string };
      mensualidades: { etiqueta: string; momento: (pagos: number) => string };
      contraentrega: { etiqueta: string; momento: string };
    };
  };

  wa: string;

  /** Alt y pie de las imágenes curadas. `null` = se usan los del Hub (español). */
  imagenes: Record<keyof ImagenesLanding, TextoImagen> | null;

  /** Valores del catálogo que se traducen si se reconocen (clave normalizada). */
  catalogo: { subtipo: Record<string, string>; regimen: Record<string, string> };
}

/** Misma normalización que `Privada.tsx`: minúsculas, sin acentos. */
export const normalizarClave = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();

// ───────────────────────────── Español ─────────────────────────────

export const COPY_ES: CopyTerrenos = {
  locale: 'es',
  leadSource: 'lp_lotes_pdc',
  formType: 'lp_terrenos_pdc',
  waSurface: 'lp-terrenos-pdc-cierre',
  paisTelefono: 'MX',

  meta: {
    // Sin «| Propyte» al final: lo añade el `template` del layout raíz. Con el
    // sufijo aquí el título salía «... sin banco | Propyte | Propyte», y esta es
    // la variante que hoy recibe el tráfico pagado de Google Ads.
    title: 'Terrenos en Playa del Carmen a 60 meses sin banco',
    description:
      'Lotes residenciales en privada, desde 129 m². Enganche del 20%, mensualidades directas con el desarrollador y escrituración. Pide el plan de pagos completo.',
  },

  agotado: {
    titulo: 'Estos terrenos ya no están disponibles',
    cuerpo:
      'El inventario que anunciábamos en esta página se agotó. Si quieres, te avisamos cuando entre inventario comparable en Playa del Carmen, con sus números completos.',
    mensajeWa:
      'Hola, vi que los terrenos de Playa del Carmen ya no están disponibles. Quiero que me avisen cuando entre inventario comparable.',
  },

  hero: {
    h1: 'Terrenos en Playa del Carmen',
    desdeAlMes: (mxn) => `desde ${mxn} al mes`,
    subtitulo:
      'Lotes residenciales en privada, con financiamiento directo del desarrollador. Sin banco, sin buró y sin comprobante de ingresos.',
    pruebas: {
      enganche: 'de enganche',
      libres: (total) => `de ${total} lotes libres`,
      porLote: 'por lote',
    },
  },

  verificables: {
    licencia: {
      rotulo: 'Licencia',
      titulo: (n) => `Licencia de fraccionamiento ${n}`,
      nota: (fecha) =>
        fecha
          ? `Emitida el ${fecha}. El número es público y se puede cotejar en el municipio.`
          : 'El número es público y se puede cotejar en el municipio.',
    },
    regimen: {
      rotulo: 'Régimen',
      nota: 'No es ejido. Es el punto donde se cae la mayoría de las ofertas baratas de la zona.',
    },
    queEs: {
      rotulo: 'Qué es',
      nota: (uso) =>
        uso
          ? `Uso de suelo ${uso}. Te decimos la palabra exacta del catálogo, no una versión bonita.`
          : 'Te decimos la palabra exacta del catálogo, no una versión bonita.',
    },
    aprovechamiento: {
      rotulo: 'Aprovechamiento',
      nota: (huella) =>
        `La casa puede ocupar hasta ${huella} de huella en planta. El resto queda como área libre, que lo exige el reglamento del fraccionamiento y no es recomendación nuestra.`,
    },
  },

  mensajeWa: {
    saludo: (slug) => `Hola, vi la página de terrenos en Playa del Carmen (ref. ${slug}).`,
    superficie: (m2) => `Son ${m2}.`,
    pide: 'Quiero el plan de pagos completo.',
  },

  sitio: {
    rotulo: 'El sitio',
    titulo: 'Así está hoy y así está proyectado',
    hoy: 'Hoy · fotografía',
    proyectado: 'Proyectado · render',
    texto: (sup) =>
      `Lo que se compra es el terreno${sup ? ` de ${sup}` : ''}, no la casa. La casa la construyes tú, cuando quieras y con quien quieras, dentro de lo que permite el reglamento del fraccionamiento. La segunda lámina es el proyecto del desarrollador para lotes ya construidos: sirve para ver qué cabe, no para prometer que viene incluido.`,
    vendidos: (t) => `lotes ya vendidos de ${t}`,
    aviso: 'Cifras declaradas por el desarrollador, no un contador que baja solo.',
  },

  plan: {
    rotulo: 'El plan',
    precioLista: ({ precio, superficie, porM2, esquema }) =>
      `Precio de lista ${precio}${
        superficie && porM2 ? ` por ${superficie}, es decir ${porM2} por m²` : ''
      }. ${esquema} Los gastos de escrituración y el mantenimiento se cotizan aparte, y te los desglosamos en el plan que te mandamos.`,
  },

  lote: {
    rotulo: 'El lote',
    titulo: 'Puedes construir más metros de los que compras',
    terreno: { etiqueta: 'Terreno', nota: 'lo que compras' },
    construible: {
      etiqueta: 'Construible',
      nota: (n, cus) => `sumando ${n} niveles, con CUS ${cus}`,
    },
  },

  privada: {
    rotulo: 'La privada',
    titulo: 'El lote está dentro de esto',
    intro:
      'Un terreno en privada no se compra por el terreno: se compra por lo que hay al otro lado de la caseta. Estas son las amenidades que el desarrollador tiene declaradas, y las láminas de su proyecto.',
    sinLamina: 'Declarada por el desarrollador, sin render en la galería',
    leyenda: (c, t) =>
      `${c} de las ${t} tienen lámina del proyecto, y son las que llevan número. Las marcadas con guion están declaradas en la ficha del desarrollador y no las publicamos en imagen: antes de eso te ponemos un guion, no una foto de otra cosa.`,
    aviso: (n, urb) =>
      `Las ${n} láminas de arriba son renders del proyecto del desarrollador, no obra existente: hoy la privada no está construida. Cómo se ve el terreno HOY está en la lámina ${urb}, que sí es fotografía. Las amenidades se entregan conforme al calendario de obra del desarrollador, y te lo mandamos junto con el plan de pagos.`,
    rotuloDefecto: 'La privada',
    aerea: 'aérea',
    rotulos: {
      alberca: 'Alberca comunitaria',
      casaClub: 'Casa club',
      casaClubComedor: 'Comedor de la casa club',
      gimnasio: 'Gimnasio',
      canchasCenital: 'Canchas, a plomo',
      amenidades: 'Pádel y pickleball',
      andador: 'Andadores y arbolado',
      cine: 'Cine al aire libre',
      domingo: 'Alberca y casa club',
    },
    amenidades: {},
  },

  figura: { render: 'Render del desarrollador.', foto: 'Fotografía real.' },

  solicitud2: {
    titulo: '¿Te mandamos el calendario de obra?',
    cuerpo:
      'Va junto al plan de pagos: en qué mes entrega el desarrollador cada amenidad de la lista de arriba, cuáles ya están contratadas y cuáles siguen en proyecto. Con fechas, no con «próximamente».',
  },

  cierre: {
    rotulo: 'Siguiente paso',
    titulo: 'Te mandamos el plan completo y tú decides',
    cuerpo:
      'Precio cerrado, enganche, la mensualidad de cada plazo y qué cubre la escritura. En un PDF, por WhatsApp, sin que tengas que ir a ninguna oficina para verlo.',
    whatsapp: 'O escríbenos por WhatsApp',
    estados: {},
    pie: ({ render, foto, estado, disponibles, totales }) =>
      `${
        render > 0
          ? `${render === 1 ? 'La imagen es un render' : `${render} de las imágenes de esta página son renders`} del proyecto del desarrollador, no obra existente${
              foto > 0
                ? `; ${foto === 1 ? 'la restante es fotografía real del terreno' : `las otras ${foto} son fotografía real del terreno`}`
                : ''
            }. Cada una va rotulada. `
          : ''
      }${estado ? `Estado: ${estado}. ` : ''}${
        disponibles && totales
          ? `${disponibles} lotes disponibles de ${totales} declarados por el desarrollador. `
          : ''
      }Precios y condiciones sujetos a cambio sin previo aviso.`,
  },

  barra: { desde: 'Desde', alMes: (m) => `${m} al mes`, cta: 'Ver mi plan' },

  form: {
    solicitud: 'Solicitud',
    campos: '3 campos',
    titulo: 'Recibe el plan de pagos completo',
    plazoPregunta: '¿A cuántos meses?',
    meses: (n) => `${n} meses`,
    nombre: 'Tu nombre',
    correo: 'Tu correo',
    whatsapp: 'Tu WhatsApp',
    tiempoRespuesta: 'el mismo día hábil',
    errFaltan: 'Faltan datos: pedimos tu nombre, tu correo y tu WhatsApp.',
    errCorreo: 'Revisa el correo: es a donde te mandamos el plan de pagos.',
    errTelefono: 'Revisa el WhatsApp: elige tu país y escribe el número completo.',
    errEnvio: 'No pudimos enviarlo. Inténtalo otra vez o escríbenos por WhatsApp.',
    enviando: 'Enviando…',
    enviar: 'Ver mi plan de pagos',
    gracias: {
      rotulo: 'Solicitud recibida',
      listo: (n) => `Listo, ${n}.`,
      cuerpo: (t, plazo) =>
        `Te escribimos por WhatsApp ${t} con el plan completo${plazo ? ` a ${plazo} meses` : ''}: precio, enganche, mensualidad y qué incluye la escritura. Una persona, no un robot.`,
    },
    pie: (t) =>
      `Te contesta un asesor por WhatsApp ${t}. Sin llamadas automáticas y sin compartir tu número con terceros.`,
    lead: {
      lote: (ref) => `Lote ref. ${ref}.`,
      plazo: (n) => (n ? `Pidió el plan de pagos a ${n} meses.` : 'Pidió el plan de pagos completo.'),
      origen: (b) => `Origen: landing corta de terrenos, bloque «${b}».`,
    },
  },

  mensualidad: {
    grupoAria: 'Plazo del plan de pagos',
    plazo: (n) => `${n} meses`,
    tuMensualidad: 'Tu mensualidad',
    pagos: (n, si) =>
      `${n} pagos mensuales${si ? ', sin intereses' : ''}. Le pagas al desarrollador: no hay banco, no hay buró, no hay comprobante de ingresos.`,
    repartoAria: (t) => `Reparto del pago: ${t}`,
    tramos: {
      enganche: { etiqueta: 'Enganche', momento: 'al firmar' },
      mensualidades: { etiqueta: 'Mensualidades', momento: (p) => `en ${p} pagos` },
      contraentrega: { etiqueta: 'Contraentrega', momento: 'al entregar' },
    },
  },

  wa: 'O escríbenos por WhatsApp',

  imagenes: null,
  catalogo: { subtipo: {}, regimen: {} },
};

// ───────────────────────────── Inglés ─────────────────────────────

const IMAGENES_EN: Record<keyof ImagenesLanding, TextoImagen> = {
  hero: {
    alt: 'Aerial render of the gated community: tree-lined streets, two-story homes and the pool area in the center',
    caption: 'The finished community, according to the developer’s plans.',
  },
  domingo: {
    alt: 'Community pool with lounge chairs and palapas, and the clubhouse in the background, with residents using it',
    caption: 'The community pool and clubhouse, as planned.',
  },
  amenidades: {
    alt: 'Padel and pickleball courts among the trees, with neighbors playing and others sitting on the benches',
    caption:
      'The courts, as planned. They are delivered according to the construction schedule further down.',
  },
  urbanizacion: {
    alt: 'Real aerial view of the site: the roads and lot boundaries, still unbuilt and without utilities',
    caption: 'The site today: roads laid out and lots marked off, without utilities and unbuilt.',
  },
  alberca: {
    alt: 'Pool with lounge chairs under umbrellas and a palapa with grills in the background, with residents in the water',
    caption: 'The community pool, as planned.',
  },
  casaClub: {
    alt: 'Exterior of the clubhouse at dusk, with the lit dining room behind the windows and a tropical garden in front',
    caption: 'The clubhouse, as planned.',
  },
  casaClubComedor: {
    alt: 'Covered dining room of the clubhouse next to the pool, with long wooden tables and a terracotta stucco wall',
    caption: 'The clubhouse dining room, as planned.',
  },
  gimnasio: {
    alt: 'Single-story gym with stone walls and floor-to-ceiling windows, surrounded by greenery, with equipment and bikes inside',
    caption: 'The gym, as planned.',
  },
  canchasCenital: {
    alt: 'Overhead view of the courts: two blue padel courts and a multi-use basketball court, separated by tree-lined medians',
    caption: 'The courts seen from above, as planned.',
  },
  andador: {
    alt: 'Concrete walking path in the shade of mature trees, with the courts and a planter in the background',
    caption: 'The walking paths and trees, as planned.',
  },
  cine: {
    alt: 'Outdoor cinema under the trees: a large screen showing a game and wooden picnic tables with neighbors seated',
    caption: 'The outdoor cinema, as planned.',
  },
  casasCenital: {
    alt: 'Overhead view of lots already built: two-story homes with a private pool and wooden deck in the backyard, between tree-lined streets',
    caption:
      'Lots already built, in the developer’s plans. The house is not included: what you buy is the land.',
  },
};

export const COPY_EN: CopyTerrenos = {
  locale: 'en',
  leadSource: 'lp_lotes_pdc_en',
  formType: 'lp_terrenos_pdc_en',
  waSurface: 'lp-terrenos-pdc-cierre-en',
  paisTelefono: 'US',

  meta: {
    title: 'Land in Playa del Carmen with 60 monthly payments, no bank',
    description:
      'Residential lots in a gated community, from 129 m². 20% down payment, monthly payments directly with the developer and deed. Ask for the full payment plan.',
  },

  agotado: {
    titulo: 'This land is no longer available',
    cuerpo:
      'The inventory we advertised on this page is sold out. If you like, we will let you know when comparable inventory comes in in Playa del Carmen, with the full numbers.',
    mensajeWa:
      'Hi, I saw that the land in Playa del Carmen is no longer available. I would like to be notified when comparable inventory comes in.',
  },

  hero: {
    h1: 'Land in Playa del Carmen',
    desdeAlMes: (mxn) => `from ${mxn} a month`,
    subtitulo:
      'Residential lots in a gated community, with direct financing from the developer. No bank, no credit check and no proof of income.',
    pruebas: {
      enganche: 'down payment',
      libres: (total) => `of ${total} lots available`,
      porLote: 'per lot',
    },
  },

  verificables: {
    licencia: {
      rotulo: 'License',
      titulo: (n) => `Subdivision license ${n}`,
      nota: (fecha) =>
        fecha
          ? `Issued on ${fecha}. The number is public and can be checked with the municipality.`
          : 'The number is public and can be checked with the municipality.',
    },
    regimen: {
      rotulo: 'Tenure',
      nota: 'It is not ejido land. That is where most cheap offers in the area fall apart.',
    },
    queEs: {
      rotulo: 'What it is',
      nota: (uso) =>
        uso
          ? `Land use: ${uso}. We give you the exact word from the catalog, not a prettier version.`
          : 'We give you the exact word from the catalog, not a prettier version.',
    },
    aprovechamiento: {
      rotulo: 'Build limits',
      nota: (huella) =>
        `The house can cover up to ${huella} of footprint. The rest stays as open area, which the subdivision’s rules require; it is not our recommendation. (COS is lot coverage; CUS is floor-area ratio.)`,
    },
  },

  mensajeWa: {
    saludo: (slug) => `Hi, I saw the land page for Playa del Carmen (ref. ${slug}).`,
    superficie: (m2) => `It is ${m2}.`,
    pide: 'I would like the full payment plan.',
  },

  sitio: {
    rotulo: 'The site',
    titulo: 'How it looks today and how it is planned',
    hoy: 'Today · photograph',
    proyectado: 'Planned · render',
    texto: (sup) =>
      `What you buy is the lot${sup ? ` (${sup})` : ''}, not the house. You build the house yourself, when you want and with whom you want, within what the subdivision’s rules allow. The second figure is the developer’s plan for lots already built: it shows what fits, not a promise that it comes included.`,
    vendidos: (t) => `lots already sold out of ${t}`,
    aviso: 'Figures declared by the developer, not a counter that drops on its own.',
  },

  plan: {
    rotulo: 'The plan',
    // El esquema del catálogo es una frase en español: en inglés no se publica.
    precioLista: ({ precio, superficie, porM2 }) =>
      `List price ${precio}${
        superficie && porM2 ? ` for ${superficie}, which is ${porM2} per m²` : ''
      }. Closing costs and maintenance are quoted separately, and we break them down in the plan we send you.`,
  },

  lote: {
    rotulo: 'The lot',
    titulo: 'You can build more square meters than you buy',
    terreno: { etiqueta: 'Land', nota: 'what you buy' },
    construible: {
      etiqueta: 'Buildable',
      nota: (n, cus) => `adding up ${n} ${n === 1 ? 'level' : 'levels'}, with CUS ${cus}`,
    },
  },

  privada: {
    rotulo: 'The community',
    titulo: 'Your lot sits inside all of this',
    intro:
      'You do not buy a lot in a gated community for the lot alone: you buy it for what is on the other side of the gate. These are the amenities the developer has declared, and the figures from its project.',
    sinLamina: 'Declared by the developer, no render in the gallery',
    leyenda: (c, t) =>
      `${c} of the ${t} have a figure from the project, and those are the ones with a number. The ones marked with a dash are declared in the developer’s spec sheet and we do not publish them as an image: we give you a dash, not a photo of something else.`,
    aviso: (n, urb) =>
      `The ${n} figures above are renders of the developer’s project, not existing construction: the community is not built today. How the land looks TODAY is in figure ${urb}, which is a real photograph. Amenities are delivered according to the developer’s construction schedule, and we send it to you together with the payment plan.`,
    rotuloDefecto: 'The community',
    aerea: 'aerial',
    rotulos: {
      alberca: 'Community pool',
      casaClub: 'Clubhouse',
      casaClubComedor: 'Clubhouse dining room',
      gimnasio: 'Gym',
      canchasCenital: 'Courts, overhead',
      amenidades: 'Padel and pickleball',
      andador: 'Paths and trees',
      cine: 'Outdoor cinema',
      domingo: 'Pool and clubhouse',
    },
    // Claves = nombre normalizado del catálogo (ver `normalizarClave`).
    amenidades: {
      'alberca comunitaria': 'Community pool',
      gimnasio: 'Gym',
      'salon de eventos': 'Event hall',
      'jardin comunitario': 'Community garden',
      cancha: 'Court',
      cctv: 'CCTV',
      'pet zone': 'Pet zone',
      'area de ninos': 'Kids’ area',
      'seguridad 24h': '24-hour security',
      'acceso controlado': 'Controlled access',
    },
  },

  figura: { render: 'Developer’s render.', foto: 'Real photograph.' },

  solicitud2: {
    titulo: 'Want us to send you the construction schedule?',
    cuerpo:
      'It comes with the payment plan: in which month the developer delivers each amenity on the list above, which ones are already contracted and which are still in the planning stage. With dates, not “coming soon”.',
  },

  cierre: {
    rotulo: 'Next step',
    titulo: 'We send you the full plan and you decide',
    cuerpo:
      'Final price, down payment, the monthly payment for each term and what the deed covers. In a PDF, over WhatsApp, with no need to visit any office to see it.',
    whatsapp: 'Or message us on WhatsApp',
    estados: {
      preventa: 'Pre-sale',
      disponible: 'Available',
    },
    pie: ({ render, foto, estado, disponibles, totales }) =>
      `${
        render > 0
          ? `${render === 1 ? 'The image is a render' : `${render} of the images on this page are renders`} of the developer’s project, not existing construction${
              foto > 0
                ? `; ${foto === 1 ? 'the remaining one is a real photograph of the land' : `the other ${foto} are real photographs of the land`}`
                : ''
            }. Each one is labeled. `
          : ''
      }${estado ? `Status: ${estado}. ` : ''}${
        disponibles && totales
          ? `${disponibles} lots available out of ${totales} declared by the developer. `
          : ''
      }Prices and terms are subject to change without notice.`,
  },

  barra: { desde: 'From', alMes: (m) => `${m} a month`, cta: 'See my plan' },

  form: {
    solicitud: 'Request',
    campos: '3 fields',
    titulo: 'Get the full payment plan',
    plazoPregunta: 'How many months?',
    meses: (n) => `${n} months`,
    nombre: 'Your name',
    correo: 'Your email',
    whatsapp: 'Your WhatsApp',
    tiempoRespuesta: 'the same business day',
    errFaltan: 'Missing information: we need your name, your email and your WhatsApp.',
    errCorreo: 'Check your email: it is where we send the payment plan.',
    errTelefono: 'Check your WhatsApp: choose your country and enter the full number.',
    errEnvio: 'We could not send it. Please try again or message us on WhatsApp.',
    enviando: 'Sending…',
    enviar: 'See my payment plan',
    gracias: {
      rotulo: 'Request received',
      listo: (n) => `All set, ${n}.`,
      cuerpo: (t, plazo) =>
        `We will message you on WhatsApp ${t} with the full plan${plazo ? ` for ${plazo} months` : ''}: price, down payment, monthly payment and what the deed includes. A person, not a robot.`,
    },
    pie: (t) =>
      `An advisor replies on WhatsApp ${t}. No automated calls and we do not share your number with third parties.`,
    lead: {
      lote: (ref) => `Lot ref. ${ref}.`,
      plazo: (n) =>
        n ? `Asked for the ${n}-month payment plan.` : 'Asked for the full payment plan.',
      origen: (b) => `Source: short land landing (English), block “${b}”.`,
    },
  },

  mensualidad: {
    grupoAria: 'Payment plan term',
    plazo: (n) => `${n} months`,
    tuMensualidad: 'Your monthly payment',
    pagos: (n, si) =>
      `${n} monthly payments${si ? ', interest-free' : ''}. You pay the developer: no bank, no credit check, no proof of income.`,
    repartoAria: (t) => `Payment breakdown: ${t}`,
    tramos: {
      enganche: { etiqueta: 'Down payment', momento: 'at signing' },
      mensualidades: { etiqueta: 'Monthly payments', momento: (p) => `in ${p} payments` },
      contraentrega: { etiqueta: 'Final payment', momento: 'on delivery' },
    },
  },

  wa: 'Or message us on WhatsApp',

  imagenes: IMAGENES_EN,
  catalogo: {
    // Valores probables del catálogo; lo que no esté aquí se publica tal cual.
    subtipo: {
      'semi urbanizado': 'Semi-developed',
      urbanizado: 'Developed',
      'lote residencial': 'Residential lot',
    },
    regimen: {
      'propiedad privada': 'Private property',
    },
  },
};

export const COPY: Record<LocaleLp, CopyTerrenos> = { es: COPY_ES, en: COPY_EN };
