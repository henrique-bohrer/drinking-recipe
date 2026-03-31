document.addEventListener('DOMContentLoaded', () => {
    // Database de Receitas Clássicas
    const database = [
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

    // Elementos DOM
    const ingredientInput = document.getElementById('ingredientInput');
    const tagsContainer = document.getElementById('tagsContainer');
    const resultsSection = document.getElementById('resultsSection');
    const recipesContainer = document.getElementById('recipesContainer');

    // Estado Local
    let activeTags = [];

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

    function triggerMatchmaking() {
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

        const results = matchIngredients(activeTags);
        renderResults(results);
    }

    function matchIngredients(userIngredients) {
        const matches = [];

        database.forEach(recipe => {
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

        if (results.length === 0) {
            recipesContainer.innerHTML = '<div class="no-results">Nenhum drink clássico encontrado com esses ingredientes. Experimente adicionar mais itens!</div>';
            return;
        }

        results.forEach(recipe => {
            const is100Match = recipe.matchPercentage === 100;
            const badgeClass = is100Match ? 'match-badge' : 'match-badge partial';
            const badgeText = is100Match ? '100% Match' : `Falta ${recipe.missingIngredients.length} item(s)`;

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
                    <strong>Ingredientes:</strong>
                    <ul class="ingredient-list">
                        ${ingredientsHTML}
                    </ul>
                </div>

                ${recipe.garnish ? `<div class="garnish">Guarnição: ${recipe.garnish}</div>` : ''}

                <div class="expand-hint">
                    <span class="hint-text">Ver montagem do drink</span>
                    <span class="hint-icon">▼</span>
                </div>

                <div class="recipe-instructions">
                    <strong>Passo a passo:</strong>
                    <ol class="instruction-list">
                        ${instructionsHTML}
                    </ol>
                </div>
            `;

            recipesContainer.appendChild(card);
        });
    }
});