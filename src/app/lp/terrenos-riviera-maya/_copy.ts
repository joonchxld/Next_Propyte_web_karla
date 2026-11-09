import type { CopyForm } from '../_components/v2/FormInventario';
import type { Faq } from '../_components/v2/FaqAcordeon';
import { FAQ_COMPRA_Y_FINANCIAMIENTO, FAQ_COMPRA_Y_FINANCIAMIENTO_EN } from '../_components/v2/faqs';
import type { LocaleLp } from '../_components/v2/i18n';
import type { LeadSource } from '@/lib/zoho/field-maps';

// ============================================================
// Copy de la landing de terrenos en la Riviera Maya, en los dos idiomas que
// sirve (`/lp/terrenos-riviera-maya` y `/lp/land-riviera-maya`).
//
// Es la MISMA página con otro diccionario: `Record<LocaleLp, CopyTerrenos>`
// obliga a que cada clave exista en los dos idiomas. Cadenas planas y
// funciones; lo que interpola el formulario usa marcadores `{total}`.
//
// Lo que NO se traduce: precios (siguen en su moneda y se formatean con
// `_components/format.ts`), nombres de ciudad, zona y desarrollo (vienen del
// Hub tal cual) y los títulos de cada lote.
// ============================================================

/** «Tulum, Playa del Carmen y Cancún». */
function unirEs(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

/** «Tulum, Playa del Carmen, and Cancún» (coma de serie, como se escribe en EE. UU.). */
function unirEn(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export interface CopyTerrenos {
  /** Fuente del lead y de cada `form_type` de la página. */
  source: LeadSource;
  surfaceBarra: string;

  meta: { title: string; description: string };
  form: CopyForm;

  vacio: { titulo: string; cuerpo: string; cta: string };

  hero: {
    titulo: string;
    desde: string;
    tituloLigero: string;
    /** Cada tramo entra solo si su dato existe. */
    subtitulo: (datos: { ciudades: string[]; engancheMinimoPct: number | null; mesesMax: number }) => string;
    datoLotes: (n: number) => string;
    datoDocumentacion: string;
    datoMensualidad: (desde: string) => string;
    datoPlazo: (meses: number) => string;
  };

  preguntas: { titulo: string; faqs: Faq[] };
  pie: { aviso: string; inventario: (total: number, desde: string, hasta: string) => string };
  barra: string;

  catalogo: {
    comercializadora: string;
    notaMensualidad: string;
    sinPlan: string;
    todos: string;
    conteo: (n: number) => string;
    sinResultados: string;
    cierreTitulo: string;
    fila: {
      superficiePorConfirmar: string;
      precioPorConfirmar: string;
      precioM2PorConfirmar: string;
      hastaMeses: (meses: number) => string;
      enganchePct: (pct: number) => string;
      plazo: string;
      plazoAria: string;
      meses: (m: number) => string;
      alMes: (meses: number) => string;
      engancheDe: (monto: string, pct: number) => string;
      engancheLinea: (pct: number, monto: string) => string;
      elegido: string;
      quieroEste: string;
    };
  };

  mapa: {
    aria: string;
    ubicacion: string;
    terrenosEnPunto: (n: number) => string;
    plazoNoDeclarado: string;
    hastaMeses: (meses: number) => string;
    meses: (m: number) => string;
    marcadorLotes: (n: number) => string;
    marcadorDesde: (precio: string) => string;
    meInteresa: string;
    elegido: string;
    sinFiltros: string;
    eligePunto: string;
    sinCoordenadas: (n: number) => string;
  };
}

const COPY_ES: CopyTerrenos = {
  source: 'lp_terrenos_rm',
  surfaceBarra: 'lp_terrenos_rm_barra_movil',

  meta: {
    title: 'Terrenos residenciales en la Riviera Maya | Precio por m² y plan de pagos',
    description:
      'Terrenos y lotes residenciales publicados hoy en Playa del Carmen, Tulum y Cancún con superficie, precio por metro cuadrado y plazos declarados. Recibe precio, plano y plan de pagos por correo.',
  },

  form: {
    etiqueta: 'Los {total} {total|terreno|terrenos}, con sus números',
    titulo: 'Precio, plano y plan de pagos de cada lote',
    cuerpo: 'Llega por correo el mismo día y un asesor te escribe por WhatsApp.',
    nombre: 'Nombre',
    whatsapp: 'WhatsApp',
    email: 'Correo',
    propiedadLabel: 'Terreno de interés',
    verTodas: 'Quiero ver todos',
    presupuestoLabel: 'Presupuesto',
    presupuestos: ['Hasta $1 M MXN', '$1 M a $2 M MXN', 'Más de $2 M MXN', 'Todavía lo estoy definiendo'],
    // El brief pedía «Descargar Master Plan y Lista de Precios 2026»; el
    // formulario no entrega un archivo (el lead llega a Zoho y el asesor manda
    // lo que exista), así que promete lo que de verdad pasa.
    enviar: 'Recibir lista de precios y planos',
    preferirWhatsApp: 'Prefiero preguntar por WhatsApp',
    exitoCuerpo:
      'Te enviamos a {email} el precio, el plano y el plan de pagos de {total|el terreno|los {total} terrenos}. Un asesor te escribe por WhatsApp el mismo día hábil.',
    exitoCta: 'Escribir ahora por WhatsApp',
    sinEspecifica: 'Riviera Maya (sin terreno específico)',
    whatsappGenerico:
      'Hola, vi los terrenos residenciales de la Riviera Maya en su página. ¿Me pasan precios, planos y plan de pagos?',
    whatsappPorPropiedad: 'Hola, me interesa este terreno: {titulo}. ¿Me pasan precio, plano y plan de pagos?',
    coinciden: '{n} {n|terreno coincide|terrenos coinciden} con lo que elegiste.',
  },

  vacio: {
    titulo: 'Ahora mismo no tenemos terrenos publicados en la Riviera Maya.',
    cuerpo: 'Escríbenos y te avisamos en cuanto entre inventario, con los números completos.',
    cta: 'Avísenme por WhatsApp',
  },

  hero: {
    titulo: 'Invierte en la Riviera Maya',
    desde: 'desde',
    tituloLigero: 'Lotes residenciales',
    // Nada de «listos para escriturar» ni «sin intereses», que el inventario
    // no respalda.
    subtitulo: ({ ciudades, engancheMinimoPct, mesesMax }) => {
      const frases: string[] = [];
      if (ciudades.length > 0) frases.push(`Terrenos en ${unirEs(ciudades)}.`);
      const plan: string[] = [];
      if (engancheMinimoPct) plan.push(`enganches desde el ${engancheMinimoPct}%`);
      if (mesesMax > 0) plan.push(`hasta ${mesesMax} meses`);
      if (plan.length > 0) frases.push(`Planes de financiamiento con ${plan.join(' y ')}.`);
      return frases.join(' ');
    },
    datoLotes: (n) => `${n} ${n === 1 ? 'lote disponible' : 'lotes disponibles'}`,
    datoDocumentacion: 'Documentación revisada antes de publicar',
    datoMensualidad: (desde) => `Mensualidades declaradas desde ${desde}`,
    datoPlazo: (meses) => `Planes hasta ${meses} meses`,
  },

  preguntas: {
    titulo: 'Lo que preguntan antes de comprar un terreno',
    faqs: FAQ_COMPRA_Y_FINANCIAMIENTO,
  },

  pie: {
    aviso:
      'Precios en pesos mexicanos, vigentes al momento de la consulta y sujetos a cambio y disponibilidad sin previo aviso. Las fechas de urbanización y escrituración son declaradas por cada desarrollador y no constituyen garantía. Propyte no es la desarrolladora de estos lotes. Las imágenes las proporciona cada desarrollador y pueden incluir renders.',
    inventario: (total, desde, hasta) => `Inventario publicado: ${total} terrenos de ${desde} a ${hasta}.`,
  },

  barra: 'Recibir lista de precios y planos',

  catalogo: {
    comercializadora:
      'Somos comercializadora, no desarrolladora: si ninguno encaja con tu presupuesto o tu superficie, dínoslo y te buscamos otro en la zona.',
    notaMensualidad:
      'Cifra orientativa sin intereses según el esquema declarado por el desarrollador; la tabla exacta te la mandamos por escrito.',
    sinPlan: 'Solo publicamos la mensualidad donde el desarrollador tiene el esquema declarado.',
    todos: 'Todos',
    conteo: (n) => `${n} ${n === 1 ? 'terreno' : 'terrenos'}`,
    sinResultados:
      'Ningún terreno cumple con todo lo que elegiste. Quita un filtro, o pide que te avisemos cuando entre uno así.',
    cierreTitulo: 'Te mandamos precio, plano y plan de pagos de cada lote.',
    fila: {
      superficiePorConfirmar: 'superficie por confirmar',
      precioPorConfirmar: 'Precio por confirmar',
      precioM2PorConfirmar: 'precio por m² por confirmar',
      hastaMeses: (meses) => `hasta ${meses} meses`,
      enganchePct: (pct) => `enganche ${pct}%`,
      plazo: 'Plazo',
      plazoAria: 'Plazo en meses',
      meses: (m) => `${m} meses`,
      alMes: (meses) => `al mes durante ${meses} meses`,
      engancheDe: (monto, pct) => `${monto} de enganche (${pct}%)`,
      engancheLinea: (pct, monto) => `Enganche ${pct}%, ${monto}`,
      elegido: 'Elegido',
      quieroEste: 'Quiero este terreno',
    },
  },

  mapa: {
    aria: 'Mapa de los terrenos',
    ubicacion: 'Ubicación',
    terrenosEnPunto: (n) => `${n} ${n === 1 ? 'terreno en este punto' : 'terrenos en este punto'}`,
    plazoNoDeclarado: 'plazo no declarado',
    hastaMeses: (meses) => `hasta ${meses} meses`,
    meses: (m) => `${m} meses`,
    marcadorLotes: (n) => `${n} ${n === 1 ? 'lote' : 'lotes'}`,
    marcadorDesde: (precio) => ` · desde ${precio}`,
    meInteresa: 'Me interesa',
    elegido: 'Elegido',
    sinFiltros: 'Ningún terreno cumple con los filtros elegidos.',
    eligePunto: 'Elige un punto del mapa para ver sus terrenos.',
    sinCoordenadas: (n) =>
      `${n} ${n === 1 ? 'terreno sin coordenadas publicadas aparece' : 'terrenos sin coordenadas publicadas aparecen'} solo en la lista.`,
  },
};

// Inglés (9-nov-2026): tráfico pagado de Estados Unidos y Canadá. Mismas
// afirmaciones que el español, sin cifras ni garantías nuevas: la revisión de
// documentos sigue planteada como proceso, nunca como promesa.
const COPY_EN: CopyTerrenos = {
  source: 'lp_terrenos_rm_en',
  surfaceBarra: 'lp_terrenos_rm_en_barra_movil',

  meta: {
    title: 'Residential Land in the Riviera Maya | Price per m² and Payment Plans',
    description:
      'Residential lots and land listed today in Playa del Carmen, Tulum and Cancún, with size, price per square meter and stated payment terms. Get the price, site plan and payment plan by email.',
  },

  form: {
    etiqueta: 'All {total} {total|lot|lots}, with the numbers',
    titulo: 'Price, site plan and payment plan for every lot',
    cuerpo: 'It lands in your inbox the same day, and an advisor messages you on WhatsApp.',
    nombre: 'Name',
    whatsapp: 'WhatsApp',
    email: 'Email',
    propiedadLabel: 'Lot you are interested in',
    verTodas: 'I want to see them all',
    presupuestoLabel: 'Budget',
    presupuestos: ['Up to $1 M MXN', '$1 M to $2 M MXN', 'Over $2 M MXN', 'Still deciding'],
    enviar: 'Get the price list and plans',
    preferirWhatsApp: 'I would rather ask on WhatsApp',
    // Sin llaves anidadas: `rellenar` del formulario no las resuelve.
    exitoCuerpo:
      'We sent the price, site plan and payment plan for {total|the lot|all the lots} to {email}. An advisor will message you on WhatsApp the same business day.',
    exitoCta: 'Message us on WhatsApp now',
    sinEspecifica: 'Riviera Maya (no specific lot)',
    whatsappGenerico:
      'Hi, I saw the residential lots in the Riviera Maya on your website. Could you send me prices, site plans and payment plans?',
    whatsappPorPropiedad:
      'Hi, I am interested in this lot: {titulo}. Could you send me the price, site plan and payment plan?',
    coinciden: '{n} {n|lot matches|lots match} what you picked.',
  },

  vacio: {
    titulo: 'We have no land listed in the Riviera Maya right now.',
    cuerpo: 'Message us and we will let you know as soon as new inventory comes in, with the full numbers.',
    cta: 'Notify me on WhatsApp',
  },

  hero: {
    titulo: 'Invest in the Riviera Maya',
    desde: 'from',
    tituloLigero: 'Residential lots',
    subtitulo: ({ ciudades, engancheMinimoPct, mesesMax }) => {
      const frases: string[] = [];
      if (ciudades.length > 0) frases.push(`Land in ${unirEn(ciudades)}.`);
      const plan: string[] = [];
      if (engancheMinimoPct) plan.push(`down payments from ${engancheMinimoPct}%`);
      if (mesesMax > 0) plan.push(`terms of up to ${mesesMax} months`);
      if (plan.length > 0) frases.push(`Financing plans with ${plan.join(' and ')}.`);
      return frases.join(' ');
    },
    datoLotes: (n) => `${n} ${n === 1 ? 'lot available' : 'lots available'}`,
    datoDocumentacion: 'Documents reviewed before we list',
    datoMensualidad: (desde) => `Developer-stated monthly payments from ${desde}`,
    datoPlazo: (meses) => `Plans up to ${meses} months`,
  },

  preguntas: {
    titulo: 'What buyers ask before buying land',
    faqs: FAQ_COMPRA_Y_FINANCIAMIENTO_EN,
  },

  pie: {
    aviso:
      'Prices are in Mexican pesos, current at the time of inquiry and subject to change and availability without notice. Urbanization and title-transfer dates are stated by each developer and are not a guarantee. Propyte is not the developer of these lots. Images are provided by each developer and may include renderings.',
    inventario: (total, desde, hasta) =>
      `Listed inventory: ${total} ${total === 1 ? 'lot' : 'lots'} from ${desde} to ${hasta}.`,
  },

  barra: 'Get the price list and plans',

  catalogo: {
    comercializadora:
      'We are a sales agency, not the developer: if none of these fits your budget or lot size, tell us and we will look for another one in the area.',
    notaMensualidad:
      'Estimate only, interest-free, based on the payment scheme stated by the developer; we will send you the exact schedule in writing.',
    sinPlan: 'We only show a monthly payment where the developer has stated a payment scheme.',
    todos: 'All',
    conteo: (n) => `${n} ${n === 1 ? 'lot' : 'lots'}`,
    sinResultados:
      'No lot matches everything you picked. Remove a filter, or ask us to let you know when one like that comes in.',
    cierreTitulo: 'We will send you the price, site plan and payment plan for every lot.',
    fila: {
      superficiePorConfirmar: 'size to be confirmed',
      precioPorConfirmar: 'Price to be confirmed',
      precioM2PorConfirmar: 'price per m² to be confirmed',
      hastaMeses: (meses) => `up to ${meses} months`,
      enganchePct: (pct) => `${pct}% down`,
      plazo: 'Term',
      plazoAria: 'Term in months',
      meses: (m) => `${m} months`,
      alMes: (meses) => `per month for ${meses} months`,
      engancheDe: (monto, pct) => `${monto} down payment (${pct}%)`,
      engancheLinea: (pct, monto) => `${pct}% down payment, ${monto}`,
      elegido: 'Selected',
      quieroEste: 'I want this lot',
    },
  },

  mapa: {
    aria: 'Map of the lots',
    ubicacion: 'Location',
    terrenosEnPunto: (n) => `${n} ${n === 1 ? 'lot at this spot' : 'lots at this spot'}`,
    plazoNoDeclarado: 'term not stated',
    hastaMeses: (meses) => `up to ${meses} months`,
    meses: (m) => `${m} months`,
    marcadorLotes: (n) => `${n} ${n === 1 ? 'lot' : 'lots'}`,
    marcadorDesde: (precio) => ` · from ${precio}`,
    meInteresa: "I'm interested",
    elegido: 'Selected',
    sinFiltros: 'No lot matches the filters you chose.',
    eligePunto: 'Pick a spot on the map to see its lots.',
    sinCoordenadas: (n) =>
      `${n} ${n === 1 ? 'lot without published coordinates appears' : 'lots without published coordinates appear'} in the list only.`,
  },
};

export const COPY: Record<LocaleLp, CopyTerrenos> = { es: COPY_ES, en: COPY_EN };
