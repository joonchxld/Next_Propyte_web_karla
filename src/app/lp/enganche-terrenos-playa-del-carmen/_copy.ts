// ============================================================
// Copy de la landing de ENGANCHE, en los dos idiomas que sirve.
//
// La variante en inglés (`/lp/down-payment-land-playa-del-carmen`) es la MISMA
// página: mismo formulario, mismo desglose, mismas reglas de dato. Lo único
// propio son las cadenas, que viven aquí. Con dos árboles de componentes, el
// primer arreglo al formulario —que ya costó $991.40 MXN en clics sin envíos—
// se aplicaría en un solo idioma y nadie se enteraría.
//
// ═══ MARCADO INLINE ═══
//
// Los titulares llevan una palabra de acento en serif itálica y a veces la
// cifra en la sans pesada, y el ORDEN de esas palabras cambia entre idiomas. Por
// eso las cadenas llevan marcas que `rich()` (ver `_components/rich.tsx`)
// convierte en nodos:
//
//   · `*texto*`  → `<span class="lpe-italica">`
//   · `{nombre}` → el nodo que el llamador pasa con ese nombre (la cifra)
//
// ═══ LO QUE NO CRUZA LA FRONTERA SERVIDOR→CLIENTE ═══
//
// Este diccionario interpola con FUNCIONES, y una función no es serializable:
// pasarlo como prop a un componente `'use client'` revienta `next build`
// («Functions cannot be passed directly to Client Components»), no el
// typecheck. Los componentes de cliente reciben `locale` (una cadena) y
// resuelven su diccionario con `COPY[locale]`.
//
// ═══ LO QUE NO SE TRADUCE ═══
//
//   · Los VALORES de las opciones del diagnóstico que viajan a Zoho (ver
//     `FormEnganche.tsx`): el asesor trabaja el CRM en español y los reportes
//     por rango de enganche deben agrupar los leads de los dos idiomas.
//   · Nombres de zona y ciudad: vienen del Hub tal cual.
//   · Los pesos NO se convierten a dólares. Se imprimen como «$202,176 MXN»,
//     igual que en español: la moneda siempre va pegada a la cifra.
// ============================================================

import type { LocaleLp } from '../_components/v2/i18n';
import type { ImagenesLanding, ImagenLanding } from '@/lib/supabase/lp-lotes';

type ClaveImagen = keyof ImagenesLanding;
type Textos = Record<string, string>;

/** Lo que el desglose y la estructura necesitan decir de los porcentajes. */
interface Porcentajes {
  enganchePct: number;
  mensualidadesPct: number;
  contraentregaPct: number;
}

export interface CopyEnganche {
  meta: { title: string; description: string };

  /** Estado «agotado»: el inventario desapareció. */
  agotado: { titulo: string; cuerpo: string };

  hero: {
    /** Sin cifra de enganche (plan no disponible). Marcas: `*acento*`. */
    titulo: string;
    /** Con cifra. Marcas: `*acento*` y `{cifra}`. */
    tituloConEnganche: string;
    intro: string;
  };

  declaracion: {
    /** Marcas: `{cifra}` y `*acento*`. */
    titulo: string;
    cuerpo: (p: { enganchePct: number; sinIntereses: boolean; contraentregaPct: number }) => string;
  };

  desglose: {
    rotulo: string;
    titulo: string;
    cuerpo: (contraentregaPct: number) => string;
    esquema: (esquemaPago: string, plan: Porcentajes) => string;
  };

  amenidades: {
    rotulo: string;
    titulo: string;
    nota: (n: number) => string;
    /** Nombre normalizado (minúsculas, sin acentos) → nombre a mostrar. Vacío ⇒ se muestra el del registro. */
    nombres: Textos;
  };

  galeria: {
    rotulo: string;
    titulo: string;
    etiquetas: Record<
      | 'gimnasio'
      | 'casaClub'
      | 'cine'
      | 'canchasCenital'
      | 'casaClubComedor'
      | 'domingo'
      | 'amenidades'
      | 'andador',
      string
    >;
    nota: (n: number) => string;
    etiquetaAlberca: string;
  };

  solicitud: { titulo: string; cuerpo: string };

  sitio: {
    rotulo: string;
    titulo: string;
    hoy: string;
    proyectado: string;
    /** `superficie` ya formateada («129.6 m²») o null. */
    cuerpo: (superficie: string | null) => string;
  };

  cifras: {
    rotulo: string;
    porLote: string;
    porM2: string;
    deInteres: string;
    vendidos: (total: number) => string;
    nota: string;
  };

  cierre: {
    rotulo: string;
    titulo: string;
    cuerpo: string;
    /** `null` ⇒ no se imprime el estado comercial (viene del registro, en español). */
    estado: ((estado: string) => string) | null;
    disponibles: (disponibles: number, totales: number) => string;
    aviso: string;
  };

  whatsapp: {
    /** `enganche` ya formateado o null. */
    mensaje: (ref: string, enganche: string | null) => string;
    aria: string;
  };

  flotante: { enganche: string; verPlan: string };

  /** Textos de una imagen curada que en el registro están solo en español. */
  imagenes: Partial<Record<ClaveImagen, { alt: string; caption: string }>> | null;
  figura: { render: string; foto: string };

  estructura: {
    rotulo: string;
    tramos: { enganche: string; mensualidades: string; contraentrega: string };
    cuando: {
      enganche: string;
      mensualidades: (sinIntereses: boolean) => string;
      contraentrega: string;
    };
    nota: string;
  };

  tramos: {
    selectorRotulo: string;
    selectorAria: string;
    meses: (n: number) => string;
    proporcionAria: (p: Porcentajes) => string;
    precioLista: (precio: string) => string;
    sinDato: string;
    pagos: (n: number) => string;
    enganche: { titulo: string; pie: string };
    mensualidades: {
      titulo: string;
      pie: (pagos: number, sinIntereses: boolean) => string;
    };
    contraentrega: { titulo: string; pie: string };
  };

  form: {
    tiempoRespuesta: string;
    titulo: string;
    trae: (enganche: string | null) => string[];
    nombre: { label: string; placeholder: string; error: string };
    correo: {
      label: string;
      placeholder: string;
      ayuda: string;
      vacio: string;
      invalido: string;
    };
    telefono: {
      labelLada: string;
      labelSimple: string;
      placeholder: string;
      ayudaLada: string;
      ayudaSimple: string;
      vacioLada: string;
      invalidoLada: string;
      vacioSimple: string;
      faltan: (digitos: number) => string;
    };
    diagnostico: {
      rotulo: string;
      intro: string;
      uso: {
        pregunta: string;
        error: string;
        opciones: Record<
          'plusvalia' | 'rentas' | 'construir' | 'explorando',
          { etiqueta: string; ayuda: string }
        >;
      };
      enganche: {
        pregunta: string;
        nota: string;
        error: string;
        opciones: Record<'hasta150' | 'r150a300' | 'r300a600' | 'mas600', string>;
      };
      zona: {
        pregunta: string;
        error: string;
        opciones: Record<'pdc' | 'tulum' | 'puertoAventuras' | 'abierto', string>;
      };
    };
    plazo: { legend: string; pregunta: string; aclaracion: string; meses: (n: number) => string };
    enviando: string;
    boton: string;
    errorEnvio: string;
    nota: (tiempoRespuesta: string) => string;
    gracias: {
      rotulo: string;
      saludo: (nombre: string) => string;
      cuerpo: (tiempoRespuesta: string, plazo: number | null, diagnostico: boolean) => string;
    };
  };
}

// ────────────────────────────────────────────────────────────
// ESPAÑOL — el texto de siempre. Cualquier cambio aquí cambia la página que
// está en producción: la fuente de verdad de «exactamente como antes» es el
// `git diff` de este bloque.
// ────────────────────────────────────────────────────────────
export const COPY_ES: CopyEnganche = {
  meta: {
    // Sin «| Propyte» al final: el layout raíz ya aplica `template: '%s | Propyte'`
    // y el título salía duplicado en producción («... | Propyte | Propyte»).
    title: 'Terrenos en Playa del Carmen con $202,176 MXN de enganche',
    description:
      'Lotes residenciales en privada desde 129 m². Enganche del 20%, el resto en mensualidades sin intereses y sin banco. Te mandamos el plan de pagos completo.',
  },

  agotado: {
    titulo: 'Estos terrenos *ya no* están disponibles',
    cuerpo:
      'El inventario que anunciábamos en esta página se agotó. Si quieres, te avisamos cuando entre inventario comparable en Playa del Carmen, con sus números completos.',
  },

  hero: {
    titulo: '*Terrenos* en Playa del Carmen',
    tituloConEnganche: '*Terrenos* en Playa del Carmen *con* {cifra} *de enganche*',
    intro:
      'Lotes residenciales en privada, con financiamiento directo del desarrollador. Sin banco, sin buró y sin comprobante de ingresos.',
  },

  declaracion: {
    titulo: 'Solo {cifra} *de enganche* y el lote queda apartado a tu nombre.',
    cuerpo: ({ enganchePct, sinIntereses, contraentregaPct }) =>
      `El ${enganchePct}% del precio. El resto se paga en mensualidades${
        sinIntereses ? ' sin intereses' : ''
      } directamente con el desarrollador, y un último ${contraentregaPct}% cuando te entregan el lote.`,
  },

  desglose: {
    rotulo: '03 · A dónde va tu dinero',
    titulo: 'Los *tres pagos*, completos',
    cuerpo: (c) =>
      `Publicamos los tres, no solo el enganche. El ${c}% de contraentrega es un pago fuerte y esconderlo hasta la llamada es lo que convierte un interesado en una discusión.`,
    esquema: (esquemaPago) =>
      `Esquema declarado por el desarrollador: ${esquemaPago}${
        /[.!?]$/.test(esquemaPago.trim()) ? '' : '.'
      } Los gastos de escrituración y el mantenimiento se cotizan aparte, y te los desglosamos en el plan que te mandamos.`,
  },

  amenidades: {
    rotulo: '04 · La privada',
    titulo: '*Disfruta* de las amenidades que ya están contratadas',
    nota: (n) =>
      `Las ${n} salen de la ficha del desarrollador, no de nuestro copy. Se entregan conforme a su calendario de obra, y te lo mandamos junto con el plan de pagos.`,
    nombres: {},
  },

  galeria: {
    rotulo: '05 · El proyecto',
    titulo: 'Esto es lo que hay *al otro lado* de la caseta',
    nota: (n) =>
      `Las ${n} imágenes de arriba son renders del proyecto del desarrollador, no obra existente: hoy la privada no está construida. Cómo se ve el terreno HOY está en la siguiente sección, y eso sí es fotografía.`,
    etiquetaAlberca: 'Alberca comunitaria',
    etiquetas: {
      gimnasio: 'Gimnasio',
      casaClub: 'Casa club',
      cine: 'Cine al aire libre',
      canchasCenital: 'Canchas',
      casaClubComedor: 'Comedor',
      domingo: 'Alberca y casa club',
      amenidades: 'Pádel y pickleball',
      andador: 'Andadores',
    },
  },

  solicitud: {
    titulo: '¿Te mandamos el *calendario de obra*?',
    cuerpo:
      'Va junto al plan de pagos: en qué mes entrega el desarrollador cada amenidad de la lista, cuáles ya están contratadas y cuáles siguen en proyecto. Con fechas, no con «próximamente».',
  },

  sitio: {
    rotulo: '07 · El sitio',
    titulo: 'Así está *hoy* y así está *proyectado*',
    hoy: 'Hoy · fotografía',
    proyectado: 'Proyectado · render',
    cuerpo: (superficie) =>
      `Lo que se compra es el terreno${
        superficie ? ` de ${superficie}` : ''
      }, no la casa. La casa la construyes tú, cuando quieras y con quien quieras, dentro de lo que permite el reglamento del fraccionamiento.`,
  },

  cifras: {
    rotulo: 'En números',
    porLote: 'por lote',
    porM2: 'por m²',
    deInteres: 'de interés',
    vendidos: (total) => `lotes vendidos de ${total}`,
    nota: 'Cifras declaradas por el desarrollador y calculadas sobre el precio de lista. No publicamos proyecciones de plusvalía: no tenemos una fuente que las sostenga.',
  },

  cierre: {
    rotulo: '09 · Siguiente paso',
    titulo: 'Te mandamos el plan completo y *tú decides*',
    cuerpo:
      'Precio cerrado, enganche, la mensualidad de cada plazo, la contraentrega y qué cubre la escritura. En un PDF, por WhatsApp, sin que tengas que ir a ninguna oficina para verlo.',
    estado: (estado) => `Estado: ${estado}. `,
    disponibles: (d, t) => `${d} lotes disponibles de ${t} declarados por el desarrollador. `,
    aviso:
      'Las imágenes de esta página son renders del proyecto del desarrollador salvo la aérea del polígono, que es fotografía real; cada una va rotulada. Precios y condiciones sujetos a cambio sin previo aviso.',
  },

  whatsapp: {
    mensaje: (ref, enganche) =>
      [
        `Hola, vi la página de terrenos en Playa del Carmen (ref. ${ref}).`,
        enganche ? `Vi que el enganche es de ${enganche}.` : null,
        'Quiero el plan de pagos completo.',
      ]
        .filter(Boolean)
        .join(' '),
    aria: 'Escríbenos por WhatsApp',
  },

  flotante: { enganche: 'Enganche', verPlan: 'Ver el plan' },

  // Español: se usan el `alt` y el `caption` del registro tal cual.
  imagenes: null,
  figura: { render: 'Render del desarrollador.', foto: 'Fotografía real.' },

  estructura: {
    rotulo: 'El pago completo',
    tramos: { enganche: 'Enganche', mensualidades: 'Mensualidades', contraentrega: 'Contraentrega' },
    cuando: {
      enganche: 'Hoy. El lote queda apartado a tu nombre.',
      mensualidades: (si) =>
        si
          ? 'Mes a mes, sin intereses y directo con el desarrollador.'
          : 'Mes a mes, directo con el desarrollador.',
      contraentrega: 'Al momento de la entrega del lote.',
    },
    nota: 'Calculado sobre el esquema de pago y el precio de lista que declara el desarrollador.',
  },

  tramos: {
    selectorRotulo: 'El resto, en',
    selectorAria: 'Plazo de las mensualidades',
    meses: (n) => `${n} meses`,
    proporcionAria: (p) =>
      `Proporción del precio: ${p.enganchePct}% de enganche, ${p.mensualidadesPct}% en mensualidades y ${p.contraentregaPct}% de contraentrega`,
    precioLista: (precio) => `Sobre un precio de lista de ${precio}.`,
    sinDato: 'Te lo desglosamos en el plan.',
    pagos: (n) => `× ${n} pagos`,
    enganche: {
      titulo: 'Enganche',
      pie: 'Un solo pago. Con esto el lote queda apartado a tu nombre.',
    },
    mensualidades: {
      titulo: 'Mensualidades',
      pie: (pagos, si) =>
        `${pagos} pagos mensuales${
          si ? ', sin intereses' : ''
        }. Directo con el desarrollador: sin banco, sin buró y sin comprobante de ingresos.`,
    },
    contraentrega: {
      titulo: 'Contraentrega',
      pie: 'El último pago, al entregarte el lote. Va aquí y no en letra chica porque es un pago fuerte y tienes que contar con él.',
    },
  },

  form: {
    tiempoRespuesta: 'el mismo día hábil',
    titulo: 'Recibe el *plan de pagos* completo',
    trae: (enganche) => [
      enganche ? `Enganche de ${enganche}` : 'El enganche exacto',
      'La mensualidad de cada plazo',
      'Contraentrega y gastos de escrituración',
    ],
    nombre: {
      label: 'Tu nombre',
      placeholder: 'Como quieres que te llamemos',
      error: 'Escribe tu nombre para que sepamos cómo llamarte.',
    },
    correo: {
      label: 'Tu correo',
      placeholder: 'tu@correo.com',
      ayuda: 'Ahí te llega el plan en PDF.',
      vacio: 'Necesitamos tu correo para mandarte el plan en PDF.',
      invalido: 'Revisa el correo: parece que le falta algo.',
    },
    telefono: {
      labelLada: 'Tu teléfono o WhatsApp',
      labelSimple: 'Tu WhatsApp',
      placeholder: '984 123 4567',
      ayudaLada: 'Elige tu país y escribe el número. Es donde te llega el plan.',
      ayudaSimple: '10 dígitos. Es donde te llega el plan.',
      vacioLada: 'Necesitamos tu teléfono para mandarte el plan.',
      invalidoLada: 'Revisa el número: elige tu país y escríbelo completo.',
      vacioSimple: 'Necesitamos tu WhatsApp para mandarte el plan.',
      faltan: (d) => `Van ${d} de 10 dígitos.`,
    },
    diagnostico: {
      rotulo: 'Tres toques y llegamos con una opción',
      intro:
        'Con esto el asesor te escribe con el lote y el plan que cuadran con tu caso, no con el catálogo entero. Nada de esto es un compromiso.',
      uso: {
        pregunta: '¿Para qué lo quieres?',
        error: 'Elige para qué lo quieres.',
        opciones: {
          plusvalia: { etiqueta: 'Plusvalía', ayuda: 'Comprar hoy y vender cuando suba' },
          rentas: { etiqueta: 'Rentas', ayuda: 'Airbnb o renta a largo plazo' },
          construir: { etiqueta: 'Construir mi casa', ayuda: 'Para vivir o para vacacionar' },
          explorando: { etiqueta: 'Aún estoy explorando', ayuda: 'Todavía comparando opciones' },
        },
      },
      enganche: {
        pregunta: '¿Cuánto puedes poner de enganche?',
        nota: 'En miles de pesos mexicanos (MXN). Aproximado.',
        error: 'Elige un rango. Es aproximado, no un compromiso.',
        opciones: {
          hasta150: 'Hasta 150 mil',
          r150a300: '150 a 300 mil',
          r300a600: '300 a 600 mil',
          mas600: 'Más de 600 mil',
        },
      },
      zona: {
        pregunta: '¿Dónde te interesa?',
        error: 'Elige una zona o marca que estás abierto.',
        opciones: {
          pdc: 'Playa del Carmen',
          tulum: 'Tulum',
          puertoAventuras: 'Puerto Aventuras',
          abierto: 'Abierto a la mejor opción',
        },
      },
    },
    plazo: {
      legend: 'Plazo para calcular las mensualidades',
      pregunta: '¿A cuántos meses te lo calculamos?',
      aclaracion: 'Puedes cambiarlo después.',
      meses: (n) => `${n} meses`,
    },
    enviando: 'Enviando…',
    boton: 'Recibe el plan de pagos',
    errorEnvio: 'No pudimos enviarlo. Inténtalo otra vez o escríbenos por WhatsApp.',
    nota: (t) =>
      `Te escribe un asesor por WhatsApp ${t}. Sin llamadas automáticas y sin compartir tu número con terceros.`,
    gracias: {
      rotulo: 'Solicitud recibida',
      saludo: (nombre) => `Listo, ${nombre}.`,
      cuerpo: (t, plazo, diagnostico) =>
        `Te escribimos por WhatsApp ${t} con el plan completo${
          plazo ? ` a ${plazo} meses` : ''
        }: enganche, mensualidad, contraentrega y qué cubre la escritura. Una persona, no un robot.${
          diagnostico
            ? ' Y con la opción que cuadra con lo que nos dijiste, no con el catálogo entero.'
            : ''
        }`,
    },
  },
};

// ────────────────────────────────────────────────────────────
// INGLÉS — tráfico pagado de Estados Unidos y Canadá. Mismas afirmaciones que
// el español, sin cifras, garantías ni promesas legales nuevas. Los pesos van
// como «$202,176 MXN», nunca convertidos.
// ────────────────────────────────────────────────────────────
export const COPY_EN: CopyEnganche = {
  meta: {
    title: 'Land in Playa del Carmen with a $202,176 MXN down payment',
    description:
      'Residential lots in a gated community starting at 129 m². 20% down payment, the rest in interest-free monthly payments with no bank involved. We send you the full payment plan.',
  },

  agotado: {
    titulo: 'These lots are *no longer* available',
    cuerpo:
      'The inventory we advertised on this page has sold out. If you like, we will let you know when comparable inventory comes up in Playa del Carmen, with the full numbers.',
  },

  hero: {
    titulo: '*Land* in Playa del Carmen',
    tituloConEnganche: '*Land* in Playa del Carmen *with* {cifra} *down*',
    intro:
      'Residential lots in a gated community, with direct financing from the developer. No bank, no credit check and no proof of income.',
  },

  declaracion: {
    titulo: 'Just {cifra} *down* and the lot is reserved in your name.',
    cuerpo: ({ enganchePct, sinIntereses, contraentregaPct }) =>
      `${enganchePct}% of the price down. The rest is paid in monthly payments${
        sinIntereses ? ' with no interest' : ''
      } directly to the developer, plus a final ${contraentregaPct}% when the lot is delivered to you.`,
  },

  desglose: {
    rotulo: '03 · Where your money goes',
    titulo: 'All *three payments*, in full',
    cuerpo: (c) =>
      `We show all three, not just the down payment. The ${c}% due on delivery is a big payment, and hiding it until the phone call is what turns an interested buyer into an argument.`,
    // El texto del registro viene en español, así que en inglés la frase se
    // arma con los porcentajes del plan (los mismos que parsea del esquema).
    esquema: (_esquemaPago, p) =>
      `Payment schedule declared by the developer: ${p.enganchePct}% down payment, ${p.mensualidadesPct}% in monthly payments and ${p.contraentregaPct}% on delivery. Closing costs and maintenance are quoted separately, and we break them down in the plan we send you.`,
  },

  amenidades: {
    rotulo: '04 · The community',
    titulo: '*Enjoy* the amenities that are already contracted',
    nota: (n) =>
      `All ${n} come from the developer's fact sheet, not from our copy. They are delivered according to the developer's construction schedule, and we send it to you along with the payment plan.`,
    nombres: {
      'alberca comunitaria': 'Community pool',
      gimnasio: 'Gym',
      'salon de eventos': 'Event hall',
      'jardin comunitario': 'Community garden',
      'seguridad 24h': '24-hour security',
      cctv: 'CCTV',
      'acceso controlado': 'Controlled access',
      'pet zone': 'Pet zone',
      cancha: 'Court',
      'area de ninos': "Children's play area",
    },
  },

  galeria: {
    rotulo: '05 · The project',
    titulo: "Here's what's *on the other side* of the gate",
    nota: (n) =>
      `The ${n} images above are renders of the developer's project, not existing construction: the community is not built today. What the land looks like TODAY is in the next section, and that one is a real photograph.`,
    etiquetaAlberca: 'Community pool',
    etiquetas: {
      gimnasio: 'Gym',
      casaClub: 'Clubhouse',
      cine: 'Outdoor cinema',
      canchasCenital: 'Courts',
      casaClubComedor: 'Dining room',
      domingo: 'Pool and clubhouse',
      amenidades: 'Padel and pickleball',
      andador: 'Walkways',
    },
  },

  solicitud: {
    titulo: 'Want us to send you the *construction schedule*?',
    cuerpo:
      'It comes with the payment plan: in which month the developer delivers each amenity on the list, which ones are already contracted and which are still planned. With dates, not "coming soon".',
  },

  sitio: {
    rotulo: '07 · The site',
    titulo: "Here's how it looks *today* and how it's *planned*",
    hoy: 'Today · photograph',
    proyectado: 'Planned · render',
    cuerpo: (superficie) =>
      `What you are buying is the land${
        superficie ? `, ${superficie}` : ''
      }, not the house. You build the house yourself, whenever you want and with whoever you want, within what the community's regulations allow.`,
  },

  cifras: {
    rotulo: 'By the numbers',
    porLote: 'per lot',
    porM2: 'per m²',
    deInteres: 'interest',
    vendidos: (total) => `lots sold out of ${total}`,
    nota: 'Figures declared by the developer and calculated on the list price. We do not publish appreciation projections: we have no source to back them up.',
  },

  cierre: {
    rotulo: '09 · Next step',
    titulo: 'We send you the full plan and *you decide*',
    cuerpo:
      'Final price, down payment, the monthly payment for each term, the final payment on delivery and what the deed covers. In a PDF, on WhatsApp, without having to visit any office to see it.',
    // El estado comercial viene del registro en español («Disponible», etc.).
    estado: null,
    disponibles: (d, t) => `${d} lots available out of ${t} declared by the developer. `,
    aviso:
      "The images on this page are renders of the developer's project, except the aerial photo of the site, which is a real photograph; each one is labeled. Prices and conditions are subject to change without notice.",
  },

  whatsapp: {
    mensaje: (ref, enganche) =>
      [
        `Hi, I saw the land page for Playa del Carmen (ref. ${ref}).`,
        enganche ? `I saw the down payment is ${enganche}.` : null,
        'I would like the full payment plan.',
      ]
        .filter(Boolean)
        .join(' '),
    aria: 'Message us on WhatsApp',
  },

  flotante: { enganche: 'Down payment', verPlan: 'See the plan' },

  // Alt y pie de las 12 imágenes curadas (están en español en `lp-lotes.ts`).
  imagenes: {
    hero: {
      alt: 'Aerial render of the gated community: tree-lined streets, two-story homes and the pool area in the center',
      caption: "The finished community, according to the developer's project.",
    },
    domingo: {
      alt: 'Community pool with loungers and palapas, and the clubhouse in the background, with residents using it',
      caption: 'The community pool and clubhouse, as planned.',
    },
    amenidades: {
      alt: 'Padel and pickleball courts among the trees, with neighbors playing and others sitting on the benches',
      caption: 'The courts, as planned. They are delivered according to the construction schedule below.',
    },
    urbanizacion: {
      alt: 'Real aerial view of the site: the roads and the marked-out lots, still unbuilt and without urban development',
      caption: 'The site today: roads laid out and lots marked out, undeveloped and unbuilt.',
    },
    alberca: {
      alt: 'Pool with loungers under umbrellas and a palapa with grills in the background, with residents in the water',
      caption: 'The community pool, as planned.',
    },
    casaClub: {
      alt: 'Exterior of the clubhouse at dusk, with the dining room lit up behind the windows and a tropical garden in front',
      caption: 'The clubhouse, as planned.',
    },
    casaClubComedor: {
      alt: 'Covered dining room of the clubhouse next to the pool, with long wooden tables and a terracotta stucco wall',
      caption: 'The clubhouse dining room, as planned.',
    },
    gimnasio: {
      alt: 'Single-story gym with stone walls and floor-to-ceiling windows, surrounded by vegetation, with equipment and bikes inside',
      caption: 'The gym, as planned.',
    },
    canchasCenital: {
      alt: 'Top-down view of the courts: two blue padel courts and a multi-use basketball court, separated by tree-lined medians',
      caption: 'The courts seen from above, as planned.',
    },
    andador: {
      alt: 'Concrete pedestrian walkway in the shade of mature trees, with the courts and a planter in the background',
      caption: 'The walkways and trees, as planned.',
    },
    cine: {
      alt: 'Outdoor cinema under the trees: a large screen showing a game and wooden picnic tables with neighbors sitting',
      caption: 'The outdoor cinema, as planned.',
    },
    casasCenital: {
      alt: 'Top-down view of already-built lots: two-story homes with a private pool and a wooden deck in the backyard, among tree-lined streets',
      caption:
        "Already-built lots, in the developer's project. The house is not included: what you are buying is the land.",
    },
  },
  figura: { render: "Developer's render.", foto: 'Real photograph.' },

  estructura: {
    rotulo: 'The full payment',
    tramos: {
      enganche: 'Down payment',
      mensualidades: 'Monthly payments',
      contraentrega: 'Due on delivery',
    },
    cuando: {
      enganche: 'Today. The lot is reserved in your name.',
      mensualidades: (si) =>
        si
          ? 'Month by month, interest-free and directly with the developer.'
          : 'Month by month, directly with the developer.',
      contraentrega: 'When the lot is delivered.',
    },
    nota: "Calculated on the payment schedule and list price declared by the developer.",
  },

  tramos: {
    selectorRotulo: 'The rest, over',
    selectorAria: 'Monthly payment term',
    meses: (n) => `${n} months`,
    proporcionAria: (p) =>
      `Share of the price: ${p.enganchePct}% down payment, ${p.mensualidadesPct}% in monthly payments and ${p.contraentregaPct}% due on delivery`,
    precioLista: (precio) => `On a list price of ${precio}.`,
    sinDato: 'We break it down in the plan.',
    pagos: (n) => `× ${n} payments`,
    enganche: {
      titulo: 'Down payment',
      pie: 'A single payment. With this, the lot is reserved in your name.',
    },
    mensualidades: {
      titulo: 'Monthly payments',
      pie: (pagos, si) =>
        `${pagos} monthly payments${
          si ? ', interest-free' : ''
        }. Directly with the developer: no bank, no credit check and no proof of income.`,
    },
    contraentrega: {
      titulo: 'Due on delivery',
      pie: 'The last payment, when the lot is delivered to you. It is shown here and not in the fine print because it is a big payment and you need to plan for it.',
    },
  },

  form: {
    tiempoRespuesta: 'the same business day',
    titulo: 'Get the full *payment plan*',
    trae: (enganche) => [
      enganche ? `Down payment of ${enganche}` : 'The exact down payment',
      'The monthly payment for each term',
      'Final payment on delivery and closing costs',
    ],
    nombre: {
      label: 'Your name',
      placeholder: 'What should we call you?',
      error: 'Enter your name so we know what to call you.',
    },
    correo: {
      label: 'Your email',
      placeholder: 'you@email.com',
      ayuda: 'That is where the payment plan PDF goes.',
      vacio: 'We need your email to send you the plan as a PDF.',
      invalido: 'Check the email: it looks like something is missing.',
    },
    telefono: {
      labelLada: 'Your phone or WhatsApp',
      labelSimple: 'Your WhatsApp',
      placeholder: '555 123 4567',
      ayudaLada: 'Choose your country and enter your number. That is where we send the plan.',
      ayudaSimple: '10 digits. That is where we send the plan.',
      vacioLada: 'We need your phone number to send you the plan.',
      invalidoLada: 'Check the number: choose your country and enter the full number.',
      vacioSimple: 'We need your WhatsApp number to send you the plan.',
      faltan: (d) => `${d} of 10 digits so far.`,
    },
    diagnostico: {
      rotulo: 'Three taps and we come back with an option',
      intro:
        'With this, the advisor writes to you with the lot and plan that fit your case, not the whole catalog. None of this is a commitment.',
      uso: {
        pregunta: 'What do you want it for?',
        error: 'Choose what you want it for.',
        opciones: {
          plusvalia: { etiqueta: 'Appreciation', ayuda: 'Buy today and sell when it goes up' },
          rentas: { etiqueta: 'Rentals', ayuda: 'Airbnb or long-term rental' },
          construir: { etiqueta: 'Build my home', ayuda: 'To live in or as a vacation home' },
          explorando: { etiqueta: "I'm still exploring", ayuda: 'Still comparing options' },
        },
      },
      enganche: {
        pregunta: 'How much can you put down?',
        nota: 'In thousands of Mexican pesos (MXN). Approximate.',
        error: 'Choose a range. It is approximate, not a commitment.',
        opciones: {
          hasta150: 'Up to 150K',
          r150a300: '150K to 300K',
          r300a600: '300K to 600K',
          mas600: 'Over 600K',
        },
      },
      zona: {
        pregunta: 'Where are you interested in?',
        error: 'Choose an area or mark that you are open to any.',
        opciones: {
          pdc: 'Playa del Carmen',
          tulum: 'Tulum',
          puertoAventuras: 'Puerto Aventuras',
          abierto: 'Open to the best option',
        },
      },
    },
    plazo: {
      legend: 'Term used to calculate the monthly payments',
      pregunta: 'Over how many months should we calculate it?',
      aclaracion: 'You can change it later.',
      meses: (n) => `${n} months`,
    },
    enviando: 'Sending…',
    boton: 'Get the payment plan',
    errorEnvio: 'We could not send it. Try again or message us on WhatsApp.',
    nota: (t) =>
      `An advisor messages you on WhatsApp ${t}. No automated calls and we do not share your number with third parties.`,
    gracias: {
      rotulo: 'Request received',
      saludo: (nombre) => `All set, ${nombre}.`,
      cuerpo: (t, plazo, diagnostico) =>
        `We will message you on WhatsApp ${t} with the full plan${
          plazo ? ` for ${plazo} months` : ''
        }: down payment, monthly payment, final payment on delivery and what the deed covers. A real person, not a bot.${
          diagnostico
            ? ' And with the option that fits what you told us, not the whole catalog.'
            : ''
        }`,
    },
  },
};

export const COPY: Record<LocaleLp, CopyEnganche> = {
  es: COPY_ES,
  en: COPY_EN,
};

/**
 * Devuelve la imagen con el alt y el pie del idioma pedido. En español (o si la
 * clave no tiene traducción) devuelve la imagen del registro sin tocar.
 */
export function localizarImagen(
  locale: LocaleLp,
  clave: ClaveImagen,
  imagen: ImagenLanding,
): ImagenLanding {
  const o = COPY[locale].imagenes?.[clave];
  return o ? { ...imagen, alt: o.alt, caption: o.caption } : imagen;
}
