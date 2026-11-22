import type { CocktailIngredient, CocktailRecipe, Language } from '../types/cocktail';
import { toApiIngredientQuery, localizeIngredientName } from '../i18n/ingredientsMap';
import { storage } from './storage';

const API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

interface ApiDrinkRaw {
  idDrink: string;
  strDrink: string;
  strCategory?: string | null;
  strAlcoholic?: string | null;
  strGlass?: string | null;
  strInstructions?: string | null;
  strDrinkThumb?: string | null;
  [key: string]: string | null | undefined;
}

interface ApiDrinkSummary {
  idDrink: string;
  strDrink: string;
  strDrinkThumb?: string;
}

// In-memory request caches so switching tabs/sorting never re-fetches unnecessarily
const detailCache = new Map<string, ApiDrinkRaw>();
const ingredientFilterCache = new Map<string, ApiDrinkSummary[]>();
const searchCache = new Map<string, ApiDrinkRaw[]>();

function inferMethod(instructions: string): 'shake' | 'stir' | 'build' | 'blend' {
  const lower = instructions.toLowerCase();
  if (lower.includes('blend')) return 'blend';
  if (lower.includes('shake') || lower.includes('shaker')) return 'shake';
  if (lower.includes('stir') || lower.includes('mixing glass')) return 'stir';
  return 'build';
}

function splitInstructions(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

function mapRawDrinkToRecipe(raw: ApiDrinkRaw, lang: Language): CocktailRecipe {
  const ingredients: CocktailIngredient[] = [];
  for (let i = 1; i <= 15; i++) {
    const rawName = raw[`strIngredient${i}`]?.trim();
    if (!rawName) continue;
    const rawMeasure = raw[`strMeasure${i}`]?.trim();
    ingredients.push({
      name: localizeIngredientName(rawName, lang),
      measure: rawMeasure || undefined,
    });
  }

  const instructionsRaw = raw.strInstructions ?? '';
  const method = inferMethod(instructionsRaw);

  return {
    id: `api-${raw.idDrink}`,
    name: raw.strDrink,
    category: raw.strCategory ?? (lang === 'pt' ? 'Coquetel' : 'Cocktail'),
    alcoholic: (raw.strAlcoholic ?? 'Alcoholic').toLowerCase() !== 'non alcoholic',
    glass: raw.strGlass ?? undefined,
    image: raw.strDrinkThumb ?? undefined,
    ingredients,
    instructions: splitInstructions(instructionsRaw),
    source: 'api',
    instructionsLang: 'en', // TheCocktailDB never has PT-BR; we offer clean on-demand translation!
    method,
    prepSeconds: method === 'shake' ? 15 : method === 'stir' ? 25 : method === 'blend' ? 20 : 12,
  };
}

async function fetchJsonSafe<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const text = await response.text();
  if (!text || !text.trim() || text.trim() === 'None Found') {
    return null;
  }
  return JSON.parse(text) as T;
}

/**
 * Loads the full ingredient catalog from TheCocktailDB with 24h localStorage caching.
 */
export async function fetchIngredientCatalog(): Promise<string[]> {
  const cached = storage.loadIngredientCatalog();
  if (cached && cached.length > 0) {
    return cached;
  }

  const data = await fetchJsonSafe<{ drinks: { strIngredient1: string }[] | null }>(
    `${API_BASE}/list.php?i=list`
  );
  if (!data?.drinks) return [];

  const items = data.drinks
    .map((d) => d.strIngredient1?.trim())
    .filter((v): v is string => Boolean(v))
    .sort((a, b) => a.localeCompare(b));

  storage.saveIngredientCatalog(items);
  return items;
}

/**
 * Fetches full details for a single drink ID (cached in memory).
 */
export async function fetchDrinkById(
  rawId: string,
  lang: Language,
  signal?: AbortSignal
): Promise<CocktailRecipe | null> {
  const existing = detailCache.get(rawId);
  if (existing) {
    return mapRawDrinkToRecipe(existing, lang);
  }

  const data = await fetchJsonSafe<{ drinks: ApiDrinkRaw[] | null }>(
    `${API_BASE}/lookup.php?i=${encodeURIComponent(rawId)}`,
    signal
  );
  const raw = data?.drinks?.[0];
  if (!raw) return null;

  detailCache.set(rawId, raw);
  return mapRawDrinkToRecipe(raw, lang);
}

/**
 * Queries up to 3 active bar ingredients in parallel against TheCocktailDB,
 * scores candidates by cross-ingredient overlap, and fetches full details for the best matches.
 */
export async function fetchRecipesByIngredients(
  barIngredients: string[],
  lang: Language,
  signal?: AbortSignal
): Promise<CocktailRecipe[]> {
  if (barIngredients.length === 0) return [];

  // Map up to 3 user tags to English API ingredient queries
  const queries = Array.from(
    new Set(barIngredients.slice(0, 3).map((tag) => toApiIngredientQuery(tag)))
  );

  const summaryLists = await Promise.all(
    queries.map(async (q) => {
      const key = q.toLowerCase();
      if (ingredientFilterCache.has(key)) {
        return ingredientFilterCache.get(key) ?? [];
      }
      try {
        const data = await fetchJsonSafe<{ drinks: ApiDrinkSummary[] | null }>(
          `${API_BASE}/filter.php?i=${encodeURIComponent(q)}`,
          signal
        );
        const list = Array.isArray(data?.drinks) ? data.drinks : [];
        ingredientFilterCache.set(key, list);
        return list;
      } catch (err) {
        if ((err as Error).name === 'AbortError') throw err;
        return [];
      }
    })
  );

  // Count how many selected ingredients each drink appeared in
  const scoreMap = new Map<string, { summary: ApiDrinkSummary; hits: number }>();
  for (const list of summaryLists) {
    for (const item of list) {
      if (!item?.idDrink) continue;
      const entry = scoreMap.get(item.idDrink);
      if (entry) {
        entry.hits += 1;
      } else {
        scoreMap.set(item.idDrink, { summary: item, hits: 1 });
      }
    }
  }

  // Pick top 12 candidates prioritized by multi-ingredient overlap
  const topIds = Array.from(scoreMap.values())
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 12)
    .map((entry) => entry.summary.idDrink);

  const detailed = await Promise.all(
    topIds.map((id) =>
      fetchDrinkById(id, lang, signal).catch((err) => {
        if ((err as Error).name === 'AbortError') throw err;
        return null;
      })
    )
  );

  return detailed.filter((r): r is CocktailRecipe => r !== null);
}

/**
 * Searches cocktails directly by name on TheCocktailDB.
 */
export async function searchRecipesByName(
  query: string,
  lang: Language,
  signal?: AbortSignal
): Promise<CocktailRecipe[]> {
  const clean = query.trim();
  if (clean.length < 2) return [];

  const cacheKey = clean.toLowerCase();
  const cached = searchCache.get(cacheKey);
  if (cached) {
    return cached.map((raw) => mapRawDrinkToRecipe(raw, lang));
  }

  const data = await fetchJsonSafe<{ drinks: ApiDrinkRaw[] | null }>(
    `${API_BASE}/search.php?s=${encodeURIComponent(clean)}`,
    signal
  );

  const list = Array.isArray(data?.drinks) ? data.drinks.slice(0, 14) : [];
  searchCache.set(cacheKey, list);
  for (const raw of list) {
    detailCache.set(raw.idDrink, raw);
  }
  return list.map((raw) => mapRawDrinkToRecipe(raw, lang));
}

/**
 * Fetches a random cocktail (optionally respecting a zero-proof filter).
 */
export async function fetchRandomRecipe(
  mood: 'any' | 'refreshing' | 'classic' | 'zero-proof',
  lang: Language
): Promise<CocktailRecipe | null> {
  if (mood === 'zero-proof') {
    const data = await fetchJsonSafe<{ drinks: ApiDrinkSummary[] | null }>(
      `${API_BASE}/filter.php?a=Non_Alcoholic`
    );
    const list = data?.drinks ?? [];
    if (list.length === 0) return null;
    const pick = list[Math.floor(Math.random() * list.length)];
    if (!pick) return null;
    return fetchDrinkById(pick.idDrink, lang);
  }

  if (mood === 'refreshing') {
    const seeds = ['Gin', 'Lime', 'Mint', 'Rum'];
    const pickSeed = seeds[Math.floor(Math.random() * seeds.length)] ?? 'Gin';
    const data = await fetchJsonSafe<{ drinks: ApiDrinkSummary[] | null }>(
      `${API_BASE}/filter.php?i=${encodeURIComponent(pickSeed)}`
    );
    const list = data?.drinks ?? [];
    if (list.length > 0) {
      const pick = list[Math.floor(Math.random() * list.length)];
      if (pick) return fetchDrinkById(pick.idDrink, lang);
    }
  }

  if (mood === 'classic') {
    const seeds = ['Bourbon', 'Campari', 'Sweet Vermouth', 'Whiskey'];
    const pickSeed = seeds[Math.floor(Math.random() * seeds.length)] ?? 'Bourbon';
    const data = await fetchJsonSafe<{ drinks: ApiDrinkSummary[] | null }>(
      `${API_BASE}/filter.php?i=${encodeURIComponent(pickSeed)}`
    );
    const list = data?.drinks ?? [];
    if (list.length > 0) {
      const pick = list[Math.floor(Math.random() * list.length)];
      if (pick) return fetchDrinkById(pick.idDrink, lang);
    }
  }

  const data = await fetchJsonSafe<{ drinks: ApiDrinkRaw[] | null }>(`${API_BASE}/random.php`);
  const raw = data?.drinks?.[0];
  if (!raw) return null;
  detailCache.set(raw.idDrink, raw);
  return mapRawDrinkToRecipe(raw, lang);
}
