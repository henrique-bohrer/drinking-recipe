import { ArrowLeft, RotateCcw, Sparkles } from 'lucide';
import type { AppState, QuizAnswers } from '../types/cocktail';
import { t } from '../i18n/translations';
import { matchRecipesWithBar } from '../utils/matcher';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';
import { createRecipeCard } from './recipeGrid';

export function renderQuizView(state: AppState): HTMLElement {
  const { language, quizStep, quizResults, quizLoading, barIngredients } = state;

  const wrapper = el('section', { className: 'max-w-4xl mx-auto animate-fade-up' });

  wrapper.appendChild(
    el('div', {
      className: 'text-center mb-7',
      children: [
        el('p', {
          className: 'text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-warm)] mb-2',
          text: t(language, 'quizEyebrow'),
        }),
        el('h2', {
          className: 'text-3xl sm:text-4xl font-semibold text-[var(--ink-primary)] tracking-tight',
          text: t(language, 'quizTitle'),
        }),
        el('p', {
          className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-2 max-w-xl mx-auto',
          text: t(language, 'quizSubtitle'),
        }),
      ],
    })
  );

  // Results View (Step 4)
  if (quizStep >= 4) {
    const headerRow = el('div', {
      className: 'flex flex-wrap items-center justify-between gap-3 mb-5',
      children: [
        el('div', {
          children: [
            el('h3', {
              className: 'text-xl sm:text-2xl font-semibold text-[var(--ink-primary)]',
              text: t(language, 'quizResultTitle'),
            }),
            el('p', {
              className: 'text-sm text-[var(--ink-secondary)]',
              text: t(language, 'quizResultSubtitle'),
            }),
          ],
        }),
        el('button', {
          className:
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-strong)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer',
          attrs: { type: 'button' },
          onClick: () => store.resetQuiz(),
          children: [icon(RotateCcw, 'w-3.5 h-3.5'), el('span', { text: t(language, 'quizRestart') })],
        }),
      ],
    });
    wrapper.appendChild(headerRow);

    if (quizLoading) {
      wrapper.appendChild(
        el('div', {
          className: 'editorial-card rounded-2xl p-12 text-center text-sm text-[var(--ink-secondary)]',
          children: [
            el('span', {
              className: 'inline-flex items-center gap-2',
              children: [icon(Sparkles, 'w-4 h-4 text-[var(--accent-amber)] animate-pulse'), el('span', { text: t(language, 'loadingRecipes') })],
            }),
          ],
        })
      );
      return wrapper;
    }

    const matchedPicks = matchRecipesWithBar(barIngredients, quizResults);
    wrapper.appendChild(
      el('div', {
        className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
        children: matchedPicks.map((r) => createRecipeCard(r, state)),
      })
    );
    return wrapper;
  }

  // Wizard Card (Steps 1..3)
  const card = el('div', {
    className: 'editorial-card rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto',
  });

  // Progress bar + back button
  const progressPct = Math.round((quizStep / 3) * 100);
  card.appendChild(
    el('div', {
      className: 'mb-6',
      children: [
        el('div', {
          className: 'flex items-center justify-between text-xs font-medium text-[var(--ink-muted)] mb-2',
          children: [
            quizStep > 1
              ? el('button', {
                  className:
                    'inline-flex items-center gap-1 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer',
                  attrs: { type: 'button' },
                  onClick: () => store.goBackQuizStep(),
                  children: [icon(ArrowLeft, 'w-3.5 h-3.5'), el('span', { text: t(language, 'quizBack') })],
                })
              : el('span'),
            el('span', {
              className: 'font-mono',
              text: t(language, 'quizStepLabel', { step: quizStep }),
            }),
          ],
        }),
        el('div', {
          className: 'h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden',
          children: [
            el('div', {
              className: 'h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300',
              attrs: { style: `width: ${progressPct}%;` },
            }),
          ],
        }),
      ],
    })
  );

  if (quizStep === 1) {
    card.appendChild(
      el('h3', {
        className: 'text-xl sm:text-2xl font-semibold text-[var(--ink-primary)] mb-5',
        text: t(language, 'quizQ1'),
      })
    );

    const options: { value: NonNullable<QuizAnswers['mood']>; title: string; desc: string }[] = [
      { value: 'refreshing', title: t(language, 'quizMoodRefreshing'), desc: t(language, 'quizMoodRefreshingDesc') },
      { value: 'bold', title: t(language, 'quizMoodBold'), desc: t(language, 'quizMoodBoldDesc') },
      { value: 'tropical', title: t(language, 'quizMoodTropical'), desc: t(language, 'quizMoodTropicalDesc') },
      { value: 'zero-proof', title: t(language, 'quizMoodZero'), desc: t(language, 'quizMoodZeroDesc') },
    ];

    card.appendChild(
      el('div', {
        className: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
        children: options.map((opt) =>
          el('button', {
            className:
              'text-left p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)]/40 transition-all cursor-pointer group',
            attrs: { type: 'button' },
            onClick: () => store.setQuizAnswer('mood', opt.value),
            children: [
              el('p', {
                className: 'font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)]',
                text: opt.title,
              }),
              el('p', {
                className: 'text-xs text-[var(--ink-secondary)] mt-1 leading-relaxed',
                text: opt.desc,
              }),
            ],
          })
        ),
      })
    );
  } else if (quizStep === 2) {
    card.appendChild(
      el('h3', {
        className: 'text-xl sm:text-2xl font-semibold text-[var(--ink-primary)] mb-5',
        text: t(language, 'quizQ2'),
      })
    );

    const bases: { value: NonNullable<QuizAnswers['base']>; label: string }[] = [
      { value: 'gin', label: 'Gin' },
      { value: 'vodka', label: 'Vodka' },
      { value: 'rum', label: 'Rum' },
      { value: 'whiskey', label: 'Bourbon / Whisky' },
      { value: 'tequila', label: 'Tequila' },
      { value: 'cachaca', label: 'Cachaça' },
      { value: 'any', label: t(language, 'quizBaseAny') },
    ];

    card.appendChild(
      el('div', {
        className: 'grid grid-cols-2 sm:grid-cols-3 gap-3',
        children: bases.map((b) =>
          el('button', {
            className: `p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-sm font-semibold text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)]/40 hover:text-[var(--accent-primary)] transition-all cursor-pointer ${
              b.value === 'any' ? 'col-span-2 sm:col-span-3' : ''
            }`,
            attrs: { type: 'button' },
            onClick: () => store.setQuizAnswer('base', b.value),
            text: b.label,
          })
        ),
      })
    );
  } else if (quizStep === 3) {
    card.appendChild(
      el('h3', {
        className: 'text-xl sm:text-2xl font-semibold text-[var(--ink-primary)] mb-5',
        text: t(language, 'quizQ3'),
      })
    );

    const complexities: { value: NonNullable<QuizAnswers['complexity']>; title: string; desc: string }[] = [
      {
        value: 'quick',
        title: t(language, 'quizComplexityQuick'),
        desc: t(language, 'quizComplexityQuickDesc'),
      },
      {
        value: 'craft',
        title: t(language, 'quizComplexityCraft'),
        desc: t(language, 'quizComplexityCraftDesc'),
      },
    ];

    card.appendChild(
      el('div', {
        className: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
        children: complexities.map((c) =>
          el('button', {
            className:
              'text-left p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)]/40 transition-all cursor-pointer group',
            attrs: { type: 'button' },
            onClick: () => store.setQuizAnswer('complexity', c.value),
            children: [
              el('p', {
                className: 'font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)]',
                text: c.title,
              }),
              el('p', {
                className: 'text-xs text-[var(--ink-secondary)] mt-1.5 leading-relaxed',
                text: c.desc,
              }),
            ],
          })
        ),
      })
    );
  }

  wrapper.appendChild(card);
  return wrapper;
}
