'use client';

import { useId, useState, type ReactNode } from 'react';

// ============================================================
// Pasos como lista numerada dinámica (ejemplo del brief del 30-oct-2026):
// el paso activo se abre con su descripción; los demás se quedan en una
// línea con su número. Clic o foco cambian el activo. Sustituye a las tres
// filas estáticas de «Prueba de que existimos».
//
// El número usa el acento de la landing; el resto hereda los tokens `--lp-*`
// porque vive en la landing de lotes.
// ============================================================

export interface Paso {
  titulo: string;
  cuerpo: ReactNode;
}

export default function PasosDinamicos({ pasos }: { pasos: Paso[] }) {
  const [activo, setActivo] = useState(0);
  const uid = useId();

  return (
    <ol className="flex flex-col gap-2">
      {pasos.map((paso, i) => {
        const abierto = i === activo;
        return (
          <li key={paso.titulo}>
            <button
              type="button"
              aria-expanded={abierto}
              aria-controls={`${uid}-${i}`}
              onClick={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              className={`grid w-full grid-cols-[2.25rem_1fr] items-center gap-x-4 gap-y-0 rounded-[var(--lp-r-media)] border px-5 py-4 text-left transition-colors duration-200 ${
                abierto
                  ? 'border-[var(--lp-line)] bg-white shadow-[0_18px_40px_-28px_rgb(10_28_30/0.35)]'
                  : 'border-[var(--lp-line-soft)] bg-[var(--lp-paper-2)] hover:border-[var(--lp-line)]'
              }`}
            >
              <span
                className={`lp-num grid size-9 place-items-center self-start rounded-full text-sm font-semibold transition-colors duration-200 ${
                  abierto
                    ? 'bg-[var(--marca-aztec)] text-[var(--marca-aqua)]'
                    : 'bg-white text-[var(--lp-muted)] shadow-[inset_0_0_0_1px_rgb(72_115_121/0.18)]'
                }`}
              >
                {i + 1}
              </span>
              <span className="text-base font-medium leading-snug text-[var(--lp-ink)]">{paso.titulo}</span>
              <span
                id={`${uid}-${i}`}
                className={`col-start-2 overflow-hidden text-sm leading-relaxed text-[var(--lp-ink-soft)] transition-[max-height,opacity,margin] duration-300 ease-out motion-reduce:transition-none ${
                  abierto ? 'mt-2 max-h-[20rem] opacity-100' : 'mt-0 max-h-0 opacity-0'
                }`}
              >
                {paso.cuerpo}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
