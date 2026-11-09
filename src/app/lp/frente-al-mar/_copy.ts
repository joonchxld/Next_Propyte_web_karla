import type { CopyForm } from '../_components/v2/FormInventario';
import type { Faq } from '../_components/v2/FaqAcordeon';
import { FAQ_COMPRA_Y_FINANCIAMIENTO, FAQ_COMPRA_Y_FINANCIAMIENTO_EN } from '../_components/v2/faqs';
import type { LocaleLp } from '../_components/v2/i18n';
import type { LeadSource } from '@/lib/zoho/field-maps';

// ============================================================
// Copy de la landing «frente al mar», en los dos idiomas que sirve
// (`/lp/frente-al-mar` y `/lp/beachfront-riviera-maya`).
//
// Misma página, otro diccionario: `Record<LocaleLp, CopyFrenteMar>` obliga a
// que cada clave exista en los dos idiomas. `{total}` y `{email}` los resuelve
// el formulario.
//
// Lo que NO se traduce: precios (su moneda de venta), ciudades, estados,
// zonas, títulos de cada propiedad y el texto de entrega (`tipo_entrega`) que
// declara el Hub.
// ============================================================

/** «Quintana Roo y Yucatán». */
function unirEs(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

function unirEn(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export interface CopyFrenteMar {
  /** Fuente del lead y de cada `form_type` de la página. */
  source: LeadSource;
  surfaceBarra: string;

  meta: { title: string; description: string };
  form: CopyForm;

  /** Etiqueta del filtro de ciudad (el kit usa «Ubicación» por defecto). */
  filtroCiudad: string;

  vacio: { titulo: string; cuerpo: string; cta: string };

  portada: {
    /** Ancho máximo del h1 (clase de Tailwind): la palabra más larga cambia con el idioma. */
    anchoTitulo: string;
    titulo: string;
    /** `ciudades` y `estados` ya vienen del dato; `desde` ya formateado o null. */
    subtitulo: (datos: { total: number; ciudades: string[]; estados: string[]; desde: string | null }) => string;
    verTodas: (total: number) => string;
    ariaCiudad: string;
  };

  preguntas: { titulo: string; faqs: Faq[] };
  pie: { aviso: string; inventario: (total: number, desde: string, hasta: string) => string };
  barra: string;

  /** Texto de la vista tal como la declara el Hub. */
  vista: Record<string, string>;

  catalogo: {
    sinCoincidenciasAria: string;
    sinCoincidenciasTitulo: (total: number) => string;
    sinCoincidenciasCuerpo: string;
    quitarFiltros: string;
    pedirInformacion: string;
    contador: (i: number, total: number, hayFiltros: boolean) => string;
    precioPorConfirmar: string;
    enganche: (pct: number | null) => string;
    elegida: string;
    meInteresa: string;
    cierreTitulo: string;
    cierreCuerpo: string;
    cifras: {
      recamaras: (n: number) => string;
      banos: (n: number) => string;
      construidos: string;
      vistaDeclarada: string;
      inmediata: string;
      entrega: string;
      preventa: string;
    };
  };

  indice: { aria: string };
}

const COPY_ES: CopyFrenteMar = {
  source: 'lp_frente_mar',
  surfaceBarra: 'lp_frente_mar_barra_movil',

  meta: {
    title: 'Propiedades frente al mar en el sur de México | Precios publicados',
    description:
      'Villas y departamentos con vista al mar en Quintana Roo y Yucatán, con precio cerrado, enganche y disponibilidad. Una propiedad por pantalla; recibe la ficha completa por correo.',
  },

  form: {
    etiqueta: 'Las {total} {total|propiedad|propiedades}, con sus números',
    titulo: 'Precio, enganche y disponibilidad de las que encajan contigo',
    cuerpo:
      'Elige ciudad, presupuesto y recámaras si quieres acotar. Llega por correo el mismo día y un asesor te escribe por WhatsApp.',
    nombre: 'Nombre',
    whatsapp: 'WhatsApp',
    email: 'Correo',
    propiedadLabel: 'Propiedad de interés',
    verTodas: 'Quiero ver todas',
    presupuestoLabel: 'Presupuesto',
    presupuestos: ['Hasta $6 M MXN', '$6 M a $12 M MXN', 'Más de $12 M MXN', 'Todavía lo estoy definiendo'],
    enviar: 'Recibir la información',
    preferirWhatsApp: 'Prefiero preguntar por WhatsApp',
    exitoCuerpo:
      'Te enviamos a {email} los precios, el enganche y la disponibilidad de {total|la propiedad|las {total} propiedades}. Un asesor te escribe por WhatsApp el mismo día hábil.',
    exitoCta: 'Escribir ahora por WhatsApp',
    sinEspecifica: 'Frente al mar (sin propiedad específica)',
    whatsappGenerico: 'Hola, vi las propiedades frente al mar en su página. ¿Me pasan precios y disponibilidad?',
    whatsappPorPropiedad: 'Hola, me interesa esta propiedad: {titulo}. ¿Me pasan precio y disponibilidad?',
    coinciden: '{n} {n|propiedad coincide|propiedades coinciden} con lo que elegiste. Las ves arriba, una por pantalla.',
  },

  filtroCiudad: 'Ciudad',

  vacio: {
    titulo: 'Ahora mismo no tenemos propiedades frente al mar publicadas.',
    cuerpo: 'Escríbenos y te avisamos en cuanto entre inventario, con los números completos.',
    cta: 'Avísenme por WhatsApp',
  },

  portada: {
    anchoTitulo: 'max-w-[9ch]',
    titulo: 'Tu propiedad frente al mar',
    subtitulo: ({ total, ciudades, estados, desde }) => {
      // «la costa» si el Hub no declara estado.
      const nombreEstados = estados.length === 0 ? 'la costa' : unirEs(estados);
      return `${total} ${total === 1 ? 'propiedad con vista al mar' : 'propiedades con vista al mar'} en ${
        ciudades.length === 1 ? ciudades[0] : `${ciudades.length} ciudades de ${nombreEstados}`
      }${desde ? `, desde ${desde}` : ''}. Elige dónde y la ves en una pantalla.`;
    },
    verTodas: (total) => (total === 1 ? 'Verla' : `Ver las ${total}`),
    ariaCiudad: 'Elegir ciudad',
  },

  preguntas: { titulo: 'Lo que preguntan antes de comprar', faqs: FAQ_COMPRA_Y_FINANCIAMIENTO },

  pie: {
    aviso:
      'Precios y disponibilidad vigentes al momento de la consulta y sujetos a confirmación con el desarrollador. Propyte no es la desarrolladora de estos inmuebles. Las imágenes las proporciona cada desarrollador y pueden incluir renders. La vista al mar es la declarada por el desarrollador para cada unidad.',
    inventario: (total, desde, hasta) => `Inventario publicado: ${total} propiedades de ${desde} a ${hasta}.`,
  },

  barra: 'Recibir la información',

  vista: {
    Mar: 'Frente al mar',
    'Mar lateral': 'Vista lateral al mar',
  },

  catalogo: {
    sinCoincidenciasAria: 'Sin coincidencias',
    sinCoincidenciasTitulo: (total) => `Ninguna de las ${total} cumple todo lo que elegiste.`,
    sinCoincidenciasCuerpo:
      'Quita un filtro para ver qué hay cerca, o pide la información y te decimos qué se acerca a lo que buscas.',
    quitarFiltros: 'Quitar los filtros',
    pedirInformacion: 'Pedir la información',
    contador: (i, total, hayFiltros) => `${i} de ${total}${hayFiltros ? ' que coinciden' : ''}`,
    precioPorConfirmar: 'Precio por confirmar',
    enganche: (pct) => (pct ? `Enganche ${pct}%` : 'Enganche por confirmar con el desarrollador'),
    elegida: 'Elegida',
    meInteresa: 'Me interesa',
    cierreTitulo: 'Dinos qué buscas y te mandamos solo lo que encaja.',
    cierreCuerpo:
      'Ciudad, presupuesto y recámaras. Recibes precio cerrado en su moneda de venta, enganche y esquema de cada desarrollador, qué incluye la entrega y cuáles siguen disponibles hoy.',
    cifras: {
      recamaras: (n) => (n === 1 ? 'recámara' : 'recámaras'),
      banos: (n) => (n === 1 ? 'baño' : 'baños'),
      construidos: 'construidos',
      vistaDeclarada: 'vista declarada',
      inmediata: 'Inmediata',
      entrega: 'entrega',
      preventa: 'Preventa',
    },
  },

  indice: { aria: 'Ir a una ciudad' },
};

// Inglés (9-nov-2026): tráfico pagado de Estados Unidos y Canadá. Mismas
// afirmaciones que el español: la vista es «la declarada por el desarrollador»
// y no se añaden cifras ni garantías.
const COPY_EN: CopyFrenteMar = {
  source: 'lp_frente_mar_en',
  surfaceBarra: 'lp_frente_mar_en_barra_movil',

  meta: {
    title: 'Beachfront Property in Southern Mexico | Published Prices',
    description:
      'Villas and condos with ocean views in Quintana Roo and Yucatán, with fixed prices, down payments and availability. One property per screen; get the full details by email.',
  },

  form: {
    etiqueta: 'All {total} {total|property|properties}, with the numbers',
    titulo: 'Price, down payment and availability for the ones that fit you',
    cuerpo:
      'Pick a city, budget and bedrooms if you want to narrow it down. It lands in your inbox the same day, and an advisor messages you on WhatsApp.',
    nombre: 'Name',
    whatsapp: 'WhatsApp',
    email: 'Email',
    propiedadLabel: 'Property you are interested in',
    verTodas: 'I want to see them all',
    presupuestoLabel: 'Budget',
    presupuestos: ['Up to $6 M MXN', '$6 M to $12 M MXN', 'Over $12 M MXN', 'Still deciding'],
    enviar: 'Get the details',
    preferirWhatsApp: 'I would rather ask on WhatsApp',
    // Sin llaves anidadas: `rellenar` del formulario no las resuelve.
    exitoCuerpo:
      'We sent the prices, down payment and availability for {total|the property|all the properties} to {email}. An advisor will message you on WhatsApp the same business day.',
    exitoCta: 'Message us on WhatsApp now',
    sinEspecifica: 'Beachfront (no specific property)',
    whatsappGenerico: 'Hi, I saw the beachfront properties on your website. Could you send me prices and availability?',
    whatsappPorPropiedad: 'Hi, I am interested in this property: {titulo}. Could you send me the price and availability?',
    coinciden: '{n} {n|property matches|properties match} what you picked. You can see them above, one per screen.',
  },

  filtroCiudad: 'City',

  vacio: {
    titulo: 'We have no beachfront properties listed right now.',
    cuerpo: 'Message us and we will let you know as soon as new inventory comes in, with the full numbers.',
    cta: 'Notify me on WhatsApp',
  },

  portada: {
    // «beachfront» mide 10 caracteres: con 9ch se saldría de la caja.
    anchoTitulo: 'max-w-[10ch]',
    titulo: 'Your beachfront property',
    subtitulo: ({ total, ciudades, estados, desde }) => {
      const nombreEstados = estados.length === 0 ? 'the coast' : unirEn(estados);
      return `${total} ${total === 1 ? 'property with ocean views' : 'properties with ocean views'} in ${
        ciudades.length === 1 ? ciudades[0] : `${ciudades.length} cities across ${nombreEstados}`
      }${desde ? `, from ${desde}` : ''}. Pick where, and see each one on its own screen.`;
    },
    verTodas: (total) => (total === 1 ? 'See it' : `See all ${total}`),
    ariaCiudad: 'Choose a city',
  },

  preguntas: { titulo: 'What buyers ask before they buy', faqs: FAQ_COMPRA_Y_FINANCIAMIENTO_EN },

  pie: {
    aviso:
      'Prices and availability are current at the time of inquiry and subject to confirmation with the developer. Propyte is not the developer of these properties. Images are provided by each developer and may include renderings. The ocean view is as stated by the developer for each unit.',
    inventario: (total, desde, hasta) =>
      `Listed inventory: ${total} ${total === 1 ? 'property' : 'properties'} from ${desde} to ${hasta}.`,
  },

  barra: 'Get the details',

  vista: {
    Mar: 'Beachfront',
    'Mar lateral': 'Side ocean view',
  },

  catalogo: {
    sinCoincidenciasAria: 'No matches',
    sinCoincidenciasTitulo: (total) => `None of the ${total} match everything you picked.`,
    sinCoincidenciasCuerpo:
      'Remove a filter to see what is close, or ask for the details and we will tell you what comes closest to what you are looking for.',
    quitarFiltros: 'Clear filters',
    pedirInformacion: 'Request the details',
    contador: (i, total, hayFiltros) => `${i} of ${total}${hayFiltros ? ' matching' : ''}`,
    precioPorConfirmar: 'Price to be confirmed',
    enganche: (pct) => (pct ? `${pct}% down payment` : 'Down payment to be confirmed with the developer'),
    elegida: 'Selected',
    meInteresa: "I'm interested",
    cierreTitulo: 'Tell us what you are after and we will send only what fits.',
    cierreCuerpo:
      'City, budget and bedrooms. You get the fixed price in its sale currency, the down payment and payment scheme from each developer, what delivery includes, and which ones are still available today.',
    cifras: {
      recamaras: (n) => (n === 1 ? 'bedroom' : 'bedrooms'),
      banos: (n) => (n === 1 ? 'bathroom' : 'bathrooms'),
      construidos: 'built',
      vistaDeclarada: 'developer-stated view',
      inmediata: 'Immediate',
      entrega: 'delivery',
      preventa: 'Pre-construction',
    },
  },

  indice: { aria: 'Jump to a city' },
};

export const COPY: Record<LocaleLp, CopyFrenteMar> = { es: COPY_ES, en: COPY_EN };
