import {
  ArrowLeft,
  ArrowRight,
  Citrus,
  Flame,
  Leaf,
  Palmtree,
  RotateCcw,
  Sparkles,
  Timer,
  Wine,
} from 'lucide';
import type { AppState, QuizAnswers } from '../types/cocktail';
import { t } from '../i18n/translations';
import { matchRecipesWithBar } from '../utils/matcher';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';
import { createRecipeCard } from './recipeGrid';

let lastAnnouncedStep: number | null = null;

function optionClass(selected: boolean, extra = ''): string {
  const base =
    '!whitespace-normal !items-start text-left p-4 rounded-2xl group w-full border transition-all duration-200 min-h-[88px]';
  if (selected) {
    return `${base} ${extra} bg-[var(--accent-primary-soft)] border-[var(--accent-primary)] shadow-[inset_0_1px_0_var(--glass-highlight)] cursor-pointer active:scale-[0.98]`;
  }
  return `${base} ${extra} btn-glass`;
}

function recapChip(label: string): HTMLElement {
  return el('span', {
    className:
      'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold pill-glass-chip text-[var(--ink-primary)]',
    text: label,
  });
}

function createSkeletonCard(): HTMLElement {
  return el('div', {
    className: 'editorial-card rounded-2xl overflow-hidden animate-pulse',
    attrs: { 'aria-hidden': 'true' },
    children: [
      el('div', { className: 'h-44 bg-[var(--bg-muted)]' }),
      el('div', {
        className: 'p-5 space-y-3',
        children: [
          el('div', { className: 'h-3 w-24 rounded bg-[var(--bg-muted)]' }),
          el('div', { className: 'h-5 w-40 rounded bg-[var(--bg-muted)]' }),
          el('div', {
            className: 'flex gap-2',
            children: [
              el('div', { className: 'h-5 w-16 rounded bg-[var(--bg-muted)]' }),
              el('div', { className: 'h-5 w-20 rounded bg-[var(--bg-muted)]' }),
            ],
          }),
        ],
      }),
    ],
  });
}

function moodLabel(state: AppState, mood: QuizAnswers['mood']): string {
  const { language } = state;
  if (mood === 'refreshing') return t(language, 'quizMoodRefreshing');
  if (mood === 'bold') return t(language, 'quizMoodBold');
  if (mood === 'tropical') return t(language, 'quizMoodTropical');
  if (mood === 'zero-proof') return t(language, 'quizMoodZero');
  return '';
}

function baseLabel(state: AppState, base: QuizAnswers['base']): string {
  const { language } = state;
  const map: Record<NonNullable<QuizAnswers['base']>, string> = {
    gin: t(language, 'quizBaseGin'),
    vodka: t(language, 'quizBaseVodka'),
    rum: t(language, 'quizBaseRum'),
    whiskey: t(language, 'quizBaseWhiskey'),
    tequila: t(language, 'quizBaseTequila'),
    cachaca: t(language, 'quizBaseCachaca'),
    any: t(language, 'quizBaseAny'),
  };
  return base ? map[base] : '';
}

function complexityLabel(state: AppState, complexity: QuizAnswers['complexity']): string {
  if (complexity === 'quick') return t(state.language, 'quizComplexityQuick');
  if (complexity === 'craft') return t(state.language, 'quizComplexityCraft');
  return '';
}

function renderProgress(state: AppState, visualStep: number, totalSteps: number): HTMLElement {
  const { language, quizStep } = state;
  const progressPct = Math.round((visualStep / totalSteps) * 100);

  return el('div', {
    className: 'mb-6',
    children: [
      el('div', {
        className: 'flex items-center justify-between text-xs font-medium text-[var(--ink-muted)] mb-2',
        children: [
          quizStep > 1
            ? el('button', {
                className:
                  'inline-flex items-center gap-1 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer min-h-[32px]',
                attrs: { type: 'button' },
                onClick: () => store.goBackQuizStep(),
                children: [icon(ArrowLeft, 'w-3.5 h-3.5'), el('span', { text: t(language, 'quizBack') })],
              })
            : el('span', { className: 'min-h-[32px]' }),
          el('span', {
            className: 'font-mono',
            text: t(language, 'quizStepLabel', { step: visualStep, total: totalSteps }),
          }),
        ],
      }),
      el('div', {
        className: 'h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden',
        attrs: {
          role: 'progressbar',
          'aria-valuemin': '1',
          'aria-valuemax': String(totalSteps),
          'aria-valuenow': String(visualStep),
          'aria-label': t(language, 'quizProgressAria', { step: visualStep, total: totalSteps }),
        },
        children: [
          el('div', {
            className: 'h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300',
            attrs: { style: `width: ${progressPct}%;` },
          }),
        ],
      }),
      el('div', {
        className: 'flex items-center justify-center gap-1.5 mt-3',
        attrs: { 'aria-hidden': 'true' },
        children: Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) =>
          el('span', {
            className: `h-1.5 rounded-full transition-all duration-300 ${
              n <= visualStep
                ? 'w-6 bg-[var(--accent-primary)]'
                : 'w-1.5 bg-[var(--border-strong)]'
            }`,
          })
        ),
      }),
    ],
  });
}

function renderChoiceButton(opts: {
  title: string;
  desc: string;
  selected: boolean;
  iconNode?: typeof Sparkles;
  extraClass?: string;
  onClick: () => void;
}): HTMLElement {
  const selected = opts.selected;
  return el('button', {
    className: optionClass(selected, opts.extraClass ?? '!justify-between'),
    attrs: {
      type: 'button',
      role: 'radio',
      'aria-checked': String(selected),
    },
    onClick: opts.onClick,
    children: [
      el('div', {
        className: 'flex items-start gap-3 min-w-0 pr-2',
        children: [
          opts.iconNode &&
            el('span', {
              className: `mt-0.5 w-8 h-8 rounded-xl shrink-0 inline-flex items-center justify-center ${
                selected
                  ? 'bg-[var(--accent-primary)] text-[var(--ink-on-accent)]'
                  : 'bg-[var(--bg-muted)] text-[var(--accent-primary)]'
              }`,
              children: [icon(opts.iconNode, 'w-4 h-4')],
            }),
          el('div', {
            className: 'min-w-0',
            children: [
              el('p', {
                className: `font-semibold transition-colors ${
                  selected
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)]'
                }`,
                text: opts.title,
              }),
              el('p', {
                className: 'text-xs text-[var(--ink-secondary)] mt-1 leading-relaxed',
                text: opts.desc,
              }),
            ],
          }),
        ],
      }),
      icon(
        ArrowRight,
        `w-4 h-4 shrink-0 mt-1 ${
          selected ? 'text-[var(--accent-primary)]' : 'text-[var(--ink-muted)] group-hover:text-[var(--accent-primary)]'
        } icon-glide-right`
      ),
    ],
  });
}

function renderResults(state: AppState): HTMLElement {
  const { language, quizResults, quizLoading, barIngredients, quizAnswers } = state;
  const wrapper = el('section', {
    className: 'animate-fade-up',
    attrs: { 'aria-labelledby': 'quiz-result-heading' },
  });

  const recapBits: string[] = [];
  const mood = moodLabel(state, quizAnswers.mood);
  if (mood) recapBits.push(mood);
  if (quizAnswers.mood === 'zero-proof') {
    recapBits.push(t(language, 'quizSkipBaseNote'));
  } else {
    const base = baseLabel(state, quizAnswers.base);
    if (base) recapBits.push(base);
  }
  const complexity = complexityLabel(state, quizAnswers.complexity);
  if (complexity) recapBits.push(complexity);

  wrapper.appendChild(
    el('div', {
      className: 'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6',
      children: [
        el('div', {
          className: 'min-w-0',
          children: [
            el('div', {
              className: 'flex items-center gap-3 mb-2',
              children: [
                el('span', { className: 'h-px w-8 bg-[var(--accent-warm)]' }),
                el('span', {
                  className: 'text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-warm)]',
                  text: t(language, 'quizEyebrow'),
                }),
              ],
            }),
            el('h2', {
              className: 'text-2xl sm:text-4xl font-semibold text-[var(--ink-primary)] tracking-tight',
              text: t(language, 'quizResultTitle'),
              attrs: { id: 'quiz-result-heading', tabindex: '-1' },
            }),
            el('p', {
              className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-2 max-w-xl leading-relaxed',
              text: t(language, 'quizResultSubtitle'),
            }),
          ],
        }),
        el('button', {
          className: 'btn-glass self-start px-4 py-2.5 rounded-full text-xs font-semibold shrink-0',
          attrs: { type: 'button' },
          onClick: () => store.resetQuiz(),
          children: [icon(RotateCcw, 'w-3.5 h-3.5'), el('span', { text: t(language, 'quizRestart') })],
        }),
      ],
    })
  );

  if (recapBits.length > 0) {
    wrapper.appendChild(
      el('div', {
        className: 'mb-6',
        children: [
          el('p', {
            className: 'text-xs uppercase tracking-wider font-semibold text-[var(--ink-muted)] mb-2',
            text: t(language, 'quizRecapLabel'),
          }),
          el('div', {
            className: 'flex flex-wrap gap-2',
            children: recapBits.map((bit) => recapChip(bit)),
          }),
        ],
      })
    );
  }

  if (quizLoading) {
    wrapper.appendChild(
      el('p', {
        className: 'sr-only',
        attrs: { 'aria-live': 'polite' },
        text: t(language, 'loadingRecipes'),
      })
    );
    wrapper.appendChild(
      el('div', {
        className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
        children: [createSkeletonCard(), createSkeletonCard(), createSkeletonCard()],
      })
    );
    return wrapper;
  }

  const matchedPicks = matchRecipesWithBar(barIngredients, quizResults);

  if (matchedPicks.length === 0) {
    wrapper.appendChild(
      el('div', {
        className: 'editorial-card rounded-3xl p-10 sm:p-12 text-center flex flex-col items-center gap-3',
        children: [
          el('div', {
            className:
              'w-12 h-12 rounded-full bg-[var(--bg-muted)] text-[var(--ink-muted)] flex items-center justify-center',
            children: [icon(Sparkles, 'w-5 h-5')],
          }),
          el('h3', {
            className: 'text-xl font-semibold text-[var(--ink-primary)]',
            text: t(language, 'quizEmptyTitle'),
          }),
          el('p', {
            className: 'text-sm text-[var(--ink-secondary)] max-w-md',
            text: t(language, 'quizEmptyBody'),
          }),
          el('button', {
            className: 'btn-primary mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
            attrs: { type: 'button' },
            onClick: () => store.resetQuiz(),
            children: [
              el('span', { text: t(language, 'quizRestart') }),
              icon(ArrowRight, 'w-4 h-4 icon-glide-right'),
            ],
          }),
        ],
      })
    );
    return wrapper;
  }

  wrapper.appendChild(
    el('p', {
      className: 'text-xs font-mono text-[var(--ink-muted)] mb-3',
      attrs: { 'aria-live': 'polite' },
      text: t(language, 'quizPicksCount', { n: matchedPicks.length }),
    })
  );

  wrapper.appendChild(
    el('div', {
      className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
      children: matchedPicks.map((r, idx) => createRecipeCard(r, state, idx)),
    })
  );

  return wrapper;
}

export function renderQuizView(state: AppState): HTMLElement {
  const { language, quizStep, quizAnswers } = state;

  if (quizStep >= 4) {
    const results = renderResults(state);
    if (lastAnnouncedStep !== 4) {
      lastAnnouncedStep = 4;
      window.requestAnimationFrame(() => {
        document.getElementById('quiz-result-heading')?.focus();
      });
    }
    return results;
  }

  const totalSteps = quizAnswers.mood === 'zero-proof' ? 2 : 3;
  const visualStep = quizAnswers.mood === 'zero-proof' && quizStep === 3 ? 2 : quizStep;

  const wrapper = el('section', {
    className: 'max-w-4xl mx-auto animate-fade-up',
    attrs: { 'aria-labelledby': 'quiz-heading' },
  });

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
          attrs: { id: 'quiz-heading' },
        }),
        el('p', {
          className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-2 max-w-xl mx-auto leading-relaxed',
          text: t(language, 'quizSubtitle'),
        }),
      ],
    })
  );

  const card = el('div', {
    className: 'editorial-card rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto',
  });

  card.appendChild(renderProgress(state, visualStep, totalSteps));

  const question = el('h3', {
    className: 'text-xl sm:text-2xl font-semibold text-[var(--ink-primary)] mb-5',
    text:
      quizStep === 1
        ? t(language, 'quizQ1')
        : quizStep === 2
          ? t(language, 'quizQ2')
          : t(language, 'quizQ3'),
    attrs: { id: 'quiz-question', tabindex: '-1' },
  });
  card.appendChild(question);

  const group = el('div', {
    className: 'grid gap-3 animate-fade-up',
    attrs: {
      role: 'radiogroup',
      'aria-labelledby': 'quiz-question',
      'aria-label': t(language, 'quizOptionsAria'),
    },
  });

  if (quizStep === 1) {
    group.classList.add('grid-cols-1', 'sm:grid-cols-2');
    const options: {
      value: NonNullable<QuizAnswers['mood']>;
      title: string;
      desc: string;
      iconNode: typeof Sparkles;
    }[] = [
      {
        value: 'refreshing',
        title: t(language, 'quizMoodRefreshing'),
        desc: t(language, 'quizMoodRefreshingDesc'),
        iconNode: Citrus,
      },
      {
        value: 'bold',
        title: t(language, 'quizMoodBold'),
        desc: t(language, 'quizMoodBoldDesc'),
        iconNode: Flame,
      },
      {
        value: 'tropical',
        title: t(language, 'quizMoodTropical'),
        desc: t(language, 'quizMoodTropicalDesc'),
        iconNode: Palmtree,
      },
      {
        value: 'zero-proof',
        title: t(language, 'quizMoodZero'),
        desc: t(language, 'quizMoodZeroDesc'),
        iconNode: Leaf,
      },
    ];
    for (const opt of options) {
      group.appendChild(
        renderChoiceButton({
          title: opt.title,
          desc: opt.desc,
          selected: quizAnswers.mood === opt.value,
          iconNode: opt.iconNode,
          onClick: () => store.setQuizAnswer('mood', opt.value),
        })
      );
    }
  } else if (quizStep === 2) {
    group.classList.add('grid-cols-1', 'sm:grid-cols-2');
    const bases: {
      value: NonNullable<QuizAnswers['base']>;
      title: string;
      desc: string;
      iconNode: typeof Wine;
      span?: boolean;
    }[] = [
      {
        value: 'gin',
        title: t(language, 'quizBaseGin'),
        desc: t(language, 'quizBaseGinDesc'),
        iconNode: Citrus,
      },
      {
        value: 'vodka',
        title: t(language, 'quizBaseVodka'),
        desc: t(language, 'quizBaseVodkaDesc'),
        iconNode: Sparkles,
      },
      {
        value: 'rum',
        title: t(language, 'quizBaseRum'),
        desc: t(language, 'quizBaseRumDesc'),
        iconNode: Palmtree,
      },
      {
        value: 'whiskey',
        title: t(language, 'quizBaseWhiskey'),
        desc: t(language, 'quizBaseWhiskeyDesc'),
        iconNode: Flame,
      },
      {
        value: 'tequila',
        title: t(language, 'quizBaseTequila'),
        desc: t(language, 'quizBaseTequilaDesc'),
        iconNode: Leaf,
      },
      {
        value: 'cachaca',
        title: t(language, 'quizBaseCachaca'),
        desc: t(language, 'quizBaseCachacaDesc'),
        iconNode: Wine,
      },
      {
        value: 'any',
        title: t(language, 'quizBaseAny'),
        desc: t(language, 'quizBaseAnyDesc'),
        iconNode: Sparkles,
        span: true,
      },
    ];
    for (const b of bases) {
      group.appendChild(
        renderChoiceButton({
          title: b.title,
          desc: b.desc,
          selected: quizAnswers.base === b.value,
          iconNode: b.iconNode,
          extraClass: b.span ? 'sm:col-span-2 !justify-between' : '!justify-between',
          onClick: () => store.setQuizAnswer('base', b.value),
        })
      );
    }
  } else {
    group.classList.add('grid-cols-1', 'sm:grid-cols-2');
    const complexities: {
      value: NonNullable<QuizAnswers['complexity']>;
      title: string;
      desc: string;
      iconNode: typeof Timer;
    }[] = [
      {
        value: 'quick',
        title: t(language, 'quizComplexityQuick'),
        desc: t(language, 'quizComplexityQuickDesc'),
        iconNode: Timer,
      },
      {
        value: 'craft',
        title: t(language, 'quizComplexityCraft'),
        desc: t(language, 'quizComplexityCraftDesc'),
        iconNode: Wine,
      },
    ];
    for (const c of complexities) {
      group.appendChild(
        renderChoiceButton({
          title: c.title,
          desc: c.desc,
          selected: quizAnswers.complexity === c.value,
          iconNode: c.iconNode,
          extraClass: 'p-5 !justify-between',
          onClick: () => store.setQuizAnswer('complexity', c.value),
        })
      );
    }
  }

  card.appendChild(group);
  wrapper.appendChild(card);

  if (lastAnnouncedStep !== quizStep) {
    lastAnnouncedStep = quizStep;
    window.requestAnimationFrame(() => {
      document.getElementById('quiz-question')?.focus();
    });
  }

  return wrapper;
}
