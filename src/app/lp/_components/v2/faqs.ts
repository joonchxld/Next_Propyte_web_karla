import type { Faq } from './FaqAcordeon';

// ============================================================
// Preguntas de «compra» y «financiamiento» del sitio (`/es/faq`, namespace
// `faq` de `src/i18n/messages/es.json`), copiadas aquí para que la landing no
// dependa de next-intl (vive fuera de `[locale]`). Si cambian allí, cambian
// aquí: son las mismas respuestas y deben seguir diciéndolo igual.
// ============================================================

export const FAQ_COMPRA: Faq[] = [
  {
    q: '¿Puedo comprar propiedad en México siendo extranjero?',
    a: 'Sí. Los extranjeros pueden comprar propiedad en México. En zonas restringidas (50 km de la costa, 100 km de fronteras), se requiere un fideicomiso bancario que te otorga los mismos derechos que un propietario mexicano.',
  },
  {
    q: '¿Cuánto cuestan los gastos de escrituración?',
    a: 'Los gastos de escrituración varían por estado: 6-8% del valor de la propiedad en Quintana Roo (Cancún, Tulum, Playa del Carmen) y 5-7% en Yucatán (Mérida). Incluyen impuesto de adquisición, honorarios notariales y derechos de registro.',
  },
  {
    q: '¿Cuánto tiempo tarda el proceso de compra?',
    a: 'El proceso completo toma entre 30-90 días dependiendo del tipo de propiedad y financiamiento. Compras de contado son más rápidas (30-45 días). Con crédito hipotecario puede extenderse a 60-90 días.',
  },
  {
    q: '¿Qué es un fideicomiso bancario?',
    a: 'Es un instrumento legal donde un banco mexicano mantiene la propiedad a nombre del comprador extranjero. Te otorga derechos completos de uso, renta, venta y herencia. Se renueva cada 50 años automáticamente.',
  },
];

export const FAQ_FINANCIAMIENTO: Faq[] = [
  {
    q: '¿Puedo obtener un crédito hipotecario como extranjero?',
    a: 'Algunos bancos mexicanos ofrecen hipotecas a extranjeros con residencia temporal o permanente. Los requisitos suelen ser más estrictos y las tasas ligeramente más altas que para nacionales.',
  },
  {
    q: '¿Qué es el financiamiento directo del desarrollador?',
    a: 'Es un plan de pago donde pagas directamente al desarrollador en mensualidades durante la construcción, típicamente a 0% de interés. Requiere un enganche del 20-30% y el saldo se cubre en 12-36 meses.',
  },
  {
    q: '¿Propyte cobra comisión a los compradores?',
    a: 'No. Nuestro servicio es gratuito para compradores e inversionistas. Trabajamos con desarrolladores que cubren nuestros honorarios como parte de su estrategia de venta.',
  },
];

export const FAQ_COMPRA_Y_FINANCIAMIENTO: Faq[] = [...FAQ_COMPRA, ...FAQ_FINANCIAMIENTO];

// ── Inglés (9-nov-2026). Mismas respuestas que `/en/faq`, sin cifras nuevas. ──

export const FAQ_COMPRA_EN: Faq[] = [
  {
    q: 'Can I buy property in Mexico as a foreigner?',
    a: 'Yes. Foreigners can buy property in Mexico. In the restricted zone (within 50 km of the coast or 100 km of a border) the purchase is made through a bank trust (fideicomiso), which gives you the same rights as a Mexican owner.',
  },
  {
    q: 'How much are closing costs?',
    a: 'Closing costs vary by state: 6-8% of the property value in Quintana Roo (Cancún, Tulum, Playa del Carmen) and 5-7% in Yucatán (Mérida). They include acquisition tax, notary fees and registration fees.',
  },
  {
    q: 'How long does the buying process take?',
    a: 'The full process takes 30 to 90 days depending on the property type and financing. Cash purchases are faster (30-45 days); with a mortgage it can take 60-90 days.',
  },
  {
    q: 'What is a bank trust (fideicomiso)?',
    a: 'A legal arrangement in which a Mexican bank holds the title on behalf of the foreign buyer. You keep full rights to use, rent, sell and bequeath the property. It renews automatically every 50 years.',
  },
];

export const FAQ_FINANCIAMIENTO_EN: Faq[] = [
  {
    q: 'Can I get a mortgage in Mexico as a foreigner?',
    a: 'Some Mexican banks offer mortgages to foreigners with temporary or permanent residency. Requirements are usually stricter and rates slightly higher than for Mexican nationals.',
  },
  {
    q: 'What is developer financing?',
    a: 'A payment plan where you pay the developer directly in monthly installments during construction, typically at 0% interest. It requires a 20-30% down payment and the balance is paid over 12-36 months.',
  },
  {
    q: 'Does Propyte charge buyers a commission?',
    a: 'No. Our service is free for buyers and investors. The developers we work with cover our fees as part of their sales strategy.',
  },
];

export const FAQ_COMPRA_Y_FINANCIAMIENTO_EN: Faq[] = [...FAQ_COMPRA_EN, ...FAQ_FINANCIAMIENTO_EN];
