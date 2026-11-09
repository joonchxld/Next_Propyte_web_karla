import type { CopyForm } from '../_components/v2/FormInventario';
import type { LocaleLp } from '../_components/v2/i18n';

// Copy de la landing de casas en Playa del Carmen, en los dos idiomas que sirve
// (`/lp/casas-playa-del-carmen` y `/lp/homes-playa-del-carmen`). Es la MISMA
// página con otro diccionario: el árbol de componentes no se duplica.
//
// `catalogo` y `form` son cadenas planas porque cruzan a un componente cliente
// (una función no cruza la frontera servidor→cliente); lo que interpola usa
// marcadores `{pct}`, `{titulo}` que resuelve el componente. El resto lo
// consume solo la página (servidor) y puede llevar funciones.
//
// Los precios NO se convierten: cada uno sale en su moneda (MXN o USD) con el
// código impreso, también en inglés.

/** Copy que llega al catálogo (componente cliente): solo cadenas planas. */
export interface CopyCatalogoPdc {
  todas: string;
  /** Contador de casas visibles: [singular, plural]. */
  casa: [string, string];
  quitarFiltros: string;
  sinCoincidencias: string;
  verTodas: string;
  /** Sufijo de recámaras en la ficha: [singular, plural]. */
  rec: [string, string];
  bano: [string, string];
  alberca: string;
  /** Admite `{pct}`. */
  enganche: string;
  precioPorConfirmar: string;
  elegida: string;
  quieroEsta: string;
  /** Admite `{titulo}`. */
  ariaQuieroEsta: string;
}

export interface CopyPdc {
  meta: { title: string; description: string };
  form: CopyForm;
  pieAviso: string;
  /** Etiqueta del filtro de zona (la default del kit es «Ubicación»/«Location»). */
  filtroZona: string;
  catalogo: CopyCatalogoPdc;
  vacio: { titulo: string; cuerpo: string; cta: string };
  hero: {
    titulo: string;
    ganchoInmediata: string;
    ganchoBase: string;
    entregaInmediata: (n: number) => string;
    publicadasHoy: (n: number) => string;
    engancheDesde: (pct: number) => string;
    desde: (precio: string) => string;
    cta: string;
    zonasAria: string;
  };
  cifras: {
    publicadas: string;
    entrada: (moneda: string) => string;
    alta: (moneda: string) => string;
    enganche: string;
  };
  faqTitulo: string;
  /** Línea del pie con el rango del inventario. */
  inventario: (total: number, desde: string, hasta: string) => string;
  barraEtiqueta: string;
}

export const COPY_ES: CopyPdc = {
  meta: {
    title: 'Casas en venta en Playa del Carmen | Precios y enganche publicados',
    description:
      'Casas publicadas hoy en Playa del Carmen con precio cerrado, enganche y disponibilidad. Filtra por zona y recibe la ficha completa por correo.',
  },
  form: {
    etiqueta: 'Las {total} casas, con sus números',
    titulo: 'Dinos qué buscas y te mandamos solo las que encajan',
    cuerpo: 'Zona, presupuesto y recámaras acotan la lista. Llega por correo el mismo día y un asesor te escribe por WhatsApp.',
    nombre: 'Nombre',
    whatsapp: 'WhatsApp',
    email: 'Correo',
    propiedadLabel: 'Casa de interés',
    verTodas: 'Quiero ver todas',
    presupuestoLabel: 'Presupuesto',
    presupuestos: ['Hasta $6 M MXN', '$6 M a $11 M MXN', 'Más de $11 M MXN', 'Todavía lo estoy definiendo'],
    enviar: 'Recibir la información',
    preferirWhatsApp: 'Prefiero preguntar por WhatsApp',
    exitoCuerpo:
      'Te enviamos a {email} los precios, el enganche y la disponibilidad de las {total} casas. Un asesor te escribe por WhatsApp el mismo día hábil.',
    exitoCta: 'Escribir ahora por WhatsApp',
    sinEspecifica: 'Playa del Carmen (sin casa específica)',
    whatsappGenerico: 'Hola, vi las casas en venta en Playa del Carmen en su página. ¿Me pasan precios y disponibilidad?',
    whatsappPorPropiedad: 'Hola, me interesa esta casa: {titulo}. ¿Me pasan precio y disponibilidad?',
    coinciden: '{n} {n|casa coincide|casas coinciden} con lo que elegiste.',
  },
  pieAviso:
    'Precios y disponibilidad vigentes al momento de la consulta y sujetos a confirmación con el desarrollador. Propyte no es la desarrolladora de estos inmuebles. Las imágenes las proporciona cada desarrollador y pueden incluir renders.',
  filtroZona: 'Zona',
  catalogo: {
    todas: 'Todas',
    casa: ['casa', 'casas'],
    quitarFiltros: 'Quitar filtros',
    sinCoincidencias:
      'Ninguna casa publicada cumple todo lo que elegiste. Quita un filtro o pide la información y te decimos qué hay cerca.',
    verTodas: 'Ver todas las casas',
    rec: ['rec', 'rec'],
    bano: ['baño', 'baños'],
    alberca: 'Alberca',
    enganche: 'Enganche {pct}%',
    precioPorConfirmar: 'Precio por confirmar',
    elegida: 'Elegida',
    quieroEsta: 'Quiero esta casa',
    ariaQuieroEsta: 'Quiero esta casa: {titulo}',
  },
  vacio: {
    titulo: 'Ahora mismo no tenemos casas publicadas en Playa del Carmen.',
    cuerpo: 'Escríbenos y te avisamos en cuanto entre inventario, con los números completos.',
    cta: 'Avísenme por WhatsApp',
  },
  hero: {
    titulo: 'Casas en Playa del Carmen',
    ganchoInmediata: 'Listas para entregar.',
    ganchoBase: 'Con precio y enganche publicados.',
    entregaInmediata: (n) => `${n} con entrega inmediata`,
    publicadasHoy: (n) => `${n} publicadas hoy`,
    engancheDesde: (pct) => `enganche desde ${pct}%`,
    desde: (precio) => `desde ${precio}`,
    cta: 'Recibir precios y enganche',
    zonasAria: 'Ver casas por zona',
  },
  cifras: {
    publicadas: 'casas publicadas hoy',
    entrada: (moneda) => `precio de entrada, ${moneda}`,
    alta: (moneda) => `la más alta, ${moneda}`,
    enganche: 'enganche más bajo',
  },
  faqTitulo: 'Lo que preguntan antes de comprar',
  inventario: (total, desde, hasta) => `Inventario publicado: ${total} casas de ${desde} a ${hasta}.`,
  barraEtiqueta: 'Recibir precios y enganche',
};

export const COPY_EN: CopyPdc = {
  meta: {
    title: 'Homes for Sale in Playa del Carmen | Prices and Down Payments Listed',
    description:
      'Homes listed today in Playa del Carmen with firm prices, down payment and availability. Filter by area and get the full details by email.',
  },
  form: {
    etiqueta: 'All {total} homes, with the numbers',
    titulo: "Tell us what you're looking for and we'll send only the homes that fit",
    cuerpo:
      'Area, budget and bedrooms narrow the list. It reaches your inbox the same day, and an advisor will message you on WhatsApp.',
    nombre: 'Name',
    whatsapp: 'WhatsApp',
    email: 'Email',
    propiedadLabel: 'Home of interest',
    verTodas: 'I want to see them all',
    presupuestoLabel: 'Budget',
    presupuestos: ['Up to $6 M MXN', '$6 M to $11 M MXN', 'Over $11 M MXN', "I'm still deciding"],
    enviar: 'Get the details',
    preferirWhatsApp: "I'd rather ask on WhatsApp",
    exitoCuerpo:
      'We sent the prices, down payments and availability for all {total} homes to {email}. An advisor will message you on WhatsApp the same business day.',
    exitoCta: 'Message us on WhatsApp now',
    sinEspecifica: 'Playa del Carmen (no specific home)',
    whatsappGenerico: 'Hi, I saw the homes for sale in Playa del Carmen on your website. Can you send me prices and availability?',
    whatsappPorPropiedad: "Hi, I'm interested in this home: {titulo}. Can you send me the price and availability?",
    coinciden: '{n} {n|home matches|homes match} what you selected.',
  },
  pieAviso:
    'Prices and availability are current as of the time of inquiry and subject to confirmation with the developer. Propyte is not the developer of these properties. Images are provided by each developer and may include renderings.',
  filtroZona: 'Area',
  catalogo: {
    todas: 'All',
    casa: ['home', 'homes'],
    quitarFiltros: 'Clear filters',
    sinCoincidencias:
      "No listed home matches everything you selected. Clear a filter, or request the details and we'll tell you what's nearby.",
    verTodas: 'See all homes',
    rec: ['bed', 'beds'],
    bano: ['bath', 'baths'],
    alberca: 'Pool',
    enganche: '{pct}% down',
    precioPorConfirmar: 'Price to be confirmed',
    elegida: 'Selected',
    quieroEsta: 'I want this home',
    ariaQuieroEsta: 'I want this home: {titulo}',
  },
  vacio: {
    titulo: "We don't have homes listed in Playa del Carmen right now.",
    cuerpo: "Message us and we'll let you know as soon as new inventory comes in, with the full numbers.",
    cta: 'Notify me on WhatsApp',
  },
  hero: {
    titulo: 'Homes in Playa del Carmen',
    ganchoInmediata: 'Move-in ready.',
    ganchoBase: 'Prices and down payments listed.',
    entregaInmediata: (n) => `${n} move-in ready`,
    publicadasHoy: (n) => `${n} listed today`,
    engancheDesde: (pct) => `down payment from ${pct}%`,
    desde: (precio) => `from ${precio}`,
    cta: 'Get prices and down payments',
    zonasAria: 'Browse homes by area',
  },
  cifras: {
    publicadas: 'homes listed today',
    entrada: (moneda) => `entry price, ${moneda}`,
    alta: (moneda) => `highest price, ${moneda}`,
    enganche: 'lowest down payment',
  },
  faqTitulo: 'What buyers ask before purchasing',
  inventario: (total, desde, hasta) =>
    `Listed inventory: ${total} ${total === 1 ? 'home' : 'homes'} from ${desde} to ${hasta}.`,
  barraEtiqueta: 'Get prices and down payments',
};

export const COPY: Record<LocaleLp, CopyPdc> = { es: COPY_ES, en: COPY_EN };
