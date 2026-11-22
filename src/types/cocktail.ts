export type Language = 'pt' | 'en';

export type ThemeMode = 'paper' | 'speakeasy';

export type MeasureUnit = 'metric' | 'imperial';

export type ActiveTab = 'explore' | 'roulette' | 'quiz' | 'favorites';

export type AlcoholFilter = 'all' | 'alcoholic' | 'non-alcoholic';

export type SortMode = 'match' | 'name' | 'ingredients-asc';

export interface CocktailIngredient {
  name: string;
  measure?: string;
}

export interface FlavorProfile {
  sweet: number;     // 0..100
  citrus: number;    // 0..100
  bitter: number;    // 0..100
  strength: number;  // 0..100
}

export interface CocktailRecipe {
  id: string;
  name: string;
  category: string;
  alcoholic: boolean;
  glass?: string;
  image?: string;
  garnish?: string;
  ingredients: CocktailIngredient[];
  instructions: string[];
  source: 'curated' | 'api';
  instructionsLang: Language;
  translatedInstructions?: Partial<Record<Language, string[]>>;
  profile?: FlavorProfile;
  prepSeconds?: number;
  method?: 'shake' | 'stir' | 'build' | 'blend';
}

export interface MatchedRecipe extends CocktailRecipe {
  matchPercentage: number;
  matchCount: number;
  ownedIngredients: string[];
  missingIngredients: string[];
}

export interface TastingNote {
  recipeId: string;
  rating: number; // 0..5
  note: string;
  updatedAt: string;
}

export interface QuizAnswers {
  mood: 'refreshing' | 'bold' | 'tropical' | 'zero-proof' | null;
  base: 'gin' | 'vodka' | 'rum' | 'whiskey' | 'tequila' | 'cachaca' | 'any' | null;
  complexity: 'quick' | 'craft' | null;
}

export interface AppPreferences {
  language: Language;
  theme: ThemeMode;
  unit: MeasureUnit;
}

export interface AppState {
  language: Language;
  theme: ThemeMode;
  unit: MeasureUnit;
  activeTab: ActiveTab;
  barIngredients: string[];
  searchQuery: string;
  alcoholFilter: AlcoholFilter;
  sortMode: SortMode;
  catalogIngredients: string[];
  recipes: MatchedRecipe[];
  isLoadingRecipes: boolean;
  apiError: string | null;
  selectedRecipe: MatchedRecipe | null;
  favorites: Record<string, CocktailRecipe>;
  tastingNotes: Record<string, TastingNote>;
  rouletteRecipe: CocktailRecipe | null;
  rouletteLoading: boolean;
  rouletteMood: 'any' | 'refreshing' | 'classic' | 'zero-proof';
  quizStep: number;
  quizAnswers: QuizAnswers;
  quizResults: CocktailRecipe[];
  quizLoading: boolean;
}
