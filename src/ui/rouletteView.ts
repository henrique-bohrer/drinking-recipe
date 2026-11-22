import {
  ArrowRight,
  BookOpen,
  GlassWater,
  Heart,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide';
import type {
  AppState,
  CocktailRecipe,
  Language,
  RouletteGender,
  RoulettePalate,
  RouletteProfile,
} from '../types/cocktail';
import { t } from '../i18n/translations';
import { el, icon } from '../utils/dom';
import { store } from '../state/store';
import { createRecipeArt } from './recipeArt';
import { showToast } from './toast';

// Keep clean keyboard handler reference so ArrowLeft / ArrowRight never double-bind
let activeDeckKeyHandler: ((e: KeyboardEvent) => void) | null = null;

function detachDeckKeyHandler(): void {
  if (activeDeckKeyHandler) {
    window.removeEventListener('keydown', activeDeckKeyHandler);
    activeDeckKeyHandler = null;
  }
}

function getFunnyBartenderQuip(profile: RouletteProfile, lang: Language): string {
  const { gender, age, palate } = profile;

  if (lang === 'en') {
    if (age < 18) {
      return 'Easy there, youngster! Zero-Proof only at this bar — but these mocktails still hit like a 5-star lounge.';
    }
    if (age <= 25) {
      if (gender === 'male') return 'Friday-night energy, champ! Deck stacked to your palate — swipe right if it tempts you.';
      if (gender === 'female') return 'Main-character energy! Vibrant picks dialed to your palate — swipe away.';
      return 'Weekend energy unlocked! Fresh picks tuned to your palate — swipe right to match.';
    }
    if (age <= 40) {
      if (gender === 'male') return 'Refined taste in the house! Balanced pours tuned to your palate — let the swiping begin.';
      if (gender === 'female') return 'Classy and decisive! Curated pours in your favorite style — swipe right to keep.';
      return 'Solid taste! Hand-picked cocktails matching your vibe — swipe right to save.';
    }
    const palateNote = palate === 'bitter' ? 'bold classics' : 'timeless pours';
    return `Respect to bar experience! Only ${palateNote} with real character on this deck.`;
  }

  // PT-BR playful bartender quips
  if (age < 18) {
    return 'Calma lá, jovem! Por aqui só rola Zero Álcool — mas esses mocktails dão aula em muito bar 5 estrelas.';
  }
  if (age <= 25) {
    if (gender === 'male') return 'Fala, campeão! Energia de sexta à noite: separei drinks no seu paladar. Arrasta aí!';
    if (gender === 'female') return 'Chegou quem manda na pista! Drinks vibrantes calibrados pro seu paladar — só arrastar!';
    return 'Clima de rolê liberado! Pilha calibrada pro seu paladar — arrasta pra direita se der vontade!';
  }
  if (age <= 40) {
    if (gender === 'male') return 'Aí sim, meu caro! Paladar já sabe o que quer — separei clássicos e descobertas na medida.';
    if (gender === 'female') return 'Com classe e sem enrolação! Drinks equilibrados no seu estilo — curtiu, arrasta pra direita.';
    return 'Bom gosto detectado! Coquetéis escolhidos pro seu paladar — deslize para descobrir o próximo.';
  }
  if (gender === 'male') return 'Respeito à experiência no balcão, mestre! Só coquetéis de personalidade, sem invencionice barata.';
  if (gender === 'female') return 'Elegância de quem entende do riscado! Só receitas de respeito calibradas pro seu paladar.';
  return 'Respeito à tradição do balcão! Pilha selecionada com drinks de caráter e equilíbrio.';
}

function renderOnboardingQuiz(state: AppState): HTMLElement {
  detachDeckKeyHandler();

  const { language, rouletteProfile } = state;

  let selectedGender: RouletteGender = rouletteProfile?.gender ?? 'male';
  let selectedPalate: RoulettePalate = rouletteProfile?.palate ?? 'citrus';
  let ageValue = rouletteProfile ? String(rouletteProfile.age) : '';
  let ageError = '';

  const wrapper = el('section', { className: 'max-w-2xl mx-auto animate-fade-up' });

  // Header
  wrapper.appendChild(
    el('div', {
      className: 'text-center mb-6',
      children: [
        el('span', {
          className:
            'pill-glass-chip inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--accent-warm)] mb-3',
          children: [
            icon(Sparkles, 'w-3.5 h-3.5'),
            el('span', { text: t(language, 'rouletteQuizBadge') }),
          ],
        }),
        el('h2', {
          className: 'text-3xl sm:text-4xl font-semibold text-[var(--ink-primary)] tracking-tight',
          text: t(language, 'rouletteQuizTitle'),
        }),
        el('p', {
          className: 'text-sm sm:text-base text-[var(--ink-secondary)] mt-2 max-w-lg mx-auto',
          text: t(language, 'rouletteQuizSubtitle'),
        }),
      ],
    })
  );

  const formCard = el('form', {
    className: 'editorial-card rounded-3xl p-5 sm:p-7 space-y-6',
  });

  // 1) Gender
  const genderWrap = el('div', { className: 'space-y-2.5' });
  genderWrap.appendChild(
    el('label', {
      className: 'block text-sm font-semibold text-[var(--ink-primary)]',
      text: t(language, 'rouletteGenderLabel'),
    })
  );

  const genderButtonsHost = el('div', {
    className: 'btn-group-dynamic !flex flex-wrap',
    attrs: { role: 'radiogroup' },
  });

  const genderOpts: { id: RouletteGender; label: string }[] = [
    { id: 'male', label: t(language, 'rouletteGenderMale') },
    { id: 'female', label: t(language, 'rouletteGenderFemale') },
    { id: 'other', label: t(language, 'rouletteGenderOther') },
  ];

  const paintGenderButtons = () => {
    genderButtonsHost.replaceChildren(
      ...genderOpts.map((opt) => {
        const active = selectedGender === opt.id;
        return el('button', {
          className: active
            ? 'btn-primary flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-sm font-semibold'
            : 'btn-glass flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]',
          attrs: { type: 'button', 'aria-pressed': String(active) },
          onClick: () => {
            selectedGender = opt.id;
            paintGenderButtons();
          },
          text: opt.label,
        });
      })
    );
  };
  paintGenderButtons();
  genderWrap.appendChild(genderButtonsHost);
  formCard.appendChild(genderWrap);

  // 2) Favorite Palate
  const palateWrap = el('div', { className: 'space-y-2.5' });
  palateWrap.appendChild(
    el('label', {
      className: 'block text-sm font-semibold text-[var(--ink-primary)]',
      text: t(language, 'roulettePalateLabel'),
    })
  );

  const palateGrid = el('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' });
  const palateOpts: { id: RoulettePalate; title: string; desc: string }[] = [
    { id: 'sweet', title: t(language, 'roulettePalateSweet'), desc: t(language, 'roulettePalateSweetDesc') },
    { id: 'citrus', title: t(language, 'roulettePalateCitrus'), desc: t(language, 'roulettePalateCitrusDesc') },
    { id: 'bitter', title: t(language, 'roulettePalateBitter'), desc: t(language, 'roulettePalateBitterDesc') },
    { id: 'balanced', title: t(language, 'roulettePalateBalanced'), desc: t(language, 'roulettePalateBalancedDesc') },
  ];

  const paintPalateGrid = () => {
    palateGrid.replaceChildren(
      ...palateOpts.map((opt) => {
        const active = selectedPalate === opt.id;
        return el('button', {
          className: `${
            active
              ? 'bg-[var(--accent-primary-soft)] border-[var(--accent-primary)] shadow-[inset_0_1px_0_var(--glass-highlight)]'
              : 'btn-glass'
          } !whitespace-normal !justify-start !items-start flex-col text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.98]`,
          attrs: { type: 'button', 'aria-pressed': String(active) },
          onClick: () => {
            selectedPalate = opt.id;
            paintPalateGrid();
          },
          children: [
            el('span', {
              className: `text-sm font-semibold ${
                active ? 'text-[var(--accent-primary)]' : 'text-[var(--ink-primary)]'
              }`,
              text: opt.title,
            }),
            el('span', {
              className: 'text-xs text-[var(--ink-secondary)] mt-0.5 leading-snug',
              text: opt.desc,
            }),
          ],
        });
      })
    );
  };
  paintPalateGrid();
  palateWrap.appendChild(palateGrid);
  formCard.appendChild(palateWrap);

  // 3) Age Input + Live humorous teaser
  const ageWrap = el('div', { className: 'space-y-2' });
  ageWrap.appendChild(
    el('label', {
      className: 'block text-sm font-semibold text-[var(--ink-primary)]',
      text: t(language, 'rouletteAgeLabel'),
      attrs: { for: 'roulette-age-input' },
    })
  );

  const ageInput = el('input', {
    className:
      'w-full sm:w-44 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2.5 text-base font-mono text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors',
    attrs: {
      id: 'roulette-age-input',
      type: 'number',
      inputmode: 'numeric',
      min: '10',
      max: '110',
      placeholder: t(language, 'rouletteAgePlaceholder'),
      required: 'true',
    },
  });
  ageInput.value = ageValue;

  const ageFeedback = el('p', { className: 'text-xs min-h-[18px]' });

  const updateAgeFeedback = () => {
    const parsed = Number(ageInput.value);
    if (ageError) {
      ageFeedback.className = 'text-xs text-[var(--accent-warm)] font-medium';
      ageFeedback.textContent = ageError;
      return;
    }
    if (ageInput.value && !Number.isNaN(parsed) && parsed >= 10 && parsed < 18) {
      ageFeedback.className = 'text-xs text-[var(--accent-primary)] font-medium';
      ageFeedback.textContent = t(language, 'rouletteUnderageBanner');
      return;
    }
    ageFeedback.textContent = '';
  };

  ageInput.addEventListener('input', () => {
    ageValue = ageInput.value;
    ageError = '';
    updateAgeFeedback();
  });
  updateAgeFeedback();

  ageWrap.append(ageInput, ageFeedback);
  formCard.appendChild(ageWrap);

  // Submit Button
  const submitBtn = el('button', {
    className: 'btn-primary w-full py-3.5 rounded-2xl text-sm sm:text-base font-semibold min-h-[48px]',
    attrs: { type: 'submit' },
    children: [
      el('span', { text: t(language, 'rouletteStartBtn') }),
      icon(ArrowRight, 'w-4 h-4 icon-glide-right'),
    ],
  });
  formCard.appendChild(submitBtn);

  formCard.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const ageNum = Math.round(Number(ageInput.value));
    if (!ageInput.value || Number.isNaN(ageNum) || ageNum < 10 || ageNum > 110) {
      ageError = t(language, 'rouletteAgeInvalid');
      updateAgeFeedback();
      ageInput.focus();
      return;
    }
    store.submitRouletteProfile({
      gender: selectedGender,
      palate: selectedPalate,
      age: ageNum,
    });
  });

  wrapper.appendChild(formCard);
  return wrapper;
}

function buildSwipeCardBody(recipe: CocktailRecipe, language: Language): HTMLElement {
  const art = createRecipeArt(recipe, 'h-64 sm:h-72');
  // Prevent browser native image ghost drag so pointer drag stays buttery smooth!
  const img = art.querySelector('img');
  if (img) img.setAttribute('draggable', 'false');

  if (!recipe.alcoholic) {
    art.appendChild(
      el('span', {
        className:
          'absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold glass-badge-ready',
        text: t(language, 'nonAlcoholicBadge'),
      })
    );
  }

  const content = el('div', {
    className: 'p-5 sm:p-6 flex flex-col gap-3',
    children: [
      el('div', {
        children: [
          el('p', {
            className: 'text-[11px] uppercase tracking-widest font-semibold text-[var(--accent-warm)] mb-1',
            text: recipe.category,
          }),
          el('h3', {
            className: 'text-2xl sm:text-3xl font-semibold text-[var(--ink-primary)] leading-tight',
            text: recipe.name,
          }),
          recipe.glass &&
            el('p', {
              className: 'text-xs text-[var(--ink-muted)] inline-flex items-center gap-1.5 mt-1.5',
              children: [icon(GlassWater, 'w-3.5 h-3.5'), el('span', { text: recipe.glass })],
            }),
        ],
      }),
      el('div', {
        className: 'flex flex-wrap gap-1.5 pt-1',
        children: recipe.ingredients.slice(0, 6).map((ing) =>
          el('span', {
            className: 'pill-glass-chip text-xs px-2.5 py-1 rounded-lg text-[var(--ink-primary)]',
            text: ing.name,
          })
        ),
      }),
    ],
  });

  const container = el('div', { className: 'flex flex-col' });
  container.append(art, content);
  return container;
}

export function renderRouletteView(state: AppState): HTMLElement {
  const {
    language,
    rouletteProfile,
    rouletteShowQuiz,
    rouletteDeck,
    rouletteLiked,
    rouletteHistory,
    rouletteLoading,
  } = state;

  if (rouletteShowQuiz || !rouletteProfile) {
    return renderOnboardingQuiz(state);
  }

  detachDeckKeyHandler();

  const wrapper = el('section', { className: 'max-w-2xl mx-auto animate-fade-up' });

  // Top Header + Funny Personalized Bartender Comment + Edit Profile Button
  const topHeader = el('div', {
    className: 'flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5',
    children: [
      el('div', {
        className: 'min-w-0',
        children: [
          el('p', {
            className: 'text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-warm)] mb-1',
            text: t(language, 'rouletteEyebrow'),
          }),
          el('h2', {
            className: 'text-2xl sm:text-3xl font-semibold text-[var(--ink-primary)] tracking-tight',
            text: t(language, 'rouletteTitle'),
          }),
        ],
      }),
      el('button', {
        className: 'btn-glass self-start px-3.5 py-2 rounded-full text-xs font-semibold',
        attrs: { type: 'button' },
        onClick: () => store.editRouletteProfile(),
        children: [
          icon(SlidersHorizontal, 'w-3.5 h-3.5 text-[var(--accent-primary)]'),
          el('span', { text: t(language, 'rouletteEditProfileBtn') }),
        ],
      }),
    ],
  });
  wrapper.appendChild(topHeader);

  // Bartender Quip Callout
  wrapper.appendChild(
    el('div', {
      className:
        'glass-panel rounded-2xl px-4 py-3 mb-6 flex items-start gap-2.5 text-xs sm:text-sm text-[var(--ink-secondary)]',
      children: [
        icon(
          rouletteProfile.age < 18 ? ShieldCheck : Sparkles,
          'w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-primary)]'
        ),
        el('p', {
          className: 'leading-relaxed text-[var(--ink-primary)]',
          text: getFunnyBartenderQuip(rouletteProfile, language),
        }),
      ],
    })
  );

  const currentCard = rouletteDeck[0];
  const nextCard = rouletteDeck[1];

  // Empty Deck State (or loading new batch)
  if (!currentCard) {
    wrapper.appendChild(
      el('div', {
        className: 'editorial-card rounded-3xl p-10 text-center flex flex-col items-center gap-4',
        children: [
          el('p', {
            className: 'text-sm text-[var(--ink-secondary)] max-w-sm',
            text: rouletteLoading ? t(language, 'rouletteLoadingDeck') : t(language, 'rouletteEmptyDeck'),
          }),
          !rouletteLoading &&
            el('button', {
              className: 'btn-primary px-5 py-3 rounded-xl text-sm font-semibold',
              attrs: { type: 'button' },
              onClick: () => void store.replenishRouletteDeck(),
              text: t(language, 'rouletteRefillBtn'),
            }),
        ],
      })
    );
  } else {
    // Card Stack Stage
    const stage = el('div', {
      className: 'relative w-full max-w-[400px] mx-auto mb-5',
    });

    // Peeking Background Card (2nd card in queue)
    let backCardEl: HTMLElement | null = null;
    if (nextCard) {
      backCardEl = el('div', {
        className:
          'editorial-card rounded-3xl overflow-hidden absolute inset-0 pointer-events-none select-none',
        attrs: {
          'aria-hidden': 'true',
          style: 'transform: scale(0.94) translateY(14px); opacity: 0.62;',
        },
        children: [buildSwipeCardBody(nextCard, language)],
      });
      stage.appendChild(backCardEl);
    }

    // Active Draggable Top Card
    const likeStamp = el('div', {
      className: 'swipe-stamp swipe-stamp-like',
      text: t(language, 'rouletteStampLike'),
    });
    const nopeStamp = el('div', {
      className: 'swipe-stamp swipe-stamp-nope',
      text: t(language, 'rouletteStampNope'),
    });

    const frontCardEl = el('article', {
      className:
        'swipe-card editorial-card rounded-3xl overflow-hidden relative z-10 cursor-grab active:cursor-grabbing',
      children: [likeStamp, nopeStamp, buildSwipeCardBody(currentCard, language)],
    });

    let isSwipingOut = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let currentDx = 0;
    let currentDy = 0;
    let startTime = 0;

    const triggerSwipe = (dir: 'left' | 'right') => {
      if (isSwipingOut) return;
      isSwipingOut = true;

      const flyX = dir === 'right' ? 520 : -520;
      const rot = dir === 'right' ? 22 : -22;

      likeStamp.style.opacity = dir === 'right' ? '1' : '0';
      nopeStamp.style.opacity = dir === 'left' ? '1' : '0';

      frontCardEl.style.transition =
        'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease';
      frontCardEl.style.transform = `translate3d(${flyX}px, 28px, 0) rotate(${rot}deg)`;
      frontCardEl.style.opacity = '0';

      if (backCardEl) {
        backCardEl.style.transition =
          'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease';
        backCardEl.style.transform = 'scale(1) translateY(0px)';
        backCardEl.style.opacity = '1';
      }

      window.setTimeout(() => {
        const swiped = store.swipeRoulette(dir);
        if (dir === 'right' && swiped) {
          showToast(t(language, 'rouletteMatchToast', { name: swiped.name }), 'success');
        }
      }, 250);
    };

    frontCardEl.addEventListener('pointerdown', (ev) => {
      if (isSwipingOut || ev.button !== 0) return;
      dragging = true;
      startX = ev.clientX;
      startY = ev.clientY;
      currentDx = 0;
      currentDy = 0;
      startTime = Date.now();
      frontCardEl.style.transition = 'none';
      if (backCardEl) backCardEl.style.transition = 'none';
      try {
        frontCardEl.setPointerCapture(ev.pointerId);
      } catch {
        // Ignore capture issues on synthetic pointers
      }
    });

    frontCardEl.addEventListener('pointermove', (ev) => {
      if (!dragging || isSwipingOut) return;
      currentDx = ev.clientX - startX;
      currentDy = ev.clientY - startY;

      const rotateDeg = currentDx * 0.048;
      frontCardEl.style.transform = `translate3d(${currentDx}px, ${currentDy * 0.16}px, 0) rotate(${rotateDeg}deg)`;

      const progress = Math.min(1, Math.abs(currentDx) / 110);
      if (currentDx > 14) {
        likeStamp.style.opacity = String(progress);
        nopeStamp.style.opacity = '0';
      } else if (currentDx < -14) {
        nopeStamp.style.opacity = String(progress);
        likeStamp.style.opacity = '0';
      } else {
        likeStamp.style.opacity = '0';
        nopeStamp.style.opacity = '0';
      }

      if (backCardEl) {
        const scale = 0.94 + progress * 0.06;
        const y = 14 - progress * 14;
        const opacity = 0.62 + progress * 0.38;
        backCardEl.style.transform = `scale(${scale}) translateY(${y}px)`;
        backCardEl.style.opacity = String(opacity);
      }
    });

    const endDrag = (ev: PointerEvent) => {
      if (!dragging || isSwipingOut) return;
      dragging = false;
      try {
        if (frontCardEl.hasPointerCapture(ev.pointerId)) {
          frontCardEl.releasePointerCapture(ev.pointerId);
        }
      } catch {
        // Ignore
      }

      const elapsed = Math.max(1, Date.now() - startTime);
      const velocity = Math.abs(currentDx) / elapsed;
      const shouldCommit = Math.abs(currentDx) > 95 || (Math.abs(currentDx) > 45 && velocity > 0.45);

      if (shouldCommit) {
        triggerSwipe(currentDx > 0 ? 'right' : 'left');
        return;
      }

      // Smooth spring snap-back
      frontCardEl.style.transition = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)';
      frontCardEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      likeStamp.style.opacity = '0';
      nopeStamp.style.opacity = '0';

      if (backCardEl) {
        backCardEl.style.transition =
          'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease';
        backCardEl.style.transform = 'scale(0.94) translateY(14px)';
        backCardEl.style.opacity = '0.62';
      }
    };

    frontCardEl.addEventListener('pointerup', endDrag);
    frontCardEl.addEventListener('pointercancel', endDrag);

    // Desktop keyboard shortcuts (ArrowLeft / ArrowRight) when modal is closed
    activeDeckKeyHandler = (ev: KeyboardEvent) => {
      const st = store.getState();
      if (st.activeTab !== 'roulette' || st.selectedRecipe || st.rouletteShowQuiz) return;
      if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        triggerSwipe('left');
      } else if (ev.key === 'ArrowRight') {
        ev.preventDefault();
        triggerSwipe('right');
      }
    };
    window.addEventListener('keydown', activeDeckKeyHandler);

    stage.appendChild(frontCardEl);
    wrapper.appendChild(stage);

    // Drag hint text
    wrapper.appendChild(
      el('p', {
        className: 'text-center text-xs text-[var(--ink-muted)] mb-4',
        text: t(language, 'rouletteSwipeHint'),
      })
    );

    // Tactile Action Dock (Undo · Pass · Open Recipe · Like)
    const actionDock = el('div', {
      className: 'flex items-center justify-center gap-3 flex-wrap mb-7',
      children: [
        el('button', {
          className: 'btn-glass w-11 h-11 !p-0 rounded-full text-[var(--ink-secondary)]',
          attrs: {
            type: 'button',
            'aria-label': t(language, 'rouletteBtnUndo'),
            title: t(language, 'rouletteBtnUndo'),
            ...(rouletteHistory.length === 0 ? { disabled: 'true' } : {}),
          },
          onClick: () => store.undoRouletteSwipe(),
          children: [icon(RotateCcw, 'w-4 h-4')],
        }),
        el('button', {
          className:
            'btn-glass px-5 py-3 rounded-full text-sm font-semibold text-[var(--accent-warm)] min-h-[48px]',
          attrs: { type: 'button', 'aria-label': t(language, 'rouletteBtnNope') },
          onClick: () => triggerSwipe('left'),
          children: [icon(X, 'w-5 h-5'), el('span', { text: t(language, 'rouletteBtnNope') })],
        }),
        el('button', {
          className: 'btn-glass px-4 py-3 rounded-full text-xs sm:text-sm font-semibold min-h-[48px]',
          attrs: { type: 'button' },
          onClick: () => store.openRecipe(currentCard),
          children: [
            icon(BookOpen, 'w-4 h-4 text-[var(--accent-primary)]'),
            el('span', { text: t(language, 'rouletteViewDetails') }),
          ],
        }),
        el('button', {
          className: 'btn-primary px-5 py-3 rounded-full text-sm font-semibold min-h-[48px]',
          attrs: { type: 'button', 'aria-label': t(language, 'rouletteBtnLike') },
          onClick: () => triggerSwipe('right'),
          children: [icon(Heart, 'w-5 h-5 fill-current'), el('span', { text: t(language, 'rouletteBtnLike') })],
        }),
      ],
    });
    wrapper.appendChild(actionDock);
  }

  // Session Matches Strip (drinks you swiped right on!)
  if (rouletteLiked.length > 0) {
    const matchesSection = el('div', {
      className: 'pt-5 border-t border-[var(--border-subtle)]',
      children: [
        el('p', {
          className: 'text-xs uppercase tracking-wider font-semibold text-[var(--ink-muted)] mb-3',
          text: `${t(language, 'rouletteMatchesTitle')} (${rouletteLiked.length})`,
        }),
        el('div', {
          className: 'flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1',
          children: rouletteLiked.map((liked) =>
            el('button', {
              className:
                'btn-glass shrink-0 pl-2 pr-3.5 py-1.5 rounded-full text-xs font-semibold',
              attrs: { type: 'button' },
              onClick: () => store.openRecipe(liked),
              children: [
                liked.image
                  ? el('img', {
                      className: 'w-6 h-6 rounded-full object-cover shrink-0',
                      attrs: { src: liked.image, alt: '' },
                    })
                  : el('span', {
                      className:
                        'w-6 h-6 rounded-full bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] inline-flex items-center justify-center shrink-0',
                      children: [icon(Heart, 'w-3 h-3 fill-current')],
                    }),
                el('span', { text: liked.name }),
              ],
            })
          ),
        }),
      ],
    });
    wrapper.appendChild(matchesSection);
  }

  return wrapper;
}
