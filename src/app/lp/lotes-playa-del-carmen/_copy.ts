// ============================================================
// Copy de la landing de lotes, en los dos idiomas que sirve.
//
// Es la MISMA página (`_pagina.tsx`) con otro diccionario: la variante en
// inglés vive en `/lp/lots-playa-del-carmen` y solo aporta `metadata` y el
// idioma. Mismo patrón que `casas-riviera-maya/_copy.ts`.
//
// ═══ ESTRUCTURA ═══
//
// Un diccionario POR COMPONENTE, no uno gigante. Los componentes cliente
// (`LeadFormLotes`, `ComparadorLotes`, `SelectorPlazo`, `StickyCta`…) importan
// solo el suyo, y el bundler descarta el resto. Cada uno se declara como
// `const es = {…}` y `en: typeof es`: si falta una clave en inglés, no compila.
//
// ═══ LO QUE NO SE TRADUCE, Y POR QUÉ ═══
//
//   · Precios: siguen en pesos con «MXN» pegado (nunca se convierten a dólares)
//     y las superficies siguen en m². Un tipo de cambio o una conversión a pies
//     cuadrados es una cifra que el asesor desmiente en la primera llamada.
//   · Nombres de ciudad, zona y desarrollo: vienen del Hub tal cual.
//   · Texto libre que escribe el Hub en español y que no se puede mapear
//     (conceptos y momentos de los cargos únicos, nota de gastos de cierre,
//     detalle de cada servicio, valores desconocidos de régimen/estado): se
//     publica como viene. Lo conocido se traduce en `_localizar.ts`.
//   · COS y CUS se conservan como siglas (así las publica el desarrollador) y
//     en inglés se glosan una vez («lot coverage», «floor-area ratio»).
// ============================================================

import type { LocaleLp } from '../_components/v2/i18n';

// ───────────────────────── Página ─────────────────────────

const paginaEs = {
  meta: {
    title: 'Terrenos residenciales en la Riviera Maya · Lotes en privada',
    description:
      'Terrenos y lotes residenciales en venta en Playa del Carmen y Tulum, con enganche, mensualidades y el estatus real de urbanización servicio por servicio. Comparamos los que tenemos publicados y conseguimos cualquier otro de la zona.',
  },
  /** Surfaces de `trackWhatsAppClick`: las españolas no cambian. */
  surface: {
    agotado: 'lp-lotes-pdc-agotado',
    hero: 'lp-lotes-pdc-hero',
    cierre: 'lp-lotes-pdc-cierre',
  },
  agotado: {
    titulo: 'Este lote ya no está disponible',
    cuerpo:
      'El lote que anunciábamos en esta página salió del inventario. No vamos a mostrarte otro como si fuera el mismo. Si quieres, te avisamos cuando entre inventario comparable en Playa del Carmen, con sus números completos.',
    mensajeWa:
      'Hola, vi que el lote de Playa del Carmen ya no está disponible. Quiero que me avisen cuando entre inventario comparable.',
  },
  heroRespaldo: {
    alt: 'Vista aérea de la privada residencial sobre Av. Universidades, Playa del Carmen',
    caption: 'La privada terminada, según el proyecto del desarrollador.',
  },
  mensajeWa: {
    interes: (slug: string) =>
      `Hola, me interesa el lote residencial en privada de Playa del Carmen (ref. ${slug}).`,
    sonDe: (superficie: string, precio: string) => `Son ${superficie} en ${precio}.`,
    plan: (meses: number) =>
      `Quiero confirmar el plan a ${meses} meses y qué falta por urbanizar.`,
    sinPlan: 'Quiero el detalle del plan de pagos y qué falta por urbanizar.',
  },
  hero: {
    h1: 'Terrenos residenciales en la Riviera Maya',
    ctaPlan: 'Ver mi plan de pagos',
    ctaDetalle: 'Pedir el detalle',
    renderDe: 'Render del desarrollador.',
  },
  cifras: {
    enganche: 'Enganche',
    alMes: 'Al mes',
    alMesPlazo: (meses: number) => `Al mes, ${meses} meses`,
    construible: 'Construible',
    precioTotal: 'Precio total',
    faltaConfirmar: 'falta confirmar',
    contraentregaA: 'Más un pago final de',
    contraentregaB: (pct: number) =>
      `contra entrega, que es el ${pct}% del precio. Te mandamos la tabla de amortización completa por escrito.`,
    precioM2A: 'El precio por metro cuadrado es',
    porConfirmar: 'por confirmar',
    precioM2B:
      '. La mensualidad la publicamos en cuanto el desarrollador declare la tasa por escrito.',
    honestidadA:
      'Hoy el lote no tiene servicios conectados y no es escriturable. Abajo está el detalle servicio por servicio, con las fechas que declara el desarrollador y',
    honestidadLink: 'lo que todavía no podemos confirmar',
  },
  ventana: {
    titulo:
      'Por qué el calendario largo es la razón para comprar ahora, no el motivo para no hacerlo',
    p1: 'Un terreno urbanizado y escriturado en esta zona cuesta más y se paga de contado o con crédito bancario. Lo que compras aquí es tiempo: fijas hoy el precio y la ubicación, y el desarrollo te da una ventana de cinco años para iniciar obra.',
    p2Inicio: 'Eso significa que no necesitas el dinero de la construcción hoy. Pagas el terreno',
    p2SinIntereses: (plazos: string) => ` en ${plazos} meses sin intereses`,
    plazosUnion: ' o ',
    p2Conforme: ' conforme al plan del desarrollador',
    p2Fin:
      ', y cuando termines de pagarlo empiezas a juntar para la obra, sin que nadie te apure y sin renta corriendo en paralelo sobre algo que no es tuyo.',
    p3: 'El costo de esa ventana es concreto y está arriba: hoy no hay servicios conectados y el lote no es escriturable. Los servicios están proyectados para octubre y noviembre de 2027, y la escrituración a finales de 2026 según el desarrollador. Si tu plan es construir el año que entra, este producto no te sirve y te lo decimos aquí en lugar de tres llamadas después.',
  },
  aside: {
    nota: 'Si por presupuesto u objetivo no encaja, te lo decimos en el primer mensaje.',
  },
  faq: { compra: 'Compra', financiamiento: 'Financiamiento' },
  cierre: {
    conPlan:
      'Te mandamos tu tabla de amortización, el plano con la ubicación del lote y el paquete documental.',
    sinPlan: 'Te mandamos el detalle completo del lote y el paquete documental.',
    ctaPlan: 'Ver mi plan de pagos',
    ctaDetalle: 'Pedir el detalle del lote',
  },
  pie: {
    precios:
      'Precios en pesos mexicanos, vigentes a la fecha de corte indicada y sujetos a cambio y disponibilidad sin previo aviso. Las fechas de urbanización y escrituración son declaradas por el desarrollador y no constituyen garantía. Este anuncio no publica proyecciones de plusvalía ni de rendimiento.',
    licenciaCompleta:
      'Publicidad de lotes conforme al artículo 69 de la Ley de Asentamientos Urbanos de Quintana Roo: los datos de licencia y autorización de venta municipal se indican en la sección de situación jurídica de esta página.',
    licenciaPendienteA:
      'Sobre la licencia del desarrollo y la autorización de venta municipal,',
    licenciaPendienteLink: 'lo decimos arriba',
    licenciaPendienteB: ': todavía no las tenemos por escrito y explicamos por qué.',
    privacidad: 'Aviso de privacidad',
  },
};

export const PAGINA: Record<LocaleLp, typeof paginaEs> = {
  es: paginaEs,
  en: {
    meta: {
      title: 'Residential Lots in the Riviera Maya · Lots in a Gated Community',
      description:
        'Residential lots and land for sale in Playa del Carmen and Tulum, with a down payment, monthly payments and the real urbanization status, service by service. We compare the lots we have listed and can find you any other lot in the area.',
    },
    surface: {
      agotado: 'lp-lotes-pdc-agotado-en',
      hero: 'lp-lotes-pdc-hero-en',
      cierre: 'lp-lotes-pdc-cierre-en',
    },
    agotado: {
      titulo: 'This lot is no longer available',
      cuerpo:
        "The lot we were advertising on this page has left our inventory. We won't show you a different one as if it were the same. If you'd like, we'll let you know when comparable inventory comes in in Playa del Carmen, with its full numbers.",
      mensajeWa:
        "Hi, I saw that the Playa del Carmen lot is no longer available. I'd like to be notified when comparable inventory comes in.",
    },
    heroRespaldo: {
      alt: 'Aerial view of the gated residential community on Av. Universidades, Playa del Carmen',
      caption: "The finished community, according to the developer's plans.",
    },
    mensajeWa: {
      interes: (slug: string) =>
        `Hi, I'm interested in the residential lot in the Playa del Carmen gated community (ref. ${slug}).`,
      sonDe: (superficie: string, precio: string) => `It's ${superficie} for ${precio}.`,
      plan: (meses: number) =>
        `I'd like to confirm the ${meses}-month plan and what's still missing on urbanization.`,
      sinPlan: "I'd like the payment plan details and what's still missing on urbanization.",
    },
    hero: {
      h1: 'Residential Lots in the Riviera Maya',
      ctaPlan: 'See my payment plan',
      ctaDetalle: 'Request the details',
      renderDe: 'Developer rendering.',
    },
    cifras: {
      enganche: 'Down payment',
      alMes: 'Per month',
      alMesPlazo: (meses: number) => `Per month, ${meses} months`,
      construible: 'Buildable area',
      precioTotal: 'Total price',
      faltaConfirmar: 'to be confirmed',
      contraentregaA: 'Plus a final payment of',
      contraentregaB: (pct: number) =>
        `on delivery, which is ${pct}% of the price. We'll send you the full amortization schedule in writing.`,
      precioM2A: 'The price per square meter is',
      porConfirmar: 'to be confirmed',
      precioM2B:
        ". We'll publish the monthly payment as soon as the developer states the rate in writing.",
      honestidadA:
        "Today the lot has no utilities connected and can't be deeded yet. Below is the service-by-service detail, with the dates the developer states, and",
      honestidadLink: "what we still can't confirm",
    },
    ventana: {
      titulo:
        'Why the long timeline is a reason to buy now, not a reason to hold off',
      p1: "A fully urbanized, deeded lot in this area costs more and is paid in cash or with a bank loan. What you're buying here is time: you lock in today's price and location, and the development gives you a five-year window to start construction.",
      p2Inicio: "That means you don't need the construction money today. You pay for the lot",
      p2SinIntereses: (plazos: string) => ` in ${plazos} months with no interest`,
      plazosUnion: ' or ',
      p2Conforme: " according to the developer's plan",
      p2Fin:
        ', and once it is paid off you start saving for the build, with no one rushing you and no rent running in parallel on something that is not yours.',
      p3: "The cost of that window is concrete and stated above: today there are no utilities connected and the lot can't be deeded. Utilities are projected for October and November 2027, and the deed for late 2026, according to the developer. If your plan is to build next year, this product isn't for you, and we're telling you here instead of three phone calls from now.",
    },
    aside: {
      nota: "If it doesn't fit your budget or goals, we'll tell you in our first message.",
    },
    faq: { compra: 'Buying', financiamiento: 'Financing' },
    cierre: {
      conPlan:
        "We'll send you your amortization schedule, the site plan showing the lot's location, and the document package.",
      sinPlan: "We'll send you the full lot details and the document package.",
      ctaPlan: 'See my payment plan',
      ctaDetalle: 'Request the lot details',
    },
    pie: {
      precios:
        'Prices in Mexican pesos, valid as of the cutoff date shown and subject to change and availability without notice. Urbanization and deed dates are stated by the developer and are not a guarantee. This ad does not publish appreciation or yield projections.',
      licenciaCompleta:
        'Lot advertising under Article 69 of the Quintana Roo Urban Settlements Law: the license and municipal sales authorization details are given in the legal status section of this page.',
      licenciaPendienteA:
        "On the development's license and the municipal sales authorization,",
      licenciaPendienteLink: 'we say so above',
      licenciaPendienteB: ": we don't have them in writing yet, and we explain why.",
      privacidad: 'Privacy notice',
    },
  },
};

// ───────────────────────── Comunes (ui.tsx, Figure) ─────────────────────────

const comunEs = {
  gatePrefijo: 'Falta confirmar:',
  gate: {
    tasa: 'tasa de financiamiento',
    superficie: 'superficie',
    precio: 'precio',
    precioM2: 'superficie para calcular el precio por m²',
    construible: 'superficie para calcular lo construible',
    enganche: 'enganche',
    plazos: 'plazos de financiamiento',
    urbanizacion: 'estatus de urbanización',
    devolucionApartado: 'condiciones de devolución del apartado',
    etapa: 'etapa a la que pertenece este lote',
    serviciosPorServicio: 'estatus de urbanización servicio por servicio',
    gastosEscrituracion: '% de gastos de escrituración',
    mantenimiento: 'cuota de mantenimiento',
    gastosCierre: '% de gastos de cierre',
    regimen: 'régimen de propiedad',
  },
  estadoServicio: {
    disponible: 'Disponible',
    en_proceso: 'En proceso',
    proyectado: 'Proyectado',
  },
  /** `{alcance}` es lo único que difiere entre el plan y el comparador. */
  disclaimer: (alcance: string) =>
    `Cifras calculadas sobre el precio publicado y ${alcance}, redondeadas al peso. No son una tabla de amortización: esa te la mandamos por escrito, con las fechas de cada pago, antes de que firmes nada. Condiciones sujetas a cambio y disponibilidad.`,
  alcance: {
    desarrollador: 'el esquema que declara el desarrollador',
    cadaDesarrollador: 'el esquema que declara cada desarrollador',
  },
  figura: { render: 'Render del desarrollador.', foto: 'Fotografía real.' },
};

export const COMUN: Record<LocaleLp, typeof comunEs> = {
  es: comunEs,
  en: {
    gatePrefijo: 'To be confirmed:',
    gate: {
      tasa: 'financing rate',
      superficie: 'lot size',
      precio: 'price',
      precioM2: 'lot size to calculate the price per m²',
      construible: 'lot size to calculate the buildable area',
      enganche: 'down payment',
      plazos: 'financing terms',
      urbanizacion: 'urbanization status',
      devolucionApartado: 'refund terms for the reservation deposit',
      etapa: 'phase this lot belongs to',
      serviciosPorServicio: 'urbanization status, service by service',
      gastosEscrituracion: '% of deeding costs',
      mantenimiento: 'maintenance fee',
      gastosCierre: '% of closing costs',
      regimen: 'property regime',
    },
    estadoServicio: {
      disponible: 'Available',
      en_proceso: 'In progress',
      proyectado: 'Projected',
    },
    disclaimer: (alcance: string) =>
      `Figures calculated on the published price and ${alcance}, rounded to the peso. This is not an amortization schedule: we send that to you in writing, with the date of each payment, before you sign anything. Terms subject to change and availability.`,
    alcance: {
      desarrollador: 'the scheme the developer states',
      cadaDesarrollador: 'the scheme each developer states',
    },
    figura: { render: 'Developer rendering.', foto: 'Real photograph.' },
  },
};

// ───────────────────────── Formulario ─────────────────────────

const formEs = {
  /** Valor por defecto de «cuándo te escribimos». COMPROMISO OPERATIVO. */
  tiempoRespuesta: 'el mismo día hábil',
  leadSource: 'lp_lotes_pdc',
  formType: 'lp_lotes_pdc',
  paisTelefono: 'MX' as 'MX' | 'US',
  placeholderTelefono: '984 123 4567',
  objetivos: [
    'Construir mi casa',
    'Inversión a mediano plazo',
    'Todavía estoy comparando',
  ] as readonly string[],
  errorFaltan:
    'Necesitamos tu nombre, tu correo y un WhatsApp para enviarte el comparativo.',
  errorCorreo: 'Revisa el correo: es a donde te mandamos el comparativo.',
  errorTelefono: 'Revisa el WhatsApp: elige tu país y escribe el número completo.',
  errorEnvio: 'No pudimos enviar tu solicitud. Vuelve a intentarlo, o escríbenos por WhatsApp.',
  lead: {
    ref: (ref: string) => `Lote ref. ${ref}.`,
    plan: (plazo: number) => `Pidió el plan a ${plazo} meses.`,
    sinPlan: 'Pidió el detalle del lote.',
    objetivo: (o: string) => `Objetivo declarado: ${o}.`,
  },
  gracias: (nombre: string) => `Listo, ${nombre}.`,
  graciasA: 'Te escribimos por WhatsApp al',
  graciasB: 'con el plano, tu tabla de amortización',
  graciasPlazo: (plazo: number) => ` a ${plazo} meses`,
  graciasC: 'y el paquete documental.',
  graciasNoEncaja:
    'Si por presupuesto u objetivo este lote no encaja, te lo decimos en el primer mensaje y te ahorramos la llamada.',
  nombre: 'Nombre',
  email: 'Email',
  whatsapp: 'WhatsApp',
  heroTitulo: 'Pide tu plan de pagos por WhatsApp',
  enviando: 'Enviando',
  heroBoton: 'Enviarme el plan',
  heroNotaA: 'Te escribimos',
  heroNotaB:
    'con el plano, la tabla de amortización y el paquete documental. Sin llamadas si no las pides.',
  principalTitulo: '¿A dónde te lo enviamos?',
  plazoLegend: 'Plazo que te interesa',
  meses: 'meses',
  objetivoLegend: 'Qué buscas',
  opcional: '(opcional)',
  principalBoton: 'Enviarme el plan y los documentos',
  quePasa: 'Qué pasa cuando envías',
  quePasa1A: 'Te escribimos por WhatsApp',
  quePasa2: 'El plano con la ubicación exacta del lote dentro de la privada.',
  quePasa3A: 'Tu tabla de amortización',
  quePasa3B: ', con el pago final por escrito.',
  quePasa4:
    'El paquete documental: licencia, autorización de venta municipal y régimen de propiedad, para que lo revises tú o tu abogado.',
  consentimiento:
    'Al enviar aceptas que te contactemos por WhatsApp sobre este lote. Puedes pedirnos que dejemos de hacerlo en cualquier momento.',
};

export const FORM: Record<LocaleLp, typeof formEs> = {
  es: formEs,
  en: {
    tiempoRespuesta: 'on the same business day',
    leadSource: 'lp_lotes_pdc_en',
    formType: 'lp_lotes_pdc_en',
    paisTelefono: 'US',
    placeholderTelefono: '(555) 123-4567',
    objetivos: ['Build my home', 'Medium-term investment', "I'm still comparing"],
    errorFaltan:
      'We need your name, your email and a WhatsApp number to send you the comparison.',
    errorCorreo: "Check your email address: it's where we send the comparison.",
    errorTelefono: 'Check your WhatsApp number: choose your country and enter the full number.',
    errorEnvio: "We couldn't send your request. Please try again, or message us on WhatsApp.",
    lead: {
      ref: (ref: string) => `Lot ref. ${ref}.`,
      plan: (plazo: number) => `Requested the ${plazo}-month plan.`,
      sinPlan: 'Requested the lot details.',
      objetivo: (o: string) => `Stated goal: ${o}.`,
    },
    gracias: (nombre: string) => `All set, ${nombre}.`,
    graciasA: "We'll message you on WhatsApp at",
    graciasB: 'with the site plan, your amortization schedule',
    graciasPlazo: (plazo: number) => ` over ${plazo} months`,
    graciasC: 'and the document package.',
    graciasNoEncaja:
      "If this lot doesn't fit your budget or goals, we'll tell you in the first message and save you the call.",
    nombre: 'Name',
    email: 'Email',
    whatsapp: 'WhatsApp',
    heroTitulo: 'Get your payment plan on WhatsApp',
    enviando: 'Sending',
    heroBoton: 'Send me the plan',
    heroNotaA: "We'll write to you",
    heroNotaB:
      'with the site plan, the amortization schedule and the document package. No calls unless you ask for them.',
    principalTitulo: 'Where should we send it?',
    plazoLegend: "Term you're interested in",
    meses: 'months',
    objetivoLegend: 'What are you looking for',
    opcional: '(optional)',
    principalBoton: 'Send me the plan and documents',
    quePasa: 'What happens when you submit',
    quePasa1A: 'We message you on WhatsApp',
    quePasa2: "The site plan with the lot's exact location inside the gated community.",
    quePasa3A: 'Your amortization schedule',
    quePasa3B: ', with the final payment in writing.',
    quePasa4:
      'The document package: license, municipal sales authorization and property regime, for you or your attorney to review.',
    consentimiento:
      'By submitting you agree that we may contact you on WhatsApp about this lot. You can ask us to stop at any time.',
  },
};

// ───────────────────────── WhatsApp, barra fija, badge ─────────────────────────

const waEs = { escribir: 'Escribir por WhatsApp' };
export const WA: Record<LocaleLp, typeof waEs> = {
  es: waEs,
  en: { escribir: 'Message us on WhatsApp' },
};

const stickyEs = {
  alMes: 'al mes',
  verPlan: 'Ver mi plan',
  pedirDetalle: 'Pedir el detalle',
};
export const STICKY: Record<LocaleLp, typeof stickyEs> = {
  es: stickyEs,
  en: { alMes: 'per month', verPlan: 'See my plan', pedirDetalle: 'Request the details' },
};

const badgeEs = {
  disponibles: 'lotes disponibles según el desarrollador',
  al: 'Al',
};
export const BADGE: Record<LocaleLp, typeof badgeEs> = {
  es: badgeEs,
  en: { disponibles: 'lots available according to the developer', al: 'As of' },
};

// ───────────────────────── Qué estás comprando ─────────────────────────

const queEs = {
  titulo: 'Qué estás comprando, exactamente',
  /** Nombre visible de cada amenidad. Vacío en español: se publica como viene del Hub. */
  amenidadNombre: {} as Record<string, string>,
  consecuencia: {
    'acceso controlado':
      'Tus hijos pueden salir solos de la casa. Es la razón por la que la gente se muda a una privada.',
    'seguridad 24h': 'Hay alguien despierto a las tres de la mañana.',
    cctv: 'Lo que pasa en las áreas comunes queda grabado.',
    'alberca comunitaria':
      'Aprenden a nadar a dos cuadras de tu puerta, sin subirse al coche.',
    'pet zone': 'El perro es parte del plan, no un problema a resolver.',
    'salon de eventos': 'Los cumpleaños ocurren dentro de la privada.',
    gimnasio: 'Ya está en el mantenimiento. No hay membresía que cancelar.',
    cancha: 'Los adolescentes tienen a dónde ir sin salir.',
    'jardin comunitario': 'Se camina. En Playa del Carmen eso no se da por hecho.',
    'area de ninos': 'Los pones a la vista mientras haces otra cosa.',
    'casa club': 'Hay dónde recibir visitas cuando tu casa se queda chica.',
  } as Record<string, string>,
  rotulo: {
    familia: 'Para los que viven contigo',
    seguridad: 'Para dormir tranquilo',
    'vida diaria': 'Para el día a día',
  },
  introA: 'En Playa del Carmen tenemos un lote residencial disponible de',
  superficiePorConfirmar: 'superficie por confirmar',
  introB: 'en',
  precioPorConfirmar: 'precio por confirmar',
  porM2A: ', es decir',
  porM2B: 'por metro cuadrado',
  introC:
    '. Está en preventa dentro de una privada sobre Av. Universidades, a 4.2 km de la playa, con financiamiento directo del desarrollador',
  sinIntereses: ' y sin intereses',
  enganche: (pct: number) => `: ${pct}% de enganche`,
  hasta: (meses: number) => ` y hasta ${meses} meses`,
  introD: '. Es propiedad privada, no terreno ejidal.',
  p1: 'No una casa terminada: el espacio para decidir la tuya. Cuando compras un terreno no heredas los acabados ni la distribución de alguien más.',
  p2: 'Y estás comprando ubicación en una ciudad que ya existe. La diferencia con un desarrollo en plena selva esperando que llegue la infraestructura es que aquí la vida urbana ya está alrededor: 4.2 km a la playa, 2 km a la carretera federal, sobre Av. Universidades.',
  aprA: 'Sobre',
  aprB: ', el uso de suelo permite ocupar',
  aprC: 'en planta y construir hasta',
  aprD: 'en total',
  aprE: (niveles: string) => `: una casa de ${niveles} niveles con tres recámaras, no de dos.`,
  nivelesDos: 'dos',
  p4: 'La lógica del producto es asegurar hoy la ubicación y el precio de preventa, y construir cuando los tiempos y el presupuesto lo permitan. El desarrollo fija una ventana máxima de cinco años para iniciar obra.',
  amenA: 'Dentro de la privada',
  amenDe: 'de',
  amenLotes: 'lotes',
  amenB: ', esto es lo que cada amenidad significa un martes cualquiera:',
  amenNota:
    'Se entregan conforme al calendario de obra, y ese calendario está más abajo con sus fechas y con lo que todavía no podemos confirmar.',
};

export const QUE: Record<LocaleLp, typeof queEs> = {
  es: queEs,
  en: {
    titulo: "What you're buying, exactly",
    amenidadNombre: {
      'acceso controlado': 'Controlled access',
      'seguridad 24h': '24/7 security',
      cctv: 'CCTV',
      'alberca comunitaria': 'Community pool',
      'pet zone': 'Pet zone',
      'salon de eventos': 'Event hall',
      gimnasio: 'Gym',
      cancha: 'Sports court',
      'jardin comunitario': 'Community garden',
      'area de ninos': "Kids' area",
      'casa club': 'Clubhouse',
    },
    consecuencia: {
      'acceso controlado':
        "Your kids can step outside on their own. It's the reason people move into a gated community.",
      'seguridad 24h': "Someone is awake at three in the morning.",
      cctv: 'What happens in the common areas is recorded.',
      'alberca comunitaria':
        'They learn to swim two blocks from your door, without getting in the car.',
      'pet zone': 'The dog is part of the plan, not a problem to solve.',
      'salon de eventos': 'Birthday parties happen inside the community.',
      gimnasio: "It's already in the maintenance fee. There's no membership to cancel.",
      cancha: 'Teenagers have somewhere to go without leaving.',
      'jardin comunitario': "You can walk. In Playa del Carmen, that's not a given.",
      'area de ninos': 'You can keep them in sight while you do something else.',
      'casa club': 'There is somewhere to host guests when your home gets too small.',
    },
    rotulo: {
      familia: 'For the people who live with you',
      seguridad: 'For sleeping well',
      'vida diaria': 'For everyday life',
    },
    introA: 'In Playa del Carmen we have an available residential lot of',
    superficiePorConfirmar: 'size to be confirmed',
    introB: 'priced at',
    precioPorConfirmar: 'price to be confirmed',
    porM2A: ', or',
    porM2B: 'per square meter',
    introC:
      ". It's in presale inside a gated community on Av. Universidades, 4.2 km from the beach, with direct financing from the developer",
    sinIntereses: ' and no interest',
    enganche: (pct: number) => `: ${pct}% down payment`,
    hasta: (meses: number) => ` and up to ${meses} months`,
    introD: ". It's private property, not ejido land.",
    p1: "Not a finished house: the space to decide on yours. When you buy land, you don't inherit someone else's finishes or layout.",
    p2: "You're also buying a location in a city that already exists. The difference from a development in the middle of the jungle waiting for infrastructure to arrive is that here urban life is already around you: 4.2 km to the beach, 2 km to the federal highway, on Av. Universidades.",
    aprA: 'On',
    aprB: ', the zoning allows a ground-floor footprint of',
    aprC: 'and building up to',
    aprD: 'in total',
    aprE: (niveles: string) => `: a ${niveles}-story home with three bedrooms, not two.`,
    nivelesDos: 'two',
    p4: 'The logic of the product is to secure the location and the presale price today, and build when your timing and budget allow. The development sets a maximum window of five years to start construction.',
    amenA: 'Inside the gated community',
    amenDe: 'of',
    amenLotes: 'lots',
    amenB: ", here's what each amenity means on an ordinary Tuesday:",
    amenNota:
      "They're delivered according to the construction schedule, and that schedule is further down with its dates and with what we still can't confirm.",
  },
};

// ───────────────────────── Plan de pagos y selector ─────────────────────────

const planEs = {
  titulo: 'Cómo se paga',
  tituloSinIntereses: 'Cómo se paga, sin intereses',
  sinPlan:
    'El financiamiento es directo con el desarrollador, pero todavía no publicamos las mensualidades porque falta un dato y preferimos decírtelo antes que estimarlo.',
  directo: 'Financiamiento directo con el desarrollador',
  sinIntereses: ', sin intereses',
  esquema: (e: number, m: number, c: number) =>
    `. El esquema que publica es ${e}% de enganche, ${m}% en mensualidades y ${c}% contra entrega. Estas cifras son ese esquema aplicado al precio de este lote.`,
  enganche: (pct: number) => `Enganche (${pct}%)`,
  alFirmar: 'Al firmar',
  mensualidades: (pct: number) => `Mensualidades (${pct}%)`,
  repartido: 'Repartido en los pagos de arriba',
  contraentrega: (pct: number) => `Contra entrega (${pct}%)`,
  pagoFinal: 'El pago final, en el último mes del plazo',
};

export const PLAN: Record<LocaleLp, typeof planEs> = {
  es: planEs,
  en: {
    titulo: 'How you pay',
    tituloSinIntereses: 'How you pay, with no interest',
    sinPlan:
      "Financing is direct with the developer, but we don't publish the monthly payments yet because a piece of data is missing and we'd rather tell you than estimate it.",
    directo: 'Direct financing with the developer',
    sinIntereses: ', with no interest',
    esquema: (e: number, m: number, c: number) =>
      `. The scheme it publishes is ${e}% down payment, ${m}% in monthly payments and ${c}% on delivery. These figures are that scheme applied to this lot's price.`,
    enganche: (pct: number) => `Down payment (${pct}%)`,
    alFirmar: 'At signing',
    mensualidades: (pct: number) => `Monthly payments (${pct}%)`,
    repartido: 'Spread across the payments above',
    contraentrega: (pct: number) => `On delivery (${pct}%)`,
    pagoFinal: 'The final payment, in the last month of the term',
  },
};

const selectorEs = {
  elige: 'Elige el plazo',
  meses: 'meses',
  alMes: 'al mes',
  pagos: 'pagos',
  sinIntereses: ' sin intereses',
  nota: 'El plazo cambia el tamaño de la mensualidad, no lo que acabas pagando: sin intereses, el total es el mismo en cualquiera de las opciones.',
};
export const SELECTOR: Record<LocaleLp, typeof selectorEs> = {
  es: selectorEs,
  en: {
    elige: 'Choose your term',
    meses: 'months',
    alMes: 'per month',
    pagos: 'payments',
    sinIntereses: ' with no interest',
    nota: 'The term changes the size of the monthly payment, not what you end up paying: with no interest, the total is the same under any option.',
  },
};

// ───────────────────────── Ficha ─────────────────────────

const fichaEs = {
  titulo: 'El lote, con todos sus números',
  superficie: 'Superficie',
  precio: 'Precio',
  precioM2: 'Precio por m²',
  construible: 'Construible',
  cos: 'COS',
  cus: 'CUS',
  hasta: 'hasta',
  enPlanta: 'en planta',
  enganche: 'Enganche',
  desde: 'Desde',
  mensualidad: 'Mensualidad',
  pagosA: (pagos: number, meses: number) => `${pagos} pagos a ${meses} meses, sin intereses`,
  plazos: 'Plazos',
  hastaMeses: (n: number) => `Hasta ${n} meses`,
  urbanizacion: 'Urbanización',
  ningunServicio: 'Ningún servicio conectado hoy',
  escrituracion: 'Escrituración',
  escrituraInmediata: 'Inmediata, cumplido el calendario de pagos del contrato',
  escrituraProyectada: 'Proyectada. Hoy el lote no es escriturable',
  comoLeer: 'Cómo leer este precio.',
  sonA: 'Son',
  sonB: 'por metro cuadrado sobre',
  sonC: '. Vas a encontrar terrenos en Playa del Carmen a la mitad de ese precio por metro, y conviene que los veas. Antes de comparar, revisa cuatro cosas en el otro terreno:',
  criterios: [
    'Si está en régimen de condominio o es un lote suelto.',
    'Si la urbanización corre por cuenta del desarrollador o por la tuya.',
    'Si tiene amenidades entregables por contrato.',
    'Si te lo financian a 48 o 60 meses o hay que pagarlo de contado.',
  ],
  cierre:
    'Cuando esos cuatro renglones estén en la mesa, la comparación por metro cuadrado significa algo. Antes, no.',
  sinPrecio:
    'El precio por metro cuadrado es lo que permite comparar este lote contra cualquier otro. Todavía no lo publicamos porque falta confirmar la superficie exacta, y preferimos decírtelo antes que estimarlo.',
};

export const FICHA: Record<LocaleLp, typeof fichaEs> = {
  es: fichaEs,
  en: {
    titulo: 'The lot, with all its numbers',
    superficie: 'Lot size',
    precio: 'Price',
    precioM2: 'Price per m²',
    construible: 'Buildable area',
    cos: 'Lot coverage (COS)',
    cus: 'floor-area ratio (CUS)',
    hasta: 'up to',
    enPlanta: 'ground-floor footprint',
    enganche: 'Down payment',
    desde: 'From',
    mensualidad: 'Monthly payment',
    pagosA: (pagos: number, meses: number) =>
      `${pagos} payments over ${meses} months, with no interest`,
    plazos: 'Terms',
    hastaMeses: (n: number) => `Up to ${n} months`,
    urbanizacion: 'Urbanization',
    ningunServicio: 'No utilities connected today',
    escrituracion: 'Deed',
    escrituraInmediata: "Immediate, once the contract's payment schedule is completed",
    escrituraProyectada: "Projected. Today the lot can't be deeded",
    comoLeer: 'How to read this price.',
    sonA: "That's",
    sonB: 'per square meter over',
    sonC: ". You'll find lots in Playa del Carmen at half that price per meter, and you should look at them. Before comparing, check four things on the other lot:",
    criterios: [
      "Whether it's under a condominium regime or is a standalone lot.",
      'Whether urbanization is handled by the developer or falls on you.',
      'Whether it has amenities deliverable by contract.',
      "Whether it's financed over 48 or 60 months or has to be paid in cash.",
    ],
    cierre:
      "Once those four lines are on the table, comparing per square meter means something. Before that, it doesn't.",
    sinPrecio:
      "The price per square meter is what lets you compare this lot against any other. We don't publish it yet because the exact size is still to be confirmed, and we'd rather tell you than estimate it.",
  },
};

// ───────────────────────── Prueba de que existimos ─────────────────────────

const pruebaEs = {
  ariaLabel: 'Cómo comprobar quiénes somos',
  oficina: 'Oficina física',
  oficinaNota: 'Puedes venir a revisar los documentos en papel antes de apartar.',
  asesor: 'Quién te atiende',
  asesorNotaA: 'Una persona con nombre y cargo, no «un asesor».',
  asesorLink: 'Ve al equipo completo',
  hrefEquipo: '/es/nosotros/equipo-comercial',
  hrefMetodologia: '/es/metodologia',
  paso1Titulo: 'Antes de que firmes nada',
  paso1:
    'Te mandamos el contrato para que lo revise tu abogado, y el paquete documental completo: licencia del desarrollo, autorización de venta municipal y régimen de propiedad.',
  paso2Titulo: 'Apartado',
  apartadoConfirmamos: 'El monto del apartado lo confirmamos por escrito.',
  paso2:
    'Las condiciones de devolución todavía no están publicadas por el desarrollador, y es la pregunta que más conviene resolver antes de entregar dinero.',
  paso3Titulo: 'Cómo validamos lo que listamos',
  paso3:
    'Cinco criterios documentados antes de publicar cualquier propiedad, y la información de urbanización la verificamos en campo en lugar de copiarla del brochure.',
  metodologia: 'Lee la metodología',
};
export const PRUEBA: Record<LocaleLp, typeof pruebaEs> = {
  es: pruebaEs,
  en: {
    ariaLabel: 'How to check who we are',
    oficina: 'Physical office',
    oficinaNota: 'You can come in to review the paper documents before reserving.',
    asesor: 'Who will help you',
    asesorNotaA: 'A person with a name and a title, not “an advisor.”',
    asesorLink: 'Meet the full team',
    hrefEquipo: '/en/nosotros/equipo-comercial',
    hrefMetodologia: '/en/metodologia',
    paso1Titulo: 'Before you sign anything',
    paso1:
      'We send you the contract for your attorney to review, plus the full document package: development license, municipal sales authorization and property regime.',
    paso2Titulo: 'Reservation deposit',
    apartadoConfirmamos: 'We confirm the deposit amount in writing.',
    paso2:
      "The developer hasn't published the refund terms yet, and it's the question most worth resolving before handing over any money.",
    paso3Titulo: 'How we vet what we list',
    paso3:
      'Five documented criteria before we publish any property, and we verify the urbanization information in the field instead of copying it from the brochure.',
    metodologia: 'Read the methodology',
  },
};

// ───────────────────────── Un domingo aquí ─────────────────────────

const domingoEs = {
  titulo: 'Un domingo aquí',
  p1: 'Salen de casa a las nueve menos veinte y a las nueve están en la arena. Son 4.2 km: no es una excursión, es una decisión de última hora.',
  p2A: 'Vuelven a comer y en la tarde los niños se van solos a la alberca. Solos, porque la privada tiene un solo acceso controlado y vigilancia las 24 horas, y porque son',
  p2Cientos: 'unos cientos de',
  p2B: 'lotes y no tres mil: en un año conoces a tus vecinos por su nombre.',
  p3: 'El perro sale al pet park, no a la banqueta. El cumpleaños se hace en el salón de eventos, no en un salón rentado del otro lado de la ciudad. El gimnasio está a dos cuadras de tu puerta y ya lo estás pagando en el mantenimiento, así que no hay membresía que cancelar en marzo.',
  p4: 'Nada de esto es una proyección. Son las amenidades que el desarrollador se comprometió a entregar, con el calendario de obra que está más abajo y las fechas que todavía no podemos confirmar.',
};
export const DOMINGO: Record<LocaleLp, typeof domingoEs> = {
  es: domingoEs,
  en: {
    titulo: 'A Sunday here',
    p1: "They leave the house at twenty to nine and by nine they're on the sand. It's 4.2 km: not an outing, a last-minute decision.",
    p2A: "They come back for lunch, and in the afternoon the kids head to the pool on their own. On their own, because the community has a single controlled entrance and 24-hour security, and because it's",
    p2Cientos: 'a few hundred',
    p2B: 'lots, not three thousand: within a year you know your neighbors by name.',
    p3: "The dog goes out to the pet park, not the sidewalk. The birthday party is held in the event hall, not in a rented hall across town. The gym is two blocks from your door and you're already paying for it in the maintenance fee, so there's no membership to cancel in March.",
    p4: "None of this is a projection. These are the amenities the developer committed to deliver, with the construction schedule further down and the dates we still can't confirm.",
  },
};

// ───────────────────────── Módulo «antes de firmar» ─────────────────────────

const disclosureEs = {
  titulo: 'Antes de firmar: lo que debes saber',
  intro:
    'Publicamos esto porque la mayoría de los anuncios de esta zona simplemente no lo menciona. Está todo aquí, agrupado: ábrelo por partes o léelo completo.',
  serviciosTitulo: 'Qué tiene el lote hoy, y qué falta',
  resumenServicios: (total: number, conectados: number) =>
    `${total} servicios · ${conectados === 0 ? 'ninguno conectado hoy' : `${conectados} conectados`}`,
  resumenServiciosVacio: 'estatus por confirmar',
  numeroPalabra: ['Cero', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'],
  pendientesTitulo: (cuantos: string, n: number) =>
    `${cuantos} cosa${n > 1 ? 's' : ''} que todavía no sabemos`,
  pendientesResumen: (n: number) => `${n} ${n > 1 ? 'datos' : 'dato'} en trámite`,
  juridicoTitulo: 'Situación jurídica, sin adjetivos',
  juridicoResumen: 'Fideicomiso · no escriturable hoy',
  costosTitulo: 'Lo que no está en el precio',
  costosResumen: (n: number) => `${n} conceptos adicionales`,
  costosResumenVacio: 'por confirmar',
  noEsTitulo: 'Para quién no es este producto',
  noEsResumen: '3 perfiles a los que no les sirve',
};
export const DISCLOSURE: Record<LocaleLp, typeof disclosureEs> = {
  es: disclosureEs,
  en: {
    titulo: 'Before you sign: what you should know',
    intro:
      "We publish this because most ads in this area simply don't mention it. It's all here, grouped: open it in parts or read it in full.",
    serviciosTitulo: 'What the lot has today, and what is missing',
    resumenServicios: (total: number, conectados: number) =>
      `${total} services · ${conectados === 0 ? 'none connected today' : `${conectados} connected`}`,
    resumenServiciosVacio: 'status to be confirmed',
    numeroPalabra: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'],
    pendientesTitulo: (cuantos: string, n: number) =>
      `${cuantos} thing${n > 1 ? 's' : ''} we don't know yet`,
    pendientesResumen: (n: number) => `${n} ${n > 1 ? 'items' : 'item'} in progress`,
    juridicoTitulo: 'Legal status, no adjectives',
    juridicoResumen: 'Trust · not deedable today',
    costosTitulo: "What's not in the price",
    costosResumen: (n: number) => `${n} additional charges`,
    costosResumenVacio: 'to be confirmed',
    noEsTitulo: "Who this product isn't for",
    noEsResumen: "3 profiles it doesn't suit",
  },
};

// ───────────────────────── Urbanización real ─────────────────────────

const urbaEs = {
  hoyNinguno: 'Hoy no hay ningún servicio conectado.',
  hoyNingunoCuerpo:
    'Ninguno. Todos están proyectados. Lo ponemos antes de la tabla, no después, porque es el dato que más cambia la decisión y el que la mayoría de los anuncios de esta zona omite.',
  fechas:
    'Fechas declaradas por el desarrollador, sujetas a su calendario de obra. Corresponden a una etapa cuya correspondencia con este lote todavía no está confirmada. Pídelo por escrito antes de firmar, y si no te lo dan por escrito, eso también es información.',
};
export const URBA: Record<LocaleLp, typeof urbaEs> = {
  es: urbaEs,
  en: {
    hoyNinguno: 'Today there are no utilities connected.',
    hoyNingunoCuerpo:
      "None. All of them are projected. We put this before the table, not after, because it's the fact that changes the decision most and the one most ads in this area leave out.",
    fechas:
      "Dates stated by the developer, subject to its construction schedule. They correspond to a phase whose match to this lot is not yet confirmed. Ask for it in writing before you sign, and if they won't give it to you in writing, that's information too.",
  },
};

// ───────────────────────── Pendientes («lo que todavía no sabemos») ─────────────────────────

const pendientesEs = {
  etapaTitulo: 'A qué etapa pertenece este lote',
  etapa:
    'Determina si el plazo de financiamiento es de 48 o de 60 meses, y en qué momento le toca la urbanización. Las fechas que publicamos abajo son de una etapa cuya correspondencia con este lote todavía no está confirmada.',
  tasaTitulo: 'La tasa del financiamiento, por escrito',
  tasa: 'El desarrollador describe los plazos como meses sin intereses, pero no ha declarado la tasa como dato. Hasta que lo haga no publicamos la mensualidad: preferimos dejar el hueco a que descubras un interés que no anunciamos.',
  apartadoTitulo: 'Las condiciones de devolución del apartado',
  apartado:
    'Es la pregunta que más conviene resolver antes de entregar dinero, y la estamos pidiendo por escrito.',
  licenciaTitulo: 'Licencia del desarrollo y autorización de venta municipal',
  licencia:
    'Son obligatorias en la publicidad de lotes conforme al artículo 69 de la Ley de Asentamientos Urbanos de Quintana Roo. Las estamos recabando.',
  intro:
    'Publicamos esto porque la mayoría de los anuncios de esta zona simplemente no lo menciona.',
  cierre: (plural: boolean): string =>
    plural
      ? 'Las pedimos por escrito y las publicamos aquí en cuanto lleguen. Si necesitas alguna antes de avanzar, dínoslo y te la mandamos el mismo día en que la tengamos.'
      : 'La pedimos por escrito y la publicamos aquí en cuanto llegue. Si necesitas alguna antes de avanzar, dínoslo y te la mandamos el mismo día en que la tengamos.',
};
export const PENDIENTES: Record<LocaleLp, typeof pendientesEs> = {
  es: pendientesEs,
  en: {
    etapaTitulo: 'Which phase this lot belongs to',
    etapa:
      'It determines whether the financing term is 48 or 60 months, and when urbanization reaches it. The dates we publish below are for a phase whose match to this lot is not yet confirmed.',
    tasaTitulo: 'The financing rate, in writing',
    tasa: "The developer describes the terms as interest-free months, but has not stated the rate as data. Until it does, we don't publish the monthly payment: we'd rather leave the gap than have you discover an interest charge we didn't advertise.",
    apartadoTitulo: 'The refund terms for the reservation deposit',
    apartado:
      "It's the question most worth resolving before handing over any money, and we're requesting it in writing.",
    licenciaTitulo: 'Development license and municipal sales authorization',
    licencia:
      "They are mandatory in lot advertising under Article 69 of the Quintana Roo Urban Settlements Law. We're gathering them.",
    intro: "We publish this because most ads in this area simply don't mention it.",
    cierre: (plural: boolean) =>
      plural
        ? "We're requesting them in writing and will publish them here as soon as they arrive. If you need any of them before moving forward, tell us and we'll send it to you the same day we have it."
        : "We're requesting it in writing and will publish it here as soon as it arrives. If you need it before moving forward, tell us and we'll send it to you the same day we have it.",
  },
};

// ───────────────────────── Situación jurídica y licencia ─────────────────────────

const juridicaEs = {
  regimen: 'Régimen',
  regimenFin:
    '. Opera con reglamento de construcción y comité de arquitectura que revisa cada proyecto antes de iniciar obra.',
  usoSuelo: 'Uso de suelo',
  porConfirmar: 'por confirmar',
  usoSueloFin:
    ', con COS 0.55 y CUS 1.60 según la ficha técnica del desarrollador. Definen cuánto puedes ocupar en planta y cuánto construir en total.',
  escrituracion: 'Escrituración',
  escrituracionTexto:
    'Proyectada a finales de 2026 según el desarrollador. Hoy el título está en fideicomiso, así que el lote no es escriturable. No usamos la expresión «certeza jurídica absoluta»: ninguna comercializadora puede sostenerla.',
  renta: 'Renta de corto plazo',
  rentaSi:
    'Permitida conforme a los estatutos de la privada, una vez que exista construcción. Un terreno sin construir no genera renta.',
  rentaNo: 'No permitida conforme a los estatutos de la privada.',
};
export const JURIDICA: Record<LocaleLp, typeof juridicaEs> = {
  es: juridicaEs,
  en: {
    regimen: 'Property regime',
    regimenFin:
      '. It operates with building regulations and an architecture committee that reviews each project before construction begins.',
    usoSuelo: 'Zoning',
    porConfirmar: 'to be confirmed',
    usoSueloFin:
      ", with COS (lot coverage) 0.55 and CUS (floor-area ratio) 1.60 according to the developer's technical sheet. They define how much you can cover on the ground floor and how much you can build in total.",
    escrituracion: 'Deed',
    escrituracionTexto:
      'Projected for late 2026 according to the developer. Today the title is held in a trust (fideicomiso), so the lot cannot be deeded. We don\'t use the phrase “absolute legal certainty”: no sales agency can stand behind it.',
    renta: 'Short-term rental',
    rentaSi:
      "Allowed under the community's bylaws, once there is construction. Undeveloped land doesn't generate rent.",
    rentaNo: "Not allowed under the community's bylaws.",
  },
};

const licenciaEs = {
  titulo: 'Licencia y autorización de venta',
  licencia: 'Licencia del desarrollo',
  fechaLicencia: 'Fecha de licencia',
  autorizacion: 'Autorización de venta',
  fechaAutorizacion: 'Fecha de autorización',
  pendienteTitulo: 'Licencia del desarrollo y autorización de venta municipal',
  cta: 'Pídelas y te las mandamos el mismo día en que las tengamos.',
  ctaLink: 'Pedirlas',
  cuerpo:
    'Son obligatorias conforme al artículo 69 de la Ley de Asentamientos Urbanos de Quintana Roo. Todavía no las tenemos por escrito del desarrollador; las estamos recabando y se publican aquí en cuanto lleguen.',
  cuerpoLink: 'Qué más falta',
  enTramite: 'En trámite',
  verificado: 'Verificado el',
};
export const LICENCIA: Record<LocaleLp, typeof licenciaEs> = {
  es: licenciaEs,
  en: {
    titulo: 'License and sales authorization',
    licencia: 'Development license',
    fechaLicencia: 'License date',
    autorizacion: 'Sales authorization',
    fechaAutorizacion: 'Authorization date',
    pendienteTitulo: 'Development license and municipal sales authorization',
    cta: "Ask for them and we'll send them to you the same day we have them.",
    ctaLink: 'Request them',
    cuerpo:
      "They are mandatory under Article 69 of the Quintana Roo Urban Settlements Law. We don't have them in writing from the developer yet; we're gathering them and they will be published here as soon as they arrive.",
    cuerpoLink: 'What else is missing',
    enTramite: 'In progress',
    verificado: 'Verified on',
  },
};

// ───────────────────────── Costos y «para quién no es» ─────────────────────────

const costosEs = {
  intro:
    'El precio del lote no es el costo de adquirirlo. Estos son los conceptos adicionales que el desarrollador declara, para que calcules tu presupuesto completo antes de hablar con nosotros y no después.',
  escrituracion: 'Escrituración',
  cierre: (min: number, max: number) => `${min}% a ${max}% del valor de venta`,
  noIncluye: 'No incluye',
  mantenimiento: 'Mantenimiento',
  mantenimientoRango: (a: string, b: string) => `${a} a ${b} al mes`,
  mantenimientoPorDefinir: 'Monto final por definir, más cerca de la entrega',
  reembolsable: ', reembolsable',
  noReembolsable: ', no reembolsable',
  indexado:
    'Es un cargo indexado: se calcula con el salario mínimo vigente el día que inicies obra, no con el de hoy. Te pasamos el equivalente en pesos y el salario mínimo que aplica en cuanto el desarrollador lo confirme por escrito.',
  pie: 'Condiciones publicadas por el desarrollador, sujetas a cambio y disponibilidad. Conviene confirmar vigencia y lote específico al momento de decidir.',
};
export const COSTOS: Record<LocaleLp, typeof costosEs> = {
  es: costosEs,
  en: {
    intro:
      "The lot price isn't the cost of acquiring it. These are the additional charges the developer states, so you can work out your full budget before talking to us, not after.",
    escrituracion: 'Closing costs',
    cierre: (min: number, max: number) => `${min}% to ${max}% of the sale value`,
    noIncluye: 'Does not include',
    mantenimiento: 'Maintenance',
    mantenimientoRango: (a: string, b: string) => `${a} to ${b} per month`,
    mantenimientoPorDefinir: 'Final amount to be defined, closer to delivery',
    reembolsable: ', refundable',
    noReembolsable: ', non-refundable',
    indexado:
      "This is an indexed charge: it's calculated with the minimum wage in force the day you start construction, not today's. We'll give you the peso equivalent and the minimum wage that applies as soon as the developer confirms it in writing.",
    pie: "Terms published by the developer, subject to change and availability. It's worth confirming validity and the specific lot when you decide.",
  },
};

const noEsEs = {
  p1: 'Comprar el terreno y poder construir no ocurren el mismo día. La escrituración está proyectada para finales de 2026 según el desarrollador, y hoy el título está en fideicomiso: el lote no es escriturable en este momento. La construcción depende de que se entreguen servicios y vialidades, proyectados hacia el último trimestre de 2027.',
  p2: 'Si necesitas mudarte pronto, este no es tu producto y es mejor decirlo ahora. Si esperas rendimiento por renta desde el primer día, un terreno no lo da: lo da lo que construyas encima.',
  p3A: 'Y si tu presupuesto total no alcanza el precio del lote más los gastos de escrituración',
  adicional: (min: number, max: number) => `(${min}% a ${max}% adicional)`,
  p3B: 'más los cargos únicos que listamos en este mismo bloque, conviene esperar en lugar de estirarte.',
};
export const NOES: Record<LocaleLp, typeof noEsEs> = {
  es: noEsEs,
  en: {
    p1: "Buying the land and being able to build don't happen on the same day. The deed is projected for late 2026 according to the developer, and today the title is held in a trust (fideicomiso): the lot can't be deeded right now. Construction depends on utilities and roads being delivered, projected for the last quarter of 2027.",
    p2: "If you need to move soon, this isn't your product and it's better to say so now. If you expect rental income from day one, land doesn't provide it: what you build on top does.",
    p3A: "And if your total budget doesn't cover the lot price plus the deeding costs",
    adicional: (min: number, max: number) => `(${min}% to ${max}% additional)`,
    p3B: "plus the one-time charges we list in this same section, it's better to wait than to stretch.",
  },
};

// ───────────────────────── Comparador ─────────────────────────

const comparadorEs = {
  titulo: 'Terrenos residenciales en la Riviera Maya',
  intro:
    'Somos comercializadora, no desarrolladora: si ninguno encaja con tu presupuesto o tu superficie, dínoslo y te buscamos otro en la zona.',
  anterior: 'Lote anterior',
  siguiente: 'Lote siguiente',
  esDeEstaLanding: ' · el de este anuncio',
  superficiePorConfirmar: 'Superficie por confirmar',
  imagenes: 'Imágenes proporcionadas por cada desarrollador; pueden incluir renders del proyecto.',
  plazo: 'Plazo',
  meses: 'meses',
  alMes: 'al mes',
  pagosSinIntereses: (n: number) => `${n} pagos sin intereses`,
  descuentoA: (meses: number) => `Precio a ${meses} meses`,
  descuentoB: (pct: string) => `: el desarrollador descuenta ${pct}% sobre los`,
  descuentoC: 'de lista por pagar en menos tiempo.',
  precio: 'Precio',
  enganche: 'Enganche',
  alFirmar: 'Al firmar',
  mensualidades: 'Mensualidades',
  pagosDe: (n: number, monto: string) => `${n} pagos de ${monto}`,
  contraentrega: 'Contra entrega',
  alEntregarHipotecario: 'Al entregar. El desarrollador lo plantea con crédito hipotecario.',
  alEntregar: 'Al entregar',
  contadoA: 'Pagándolo de contado, el desarrollador descuenta',
  apartadoA: 'El apartado para reservarlo es de',
  soloPublicamos:
    'Solo publicamos la mensualidad donde el desarrollador tiene el esquema declarado.',
  cta: 'Pedir el detalle de este lote',
  /** `null` en español: se usa la prosa que ya trae el data layer. */
  motivo: null as
    | null
    | ((codigo: string, contado: { enganchePct: number; contraentregaPct: number } | null) => string),
  etiqueta: null as null | ((ciudad: string, superficie: string | null, precio: string) => string),
};
export const COMPARADOR: Record<LocaleLp, typeof comparadorEs> = {
  es: comparadorEs,
  en: {
    titulo: 'Residential Lots in the Riviera Maya',
    intro:
      "We're a sales agency, not a developer: if none of these fits your budget or size, tell us and we'll find you another in the area.",
    anterior: 'Previous lot',
    siguiente: 'Next lot',
    esDeEstaLanding: ' · the one in this ad',
    superficiePorConfirmar: 'Size to be confirmed',
    imagenes: 'Images provided by each developer; they may include project renderings.',
    plazo: 'Term',
    meses: 'months',
    alMes: 'per month',
    pagosSinIntereses: (n: number) => `${n} payments with no interest`,
    descuentoA: (meses: number) => `Price at ${meses} months`,
    descuentoB: (pct: string) => `: the developer discounts ${pct}% off the`,
    descuentoC: 'list price for paying in less time.',
    precio: 'Price',
    enganche: 'Down payment',
    alFirmar: 'At signing',
    mensualidades: 'Monthly payments',
    pagosDe: (n: number, monto: string) => `${n} payments of ${monto}`,
    contraentrega: 'On delivery',
    alEntregarHipotecario: 'On delivery. The developer proposes it with a mortgage loan.',
    alEntregar: 'On delivery',
    contadoA: 'If paid in cash, the developer discounts',
    apartadoA: 'The deposit to reserve it is',
    soloPublicamos:
      'We only publish the monthly payment where the developer has stated the scheme.',
    cta: 'Request the details of this lot',
    motivo: (codigo, contado) => {
      switch (codigo) {
        case 'contado_parcial':
          return `This lot is paid ${contado?.enganchePct ?? 0}% at signing and ${contado?.contraentregaPct ?? 0}% on delivery. The developer does not publish a monthly payment plan.`;
        case 'contado':
          return 'This lot is sold for cash. The developer does not publish a monthly payment plan.';
        case 'condiciones_cambiando':
          return "The payment terms for this lot have changed and we're confirming them before publishing.";
        default:
          return "We don't publish monthly payments for this lot yet because the rate is still to be confirmed.";
      }
    },
    etiqueta: (ciudad, superficie, precio) =>
      [ciudad, superficie, `from ${precio}`].filter(Boolean).join(' · '),
  },
};

// ───────────────────────── Fechas ─────────────────────────

const MESES: Record<LocaleLp, string[]> = {
  es: [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

/** 'YYYY-MM' → 'octubre de 2027' / 'October 2027'. null si no parsea. */
export function mesAnioL(valor: string | null, locale: LocaleLp): string | null {
  if (!valor) return null;
  const m = /^(\d{4})-(\d{2})/.exec(valor);
  if (!m) return null;
  const mes = MESES[locale][Number(m[2]) - 1];
  if (!mes) return null;
  return locale === 'en' ? `${mes} ${m[1]}` : `${mes} de ${m[1]}`;
}

/** 'YYYY-MM-DD' → '11 de agosto de 2026' / 'August 11, 2026'. */
export function fechaLargaL(valor: string, locale: LocaleLp): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor);
  if (!m) return null;
  const mes = MESES[locale][Number(m[2]) - 1];
  if (!mes) return null;
  return locale === 'en' ? `${mes} ${Number(m[3])}, ${m[1]}` : `${Number(m[3])} de ${mes} de ${m[1]}`;
}
