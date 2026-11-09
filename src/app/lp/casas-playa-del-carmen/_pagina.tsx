import Image from 'next/image';
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
import FormInventario from '../_components/v2/FormInventario';
import Catalogo from './_components/Catalogo';
import ChipsHeroFiltro from './_components/ChipsHeroFiltro';
import { COPY } from './_copy';
import '../_components/v2/tokens.css';
import '../_components/v2/marca.css';
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
// MARCA (9-nov-2026): misma composición, piel del manual oficial (capa
// `marca.css`, ver DESIGN.md): velo Aztec y retícula sobre la foto, franja de
// cifras en Aztec con las cifras en New Aqua, fichas redondeadas, pastillas y
// la hoja de solicitud en vidrio Aztec. La hoja sube al hero (junto a la
// foto, a la derecha en escritorio y justo debajo en móvil) para que el
// formulario esté en el primer pliegue; el cierre conserva el formulario
// junto a una foto.
//
// El cuerpo vive AQUÍ y no en `page.tsx` porque lo sirven dos rutas: la
// española (`/lp/casas-playa-del-carmen`) y la inglesa
// (`/lp/homes-playa-del-carmen`). Cada `page.tsx` aporta `metadata` y
// `revalidate`; el texto sale de `COPY[locale]`.
// ============================================================

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
      <div className="lpv marca lpx-root min-h-[70vh]">
        <div className="mx-auto max-w-2xl px-5 py-32 sm:px-8">
          <h1 className="marca-titular text-[clamp(2rem,1.3rem+2.5vw,3.25rem)]">
            {t.vacio.titulo}
          </h1>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--lpv-fg-2)]">
            {t.vacio.cuerpo}
          </p>
          <a
            href={`https://wa.me/${FALLBACK_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="marca-boton mt-9"
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

  const opcionesForm = casas.map((c) => ({ slug: c.slug, titulo: c.titulo }));
  // La hoja del hero lleva solo zona y presupuesto: lo que el lead necesita y
  // lo que cabe junto a la foto. El cierre conserva los cuatro filtros.
  const filtrosHero = defsFiltros.filter((f) => f.id === 'ubicacion' || f.id === 'presupuesto');

  return (
    <div className="lpv marca lpx-root">
      {/* ══ 1 · HERO: la foto a sangre, el titular, las zonas y la hoja ══ */}
      <section id="hero" className="lpx-hero relative isolate overflow-hidden">
        <div className="lpx-hero-foto absolute inset-x-0 top-0 overflow-hidden">
          {portada.imagen && (
            <Image
              src={portada.imagen}
              alt={`${portada.titulo}, ${ubicacionCorta(portada)}`}
              fill
              priority
              sizes="100vw"
              className="lpx-asentar object-cover"
            />
          )}
          <div className="marca-velo" aria-hidden="true" />
          <div className="marca-reticula" aria-hidden="true" />
        </div>

        <div className="relative mx-auto grid max-w-[96rem] gap-6 px-5 pb-8 pt-24 sm:px-8 sm:pb-14 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-start lg:gap-12 lg:pt-28">
          <div className="lpx-hero-texto flex flex-col justify-end text-white lg:justify-start lg:pt-[12vh]">
            <h1 className="marca-titular lpx-sobre-foto max-w-[14ch] text-[clamp(2.75rem,1.4rem+5.4vw,6.25rem)]">
              {t.hero.titulo}
            </h1>
            <p className="lpx-gancho lpx-sobre-foto mt-3 max-w-[24ch] text-[clamp(1.5rem,1.1rem+2vw,2.75rem)]">
              {gancho}
            </p>
            <p className="lpx-sobre-foto marca-cifra mt-4 max-w-[52ch] text-[clamp(1rem,0.9rem+0.5vw,1.1875rem)] text-white/90">
              {datosGancho.join(', ')}.
            </p>

            {zonas.length > 0 && (
              <div className="lpx-hero-chips mt-6 sm:mt-8">
                <ChipsHeroFiltro opciones={zonas} ariaLabel={t.hero.zonasAria} />
              </div>
            )}
          </div>

          {/* Hoja de solicitud en vidrio Aztec: sobre la foto en escritorio,
              justo debajo del titular en móvil. Primer pliegue en ambos. */}
          <div className="lpx-hoja lpx-hoja-hero marca-vidrio self-start overflow-hidden lg:mt-8">
            <FormInventario
              source={source}
              variante="hero"
              locale={locale}
              copy={t.form}
              opciones={opcionesForm}
              filtros={filtrosHero}
              propiedades={casas}
              telefonoWhatsApp={FALLBACK_WHATSAPP}
            />
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

      {/* ══ 3 · LAS CIFRAS, en la franja Aztec ══ */}
      <section className="marca-oscura relative overflow-hidden">
        <div className="marca-reticula" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[96rem] grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-4">
          {cifras
            .filter(([v]) => v)
            .map(([valor, texto]) => (
              <div key={texto} className="border-t border-[rgb(162_249_255/0.24)] pt-5">
                <p className="marca-titular marca-cifra whitespace-nowrap text-[clamp(2.5rem,1.6rem+3.4vw,5rem)] text-[var(--marca-aqua)]">
                  {valor}
                </p>
                <p className="marca-detalle mt-2 text-[0.9375rem] text-[var(--lpv-fg-2)]">{texto}</p>
              </div>
            ))}
        </div>
      </section>

      {/* ══ 4 · PREGUNTAS ══ */}
      <div className="mx-auto max-w-[96rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="marca-titular text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] lg:col-span-4">
            {t.faqTitulo}
          </h2>
          <div className="marca-tarjeta px-5 py-3 sm:px-8 sm:py-5 lg:col-span-8 lg:col-start-5">
            <FaqAcordeon
              faqs={en ? FAQ_COMPRA_Y_FINANCIAMIENTO_EN : FAQ_COMPRA_Y_FINANCIAMIENTO}
              locale={locale}
              titulo="" className="[&>h2]:hidden [&>div]:mt-0 [&>div]:border-y-0" />
          </div>
        </div>
      </div>

      <PieLegal
        tono="oscuro"
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
