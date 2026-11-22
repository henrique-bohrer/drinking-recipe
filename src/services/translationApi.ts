import { storage } from './storage';
import type { Language } from '../types/cocktail';

const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';

/**
 * Translates cocktail preparation steps using the free MyMemory API
 * with persistent localStorage caching to stay fast and avoid redundant calls.
 */
export async function translateSteps(
  steps: string[],
  from: Language,
  to: Language
): Promise<string[]> {
  if (from === to || steps.length === 0) return steps;

  const joined = steps.join(' || ');
  const cache = storage.loadTranslationCache();
  const cacheKey = `${from}->${to}:${joined}`;

  if (cache[cacheKey]) {
    return cache[cacheKey]
      .split(/\s*\|\|\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const pair = `${from === 'pt' ? 'pt-BR' : 'en'}|${to === 'pt' ? 'pt-BR' : 'en'}`;
  const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(joined)}&langpair=${encodeURIComponent(pair)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    responseStatus?: number;
    responseData?: { translatedText?: string };
  };

  const translated = data.responseData?.translatedText?.trim();
  if (!translated || (data.responseStatus && data.responseStatus >= 400)) {
    throw new Error('Translation service unavailable');
  }

  cache[cacheKey] = translated;
  storage.saveTranslationCache(cache);

  const parts = translated
    .split(/\s*\|\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : [translated];
}
