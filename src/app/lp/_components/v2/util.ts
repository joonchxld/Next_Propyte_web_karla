import type { EstadoComercial, PropiedadLanding } from '@/lib/supabase/lp-inventario';
import { m2 } from '../format';
import type { LocaleLp } from './i18n';

// Helpers de presentación compartidos. Texto, no iconos: una fila de
// pictogramas de cama y regadera es el lenguaje del portal, y estas páginas
// están en el registro opuesto.

export const ESTADO_TEXTO: Record<EstadoComercial, string> = {
  disponible: 'Disponible',
  preventa: 'Preventa',
  entrega_inmediata: 'Entrega inmediata',
};

export const ESTADO_TEXTO_EN: Record<EstadoComercial, string> = {
  disponible: 'Available',
  preventa: 'Pre-construction',
  entrega_inmediata: 'Move-in ready',
};

export function estadoTexto(locale: LocaleLp = 'es'): Record<EstadoComercial, string> {
  return locale === 'en' ? ESTADO_TEXTO_EN : ESTADO_TEXTO;
}

export function specsVivienda(p: PropiedadLanding, locale: LocaleLp = 'es'): string[] {
  if (locale === 'en') return specsViviendaEn(p);
  const partes: string[] = [];
  if (p.recamaras) partes.push(`${p.recamaras} rec`);
  if (p.banos) partes.push(`${p.banos} ${p.banos === 1 ? 'baño' : 'baños'}`);
  if (p.m2Construidos) partes.push(`${m2(p.m2Construidos)} const.`);
  if (p.m2Terreno) partes.push(`${m2(p.m2Terreno)} terreno`);
  if (p.estacionamientos) partes.push(`${p.estacionamientos} ${p.estacionamientos === 1 ? 'auto' : 'autos'}`);
  if (p.alberca) partes.push('Alberca');
  return partes;
}

function specsViviendaEn(p: PropiedadLanding): string[] {
  const partes: string[] = [];
  if (p.recamaras) partes.push(`${p.recamaras} ${p.recamaras === 1 ? 'bed' : 'beds'}`);
  if (p.banos) partes.push(`${p.banos} ${p.banos === 1 ? 'bath' : 'baths'}`);
  if (p.m2Construidos) partes.push(`${m2(p.m2Construidos)} built`);
  if (p.m2Terreno) partes.push(`${m2(p.m2Terreno)} lot`);
  if (p.estacionamientos) partes.push(`${p.estacionamientos} parking`);
  if (p.alberca) partes.push('Pool');
  return partes;
}

export function specsTerreno(p: PropiedadLanding, locale: LocaleLp = 'es'): string[] {
  if (locale === 'en') {
    const partes: string[] = [];
    partes.push(p.m2Terreno ? m2(p.m2Terreno) : 'size to be confirmed');
    if (p.mesesOpciones.length > 0) partes.push(`up to ${Math.max(...p.mesesOpciones)} months`);
    if (p.enganchePct) partes.push(`${p.enganchePct}% down`);
    return partes;
  }
  const partes: string[] = [];
  partes.push(p.m2Terreno ? m2(p.m2Terreno) : 'superficie por confirmar');
  if (p.mesesOpciones.length > 0) partes.push(`hasta ${Math.max(...p.mesesOpciones)} meses`);
  if (p.enganchePct) partes.push(`enganche ${p.enganchePct}%`);
  return partes;
}

export function ubicacionCorta(p: PropiedadLanding): string {
  return p.zona && p.zona !== p.ciudad ? `${p.zona}, ${p.ciudad}` : p.ciudad;
}

/** Plural simple (sirve igual en inglés: el llamador pasa las dos formas). */
export function plural(n: number, singular: string, pluralTxt: string): string {
  return `${n} ${n === 1 ? singular : pluralTxt}`;
}
