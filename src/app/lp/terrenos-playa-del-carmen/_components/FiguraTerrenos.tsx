import Image from 'next/image';
import type { ImagenLanding } from '@/lib/supabase/lp-lotes';

// ============================================================
// Toda imagen de la variante B, rotulada — y numerada.
//
// ═══ POR QUÉ NO SE REUSA `_components/Figure.tsx` ═══
//
// Ese componente es de la variante A y pinta con tokens `--lp-*`: fondo crema,
// radio de media, gris de subtítulo. Montado aquí heredaría la paleta de la
// otra variante, que es justo lo que `lpt-theme.css` prohíbe para que el A/B no
// mida ruido. La REGLA que sí se hereda, y es la que importa, es que `caption`
// no es opcional: si lo fuera, la próxima imagen entraría sin rótulo y nadie
// lo notaría hasta que lo notara un comprador. Al ser obligatorio en el tipo,
// el build falla antes.
//
// ═══ LA LÁMINA ═══
//
// La página es una hoja de campo, así que las imágenes no son tarjetas: son
// LÁMINAS de un plano. Cada una lleva su número («FIG. 04»), su rótulo de qué
// es, y la escuadra naranja de vértice que ya marca el panel del formulario.
// Esquina viva, cero radio: el tema lo declara para todo bloque.
//
// MARCA (9-nov-2026): la lámina deja la esquina viva y la escuadra naranja.
// Ahora es una placa blanca de 28 px con la imagen a 22 px, y la cartela va
// sobre un velo Aztec local: número de figura en pastilla Aqua (Aqua solo
// sobre oscuro) y rótulo en caja normal. Vive siempre sobre fondo claro.
//
// El prefijo «Render del desarrollador» lo pone el componente, no quien lo
// llama. Doce renders y una fotografía real conviven en esta página; si el
// rótulo lo escribiera cada llamada, en algún sitio se suavizaría.
// ============================================================

export default function FiguraTerrenos({
  imagen,
  sizes,
  /** Número de lámina. Se pasa a mano para que la numeración siga al documento. */
  lamina,
  /** Dos o tres palabras: qué amenidad o qué vista es. Va en la esquina. */
  rotulo,
  priority = false,
  className = '',
  aspecto = 'aspect-[4/3]',
  /** `false` en mosaicos densos, donde el pie iría repetido bajo cada lámina. */
  conPie = true,
  prefijo,
}: {
  /** Prefijo del pie por tipo de imagen, en el idioma de la página. */
  prefijo: Record<ImagenLanding['tipo'], string>;
  imagen: ImagenLanding;
  sizes: string;
  lamina: string;
  rotulo: string;
  priority?: boolean;
  className?: string;
  aspecto?: string;
  conPie?: boolean;
}) {
  return (
    <figure className={`lpt-placa ${className}`}>
      <div className={`lpt-imagen relative ${aspecto}`}>
        <Image
          src={imagen.url}
          alt={imagen.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover"
        />

        {/* Cartela de lámina. Sobre la imagen, no debajo: así el rótulo viaja
            con la vista aunque el mosaico se reordene, y no hay forma de
            publicar una lámina anónima. El velo es un degradado local, no una
            capa a pantalla completa: no toca el centro de la imagen. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgb(10_28_30/0.85)] via-[rgb(10_28_30/0.5)] to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 px-3 pb-3 sm:px-4">
          <span className="lpt-cota lpt-cartela-fig shrink-0 text-[0.75rem]">{lamina}</span>
          <span className="lpt-cota min-w-0 truncate text-[0.875rem] font-medium text-white">{rotulo}</span>
        </div>
      </div>

      {conPie && (
        <figcaption className="lpt-cuerpo max-w-[52ch] px-2 pb-1.5 pt-3 text-[0.8125rem] leading-relaxed text-[var(--marca-slate)]">
          <span className="font-medium text-[var(--marca-aztec)]">{prefijo[imagen.tipo]}</span>{' '}
          {imagen.caption}
        </figcaption>
      )}
    </figure>
  );
}
