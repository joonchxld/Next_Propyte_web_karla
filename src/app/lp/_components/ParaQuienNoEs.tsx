import { EnlaceGate } from './ui';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';
import { COMUN, NOES } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';

// ============================================================
// Para quién no es este producto. Panel del módulo «Antes de firmar».
//
// El texto va ÍNTEGRO: no se acorta ni se suaviza al entrar al acordeón. Lo
// único que cambia es que ya no ocupa una sección de scroll propia.
//
// Es el bloque que más ventas evita y por eso el que más vale: filtra al
// visitante cuyo plan no encaja antes de que gaste tres llamadas con un asesor,
// y el asesor es el cuello de botella de la operación.
// ============================================================

export default function ParaQuienNoEs({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const t = NOES[locale];
  return (
    <div className="flex max-w-[62ch] flex-col gap-4 text-base leading-relaxed text-white/75">
      <p>{t.p1}</p>
      <p>{t.p2}</p>
      <p>
        {t.p3A}{' '}
        {lote.costos?.cierrePctMin && lote.costos?.cierrePctMax ? (
          <span className="lp-num text-sm">
            {t.adicional(lote.costos.cierrePctMin, lote.costos.cierrePctMax)}
          </span>
        ) : (
          <EnlaceGate que={COMUN[locale].gate.gastosCierre} tono="oscuro" locale={locale} />
        )}{' '}
        {t.p3B}
      </p>
    </div>
  );
}
