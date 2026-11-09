// GENERADO POR scripts/gen-lp-manifest.mjs — NO EDITAR A MANO.
// Se regenera en cada `npm run build` (prebuild). Para actualizarlo:
//   node scripts/gen-lp-manifest.mjs

export type LandingManifestEntry = {
  /** Segmento de la carpeta bajo `src/app/lp/`. */
  slug: string;
  /** Ruta servida, relativa al dominio. */
  path: string;
  /** Idioma de la landing (marca `@lp-idioma` en su page.tsx; sin marca, es). */
  idioma: 'es' | 'en';
  /** Slug de la misma landing en el otro idioma, si existe. */
  par?: string;
};

export const LP_MANIFEST: readonly LandingManifestEntry[] = [
  { slug: 'beachfront-riviera-maya', path: '/lp/beachfront-riviera-maya', idioma: 'en', par: 'frente-al-mar' },
  { slug: 'casas-merida', path: '/lp/casas-merida', idioma: 'es', par: 'homes-merida' },
  { slug: 'casas-playa-del-carmen', path: '/lp/casas-playa-del-carmen', idioma: 'es', par: 'homes-playa-del-carmen' },
  { slug: 'casas-riviera-maya', path: '/lp/casas-riviera-maya', idioma: 'es', par: 'homes-riviera-maya' },
  { slug: 'condos-riviera-maya', path: '/lp/condos-riviera-maya', idioma: 'en', par: 'departamentos-riviera-maya' },
  { slug: 'departamentos-riviera-maya', path: '/lp/departamentos-riviera-maya', idioma: 'es', par: 'condos-riviera-maya' },
  { slug: 'down-payment-land-playa-del-carmen', path: '/lp/down-payment-land-playa-del-carmen', idioma: 'en', par: 'enganche-terrenos-playa-del-carmen' },
  { slug: 'enganche-terrenos-playa-del-carmen', path: '/lp/enganche-terrenos-playa-del-carmen', idioma: 'es', par: 'down-payment-land-playa-del-carmen' },
  { slug: 'frente-al-mar', path: '/lp/frente-al-mar', idioma: 'es', par: 'beachfront-riviera-maya' },
  { slug: 'homes-merida', path: '/lp/homes-merida', idioma: 'en', par: 'casas-merida' },
  { slug: 'homes-playa-del-carmen', path: '/lp/homes-playa-del-carmen', idioma: 'en', par: 'casas-playa-del-carmen' },
  { slug: 'homes-riviera-maya', path: '/lp/homes-riviera-maya', idioma: 'en', par: 'casas-riviera-maya' },
  { slug: 'land-playa-del-carmen', path: '/lp/land-playa-del-carmen', idioma: 'en', par: 'terrenos-playa-del-carmen' },
  { slug: 'land-riviera-maya', path: '/lp/land-riviera-maya', idioma: 'en', par: 'terrenos-riviera-maya' },
  { slug: 'lotes-playa-del-carmen', path: '/lp/lotes-playa-del-carmen', idioma: 'es', par: 'lots-playa-del-carmen' },
  { slug: 'lots-playa-del-carmen', path: '/lp/lots-playa-del-carmen', idioma: 'en', par: 'lotes-playa-del-carmen' },
  { slug: 'terrenos-playa-del-carmen', path: '/lp/terrenos-playa-del-carmen', idioma: 'es', par: 'land-playa-del-carmen' },
  { slug: 'terrenos-riviera-maya', path: '/lp/terrenos-riviera-maya', idioma: 'es', par: 'land-riviera-maya' },
];
