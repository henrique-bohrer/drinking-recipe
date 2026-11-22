import type { CocktailRecipe, Language } from '../types/cocktail';

interface CuratedSeed {
  id: string;
  name: string;
  alcoholic: boolean;
  method: 'shake' | 'stir' | 'build' | 'blend';
  prepSeconds: number;
  image?: string;
  profile: { sweet: number; citrus: number; bitter: number; strength: number };
  pt: {
    category: string;
    glass: string;
    garnish: string;
    ingredients: { name: string; measure: string }[];
    instructions: string[];
  };
  en: {
    category: string;
    glass: string;
    garnish: string;
    ingredients: { name: string; measure: string }[];
    instructions: string[];
  };
}

const CURATED_SEEDS: CuratedSeed[] = [
  {
    id: 'house-negroni',
    name: 'Negroni',
    alcoholic: true,
    method: 'stir',
    prepSeconds: 25,
    image: 'https://www.thecocktaildb.com/images/media/drink/qgdu971561574065.jpg',
    profile: { sweet: 45, citrus: 35, bitter: 88, strength: 82 },
    pt: {
      category: 'Aperitivo Clássico',
      glass: 'Copo Baixo (Old Fashioned)',
      garnish: 'Casca de laranja Bahia',
      ingredients: [
        { name: 'Gin', measure: '30 ml' },
        { name: 'Campari', measure: '30 ml' },
        { name: 'Vermute Doce', measure: '30 ml' },
      ],
      instructions: [
        'Resfrie um copo baixo com uma pedra grande de gelo cristalino.',
        'Despeje o gin, o Campari e o vermute doce em partes iguais.',
        'Mexa suavemente com colher bailarina por 20 a 25 segundos para resfriar e equilibrar a diluição.',
        'Torça uma casca larga de laranja sobre o copo para liberar os óleos essenciais e acomode na borda.',
      ],
    },
    en: {
      category: 'Classic Aperitivo',
      glass: 'Rocks Glass',
      garnish: 'Orange peel twist',
      ingredients: [
        { name: 'Gin', measure: '1 oz' },
        { name: 'Campari', measure: '1 oz' },
        { name: 'Sweet Vermouth', measure: '1 oz' },
      ],
      instructions: [
        'Chill a rocks glass with a single large clear ice cube.',
        'Pour equal parts gin, Campari, and sweet vermouth over the ice.',
        'Stir gently for 20 to 25 seconds until chilled and silky.',
        'Express a wide orange peel over the surface and rest it inside the glass.',
      ],
    },
  },
  {
    id: 'house-caipirinha',
    name: 'Caipirinha',
    alcoholic: true,
    method: 'build',
    prepSeconds: 15,
    image: 'https://www.thecocktaildb.com/images/media/drink/jgvn7p1582484435.jpg',
    profile: { sweet: 55, citrus: 85, bitter: 18, strength: 74 },
    pt: {
      category: 'Clássico Brasileiro',
      glass: 'Copo Baixo',
      garnish: 'Meia-lua de limão tahiti',
      ingredients: [
        { name: 'Cachaça', measure: '60 ml' },
        { name: 'Limão', measure: '1 unidade' },
        { name: 'Açúcar', measure: '2 colheres de chá' },
      ],
      instructions: [
        'Corte o limão tahiti em quatro partes e retire o miolo branco central para evitar amargor.',
        'Coloque os gomos no copo baixo com a casca voltada para baixo e cubra com o açúcar.',
        'Macere delicadamente apenas para extrair o suco sem esmagar a casca.',
        'Complete o copo com bastante gelo, adicione a cachaça e misture de baixo para cima.',
      ],
    },
    en: {
      category: 'Brazilian Classic',
      glass: 'Rocks Glass',
      garnish: 'Fresh lime wheel',
      ingredients: [
        { name: 'Cachaca', measure: '2 oz' },
        { name: 'Lime', measure: '1 whole' },
        { name: 'Sugar', measure: '2 tsp' },
      ],
      instructions: [
        'Quarter a fresh lime and remove the white central pith to keep it bright, not bitter.',
        'Place wedges skin-side down in a rocks glass and sprinkle with sugar.',
        'Muddle gently just enough to release the juice and oils.',
        'Pack with ice, pour in the cachaça, and stir briskly from the bottom up.',
      ],
    },
  },
  {
    id: 'house-margarita',
    name: 'Margarita',
    alcoholic: true,
    method: 'shake',
    prepSeconds: 15,
    image: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
    profile: { sweet: 40, citrus: 90, bitter: 20, strength: 72 },
    pt: {
      category: 'Sour Clássico',
      glass: 'Taça Coupe ou Baixo',
      garnish: 'Meia borda de sal e fatia de limão',
      ingredients: [
        { name: 'Tequila', measure: '50 ml' },
        { name: 'Licor de Laranja', measure: '25 ml' },
        { name: 'Suco de Limão', measure: '25 ml' },
        { name: 'Sal', measure: '1 pitada' },
      ],
      instructions: [
        'Umedeça metade da borda da taça com limão e passe no sal fino.',
        'Na coqueteleira, combine a tequila, o licor de laranja e o suco fresco de limão.',
        'Complete com gelo e bata vigorosamente por 12 a 15 segundos.',
        'Faça dupla coagem para a taça gelada e finalize com uma rodela fina de limão.',
      ],
    },
    en: {
      category: 'Classic Sour',
      glass: 'Coupe or Rocks Glass',
      garnish: 'Half salt rim & lime wheel',
      ingredients: [
        { name: 'Tequila', measure: '1 3/4 oz' },
        { name: 'Triple Sec', measure: '3/4 oz' },
        { name: 'Lime Juice', measure: '3/4 oz' },
        { name: 'Salt', measure: '1 pinch' },
      ],
      instructions: [
        'Moisten half of the chilled glass rim with lime and dip gently in fine salt.',
        'Combine tequila, orange liqueur, and fresh lime juice in a shaker.',
        'Fill with ice and shake hard for 12 to 15 seconds until frosted.',
        'Double strain into the glass and garnish with a lime wheel.',
      ],
    },
  },
  {
    id: 'house-mojito',
    name: 'Mojito',
    alcoholic: true,
    method: 'build',
    prepSeconds: 15,
    image: 'https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg',
    profile: { sweet: 58, citrus: 78, bitter: 22, strength: 48 },
    pt: {
      category: 'Refrescante',
      glass: 'Copo Alto (Highball)',
      garnish: 'Ramo generoso de hortelã fresca',
      ingredients: [
        { name: 'Rum Branco', measure: '50 ml' },
        { name: 'Hortelã', measure: '10 folhas' },
        { name: 'Suco de Limão', measure: '25 ml' },
        { name: 'Açúcar', measure: '2 colheres de chá' },
        { name: 'Água com Gás', measure: '90 ml' },
      ],
      instructions: [
        'Bata levemente as folhas de hortelã entre as palmas das mãos para despertar o aroma.',
        'No copo alto, dissolva o açúcar no suco de limão e adicione a hortelã sem rasgar as folhas.',
        'Despeje o rum branco e preencha com bastante gelo.',
        'Complete com água com gás, mexa delicadamente de baixo para cima e finalize com um ramo de hortelã.',
      ],
    },
    en: {
      category: 'Refreshing Highball',
      glass: 'Highball Glass',
      garnish: 'Fresh mint bouquet',
      ingredients: [
        { name: 'White Rum', measure: '1 3/4 oz' },
        { name: 'Mint', measure: '10 leaves' },
        { name: 'Lime Juice', measure: '3/4 oz' },
        { name: 'Sugar', measure: '2 tsp' },
        { name: 'Soda Water', measure: '3 oz' },
      ],
      instructions: [
        'Clap the fresh mint leaves gently between your palms to wake the aromatics.',
        'In a highball glass, dissolve sugar in lime juice and drop in the mint.',
        'Pour in white rum and fill the glass generously with ice.',
        'Top with chilled soda water, lift gently with a bar spoon, and crown with a mint sprig.',
      ],
    },
  },
  {
    id: 'house-old-fashioned',
    name: 'Old Fashioned',
    alcoholic: true,
    method: 'stir',
    prepSeconds: 25,
    image: 'https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg',
    profile: { sweet: 42, citrus: 22, bitter: 62, strength: 92 },
    pt: {
      category: 'Clássico Estruturado',
      glass: 'Copo Baixo',
      garnish: 'Casca de laranja e cereja amarena',
      ingredients: [
        { name: 'Bourbon', measure: '60 ml' },
        { name: 'Angostura', measure: '3 dashes' },
        { name: 'Açúcar', measure: '1 colher de chá' },
        { name: 'Água', measure: '10 ml' },
      ],
      instructions: [
        'No copo baixo, dissolva o açúcar com a Angostura e um lance de água.',
        'Adicione uma pedra grande de gelo e despeje metade do bourbon.',
        'Mexa lentamente por 10 segundos, acrescente o restante do bourbon e mexa por mais 15 segundos.',
        'Finalize extraindo os óleos da casca de laranja sobre a bebida.',
      ],
    },
    en: {
      category: 'Spirit-Forward Classic',
      glass: 'Rocks Glass',
      garnish: 'Expressed orange peel & cherry',
      ingredients: [
        { name: 'Bourbon', measure: '2 oz' },
        { name: 'Angostura Bitters', measure: '3 dashes' },
        { name: 'Sugar', measure: '1 tsp' },
        { name: 'Water', measure: '1/3 oz' },
      ],
      instructions: [
        'Dissolve sugar with Angostura bitters and a splash of water directly in a rocks glass.',
        'Add a large ice cube and pour in half the bourbon.',
        'Stir slowly for 10 seconds, add the remaining bourbon, and stir 15 seconds more.',
        'Express an orange twist over the glass and drop it in with a cocktail cherry.',
      ],
    },
  },
  {
    id: 'house-gin-tonic',
    name: 'Gin & Tônica Botânico',
    alcoholic: true,
    method: 'build',
    prepSeconds: 10,
    image: 'https://www.thecocktaildb.com/images/media/drink/qcgz0t1643821443.jpg',
    profile: { sweet: 30, citrus: 62, bitter: 60, strength: 45 },
    pt: {
      category: 'Refrescante',
      glass: 'Taça Balão',
      garnish: 'Fatia de limão siciliano e ramo de manjericão',
      ingredients: [
        { name: 'Gin', measure: '50 ml' },
        { name: 'Água Tônica', measure: '150 ml' },
        { name: 'Limão Siciliano', measure: '2 fatias' },
        { name: 'Manjericão', measure: '3 folhas' },
      ],
      instructions: [
        'Preencha uma taça balão até a borda com gelo firme e gire para gelar o vidro.',
        'Despeje o gin sobre o gelo e acrescente as fatias de limão siciliano.',
        'Deslize a água tônica bem gelada pela lateral da taça para preservar a carbonatação.',
        'Dê apenas um toque suave com a colher e finalize com folhas frescas de manjericão.',
      ],
    },
    en: {
      category: 'Botanical Highball',
      glass: 'Copa Balloon Glass',
      garnish: 'Lemon wheel & fresh basil',
      ingredients: [
        { name: 'Gin', measure: '1 3/4 oz' },
        { name: 'Tonic Water', measure: '5 oz' },
        { name: 'Lemon', measure: '2 wheels' },
        { name: 'Basil', measure: '3 leaves' },
      ],
      instructions: [
        'Fill a chilled balloon glass to the brim with solid ice cubes.',
        'Pour in the gin and tuck lemon wheels along the inside of the glass.',
        'Tilt and pour cold tonic water slowly down the side to preserve effervescence.',
        'Give one gentle lift with a bar spoon and top with fresh basil leaves.',
      ],
    },
  },
  {
    id: 'house-moscow-mule',
    name: 'Moscow Mule',
    alcoholic: true,
    method: 'build',
    prepSeconds: 15,
    image: 'https://www.thecocktaildb.com/images/media/drink/3pylqc1504370988.jpg',
    profile: { sweet: 48, citrus: 74, bitter: 35, strength: 52 },
    pt: {
      category: 'Refrescante & Picante',
      glass: 'Caneca de Cobre ou Highball',
      garnish: 'Fatia de limão e hortelã',
      ingredients: [
        { name: 'Vodka', measure: '50 ml' },
        { name: 'Cerveja de Gengibre', measure: '120 ml' },
        { name: 'Suco de Limão', measure: '20 ml' },
      ],
      instructions: [
        'Encha uma caneca gelada com bastante gelo.',
        'Esprema o suco de limão fresco e despeje a vodka.',
        'Complete com cerveja de gengibre bem gelada.',
        'Mexa brevemente e decore com limão e um ramo de hortelã.',
      ],
    },
    en: {
      category: 'Crisp & Spiced',
      glass: 'Copper Mug',
      garnish: 'Lime wedge & mint sprig',
      ingredients: [
        { name: 'Vodka', measure: '1 3/4 oz' },
        { name: 'Ginger Beer', measure: '4 oz' },
        { name: 'Lime Juice', measure: '2/3 oz' },
      ],
      instructions: [
        'Pack a chilled copper mug with plenty of fresh ice.',
        'Add fresh lime juice and pour in the vodka.',
        'Top with crisp, spicy ginger beer.',
        'Stir gently once and garnish with lime and mint.',
      ],
    },
  },
  {
    id: 'house-aperol-spritz',
    name: 'Aperol Spritz',
    alcoholic: true,
    method: 'build',
    prepSeconds: 10,
    image: 'https://www.thecocktaildb.com/images/media/drink/iloasq1587661955.jpg',
    profile: { sweet: 55, citrus: 60, bitter: 54, strength: 38 },
    pt: {
      category: 'Aperitivo',
      glass: 'Taça de Vinho',
      garnish: 'Meia-lua de laranja',
      ingredients: [
        { name: 'Prosecco', measure: '90 ml' },
        { name: 'Aperol', measure: '60 ml' },
        { name: 'Água com Gás', measure: '30 ml' },
        { name: 'Laranja', measure: '1 fatia' },
      ],
      instructions: [
        'Coloque bastante gelo em uma taça de vinho grande.',
        'Despeje primeiro o Prosecco bem gelado para evitar que o Aperol decante no fundo.',
        'Adicione o Aperol em movimento circular e finalize com o lance de água com gás.',
        'Decore com uma fatia fresca de laranja.',
      ],
    },
    en: {
      category: 'Italian Aperitivo',
      glass: 'Large Wine Glass',
      garnish: 'Fresh orange slice',
      ingredients: [
        { name: 'Prosecco', measure: '3 oz' },
        { name: 'Aperol', measure: '2 oz' },
        { name: 'Soda Water', measure: '1 oz' },
        { name: 'Orange', measure: '1 slice' },
      ],
      instructions: [
        'Fill a large wine glass generously with ice cubes.',
        'Pour chilled Prosecco first so the Aperol integrates effortlessly.',
        'Add Aperol in a circular pour and finish with a splash of soda water.',
        'Garnish with a bright half-wheel of fresh orange.',
      ],
    },
  },
  {
    id: 'house-espresso-martini',
    name: 'Espresso Martini',
    alcoholic: true,
    method: 'shake',
    prepSeconds: 18,
    image: 'https://www.thecocktaildb.com/images/media/drink/n0sx531504372951.jpg',
    profile: { sweet: 56, citrus: 10, bitter: 68, strength: 68 },
    pt: {
      category: 'Moderno & Encorpado',
      glass: 'Taça Coupe ou Martini',
      garnish: '3 grãos de café torrado',
      ingredients: [
        { name: 'Vodka', measure: '45 ml' },
        { name: 'Licor de Café', measure: '25 ml' },
        { name: 'Café Espresso', measure: '30 ml' },
        { name: 'Xarope de Açúcar', measure: '10 ml' },
      ],
      instructions: [
        'Prepare um espresso fresco e deixe esfriar levemente para não derreter o gelo rápido demais.',
        'Na coqueteleira, una vodka, licor de café, espresso e xarope simples.',
        'Adicione bastante gelo e bata com força por 15 segundos para formar uma crema aveludada.',
        'Coe duplamente para uma taça gelada e disponha 3 grãos de café sobre a espuma.',
      ],
    },
    en: {
      category: 'Modern Classic',
      glass: 'Chilled Coupe',
      garnish: '3 roasted coffee beans',
      ingredients: [
        { name: 'Vodka', measure: '1 1/2 oz' },
        { name: 'Kahlua', measure: '3/4 oz' },
        { name: 'Espresso', measure: '1 oz' },
        { name: 'Simple Syrup', measure: '1/3 oz' },
      ],
      instructions: [
        'Pull a fresh shot of espresso and let it cool briefly.',
        'Combine vodka, coffee liqueur, espresso, and simple syrup in a shaker.',
        'Add plenty of ice and shake vigorously for 15 seconds to build a dense crema.',
        'Double strain into a chilled coupe and float 3 coffee beans on top.',
      ],
    },
  },
  {
    id: 'house-dry-martini',
    name: 'Dry Martini',
    alcoholic: true,
    method: 'stir',
    prepSeconds: 30,
    image: 'https://www.thecocktaildb.com/images/media/drink/6ck9yi1589574317.jpg',
    profile: { sweet: 15, citrus: 18, bitter: 45, strength: 94 },
    pt: {
      category: 'Clássico Seco',
      glass: 'Taça Martini Gelada',
      garnish: 'Azeitona verde ou casca de limão siciliano',
      ingredients: [
        { name: 'Gin', measure: '60 ml' },
        { name: 'Vermute Seco', measure: '15 ml' },
      ],
      instructions: [
        'Deixe a taça de martini no freezer por alguns minutos antes do preparo.',
        'Em um mixing glass cheio de gelo, adicione o gin e o vermute seco.',
        'Mexa continuamente por 30 segundos para atingir temperatura glacial sem turvar.',
        'Coe para a taça gelada e decore com azeitona ou casca de limão siciliano.',
      ],
    },
    en: {
      category: 'Dry Classic',
      glass: 'Frozen Martini Glass',
      garnish: 'Green olive or lemon twist',
      ingredients: [
        { name: 'Gin', measure: '2 oz' },
        { name: 'Dry Vermouth', measure: '1/2 oz' },
      ],
      instructions: [
        'Pre-chill a martini glass in the freezer beforehand.',
        'Combine gin and dry vermouth in a mixing glass packed with ice.',
        'Stir smoothly for 30 seconds until crystal-clear and ice cold.',
        'Strain into the chilled glass and finish with an olive or lemon twist.',
      ],
    },
  },
  {
    id: 'house-pina-colada',
    name: 'Piña Colada',
    alcoholic: true,
    method: 'blend',
    prepSeconds: 20,
    image: 'https://www.thecocktaildb.com/images/media/drink/cpf4j51504371346.jpg',
    profile: { sweet: 86, citrus: 40, bitter: 10, strength: 46 },
    pt: {
      category: 'Tropical',
      glass: 'Copo Hurricane',
      garnish: 'Triângulo de abacaxi fresco',
      ingredients: [
        { name: 'Rum Branco', measure: '50 ml' },
        { name: 'Suco de Abacaxi', measure: '100 ml' },
        { name: 'Leite de Coco', measure: '45 ml' },
      ],
      instructions: [
        'Coloque o rum branco, o suco de abacaxi, o leite de coco e 1 xícara de gelo no liquidificador.',
        'Bata até atingir uma textura cremosa e uniforme.',
        'Sirva em um copo alto e decore com uma fatia de abacaxi na borda.',
      ],
    },
    en: {
      category: 'Tropical Classic',
      glass: 'Hurricane Glass',
      garnish: 'Fresh pineapple wedge',
      ingredients: [
        { name: 'White Rum', measure: '1 3/4 oz' },
        { name: 'Pineapple Juice', measure: '3 1/2 oz' },
        { name: 'Coconut Milk', measure: '1 1/2 oz' },
      ],
      instructions: [
        'Add white rum, pineapple juice, coconut milk, and a cup of ice to a blender.',
        'Blend until velvety and smooth.',
        'Pour into a tall hurricane glass and garnish with a fresh pineapple wedge.',
      ],
    },
  },
  {
    id: 'house-cosmopolitan',
    name: 'Cosmopolitan',
    alcoholic: true,
    method: 'shake',
    prepSeconds: 15,
    image: 'https://www.thecocktaildb.com/images/media/drink/kpsajh1504368362.jpg',
    profile: { sweet: 52, citrus: 76, bitter: 22, strength: 64 },
    pt: {
      category: 'Clássico Contemporâneo',
      glass: 'Taça Martini ou Coupe',
      garnish: 'Casca de laranja flambada ou torcida',
      ingredients: [
        { name: 'Vodka', measure: '45 ml' },
        { name: 'Licor de Laranja', measure: '15 ml' },
        { name: 'Suco de Cranberry', measure: '30 ml' },
        { name: 'Suco de Limão', measure: '15 ml' },
      ],
      instructions: [
        'Adicione vodka, licor de laranja, suco de cranberry e suco de limão na coqueteleira.',
        'Complete com gelo e bata vigorosamente por 15 segundos.',
        'Faça dupla coagem para uma taça gelada e perfuma com casca de laranja.',
      ],
    },
    en: {
      category: 'Modern Classic',
      glass: 'Chilled Coupe',
      garnish: 'Expressed orange peel',
      ingredients: [
        { name: 'Vodka', measure: '1 1/2 oz' },
        { name: 'Triple Sec', measure: '1/2 oz' },
        { name: 'Cranberry Juice', measure: '1 oz' },
        { name: 'Lime Juice', measure: '1/2 oz' },
      ],
      instructions: [
        'Combine vodka, orange liqueur, cranberry juice, and fresh lime juice in a shaker.',
        'Fill with ice and shake briskly for 15 seconds.',
        'Double strain into a chilled glass and express an orange peel over top.',
      ],
    },
  },
  {
    id: 'house-rabo-de-galo',
    name: 'Rabo de Galo',
    alcoholic: true,
    method: 'stir',
    prepSeconds: 20,
    profile: { sweet: 46, citrus: 20, bitter: 66, strength: 84 },
    pt: {
      category: 'Clássico Brasileiro',
      glass: 'Copo Baixo',
      garnish: 'Casca de limão tahiti',
      ingredients: [
        { name: 'Cachaça', measure: '50 ml' },
        { name: 'Vermute Doce', measure: '25 ml' },
        { name: 'Campari', measure: '10 ml' },
      ],
      instructions: [
        'Encha um copo baixo com gelo grande.',
        'Adicione a cachaça envelhecida ou prata, o vermute doce e um toque de Campari.',
        'Mexa delicadamente por 20 segundos até gelar bem.',
        'Torça uma casca de limão tahiti sobre a taça para perfumar.',
      ],
    },
    en: {
      category: 'Brazilian Classic',
      glass: 'Rocks Glass',
      garnish: 'Lime peel twist',
      ingredients: [
        { name: 'Cachaca', measure: '1 3/4 oz' },
        { name: 'Sweet Vermouth', measure: '3/4 oz' },
        { name: 'Campari', measure: '1/3 oz' },
      ],
      instructions: [
        'Fill a rocks glass with solid ice.',
        'Pour in cachaça, sweet vermouth, and a measure of Campari.',
        'Stir smoothly for 20 seconds until properly chilled.',
        'Express a fresh lime peel across the top.',
      ],
    },
  },
  // Curated Zero-Proof / Mocktails
  {
    id: 'house-passion-virgin-mojito',
    name: 'Mojito de Maracujá Zero',
    alcoholic: false,
    method: 'build',
    prepSeconds: 15,
    profile: { sweet: 60, citrus: 82, bitter: 18, strength: 5 },
    pt: {
      category: 'Sem Álcool · Refrescante',
      glass: 'Copo Alto',
      garnish: 'Ramo de hortelã e sementes de maracujá',
      ingredients: [
        { name: 'Maracujá', measure: '45 ml' },
        { name: 'Hortelã', measure: '10 folhas' },
        { name: 'Suco de Limão', measure: '20 ml' },
        { name: 'Mel', measure: '15 ml' },
        { name: 'Água com Gás', measure: '120 ml' },
      ],
      instructions: [
        'Misture a polpa ou suco de maracujá com mel e suco de limão no fundo do copo alto.',
        'Desperte as folhas de hortelã batendo levemente nas mãos e adicione ao copo.',
        'Preencha com bastante gelo e complete com água com gás bem gelada.',
        'Mexa suavemente e finalize com um ramo aromático de hortelã.',
      ],
    },
    en: {
      category: 'Zero-Proof · Refreshing',
      glass: 'Highball Glass',
      garnish: 'Fresh mint sprig',
      ingredients: [
        { name: 'Passion Fruit', measure: '1 1/2 oz' },
        { name: 'Mint', measure: '10 leaves' },
        { name: 'Lime Juice', measure: '2/3 oz' },
        { name: 'Honey', measure: '1/2 oz' },
        { name: 'Soda Water', measure: '4 oz' },
      ],
      instructions: [
        'Stir passion fruit pulp, honey, and lime juice together in a tall glass.',
        'Clap fresh mint leaves to release aroma and tuck them into the glass.',
        'Pack with ice and top with crisp chilled soda water.',
        'Lift gently with a spoon and crown with a fresh mint sprig.',
      ],
    },
  },
  {
    id: 'house-citrus-basil-tonic',
    name: 'Citrus Basil Tonic',
    alcoholic: false,
    method: 'build',
    prepSeconds: 10,
    profile: { sweet: 36, citrus: 78, bitter: 52, strength: 5 },
    pt: {
      category: 'Sem Álcool · Botânico',
      glass: 'Taça Balão',
      garnish: 'Fatia de pepino e folhas de manjericão',
      ingredients: [
        { name: 'Água Tônica', measure: '150 ml' },
        { name: 'Suco de Limão Siciliano', measure: '25 ml' },
        { name: 'Manjericão', measure: '5 folhas' },
        { name: 'Pepino', measure: '3 fatias' },
        { name: 'Mel', measure: '10 ml' },
      ],
      instructions: [
        'Dissolva o mel no suco de limão siciliano no fundo da taça.',
        'Acomode as fatias finas de pepino e as folhas de manjericão ao redor do gelo.',
        'Complete suavemente com água tônica gelada e mexa uma única vez.',
      ],
    },
    en: {
      category: 'Zero-Proof · Botanical',
      glass: 'Copa Glass',
      garnish: 'Cucumber ribbons & fresh basil',
      ingredients: [
        { name: 'Tonic Water', measure: '5 oz' },
        { name: 'Lemon Juice', measure: '3/4 oz' },
        { name: 'Basil', measure: '5 leaves' },
        { name: 'Cucumber', measure: '3 slices' },
        { name: 'Honey', measure: '1/3 oz' },
      ],
      instructions: [
        'Dissolve honey into fresh lemon juice at the bottom of a chilled glass.',
        'Layer cucumber slices and fresh basil leaves alongside plenty of ice.',
        'Pour cold tonic water gently down the glass side and give one light stir.',
      ],
    },
  },
  {
    id: 'house-ginger-hibiscus-fizz',
    name: 'Hibiscus Ginger Fizz',
    alcoholic: false,
    method: 'shake',
    prepSeconds: 15,
    profile: { sweet: 46, citrus: 68, bitter: 44, strength: 5 },
    pt: {
      category: 'Sem Álcool · Aromático',
      glass: 'Copo Alto',
      garnish: 'Casca de laranja e lasca de gengibre',
      ingredients: [
        { name: 'Hibisco', measure: '60 ml' },
        { name: 'Cerveja de Gengibre', measure: '100 ml' },
        { name: 'Suco de Limão', measure: '20 ml' },
        { name: 'Açúcar', measure: '1 colher de chá' },
      ],
      instructions: [
        'Prepare uma infusão concentrada de hibisco e deixe gelar completamente.',
        'Na coqueteleira com gelo, bata o chá de hibisco, o suco de limão e o açúcar por 10 segundos.',
        'Coe sobre gelo novo em um copo alto e complete com cerveja de gengibre.',
        'Perfume com uma casca de laranja.',
      ],
    },
    en: {
      category: 'Zero-Proof · Aromatic',
      glass: 'Highball Glass',
      garnish: 'Orange twist & ginger coin',
      ingredients: [
        { name: 'Hibiscus', measure: '2 oz' },
        { name: 'Ginger Beer', measure: '3 1/2 oz' },
        { name: 'Lime Juice', measure: '2/3 oz' },
        { name: 'Sugar', measure: '1 tsp' },
      ],
      instructions: [
        'Brew a concentrated hibiscus tea infusion and chill completely.',
        'Shake hibiscus infusion, lime juice, and sugar over ice for 10 seconds.',
        'Strain into an ice-filled highball glass and top with crisp ginger beer.',
        'Express an orange twist over the glass before serving.',
      ],
    },
  },
];

export function getCuratedRecipes(lang: Language): CocktailRecipe[] {
  return CURATED_SEEDS.map((seed) => {
    const localized = seed[lang];
    return {
      id: seed.id,
      name: seed.name,
      category: localized.category,
      alcoholic: seed.alcoholic,
      glass: localized.glass,
      image: seed.image,
      garnish: localized.garnish,
      ingredients: localized.ingredients,
      instructions: localized.instructions,
      source: 'curated',
      instructionsLang: lang,
      profile: seed.profile,
      prepSeconds: seed.prepSeconds,
      method: seed.method,
    };
  });
}
