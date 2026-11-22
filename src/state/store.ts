import type {
  ActiveTab,
  AlcoholFilter,
  AppState,
  CocktailRecipe,
  Language,
  MatchedRecipe,
  MeasureUnit,
  QuizAnswers,
  SortMode,
  ThemeMode,
} from '../types/cocktail';
import { getCuratedRecipes } from '../data/curatedRecipes';
import {
  fetchIngredientCatalog,
  fetchRandomRecipe,
  fetchRecipesByIngredients,
  searchRecipesByName,
} from '../services/cocktailApi';
import { storage } from '../services/storage';
import { BILINGUAL_INGREDIENTS } from '../i18n/ingredientsMap';
import { deduplicateRecipes, matchRecipesWithBar } from '../utils/matcher';
import { normalizeText } from '../utils/normalize';
import { getFlavorProfile } from '../utils/flavorProfile';

type Listener = (state: AppState) => void;

class AppStore {
  private state: AppState;
  private listeners = new Set<Listener>();
  private activeAbortController: AbortController | null = null;
  private searchTimer: number | null = null;

  constructor() {
    const prefs = storage.loadPreferences();
    const savedBar = storage.loadBarIngredients();
    const curated = getCuratedRecipes(prefs.language);

    this.state = {
      language: prefs.language,
      theme: prefs.theme,
      unit: prefs.unit,
      activeTab: 'explore',
      barIngredients: savedBar,
      searchQuery: '',
      alcoholFilter: 'all',
      sortMode: 'match',
      catalogIngredients: this.buildBaseCatalog(prefs.language),
      recipes: matchRecipesWithBar(savedBar, curated),
      isLoadingRecipes: false,
      apiError: null,
      selectedRecipe: null,
      favorites: storage.loadFavorites(),
      tastingNotes: storage.loadTastingNotes(),
      rouletteRecipe: null,
      rouletteLoading: false,
      rouletteMood: 'any',
      quizStep: 1,
      quizAnswers: { mood: null, base: null, complexity: null },
      quizResults: [],
      quizLoading: false,
    };
  }

  private buildBaseCatalog(lang: Language, apiList: string[] = []): string[] {
    const set = new Set<string>();
    for (const item of BILINGUAL_INGREDIENTS) {
      set.add(lang === 'pt' ? item.pt : item.en);
    }
    for (const raw of apiList) {
      set.add(raw);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(partial: Partial<AppState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  async init(): Promise<void> {
    this.applyThemeToDocument(this.state.theme);
    document.documentElement.lang = this.state.language === 'pt' ? 'pt-BR' : 'en';

    // Load full ingredient catalog asynchronously
    fetchIngredientCatalog()
      .then((apiItems) => {
        if (apiItems.length > 0) {
          this.setState({
            catalogIngredients: this.buildBaseCatalog(this.state.language, apiItems),
          });
        }
      })
      .catch(() => {
        // Curated bilingual catalog is already loaded
      });

    // If user already had saved bar ingredients, immediately refresh recipes with API
    if (this.state.barIngredients.length > 0) {
      await this.refreshRecipes();
    }
  }

  private applyThemeToDocument(theme: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'speakeasy' ? '#171614' : '#2D5A45');
    }
  }

  setLanguage(language: Language): void {
    if (this.state.language === language) return;
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    const unit: MeasureUnit = language === 'pt' ? 'metric' : 'imperial';
    storage.savePreferences({ language, theme: this.state.theme, unit });

    const cachedApiCatalog = storage.loadIngredientCatalog() ?? [];
    this.setState({
      language,
      unit,
      catalogIngredients: this.buildBaseCatalog(language, cachedApiCatalog),
    });

    void this.refreshRecipes();
  }

  toggleTheme(): void {
    const next: ThemeMode = this.state.theme === 'paper' ? 'speakeasy' : 'paper';
    this.applyThemeToDocument(next);
    storage.savePreferences({
      language: this.state.language,
      theme: next,
      unit: this.state.unit,
    });
    this.setState({ theme: next });
  }

  setUnit(unit: MeasureUnit): void {
    if (this.state.unit === unit) return;
    storage.savePreferences({
      language: this.state.language,
      theme: this.state.theme,
      unit,
    });
    this.setState({ unit });
  }

  setActiveTab(activeTab: ActiveTab): void {
    this.setState({ activeTab });
    if (activeTab === 'roulette' && !this.state.rouletteRecipe && !this.state.rouletteLoading) {
      void this.spinRoulette();
    }
  }

  addBarIngredient(raw: string): boolean {
    const clean = raw.replace(/,+$/g, '').trim();
    if (!clean) return false;

    const norm = normalizeText(clean);
    if (this.state.barIngredients.some((item) => normalizeText(item) === norm)) {
      return false;
    }

    const updated = [...this.state.barIngredients, clean];
    storage.saveBarIngredients(updated);
    this.setState({ barIngredients: updated });
    void this.refreshRecipes();
    return true;
  }

  removeBarIngredient(target: string): void {
    const norm = normalizeText(target);
    const updated = this.state.barIngredients.filter((item) => normalizeText(item) !== norm);
    storage.saveBarIngredients(updated);
    this.setState({ barIngredients: updated });
    void this.refreshRecipes();
  }

  clearBarIngredients(): void {
    storage.saveBarIngredients([]);
    this.setState({ barIngredients: [] });
    void this.refreshRecipes();
  }

  setSearchQuery(searchQuery: string): void {
    this.setState({ searchQuery });
    if (this.searchTimer !== null) {
      window.clearTimeout(this.searchTimer);
    }
    this.searchTimer = window.setTimeout(() => {
      void this.refreshRecipes();
    }, 280);
  }

  setAlcoholFilter(alcoholFilter: AlcoholFilter): void {
    this.setState({ alcoholFilter });
  }

  setSortMode(sortMode: SortMode): void {
    this.setState({ sortMode });
  }

  resetExploreFilters(): void {
    this.setState({ searchQuery: '', alcoholFilter: 'all', sortMode: 'match' });
    void this.refreshRecipes();
  }

  /**
   * Returns filtered & sorted recipes ready for rendering.
   */
  getVisibleRecipes(): MatchedRecipe[] {
    const { recipes, alcoholFilter, sortMode, searchQuery, barIngredients } = this.state;
    const normQuery = normalizeText(searchQuery);

    let list = recipes.filter((r) => {
      if (alcoholFilter === 'alcoholic' && !r.alcoholic) return false;
      if (alcoholFilter === 'non-alcoholic' && r.alcoholic) return false;
      if (normQuery) {
        const matchesName = normalizeText(r.name).includes(normQuery);
        const matchesCat = normalizeText(r.category).includes(normQuery);
        const matchesIng = r.ingredients.some((i) => normalizeText(i.name).includes(normQuery));
        if (!matchesName && !matchesCat && !matchesIng) return false;
      }
      if (barIngredients.length > 0 && !normQuery && r.matchCount === 0) {
        return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortMode === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortMode === 'ingredients-asc') {
        return a.ingredients.length - b.ingredients.length || b.matchPercentage - a.matchPercentage;
      }
      // Default: Best Match (higher percentage -> more matched items -> fewer missing -> curated first)
      if (barIngredients.length > 0) {
        if (b.matchPercentage !== a.matchPercentage) return b.matchPercentage - a.matchPercentage;
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        if (a.missingIngredients.length !== b.missingIngredients.length) {
          return a.missingIngredients.length - b.missingIngredients.length;
        }
      }
      if (a.source !== b.source) return a.source === 'curated' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return list;
  }

  async refreshRecipes(): Promise<void> {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
    }
    const controller = new AbortController();
    this.activeAbortController = controller;

    const { language, barIngredients, searchQuery } = this.state;
    const curated = getCuratedRecipes(language);

    // If neither bar ingredients nor name query is active, show curated house menu instantaneously
    if (barIngredients.length === 0 && searchQuery.trim().length < 2) {
      this.setState({
        recipes: matchRecipesWithBar(barIngredients, curated),
        isLoadingRecipes: false,
        apiError: null,
      });
      return;
    }

    // Optimistic local match while API loads
    this.setState({
      recipes: matchRecipesWithBar(barIngredients, curated),
      isLoadingRecipes: true,
      apiError: null,
    });

    try {
      const apiTasks: Promise<CocktailRecipe[]>[] = [];
      if (barIngredients.length > 0) {
        apiTasks.push(fetchRecipesByIngredients(barIngredients, language, controller.signal));
      }
      if (searchQuery.trim().length >= 2) {
        apiTasks.push(searchRecipesByName(searchQuery.trim(), language, controller.signal));
      }

      const apiGroups = await Promise.all(apiTasks);
      if (controller.signal.aborted) return;

      const combined = deduplicateRecipes([...curated, ...apiGroups.flat()]);
      const matched = matchRecipesWithBar(barIngredients, combined);

      this.setState({
        recipes: matched,
        isLoadingRecipes: false,
        apiError: null,
      });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      this.setState({
        isLoadingRecipes: false,
        apiError: 'offline',
      });
    }
  }

  openRecipe(recipe: CocktailRecipe): void {
    const matched = matchRecipesWithBar(this.state.barIngredients, [recipe])[0] ?? null;
    this.setState({ selectedRecipe: matched });
  }

  closeRecipe(): void {
    this.setState({ selectedRecipe: null });
  }

  toggleFavorite(recipe: CocktailRecipe): boolean {
    const next = { ...this.state.favorites };
    let added = false;
    if (next[recipe.id]) {
      delete next[recipe.id];
    } else {
      next[recipe.id] = recipe;
      added = true;
    }
    storage.saveFavorites(next);
    this.setState({ favorites: next });
    return added;
  }

  saveTastingNote(recipeId: string, rating: number, note: string): void {
    const next = {
      ...this.state.tastingNotes,
      [recipeId]: {
        recipeId,
        rating,
        note: note.trim(),
        updatedAt: new Date().toISOString(),
      },
    };
    storage.saveTastingNotes(next);
    this.setState({ tastingNotes: next });
  }

  setRouletteMood(rouletteMood: AppState['rouletteMood']): void {
    this.setState({ rouletteMood });
    void this.spinRoulette();
  }

  async spinRoulette(): Promise<void> {
    const { rouletteMood, language, rouletteRecipe } = this.state;
    this.setState({ rouletteLoading: true });

    try {
      const apiPick = await fetchRandomRecipe(rouletteMood, language);
      if (apiPick) {
        this.setState({ rouletteRecipe: apiPick, rouletteLoading: false });
        return;
      }
    } catch {
      // Fallback to curated list below
    }

    // Curated fallback so Roulette ALWAYS delivers a great drink even offline
    const curated = getCuratedRecipes(language).filter((r) => {
      if (rouletteMood === 'zero-proof') return !r.alcoholic;
      if (rouletteMood === 'classic') return r.alcoholic && (r.profile?.strength ?? 50) >= 65;
      if (rouletteMood === 'refreshing') return (r.profile?.citrus ?? 50) >= 60;
      return true;
    });
    const pool = curated.filter((r) => r.id !== rouletteRecipe?.id);
    const chosen = (pool.length > 0 ? pool : curated)[
      Math.floor(Math.random() * Math.max(1, pool.length || curated.length))
    ] ?? null;

    this.setState({ rouletteRecipe: chosen, rouletteLoading: false });
  }

  setQuizAnswer<K extends keyof QuizAnswers>(field: K, value: QuizAnswers[K]): void {
    const nextAnswers: QuizAnswers = { ...this.state.quizAnswers, [field]: value };
    let nextStep = this.state.quizStep;

    if (field === 'mood') {
      // If user picked zero-proof, skip spirit question (step 2) and jump directly to step 3!
      if (value === 'zero-proof') {
        nextAnswers.base = 'any';
        nextStep = 3;
      } else {
        nextStep = 2;
      }
    } else if (field === 'base') {
      nextStep = 3;
    } else if (field === 'complexity') {
      nextStep = 4;
    }

    this.setState({ quizAnswers: nextAnswers, quizStep: nextStep });

    if (nextStep === 4) {
      void this.computeQuizRecommendations(nextAnswers);
    }
  }

  goBackQuizStep(): void {
    const { quizStep, quizAnswers } = this.state;
    if (quizStep <= 1) return;
    if (quizStep === 3 && quizAnswers.mood === 'zero-proof') {
      this.setState({ quizStep: 1 });
      return;
    }
    this.setState({ quizStep: quizStep - 1 });
  }

  resetQuiz(): void {
    this.setState({
      quizStep: 1,
      quizAnswers: { mood: null, base: null, complexity: null },
      quizResults: [],
      quizLoading: false,
    });
  }

  private async computeQuizRecommendations(answers: QuizAnswers): Promise<void> {
    this.setState({ quizLoading: true });
    const { language } = this.state;
    const curated = getCuratedRecipes(language);

    let extraApi: CocktailRecipe[] = [];
    try {
      if (answers.mood === 'zero-proof') {
        const pick = await fetchRandomRecipe('zero-proof', language);
        if (pick) extraApi = [pick];
      } else if (answers.base && answers.base !== 'any') {
        extraApi = await fetchRecipesByIngredients([answers.base], language);
      }
    } catch {
      // Curated picks will still shine
    }

    const pool = deduplicateRecipes([...curated, ...extraApi]).filter((r) => {
      if (answers.mood === 'zero-proof') return !r.alcoholic;
      return r.alcoholic;
    });

    const scored = pool.map((recipe) => {
      let score = 0;
      const profile = getFlavorProfile(recipe);
      const ingText = recipe.ingredients.map((i) => normalizeText(i.name)).join(' ');

      if (answers.mood === 'refreshing') {
        score += profile.citrus * 0.7 + (100 - profile.strength) * 0.3;
      } else if (answers.mood === 'bold') {
        score += profile.strength * 0.7 + profile.bitter * 0.5;
      } else if (answers.mood === 'tropical') {
        score += profile.sweet * 0.7 + profile.citrus * 0.3;
      } else if (answers.mood === 'zero-proof') {
        score += !recipe.alcoholic ? 80 : 0;
      }

      if (answers.base && answers.base !== 'any') {
        const baseMap: Record<string, RegExp> = {
          gin: /\bgin\b/,
          vodka: /\bvodka\b/,
          rum: /\brum\b/,
          whiskey: /(bourbon|whisk|scotch|rye)/,
          tequila: /\btequila\b/,
          cachaca: /\bcachaca\b/,
        };
        const rx = baseMap[answers.base];
        if (rx && rx.test(ingText)) score += 65;
      }

      if (answers.complexity === 'quick') {
        if (recipe.ingredients.length <= 4) score += 25;
        if (recipe.method === 'build') score += 18;
      } else if (answers.complexity === 'craft') {
        if (recipe.method === 'shake' || recipe.method === 'stir') score += 20;
        if (recipe.ingredients.length >= 4) score += 15;
      }

      if (recipe.source === 'curated') score += 12;

      return { recipe, score };
    });

    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.recipe);

    this.setState({ quizResults: top, quizLoading: false });
  }
}

export const store = new AppStore();
