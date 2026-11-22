import type { Language } from '../types/cocktail';

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  menuEyebrow: string;
  menuTitle: string;
  menuSubtitle: string;
  menuRecommendationTag: string;
  menuPrevPage: string;
  menuNextPage: string;
  menuPageIndicator: string;
  menuSwipeTip: string;
  menuToPantryCta: string;
  menuChapter1: string;
  menuChapter2: string;
  menuChapter3: string;
  menuOpenHint: string;
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
  rouletteQuizBadge: string;
  rouletteQuizTitle: string;
  rouletteQuizSubtitle: string;
  rouletteGenderLabel: string;
  rouletteGenderMale: string;
  rouletteGenderFemale: string;
  rouletteGenderOther: string;
  roulettePalateLabel: string;
  roulettePalateSweet: string;
  roulettePalateSweetDesc: string;
  roulettePalateCitrus: string;
  roulettePalateCitrusDesc: string;
  roulettePalateBitter: string;
  roulettePalateBitterDesc: string;
  roulettePalateBalanced: string;
  roulettePalateBalancedDesc: string;
  rouletteAgeLabel: string;
  rouletteAgePlaceholder: string;
  rouletteAgeInvalid: string;
  rouletteStartBtn: string;
  rouletteEditProfileBtn: string;
  rouletteSwipeHint: string;
  rouletteStampLike: string;
  rouletteStampNope: string;
  rouletteBtnNope: string;
  rouletteBtnLike: string;
  rouletteBtnUndo: string;
  rouletteViewDetails: string;
  rouletteMatchToast: string;
  rouletteUnderageBanner: string;
  rouletteMatchesTitle: string;
  rouletteLoadingDeck: string;
  rouletteRefillBtn: string;
  rouletteEmptyDeck: string;
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
    menuEyebrow: 'Carta da Casa · Edição do Balcão',
    menuTitle: 'Carta de Drinks da Casa',
    menuSubtitle:
      'Folheie as páginas do nosso cardápio e toque em qualquer drink para abrir o preparo completo, medidas e cronômetro.',
    menuRecommendationTag: 'Recomendação da Casa',
    menuPrevPage: 'Anterior',
    menuNextPage: 'Próxima',
    menuPageIndicator: 'Página {current} de {total}',
    menuSwipeTip: 'Clique nos botões, nos capítulos ou arraste a folha para virar a página',
    menuToPantryCta: 'Usar o que tenho no bar',
    menuChapter1: 'I · Clássicos de Balcão',
    menuChapter2: 'II · Frescor & Modernos',
    menuChapter3: 'III · Brasilidades & Zero',
    menuOpenHint: 'Ver preparo',
    navExplore: 'Carta & Bar',
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
    rouletteEyebrow: 'Match de Drinks',
    rouletteTitle: 'Roleta do Bartender',
    rouletteSubtitle:
      'Arraste para a direita se deu vontade de provar, ou para a esquerda para passar para a próxima sugestão.',
    rouletteQuizBadge: 'Check-in no Balcão',
    rouletteQuizTitle: 'Antes de girar a roleta, conta pra gente!',
    rouletteQuizSubtitle:
      'Responda rapidinho para o bartender calibrar a pilha de drinks do jeitinho que combina com você.',
    rouletteGenderLabel: 'Quem está no balcão hoje?',
    rouletteGenderMale: 'Homem',
    rouletteGenderFemale: 'Mulher',
    rouletteGenderOther: 'Tanto faz',
    roulettePalateLabel: 'Qual é o seu paladar favorito?',
    roulettePalateSweet: 'Doce & Frutado',
    roulettePalateSweetDesc: 'Cremoso, tropical ou com toque adocicado.',
    roulettePalateCitrus: 'Cítrico & Refrescante',
    roulettePalateCitrusDesc: 'Limão, hortelã, leve e super refrescante.',
    roulettePalateBitter: 'Amargo & Clássico',
    roulettePalateBitterDesc: 'Seco, marcante e cheio de personalidade.',
    roulettePalateBalanced: 'Equilibrado / Topa tudo',
    roulettePalateBalancedDesc: 'Pode mandar de tudo que eu encaro.',
    rouletteAgeLabel: 'Qual a sua idade?',
    rouletteAgePlaceholder: 'Ex: 24',
    rouletteAgeInvalid: 'Informe uma idade válida entre 10 e 110 anos.',
    rouletteStartBtn: 'Liberar meus drinks',
    rouletteEditProfileBtn: 'Refazer perfil',
    rouletteSwipeHint: '← Arraste para passar · Arraste para curtir →',
    rouletteStampLike: 'CURTI!',
    rouletteStampNope: 'PASSO',
    rouletteBtnNope: 'Passo',
    rouletteBtnLike: 'Curti',
    rouletteBtnUndo: 'Voltar',
    rouletteViewDetails: 'Ver receita',
    rouletteMatchToast: 'Deu match! {name} salvo no seu Caderno.',
    rouletteUnderageBanner: 'Modo Zero Álcool ativado (menores de 18) — só mocktails de respeito!',
    rouletteMatchesTitle: 'Seus Matches desta rodada',
    rouletteLoadingDeck: 'O bartender está separando mais drinks...',
    rouletteRefillBtn: 'Buscar mais sugestões',
    rouletteEmptyDeck: 'Você já passou por toda a rodada! Quer puxar mais sugestões da casa?',
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
    menuEyebrow: 'House Menu · Bar Edition',
    menuTitle: 'House Cocktail Menu',
    menuSubtitle:
      'Flip through the pages of our craft menu and tap any drink to open its full recipe, scaled measures, and timer.',
    menuRecommendationTag: 'House Pick',
    menuPrevPage: 'Previous',
    menuNextPage: 'Next',
    menuPageIndicator: 'Page {current} of {total}',
    menuSwipeTip: 'Click the controls, chapters, or swipe horizontally to turn the page',
    menuToPantryCta: 'Match my home bar',
    menuChapter1: 'I · Bar Classics',
    menuChapter2: 'II · Crisp & Modern',
    menuChapter3: 'III · Brazilian & Zero',
    menuOpenHint: 'Full recipe',
    navExplore: 'Menu & Bar',
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
    rouletteEyebrow: 'Cocktail Match',
    rouletteTitle: 'Bartender Roulette',
    rouletteSubtitle:
      'Swipe right if it catches your eye, or swipe left to pass and see the next tailored suggestion.',
    rouletteQuizBadge: 'Bar Check-In',
    rouletteQuizTitle: 'Before we pour, tell us about you!',
    rouletteQuizSubtitle:
      'Answer three quick questions so the bartender can stack a deck tailored to your vibe.',
    rouletteGenderLabel: 'Who is sitting at the bar tonight?',
    rouletteGenderMale: 'Man',
    rouletteGenderFemale: 'Woman',
    rouletteGenderOther: 'Either / Skip',
    roulettePalateLabel: 'What is your favorite palate?',
    roulettePalateSweet: 'Sweet & Fruity',
    roulettePalateSweetDesc: 'Lush, tropical, smooth, or lightly sweet.',
    roulettePalateCitrus: 'Citrus & Refreshing',
    roulettePalateCitrusDesc: 'Bright lime, mint, crisp and lively.',
    roulettePalateBitter: 'Bitter & Classic',
    roulettePalateBitterDesc: 'Dry, spirit-forward, bold character.',
    roulettePalateBalanced: 'Balanced / Surprise me',
    roulettePalateBalancedDesc: 'Bring a mix of everything.',
    rouletteAgeLabel: 'How old are you?',
    rouletteAgePlaceholder: 'E.g. 24',
    rouletteAgeInvalid: 'Please enter a valid age between 10 and 110.',
    rouletteStartBtn: 'Deal my drinks',
    rouletteEditProfileBtn: 'Edit profile',
    rouletteSwipeHint: '← Swipe left to pass · Swipe right to like →',
    rouletteStampLike: 'LIKED!',
    rouletteStampNope: 'NOPE',
    rouletteBtnNope: 'Pass',
    rouletteBtnLike: 'Like',
    rouletteBtnUndo: 'Undo',
    rouletteViewDetails: 'View recipe',
    rouletteMatchToast: "It's a match! {name} saved to your Notebook.",
    rouletteUnderageBanner: 'Zero-Proof mode active (under 18) — top-shelf mocktails only!',
    rouletteMatchesTitle: 'Your Matches this round',
    rouletteLoadingDeck: 'The bartender is pulling more drinks...',
    rouletteRefillBtn: 'Deal more drinks',
    rouletteEmptyDeck: 'You went through the whole stack! Want a fresh round?',
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
