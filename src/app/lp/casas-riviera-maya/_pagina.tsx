import Image from 'next/image';
import Link from 'next/link';
import { getCasasRivieraMaya, resumenInventario } from '@/lib/supabase/lp-casas';
import { enIdioma, ubicaciones } from '@/lib/supabase/lp-inventario';
import type { PropiedadLanding } from '@/lib/supabase/lp-inventario';
import { FALLBACK_WHATSAPP } from '@/lib/site-contact';
import { dinero, dineroCompacto } from '../_components/format';
import FormAutonomo from './_components/FormAutonomo';
import BarraCasas from './_components/BarraCasas';
import Colofon from './_components/Colofon';
import Laminas from './_components/Laminas';
import type { CopyCasas } from './_copy';
import '../_components/v2/tokens.css';
import './lpc-theme.css';
import './monografia.css';

// ============================================================
// Landing de pago de CASAS — Riviera Maya. Diseño «monografía» con la
// identidad oficial de Propyte (manual de marca 2026; ver DESIGN.md en la
// raíz del repo). Lo sirven dos rutas: `/lp/casas-riviera-maya` (español) y
// `/lp/homes-riviera-maya` (inglés); cada `page.tsx` solo elige el diccionario.
//
// La página abre con UNA casa real a sangre y su precio, una franja Aztec
// (el colofón) dice cuántas hay y dónde y filtra por ciudad, y después cada
// casa es una lámina: foto con su columna de datos, alternando lado.
//
// Reglas que no se negocian (heredadas del diseño anterior):
//   · TODA cifra sale del inventario (`getCasasRivieraMaya()`).
//   · CERO enlaces de salida salvo los legales.
//   · El formulario está visible en el primer pliegue, también en móvil.
//   · Nada de urgencia inventada ni nombres de desarrollo.
// El formulario es el MISMO `FormCasas` de siempre, re-tintado a panel de
// vidrio Aztec por variables CSS (`.lpm-hoja` en monografia.css): su lógica de
// envío, atribución y validación no se duplica.
// ============================================================

/**
 * Corrige `<html lang>` antes de la hidratación: `/lp/*` vive fuera de
 * `[locale]` y el root layout deja `"es"` estático (ver la nota de julio-2026
 * sobre `DYNAMIC_SERVER_USAGE`). Solo se emite en inglés.
 */
function CorrigeLang({ copy }: { copy: CopyCasas }) {
  if (copy.locale === 'es') return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(copy.locale)}`,
      }}
    />
  );
}

export default async function PaginaCasas({ copy }: { copy: CopyCasas }) {
  const casas = enIdioma(await getCasasRivieraMaya(), copy.locale);
  const resumen = resumenInventario(casas);

  if (casas.length === 0) {
    return (
      <div className={`lpc-root lpm-root`}>
        <CorrigeLang copy={copy} />
        <div className="mx-auto max-w-2xl px-5 py-32 sm:px-8">
          <h1 className="lpm-display text-[clamp(1.75rem,1.3rem+2vw,2.75rem)]">{copy.vacio.titulo}</h1>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--lpc-ink-2)]">{copy.vacio.cuerpo}</p>
          <a
            href={`https://wa.me/${FALLBACK_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lpm-boton mt-9"
          >
            {copy.vacio.cta}
          </a>
        </div>
      </div>
    );
  }

  // La portada es la casa de ENTRADA (el data layer ordena por precio
  // ascendente) que tenga foto: el titular dice «desde $X» y la foto tiene que
  // ser esa casa, no la más bonita. Si la promesa y la imagen no coinciden, el
  // visitante lo nota en la primera lámina.
  const portada = casas.find((c) => c.imagen) ?? null;
  const desde = resumen.desde ? dineroCompacto(resumen.desde) : null;
  const [tituloL1, tituloL2] = copy.hero.titulo(desde);
  const subtitulo = copy.hero.cuerpo({
    ciudades: resumen.ciudades,
    preventa: resumen.preventa > 0,
    inmediata: resumen.entregaInmediata > 0,
    engancheMin: resumen.engancheMinimoPct,
    directo: resumen.financiamientoDirecto,
  });

  // Mismas claves que usa el filtro de las láminas (`ubicaciones` normaliza).
  const ciudades = ubicaciones(
    casas.map((c) => ({ ciudad: c.ciudad, zona: c.zona }) as PropiedadLanding),
    'ciudad',
  ).map((u) => ({ clave: u.clave, etiqueta: u.nombre, total: u.total }));

  const datosColofon = [
    resumen.desde && resumen.hasta
      ? `${dineroCompacto(resumen.desde)} – ${dineroCompacto(resumen.hasta)}`
      : null,
    resumen.engancheMinimoPct ? copy.monografia.engancheDesde(resumen.engancheMinimoPct) : null,
    copy.hero.badges.entrega[1](resumen.preventa > 0, resumen.entregaInmediata > 0),
  ].filter(Boolean) as string[];

  const opciones = casas.map((c) => ({ slug: c.slug, titulo: c.titulo }));

  return (
    <div className={`lpc-root lpv lpm-root`}>
      <CorrigeLang copy={copy} />
      {/* ══════════ PORTADA ══════════ */}
      <section className="lpm-portada relative">
        <div className="lpm-portada-foto relative">
          {portada?.imagen && (
            <Image
              src={portada.imagen}
              alt={copy.hero.altFoto(portada.zona ?? portada.ciudad, portada.ciudad)}
              fill
              priority
              sizes="100vw"
              className="lpm-asentar object-cover"
            />
          )}
          <div className="lpm-velo" aria-hidden />
          <div className="lpm-reticula" aria-hidden />

          <div className="relative mx-auto flex h-full max-w-[92rem] flex-col justify-between gap-16 px-5 pb-6 pt-24 sm:px-8 lg:pb-10 lg:pt-36">
            <div className="max-w-[44rem] lg:max-w-[calc(100%-31rem)]">
              <h1 className="lpm-display text-[clamp(2.6rem,1.2rem+5.2vw,6rem)] text-white">
                {tituloL1}
                <br />
                <span className="lpm-cifra lpm-acento">{tituloL2.replace(/ (M|MXN|USD)\b/g, ' $1')}</span>
              </h1>
              <p className="mt-4 max-w-[50ch] text-[0.9375rem] leading-relaxed text-white/90 sm:mt-6 sm:text-[1.125rem]">{subtitulo}</p>
            </div>
            {portada && (
              <p className="lpm-pie hidden max-w-[60ch] text-white/80 sm:block lg:max-w-[calc(100%-31rem)]">
                {copy.monografia.enPortada}: {portada.titulo}
                {portada.precio ? ` · ${dinero(portada.precio)}` : ''} · {portada.zona ? `${portada.zona}, ` : ''}
                {portada.ciudad}
              </p>
            )}
          </div>
        </div>

        {/* Colofón: la franja negra con las cifras vivas. Las ciudades son
            filtros reales de las láminas de abajo. */}
        <Colofon ciudades={ciudades} total={casas.length} datos={datosColofon} locale={copy.locale} />

        {/* Hoja de solicitud. En escritorio se monta sobre la foto y la
            franja; en móvil va justo después del colofón. */}
        <div className="lpm-hoja-ancla">
          <div className="lpm-hoja" id="solicitar-portada">
            <FormAutonomo casas={opciones} telefonoWhatsApp={FALLBACK_WHATSAPP} locale={copy.locale} />
          </div>
        </div>
      </section>

      {/* ══════════ LÁMINAS + CIERRE ══════════ */}
      <Laminas casas={casas} telefonoWhatsApp={FALLBACK_WHATSAPP} locale={copy.locale} />

      {/* ══════════ CÓMO PUBLICAMOS ══════════
          Las afirmaciones y la revisión como notas al final del libro: texto
          en columnas con filete, sin tarjetas ni iconos en caja. */}
      <section className="lpm-notas">
        <div className="mx-auto grid max-w-[92rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <h2 className="lpm-display text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] lg:col-span-4">
            {copy.revision.titulo}
          </h2>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
            {[...copy.revision.puntos, ...copy.afirmaciones].map(([titulo, cuerpo]) => (
              <div key={titulo} className="border-t border-[rgb(72_115_121/0.25)] pt-5">
                <h3 className="lpm-subtitulo">{titulo}</h3>
                <p className="mt-2 max-w-[48ch] text-[0.9375rem] leading-relaxed text-[var(--lpm-slate)]">{cuerpo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[var(--lpm-aztec)] pb-24 sm:pb-8">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-3 px-5 py-7 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-[62ch] leading-relaxed">
            {copy.pie.aviso}
            {resumen.desde && resumen.hasta
              ? ` ${copy.pie.inventario(casas.length, dinero(resumen.desde), dinero(resumen.hasta))}`
              : ''}
          </p>
          <nav className="flex shrink-0 gap-5">
            <Link href={copy.legal.privacidadHref} prefetch={false} className="underline underline-offset-2 hover:text-white">
              {copy.legal.privacidad}
            </Link>
            <Link href={copy.legal.terminosHref} prefetch={false} className="underline underline-offset-2 hover:text-white">
              {copy.legal.terminos}
            </Link>
          </nav>
        </div>
      </footer>

      <BarraCasas telefonoWhatsApp={FALLBACK_WHATSAPP} totalCasas={casas.length} locale={copy.locale} />
    </div>
  );
}
