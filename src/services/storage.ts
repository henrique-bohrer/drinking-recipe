import type { AppPreferences, CocktailRecipe, RouletteProfile, TastingNote } from '../types/cocktail';

const KEYS = {
  PREFS: 'neodrinks:prefs:v2',
  BAR: 'neodrinks:bar:v2',
  FAVORITES: 'neodrinks:favorites:v2',
  NOTES: 'neodrinks:notes:v2',
  ROULETTE_PROFILE: 'neodrinks:roulette-profile:v2',
  INGREDIENT_CATALOG: 'neodrinks:catalog:v2',
  TRANSLATION_CACHE: 'neodrinks:translations:v2',
} as const;

const CATALOG_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or private browsing restriction — ignore gracefully
  }
}

export const storage = {
  loadPreferences(): AppPreferences {
    const defaultLang = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt';
    return safeRead<AppPreferences>(KEYS.PREFS, {
      language: defaultLang,
      theme: 'paper',
      unit: defaultLang === 'pt' ? 'metric' : 'imperial',
    });
  },
  savePreferences(prefs: AppPreferences): void {
    safeWrite(KEYS.PREFS, prefs);
  },

  loadBarIngredients(): string[] {
    return safeRead<string[]>(KEYS.BAR, []);
  },
  saveBarIngredients(items: string[]): void {
    safeWrite(KEYS.BAR, items);
  },

  loadFavorites(): Record<string, CocktailRecipe> {
    return safeRead<Record<string, CocktailRecipe>>(KEYS.FAVORITES, {});
  },
  saveFavorites(favs: Record<string, CocktailRecipe>): void {
    safeWrite(KEYS.FAVORITES, favs);
  },

  loadTastingNotes(): Record<string, TastingNote> {
    return safeRead<Record<string, TastingNote>>(KEYS.NOTES, {});
  },
  saveTastingNotes(notes: Record<string, TastingNote>): void {
    safeWrite(KEYS.NOTES, notes);
  },

  loadRouletteProfile(): RouletteProfile | null {
    return safeRead<RouletteProfile | null>(KEYS.ROULETTE_PROFILE, null);
  },
  saveRouletteProfile(profile: RouletteProfile): void {
    safeWrite(KEYS.ROULETTE_PROFILE, profile);
  },

  loadIngredientCatalog(): string[] | null {
    const cached = safeRead<{ timestamp: number; items: string[] } | null>(KEYS.INGREDIENT_CATALOG, null);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > CATALOG_TTL_MS) return null;
    return cached.items;
  },
  saveIngredientCatalog(items: string[]): void {
    safeWrite(KEYS.INGREDIENT_CATALOG, { timestamp: Date.now(), items });
  },

  loadTranslationCache(): Record<string, string> {
    return safeRead<Record<string, string>>(KEYS.TRANSLATION_CACHE, {});
  },
  saveTranslationCache(cache: Record<string, string>): void {
    // Cap size to ~120 entries so localStorage stays light
    const entries = Object.entries(cache);
    const trimmed = entries.length > 120 ? Object.fromEntries(entries.slice(-100)) : cache;
    safeWrite(KEYS.TRANSLATION_CACHE, trimmed);
  },
};
