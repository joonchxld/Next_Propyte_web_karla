import Image from 'next/image';
import localFont from 'next/font/local';
import {
  TIPOS_CASA,
  getInventario,
  resumenInventario,
  type PropiedadLanding,
  enIdioma,
} from '@/lib/supabase/lp-inventario';
import { FALLBACK_WHATSAPP } from '@/lib/site-contact';
import { dinero, dineroCompacto } from '../_components/format';
import {
  filtroEntrega,
  filtroPresupuesto,
  filtroRecamaras,
  filtroUbicacion,
  filtros,
} from '../_components/v2/filtros';
import type { LocaleLp } from '../_components/v2/i18n';
import FaqAcordeon from '../_components/v2/FaqAcordeon';
import BarraMovil from '../_components/v2/BarraMovil';
import PieLegal from '../_components/v2/PieLegal';
import { FAQ_COMPRA_Y_FINANCIAMIENTO, FAQ_COMPRA_Y_FINANCIAMIENTO_EN } from '../_components/v2/faqs';
import { ubicacionCorta } from '../_components/v2/util';
import Catalogo from './_components/Catalogo';
import ChipsHeroFiltro from './_components/ChipsHeroFiltro';
import { COPY } from './_copy';
import '../_components/v2/tokens.css';
import './lpx-theme.css';

// ============================================================
// Landing de pago: CASAS EN PLAYA DEL CARMEN (segunda versión, 30-oct-2026).
//
// La primera versión se leyó como plantilla: etiqueta + titular + panel de
// formulario, cuadrícula de tarjetas, pasos 1-2-3. Esta parte de las
// referencias que eligió Luis (Alexander Millett, Gerax, pines de Pinterest)
// y tiene cuatro movimientos y nada más:
//
//   1. Foto a sangre a pantalla completa con el titular y las zonas encima.
//   2. Las casas como fotos grandes con precio y nombre sobre la imagen.
//   3. Una franja negra con las cuatro cifras del inventario.
//   4. El formulario en claro junto a una foto, y las preguntas.
//
// Reglas heredadas: toda cifra sale del inventario; ningún nombre de
// desarrollo llega al DOM; cero urgencia inventada.
//
// El cuerpo vive AQUÍ y no en `page.tsx` porque lo sirven dos rutas: la
// española (`/lp/casas-playa-del-carmen`) y la inglesa
// (`/lp/homes-playa-del-carmen`). Cada `page.tsx` aporta `metadata` y
// `revalidate`; el texto sale de `COPY[locale]`.
// ============================================================

// Archivo con eje de ancho: la misma familia de la v3 del home.
const display = localFont({
  src: '../../../fonts/archivo-latin.woff2',
  weight: '100 900',
  style: 'normal',
  declarations: [
    { prop: 'font-family', value: 'Archivo' },
    { prop: 'font-stretch', value: '62% 125%' },
  ],
  variable: '--font-lpx-display',
  display: 'swap',
});

/**
 * Cortes de presupuesto en MXN sacados del inventario: los terciles del
 * precio, redondeados al medio millón. Con pocos precios distintos salen
 * repetidos y el filtro se queda sin opciones; `filtroPresupuesto` lo omite.
 */
function cortesPresupuesto(casas: PropiedadLanding[]): number[] {
  const montos = casas
    .map((c) => (c.precio?.moneda === 'MXN' ? c.precio.monto : null))
    .filter((m): m is number => m !== null)
    .sort((a, b) => a - b);
  if (montos.length < 3) return [];
  const redondear = (n: number) => Math.round(n / 500_000) * 500_000;
  const t1 = redondear(montos[Math.floor(montos.length / 3)]);
  const t2 = redondear(montos[Math.floor((montos.length * 2) / 3)]);
  return [...new Set([t1, t2])].filter((n) => n > 0);
}

export default async function PaginaCasasPlayaDelCarmen({ locale = 'es' }: { locale?: LocaleLp }) {
  const t = COPY[locale];
  const en = locale === 'en';
  const source = en ? 'lp_casas_pdc_en' : 'lp_casas_pdc';
  const casas = enIdioma(await getInventario({ tipos: TIPOS_CASA, ciudades: ['Playa del Carmen'] }), locale);
  const resumen = resumenInventario(casas);
  const mensajeWa = t.form.whatsappGenerico;

  // Filtros del formulario y del catálogo, construidos desde el inventario.
  // Cada uno sale solo si tiene al menos dos opciones con casas.
  const defsFiltros = filtros(
    filtroUbicacion(casas, 'zona', t.filtroZona, locale),
    filtroPresupuesto(casas, cortesPresupuesto(casas), undefined, locale),
    filtroRecamaras(casas, undefined, locale),
    filtroEntrega(casas, undefined, locale),
  );
  const zonas = defsFiltros.find((f) => f.id === 'ubicacion')?.opciones ?? [];

  // EL GANCHO: lo que el inventario permite afirmar hoy, nada más.
  const inmediatas = casas.filter((c) => c.estadoComercial === 'entrega_inmediata').length;
  const gancho = inmediatas > 0 ? t.hero.ganchoInmediata : t.hero.ganchoBase;
  const datosGancho = [
    inmediatas > 0 ? t.hero.entregaInmediata(inmediatas) : t.hero.publicadasHoy(resumen.total),
    resumen.engancheMinimoPct ? t.hero.engancheDesde(resumen.engancheMinimoPct) : null,
    resumen.desde ? t.hero.desde(dineroCompacto(resumen.desde)) : null,
  ].filter((t): t is string => t !== null);

  if (casas.length === 0) {
    return (
      <div className={`lpv lpx-root ${display.variable} min-h-[70vh]`}>
        <div className="mx-auto max-w-2xl px-5 py-32 sm:px-8">
          <h1 className="lpx-display text-[clamp(2rem,1.3rem+2.5vw,3.25rem)]">
            {t.vacio.titulo}
          </h1>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--lpv-fg-2)]">
            {t.vacio.cuerpo}
          </p>
          <a
            href={`https://wa.me/${FALLBACK_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex min-h-[52px] items-center rounded-full bg-[var(--lpv-accent)] px-7 text-sm font-medium text-white"
          >
            {t.vacio.cta}
          </a>
        </div>
      </div>
    );
  }

  // Portada: la casa con más fotos propias, que suele ser la mejor
  // fotografiada. Empates los decide el orden de precio.
  const portada = [...casas].sort((a, b) => b.imagenes.length - a.imagenes.length)[0];
  const fotoFormulario = casas.find((c) => c.imagen && c.id !== portada.id) ?? null;

  // La moneda va en la leyenda, no en el numero: «$4.4 M MXN» a 5rem parte
  // en dos lineas y la franja pierde su ritmo.
  const compacto = (p: NonNullable<typeof resumen.desde>) => dineroCompacto(p).replace(/ (MXN|USD)$/, '');
  const moneda = (p: NonNullable<typeof resumen.desde>) => p.moneda;
  const cifras: [string, string][] = [
    [String(resumen.total), t.cifras.publicadas],
    [resumen.desde ? compacto(resumen.desde) : '', resumen.desde ? t.cifras.entrada(moneda(resumen.desde)) : ''],
    [resumen.hasta ? compacto(resumen.hasta) : '', resumen.hasta ? t.cifras.alta(moneda(resumen.hasta)) : ''],
    [resumen.engancheMinimoPct ? `${resumen.engancheMinimoPct}%` : '', t.cifras.enganche],
  ];

  return (
    <div className={`lpv lpx-root ${display.variable}`}>
      {/* ══ 1 · HERO: la foto, el titular, las zonas ══ */}
      <section id="hero" className="relative isolate min-h-[100svh] overflow-hidden bg-[#111]">
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
        <div className="lpx-velo absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[96rem] flex-col justify-end px-5 pb-10 pt-28 text-white sm:px-8 sm:pb-14">
          <h1 className="lpx-display lpx-sobre-foto max-w-[14ch] text-[clamp(2.75rem,1.4rem+6.2vw,7rem)]">
            {t.hero.titulo}
          </h1>
          <p className="lpx-display-ligero lpx-sobre-foto mt-3 max-w-[24ch] text-[clamp(1.5rem,1.1rem+2.4vw,3rem)] text-white">
            {gancho}
          </p>
          <p className="lpx-sobre-foto mt-4 max-w-[52ch] text-[clamp(1rem,0.9rem+0.6vw,1.25rem)] text-white/85">
            {datosGancho.join(', ')}.
          </p>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {zonas.length > 0 && (
              <div className="lpx-hero-chips">
                <ChipsHeroFiltro opciones={zonas} ariaLabel={t.hero.zonasAria} />
              </div>
            )}
            <a
              href="#solicitar"
              className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-white px-7 text-[0.9375rem] font-medium text-[#111] transition-opacity hover:opacity-90 active:translate-y-px"
            >
              {t.hero.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ══ 2 · LAS CASAS ══ */}
      <Catalogo
        casas={casas}
        filtros={defsFiltros}
        telefonoWhatsApp={FALLBACK_WHATSAPP}
        locale={locale}
        copy={t.catalogo}
        form={t.form}
        source={source}
        fotoFormulario={
          fotoFormulario?.imagen
            ? { src: fotoFormulario.imagen, alt: `${fotoFormulario.titulo}, ${ubicacionCorta(fotoFormulario)}` }
            : null
        }
      />

      {/* ══ 3 · LAS CIFRAS, en negro ══ */}
      <section className="bg-[#111] text-white">
        <div className="mx-auto grid max-w-[96rem] grid-cols-2 gap-y-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-4">
          {cifras
            .filter(([v]) => v)
            .map(([valor, texto]) => (
              <div key={texto}>
                <p className="lpx-display whitespace-nowrap text-[clamp(2.5rem,1.6rem+3.4vw,5rem)]">{valor}</p>
                <p className="mt-2 text-[0.9375rem] text-white/65">{texto}</p>
              </div>
            ))}
        </div>
      </section>

      {/* ══ 4 · PREGUNTAS ══ */}
      <div className="mx-auto max-w-[96rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="lpx-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] lg:col-span-4">
            {t.faqTitulo}
          </h2>
          <div className="lg:col-span-8 lg:col-start-5">
            <FaqAcordeon
              faqs={en ? FAQ_COMPRA_Y_FINANCIAMIENTO_EN : FAQ_COMPRA_Y_FINANCIAMIENTO}
              locale={locale}
              titulo="" className="[&>h2]:hidden [&>div]:mt-0" />
          </div>
        </div>
      </div>

      <PieLegal
        tono="claro"
        locale={locale}
        aviso={t.pieAviso}
        inventario={
          resumen.desde && resumen.hasta
            ? t.inventario(resumen.total, dinero(resumen.desde), dinero(resumen.hasta))
            : null
        }
      />

      <BarraMovil
        etiqueta={t.barraEtiqueta}
        telefonoWhatsApp={FALLBACK_WHATSAPP}
        mensajeWhatsApp={mensajeWa}
        locale={locale}
        surface={`${source}_barra_movil`}
      />
    </div>
  );
}
