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
  const heroSlot = el('div');
  const pantrySlot = el('div');
  const toolbarSlot = el('div');
  const resultsSlot = el('div');
  exploreContainer.append(heroSlot, pantrySlot, toolbarSlot, resultsSlot);

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
      mainSlot.replaceChildren(renderRouletteView(state));
    } else if (state.activeTab === 'quiz') {
      mainSlot.replaceChildren(renderQuizView(state));
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
