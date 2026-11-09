import { RULE_DARK } from './ui';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';
import { PENDIENTES } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Lo que todavía no sabemos. Panel del módulo «Antes de firmar».
//
// Antes esto eran ocho chips ámbar repartidos por toda la página. Honestidad
// concentrada se lee como integridad; dispersa se lee como desorganización, y
// ocho advertencias sueltas producen la sensación de que el producto está mal
// documentado en vez de la de que el anunciante es serio.
//
// Ningún gate se suaviza ni desaparece: cambian de sitio. Cada sección que
// antes llevaba su chip ahora enlaza aquí.
//
// La lista se construye desde el estado real de los datos, no a mano. Cuando el
// Hub publique la tasa o la licencia, el punto correspondiente desaparece solo
// y el encabezado cambia de número: no hay que acordarse de editar este
// archivo.
// ============================================================

/** ANCLA canónica. Toda referencia a este bloque usa esta constante. */
export const ANCLA_GATES = 'falta-confirmar';

export const NUMERO_PALABRA = ['Cero', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'];

interface Pendiente {
  titulo: string;
  porQueImporta: string;
}

/**
 * Se exporta porque el `<summary>` del acordeón necesita CONTAR los pendientes
 * sin renderizar el panel. Un número escrito a mano en el resumen y una lista
 * derivada del dato divergen el día que el Hub publique la tasa, y el resumen
 * mentiría en un bloque cuyo único propósito es no mentir.
 */
export function construirPendientes(
  lote: LoteLanding,
  locale: LocaleLp = 'es',
): Pendiente[] {
  const t = PENDIENTES[locale];
  const pendientes: Pendiente[] = [];

  // 1 · Etapa. El registro trae fechas de urbanización de UNA etapa y no
  // confirma que sean las de este lote. Es el gate con más consecuencia.
  pendientes.push({
    titulo: t.etapaTitulo,
    porQueImporta: t.etapa,
  });

  // 2 · Tasa. Sin ella no se publica mensualidad, y es la cifra de mayor
  // palanca de la página. El registro escribe "MSI" en la nota de plazos, pero
  // una prosa no es una tasa declarada: publicar 0% por inferencia es
  // exactamente lo que esta página existe para no hacer.
  if (lote.tasaAnual === null) {
    pendientes.push({
      titulo: t.tasaTitulo,
      porQueImporta: t.tasa,
    });
  }

  // 3 · Apartado. No existe como campo en ninguna tabla; es un hueco real.
  pendientes.push({
    titulo: t.apartadoTitulo,
    porQueImporta: t.apartado,
  });

  // 4 · Licencia. Obligación legal explícita, art. 69. Se cita AQUÍ y sólo
  // aquí: antes aparecía duplicada en el bloque jurídico y en el pie legal.
  if (!lote.licencia.completa) {
    pendientes.push({
      titulo: t.licenciaTitulo,
      porQueImporta: t.licencia,
    });
  }

  return pendientes;
}

export default function LoQueFaltaConfirmar({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const t = PENDIENTES[locale];
  const pendientes = construirPendientes(lote, locale);
  if (pendientes.length === 0) return null;

  const plural = pendientes.length > 1;

  return (
    <div>
      <p className="max-w-[58ch] text-base leading-relaxed text-white/70">
        {t.intro}
      </p>

      <ol className={`mt-6 border-t ${RULE_DARK}`}>
        {pendientes.map((p, i) => (
          <li
            key={p.titulo}
            className={`grid grid-cols-[2rem_1fr] gap-x-3 border-b ${RULE_DARK} py-5`}
          >
            <span aria-hidden="true" className="lp-num text-sm text-[var(--lp-accent-on-dark)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              {/* `p` y no `h3`: dentro de un `<details>` de acordeón el
                  encabezado real es el `<summary>`, y `globals.css` pisa el
                  tamaño de cualquier heading. Ver `TrustBar`. */}
              <p className="text-sm font-medium leading-snug text-white">{p.titulo}</p>
              <p className="mt-1.5 max-w-[58ch] text-sm leading-relaxed text-white/60">
                {p.porQueImporta}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-white/70">
        {t.cierre(plural)}
      </p>
    </div>
  );
}
