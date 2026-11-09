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
  { slug: 'casas-merida', path: '/lp/casas-merida', idioma: 'es' },
  { slug: 'casas-playa-del-carmen', path: '/lp/casas-playa-del-carmen', idioma: 'es' },
  { slug: 'casas-riviera-maya', path: '/lp/casas-riviera-maya', idioma: 'es', par: 'homes-riviera-maya' },
  { slug: 'departamentos-riviera-maya', path: '/lp/departamentos-riviera-maya', idioma: 'es' },
  { slug: 'enganche-terrenos-playa-del-carmen', path: '/lp/enganche-terrenos-playa-del-carmen', idioma: 'es' },
  { slug: 'frente-al-mar', path: '/lp/frente-al-mar', idioma: 'es' },
  { slug: 'homes-riviera-maya', path: '/lp/homes-riviera-maya', idioma: 'en', par: 'casas-riviera-maya' },
  { slug: 'lotes-playa-del-carmen', path: '/lp/lotes-playa-del-carmen', idioma: 'es' },
  { slug: 'terrenos-playa-del-carmen', path: '/lp/terrenos-playa-del-carmen', idioma: 'es' },
  { slug: 'terrenos-riviera-maya', path: '/lp/terrenos-riviera-maya', idioma: 'es' },
];
