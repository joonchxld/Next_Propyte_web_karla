// ============================================================
// Localización del DATO de la landing de lotes.
//
// `getLotePlayaDelCarmen()` devuelve en español lo que viene del Hub y lo que
// el data layer curó a mano (pies de foto, etiquetas de servicio). Ese módulo
// lo comparten otras landings, así que NO se toca: en inglés se aplica este
// reemplazo por CLAVE sobre el resultado, antes de pasarlo a los componentes.
//
// Reglas:
//   · En español devuelve el mismo objeto, sin copiarlo.
//   · Solo se traduce lo CONOCIDO (claves de imagen, claves de servicio, estados
//     y regímenes que el Hub ya usa). Lo desconocido se publica tal cual en vez
//     de adivinar una traducción.
//   · Nada de números ni de afirmaciones nuevas: cada texto en inglés dice lo
//     mismo que su original.
// ============================================================

import type { ImagenesLanding, LoteLanding } from '@/lib/supabase/lp-lotes';
import { splitBilingualRole } from '@/lib/team/bilingual-role';
import type { LocaleLp } from '../_components/v2/i18n';

type TextoImagen = { alt: string; caption: string };

/** Alt y pie de cada imagen curada, en inglés. Misma clave que `IMAGENES_CURADAS`. */
export const IMAGENES_EN: Record<keyof ImagenesLanding, TextoImagen> = {
  hero: {
    alt: 'Aerial rendering of the gated community: tree-lined streets, two-story homes and the pool area in the center',
    caption: "The finished community, according to the developer's plans.",
  },
  domingo: {
    alt: 'Community pool with loungers and palapas, and the clubhouse in the background, with residents using it',
    caption: 'The community pool and the clubhouse, as planned.',
  },
  amenidades: {
    alt: 'Padel and pickleball courts among the trees, with neighbors playing and others sitting on the benches',
    caption:
      'The courts, as planned. They are delivered according to the construction schedule further down.',
  },
  urbanizacion: {
    alt: 'Real aerial view of the site: the roads and the marked-out lots, still unbuilt and not yet urbanized',
    caption:
      'The site today: roads laid out and lots marked out, not yet urbanized and not yet built on.',
  },
  alberca: {
    alt: 'Pool with loungers under umbrellas and a palapa with grills in the background, with residents in the water',
    caption: 'The community pool, as planned.',
  },
  casaClub: {
    alt: 'Exterior of the clubhouse at dusk, with the lit dining room behind large windows and a tropical garden in front',
    caption: 'The clubhouse, as planned.',
  },
  casaClubComedor: {
    alt: 'Covered dining area of the clubhouse next to the pool, with long wooden tables and a terracotta stucco wall',
    caption: 'The clubhouse dining area, as planned.',
  },
  gimnasio: {
    alt: 'Single-story gym with stone walls and floor-to-ceiling windows, surrounded by greenery, with equipment and bikes inside',
    caption: 'The gym, as planned.',
  },
  canchasCenital: {
    alt: 'Top-down view of the courts: two blue padel courts and one multipurpose basketball court, separated by tree-lined medians',
    caption: 'The courts seen from above, as planned.',
  },
  andador: {
    alt: 'Concrete pedestrian walkway in the shade of mature trees, with the courts and a planter in the background',
    caption: 'The walkways and the tree cover, as planned.',
  },
  cine: {
    alt: 'Outdoor cinema under the trees: a large screen showing a match and wooden picnic tables with neighbors seated',
    caption: 'The outdoor cinema, as planned.',
  },
  casasCenital: {
    alt: 'Top-down view of already-built lots: two-story homes with private pools and wooden terraces in the back yard, between tree-lined streets',
    caption:
      "Already-built lots, in the developer's project. The house is not included: what you buy is the land.",
  },
};

const SERVICIO_EN: Record<string, string> = {
  agua_potable: 'Drinking water',
  drenaje: 'Sanitary sewer',
  electricidad: 'Electricity',
  alumbrado_publico: 'Street lighting',
  calle: 'Roads',
  pluvial: 'Stormwater drainage',
};

/** Estados comerciales que ya usa el Hub (clave en minúsculas). */
const ESTADO_EN: Record<string, string> = {
  preventa: 'Presale',
  disponible: 'Available',
  apartado: 'Reserved',
  vendido: 'Sold',
};

/** Regímenes de propiedad conocidos (clave en minúsculas). */
const REGIMEN_EN: Record<string, string> = {
  'propiedad privada': 'Private property',
  condominio: 'Condominium',
  'régimen de condominio': 'Condominium regime',
  'regimen de condominio': 'Condominium regime',
  fraccionamiento: 'Subdivision',
};

const SUBTIPO_EN: Record<string, string> = {
  'lote residencial': 'Residential lot',
  'lote residencial en comunidad privada': 'Residential lot in a gated community',
  'semi urbanizado': 'Semi-urbanized',
  urbanizado: 'Urbanized',
};

function mapear(valor: string | null, tabla: Record<string, string>): string | null {
  if (!valor) return valor;
  return tabla[valor.trim().toLowerCase()] ?? valor;
}

/** Devuelve el mismo lote con sus textos curados en el idioma pedido. */
export function localizarLote(lote: LoteLanding, locale: LocaleLp): LoteLanding {
  if (locale === 'es') return lote;

  const imagenes = { ...lote.imagenes } as ImagenesLanding;
  for (const clave of Object.keys(IMAGENES_EN) as (keyof ImagenesLanding)[]) {
    const original = imagenes[clave];
    if (original) imagenes[clave] = { ...original, ...IMAGENES_EN[clave] };
  }

  return {
    ...lote,
    imagenes,
    servicios: lote.servicios.map((s) => ({
      ...s,
      etiqueta: SERVICIO_EN[s.clave] ?? s.etiqueta,
    })),
    estadoComercial: mapear(lote.estadoComercial, ESTADO_EN),
    regimenPropiedad: mapear(lote.regimenPropiedad, REGIMEN_EN),
    subtipoLiteral: mapear(lote.subtipoLiteral, SUBTIPO_EN),
    // El Hub guarda el cargo en bilingüe («Gerente de Ventas | Sales Manager»).
    asesor: lote.asesor
      ? { ...lote.asesor, rol: splitBilingualRole(lote.asesor.rol, 'en') }
      : null,
  };
}
