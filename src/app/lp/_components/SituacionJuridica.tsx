import { EnlaceGate } from './ui';
import LicenciaDesarrollo from './LicenciaDesarrollo';
import { COMUN, JURIDICA } from '../lotes-playa-del-carmen/_copy';
import type { LocaleLp } from './v2/i18n';
import type { LoteLanding } from '@/lib/supabase/lp-lotes';

// ============================================================
// Situación jurídica, sin adjetivos. Panel del módulo «Antes de firmar».
//
// Vivía inline en `page.tsx`. Se extrajo al consolidar los cinco bloques de
// riesgo: 200 líneas de JSX jurídico dentro del archivo de página hacían que
// reordenar la página fuera un ejercicio de mover llaves.
//
// El contenido va íntegro, incluida la frase que más cuesta escribir: que no
// usamos «certeza jurídica absoluta» porque ninguna comercializadora puede
// sostenerla.
// ============================================================

export default function SituacionJuridica({
  lote,
  locale = 'es',
}: {
  lote: LoteLanding;
  locale?: LocaleLp;
}) {
  const t = JURIDICA[locale];
  return (
    <div className="flex flex-col gap-8">
      <dl className="flex flex-col gap-6">
        <div>
          <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/40">
            {t.regimen}
          </dt>
          <dd className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/80">
            {lote.regimenPropiedad ?? (
              <EnlaceGate que={COMUN[locale].gate.regimen} tono="oscuro" locale={locale} />
            )}
            {t.regimenFin}
          </dd>
        </div>
        <div>
          <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/40">
            {t.usoSuelo}
          </dt>
          <dd className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/80">
            <span className="font-mono">{lote.usoSuelo ?? t.porConfirmar}</span>
            {t.usoSueloFin}
          </dd>
        </div>
        <div>
          <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/40">
            {t.escrituracion}
          </dt>
          <dd className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/80">
            {t.escrituracionTexto}
          </dd>
        </div>
        {lote.rentasCortoPlazoPermitidas !== null && (
          <div>
            <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/40">
              {t.renta}
            </dt>
            <dd className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/80">
              {lote.rentasCortoPlazoPermitidas
                ? t.rentaSi
                : t.rentaNo}
            </dd>
          </div>
        )}
      </dl>

      <LicenciaDesarrollo
        licencia={lote.licencia}
        actualizado={lote.fechaCorte}
        locale={locale}
      />
    </div>
  );
}
