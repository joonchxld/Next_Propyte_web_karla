import { Fragment, type ReactNode } from 'react';

/**
 * Convierte una cadena del diccionario (`_copy.ts`) en nodos.
 *
 *   · `*texto*`  → palabra de acento, serif itálica (`.lpe-italica`).
 *   · `{nombre}` → el nodo que el llamador pase en `vars` con ese nombre.
 *
 * Existe porque el orden de las palabras de acento cambia entre idiomas: con
 * JSX escrito a mano en cada página habría que duplicar el árbol. Sin directiva
 * `'use client'`, para que lo use el servidor y el cliente.
 */
export function rich(texto: string, vars: Record<string, ReactNode> = {}): ReactNode {
  return texto
    .split(/(\*[^*]+\*|\{\w+\})/)
    .filter((parte) => parte !== '')
    .map((parte, i) => {
      if (parte.startsWith('*')) {
        return (
          <span key={i} className="lpe-italica">
            {parte.slice(1, -1)}
          </span>
        );
      }
      if (parte.startsWith('{')) {
        return <Fragment key={i}>{vars[parte.slice(1, -1)]}</Fragment>;
      }
      return <Fragment key={i}>{parte}</Fragment>;
    });
}
