import './styles/main.css';
import type { AppState } from './types/cocktail';
import { store } from './state/store';
import { el } from './utils/dom';
import {
  renderExploreHero,
  renderFooter,
  renderHeader,
  renderMobileBottomNav,
} from './ui/appShell';
import { renderHouseMenuBook } from './ui/menuBook';
import { renderBarPantry } from './ui/barPantry';
import { renderExploreResults, renderExploreToolbar } from './ui/recipeGrid';
import { renderRouletteView } from './ui/rouletteView';
import { renderQuizView } from './ui/quizView';
import { renderFavoritesView } from './ui/favoritesView';
import { renderRecipeModal } from './ui/recipeModal';

function bootstrap(): void {
  const root = document.getElementById('app');
  if (!root) return;

  const headerSlot = el('div');
  const mainSlot = el('main', {
    className: 'max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8',
  });
  const footerSlot = el('div', { className: 'max-w-6xl mx-auto px-4 sm:px-6' });
  const mobileNavSlot = el('div');
  const modalSlot = el('div');

  // Persistent sub-slots for Explore view so typing in search/pantry never unmounts inputs
  const exploreContainer = el('div');
  const menuBookSlot = el('div');
  const pantryDivider = el('div', {
    className: 'border-t border-[var(--border-subtle)] pt-8 sm:pt-10',
    attrs: { id: 'pantry-anchor' },
  });
  const heroSlot = el('div');
  const pantrySlot = el('div');
  const toolbarSlot = el('div');
  const resultsSlot = el('div');
  pantryDivider.append(heroSlot, pantrySlot, toolbarSlot, resultsSlot);
  exploreContainer.append(menuBookSlot, pantryDivider);

  root.replaceChildren(headerSlot, mainSlot, footerSlot, mobileNavSlot, modalSlot);

  let prevState: AppState | null = null;

  const rerenderModalOnly = () => {
    renderRecipeModal(store.getState(), modalSlot, rerenderModalOnly);
  };

  const renderApp = () => {
    const state = store.getState();
    const prev = prevState;

    const headerChanged =
      !prev ||
      prev.language !== state.language ||
      prev.theme !== state.theme ||
      prev.activeTab !== state.activeTab ||
      prev.favorites !== state.favorites;

    if (headerChanged) {
      headerSlot.replaceChildren(renderHeader(state));
      mobileNavSlot.replaceChildren(renderMobileBottomNav(state));
    }

    if (!prev || prev.language !== state.language) {
      footerSlot.replaceChildren(renderFooter(state));
    }

    if (state.activeTab === 'explore') {
      const tabSwitchedToExplore = !prev || prev.activeTab !== 'explore';
      if (tabSwitchedToExplore) {
        mainSlot.replaceChildren(exploreContainer);
      }

      if (tabSwitchedToExplore || prev.language !== state.language) {
        menuBookSlot.replaceChildren(renderHouseMenuBook(state));
        heroSlot.replaceChildren(renderExploreHero(state));
      }

      const pantryChanged =
        tabSwitchedToExplore ||
        prev.language !== state.language ||
        prev.barIngredients !== state.barIngredients ||
        prev.catalogIngredients !== state.catalogIngredients ||
        prev.recipes !== state.recipes;

      if (pantryChanged && document.activeElement?.id !== 'pantry-ingredient-input') {
        pantrySlot.replaceChildren(renderBarPantry(state));
      } else if (
        pantryChanged &&
        (!prev || prev.barIngredients !== state.barIngredients || prev.language !== state.language)
      ) {
        pantrySlot.replaceChildren(renderBarPantry(state));
      }

      const toolbarChanged =
        tabSwitchedToExplore ||
        prev.language !== state.language ||
        prev.alcoholFilter !== state.alcoholFilter ||
        prev.sortMode !== state.sortMode ||
        (prev.searchQuery !== state.searchQuery &&
          document.activeElement?.id !== 'recipe-name-search');

      if (toolbarChanged) {
        toolbarSlot.replaceChildren(renderExploreToolbar(state));
      }

      const resultsChanged =
        tabSwitchedToExplore ||
        prev.language !== state.language ||
        prev.barIngredients !== state.barIngredients ||
        prev.searchQuery !== state.searchQuery ||
        prev.alcoholFilter !== state.alcoholFilter ||
        prev.sortMode !== state.sortMode ||
        prev.recipes !== state.recipes ||
        prev.isLoadingRecipes !== state.isLoadingRecipes ||
        prev.apiError !== state.apiError ||
        prev.favorites !== state.favorites;

      if (resultsChanged) {
        resultsSlot.replaceChildren(renderExploreResults(state));
      }
    } else if (state.activeTab === 'roulette') {
      const rouletteChanged =
        !prev ||
        prev.activeTab !== 'roulette' ||
        prev.language !== state.language ||
        prev.rouletteShowQuiz !== state.rouletteShowQuiz ||
        prev.rouletteProfile !== state.rouletteProfile ||
        prev.rouletteDeck[0]?.id !== state.rouletteDeck[0]?.id ||
        prev.rouletteDeck[1]?.id !== state.rouletteDeck[1]?.id ||
        prev.rouletteLiked !== state.rouletteLiked ||
        prev.rouletteHistory !== state.rouletteHistory ||
        (state.rouletteDeck.length === 0 && prev.rouletteLoading !== state.rouletteLoading);

      if (rouletteChanged) {
        mainSlot.replaceChildren(renderRouletteView(state));
      }
    } else if (state.activeTab === 'quiz') {
      const quizChanged =
        !prev ||
        prev.activeTab !== 'quiz' ||
        prev.language !== state.language ||
        prev.quizStep !== state.quizStep ||
        prev.quizLoading !== state.quizLoading ||
        prev.quizResults !== state.quizResults ||
        prev.quizAnswers !== state.quizAnswers ||
        prev.barIngredients !== state.barIngredients ||
        prev.favorites !== state.favorites;

      if (quizChanged) {
        mainSlot.replaceChildren(renderQuizView(state));
      }
    } else if (state.activeTab === 'favorites') {
      mainSlot.replaceChildren(renderFavoritesView(state));
    }

    const modalChanged =
      !prev ||
      prev.selectedRecipe !== state.selectedRecipe ||
      (state.selectedRecipe !== null &&
        (prev.language !== state.language ||
          prev.unit !== state.unit ||
          prev.favorites !== state.favorites ||
          prev.tastingNotes !== state.tastingNotes));

    if (modalChanged) {
      renderRecipeModal(state, modalSlot, rerenderModalOnly);
    }

    prevState = state;
  };

  store.subscribe(renderApp);
  renderApp();
  void store.init();
}

bootstrap();
