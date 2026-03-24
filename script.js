document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentLang = 'pt';
    let activeTags = [];

    // Language Dictionary
    const i18n = {
        pt: {
            title: "NeoDrinks",
            subtitle: "O que temos no bar hoje? Digite seus ingredientes e descubra o seu próximo drink.",
            inputPlaceholder: "Ex: Limão Siciliano, Curaçao Blue, Água com gás (aperte Enter ou vírgula)",
            noResults: "Nenhum drink clássico encontrado com esses ingredientes. Experimente adicionar mais itens!",
            match100: "100% Match",
            matchMissing: "Falta {n} item(s)",
            ingredients: "Ingredientes:",
            garnish: "Guarnição:",
            instructions: "Passo a passo:",
            viewAssembly: "Ver montagem do drink",
            hideAssembly: "Ocultar montagem"
        },
        en: {
            title: "NeoDrinks",
            subtitle: "What's in the bar today? Enter your ingredients and discover your next drink.",
            inputPlaceholder: "Ex: Lemon, Blue Curaçao, Sparkling water (press Enter or comma)",
            noResults: "No classic drink found with these ingredients. Try adding more items!",
            match100: "100% Match",
            matchMissing: "Missing {n} item(s)",
            ingredients: "Ingredients:",
            garnish: "Garnish:",
            instructions: "Step by step:",
            viewAssembly: "View drink assembly",
            hideAssembly: "Hide assembly"
        }
    };

    // Database de Receitas Clássicas (PT)
    const databasePt = [
        {
            id: "1",
            name: "Margarita",
            type: "Clássico",
            ingredients: ["Tequila", "Licor de Laranja", "Suco de Limão", "Sal"],
            garnish: "Rodela de Limão e Borda de Sal",
            instructions: [
                "Passe um pedaço de limão na borda do copo e mergulhe no sal.",
                "Em uma coqueteleira, adicione a tequila, o licor de laranja e o suco de limão.",
                "Adicione gelo e agite vigorosamente.",
                "Coe para o copo preparado com gelo fresco.",
                "Decore com a rodela de limão."
            ]
        },
        {
            id: "2",
            name: "Mojito",
            type: "Clássico",
            ingredients: ["Rum Branco", "Hortelã", "Açúcar", "Suco de Limão", "Água com Gás"],
            garnish: "Ramo de Hortelã",
            instructions: [
                "Em um copo alto, amasse levemente a hortelã com o açúcar e o suco de limão.",
                "Adicione o rum e misture bem para dissolver o açúcar.",
                "Encha o copo com gelo triturado ou em cubos.",
                "Complete com água com gás e mexa suavemente.",
                "Decore com um ramo de hortelã."
            ]
        },
        {
            id: "3",
            name: "Blue Lagoon",
            type: "Clássico",
            ingredients: ["Vodka", "Curaçao Blue", "Limonada", "Gelo"],
            garnish: "Limão Siciliano",
            instructions: [
                "Encha um copo alto (highball) com gelo.",
                "Adicione a vodka e o Curaçao Blue.",
                "Complete com a limonada.",
                "Mexa suavemente para misturar as cores.",
                "Decore com uma fatia de limão siciliano."
            ]
        },
        {
            id: "4",
            name: "Negroni",
            type: "Clássico",
            ingredients: ["Gin", "Campari", "Vermute Doce"],
            garnish: "Casca de Laranja",
            instructions: [
                "Em um copo baixo (rocks), adicione bastante gelo.",
                "Despeje o gin, o Campari e o vermute doce.",
                "Mexa suavemente por cerca de 20 segundos para resfriar e diluir levemente.",
                "Torça a casca de laranja sobre o drink para liberar os óleos essenciais e adicione-a ao copo."
            ]
        },
        {
            id: "5",
            name: "Old Fashioned",
            type: "Clássico",
            ingredients: ["Bourbon", "Angostura", "Açúcar", "Água"],
            garnish: "Casca de Laranja e Cereja",
            instructions: [
                "Em um copo baixo, coloque o açúcar, a Angostura e um lance de água.",
                "Amasse até dissolver o açúcar.",
                "Adicione um cubo de gelo grande e despeje o bourbon.",
                "Mexa suavemente.",
                "Decore com uma casca de laranja (liberando os óleos) e uma cereja."
            ]
        },
        {
            id: "6",
            name: "Dry Martini",
            type: "Clássico",
            ingredients: ["Gin", "Vermute Seco"],
            garnish: "Azeitona",
            instructions: [
                "Em um mixing glass cheio de gelo, adicione o gin e o vermute seco.",
                "Mexa por cerca de 30 segundos para resfriar bem sem turvar a bebida.",
                "Coe para uma taça de martini previamente gelada.",
                "Decore com uma ou três azeitonas no palito."
            ]
        },
        {
            id: "7",
            name: "Moscow Mule",
            type: "Clássico",
            ingredients: ["Vodka", "Cerveja de Gengibre", "Suco de Limão"],
            garnish: "Fatia de Limão e Hortelã",
            instructions: [
                "Em uma caneca de cobre, esprema o suco de limão.",
                "Adicione a vodka e bastante gelo triturado.",
                "Complete com a cerveja de gengibre.",
                "Mexa suavemente.",
                "Decore com uma fatia de limão e um ramo de hortelã."
            ]
        },
        {
            id: "8",
            name: "Piña Colada",
            type: "Clássico",
            ingredients: ["Rum Branco", "Suco de Abacaxi", "Leite de Coco"],
            garnish: "Fatia de Abacaxi",
            instructions: [
                "Em um liquidificador, adicione o rum, o suco de abacaxi, o leite de coco e gelo.",
                "Bata até obter uma consistência cremosa e homogênea.",
                "Despeje em um copo alto (hurricane).",
                "Decore com uma fatia de abacaxi na borda."
            ]
        },
        {
            id: "9",
            name: "Cosmopolitan",
            type: "Clássico",
            ingredients: ["Vodka", "Licor de Laranja", "Suco de Cranberry", "Suco de Limão"],
            garnish: "Casca de Laranja",
            instructions: [
                "Em uma coqueteleira com gelo, adicione a vodka, o licor de laranja, o suco de cranberry e o suco de limão.",
                "Agite vigorosamente.",
                "Coe duplamente para uma taça de martini gelada.",
                "Torça uma casca de laranja sobre a bebida para liberar os óleos e decore."
            ]
        },
        {
            id: "10",
            name: "Caipirinha",
            type: "Clássico",
            ingredients: ["Cachaça", "Limão", "Açúcar"],
            garnish: "Fatia de Limão",
            instructions: [
                "Corte o limão em pedaços (retirando o miolo branco para não amargar).",
                "Em um copo baixo, macere o limão com o açúcar.",
                "Adicione gelo até o topo do copo.",
                "Despeje a cachaça e mexa bem de baixo para cima.",
                "Decore com uma fatia fina de limão."
            ]
        }
    ];

    // Database de Receitas Clássicas (EN)
    const databaseEn = [
        {
            id: "1",
            name: "Margarita",
            type: "Classic",
            ingredients: ["Tequila", "Orange Liqueur", "Lime Juice", "Salt"],
            garnish: "Lime wheel and salt rim",
            instructions: [
                "Rub a lime wedge over the rim of the glass and dip in salt.",
                "In a shaker, add tequila, orange liqueur and lime juice.",
                "Add ice and shake vigorously.",
                "Strain into the prepared glass with fresh ice.",
                "Garnish with the lime wheel."
            ]
        },
        {
            id: "2",
            name: "Mojito",
            type: "Classic",
            ingredients: ["White Rum", "Mint", "Sugar", "Lime Juice", "Sparkling Water"],
            garnish: "Mint sprig",
            instructions: [
                "In a tall glass, lightly muddle the mint with sugar and lime juice.",
                "Add rum and mix well to dissolve the sugar.",
                "Fill the glass with crushed or cubed ice.",
                "Top with sparkling water and stir gently.",
                "Garnish with a mint sprig."
            ]
        },
        {
            id: "3",
            name: "Blue Lagoon",
            type: "Classic",
            ingredients: ["Vodka", "Blue Curaçao", "Lemonade", "Ice"],
            garnish: "Lemon slice",
            instructions: [
                "Fill a highball glass with ice.",
                "Add vodka and Blue Curaçao.",
                "Top with lemonade.",
                "Stir gently to mix the colors.",
                "Garnish with a lemon slice."
            ]
        },
        {
            id: "4",
            name: "Negroni",
            type: "Classic",
            ingredients: ["Gin", "Campari", "Sweet Vermouth"],
            garnish: "Orange peel",
            instructions: [
                "In a rocks glass, add plenty of ice.",
                "Pour in gin, Campari and sweet vermouth.",
                "Stir gently for about 20 seconds to chill and slightly dilute.",
                "Twist the orange peel over the drink to release essential oils and drop it in."
            ]
        },
        {
            id: "5",
            name: "Old Fashioned",
            type: "Classic",
            ingredients: ["Bourbon", "Angostura", "Sugar", "Water"],
            garnish: "Orange peel and cherry",
            instructions: [
                "In a rocks glass, place sugar, Angostura and a dash of water.",
                "Muddle until sugar is dissolved.",
                "Add a large ice cube and pour in the bourbon.",
                "Stir gently.",
                "Garnish with an orange peel (releasing the oils) and a cherry."
            ]
        },
        {
            id: "6",
            name: "Dry Martini",
            type: "Classic",
            ingredients: ["Gin", "Dry Vermouth"],
            garnish: "Olive",
            instructions: [
                "In a mixing glass filled with ice, add gin and dry vermouth.",
                "Stir for about 30 seconds to chill well without clouding the drink.",
                "Strain into a chilled martini glass.",
                "Garnish with one or three olives on a pick."
            ]
        },
        {
            id: "7",
            name: "Moscow Mule",
            type: "Classic",
            ingredients: ["Vodka", "Ginger Beer", "Lime Juice"],
            garnish: "Lime slice and mint",
            instructions: [
                "In a copper mug, squeeze the lime juice.",
                "Add vodka and plenty of crushed ice.",
                "Top with ginger beer.",
                "Stir gently.",
                "Garnish with a lime slice and a mint sprig."
            ]
        },
        {
            id: "8",
            name: "Piña Colada",
            type: "Classic",
            ingredients: ["White Rum", "Pineapple Juice", "Coconut Milk"],
            garnish: "Pineapple slice",
            instructions: [
                "In a blender, add rum, pineapple juice, coconut milk and ice.",
                "Blend until smooth and creamy.",
                "Pour into a tall glass (hurricane).",
                "Garnish with a pineapple slice on the rim."
            ]
        },
        {
            id: "9",
            name: "Cosmopolitan",
            type: "Classic",
            ingredients: ["Vodka", "Orange Liqueur", "Cranberry Juice", "Lime Juice"],
            garnish: "Orange peel",
            instructions: [
                "In a shaker with ice, add vodka, orange liqueur, cranberry juice and lime juice.",
                "Shake vigorously.",
                "Double strain into a chilled martini glass.",
                "Twist an orange peel over the drink to release oils and garnish."
            ]
        },
        {
            id: "10",
            name: "Caipirinha",
            type: "Classic",
            ingredients: ["Cachaça", "Lime", "Sugar"],
            garnish: "Lime slice",
            instructions: [
                "Cut the lime into pieces (removing the white pith to avoid bitterness).",
                "In a rocks glass, muddle the lime with sugar.",
                "Add ice to the top of the glass.",
                "Pour in the cachaça and stir well from bottom to top.",
                "Garnish with a thin slice of lime."
            ]
        }
    ];

    let database = databasePt;

    // Elementos DOM
    const ingredientsDatalist = document.getElementById('ingredientsDatalist');
    const ingredientInput = document.getElementById('ingredientInput');
    const titleText = document.getElementById('titleText');
    const subtitleText = document.getElementById('subtitleText');
    const btnPt = document.getElementById('btn-pt');
    const btnEn = document.getElementById('btn-en');
    const tagsContainer = document.getElementById('tagsContainer');
    const resultsSection = document.getElementById('resultsSection');
    const recipesContainer = document.getElementById('recipesContainer');

    // Fetch Ingredients from TheCocktailDB
    async function fetchIngredients() {
        try {
            const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
            const data = await response.json();

            if (data && data.drinks) {
                ingredientsDatalist.innerHTML = '';
                data.drinks.forEach(drink => {
                    const option = document.createElement('option');
                    option.value = drink.strIngredient1;
                    ingredientsDatalist.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Error fetching ingredients:", error);
        }
    }

    // Initialize ingredients list
    fetchIngredients();

    // Lógica de Idioma
    function setLanguage(lang) {
        currentLang = lang;
        database = lang === 'pt' ? databasePt : databaseEn;

        // Update Buttons
        btnPt.classList.toggle('active', lang === 'pt');
        btnEn.classList.toggle('active', lang === 'en');

        // Update Static Texts
        titleText.textContent = i18n[lang].title;
        subtitleText.textContent = i18n[lang].subtitle;
        ingredientInput.placeholder = i18n[lang].inputPlaceholder;

        // Re-render results if there are active tags
        if (activeTags.length > 0) {
            triggerMatchmaking();
        }
    }

    btnPt.addEventListener('click', () => setLanguage('pt'));
    btnEn.addEventListener('click', () => setLanguage('en'));

    // Lógica do Input de Tags
    ingredientInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(this.value);
        }
    });

    ingredientInput.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            addTag(this.value);
        }
    });

    function addTag(value) {
        // Limpar string (remover vírgulas no final e espaços extras)
        const cleanValue = value.replace(/,+$/, '').trim();

        if (cleanValue && !activeTags.includes(cleanValue.toLowerCase())) {
            activeTags.push(cleanValue.toLowerCase());

            // Criar pílula visual
            const tagPill = document.createElement('div');
            tagPill.className = 'tag-pill';

            const textSpan = document.createElement('span');
            textSpan.textContent = cleanValue;

            const removeSpan = document.createElement('span');
            removeSpan.className = 'remove-tag';
            removeSpan.setAttribute('data-tag', cleanValue.toLowerCase());
            removeSpan.innerHTML = '&times;';

            tagPill.appendChild(textSpan);
            tagPill.appendChild(removeSpan);

            // Inserir antes do input
            tagsContainer.insertBefore(tagPill, ingredientInput);

            // Evento para remover tag
            tagPill.querySelector('.remove-tag').addEventListener('click', function() {
                const tagToRemove = this.getAttribute('data-tag');
                activeTags = activeTags.filter(tag => tag !== tagToRemove);
                tagPill.remove();
                triggerMatchmaking();
            });

            triggerMatchmaking();
        }

        ingredientInput.value = '';
    }

    async function triggerMatchmaking() {
        if (activeTags.length === 0) {
            // Esconder resultados se não houver tags
            resultsSection.classList.remove('show');
            setTimeout(() => {
                if(activeTags.length === 0) resultsSection.classList.add('hidden');
            }, 800); // Tempo da animação css
            return;
        }

        // Mostrar seção (remover hidden e adicionar show para trigger da animação)
        resultsSection.classList.remove('hidden');
        // Pequeno delay para garantir que o display:none foi removido antes da animação
        setTimeout(() => {
            resultsSection.classList.add('show');
        }, 10);

        recipesContainer.innerHTML = '<div class="no-results" style="color: var(--blue-accent);">Loading...</div>';

        // Fetch drinks based on active tags
        let apiRecipes = [];

        // Helper to fetch details
        async function fetchDrinkDetails(idDrink) {
            try {
                const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
                if (!res.ok) return null;
                const data = await res.json();
                if (data && data.drinks && data.drinks[0]) {
                    const d = data.drinks[0];
                    const ingredients = [];
                    for (let i = 1; i <= 15; i++) {
                        const ing = d[`strIngredient${i}`];
                        if (ing && ing.trim() !== '') {
                            ingredients.push(ing.trim());
                        }
                    }

                    let instructions = [];
                    let strInst = currentLang === 'pt' && d.strInstructionsIT ? d.strInstructionsIT : d.strInstructions;
                    if (!strInst) strInst = d.strInstructions;
                    if (strInst) {
                        instructions = strInst.split('.').map(s => s.trim()).filter(s => s.length > 0);
                    }

                    return {
                        id: d.idDrink,
                        name: d.strDrink,
                        type: 'API Recipe',
                        ingredients: ingredients,
                        garnish: null,
                        instructions: instructions
                    };
                }
            } catch (e) {
                console.error('Error looking up drink details', e);
            }
            return null;
        }

        try {
            // we will search by the first tag mainly because the free API filter by ingredient only allows 1 ingredient
            const firstTag = activeTags[0];
            const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(firstTag)}`);
            if (res.ok) {
                const text = await res.text();
                // TheCocktailDB returns empty or no data found string if nothing is found
                if (text && text.trim() !== '' && text.includes('drinks')) {
                    const data = JSON.parse(text);
                    if (data && data.drinks) {
                        const apiDrinks = data.drinks.slice(0, 8); // Limit to 8 for performance in lookup
                        const detailsPromises = apiDrinks.map(d => fetchDrinkDetails(d.idDrink));
                        const detailsResults = await Promise.all(detailsPromises);
                        apiRecipes = detailsResults.filter(r => r !== null);
                    }
                }
            }
        } catch (e) {
            console.error('Error fetching drinks from API', e);
        }

        const combinedDatabase = [...database, ...apiRecipes];
        const results = matchIngredients(activeTags, combinedDatabase);

        // Remove duplicates by name
        const uniqueResults = [];
        const seenNames = new Set();
        for (const r of results) {
            if (!seenNames.has(r.name)) {
                seenNames.add(r.name);
                uniqueResults.push(r);
            }
        }

        renderResults(uniqueResults);
    }

    function matchIngredients(userIngredients, searchDatabase) {
        const matches = [];

        searchDatabase.forEach(recipe => {
            let matchCount = 0;
            const missingIngredients = [];
            const ownedIngredients = [];

            recipe.ingredients.forEach(reqIng => {
                // Checagem case insensitive e substring simples (ex: "limão" dá match em "Suco de Limão")
                const isOwned = userIngredients.some(userIng =>
                    reqIng.toLowerCase().includes(userIng) || userIng.includes(reqIng.toLowerCase())
                );

                if (isOwned) {
                    matchCount++;
                    ownedIngredients.push(reqIng);
                } else {
                    missingIngredients.push(reqIng);
                }
            });

            const matchPercentage = (matchCount / recipe.ingredients.length) * 100;

            // Só considerar drinks que tenham pelo menos 1 ingrediente em comum (ou ajuste a gosto)
            if (matchCount > 0) {
                matches.push({
                    ...recipe,
                    matchPercentage,
                    matchCount,
                    ownedIngredients,
                    missingIngredients
                });
            }
        });

        // Ordenar por maior porcentagem de match
        return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    function renderResults(results) {
        recipesContainer.innerHTML = '';
        const texts = i18n[currentLang];

        if (results.length === 0) {
            recipesContainer.innerHTML = `<div class="no-results">${texts.noResults}</div>`;
            return;
        }

        results.forEach(recipe => {
            const is100Match = recipe.matchPercentage === 100;
            const badgeClass = is100Match ? 'match-badge' : 'match-badge partial';
            const badgeText = is100Match ? texts.match100 : texts.matchMissing.replace('{n}', recipe.missingIngredients.length);

            const card = document.createElement('div');
            card.className = 'recipe-card';

            // Add click listener to toggle expanded state
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });

            // Gerar HTML da lista de ingredientes
            const ingredientsHTML = recipe.ingredients.map(ing => {
                const isMissing = recipe.missingIngredients.includes(ing);
                return `<li class="ingredient-item ${isMissing ? 'missing' : ''}">${ing}</li>`;
            }).join('');

            // Gerar HTML das instruções
            const instructionsHTML = recipe.instructions ? recipe.instructions.map((step, index) => {
                return `<li>${step}</li>`;
            }).join('') : '';

            card.innerHTML = `
                <div class="recipe-header">
                    <h3>${recipe.name}</h3>
                    <span class="${badgeClass}">${badgeText}</span>
                </div>

                <span class="recipe-type">${recipe.type}</span>

                <div class="recipe-detail">
                    <strong>${texts.ingredients}</strong>
                    <ul class="ingredient-list">
                        ${ingredientsHTML}
                    </ul>
                </div>

                ${recipe.garnish ? `<div class="garnish">${texts.garnish} ${recipe.garnish}</div>` : ''}

                <div class="expand-hint">
                    <span class="hint-text" data-hide-text="${texts.hideAssembly}">${texts.viewAssembly}</span>
                    <span class="hint-icon">▼</span>
                </div>

                <div class="recipe-instructions">
                    <strong>${texts.instructions}</strong>
                    <ol class="instruction-list">
                        ${instructionsHTML}
                    </ol>
                </div>
            `;

            recipesContainer.appendChild(card);
        });
    }
});