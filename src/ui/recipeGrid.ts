import {
  ArrowRight,
  ArrowUpDown,
  Bookmark,
  Check,
  ChevronDown,
  GlassWater,
  Search,
  WifiOff,
} from 'lucide';
import type { AlcoholFilter, AppState, MatchedRecipe, SortMode } from '../types/cocktail';
import { t } from '../i18n/translations';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';
import { createRecipeArt } from './recipeArt';
import { showToast } from './toast';

function getMethodLabel(state: AppState, method?: MatchedRecipe['method']): string | null {
  if (!method) return null;
  const map = {
    shake: t(state.language, 'methodShake'),
    stir: t(state.language, 'methodStir'),
    build: t(state.language, 'methodBuild'),
    blend: t(state.language, 'methodBlend'),
  };
  return map[method];
}

export function createRecipeCard(recipe: MatchedRecipe, state: AppState, index = 0): HTMLElement {
  const { language, barIngredients, favorites } = state;
  const isFav = Boolean(favorites[recipe.id]);
  const hasBarContext = barIngredients.length > 0;
  const isReady = hasBarContext && recipe.missingIngredients.length === 0;

  const card = el('article', {
    className:
      'group editorial-card editorial-card-interactive rounded-2xl overflow-hidden flex flex-col cursor-pointer animate-fade-up',
    attrs: { style: `animation-delay: ${Math.min(index * 40, 240)}ms;` },
    onClick: () => store.openRecipe(recipe),
  });

  // Top photo / botanical art
  const art = createRecipeArt(recipe, 'h-44');

  // Floating frosted-glass status badge top-left
  if (hasBarContext) {
    const badgeText = isReady
      ? t(language, 'matchReady')
      : recipe.missingIngredients.length === 1
        ? t(language, 'matchMissingOne')
        : t(language, 'matchMissingMany', { n: recipe.missingIngredients.length });

    art.appendChild(
      el('span', {
        className: `absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isReady ? 'glass-badge-ready' : 'glass-badge'
        }`,
        children: [
          isReady && icon(Check, 'w-3 h-3'),
          el('span', { text: badgeText }),
        ],
      })
    );
  } else if (!recipe.alcoholic) {
    art.appendChild(
      el('span', {
        className: 'absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold glass-badge-ready',
        text: t(language, 'nonAlcoholicBadge'),
      })
    );
  }

  // Frosted-glass favorite button top-right
  const favBtn = el('button', {
    className: `absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer active:scale-90 ${
      isFav
        ? 'glass-badge btn-glass-warm'
        : 'glass-badge hover:scale-105'
    }`,
    attrs: {
      type: 'button',
      'aria-label': isFav ? t(language, 'favoriteSaved') : t(language, 'favoriteAdd'),
      'aria-pressed': String(isFav),
    },
    onClick: (ev) => {
      ev.stopPropagation();
      const added = store.toggleFavorite(recipe);
      showToast(
        added ? t(language, 'favoriteSaved') : t(language, 'favoritesRemove'),
        added ? 'success' : 'info'
      );
    },
    children: [icon(Bookmark, `w-4 h-4 ${isFav ? 'fill-current' : ''}`)],
  });
  art.appendChild(favBtn);

  card.appendChild(art);

  // Card Body
  const body = el('div', { className: 'p-4 sm:p-5 flex-1 flex flex-col' });

  // Eyebrow meta
  const methodLabel = getMethodLabel(state, recipe.method);
  body.appendChild(
    el('div', {
      className: 'flex items-center justify-between gap-2 text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-muted)] mb-1.5',
      children: [
        el('span', { className: 'truncate', text: recipe.category }),
        methodLabel && el('span', { className: 'shrink-0 font-mono', text: methodLabel }),
      ],
    })
  );

  // Title
  body.appendChild(
    el('h3', {
      className:
        'text-lg sm:text-xl font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] transition-colors leading-snug mb-3',
      text: recipe.name,
    })
  );

  // Ingredient Pills preview (first 4)
  const previewIngs = recipe.ingredients.slice(0, 4);
  const pillsWrap = el('div', { className: 'flex flex-wrap gap-1.5 mb-4' });
  for (const ing of previewIngs) {
    const owned = hasBarContext && recipe.ownedIngredients.includes(ing.name);
    pillsWrap.appendChild(
      el('span', {
        className: `text-xs px-2 py-0.5 rounded-md border ${
          owned
            ? 'bg-[var(--accent-primary-soft)] border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-medium'
            : 'bg-[var(--bg-muted)] border-transparent text-[var(--ink-secondary)]'
        }`,
        text: ing.name,
      })
    );
  }
  if (recipe.ingredients.length > 4) {
    pillsWrap.appendChild(
      el('span', {
        className: 'text-xs px-2 py-0.5 rounded-md text-[var(--ink-muted)] font-mono',
        text: `+${recipe.ingredients.length - 4}`,
      })
    );
  }
  body.appendChild(pillsWrap);

  // Footer Row
  body.appendChild(
    el('div', {
      className:
        'mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--ink-secondary)]',
      children: [
        el('span', {
          className: 'inline-flex items-center gap-1.5 truncate pr-2',
          children: [
            icon(GlassWater, 'w-3.5 h-3.5 text-[var(--ink-muted)] shrink-0'),
            el('span', {
              className: 'truncate',
              text: recipe.glass ?? (recipe.alcoholic ? t(language, 'alcoholicBadge') : t(language, 'nonAlcoholicBadge')),
            }),
          ],
        }),
        el('span', {
          className:
            'shrink-0 inline-flex items-center gap-1 font-semibold text-[var(--accent-primary)]',
          children: [
            el('span', { text: t(language, 'openRecipe') }),
            icon(ArrowRight, 'w-3.5 h-3.5 icon-glide-right'),
          ],
        }),
      ],
    })
  );

  card.appendChild(body);
  return card;
}

export function renderExploreToolbar(state: AppState): HTMLElement {
  const { language, alcoholFilter, sortMode, searchQuery } = state;

  const toolbar = el('div', {
    className: 'flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5',
  });

  // Search by name input
  const searchWrap = el('div', {
    className:
      'relative flex-1 max-w-md flex items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus-within:border-[var(--accent-primary)] transition-colors',
  });
  searchWrap.appendChild(
    el('span', {
      className: 'pl-3 text-[var(--ink-muted)]',
      children: [icon(Search, 'w-4 h-4')],
    })
  );
  const searchInput = el('input', {
    className:
      'w-full bg-transparent px-2.5 py-2.5 text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none',
    attrs: {
      type: 'search',
      id: 'recipe-name-search',
      placeholder: t(language, 'searchByNamePlaceholder'),
    },
  });
  searchInput.value = searchQuery;
  searchInput.addEventListener('input', () => {
    store.setSearchQuery(searchInput.value);
  });
  searchWrap.appendChild(searchInput);

  // Filter Pills + Sort Select
  const controls = el('div', {
    className: 'flex flex-wrap items-center justify-between sm:justify-end gap-2.5',
  });

  const filters: { id: AlcoholFilter; label: string }[] = [
    { id: 'all', label: t(language, 'filterAll') },
    { id: 'alcoholic', label: t(language, 'filterAlcoholic') },
    { id: 'non-alcoholic', label: t(language, 'filterNonAlcoholic') },
  ];

  const segmented = el('div', {
    className: 'btn-group-dynamic rounded-xl p-1.5 glass-panel',
    attrs: { role: 'group' },
    children: filters.map((f) => {
      const active = alcoholFilter === f.id;
      return el('button', {
        className: `inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer active:scale-95 ${
          active
            ? 'bg-[var(--accent-primary)] text-[var(--ink-on-accent)] shadow-xs'
            : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-muted)]/60'
        }`,
        attrs: { type: 'button', 'aria-pressed': String(active) },
        onClick: () => store.setAlcoholFilter(f.id),
        text: f.label,
      });
    }),
  });

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: 'match', label: t(language, 'sortBestMatch') },
    { value: 'name', label: t(language, 'sortName') },
    { value: 'ingredients-asc', label: t(language, 'sortSimplest') },
  ];
  const currentSort = sortOptions.find((o) => o.value === sortMode) ?? sortOptions[0]!;

  const sortDropdown = el('div', { className: 'relative' });
  const chevronSvg = icon(
    ChevronDown,
    'w-3.5 h-3.5 text-[var(--ink-muted)] transition-transform duration-200'
  );

  let isOpen = false;
  let cleanupListeners: (() => void) | null = null;

  const sortMenu = el('div', {
    className:
      'hidden absolute right-0 top-[calc(100%+8px)] z-40 min-w-[220px] rounded-2xl glass-popover p-2 menu-list-dynamic origin-top-right animate-pop',
    attrs: { role: 'listbox', 'aria-label': 'Sort recipes' },
  });

  const closeMenu = () => {
    if (!isOpen) return;
    isOpen = false;
    sortMenu.classList.add('hidden');
    sortTrigger.setAttribute('aria-expanded', 'false');
    chevronSvg.classList.remove('rotate-180');
    cleanupListeners?.();
    cleanupListeners = null;
  };

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    sortMenu.classList.remove('hidden');
    sortTrigger.setAttribute('aria-expanded', 'true');
    chevronSvg.classList.add('rotate-180');

    const handleOutside = (ev: MouseEvent) => {
      if (!sortDropdown.contains(ev.target as Node)) {
        closeMenu();
      }
    };
    const handleKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        closeMenu();
        sortTrigger.focus();
      }
    };

    window.setTimeout(() => {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleKey);
    }, 0);

    cleanupListeners = () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  };

  const sortTrigger = el('button', {
    className:
      'btn-glass px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--ink-primary)] min-h-[38px]',
    attrs: {
      type: 'button',
      'aria-haspopup': 'listbox',
      'aria-expanded': 'false',
      'aria-label': currentSort.label,
    },
    onClick: () => {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    },
    children: [
      icon(ArrowUpDown, 'w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0'),
      el('span', { text: currentSort.label }),
      chevronSvg,
    ],
  });

  for (const opt of sortOptions) {
    const selected = opt.value === sortMode;
    sortMenu.appendChild(
      el('button', {
        className: `w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all duration-150 cursor-pointer active:scale-[0.98] ${
          selected
            ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] font-semibold'
            : 'text-[var(--ink-primary)] hover:bg-[var(--bg-muted)]'
        }`,
        attrs: { type: 'button', role: 'option', 'aria-selected': String(selected) },
        onClick: () => {
          closeMenu();
          store.setSortMode(opt.value);
        },
        children: [
          el('span', { text: opt.label }),
          selected
            ? icon(Check, 'w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0')
            : el('span', { className: 'w-3.5 h-3.5 shrink-0' }),
        ],
      })
    );
  }

  sortDropdown.append(sortTrigger, sortMenu);

  controls.append(segmented, sortDropdown);
  toolbar.append(searchWrap, controls);
  return toolbar;
}

export function renderExploreResults(state: AppState): HTMLElement {
  const { language, isLoadingRecipes, apiError } = state;
  const visible = store.getVisibleRecipes();

  const wrapper = el('section', { attrs: { 'aria-label': t(language, 'navExplore') } });

  // Count + API status row
  const statusRow = el('div', {
    className: 'flex flex-wrap items-center justify-between gap-2 mb-4 text-xs text-[var(--ink-muted)]',
    children: [
      el('span', {
        className: 'font-mono',
        text: isLoadingRecipes
          ? t(language, 'loadingRecipes')
          : t(language, 'resultsCount', { n: visible.length }),
      }),
      apiError &&
        el('span', {
          className:
            'inline-flex items-center gap-1.5 text-[var(--accent-amber)] bg-[var(--accent-amber-soft)] px-2.5 py-1 rounded-full',
          children: [icon(WifiOff, 'w-3.5 h-3.5'), el('span', { text: t(language, 'apiOfflineBanner') })],
        }),
    ],
  });
  wrapper.appendChild(statusRow);

  // Loading Skeletons when fetching API with empty current list
  if (isLoadingRecipes && visible.length === 0) {
    const skeletonGrid = el('div', {
      className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
      children: Array.from({ length: 6 }).map(() =>
        el('div', {
          className: 'editorial-card rounded-2xl overflow-hidden animate-pulse',
          children: [
            el('div', { className: 'h-44 bg-[var(--bg-muted)]' }),
            el('div', {
              className: 'p-5 space-y-3',
              children: [
                el('div', { className: 'h-3 w-24 rounded bg-[var(--bg-muted)]' }),
                el('div', { className: 'h-5 w-40 rounded bg-[var(--bg-muted)]' }),
                el('div', { className: 'flex gap-2', children: [
                  el('div', { className: 'h-5 w-16 rounded bg-[var(--bg-muted)]' }),
                  el('div', { className: 'h-5 w-20 rounded bg-[var(--bg-muted)]' }),
                ] }),
              ],
            }),
          ],
        })
      ),
    });
    wrapper.appendChild(skeletonGrid);
    return wrapper;
  }

  // Empty State
  if (visible.length === 0) {
    wrapper.appendChild(
      el('div', {
        className:
          'editorial-card rounded-2xl p-10 text-center flex flex-col items-center gap-3',
        children: [
          el('h3', {
            className: 'text-xl font-semibold text-[var(--ink-primary)]',
            text: t(language, 'noResultsTitle'),
          }),
          el('p', {
            className: 'text-sm text-[var(--ink-secondary)] max-w-md',
            text: t(language, 'noResultsBody'),
          }),
          el('button', {
            className: 'btn-primary mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
            attrs: { type: 'button' },
            onClick: () => store.resetExploreFilters(),
            text: t(language, 'noResultsAction'),
          }),
        ],
      })
    );
    return wrapper;
  }

  // Recipe Grid (with smooth staggered fade-up)
  const grid = el('div', {
    className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
    children: visible.map((recipe, idx) => createRecipeCard(recipe, state, idx)),
  });
  wrapper.appendChild(grid);

  return wrapper;
}
