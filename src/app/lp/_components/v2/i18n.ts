// Idioma de las landings de pago (9-nov-2026).
//
// Las landings viven fuera de `[locale]` (ver `homes-riviera-maya/page.tsx`):
// no hay next-intl aquí. Cada landing en inglés es la MISMA página con su
// diccionario, y el kit recibe `locale` como prop con `'es'` por defecto, para
// que las landings en español no cambien en nada.
//
// Lo que NO se traduce: los precios siguen en su moneda (MXN o USD) y los
// nombres de ciudades, zonas y desarrollos vienen del Hub tal cual.

export type LocaleLp = 'es' | 'en';

/** Rutas legales: el sitio sí tiene versión `/en/` de ambas. */
export function rutaLegal(locale: LocaleLp, pagina: 'privacidad' | 'terminos'): string {
  return `/${locale}/${pagina}`;
}

export const KIT = {
  es: {
    privacidad: 'Privacidad',
    terminos: 'Términos',
    whatsappAria: 'Escribir por WhatsApp',
    fotoAnterior: 'Foto anterior',
    fotoSiguiente: 'Foto siguiente',
    sinFoto: 'Sin fotografía',
    faqTitulo: 'Preguntas frecuentes',
    todas: 'Todas',
    porUbicacionAria: 'Ver inventario por ubicación',
  },
  en: {
    privacidad: 'Privacy',
    terminos: 'Terms',
    whatsappAria: 'Message us on WhatsApp',
    fotoAnterior: 'Previous photo',
    fotoSiguiente: 'Next photo',
    sinFoto: 'No photo available',
    faqTitulo: 'Frequently asked questions',
    todas: 'All',
    porUbicacionAria: 'Browse listings by location',
  },
} as const satisfies Record<LocaleLp, Record<string, string>>;
