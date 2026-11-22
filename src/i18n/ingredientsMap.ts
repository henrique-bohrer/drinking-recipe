import { normalizeText } from '../utils/normalize';
import type { Language } from '../types/cocktail';

export interface BilingualIngredient {
  en: string;
  pt: string;
  aliases?: string[];
}

/**
 * Curated bilingual mapping between PT-BR and EN-US ingredient names
 * so Portuguese queries map cleanly to TheCocktailDB (which is English-indexed)
 * and English API ingredients can match Portuguese pantry tags!
 */
export const BILINGUAL_INGREDIENTS: BilingualIngredient[] = [
  { en: 'Gin', pt: 'Gin', aliases: ['gim'] },
  { en: 'Vodka', pt: 'Vodka', aliases: ['vodca'] },
  { en: 'White Rum', pt: 'Rum Branco', aliases: ['light rum', 'rum', 'rum prata'] },
  { en: 'Dark Rum', pt: 'Rum Escuro', aliases: ['rum ouro', 'aged rum', 'rum envelhecido'] },
  { en: 'Tequila', pt: 'Tequila' },
  { en: 'Cachaca', pt: 'Cachaça', aliases: ['pinga', 'aguardente', 'cachaça'] },
  { en: 'Bourbon', pt: 'Bourbon', aliases: ['whiskey', 'whisky', 'uísque'] },
  { en: 'Whiskey', pt: 'Whisky', aliases: ['whiskey', 'scotch', 'rye whiskey', 'uísque'] },
  { en: 'Campari', pt: 'Campari', aliases: ['bitter italiano'] },
  { en: 'Aperol', pt: 'Aperol' },
  { en: 'Sweet Vermouth', pt: 'Vermute Doce', aliases: ['vermute rosso', 'rosso vermouth', 'vermute tinto'] },
  { en: 'Dry Vermouth', pt: 'Vermute Seco', aliases: ['vermute branco'] },
  { en: 'Triple Sec', pt: 'Licor de Laranja', aliases: ['cointreau', 'orange liqueur', 'curacao', 'curaçao'] },
  { en: 'Blue Curacao', pt: 'Curaçao Blue', aliases: ['blue curaçao', 'curacao blue', 'curaçau azul'] },
  { en: 'Kahlua', pt: 'Licor de Café', aliases: ['coffee liqueur', 'kahlúa'] },
  { en: 'Amaretto', pt: 'Amaretto', aliases: ['licor de amêndoas'] },
  { en: 'Prosecco', pt: 'Prosecco', aliases: ['espumante', 'champagne', 'cava', 'sparkling wine'] },
  { en: 'Lime', pt: 'Limão', aliases: ['limao tahiti', 'limao taiti', 'limão taiti'] },
  { en: 'Lime Juice', pt: 'Suco de Limão', aliases: ['sumo de limao', 'limao'] },
  { en: 'Lemon', pt: 'Limão Siciliano', aliases: ['sicilian lemon'] },
  { en: 'Lemon Juice', pt: 'Suco de Limão Siciliano', aliases: ['lemon'] },
  { en: 'Orange', pt: 'Laranja', aliases: ['orange peel', 'casca de laranja'] },
  { en: 'Orange Juice', pt: 'Suco de Laranja' },
  { en: 'Pineapple Juice', pt: 'Suco de Abacaxi', aliases: ['abacaxi', 'pineapple'] },
  { en: 'Cranberry Juice', pt: 'Suco de Cranberry', aliases: ['cranberry'] },
  { en: 'Tomato Juice', pt: 'Suco de Tomate', aliases: ['tomate'] },
  { en: 'Passion Fruit', pt: 'Maracujá', aliases: ['maracuja', 'suco de maracuja'] },
  { en: 'Strawberry', pt: 'Morango', aliases: ['morangos', 'strawberries'] },
  { en: 'Mint', pt: 'Hortelã', aliases: ['hortela', 'menta', 'mint leaves'] },
  { en: 'Basil', pt: 'Manjericão', aliases: ['manjericao'] },
  { en: 'Cucumber', pt: 'Pepino' },
  { en: 'Ginger', pt: 'Gengibre' },
  { en: 'Ginger Beer', pt: 'Cerveja de Gengibre', aliases: ['ginger ale', 'espuma de gengibre'] },
  { en: 'Tonic Water', pt: 'Água Tônica', aliases: ['agua tonica', 'tonica', 'tônica'] },
  { en: 'Soda Water', pt: 'Água com Gás', aliases: ['sparkling water', 'club soda', 'agua com gas'] },
  { en: 'Coca-Cola', pt: 'Refrigerante de Cola', aliases: ['cola', 'coca cola', 'coke'] },
  { en: 'Lemonade', pt: 'Limonada', aliases: ['sprite', 'soda limonada'] },
  { en: 'Sugar', pt: 'Açúcar', aliases: ['acucar', 'sugar syrup', 'xarope de açúcar', 'simple syrup'] },
  { en: 'Simple Syrup', pt: 'Xarope de Açúcar', aliases: ['sugar syrup', 'xarope simples'] },
  { en: 'Honey', pt: 'Mel', aliases: ['xarope de mel'] },
  { en: 'Grenadine', pt: 'Xarope de Romã', aliases: ['grenadine', 'groselha'] },
  { en: 'Coconut Milk', pt: 'Leite de Coco', aliases: ['cream of coconut', 'creme de coco', 'coco'] },
  { en: 'Espresso', pt: 'Café Espresso', aliases: ['coffee', 'cafe', 'café'] },
  { en: 'Angostura Bitters', pt: 'Angostura', aliases: ['bitters', 'aromatic bitters'] },
  { en: 'Salt', pt: 'Sal' },
  { en: 'Ice', pt: 'Gelo', aliases: ['gelo triturado', 'crushed ice'] },
  { en: 'Water', pt: 'Água', aliases: ['agua'] },
  { en: 'Egg White', pt: 'Clara de Ovo' },
  { en: 'Peach Schnapps', pt: 'Licor de Pêssego', aliases: ['pessego', 'peach'] },
  { en: 'Hibiscus', pt: 'Hibisco', aliases: ['chá de hibisco', 'cha de hibisco'] },
];

export const QUICK_STAPLE_INGREDIENTS: Record<Language, string[]> = {
  pt: [
    'Gin',
    'Vodka',
    'Rum Branco',
    'Cachaça',
    'Limão',
    'Hortelã',
    'Água Tônica',
    'Água com Gás',
    'Campari',
    'Açúcar',
    'Suco de Laranja',
    'Cerveja de Gengibre',
  ],
  en: [
    'Gin',
    'Vodka',
    'White Rum',
    'Tequila',
    'Lime',
    'Mint',
    'Tonic Water',
    'Soda Water',
    'Campari',
    'Sugar',
    'Orange Juice',
    'Ginger Beer',
  ],
};

/**
 * Given a user-entered ingredient in either PT or EN, returns all normalized
 * equivalent tokens (PT, EN, aliases) so matching works seamlessly across languages.
 */
export function getIngredientEquivalents(input: string): string[] {
  const norm = normalizeText(input);
  if (!norm) return [];

  const results = new Set<string>([norm]);

  for (const entry of BILINGUAL_INGREDIENTS) {
    const candidates = [
      normalizeText(entry.en),
      normalizeText(entry.pt),
      ...(entry.aliases ?? []).map(normalizeText),
    ];

    if (candidates.some((c) => c === norm || (norm.length >= 4 && c.includes(norm)) || (c.length >= 4 && norm.includes(c)))) {
      for (const c of candidates) {
        if (c) results.add(c);
      }
    }
  }

  return Array.from(results);
}

/**
 * Converts a user ingredient (possibly Portuguese) into the best English query string
 * for TheCocktailDB's `filter.php?i=...` endpoint.
 */
export function toApiIngredientQuery(input: string): string {
  const norm = normalizeText(input);
  if (!norm) return input.trim();

  // Exact match first
  for (const entry of BILINGUAL_INGREDIENTS) {
    const candidates = [
      normalizeText(entry.pt),
      normalizeText(entry.en),
      ...(entry.aliases ?? []).map(normalizeText),
    ];
    if (candidates.includes(norm)) {
      return entry.en;
    }
  }

  // Partial match fallback
  for (const entry of BILINGUAL_INGREDIENTS) {
    if (normalizeText(entry.pt).includes(norm) || norm.includes(normalizeText(entry.pt))) {
      return entry.en;
    }
  }

  return input.trim();
}

/**
 * Returns a human-friendly localized display label for an ingredient name when known.
 */
export function localizeIngredientName(name: string, lang: Language): string {
  const norm = normalizeText(name);
  for (const entry of BILINGUAL_INGREDIENTS) {
    if (normalizeText(entry.en) === norm || normalizeText(entry.pt) === norm) {
      return lang === 'pt' ? entry.pt : entry.en;
    }
  }
  return name;
}
