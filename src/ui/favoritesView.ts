import { ArrowRight, Bookmark, Star, Trash2 } from 'lucide';
import type { AppState } from '../types/cocktail';
import { t } from '../i18n/translations';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';
import { createRecipeArt } from './recipeArt';
import { showToast } from './toast';

export function renderFavoritesView(state: AppState): HTMLElement {
  const { language, favorites, tastingNotes } = state;
  const savedList = Object.values(favorites);

  const wrapper = el('section', { className: 'animate-fade-up' });

  wrapper.appendChild(
    el('div', {
      className: 'mb-7',
      children: [
        el('p', {
          className: 'text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-warm)] mb-1.5',
          text: t(language, 'favoritesEyebrow'),
        }),
        el('h2', {
          className: 'text-3xl sm:text-4xl font-semibold text-[var(--ink-primary)] tracking-tight',
          text: t(language, 'favoritesTitle'),
        }),
        el('p', {
          className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-1.5 max-w-xl',
          text: t(language, 'favoritesSubtitle'),
        }),
      ],
    })
  );

  if (savedList.length === 0) {
    wrapper.appendChild(
      el('div', {
        className: 'editorial-card rounded-3xl p-10 sm:p-12 text-center flex flex-col items-center gap-3',
        children: [
          el('div', {
            className:
              'w-12 h-12 rounded-full bg-[var(--bg-muted)] text-[var(--ink-muted)] flex items-center justify-center',
            children: [icon(Bookmark, 'w-5 h-5')],
          }),
          el('h3', {
            className: 'text-xl font-semibold text-[var(--ink-primary)]',
            text: t(language, 'favoritesEmptyTitle'),
          }),
          el('p', {
            className: 'text-sm text-[var(--ink-secondary)] max-w-md',
            text: t(language, 'favoritesEmptyBody'),
          }),
          el('button', {
            className: 'btn-primary mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
            attrs: { type: 'button' },
            onClick: () => store.setActiveTab('explore'),
            children: [
              el('span', { text: t(language, 'favoritesExploreBtn') }),
              icon(ArrowRight, 'w-4 h-4 icon-glide-right'),
            ],
          }),
        ],
      })
    );
    return wrapper;
  }

  const grid = el('div', {
    className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
    children: savedList.map((recipe, idx) => {
      const note = tastingNotes[recipe.id];
      const card = el('article', {
        className:
          'group editorial-card editorial-card-interactive rounded-2xl overflow-hidden flex flex-col cursor-pointer animate-fade-up',
        attrs: { style: `animation-delay: ${Math.min(idx * 40, 240)}ms;` },
        onClick: () => store.openRecipe(recipe),
      });

      const art = createRecipeArt(recipe, 'h-40');
      art.appendChild(
        el('button', {
          className:
            'glass-badge absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-90',
          attrs: { type: 'button', 'aria-label': t(language, 'favoritesRemove') },
          onClick: (ev) => {
            ev.stopPropagation();
            store.toggleFavorite(recipe);
            showToast(t(language, 'favoritesRemove'), 'info');
          },
          children: [icon(Trash2, 'w-3.5 h-3.5')],
        })
      );
      card.appendChild(art);

      const body = el('div', {
        className: 'p-4 sm:p-5 flex-1 flex flex-col gap-2.5',
        children: [
          el('div', {
            className: 'flex items-center justify-between gap-2',
            children: [
              el('span', {
                className: 'text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-muted)] truncate',
                text: recipe.category,
              }),
              note &&
                note.rating > 0 &&
                el('span', {
                  className: 'inline-flex items-center gap-0.5 text-[var(--accent-amber)]',
                  children: Array.from({ length: note.rating }).map(() =>
                    icon(Star, 'w-3.5 h-3.5 fill-current')
                  ),
                }),
            ],
          }),
          el('h3', {
            className: 'text-lg font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] transition-colors',
            text: recipe.name,
          }),
          note?.note &&
            el('p', {
              className:
                'text-xs italic text-[var(--ink-secondary)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl p-2.5 line-clamp-3',
              text: `“${note.note}”`,
            }),
          el('div', {
            className: 'mt-auto pt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)]',
            children: [
              el('span', { text: t(language, 'openRecipe') }),
              icon(ArrowRight, 'w-3.5 h-3.5 icon-glide-right'),
            ],
          }),
        ],
      });

      card.appendChild(body);
      return card;
    }),
  });

  wrapper.appendChild(grid);
  return wrapper;
}
