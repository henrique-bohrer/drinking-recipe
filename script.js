document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipeForm');
    const recipesContainer = document.getElementById('recipesContainer');

    // Array para armazenar as receitas
    let recipes = [];

    recipeForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Pegar valores dos inputs
        const nameInput = document.getElementById('recipeName').value;
        const seasonsCheckboxes = document.querySelectorAll('input[name="season"]:checked');
        const beverageSetInput = document.getElementById('beverageSet').value;
        const distilledSpiritSelect = document.getElementById('distilledSpirit').value;

        // Validar checkbox (pelo menos uma estação)
        if (seasonsCheckboxes.length === 0) {
            alert("Por favor, selecione pelo menos uma estação de inspiração.");
            return;
        }

        // Extrair valores dos checkboxes
        const selectedSeasons = Array.from(seasonsCheckboxes).map(cb => cb.value);

        // Criar objeto da receita
        const newRecipe = {
            id: Date.now(),
            name: nameInput,
            seasons: selectedSeasons,
            mixers: beverageSetInput.split(',').map(item => item.trim()), // Separar por vírgula
            spirit: distilledSpiritSelect
        };

        // Adicionar ao array
        recipes.push(newRecipe);

        // Limpar o formulário
        recipeForm.reset();

        // Atualizar a interface
        renderRecipes();

        // Feedback visual
        showSuccessMessage("Protocolo sintetizado com sucesso!");
    });

    function renderRecipes() {
        // Limpar o container
        recipesContainer.innerHTML = '';

        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p class="text-secondary">Nenhum protocolo sintetizado ainda. Inicie o laboratório.</p>';
            return;
        }

        // Criar cards para cada receita
        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';

            // Montar tags de estações
            const seasonsTags = recipe.seasons.map(season => `<span class="tag">${season}</span>`).join('');

            // Montar lista de mixers
            const mixersList = recipe.mixers.join(' • ');

            card.innerHTML = `
                <h3>${recipe.name}</h3>

                <div class="recipe-detail">
                    <strong>Base Destilada:</strong>
                    <br>
                    <span>${recipe.spirit}</span>
                </div>

                <div class="recipe-detail">
                    <strong>Conjunto de Mixers:</strong>
                    <br>
                    <span>${mixersList}</span>
                </div>

                <div class="recipe-detail">
                    <strong>Estações de Inspiração:</strong>
                    <div class="tag-list">
                        ${seasonsTags}
                    </div>
                </div>
            `;

            recipesContainer.appendChild(card);
        });
    }

    function showSuccessMessage(message) {
        const btn = document.querySelector('.btn-submit');
        const originalText = btn.textContent;

        btn.textContent = message;
        btn.style.backgroundColor = 'var(--neon-blue)';
        btn.style.color = 'var(--bg-dark)';
        btn.style.boxShadow = '0 0 20px var(--neon-blue)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = 'transparent';
            btn.style.color = 'var(--neon-blue)';
            btn.style.boxShadow = 'none';
        }, 3000);
    }

    // Render inicial vazio
    renderRecipes();
});