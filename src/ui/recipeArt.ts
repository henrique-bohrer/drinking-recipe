import { Wine } from 'lucide';
import type { CocktailRecipe } from '../types/cocktail';
import { el, icon } from '../utils/dom';

/**
 * Renders a tasteful cocktail image container with lazy loading, subtle editorial
 * edge scrim so bright API photos harmonize with both Paper and Speakeasy themes,
 * and a botanical monogram fallback if an image is missing or fails to load.
 */
export function createRecipeArt(recipe: CocktailRecipe, heightClass = 'h-44'): HTMLElement {
  const wrapper = el('div', {
    className: `relative ${heightClass} w-full overflow-hidden bg-[var(--bg-muted)] border-b border-[var(--border-subtle)]`,
  });

  const buildFallback = () => {
    wrapper.replaceChildren(
      el('div', {
        className:
          'w-full h-full flex flex-col items-center justify-center gap-2 px-4 text-center bg-[var(--bg-muted)]',
        children: [
          el('div', {
            className:
              'w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[var(--accent-primary)]',
            children: [icon(Wine, 'w-5 h-5')],
          }),
          el('span', {
            className: 'font-editorial italic text-sm text-[var(--ink-secondary)] line-clamp-1',
            text: recipe.name,
          }),
        ],
      })
    );
  };

  if (!recipe.image) {
    buildFallback();
    return wrapper;
  }

  const img = document.createElement('img');
  img.src = recipe.image;
  img.alt = recipe.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className =
    'w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]';
  img.addEventListener('error', buildFallback, { once: true });

  // Delicate top/bottom edge vignette so glass badges stay legible and bright photos blend softly
  const edgeScrim = el('div', {
    className:
      'pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/22',
  });

  wrapper.append(img, edgeScrim);
  return wrapper;
}
