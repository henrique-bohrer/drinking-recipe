import type { CocktailRecipe, MatchedRecipe } from '../types/cocktail';
import { getIngredientEquivalents } from '../i18n/ingredientsMap';
import { matchesIngredientToken, normalizeText } from './normalize';

/**
 * Computes ingredient match statistics for each recipe against the user's bar pantry.
 * Uses accent-free normalization + bilingual synonym expansion so "Limão" matches "Lime Juice".
 */
export function matchRecipesWithBar(
  barIngredients: string[],
  recipes: CocktailRecipe[]
): MatchedRecipe[] {
  const userTokenSets = barIngredients.map((ing) => getIngredientEquivalents(ing));

  return recipes.map((recipe) => {
    const ownedIngredients: string[] = [];
    const missingIngredients: string[] = [];

    for (const req of recipe.ingredients) {
      const reqEquivalents = getIngredientEquivalents(req.name);
      const isOwned =
        barIngredients.length > 0 &&
        userTokenSets.some((userTokens) =>
          userTokens.some((uToken) =>
            reqEquivalents.some((rToken) => matchesIngredientToken(rToken, uToken))
          )
        );

      if (isOwned) {
        ownedIngredients.push(req.name);
      } else {
        missingIngredients.push(req.name);
      }
    }

    const total = Math.max(1, recipe.ingredients.length);
    const matchPercentage = Math.round((ownedIngredients.length / total) * 100);

    return {
      ...recipe,
      matchPercentage,
      matchCount: ownedIngredients.length,
      ownedIngredients,
      missingIngredients,
    };
  });
}

/**
 * Deduplicates recipes by normalized name, preferring curated house recipes
 * (which have hand-crafted PT-BR/EN instructions and sensory profiles).
 */
export function deduplicateRecipes(recipes: CocktailRecipe[]): CocktailRecipe[] {
  const map = new Map<string, CocktailRecipe>();
  for (const recipe of recipes) {
    const key = normalizeText(recipe.name);
    const existing = map.get(key);
    if (!existing || (existing.source === 'api' && recipe.source === 'curated')) {
      map.set(key, recipe);
    }
  }
  return Array.from(map.values());
}

/**
 * Finds the single missing ingredient that would unlock the most nearly-ready drinks
 * (recipes missing only 1 or 2 items) — acts as a smart "Next Bottle to Buy" tip!
 */
export function findTopUnlockIngredient(
  matchedRecipes: MatchedRecipe[]
): { ingredient: string; unlocks: number } | null {
  const counts = new Map<string, { label: string; count: number }>();

  for (const recipe of matchedRecipes) {
    if (recipe.missingIngredients.length === 1 && recipe.matchCount > 0) {
      const missing = recipe.missingIngredients[0];
      if (!missing) continue;
      const key = normalizeText(missing);
      const entry = counts.get(key);
      if (entry) {
        entry.count += 1;
      } else {
        counts.set(key, { label: missing, count: 1 });
      }
    }
  }

  let best: { ingredient: string; unlocks: number } | null = null;
  for (const entry of counts.values()) {
    if (!best || entry.count > best.unlocks) {
      best = { ingredient: entry.label, unlocks: entry.count };
    }
  }

  return best;
}
