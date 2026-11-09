import Image from 'next/image';
import localFont from 'next/font/local';
import {
  VISTAS_MAR,
  getInventario,
  resumenInventario,
  ubicaciones,
  enIdioma,
} from '@/lib/supabase/lp-inventario';
import { FALLBACK_WHATSAPP } from '@/lib/site-contact';
import { dinero, dineroCompacto } from '../_components/format';
import FaqAcordeon from '../_components/v2/FaqAcordeon';
import BarraMovil from '../_components/v2/BarraMovil';
import PieLegal from '../_components/v2/PieLegal';
import {
  filtroPresupuesto,
  filtroRecamaras,
  filtroUbicacion,
  filtros,
} from '../_components/v2/filtros';
import type { LocaleLp } from '../_components/v2/i18n';
import { ubicacionCorta } from '../_components/v2/util';
import Catalogo from './_components/Catalogo';
import ChipsPortada from './_components/ChipsPortada';
import { COPY } from './_copy';
import '../_components/v2/tokens.css';
import './lpo-theme.css';

// ============================================================
// Landing de pago: PROPIEDADES FRENTE AL MAR (segunda versión, 30-oct-2026).
//
// El cuerpo vive AQUÍ y no en `page.tsx` porque lo sirven dos rutas: la
// española (`/lp/frente-al-mar`) y la inglesa (`/lp/beachfront-riviera-maya`,
// 9-nov-2026, tráfico de Estados Unidos y Canadá). Cada `page.tsx` aporta solo
// `metadata` y `revalidate`; el texto sale de `_copy.ts` por `locale`.
//
// La primera versión era un riel de tarjetas; esta es una HISTORIA A PANTALLA
// COMPLETA: la portada, luego una propiedad por pantalla con su foto a sangre
// y su precio encima, y al final el formulario, también a pantalla completa.
// El scroll salta de una a otra (snap por proximidad). En escritorio un
// índice fijo con las ciudades permite saltar; en móvil se desliza.
//
// EL GANCHO (30-oct-2026): la portada ya no es un rótulo, es una promesa con
// salida inmediata: «Tu propiedad frente al mar», la cifra real del
// inventario y las ciudades como chips que filtran y bajan. El mismo filtro
// vive en el formulario final (ciudad, presupuesto, recámaras) y viaja al lead.
//
// Reglas heredadas: toda cifra sale del inventario; ningún nombre de
// desarrollo llega al DOM; cero urgencia inventada. La vista al mar es la que
// declara el desarrollador en el Hub (`view_type`).
// ============================================================

/** Cortes de presupuesto en MXN. Se ajustan al rango real (hoy $4 M a $30 M). */
const CORTES_PRESUPUESTO = [5_000_000, 10_000_000, 15_000_000];

const display = localFont({
  src: '../../../fonts/bricolage-grotesque-latin.woff2',
  weight: '300 800',
  style: 'normal',
  declarations: [
    { prop: 'font-family', value: 'Bricolage Grotesque' },
    { prop: 'font-stretch', value: '75% 100%' },
  ],
  variable: '--font-lpo-display',
  display: 'swap',
});

/**
 * Corrige `<html lang>` antes de la hidratación. El root layout lo deja
 * estático en `"es"` y `/lp/*` vive fuera de `[locale]`; sin esto la versión
 * en inglés se anunciaría como española al lector de pantalla y al traductor
 * del navegador. En español no emite nada.
 */
function CorrigeLang({ locale }: { locale: LocaleLp }) {
  if (locale === 'es') return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
      }}
    />
  );
}

export default async function PaginaFrenteMar({ locale = 'es' }: { locale?: LocaleLp }) {
  const copy = COPY[locale];
  const propiedades = enIdioma(await getInventario({ vistas: VISTAS_MAR }), locale);
  const resumen = resumenInventario(propiedades);
  const ciudades = ubicaciones(propiedades, 'ciudad');
  const mensajeWa = copy.form.whatsappGenerico;
  const ubicacion = filtroUbicacion(propiedades, 'ciudad', copy.filtroCiudad, locale);
  const defs = filtros(
    ubicacion,
    filtroPresupuesto(propiedades, CORTES_PRESUPUESTO, undefined, locale),
    filtroRecamaras(propiedades, undefined, locale),
  );

  if (propiedades.length === 0) {
    return (
      <div className={`lpv lpo-root ${display.variable} min-h-[70vh]`}>
        <CorrigeLang locale={locale} />
        <div className="mx-auto max-w-2xl px-5 py-32 sm:px-8">
          <h1 className="lpo-display text-[clamp(2rem,1.3rem+2.5vw,3.25rem)]">{copy.vacio.titulo}</h1>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--lpv-fg-2)]">{copy.vacio.cuerpo}</p>
          <a
            href={`https://wa.me/${FALLBACK_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex min-h-[52px] items-center rounded-full bg-[var(--lpv-accent)] px-7 text-sm font-medium text-[var(--lpv-on-accent)]"
          >
            {copy.vacio.cta}
          </a>
        </div>
      </div>
    );
  }

  // Portada: la propiedad con más fotos propias. Empates, por precio.
  const portada = [...propiedades].sort((a, b) => b.imagenes.length - a.imagenes.length)[0];
  // Estados distintos que declara el Hub (el nombre viene del dato).
  const estados = [...new Set(propiedades.map((p) => p.estado).filter(Boolean))];

  return (
    <div className={`lpv lpo-root ${display.variable}`}>
      <CorrigeLang locale={locale} />
      {/* ══ PANTALLA 0: la portada ══ */}
      <section
        id="hero"
        className="lpo-pantalla relative isolate min-h-[100svh] overflow-hidden bg-[var(--lpv-bg-2)]"
      >
        {portada.imagen && (
          <Image
            src={portada.imagen}
            alt={`${portada.titulo}, ${ubicacionCorta(portada)}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="lpo-velo absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[96rem] flex-col justify-end px-5 pb-12 pt-28 text-white sm:px-8 sm:pb-16 lg:pr-48">
          <h1
            className={`lpo-display lpo-sobre-foto ${copy.portada.anchoTitulo} text-[clamp(3rem,1.2rem+8vw,8.5rem)]`}
          >
            {copy.portada.titulo}
          </h1>
          <p className="lpo-display-ligero lpo-sobre-foto mt-5 max-w-[36ch] text-[clamp(1.25rem,1rem+1.5vw,2.25rem)] text-white/90">
            {copy.portada.subtitulo({
              total: resumen.total,
              ciudades: ciudades.map((c) => c.nombre),
              estados,
              desde: resumen.desde ? dineroCompacto(resumen.desde) : null,
            })}
          </p>
          <div className="mt-8">
            <ChipsPortada
              ubicacion={ubicacion}
              total={resumen.total}
              etiquetaTodas={copy.portada.verTodas(resumen.total)}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* ══ PANTALLAS 1..n, el índice de ciudades y el formulario ══ */}
      <Catalogo propiedades={propiedades} filtros={defs} telefonoWhatsApp={FALLBACK_WHATSAPP} locale={locale} />

      {/* ══ PREGUNTAS, fuera del snap ══ */}
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <FaqAcordeon faqs={copy.preguntas.faqs} titulo={copy.preguntas.titulo} locale={locale} />
      </div>

      <PieLegal
        tono="oscuro"
        aviso={copy.pie.aviso}
        locale={locale}
        inventario={
          resumen.desde && resumen.hasta
            ? copy.pie.inventario(resumen.total, dinero(resumen.desde), dinero(resumen.hasta))
            : null
        }
      />

      <BarraMovil
        etiqueta={copy.barra}
        telefonoWhatsApp={FALLBACK_WHATSAPP}
        mensajeWhatsApp={mensajeWa}
        surface={copy.surfaceBarra}
        locale={locale}
      />
    </div>
  );
}
