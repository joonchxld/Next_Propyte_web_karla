import type { LocaleLp } from '../../_components/v2/i18n';

// ============================================================
// El formateador de dinero de la variante C. UNA definición, dos entornos.
//
// ═══ POR QUÉ ESTE ARCHIVO EXISTE ═══
//
// El primer intento pasó `mxn` como PROP desde `page.tsx` (server) hacia
// `DesgloseEnganche` (`'use client'`). El build lo rechazó:
//
//   Functions cannot be passed directly to Client Components unless you
//   explicitly expose it by marking it with "use server".
//
// Y lo rechazó en la fase de PRERENDER, no al compilar: `tsc` daba 0 errores y
// el log decía «Compiled successfully» antes de morir. Un `npm run build`
// pipeado a `grep` se lo comía entero.
//
// La salida obvia era duplicar el `Intl.NumberFormat` dentro del componente
// cliente, y es justo la que no hay que tomar: dos definiciones del formato del
// dinero divergen: la que lleva «MXN» y la que se le olvidó. En una página que
// publica cifras de siete cifras eso no es cosmético — el `$` de es-MX se lee
// como dólar.
//
// Un módulo sin directiva se empaqueta en los DOS lados, así que la definición
// sigue siendo una sola.
// ============================================================

// ═══ INGLÉS ═══
//
// Los pesos NO se convierten a dólares. En inglés se imprimen igual que en
// español —«$202,176 MXN»—, con la moneda pegada a la cifra: el visitante de
// EE.UU. o Canadá lee `$` como dólar, que es justo el malentendido que el
// «MXN» existe para evitar. Cambia solo el locale del separador de miles.
const MXN_EN = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const MXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

/**
 * Toda cifra de dinero de la variante C sale por aquí, y por aquí sale SIEMPRE
 * con «MXN» pegada. Ver la regla 3 de la cabecera de `page.tsx`.
 */
export const mxn = (n: number, locale: LocaleLp = 'es') =>
  locale === 'en'
    ? `$${MXN_EN.format(Math.round(n))} MXN`
    : `${MXN.format(Math.round(n))} MXN`;

const M2 = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });
const M2_EN = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

/** Superficie en m². No se convierte a pies cuadrados: sería una cifra nueva. */
export const m2 = (n: number, locale: LocaleLp = 'es') =>
  `${(locale === 'en' ? M2_EN : M2).format(n)} m²`;
