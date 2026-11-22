import type { Language } from '../types/cocktail';

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  navExplore: string;
  navRoulette: string;
  navQuiz: string;
  navFavorites: string;
  themePaper: string;
  themeSpeakeasy: string;
  pantryTitle: string;
  pantrySubtitle: string;
  pantryPlaceholder: string;
  pantryAddBtn: string;
  pantryClearBtn: string;
  pantryQuickLabel: string;
  pantryEmptyHint: string;
  pantryUnlockTip: string;
  pantryAddSuggestion: string;
  searchByNamePlaceholder: string;
  filterAll: string;
  filterAlcoholic: string;
  filterNonAlcoholic: string;
  sortBestMatch: string;
  sortName: string;
  sortSimplest: string;
  resultsCount: string;
  loadingRecipes: string;
  apiOfflineBanner: string;
  noResultsTitle: string;
  noResultsBody: string;
  noResultsAction: string;
  matchReady: string;
  matchMissingOne: string;
  matchMissingMany: string;
  curatedBadge: string;
  apiBadge: string;
  nonAlcoholicBadge: string;
  alcoholicBadge: string;
  openRecipe: string;
  ingredientsTitle: string;
  instructionsTitle: string;
  garnishLabel: string;
  glassLabel: string;
  servingsLabel: string;
  unitMetric: string;
  unitImperial: string;
  flavorTitle: string;
  flavorSweet: string;
  flavorCitrus: string;
  flavorBitter: string;
  flavorStrength: string;
  timerTitle: string;
  timerStart: string;
  timerPause: string;
  timerReset: string;
  timerDone: string;
  timerShake: string;
  timerStir: string;
  timerChill: string;
  translateBtn: string;
  translatingBtn: string;
  translatedNotice: string;
  showOriginalBtn: string;
  translationFailed: string;
  favoriteAdd: string;
  favoriteSaved: string;
  shareRecipe: string;
  copyShoppingList: string;
  shoppingAllReady: string;
  copiedToast: string;
  sharedToast: string;
  notesTitle: string;
  notesPlaceholder: string;
  notesSave: string;
  notesSavedToast: string;
  stepProgress: string;
  closeModal: string;
  rouletteEyebrow: string;
  rouletteTitle: string;
  rouletteSubtitle: string;
  rouletteSpinBtn: string;
  rouletteSpinning: string;
  rouletteMoodAny: string;
  rouletteMoodRefreshing: string;
  rouletteMoodClassic: string;
  rouletteMoodZero: string;
  rouletteViewDetails: string;
  rouletteAddMissingToBar: string;
  quizEyebrow: string;
  quizTitle: string;
  quizSubtitle: string;
  quizStepLabel: string;
  quizQ1: string;
  quizQ2: string;
  quizQ3: string;
  quizRestart: string;
  quizBack: string;
  quizResultTitle: string;
  quizResultSubtitle: string;
  quizMoodRefreshing: string;
  quizMoodRefreshingDesc: string;
  quizMoodBold: string;
  quizMoodBoldDesc: string;
  quizMoodTropical: string;
  quizMoodTropicalDesc: string;
  quizMoodZero: string;
  quizMoodZeroDesc: string;
  quizBaseAny: string;
  quizComplexityQuick: string;
  quizComplexityQuickDesc: string;
  quizComplexityCraft: string;
  quizComplexityCraftDesc: string;
  favoritesEyebrow: string;
  favoritesTitle: string;
  favoritesSubtitle: string;
  favoritesEmptyTitle: string;
  favoritesEmptyBody: string;
  favoritesExploreBtn: string;
  favoritesRemove: string;
  footerNote: string;
  methodShake: string;
  methodStir: string;
  methodBuild: string;
  methodBlend: string;
}

export const translations: Record<Language, TranslationDict> = {
  pt: {
    brandName: 'NeoDrinks',
    brandTagline: 'Atelier de Mixologia',
    heroEyebrow: 'Caderno de Coquetelaria',
    heroTitle: 'O que tem no seu bar hoje?',
    heroSubtitle:
      'Combine os ingredientes que você já tem em casa, ajuste as doses com precisão e descubra receitas clássicas e autorais sem complicação.',
    navExplore: 'Explorar',
    navRoulette: 'Roleta',
    navQuiz: 'Paladar',
    navFavorites: 'Caderno',
    themePaper: 'Papel',
    themeSpeakeasy: 'Speakeasy',
    pantryTitle: 'Minha Despensa de Bar',
    pantrySubtitle: 'Adicione ingredientes para ver o que você já consegue preparar agora.',
    pantryPlaceholder: 'Buscar ou digitar ingrediente (ex: Gin, Limão, Hortelã)...',
    pantryAddBtn: 'Adicionar',
    pantryClearBtn: 'Limpar bar',
    pantryQuickLabel: 'Clássicos de prateleira:',
    pantryEmptyHint: 'Sem ingredientes ainda — exibindo nossa carta curada de clássicos.',
    pantryUnlockTip: 'Dica de compra: adicionar {ingredient} desbloqueia mais {count} drink(s).',
    pantryAddSuggestion: 'Adicionar ao bar',
    searchByNamePlaceholder: 'Filtrar receitas pelo nome (ex: Negroni, Spritz)...',
    filterAll: 'Todos',
    filterAlcoholic: 'Alcoólicos',
    filterNonAlcoholic: 'Sem Álcool',
    sortBestMatch: 'Maior afinidade',
    sortName: 'Ordem alfabética',
    sortSimplest: 'Menos ingredientes',
    resultsCount: '{n} receita(s) encontrada(s)',
    loadingRecipes: 'Consultando a carta e ingredientes na API...',
    apiOfflineBanner: 'Modo offline parcial: exibindo carta curada e cache local.',
    noResultsTitle: 'Nenhum drink encontrado para este filtro',
    noResultsBody: 'Tente remover algum filtro, adicionar um destilado base ou girar a Roleta do Bartender.',
    noResultsAction: 'Limpar filtros',
    matchReady: 'Pronto p/ fazer',
    matchMissingOne: 'Falta 1 item',
    matchMissingMany: 'Faltam {n} itens',
    curatedBadge: 'Carta da Casa',
    apiBadge: 'Catálogo Global',
    nonAlcoholicBadge: 'Zero Álcool',
    alcoholicBadge: 'Alcoólico',
    openRecipe: 'Ver receita',
    ingredientsTitle: 'Ingredientes e Medidas',
    instructionsTitle: 'Modo de Preparo',
    garnishLabel: 'Guarnição',
    glassLabel: 'Copo ideal',
    servingsLabel: 'Doses',
    unitMetric: 'ml',
    unitImperial: 'oz',
    flavorTitle: 'Perfil Sensorial Estimado',
    flavorSweet: 'Dulçor',
    flavorCitrus: 'Acidez / Cítrico',
    flavorBitter: 'Amargor / Herbal',
    flavorStrength: 'Intensidade',
    timerTitle: 'Cronômetro de Preparo',
    timerStart: 'Iniciar',
    timerPause: 'Pausar',
    timerReset: 'Zerar',
    timerDone: 'Pronto! Sirva imediatamente.',
    timerShake: 'Shake 15s',
    timerStir: 'Stir 25s',
    timerChill: 'Resfriar 30s',
    translateBtn: 'Traduzir preparo para PT-BR',
    translatingBtn: 'Traduzindo...',
    translatedNotice: 'Traduzido automaticamente via API',
    showOriginalBtn: 'Ver original (EN)',
    translationFailed: 'Não foi possível traduzir agora. Exibindo original.',
    favoriteAdd: 'Salvar no Caderno',
    favoriteSaved: 'Salvo no Caderno',
    shareRecipe: 'Compartilhar',
    copyShoppingList: 'Copiar faltantes',
    shoppingAllReady: 'Você já tem todos os itens!',
    copiedToast: 'Copiado para a área de transferência.',
    sharedToast: 'Receita pronta para compartilhar.',
    notesTitle: 'Notas de Degustação',
    notesPlaceholder: 'Ex: Gostei com menos açúcar e mais gelo...',
    notesSave: 'Salvar anotação',
    notesSavedToast: 'Avaliação salva no seu caderno.',
    stepProgress: '{done} de {total} etapas concluídas',
    closeModal: 'Fechar',
    rouletteEyebrow: 'Descoberta Espontânea',
    rouletteTitle: 'Roleta do Bartender',
    rouletteSubtitle: 'Sem ideia do que preparar? Escolha o clima da noite e deixe a casa sortear um coquetel real.',
    rouletteSpinBtn: 'Sortear Novo Drink',
    rouletteSpinning: 'Preparando sugestão...',
    rouletteMoodAny: 'Surpresa total',
    rouletteMoodRefreshing: 'Refrescante',
    rouletteMoodClassic: 'Forte & Clássico',
    rouletteMoodZero: 'Sem Álcool',
    rouletteViewDetails: 'Abrir modo bartender',
    rouletteAddMissingToBar: 'Explorar parecidos',
    quizEyebrow: 'Sommelier Interativo',
    quizTitle: 'Qual drink combina com o momento?',
    quizSubtitle: 'Responda 3 perguntas rápidas para uma recomendação sob medida ao seu paladar.',
    quizStepLabel: 'Etapa {step} de 3',
    quizQ1: 'Qual clima você busca no primeiro gole?',
    quizQ2: 'Tem alguma base favorita para hoje?',
    quizQ3: 'Quanto tempo quer dedicar ao preparo?',
    quizRestart: 'Refazer quiz',
    quizBack: 'Voltar',
    quizResultTitle: 'Nossa seleção para o seu momento',
    quizResultSubtitle: 'Drinks escolhidos pelo perfil sensorial e facilidade de preparo.',
    quizMoodRefreshing: 'Leve & Refrescante',
    quizMoodRefreshingDesc: 'Cítrico, aromático, com gelo e frescor.',
    quizMoodBold: 'Intenso & Clássico',
    quizMoodBoldDesc: 'Estruturado, seco ou levemente amargo.',
    quizMoodTropical: 'Frutado & Tropical',
    quizMoodTropicalDesc: 'Vibrante, macio e envolvente.',
    quizMoodZero: 'Zero Álcool',
    quizMoodZeroDesc: 'Todo o ritual da coquetelaria, sem álcool.',
    quizBaseAny: 'Tanto faz — me surpreenda',
    quizComplexityQuick: 'Prático (até 3 min)',
    quizComplexityQuickDesc: 'Poucos ingredientes, montado direto no copo.',
    quizComplexityCraft: 'Ritual de Bar',
    quizComplexityCraftDesc: 'Coqueteleira, guarnição caprichada e camadas de sabor.',
    favoritesEyebrow: 'Sua Coleção Pessoal',
    favoritesTitle: 'Caderno de Drinks',
    favoritesSubtitle: 'Receitas favoritadas, suas notas pessoais e avaliações ficam salvas neste dispositivo.',
    favoritesEmptyTitle: 'Seu caderno ainda está em branco',
    favoritesEmptyBody: 'Salve receitas que você gostou ou quer testar no próximo fim de semana.',
    favoritesExploreBtn: 'Explorar receitas',
    favoritesRemove: 'Remover',
    footerNote: 'NeoDrinks · Dados integrados com TheCocktailDB & MyMemory API · Beba com moderação.',
    methodShake: 'Batido',
    methodStir: 'Mexido',
    methodBuild: 'Montado',
    methodBlend: 'Liquidificado',
  },
  en: {
    brandName: 'NeoDrinks',
    brandTagline: 'Mixology Atelier',
    heroEyebrow: 'House Cocktail Ledger',
    heroTitle: 'What is in your bar today?',
    heroSubtitle:
      'Match ingredients you already have at home, scale exact measurements, and discover classic or global recipes without clutter.',
    navExplore: 'Explore',
    navRoulette: 'Roulette',
    navQuiz: 'Palate',
    navFavorites: 'Notebook',
    themePaper: 'Paper',
    themeSpeakeasy: 'Speakeasy',
    pantryTitle: 'My Home Bar Pantry',
    pantrySubtitle: 'Add ingredients to see which cocktails you can craft right now.',
    pantryPlaceholder: 'Search or type an ingredient (e.g., Gin, Lime, Mint)...',
    pantryAddBtn: 'Add',
    pantryClearBtn: 'Clear bar',
    pantryQuickLabel: 'Bar staples:',
    pantryEmptyHint: 'No ingredients selected yet — browsing our curated house classics.',
    pantryUnlockTip: 'Smart tip: adding {ingredient} unlocks {count} more cocktail(s).',
    pantryAddSuggestion: 'Add to bar',
    searchByNamePlaceholder: 'Filter recipes by name (e.g., Negroni, Spritz)...',
    filterAll: 'All',
    filterAlcoholic: 'Alcoholic',
    filterNonAlcoholic: 'Zero-Proof',
    sortBestMatch: 'Best match',
    sortName: 'Alphabetical',
    sortSimplest: 'Fewest ingredients',
    resultsCount: '{n} recipe(s) found',
    loadingRecipes: 'Fetching cocktails & ingredients from API...',
    apiOfflineBanner: 'Partial offline mode: showing curated house list and local cache.',
    noResultsTitle: 'No cocktails match this filter',
    noResultsBody: 'Try clearing a filter, adding a base spirit, or spinning the Bartender Roulette.',
    noResultsAction: 'Reset filters',
    matchReady: 'Ready to craft',
    matchMissingOne: 'Missing 1 item',
    matchMissingMany: 'Missing {n} items',
    curatedBadge: 'House List',
    apiBadge: 'Global Catalog',
    nonAlcoholicBadge: 'Zero-Proof',
    alcoholicBadge: 'Alcoholic',
    openRecipe: 'Open recipe',
    ingredientsTitle: 'Ingredients & Measures',
    instructionsTitle: 'Preparation',
    garnishLabel: 'Garnish',
    glassLabel: 'Glassware',
    servingsLabel: 'Servings',
    unitMetric: 'ml',
    unitImperial: 'oz',
    flavorTitle: 'Estimated Flavor Profile',
    flavorSweet: 'Sweetness',
    flavorCitrus: 'Citrus / Acidity',
    flavorBitter: 'Bitter / Herbal',
    flavorStrength: 'Strength',
    timerTitle: 'Craft Timer',
    timerStart: 'Start',
    timerPause: 'Pause',
    timerReset: 'Reset',
    timerDone: 'Done! Strain and serve.',
    timerShake: 'Shake 15s',
    timerStir: 'Stir 25s',
    timerChill: 'Chill 30s',
    translateBtn: 'Translate steps',
    translatingBtn: 'Translating...',
    translatedNotice: 'Auto-translated via API',
    showOriginalBtn: 'Show original',
    translationFailed: 'Could not translate right now. Showing original text.',
    favoriteAdd: 'Save to Notebook',
    favoriteSaved: 'Saved in Notebook',
    shareRecipe: 'Share',
    copyShoppingList: 'Copy missing',
    shoppingAllReady: 'You already have every ingredient!',
    copiedToast: 'Copied to clipboard.',
    sharedToast: 'Recipe ready to share.',
    notesTitle: 'Tasting Notes',
    notesPlaceholder: 'E.g., Loved it with less syrup and a wide orange peel...',
    notesSave: 'Save note',
    notesSavedToast: 'Tasting note saved to your notebook.',
    stepProgress: '{done} of {total} steps checked',
    closeModal: 'Close',
    rouletteEyebrow: 'Spontaneous Discovery',
    rouletteTitle: 'Bartender Roulette',
    rouletteSubtitle: 'Undecided tonight? Pick a mood and let the house pour a real cocktail suggestion.',
    rouletteSpinBtn: 'Spin New Drink',
    rouletteSpinning: 'Shaking up a pick...',
    rouletteMoodAny: 'Total surprise',
    rouletteMoodRefreshing: 'Refreshing',
    rouletteMoodClassic: 'Bold & Classic',
    rouletteMoodZero: 'Zero-Proof',
    rouletteViewDetails: 'Open bartender mode',
    rouletteAddMissingToBar: 'Explore similar',
    quizEyebrow: 'Interactive Sommelier',
    quizTitle: 'Which drink fits this moment?',
    quizSubtitle: 'Answer 3 quick questions for a tailored cocktail recommendation.',
    quizStepLabel: 'Step {step} of 3',
    quizQ1: 'What mood are you looking for in the first sip?',
    quizQ2: 'Do you have a preferred base spirit tonight?',
    quizQ3: 'How much time do you want to spend making it?',
    quizRestart: 'Retake quiz',
    quizBack: 'Back',
    quizResultTitle: 'Tailored picks for your mood',
    quizResultSubtitle: 'Selected by flavor profile and preparation style.',
    quizMoodRefreshing: 'Crisp & Refreshing',
    quizMoodRefreshingDesc: 'Citrusy, aromatic, bright over ice.',
    quizMoodBold: 'Bold & Classic',
    quizMoodBoldDesc: 'Spirit-forward, dry or bittersweet.',
    quizMoodTropical: 'Fruity & Tropical',
    quizMoodTropicalDesc: 'Vibrant, lush, easy to sip.',
    quizMoodZero: 'Zero-Proof',
    quizMoodZeroDesc: 'Full cocktail ritual, no alcohol.',
    quizBaseAny: 'Anything — surprise me',
    quizComplexityQuick: 'Quick (under 3 min)',
    quizComplexityQuickDesc: 'Few ingredients, built straight in the glass.',
    quizComplexityCraft: 'Craft Ritual',
    quizComplexityCraftDesc: 'Shaker, fresh garnish, layered notes.',
    favoritesEyebrow: 'Personal Collection',
    favoritesTitle: 'Cocktail Notebook',
    favoritesSubtitle: 'Saved cocktails, personal ratings, and tasting notes stay right on this device.',
    favoritesEmptyTitle: 'Your notebook is still blank',
    favoritesEmptyBody: 'Save cocktails you loved or want to try next weekend.',
    favoritesExploreBtn: 'Explore recipes',
    favoritesRemove: 'Remove',
    footerNote: 'NeoDrinks · Powered by TheCocktailDB & MyMemory API · Enjoy responsibly.',
    methodShake: 'Shaken',
    methodStir: 'Stirred',
    methodBuild: 'Built',
    methodBlend: 'Blended',
  },
};

export function t(lang: Language, key: keyof TranslationDict, params?: Record<string, string | number>): string {
  let str = translations[lang][key];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
