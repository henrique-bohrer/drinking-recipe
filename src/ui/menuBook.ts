import {
  ArrowDown,
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Wine,
} from 'lucide';
import type { AppState, CocktailRecipe, Language } from '../types/cocktail';
import { getCuratedRecipes } from '../data/curatedRecipes';
import { t } from '../i18n/translations';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';

interface MenuPageDef {
  chapterKey: 'menuChapter1' | 'menuChapter2' | 'menuChapter3';
  roman: string;
  recipeIds: string[];
}

const MENU_PAGES: MenuPageDef[] = [
  {
    chapterKey: 'menuChapter1',
    roman: 'I',
    recipeIds: [
      'house-negroni',
      'house-old-fashioned',
      'house-dry-martini',
      'house-whiskey-sour',
      'house-margarita',
      'house-aperol-spritz',
    ],
  },
  {
    chapterKey: 'menuChapter2',
    roman: 'II',
    recipeIds: [
      'house-mojito',
      'house-gin-tonic',
      'house-moscow-mule',
      'house-espresso-martini',
      'house-cosmopolitan',
      'house-daiquiri',
    ],
  },
  {
    chapterKey: 'menuChapter3',
    roman: 'III',
    recipeIds: [
      'house-caipirinha',
      'house-rabo-de-galo',
      'house-pina-colada',
      'house-passion-virgin-mojito',
      'house-citrus-basil-tonic',
      'house-ginger-hibiscus-fizz',
    ],
  },
];

let currentPageIndex = 0;

function createMenuThumb(recipe: CocktailRecipe, language: Language): HTMLElement {
  const frame = el('div', {
    className:
      'relative w-full h-28 sm:h-32 md:w-28 md:h-full md:min-h-[116px] shrink-0 overflow-hidden bg-[var(--bg-muted)]',
  });

  const buildFallback = () => {
    frame.replaceChildren(
      el('div', {
        className: 'w-full h-full flex items-center justify-center text-[var(--accent-primary)]',
        children: [icon(Wine, 'w-5 h-5')],
      })
    );
  };

  if (recipe.image) {
    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    img.className =
      'w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]';
    img.addEventListener('error', buildFallback, { once: true });
    frame.appendChild(img);
    frame.appendChild(
      el('div', {
        className:
          'pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10',
      })
    );
  } else {
    buildFallback();
  }

  // Mobile frosted recommendation tag floating nicely on top-left of photo
  frame.appendChild(
    el('span', {
      className: 'menu-rec-seal md:hidden absolute top-2 left-2',
      children: [
        icon(Award, 'w-2.5 h-2.5 text-[var(--accent-amber)] shrink-0'),
        el('span', { className: 'truncate max-w-[110px]', text: t(language, 'menuRecommendationTag') }),
      ],
    })
  );

  return frame;
}

function createMenuDrinkTile(recipe: CocktailRecipe, language: Language): HTMLElement {
  const ingredientsSummary = recipe.ingredients.map((i) => i.name).join(' · ');

  const card = el('button', {
    className:
      'group menu-drink-entry flex flex-col md:flex-row items-stretch w-full h-full focus-visible:outline-2',
    attrs: { type: 'button', 'aria-label': `${recipe.name} — ${t(language, 'menuOpenHint')}` },
    onClick: () => store.openRecipe(recipe),
  });

  const thumb = createMenuThumb(recipe, language);

  const info = el('div', {
    className: 'flex-1 min-w-0 p-3 sm:p-3.5 md:p-4 flex flex-col justify-between gap-1.5',
    children: [
      el('div', {
        children: [
          // Desktop "Recomendação da Casa" editorial seal inside cell header
          el('div', {
            className: 'hidden md:flex items-center justify-between gap-1.5 mb-1.5',
            children: [
              el('span', {
                className:
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-amber-soft)] text-[var(--accent-amber)] border border-[var(--accent-amber)]/30',
                children: [
                  icon(Award, 'w-3 h-3 shrink-0'),
                  el('span', { text: t(language, 'menuRecommendationTag') }),
                ],
              }),
              !recipe.alcoholic &&
                el('span', {
                  className:
                    'text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]',
                  text: t(language, 'nonAlcoholicBadge'),
                }),
            ],
          }),
          // Drink Name
          el('h3', {
            className:
              'font-editorial text-sm sm:text-base md:text-lg font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] transition-colors leading-snug line-clamp-1',
            text: recipe.name,
          }),
          // Ingredients list ("o que vai na receita")
          el('p', {
            className:
              'text-[11px] sm:text-xs text-[var(--ink-secondary)] mt-1 leading-relaxed line-clamp-2',
            text: ingredientsSummary,
          }),
        ],
      }),
      // Footer micro-hint
      el('div', {
        className:
          'pt-1.5 mt-1 border-t border-[var(--border-subtle)]/70 flex items-center justify-between gap-1 text-[11px] text-[var(--ink-muted)]',
        children: [
          el('span', {
            className: 'truncate',
            text: recipe.category,
          }),
          el('span', {
            className:
              'shrink-0 inline-flex items-center gap-1 font-semibold text-[var(--accent-primary)]',
            children: [
              el('span', { className: 'hidden sm:inline', text: t(language, 'menuOpenHint') }),
              icon(ArrowRight, 'w-3 h-3 icon-glide-right'),
            ],
          }),
        ],
      }),
    ],
  });

  card.append(thumb, info);
  return card;
}

export function renderHouseMenuBook(state: AppState): HTMLElement {
  const { language } = state;
  const curated = getCuratedRecipes(language);
  const byId = new Map(curated.map((r) => [r.id, r]));

  const section = el('section', {
    className: 'mb-10 sm:mb-12 animate-fade-up',
    attrs: { 'aria-labelledby': 'house-menu-heading' },
  });

  // Entrance Header + Quick Scroll to Bar Pantry
  const headerBar = el('div', {
    className: 'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5',
    children: [
      el('div', {
        children: [
          el('div', {
            className: 'flex items-center gap-3 mb-2',
            children: [
              el('span', { className: 'h-px w-8 bg-[var(--accent-warm)]' }),
              el('span', {
                className:
                  'text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-warm)]',
                text: t(language, 'menuEyebrow'),
              }),
            ],
          }),
          el('h1', {
            className:
              'text-3xl sm:text-5xl font-semibold text-[var(--ink-primary)] tracking-tight leading-[1.08]',
            text: t(language, 'menuTitle'),
            attrs: { id: 'house-menu-heading' },
          }),
          el('p', {
            className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-2 max-w-2xl leading-relaxed',
            text: t(language, 'menuSubtitle'),
          }),
        ],
      }),
      el('button', {
        className: 'btn-glass self-start sm:self-end px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold shrink-0',
        attrs: { type: 'button' },
        onClick: () => {
          document.getElementById('pantry-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        children: [
          el('span', { text: t(language, 'menuToPantryCta') }),
          icon(ArrowDown, 'w-3.5 h-3.5 text-[var(--accent-primary)]'),
        ],
      }),
    ],
  });
  section.appendChild(headerBar);

  // Chapter Tabs Bar (synced dynamically on page turn)
  const chapterTabsHost = el('div', {
    className: 'btn-group-dynamic !flex flex-wrap justify-start sm:justify-center mb-4',
    attrs: { role: 'tablist' },
  });
  section.appendChild(chapterTabsHost);

  // 3D Book Container
  const scene = el('div', { className: 'menu-book-scene' });
  const cover = el('div', { className: 'menu-book-cover' });
  const spread = el('div', { className: 'menu-book-spread' });
  const spine = el('div', { className: 'menu-book-spine', attrs: { 'aria-hidden': 'true' } });
  const pageContentHost = el('div', { className: 'relative z-10' });
  const leafHost = el('div', { className: 'pointer-events-none absolute inset-0 z-30' });
  const cornerHost = el('div');

  spread.append(spine, pageContentHost, leafHost, cornerHost);
  cover.appendChild(spread);
  scene.appendChild(cover);
  section.appendChild(scene);

  // Bottom Pagination Controls
  const controlsHost = el('div', {
    className: 'mt-5 flex flex-col sm:flex-row items-center justify-between gap-3',
  });
  section.appendChild(controlsHost);

  let isTurning = false;

  const paintPage = (animateDir?: 'next' | 'prev') => {
    const pageDef = MENU_PAGES[currentPageIndex] ?? MENU_PAGES[0]!;
    const pageRecipes = pageDef.recipeIds
      .map((id) => byId.get(id))
      .filter((r): r is CocktailRecipe => Boolean(r));

    // Update Chapter Tabs
    chapterTabsHost.replaceChildren(
      ...MENU_PAGES.map((p, idx) => {
        const active = idx === currentPageIndex;
        return el('button', {
          className: active
            ? 'btn-primary px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold'
            : 'btn-glass px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]',
          attrs: { type: 'button', role: 'tab', 'aria-selected': String(active) },
          onClick: () => goToPage(idx),
          text: t(language, p.chapterKey),
        });
      })
    );

    // Book inner folio header + strict 2 columns x 3 rows grid
    const inner = el('div', {
      className: `p-3.5 sm:p-6 md:p-7 ${animateDir ? 'animate-menu-reveal' : ''}`,
      children: [
        el('div', {
          className:
            'flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[var(--border-subtle)]',
          children: [
            el('div', {
              className: 'flex items-center gap-2 min-w-0',
              children: [
                icon(BookOpen, 'w-4 h-4 text-[var(--accent-primary)] shrink-0'),
                el('span', {
                  className:
                    'font-editorial text-sm sm:text-base font-semibold text-[var(--ink-primary)] truncate',
                  text: t(language, pageDef.chapterKey),
                }),
              ],
            }),
            el('span', {
              className: 'font-mono text-[11px] uppercase tracking-widest text-[var(--ink-muted)] shrink-0',
              text: t(language, 'menuPageIndicator', {
                current: currentPageIndex + 1,
                total: MENU_PAGES.length,
              }),
            }),
          ],
        }),
        // STRICT 2 COLUMNS × 3 ROWS LAYOUT (6 drinks per page)
        el('div', {
          className: 'grid grid-cols-2 grid-rows-3 gap-2.5 sm:gap-4 md:gap-x-9 md:gap-y-4',
          children: pageRecipes.map((recipe) => createMenuDrinkTile(recipe, language)),
        }),
      ],
    });
    pageContentHost.replaceChildren(inner);

    // Tactile Dog-Ear Corner on bottom-right if there's a next page
    if (currentPageIndex < MENU_PAGES.length - 1) {
      cornerHost.replaceChildren(
        el('button', {
          className: 'menu-page-corner',
          attrs: {
            type: 'button',
            'aria-label': t(language, 'menuNextPage'),
            title: t(language, 'menuNextPage'),
          },
          onClick: () => goToPage(currentPageIndex + 1),
        })
      );
    } else {
      cornerHost.replaceChildren();
    }

    // Bottom Navigation Bar
    controlsHost.replaceChildren(
      el('div', {
        className: 'flex items-center gap-2.5',
        children: [
          el('button', {
            className: 'btn-glass px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold min-h-[42px]',
            attrs: {
              type: 'button',
              ...(currentPageIndex === 0 ? { disabled: 'true' } : {}),
            },
            onClick: () => goToPage(currentPageIndex - 1),
            children: [
              icon(ChevronLeft, 'w-4 h-4'),
              el('span', { text: t(language, 'menuPrevPage') }),
            ],
          }),
          // Page indicator dots
          el('div', {
            className: 'flex items-center gap-1.5 px-2',
            children: MENU_PAGES.map((_, idx) => {
              const active = idx === currentPageIndex;
              return el('button', {
                className: `h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  active
                    ? 'w-7 bg-[var(--accent-primary)]'
                    : 'w-2 bg-[var(--border-strong)] hover:bg-[var(--ink-muted)]'
                }`,
                attrs: {
                  type: 'button',
                  'aria-label': t(language, 'menuPageIndicator', {
                    current: idx + 1,
                    total: MENU_PAGES.length,
                  }),
                },
                onClick: () => goToPage(idx),
              });
            }),
          }),
          el('button', {
            className: 'btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold min-h-[42px]',
            attrs: {
              type: 'button',
              ...(currentPageIndex === MENU_PAGES.length - 1 ? { disabled: 'true' } : {}),
            },
            onClick: () => goToPage(currentPageIndex + 1),
            children: [
              el('span', { text: t(language, 'menuNextPage') }),
              icon(ChevronRight, 'w-4 h-4'),
            ],
          }),
        ],
      }),
      el('p', {
        className: 'text-xs text-[var(--ink-muted)] text-center sm:text-right',
        text: t(language, 'menuSwipeTip'),
      })
    );
  };

  const goToPage = (targetIndex: number) => {
    if (
      isTurning ||
      targetIndex < 0 ||
      targetIndex >= MENU_PAGES.length ||
      targetIndex === currentPageIndex
    ) {
      return;
    }

    const dir: 'next' | 'prev' = targetIndex > currentPageIndex ? 'next' : 'prev';
    isTurning = true;

    // Launch real 3D turning leaf overlay
    const leaf = el('div', {
      className: `menu-turning-leaf ${
        dir === 'next' ? 'menu-turning-leaf-next' : 'menu-turning-leaf-prev'
      }`,
    });
    leafHost.replaceChildren(leaf);

    // Swap page content cleanly right as the leaf passes the spine (mid-turn)
    window.setTimeout(() => {
      currentPageIndex = targetIndex;
      paintPage(dir);
    }, 150);

    window.setTimeout(() => {
      leafHost.replaceChildren();
      isTurning = false;
    }, 560);
  };

  // Horizontal touch swipe to flip pages smoothly on Mobile!
  let touchStartX = 0;
  let touchStartY = 0;
  spread.addEventListener(
    'touchstart',
    (ev) => {
      const touch = ev.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );
  spread.addEventListener(
    'touchend',
    (ev) => {
      const touch = ev.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      if (Math.abs(dx) > 58 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) goToPage(currentPageIndex + 1);
        else goToPage(currentPageIndex - 1);
      }
    },
    { passive: true }
  );

  paintPage();
  return section;
}
