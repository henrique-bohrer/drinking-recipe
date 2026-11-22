/**
 * Strips diacritics (accents), trims, collapses spaces, and lowercases.
 * Ensures "Limão", "limao", and "LIMÃO " compare identically.
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Safe word-boundary aware inclusion check so short tokens like "sal"
 * do not falsely match "salsa", while "limao" matches "suco de limao".
 */
export function matchesIngredientToken(targetNormalized: string, queryNormalized: string): boolean {
  if (!targetNormalized || !queryNormalized) return false;
  if (targetNormalized === queryNormalized) return true;

  const targetWords = targetNormalized.split(' ');
  const queryWords = queryNormalized.split(' ');

  // Single short word (< 4 chars like "gin", "rum", "sal", "mel") must match a full word
  if (queryNormalized.length < 4) {
    return targetWords.includes(queryNormalized);
  }
  if (targetNormalized.length < 4) {
    return queryWords.includes(targetNormalized);
  }

  // Multi-word or longer word: check whole-word overlap or direct phrase containment
  if (targetNormalized.includes(queryNormalized) || queryNormalized.includes(targetNormalized)) {
    return true;
  }

  // All significant words of query appear in target
  const significantQuery = queryWords.filter((w) => w.length >= 3 && !['com', 'sem', 'suco', 'de', 'da', 'do', 'the', 'and', 'juice'].includes(w));
  if (significantQuery.length > 0 && significantQuery.every((w) => targetWords.includes(w))) {
    return true;
  }

  return false;
}
