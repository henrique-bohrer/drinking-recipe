import { Plus, Sparkles, Trash2, X } from 'lucide';
import type { AppState } from '../types/cocktail';
import { t } from '../i18n/translations';
import { QUICK_STAPLE_INGREDIENTS } from '../i18n/ingredientsMap';
import { normalizeText } from '../utils/normalize';
import { findTopUnlockIngredient } from '../utils/matcher';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';

export function renderBarPantry(state: AppState): HTMLElement {
  const { language, barIngredients, catalogIngredients, recipes } = state;

  const section = el('section', {
    className: 'editorial-card rounded-2xl p-5 sm:p-6 mb-7',
    attrs: { 'aria-labelledby': 'pantry-heading' },
  });

  // Header Row
  const headerRow = el('div', {
    className: 'flex flex-wrap items-start justify-between gap-3 mb-4',
    children: [
      el('div', {
        children: [
          el('h2', {
            className: 'text-xl sm:text-2xl font-semibold tracking-tight text-[var(--ink-primary)]',
            text: t(language, 'pantryTitle'),
            attrs: { id: 'pantry-heading' },
          }),
          el('p', {
            className: 'text-sm text-[var(--ink-secondary)] mt-0.5',
            text: t(language, 'pantrySubtitle'),
          }),
        ],
      }),
      barIngredients.length > 0 &&
        el('button', {
          className:
            'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:text-[var(--accent-warm)] hover:border-[var(--accent-warm)] transition-colors cursor-pointer',
          attrs: { type: 'button' },
          onClick: () => store.clearBarIngredients(),
          children: [icon(Trash2, 'w-3.5 h-3.5'), el('span', { text: t(language, 'pantryClearBtn') })],
        }),
    ],
  });
  section.appendChild(headerRow);

  // Combobox + Add button
  const comboboxWrapper = el('div', { className: 'relative' });
  const inputRow = el('div', {
    className:
      'flex items-stretch gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-canvas)] p-1.5 focus-within:border-[var(--accent-primary)] transition-colors',
  });

  const input = el('input', {
    className:
      'flex-1 min-w-0 bg-transparent px-3 py-2 text-sm sm:text-base text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none',
    attrs: {
      type: 'text',
      id: 'pantry-ingredient-input',
      placeholder: t(language, 'pantryPlaceholder'),
      autocomplete: 'off',
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': 'false',
      'aria-controls': 'pantry-suggestions-list',
    },
  });

  const addButton = el('button', {
    className:
      'shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--accent-primary)] text-[var(--ink-on-accent)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer',
    attrs: { type: 'button' },
    onClick: () => commitInput(),
    children: [icon(Plus, 'w-4 h-4'), el('span', { className: 'hidden sm:inline', text: t(language, 'pantryAddBtn') })],
  });

  inputRow.append(input, addButton);

  const dropdown = el('ul', {
    className:
      'hidden absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-xl py-1',
    attrs: { id: 'pantry-suggestions-list', role: 'listbox' },
  });

  let filteredSuggestions: string[] = [];
  let highlightedIndex = -1;

  const closeDropdown = () => {
    dropdown.classList.add('hidden');
    input.setAttribute('aria-expanded', 'false');
    highlightedIndex = -1;
  };

  const commitInput = (explicitValue?: string) => {
    const val = (explicitValue ?? input.value).trim();
    if (!val) return;
    // Support comma-separated quick entry
    const pieces = val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const p of pieces) {
      store.addBarIngredient(p);
    }
    input.value = '';
    closeDropdown();
    // Re-focus input smoothly on desktop
    window.requestAnimationFrame(() => {
      document.getElementById('pantry-ingredient-input')?.focus();
    });
  };

  const renderDropdown = () => {
    const query = normalizeText(input.value);
    if (!query) {
      closeDropdown();
      return;
    }

    const activeNorms = new Set(barIngredients.map(normalizeText));
    filteredSuggestions = catalogIngredients
      .filter((item) => {
        const norm = normalizeText(item);
        return !activeNorms.has(norm) && norm.includes(query);
      })
      .sort((a, b) => {
        const aStarts = normalizeText(a).startsWith(query) ? 0 : 1;
        const bStarts = normalizeText(b).startsWith(query) ? 0 : 1;
        return aStarts - bStarts || a.localeCompare(b);
      })
      .slice(0, 8);

    if (filteredSuggestions.length === 0) {
      closeDropdown();
      return;
    }

    dropdown.replaceChildren(
      ...filteredSuggestions.map((item, idx) => {
        const li = el('li', {
          className: `px-3.5 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
            idx === highlightedIndex
              ? 'bg-[var(--accent-primary-soft)] text-[var(--ink-primary)] font-medium'
              : 'text-[var(--ink-primary)] hover:bg-[var(--bg-muted)]'
          }`,
          attrs: { role: 'option', 'aria-selected': String(idx === highlightedIndex) },
          onClick: () => commitInput(item),
          children: [
            el('span', { text: item }),
            el('span', {
              className: 'text-xs text-[var(--ink-muted)]',
              text: '+',
            }),
          ],
        });
        li.addEventListener('mousedown', (ev) => ev.preventDefault());
        return li;
      })
    );

    dropdown.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
  };

  input.addEventListener('input', () => {
    highlightedIndex = -1;
    renderDropdown();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && filteredSuggestions.length > 0) {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % filteredSuggestions.length;
      renderDropdown();
    } else if (e.key === 'ArrowUp' && filteredSuggestions.length > 0) {
      e.preventDefault();
      highlightedIndex =
        highlightedIndex <= 0 ? filteredSuggestions.length - 1 : highlightedIndex - 1;
      renderDropdown();
    } else if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        commitInput(filteredSuggestions[highlightedIndex]);
      } else {
        commitInput();
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  input.addEventListener('blur', () => {
    window.setTimeout(closeDropdown, 160);
  });

  comboboxWrapper.append(inputRow, dropdown);
  section.appendChild(comboboxWrapper);

  // Active Tags Area
  if (barIngredients.length > 0) {
    const tagsList = el('div', {
      className: 'flex flex-wrap gap-2 mt-4',
      children: barIngredients.map((item) =>
        el('span', {
          className:
            'animate-fade-up inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-sm font-medium bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/25',
          children: [
            el('span', { text: item }),
            el('button', {
              className:
                'w-5 h-5 rounded-full inline-flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--ink-on-accent)] transition-colors cursor-pointer',
              attrs: { type: 'button', 'aria-label': `Remove ${item}` },
              onClick: () => store.removeBarIngredient(item),
              children: [icon(X, 'w-3 h-3')],
            }),
          ],
        })
      ),
    });
    section.appendChild(tagsList);
  } else {
    section.appendChild(
      el('p', {
        className: 'mt-3 text-xs text-[var(--ink-muted)] italic',
        text: t(language, 'pantryEmptyHint'),
      })
    );
  }

  // Quick Staple Chips
  const activeNormSet = new Set(barIngredients.map(normalizeText));
  const staples = QUICK_STAPLE_INGREDIENTS[language].filter(
    (s) => !activeNormSet.has(normalizeText(s))
  );

  if (staples.length > 0) {
    const quickRow = el('div', {
      className: 'mt-4 pt-3.5 border-t border-[var(--border-subtle)] flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5',
      children: [
        el('span', {
          className: 'text-xs font-medium text-[var(--ink-muted)] shrink-0',
          text: t(language, 'pantryQuickLabel'),
        }),
        ...staples.slice(0, 9).map((staple) =>
          el('button', {
            className:
              'shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-muted)] text-[var(--ink-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--ink-primary)] border border-transparent hover:border-[var(--border-strong)] transition-colors cursor-pointer',
            attrs: { type: 'button' },
            onClick: () => store.addBarIngredient(staple),
            children: [icon(Plus, 'w-3 h-3 text-[var(--accent-primary)]'), el('span', { text: staple })],
          })
        ),
      ],
    });
    section.appendChild(quickRow);
  }

  // Smart "Next Ingredient to Unlock More Drinks" Tip
  if (barIngredients.length > 0) {
    const topUnlock = findTopUnlockIngredient(recipes);
    if (topUnlock) {
      const tipBar = el('div', {
        className:
          'mt-4 rounded-xl px-3.5 py-2.5 bg-[var(--accent-amber-soft)] border border-[var(--accent-amber)]/30 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm',
        children: [
          el('div', {
            className: 'flex items-center gap-2 text-[var(--ink-primary)]',
            children: [
              icon(Sparkles, 'w-4 h-4 shrink-0 text-[var(--accent-amber)]'),
              el('span', {
                text: t(language, 'pantryUnlockTip', {
                  ingredient: topUnlock.ingredient,
                  count: topUnlock.unlocks,
                }),
              }),
            ],
          }),
          el('button', {
            className:
              'text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer',
            attrs: { type: 'button' },
            onClick: () => store.addBarIngredient(topUnlock.ingredient),
            text: `+ ${t(language, 'pantryAddSuggestion')}`,
          }),
        ],
      });
      section.appendChild(tipBar);
    }
  }

  return section;
}
