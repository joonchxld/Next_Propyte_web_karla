import type { CopyForm } from '../_components/v2/FormInventario';
import type { LocaleLp } from '../_components/v2/i18n';
import type { LeadSource } from '@/lib/zoho/field-maps';

// ============================================================
// Copy de la landing de departamentos en la Riviera Maya, en los dos idiomas
// que sirve. La variante inglesa (`/lp/condos-riviera-maya`) es la MISMA página
// con otro diccionario; los dos idiomas deben tener todas las claves (el tipo
// `CopyDeptos` lo obliga).
//
// Las cadenas con interpolación del formulario usan marcadores `{total}` que
// resuelve el componente. El resto de las interpolaciones son funciones.
//
// NO se convierten precios: cada monto se publica en su moneda (MXN o USD) tal
// como lo declara el desarrollador. Los rangos de presupuesto del formulario
// van en pesos, con el código de moneda impreso.
// ============================================================

/** «Tulum, Playa del Carmen y Puerto Morelos». */
function listaEs(partes: string[]): string {
  if (partes.length <= 1) return partes[0] ?? '';
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;
}

/** «Tulum, Playa del Carmen, and Puerto Morelos». */
function listaEn(partes: string[]): string {
  if (partes.length <= 1) return partes[0] ?? '';
  if (partes.length === 2) return `${partes[0]} and ${partes[1]}`;
  return `${partes.slice(0, -1).join(', ')}, and ${partes[partes.length - 1]}`;
}

export interface CopyDeptos {
  /** Fuente de lead (Zoho) y prefijo de las superficies de WhatsApp. */
  fuente: LeadSource;
  meta: { title: string; description: string };
  form: CopyForm;
  pieAviso: string;
  /** Frase del pie con el rango del inventario (montos ya formateados). */
  pieInventario: (total: number, desde: string, hasta: string) => string;
  vacio: { titulo: string; cuerpo: string; cta: string };
  hero: {
    tituloLinea1: string;
    tituloLinea2: string;
    /** `desde` ya viene formateado; `enganche` es el porcentaje mínimo. */
    subtitulo: (ciudades: string[], desde: string | null, enganche: number | null) => string;
    badgesAria: string;
    badgeInmediata: string;
    badgePreventa: string;
    badgeAmueblados: string;
    badgeDescuento: string;
    unidades: [string, string];
    desarrollos: [string, string];
    /** Une «N unidades» con «de N desarrollos». */
    unidadesDe: string;
    unidadesRemate: string;
    cta: string;
  };
  portada: {
    todasCiudades: string;
    ciudadesAria: string;
    ningunoEnPresupuesto: string;
  };
  /** `undefined` deja la etiqueta por defecto del kit en ese idioma. */
  filtroCiudad: string | undefined;
  departamento: [string, string];
  catalogo: {
    ninguno: string;
    coincidenSing: string;
    coincidenPlural: string;
    coincidenResto: string;
    quitarFiltros: string;
    cierreUno: string;
    cierreVarios: (n: number) => string;
    cierreTodos: (n: number) => string;
    sinResultadosTitulo: string;
    sinResultadosCuerpo: string;
  };
  riel: {
    desde: string;
    anteriores: (ciudad: string) => string;
    siguientes: (ciudad: string) => string;
    lista: (ciudad: string) => string;
    precioPorConfirmar: string;
    enganche: (pct: number) => string;
    enganchePorConfirmar: string;
    elegido: string;
    meInteresa: string;
  };
  specs: {
    aria: string;
    recamara: [string, string];
    bano: [string, string];
    construidos: string;
    vista: string;
    entrega: string;
    seEntrega: string;
  };
  faqTitulo: string;
}

export const COPY_ES: CopyDeptos = {
  fuente: 'lp_deptos_rm',
  meta: {
    title: 'Departamentos en la Riviera Maya con esquemas de pago a tu medida | Precios y enganche publicados',
    description:
      'Unidades seleccionadas en Tulum, Playa del Carmen y Puerto Morelos con precio cerrado, enganche declarado y disponibilidad. Dinos presupuesto y ciudad y recibe la lista de precios.',
  },
  form: {
    etiqueta: 'Los {total} departamentos, con sus números',
    titulo: 'Dinos qué buscas y te mandamos solo lo que encaja',
    cuerpo: 'Precio, enganche y disponibilidad por correo el mismo día hábil. Un asesor te escribe por WhatsApp.',
    coinciden: '{n} {n|departamento coincide|departamentos coinciden} con lo que elegiste.',
    nombre: 'Nombre',
    whatsapp: 'WhatsApp',
    email: 'Correo',
    propiedadLabel: 'Departamento de interés',
    verTodas: 'Quiero ver todos',
    presupuestoLabel: 'Presupuesto',
    presupuestos: ['Hasta $3.5 M MXN', '$3.5 M a $6 M MXN', 'Más de $6 M MXN', 'Todavía lo estoy definiendo'],
    enviar: 'Recibir la lista de precios',
    preferirWhatsApp: 'Prefiero preguntar por WhatsApp',
    exitoCuerpo:
      'Te enviamos a {email} los precios, el enganche y la disponibilidad de los {total} departamentos. Un asesor te escribe por WhatsApp el mismo día hábil.',
    exitoCta: 'Escribir ahora por WhatsApp',
    sinEspecifica: 'Riviera Maya (sin departamento específico)',
    whatsappGenerico:
      'Hola, vi los departamentos en venta en la Riviera Maya en su página. ¿Me pasan precios y disponibilidad?',
    whatsappPorPropiedad: 'Hola, me interesa este departamento: {titulo}. ¿Me pasan precio y disponibilidad?',
  },
  pieAviso:
    'Precios y disponibilidad vigentes al momento de la consulta y sujetos a confirmación con el desarrollador. Propyte no es la desarrolladora de estos inmuebles. Las imágenes las proporciona cada desarrollador y pueden incluir renders.',
  pieInventario: (total, desde, hasta) => `Inventario publicado: ${total} departamentos de ${desde} a ${hasta}.`,
  vacio: {
    titulo: 'Ahora mismo no tenemos departamentos publicados en la Riviera Maya.',
    cuerpo: 'Escríbenos y te avisamos en cuanto entre inventario, con los números completos.',
    cta: 'Avísenme por WhatsApp',
  },
  hero: {
    tituloLinea1: 'Departamentos en la Riviera Maya',
    tituloLinea2: 'con esquemas de pago a tu medida',
    subtitulo: (ciudades, desde, enganche) =>
      `Unidades seleccionadas en ${listaEs(ciudades)}${desde ? ` desde ${desde}` : ''}.${
        enganche !== null ? ` Enganches desde el ${enganche}%.` : ''
      }`,
    badgesAria: 'Lo que hay en el inventario',
    badgeInmediata: 'Entrega inmediata',
    badgePreventa: 'Preventa',
    badgeAmueblados: 'Amueblado o equipado',
    badgeDescuento: 'Con descuento vigente',
    unidades: ['unidad disponible', 'unidades disponibles'],
    desarrollos: ['desarrollo', 'desarrollos'],
    unidadesDe: ' de ',
    unidadesRemate: ', revisadas antes de publicar.',
    cta: 'Recibir la lista de precios',
  },
  portada: {
    todasCiudades: 'Todas las ciudades',
    ciudadesAria: 'Capítulos por ciudad',
    ningunoEnPresupuesto: 'ninguno en ese presupuesto',
  },
  filtroCiudad: 'Ciudad',
  departamento: ['departamento', 'departamentos'],
  catalogo: {
    ninguno: 'Ninguno coincide con todo lo que elegiste.',
    coincidenSing: 'departamento coincide',
    coincidenPlural: 'departamentos coinciden',
    coincidenResto: ' con lo que elegiste.',
    quitarFiltros: 'Quitar filtros',
    cierreUno: 'Te mandamos la información completa de ese.',
    cierreVarios: (n) => `Te mandamos la información completa de esos ${n}.`,
    cierreTodos: (n) => `Te mandamos la información completa de los ${n}.`,
    sinResultadosTitulo: 'Con ese presupuesto no hay nada publicado en esa ciudad.',
    sinResultadosCuerpo: 'Quita un filtro, o mándanos el formulario y te decimos qué hay cerca de lo que buscas.',
  },
  riel: {
    desde: ' · desde ',
    anteriores: (c) => `Anteriores en ${c}`,
    siguientes: (c) => `Siguientes en ${c}`,
    lista: (c) => `Departamentos en ${c}`,
    precioPorConfirmar: 'Precio por confirmar',
    enganche: (pct) => `Enganche ${pct}%`,
    enganchePorConfirmar: 'Enganche por confirmar',
    elegido: 'Elegido',
    meInteresa: 'Me interesa',
  },
  specs: {
    aria: 'Características',
    recamara: ['recámara', 'recámaras'],
    bano: ['baño', 'baños'],
    construidos: 'construidos',
    vista: 'vista',
    entrega: 'entrega',
    seEntrega: 'se entrega',
  },
  faqTitulo: 'Lo que preguntan antes de comprar',
};

export const COPY_EN: CopyDeptos = {
  fuente: 'lp_deptos_rm_en',
  meta: {
    title: 'Condos in the Riviera Maya with payment plans that fit | Prices and down payments listed',
    description:
      'Selected units in Tulum, Playa del Carmen and Puerto Morelos with firm prices, stated down payments and availability. Tell us your budget and city and get the price list.',
  },
  form: {
    etiqueta: 'All {total} condos, with the numbers',
    titulo: "Tell us what you're after and we'll send only what fits",
    cuerpo: 'Price, down payment and availability by email the same business day. An advisor will message you on WhatsApp.',
    coinciden: '{n} {n|condo matches|condos match} your choices.',
    nombre: 'Name',
    whatsapp: 'WhatsApp',
    email: 'Email',
    propiedadLabel: 'Condo of interest',
    verTodas: 'Show me all of them',
    presupuestoLabel: 'Budget',
    presupuestos: ['Up to $3.5M MXN', '$3.5M to $6M MXN', 'Over $6M MXN', "I'm still figuring it out"],
    enviar: 'Get the price list',
    preferirWhatsApp: 'I prefer to ask on WhatsApp',
    exitoCuerpo:
      "We've sent the prices, down payments and availability of all {total} condos to {email}. An advisor will message you on WhatsApp the same business day.",
    exitoCta: 'Message us on WhatsApp now',
    sinEspecifica: 'Riviera Maya (no specific condo)',
    whatsappGenerico:
      'Hi, I saw the condos for sale in the Riviera Maya on your page. Can you send me prices and availability?',
    whatsappPorPropiedad: "Hi, I'm interested in this condo: {titulo}. Can you send me the price and availability?",
  },
  pieAviso:
    'Prices and availability are current at the time of inquiry and subject to confirmation with the developer. Propyte is not the developer of these properties. Images are provided by each developer and may include renderings.',
  pieInventario: (total, desde, hasta) => `Listed inventory: ${total} condos from ${desde} to ${hasta}.`,
  vacio: {
    titulo: "We don't have any condos listed in the Riviera Maya right now.",
    cuerpo: "Message us and we'll let you know as soon as inventory comes in, with the full numbers.",
    cta: 'Notify me on WhatsApp',
  },
  hero: {
    tituloLinea1: 'Condos in the Riviera Maya',
    tituloLinea2: 'with payment plans that fit you',
    subtitulo: (ciudades, desde, enganche) =>
      `Selected units in ${listaEn(ciudades)}${desde ? ` from ${desde}` : ''}.${
        enganche !== null ? ` Down payments from ${enganche}%.` : ''
      }`,
    badgesAria: "What's in the inventory",
    badgeInmediata: 'Move-in ready',
    badgePreventa: 'Pre-construction',
    badgeAmueblados: 'Furnished or equipped',
    badgeDescuento: 'Current discount',
    unidades: ['unit available', 'units available'],
    desarrollos: ['development', 'developments'],
    unidadesDe: ' from ',
    unidadesRemate: ', each reviewed before listing.',
    cta: 'Get the price list',
  },
  portada: {
    todasCiudades: 'All cities',
    ciudadesAria: 'Browse by city',
    ningunoEnPresupuesto: 'none in that budget',
  },
  filtroCiudad: undefined,
  departamento: ['condo', 'condos'],
  catalogo: {
    ninguno: 'None match everything you picked.',
    coincidenSing: 'condo matches',
    coincidenPlural: 'condos match',
    coincidenResto: ' your choices.',
    quitarFiltros: 'Clear filters',
    cierreUno: "We'll send you the full details on that condo.",
    cierreVarios: (n) => `We'll send you the full details on those ${n} condos.`,
    cierreTodos: (n) => `We'll send you the full details on all ${n} condos.`,
    sinResultadosTitulo: 'Nothing is listed in that city at that budget.',
    sinResultadosCuerpo: "Remove a filter, or send us the form and we'll tell you what's close to what you're looking for.",
  },
  riel: {
    desde: ' · from ',
    anteriores: (c) => `Previous in ${c}`,
    siguientes: (c) => `Next in ${c}`,
    lista: (c) => `Condos in ${c}`,
    precioPorConfirmar: 'Price to be confirmed',
    enganche: (pct) => `${pct}% down payment`,
    enganchePorConfirmar: 'Down payment to be confirmed',
    elegido: 'Selected',
    meInteresa: "I'm interested",
  },
  specs: {
    aria: 'Features',
    recamara: ['bedroom', 'bedrooms'],
    bano: ['bathroom', 'bathrooms'],
    construidos: 'built',
    vista: 'view',
    entrega: 'delivery',
    seEntrega: 'completion',
  },
  faqTitulo: 'What people ask before buying',
};

export const COPY: Record<LocaleLp, CopyDeptos> = { es: COPY_ES, en: COPY_EN };
