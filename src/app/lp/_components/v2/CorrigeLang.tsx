import type { LocaleLp } from './i18n';

/**
 * Corrige `<html lang>` antes de la hidratación en las landings en inglés.
 *
 * El root layout lo deja fijo en `"es"` (resolverlo ahí volvía dinámico todo el
 * sitio) y `/lp/*` vive fuera de `[locale]`, así que no hereda la corrección.
 * Sin esto, la landing en inglés se anuncia como española al lector de
 * pantalla y al traductor del navegador. Mismo patrón que `casas-riviera-maya`.
 * En español no emite nada.
 */
export default function CorrigeLang({ locale }: { locale: LocaleLp }) {
  if (locale === 'es') return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
      }}
    />
  );
}
