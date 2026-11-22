import type { CocktailRecipe, FlavorProfile } from '../types/cocktail';
import { normalizeText } from './normalize';

function clamp(n: number, min = 10, max = 95): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/**
 * Estimates a visual sensory profile (sweet, citrus, bitter, strength)
 * from a recipe's ingredients when no hand-curated profile is defined.
 */
export function getFlavorProfile(recipe: CocktailRecipe): FlavorProfile {
  if (recipe.profile) return recipe.profile;

  let sweet = 25;
  let citrus = 20;
  let bitter = 15;
  let strength = recipe.alcoholic ? 50 : 5;

  const all = recipe.ingredients.map((i) => normalizeText(i.name));

  for (const ing of all) {
    // Sweet cues
    if (/(sugar|acucar|syrup|xarope|honey|mel|grenadine|groselha|coconut|coco|pineapple|abacaxi|mango|manga|peach|pessego|liqueur|licor|creme|cream|cola|amaretto|kahlua|baileys|morango|strawberry|banana|maracuja|passion)/.test(ing)) {
      sweet += 18;
    }

    // Citrus / bright cues
    if (/(lime|limao|lemon|orange|laranja|grapefruit|toranja|cranberry|maracuja|passion|lemonade|limonada|yuzu|tangerin)/.test(ing)) {
      citrus += 26;
    }

    // Bitter / herbal / botanical cues
    if (/(campari|aperol|angostura|bitter|vermouth|vermute|tonic|tonica|gin|absinth|chartreuse|fernet|mint|hortela|basil|manjericao|rosemary|alecrim|ginger|gengibre|espresso|cafe|coffee|hibisc)/.test(ing)) {
      bitter += 22;
    }

    // Strength cues
    if (recipe.alcoholic) {
      if (/(bourbon|whiskey|whisky|scotch|rye|rum|gin|vodka|tequila|cachaca|mezcal|brandy|cognac|absinth)/.test(ing)) {
        strength += 14;
      }
      if (/(soda|water|agua|tonic|tonica|juice|suco|lemonade|limonada|ginger beer|cola|prosecco)/.test(ing)) {
        strength -= 10;
      }
    }
  }

  return {
    sweet: clamp(sweet),
    citrus: clamp(citrus),
    bitter: clamp(bitter),
    strength: recipe.alcoholic ? clamp(strength, 20, 95) : 5,
  };
}
