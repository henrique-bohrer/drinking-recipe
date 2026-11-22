import { Bookmark, Dices, GlassWater, Sparkles } from 'lucide';
import type { AppState } from '../types/cocktail';
import { t } from '../i18n/translations';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';
import { createRecipeArt } from './recipeArt';
import { showToast } from './toast';

export function renderRouletteView(state: AppState): HTMLElement {
  const { language, rouletteMood, rouletteRecipe, rouletteLoading, favorites } = state;

  const wrapper = el('section', { className: 'max-w-3xl mx-auto animate-fade-up' });

  // Editorial Header
  wrapper.appendChild(
    el('div', {
      className: 'text-center mb-7',
      children: [
        el('p', {
          className: 'text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-warm)] mb-2',
          text: t(language, 'rouletteEyebrow'),
        }),
        el('h2', {
          className: 'text-3xl sm:text-4xl font-semibold text-[var(--ink-primary)] tracking-tight',
          text: t(language, 'rouletteTitle'),
        }),
        el('p', {
          className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-2 max-w-xl mx-auto',
          text: t(language, 'rouletteSubtitle'),
        }),
      ],
    })
  );

  // Mood Selector Pills
  const moods: { id: AppState['rouletteMood']; label: string }[] = [
    { id: 'any', label: t(language, 'rouletteMoodAny') },
    { id: 'refreshing', label: t(language, 'rouletteMoodRefreshing') },
    { id: 'classic', label: t(language, 'rouletteMoodClassic') },
    { id: 'zero-proof', label: t(language, 'rouletteMoodZero') },
  ];

  wrapper.appendChild(
    el('div', {
      className: 'flex flex-wrap justify-center gap-2 mb-6',
      children: moods.map((m) => {
        const active = rouletteMood === m.id;
        return el('button', {
          className: `px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
            active
              ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--ink-on-accent)]'
              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]'
          }`,
          attrs: { type: 'button', 'aria-pressed': String(active) },
          onClick: () => store.setRouletteMood(m.id),
          text: m.label,
        });
      }),
    })
  );

  // Primary Spin CTA
  wrapper.appendChild(
    el('div', {
      className: 'flex justify-center mb-7',
      children: [
        el('button', {
          className:
            'inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-semibold bg-[var(--ink-primary)] text-[var(--bg-surface)] hover:opacity-90 active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-60',
          attrs: { type: 'button', ...(rouletteLoading ? { disabled: 'true' } : {}) },
          onClick: () => void store.spinRoulette(),
          children: [
            icon(Dices, `w-5 h-5 ${rouletteLoading ? 'animate-spin' : ''}`),
            el('span', {
              text: rouletteLoading ? t(language, 'rouletteSpinning') : t(language, 'rouletteSpinBtn'),
            }),
          ],
        }),
      ],
    })
  );

  // Featured Drawn Card
  if (rouletteLoading && !rouletteRecipe) {
    wrapper.appendChild(
      el('div', {
        className: 'editorial-card rounded-3xl h-72 flex items-center justify-center animate-shuffle',
        children: [
          el('span', {
            className: 'text-sm text-[var(--ink-secondary)] inline-flex items-center gap-2',
            children: [icon(Sparkles, 'w-4 h-4 text-[var(--accent-amber)]'), el('span', { text: t(language, 'rouletteSpinning') })],
          }),
        ],
      })
    );
    return wrapper;
  }

  if (rouletteRecipe) {
    const isFav = Boolean(favorites[rouletteRecipe.id]);
    const card = el('article', {
      className: `editorial-card rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 ${
        rouletteLoading ? 'animate-shuffle' : 'animate-fade-up'
      }`,
    });

    const artWrap = el('div', {
      className: 'md:col-span-5',
      children: [createRecipeArt(rouletteRecipe, 'h-60 md:h-full min-h-[240px]')],
    });
    artWrap.firstElementChild?.classList.add('md:border-b-0', 'md:border-r');

    const details = el('div', {
      className: 'md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5',
      children: [
        el('div', {
          children: [
            el('div', {
              className: 'flex items-center justify-between gap-2 mb-2',
              children: [
                el('span', {
                  className: 'text-xs uppercase tracking-wider font-semibold text-[var(--accent-warm)]',
                  text: rouletteRecipe.category,
                }),
                !rouletteRecipe.alcoholic &&
                  el('span', {
                    className:
                      'text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]',
                    text: t(language, 'nonAlcoholicBadge'),
                  }),
              ],
            }),
            el('h3', {
              className: 'text-2xl sm:text-3xl font-semibold text-[var(--ink-primary)] leading-tight mb-2',
              text: rouletteRecipe.name,
            }),
            rouletteRecipe.glass &&
              el('p', {
                className: 'text-xs text-[var(--ink-muted)] inline-flex items-center gap-1.5 mb-4',
                children: [
                  icon(GlassWater, 'w-3.5 h-3.5'),
                  el('span', { text: rouletteRecipe.glass }),
                ],
              }),
            el('div', {
              className: 'flex flex-wrap gap-1.5',
              children: rouletteRecipe.ingredients.map((i) =>
                el('span', {
                  className:
                    'text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--ink-primary)]',
                  text: i.name,
                })
              ),
            }),
          ],
        }),
        el('div', {
          className: 'flex flex-wrap items-center gap-2.5 pt-4 border-t border-[var(--border-subtle)]',
          children: [
            el('button', {
              className:
                'flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--accent-primary)] text-[var(--ink-on-accent)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer',
              attrs: { type: 'button' },
              onClick: () => store.openRecipe(rouletteRecipe),
              text: t(language, 'rouletteViewDetails'),
            }),
            el('button', {
              className: `inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                isFav
                  ? 'bg-[var(--accent-warm)] border-[var(--accent-warm)] text-[var(--ink-on-accent)]'
                  : 'border-[var(--border-strong)] text-[var(--ink-primary)] hover:border-[var(--accent-warm)] hover:text-[var(--accent-warm)]'
              }`,
              attrs: { type: 'button' },
              onClick: () => {
                const added = store.toggleFavorite(rouletteRecipe);
                showToast(
                  added ? t(language, 'favoriteSaved') : t(language, 'favoritesRemove'),
                  added ? 'success' : 'info'
                );
              },
              children: [
                icon(Bookmark, `w-4 h-4 ${isFav ? 'fill-current' : ''}`),
                el('span', { text: isFav ? t(language, 'favoriteSaved') : t(language, 'favoriteAdd') }),
              ],
            }),
          ],
        }),
      ],
    });

    card.append(artWrap, details);
    wrapper.appendChild(card);
  }

  return wrapper;
}
