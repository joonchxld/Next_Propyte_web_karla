import type { CopyForm } from '../_components/v2/FormInventario';
import type { LocaleLp } from '../_components/v2/i18n';

// Copy de la landing de casas en Mérida, en los dos idiomas que sirve
// (`/lp/casas-merida` y `/lp/homes-merida`). Es la MISMA página con otro
// diccionario: el árbol de componentes no se duplica.
//
// `catalogo` y `form` son cadenas planas porque cruzan a un componente cliente
// (una función no cruza la frontera servidor→cliente); lo que interpola usa
// marcadores `{precio}`, `{pct}`, `{n}`, `{ubicacion}`, `{zona}` que resuelve el
// componente. Lo demás lo consume solo la página (servidor).
//
// ═══ POR QUÉ EL INGLÉS NO LLEVA EL GANCHO DE CRÉDITO ═══
//
// Infonavit y Fovissste son créditos de vivienda del gobierno mexicano para
// trabajadores afiliados: un comprador de EE. UU. o Canadá no puede usarlos y
// ni siquiera sabe qué son. El titular y los chips del español dejan de tener
// sentido, así que en inglés (`mostrarCreditos: false`) la página abre con un
// titular neutro sobre casas en Mérida, Yucatán, y no construye el filtro de
// crédito ni pinta los sellos «Acepta Infonavit/Fovissste/crédito bancario».
// Se omite también «crédito bancario» a propósito: es la misma afirmación de
// financiamiento hipotecario local, que para un extranjero es otra conversación
// (y la responde la FAQ de financiamiento, no un sello en la ficha).
//
// Los precios NO se convierten: cada uno sale en su moneda con el código.

/** Copy que llega al catálogo (componente cliente): solo cadenas planas. */
export interface CopyCatalogoMerida {
  /** `false` en inglés: sin titular, chips ni sellos de crédito mexicano. */
  mostrarCreditos: boolean;
  tituloCredito: string;
  tituloBase: string;
  comoPagar: string;
  otras: string;
  unaCoincide: string;
  sinCoincidencias: string;
  quitarFiltros: string;
  otraOpcion: string;
  pedirOtra: string;
  /** Línea de apoyo bajo el titular. */
  desde: string; // `{precio}`
  enganche: string; // `{pct}`
  en: string; // `{zona}`
  unir: string; // «y» / «and»
  casaEnVenta: string; // `{ubicacion}`
  precioPorConfirmar: string;
  recamara: [string, string];
  bano: [string, string];
  construidos: string;
  deTerreno: string;
  estacionamiento: string;
  auto: [string, string];
  engancheEtiqueta: string;
  estado: string;
  aceptaInfonavit: string;
  aceptaFovissste: string;
  aceptaBancario: string;
  fotos: string; // `{n}`
  fotoAlt: string; // `{titulo}` `{n}`
  meInteresa: string;
  elegida: string;
}

export interface CopyMerida {
  meta: { title: string; description: string };
  form: CopyForm;
  pieAviso: string;
  catalogo: CopyCatalogoMerida;
  vacio: { titulo: string; cuerpo: string; cta: string };
  faqTitulo: string;
  barraEtiqueta: string;
  inventarioUna: (ubicacion: string, precio: string) => string;
  inventarioVarias: (total: number, desde: string, hasta: string) => string;
}

export const COPY_ES: CopyMerida = {
  meta: {
    title: 'Casas en Mérida con crédito Infonavit o Fovissste | Precio y enganche publicados',
    description:
      'Casas publicadas hoy en Mérida que aceptan Infonavit y Fovissste, con precio cerrado, enganche y disponibilidad. Recibe la ficha completa con planos por correo.',
  },
  form: {
    etiqueta: 'La ficha completa de esta casa',
    titulo: 'Te mandamos precio, enganche y planos',
    cuerpo: 'Dinos cómo quieres pagar y lo que buscas. Llega por correo el mismo día y un asesor te escribe por WhatsApp.',
    nombre: 'Nombre',
    whatsapp: 'WhatsApp',
    email: 'Correo',
    propiedadLabel: 'Casa de interés',
    verTodas: 'Quiero ver todas',
    presupuestoLabel: 'Presupuesto',
    presupuestos: ['Hasta $2.5 M MXN', '$2.5 M a $4 M MXN', 'Más de $4 M MXN', 'Todavía lo estoy definiendo'],
    enviar: 'Recibir la ficha',
    preferirWhatsApp: 'Prefiero preguntar por WhatsApp',
    coinciden: '{n} {n|casa coincide|casas coinciden} con lo que elegiste.',
    exitoCuerpo:
      'Te enviamos a {email} el precio, el enganche y los planos de {total|la casa|las {total} casas}. Un asesor te escribe por WhatsApp el mismo día hábil.',
    exitoCta: 'Escribir ahora por WhatsApp',
    sinEspecifica: 'Mérida (sin casa específica)',
    whatsappGenerico: 'Hola, vi la casa en venta en Mérida en su página. ¿Me pasan precio, enganche y planos?',
    whatsappPorPropiedad: 'Hola, me interesa esta casa: {titulo}. ¿Me pasan precio, enganche y planos?',
  },
  pieAviso:
    'Precio y disponibilidad vigentes al momento de la consulta y sujetos a confirmación con el desarrollador. Propyte no es la desarrolladora de este inmueble. Las imágenes las proporciona el desarrollador y pueden incluir renders.',
  catalogo: {
    mostrarCreditos: true,
    tituloCredito: 'Casas en Mérida que puedes comprar con tu crédito Infonavit o Fovissste',
    tituloBase: 'Casas en venta en Mérida con precio y enganche publicados',
    comoPagar: 'Elige cómo quieres pagar y te mandamos solo lo que aplica',
    otras: 'Otras casas en Mérida',
    unaCoincide: 'Esta es la que coincide con lo que elegiste',
    sinCoincidencias:
      'Ninguna casa publicada cumple con todo lo que elegiste. Quita un filtro, o mándanos el formulario y te decimos qué hay cerca.',
    quitarFiltros: 'Quitar filtros',
    otraOpcion:
      'Si esta casa no encaja con tu presupuesto o tu zona, dínoslo: somos comercializadora, no desarrolladora, y te buscamos otra en Mérida.',
    pedirOtra: 'Pedir otra opción',
    desde: 'Desde {precio}',
    enganche: 'enganche del {pct}%',
    en: 'en {zona}',
    unir: 'y',
    casaEnVenta: 'Casa en venta · {ubicacion}',
    precioPorConfirmar: 'Precio por confirmar',
    recamara: ['recámara', 'recámaras'],
    bano: ['baño', 'baños'],
    construidos: 'construidos',
    deTerreno: 'de terreno',
    estacionamiento: 'Estacionamiento',
    auto: ['auto', 'autos'],
    engancheEtiqueta: 'Enganche',
    estado: 'Estado',
    aceptaInfonavit: 'Acepta Infonavit',
    aceptaFovissste: 'Acepta Fovissste',
    aceptaBancario: 'Acepta crédito bancario',
    fotos: 'Las {n} fotos',
    fotoAlt: '{titulo}, foto {n}',
    meInteresa: 'Me interesa',
    elegida: 'Elegida',
  },
  vacio: {
    titulo: 'Ahora mismo no tenemos casas publicadas en Mérida.',
    cuerpo: 'Escríbenos y te avisamos en cuanto entre inventario, con los números completos.',
    cta: 'Avísenme por WhatsApp',
  },
  faqTitulo: 'Lo que preguntan antes de comprar',
  barraEtiqueta: 'Recibir la ficha',
  inventarioUna: (ubicacion, precio) => `Inventario publicado: 1 casa en ${ubicacion}, ${precio}.`,
  inventarioVarias: (total, desde, hasta) => `Inventario publicado: ${total} casas de ${desde} a ${hasta}.`,
};

export const COPY_EN: CopyMerida = {
  meta: {
    title: 'Homes for Sale in Mérida, Yucatán | Prices and Down Payments Listed',
    description:
      'Homes listed today in Mérida, Yucatán with firm prices, down payment and availability. Get the full details and floor plans by email.',
  },
  form: {
    etiqueta: 'Full details on this home',
    titulo: "We'll send you the price, down payment and floor plans",
    cuerpo:
      "Tell us your budget and what you're looking for. It reaches your inbox the same day, and an advisor will message you on WhatsApp.",
    nombre: 'Name',
    whatsapp: 'WhatsApp',
    email: 'Email',
    propiedadLabel: 'Home of interest',
    verTodas: 'I want to see them all',
    presupuestoLabel: 'Budget',
    presupuestos: ['Up to $2.5 M MXN', '$2.5 M to $4 M MXN', 'Over $4 M MXN', "I'm still deciding"],
    enviar: 'Get the details',
    preferirWhatsApp: "I'd rather ask on WhatsApp",
    coinciden: '{n} {n|home matches|homes match} what you selected.',
    // Sin llaves anidadas: el reemplazo de marcadores del kit no las resuelve.
    exitoCuerpo:
      'We sent the price, down payment and floor plans for {total|the home|all the homes} to {email}. An advisor will message you on WhatsApp the same business day.',
    exitoCta: 'Message us on WhatsApp now',
    sinEspecifica: 'Mérida (no specific home)',
    whatsappGenerico:
      'Hi, I saw the home for sale in Mérida on your website. Can you send me the price, down payment and floor plans?',
    whatsappPorPropiedad:
      "Hi, I'm interested in this home: {titulo}. Can you send me the price, down payment and floor plans?",
  },
  pieAviso:
    'Price and availability are current as of the time of inquiry and subject to confirmation with the developer. Propyte is not the developer of this property. Images are provided by the developer and may include renderings.',
  catalogo: {
    mostrarCreditos: false,
    // Sin gancho de crédito en inglés (ver cabecera): ambos titulares son el neutro.
    tituloCredito: 'Homes for sale in Mérida, Yucatán, with prices and down payments listed',
    tituloBase: 'Homes for sale in Mérida, Yucatán, with prices and down payments listed',
    comoPagar: '',
    otras: 'Other homes in Mérida',
    unaCoincide: 'This is the one that matches what you selected',
    sinCoincidencias:
      "No listed home matches everything you selected. Clear a filter, or send us the form and we'll tell you what's nearby.",
    quitarFiltros: 'Clear filters',
    otraOpcion:
      "If this home doesn't fit your budget or your area, tell us: we're a sales agency, not the developer, and we'll find you another one in Mérida.",
    pedirOtra: 'Ask for another option',
    desde: 'From {precio}',
    enganche: '{pct}% down payment',
    en: 'in {zona}',
    unir: 'and',
    casaEnVenta: 'Home for sale · {ubicacion}',
    precioPorConfirmar: 'Price to be confirmed',
    recamara: ['bedroom', 'bedrooms'],
    bano: ['bath', 'baths'],
    construidos: 'built',
    deTerreno: 'lot',
    estacionamiento: 'Parking',
    auto: ['space', 'spaces'],
    engancheEtiqueta: 'Down payment',
    estado: 'Status',
    aceptaInfonavit: '',
    aceptaFovissste: '',
    aceptaBancario: '',
    fotos: '{n} photos',
    fotoAlt: '{titulo}, photo {n}',
    meInteresa: "I'm interested",
    elegida: 'Selected',
  },
  vacio: {
    titulo: "We don't have homes listed in Mérida right now.",
    cuerpo: "Message us and we'll let you know as soon as new inventory comes in, with the full numbers.",
    cta: 'Notify me on WhatsApp',
  },
  faqTitulo: 'What buyers ask before purchasing',
  barraEtiqueta: 'Get the details',
  inventarioUna: (ubicacion, precio) => `Listed inventory: 1 home in ${ubicacion}, ${precio}.`,
  inventarioVarias: (total, desde, hasta) => `Listed inventory: ${total} homes from ${desde} to ${hasta}.`,
};

export const COPY: Record<LocaleLp, CopyMerida> = { es: COPY_ES, en: COPY_EN };
