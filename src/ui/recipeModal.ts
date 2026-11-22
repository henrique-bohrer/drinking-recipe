import {
  Bookmark,
  Check,
  ClipboardList,
  GlassWater,
  Languages,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Share2,
  Star,
  Timer,
  X,
} from 'lucide';
import type { AppState, MatchedRecipe } from '../types/cocktail';
import { t } from '../i18n/translations';
import { formatMeasure } from '../utils/measurements';
import { getFlavorProfile } from '../utils/flavorProfile';
import { translateSteps } from '../services/translationApi';
import { playGentleChime } from '../utils/sound';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';
import { createRecipeArt } from './recipeArt';
import { showToast } from './toast';

interface ModalLocalState {
  recipeId: string | null;
  hasAnimatedOpen: boolean;
  servings: number;
  checkedSteps: Set<number>;
  timerDuration: number;
  timerRemaining: number;
  timerRunning: boolean;
  timerDone: boolean;
  translatedSteps: string[] | null;
  showingTranslation: boolean;
  translating: boolean;
  draftRating: number | null;
  draftNote: string | null;
}

const local: ModalLocalState = {
  recipeId: null,
  hasAnimatedOpen: false,
  servings: 1,
  checkedSteps: new Set(),
  timerDuration: 15,
  timerRemaining: 15,
  timerRunning: false,
  timerDone: false,
  translatedSteps: null,
  showingTranslation: false,
  translating: false,
  draftRating: null,
  draftNote: null,
};

let timerInterval: number | null = null;
let keydownBound = false;

function stopTimer(): void {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
  local.timerRunning = false;
}

function resetLocalForRecipe(recipe: MatchedRecipe): void {
  if (local.recipeId === recipe.id) return;
  stopTimer();
  local.recipeId = recipe.id;
  local.hasAnimatedOpen = false;
  local.servings = 1;
  local.checkedSteps = new Set();
  local.timerDuration = recipe.prepSeconds ?? 15;
  local.timerRemaining = local.timerDuration;
  local.timerRunning = false;
  local.timerDone = false;
  local.translatedSteps = null;
  local.showingTranslation = false;
  local.translating = false;
  local.draftRating = null;
  local.draftNote = null;
}

export function renderRecipeModal(
  state: AppState,
  container: HTMLElement,
  rerenderModal: () => void
): void {
  const recipe = state.selectedRecipe;

  if (!recipe) {
    stopTimer();
    local.recipeId = null;
    container.replaceChildren();
    document.body.style.overflow = '';
    return;
  }

  resetLocalForRecipe(recipe);
  document.body.style.overflow = 'hidden';

  if (!keydownBound) {
    keydownBound = true;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && store.getState().selectedRecipe) {
        store.closeRecipe();
      }
    });
  }

  const { language, unit, favorites, tastingNotes, barIngredients } = state;
  const isFav = Boolean(favorites[recipe.id]);
  const noteRecord = tastingNotes[recipe.id];
  const profile = getFlavorProfile(recipe);
  const hasBarContext = barIngredients.length > 0;
  const canTranslate = recipe.instructionsLang !== language && recipe.instructions.length > 0;
  const activeSteps =
    local.showingTranslation && local.translatedSteps ? local.translatedSteps : recipe.instructions;

  const shouldAnimateOpen = !local.hasAnimatedOpen;
  local.hasAnimatedOpen = true;

  // Capture current modal scroll & textarea focus before re-rendering so clicking steps/timer never jumps to top
  const prevScrollEl = container.querySelector<HTMLElement>('[data-modal-scroll="true"]');
  const prevScrollTop = !shouldAnimateOpen && prevScrollEl ? prevScrollEl.scrollTop : 0;
  const activeNoteEl =
    document.activeElement?.id === 'modal-tasting-note'
      ? (document.activeElement as HTMLTextAreaElement)
      : null;
  const noteSelStart = activeNoteEl?.selectionStart ?? null;
  const noteSelEnd = activeNoteEl?.selectionEnd ?? null;

  // Backdrop (frosted dim)
  const backdrop = el('div', {
    className: `fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[4px] sm:p-6 overflow-hidden ${
      shouldAnimateOpen ? 'animate-modal-backdrop' : ''
    }`,
    attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-recipe-title' },
    onClick: (ev) => {
      if (ev.target === backdrop) {
        store.closeRecipe();
      }
    },
  });

  // Sheet / Modal card
  const dialog = el('div', {
    className: `${
      shouldAnimateOpen ? 'animate-modal-sheet' : ''
    } w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[88dvh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl overflow-hidden`,
  });

  // Top Header Bar (sticky frosted glass)
  const topBar = el('div', {
    className:
      'flex items-center justify-between gap-3 px-5 py-3.5 border-b glass-nav shrink-0',
    children: [
      el('div', {
        className: 'flex items-center gap-2 min-w-0',
        children: [
          el('span', {
            className:
              'pill-glass-chip text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full text-[var(--ink-secondary)] shrink-0',
            text: recipe.source === 'curated' ? t(language, 'curatedBadge') : t(language, 'apiBadge'),
          }),
          !recipe.alcoholic &&
            el('span', {
              className:
                'text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] shrink-0',
              text: t(language, 'nonAlcoholicBadge'),
            }),
        ],
      }),
      el('div', {
        className: 'flex items-center gap-1.5',
        children: [
          // Bookmark
          el('button', {
            className: `btn-glass px-3 py-1.5 rounded-full text-xs font-semibold ${
              isFav ? 'btn-glass-warm' : ''
            }`,
            attrs: { type: 'button' },
            onClick: () => {
              const added = store.toggleFavorite(recipe);
              showToast(
                added ? t(language, 'favoriteSaved') : t(language, 'favoritesRemove'),
                added ? 'success' : 'info'
              );
            },
            children: [
              icon(Bookmark, `w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`),
              el('span', {
                className: 'hidden sm:inline',
                text: isFav ? t(language, 'favoriteSaved') : t(language, 'favoriteAdd'),
              }),
            ],
          }),
          // Share
          el('button', {
            className: 'btn-glass px-3 py-1.5 rounded-full text-xs font-semibold',
            attrs: { type: 'button', 'aria-label': t(language, 'shareRecipe') },
            onClick: () => void handleShare(recipe, language, unit),
            children: [
              icon(Share2, 'w-3.5 h-3.5'),
              el('span', { className: 'hidden sm:inline', text: t(language, 'shareRecipe') }),
            ],
          }),
          // Close
          el('button', {
            className: 'btn-glass w-8 h-8 !p-0 rounded-full text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]',
            attrs: { type: 'button', 'aria-label': t(language, 'closeModal') },
            onClick: () => store.closeRecipe(),
            children: [icon(X, 'w-4 h-4')],
          }),
        ],
      }),
    ],
  });
  dialog.appendChild(topBar);

  // Scrollable content body
  const scrollBody = el('div', {
    className: 'overflow-y-auto flex-1',
    attrs: { 'data-modal-scroll': 'true' },
  });

  // Hero split (image + headline metadata)
  const heroSplit = el('div', {
    className: 'grid grid-cols-1 sm:grid-cols-12 border-b border-[var(--border-subtle)]',
  });

  const artCol = el('div', {
    className: 'sm:col-span-5',
    children: [createRecipeArt(recipe, 'h-52 sm:h-full min-h-[210px]')],
  });
  // remove double border on desktop split
  artCol.firstElementChild?.classList.add('sm:border-b-0', 'sm:border-r');

  const metaCol = el('div', {
    className: 'sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4',
  });

  metaCol.appendChild(
    el('div', {
      children: [
        el('p', {
          className: 'text-xs uppercase tracking-widest font-semibold text-[var(--accent-warm)] mb-1',
          text: recipe.category,
        }),
        el('h2', {
          className: 'text-2xl sm:text-3xl font-semibold text-[var(--ink-primary)] leading-tight',
          text: recipe.name,
          attrs: { id: 'modal-recipe-title' },
        }),
        el('div', {
          className: 'flex flex-wrap gap-3 mt-3 text-xs text-[var(--ink-secondary)]',
          children: [
            recipe.glass &&
              el('span', {
                className: 'inline-flex items-center gap-1.5',
                children: [
                  icon(GlassWater, 'w-3.5 h-3.5 text-[var(--accent-primary)]'),
                  el('span', { text: `${t(language, 'glassLabel')}: ${recipe.glass}` }),
                ],
              }),
            recipe.garnish &&
              el('span', {
                className: 'inline-flex items-center gap-1.5 italic',
                text: `${t(language, 'garnishLabel')}: ${recipe.garnish}`,
              }),
          ],
        }),
      ],
    })
  );

  // Flavor Profile Bars (compact, tactile, zero neon)
  const profileBox = el('div', {
    className: 'rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-3.5',
    children: [
      el('p', {
        className: 'text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-muted)] mb-2.5',
        text: t(language, 'flavorTitle'),
      }),
      el('div', {
        className: 'grid grid-cols-2 gap-x-4 gap-y-2',
        children: [
          renderFlavorBar(t(language, 'flavorSweet'), profile.sweet, 'var(--accent-amber)'),
          renderFlavorBar(t(language, 'flavorCitrus'), profile.citrus, 'var(--accent-primary)'),
          renderFlavorBar(t(language, 'flavorBitter'), profile.bitter, 'var(--accent-warm)'),
          renderFlavorBar(t(language, 'flavorStrength'), profile.strength, 'var(--ink-primary)'),
        ],
      }),
    ],
  });
  metaCol.appendChild(profileBox);

  heroSplit.append(artCol, metaCol);
  scrollBody.appendChild(heroSplit);

  // Main two-column recipe details
  const contentArea = el('div', { className: 'p-5 sm:p-6 space-y-6' });

  // 1) Ingredients + Servings Scaler + Unit Switch
  const ingSection = el('section');
  const ingHeader = el('div', {
    className: 'flex flex-wrap items-center justify-between gap-3 mb-3.5',
    children: [
      el('h3', {
        className: 'text-lg font-semibold text-[var(--ink-primary)]',
        text: t(language, 'ingredientsTitle'),
      }),
      el('div', {
        className: 'flex flex-wrap items-center gap-2',
        children: [
          // Servings stepper
          el('div', {
            className:
              'inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-0.5',
            children: [
              el('span', {
                className: 'text-[11px] font-medium text-[var(--ink-muted)] px-2',
                text: t(language, 'servingsLabel'),
              }),
              el('button', {
                className:
                  'w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[var(--bg-muted)] text-[var(--ink-primary)] cursor-pointer disabled:opacity-40',
                attrs: { type: 'button', 'aria-label': 'Decrease servings' },
                onClick: () => {
                  if (local.servings > 1) {
                    local.servings -= 1;
                    rerenderModal();
                  }
                },
                children: [icon(Minus, 'w-3.5 h-3.5')],
              }),
              el('span', {
                className: 'w-6 text-center font-mono text-xs font-semibold text-[var(--ink-primary)]',
                text: `${local.servings}×`,
              }),
              el('button', {
                className:
                  'w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[var(--bg-muted)] text-[var(--ink-primary)] cursor-pointer',
                attrs: { type: 'button', 'aria-label': 'Increase servings' },
                onClick: () => {
                  if (local.servings < 12) {
                    local.servings += 1;
                    rerenderModal();
                  }
                },
                children: [icon(Plus, 'w-3.5 h-3.5')],
              }),
            ],
          }),
          // Metric / Imperial unit switch
          el('div', {
            className:
              'btn-group-dynamic rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1 text-xs font-mono',
            children: (['metric', 'imperial'] as const).map((u) => {
              const active = unit === u;
              return el('button', {
                className: `px-2.5 py-1 rounded-md cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-[var(--ink-on-accent)] font-semibold'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`,
                attrs: { type: 'button', 'aria-pressed': String(active) },
                onClick: () => store.setUnit(u),
                text: u === 'metric' ? t(language, 'unitMetric') : t(language, 'unitImperial'),
              });
            }),
          }),
        ],
      }),
    ],
  });
  ingSection.appendChild(ingHeader);

  const ingList = el('ul', {
    className:
      'divide-y divide-[var(--border-subtle)] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden',
    children: recipe.ingredients.map((item) => {
      const isOwned = hasBarContext && recipe.ownedIngredients.includes(item.name);
      const isMissing = hasBarContext && recipe.missingIngredients.includes(item.name);
      const scaledMeasure = formatMeasure(item.measure, local.servings, unit);

      return el('li', {
        className: 'flex items-center justify-between gap-3 px-4 py-2.5 text-sm',
        children: [
          el('div', {
            className: 'flex items-center gap-2.5 min-w-0',
            children: [
              el('span', {
                className: `w-2 h-2 rounded-full shrink-0 ${
                  isOwned
                    ? 'bg-[var(--accent-primary)]'
                    : isMissing
                      ? 'border border-[var(--accent-warm)] bg-transparent'
                      : 'bg-[var(--border-strong)]'
                }`,
              }),
              el('span', {
                className: isMissing
                  ? 'text-[var(--ink-secondary)]'
                  : 'text-[var(--ink-primary)] font-medium',
                text: item.name,
              }),
            ],
          }),
          scaledMeasure &&
            el('span', {
              className: 'font-mono text-xs text-[var(--ink-secondary)] shrink-0',
              text: scaledMeasure,
            }),
        ],
      });
    }),
  });
  ingSection.appendChild(ingList);

  // Copy Missing Shopping List action when user has bar ingredients
  if (hasBarContext) {
    const missing = recipe.missingIngredients;
    ingSection.appendChild(
      el('div', {
        className: 'mt-3 flex items-center justify-between gap-2 text-xs',
        children: [
          el('span', {
            className: 'text-[var(--ink-muted)]',
            text:
              missing.length === 0
                ? t(language, 'shoppingAllReady')
                : `${missing.length} ${language === 'pt' ? 'faltante(s)' : 'missing'}`,
          }),
          missing.length > 0 &&
            el('button', {
              className: 'btn-glass px-3 py-1.5 rounded-lg text-xs font-medium',
              attrs: { type: 'button' },
              onClick: async () => {
                const text = `${recipe.name} — ${missing.join(', ')}`;
                await copyToClipboard(text);
                showToast(t(language, 'copiedToast'));
              },
              children: [
                icon(ClipboardList, 'w-3.5 h-3.5'),
                el('span', { text: t(language, 'copyShoppingList') }),
              ],
            }),
        ],
      })
    );
  }
  contentArea.appendChild(ingSection);

  // 2) Preparation Steps (Interactive Checklist) + Auto-Translate API
  const prepSection = el('section');
  const prepHeader = el('div', {
    className: 'flex flex-wrap items-center justify-between gap-2 mb-3',
    children: [
      el('div', {
        children: [
          el('h3', {
            className: 'text-lg font-semibold text-[var(--ink-primary)]',
            text: t(language, 'instructionsTitle'),
          }),
          activeSteps.length > 0 &&
            el('p', {
              className: 'text-xs text-[var(--ink-muted)]',
              text: t(language, 'stepProgress', {
                done: local.checkedSteps.size,
                total: activeSteps.length,
              }),
            }),
        ],
      }),
      canTranslate &&
        el('button', {
          className: 'btn-glass px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--accent-primary)]',
          attrs: { type: 'button', ...(local.translating ? { disabled: 'true' } : {}) },
          onClick: async () => {
            if (local.showingTranslation) {
              local.showingTranslation = false;
              rerenderModal();
              return;
            }
            if (local.translatedSteps) {
              local.showingTranslation = true;
              rerenderModal();
              return;
            }
            local.translating = true;
            rerenderModal();
            try {
              local.translatedSteps = await translateSteps(
                recipe.instructions,
                recipe.instructionsLang,
                language
              );
              local.showingTranslation = true;
            } catch {
              showToast(t(language, 'translationFailed'), 'info');
            } finally {
              local.translating = false;
              rerenderModal();
            }
          },
          children: [
            icon(Languages, 'w-3.5 h-3.5'),
            el('span', {
              text: local.translating
                ? t(language, 'translatingBtn')
                : local.showingTranslation
                  ? t(language, 'showOriginalBtn')
                  : t(language, 'translateBtn'),
            }),
          ],
        }),
    ],
  });
  prepSection.appendChild(prepHeader);

  if (local.showingTranslation) {
    prepSection.appendChild(
      el('p', {
        className: 'text-[11px] text-[var(--accent-primary)] mb-2 italic',
        text: t(language, 'translatedNotice'),
      })
    );
  }

  const stepsList = el('ol', {
    className: 'menu-list-dynamic',
    children: activeSteps.map((step, idx) => {
      const done = local.checkedSteps.has(idx);
      return el('li', {
        attrs: { 'aria-selected': String(done) },
        children: [
          el('button', {
            className: `w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
              done
                ? 'bg-[var(--accent-primary-soft)]/70 border-[var(--accent-primary)]/30 text-[var(--ink-secondary)]'
                : 'bg-[var(--bg-canvas)] border-[var(--border-subtle)] text-[var(--ink-primary)] hover:border-[var(--border-strong)]'
            }`,
            attrs: { type: 'button', 'aria-pressed': String(done) },
            onClick: () => {
              if (local.checkedSteps.has(idx)) {
                local.checkedSteps.delete(idx);
              } else {
                local.checkedSteps.add(idx);
              }
              rerenderModal();
            },
            children: [
              el('span', {
                className: `mt-0.5 w-6 h-6 rounded-full shrink-0 inline-flex items-center justify-center text-xs font-mono font-semibold border ${
                  done
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--ink-on-accent)]'
                    : 'border-[var(--border-strong)] text-[var(--ink-secondary)]'
                }`,
                children: [done ? icon(Check, 'w-3.5 h-3.5') : String(idx + 1)],
              }),
              el('span', {
                className: `text-sm leading-relaxed ${done ? 'line-through opacity-75' : ''}`,
                text: step,
              }),
            ],
          }),
        ],
      });
    }),
  });
  prepSection.appendChild(stepsList);
  contentArea.appendChild(prepSection);

  // 3) Interactive Bartender Timer (Shake / Stir / Chill)
  const timerBox = el('section', {
    className:
      'rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4',
    children: [
      el('div', {
        className: 'flex items-center gap-3',
        children: [
          el('div', {
            className:
              'w-10 h-10 rounded-full bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] flex items-center justify-center shrink-0',
            children: [icon(Timer, 'w-5 h-5')],
          }),
          el('div', {
            children: [
              el('p', {
                className: 'text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]',
                text: t(language, 'timerTitle'),
              }),
              el('p', {
                className: `font-mono text-2xl font-semibold ${
                  local.timerDone ? 'text-[var(--accent-primary)]' : 'text-[var(--ink-primary)]'
                }`,
                text: local.timerDone ? t(language, 'timerDone') : `${local.timerRemaining}s`,
              }),
            ],
          }),
        ],
      }),
      el('div', {
        className: 'btn-group-dynamic !flex flex-wrap items-center',
        children: [
          ...[
            { label: t(language, 'timerShake'), secs: 15 },
            { label: t(language, 'timerStir'), secs: 25 },
            { label: t(language, 'timerChill'), secs: 30 },
          ].map((preset) =>
            el('button', {
              className: `px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer active:scale-95 ${
                local.timerDuration === preset.secs
                  ? 'border border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]'
                  : 'pill-glass-chip text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`,
              attrs: { type: 'button', 'aria-pressed': String(local.timerDuration === preset.secs) },
              onClick: () => {
                stopTimer();
                local.timerDuration = preset.secs;
                local.timerRemaining = preset.secs;
                local.timerDone = false;
                rerenderModal();
              },
              text: preset.label,
            })
          ),
          el('button', {
            className: 'btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold',
            attrs: { type: 'button' },
            onClick: () => {
              if (local.timerRunning) {
                stopTimer();
                rerenderModal();
              } else {
                if (local.timerRemaining <= 0) {
                  local.timerRemaining = local.timerDuration;
                }
                local.timerDone = false;
                local.timerRunning = true;
                rerenderModal();
                timerInterval = window.setInterval(() => {
                  local.timerRemaining -= 1;
                  if (local.timerRemaining <= 0) {
                    local.timerRemaining = 0;
                    local.timerDone = true;
                    stopTimer();
                    playGentleChime();
                  }
                  rerenderModal();
                }, 1000);
              }
            },
            children: [
              icon(local.timerRunning ? Pause : Play, 'w-3.5 h-3.5'),
              el('span', { text: local.timerRunning ? t(language, 'timerPause') : t(language, 'timerStart') }),
            ],
          }),
          el('button', {
            className: 'btn-glass w-8 h-8 !p-0 rounded-lg text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]',
            attrs: { type: 'button', 'aria-label': t(language, 'timerReset') },
            onClick: () => {
              stopTimer();
              local.timerRemaining = local.timerDuration;
              local.timerDone = false;
              rerenderModal();
            },
            children: [icon(RotateCcw, 'w-3.5 h-3.5')],
          }),
        ],
      }),
    ],
  });
  contentArea.appendChild(timerBox);

  // 4) Personal Tasting Notes & Star Rating
  let draftRating = local.draftRating ?? noteRecord?.rating ?? 0;
  const noteTextarea = el('textarea', {
    className:
      'w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-y min-h-[76px]',
    attrs: {
      id: 'modal-tasting-note',
      placeholder: t(language, 'notesPlaceholder'),
      rows: '2',
    },
  });
  noteTextarea.value = local.draftNote ?? noteRecord?.note ?? '';
  noteTextarea.addEventListener('input', () => {
    local.draftNote = noteTextarea.value;
  });

  const starsRow = el('div', { className: 'flex items-center gap-1' });
  const paintStars = () => {
    starsRow.replaceChildren(
      ...[1, 2, 3, 4, 5].map((starVal) =>
        el('button', {
          className: `p-1 cursor-pointer transition-transform hover:scale-110 ${
            starVal <= draftRating ? 'text-[var(--accent-amber)]' : 'text-[var(--border-strong)]'
          }`,
          attrs: { type: 'button', 'aria-label': `${starVal} / 5` },
          onClick: () => {
            draftRating = starVal === draftRating ? 0 : starVal;
            local.draftRating = draftRating;
            paintStars();
          },
          children: [icon(Star, `w-5 h-5 ${starVal <= draftRating ? 'fill-current' : ''}`)],
        })
      )
    );
  };
  paintStars();

  const notesSection = el('section', {
    className: 'pt-4 border-t border-[var(--border-subtle)] space-y-3',
    children: [
      el('div', {
        className: 'flex items-center justify-between gap-2',
        children: [
          el('h3', {
            className: 'text-base font-semibold text-[var(--ink-primary)]',
            text: t(language, 'notesTitle'),
          }),
          starsRow,
        ],
      }),
      noteTextarea,
      el('div', {
        className: 'flex justify-end',
        children: [
          el('button', {
            className: 'btn-glass px-4 py-2 rounded-xl text-xs font-semibold',
            attrs: { type: 'button' },
            onClick: () => {
              local.draftRating = draftRating;
              local.draftNote = noteTextarea.value;
              store.saveTastingNote(recipe.id, draftRating, noteTextarea.value);
              if (!favorites[recipe.id]) {
                store.toggleFavorite(recipe);
              }
              showToast(t(language, 'notesSavedToast'));
            },
            text: t(language, 'notesSave'),
          }),
        ],
      }),
    ],
  });
  contentArea.appendChild(notesSection);

  scrollBody.appendChild(contentArea);
  dialog.appendChild(scrollBody);
  backdrop.appendChild(dialog);
  container.replaceChildren(backdrop);

  // Synchronously restore exact scroll position within the same paint frame
  if (prevScrollTop > 0) {
    scrollBody.scrollTop = prevScrollTop;
  }

  // Restore focus & caret if user was typing in Tasting Notes while timer ticked
  if (activeNoteEl) {
    noteTextarea.focus({ preventScroll: true });
    if (noteSelStart !== null && noteSelEnd !== null) {
      try {
        noteTextarea.setSelectionRange(noteSelStart, noteSelEnd);
      } catch {
        // Ignore
      }
    }
  }
}

function renderFlavorBar(label: string, value: number, colorVar: string): HTMLElement {
  return el('div', {
    className: 'space-y-1',
    children: [
      el('div', {
        className: 'flex justify-between text-[11px] text-[var(--ink-secondary)]',
        children: [
          el('span', { text: label }),
          el('span', { className: 'font-mono text-[var(--ink-muted)]', text: `${value}%` }),
        ],
      }),
      el('div', {
        className: 'h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden',
        children: [
          el('div', {
            className: 'h-full rounded-full transition-all duration-500',
            attrs: { style: `width: ${value}%; background-color: ${colorVar};` },
          }),
        ],
      }),
    ],
  });
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

async function handleShare(
  recipe: MatchedRecipe,
  language: AppState['language'],
  unit: AppState['unit']
): Promise<void> {
  const ingLines = recipe.ingredients
    .map((i) => {
      const m = formatMeasure(i.measure, local.servings, unit);
      return m ? `• ${i.name} (${m})` : `• ${i.name}`;
    })
    .join('\n');

  const summary = `${recipe.name} — NeoDrinks\n\n${ingLines}\n\n${recipe.instructions.join(' ')}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: recipe.name, text: summary });
      showToast(t(language, 'sharedToast'));
      return;
    } catch {
      // User dismissed share sheet — fall through or ignore
      return;
    }
  }

  await copyToClipboard(summary);
  showToast(t(language, 'copiedToast'));
}
