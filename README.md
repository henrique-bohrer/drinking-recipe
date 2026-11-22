# NeoDrinks — Atelier de Mixologia

Aplicação web moderna e responsiva (PC & Mobile) construída em **TypeScript estrito**, **TailwindCSS v4** e **Vite**, com integração a APIs públicas de coquetelaria e tradução sob demanda.

## Principais Funcionalidades

- **Minha Despensa de Bar (Smart Pantry)**: autocomplete acessível com navegação por teclado, normalização sem acentos, equivalência bilíngue (`PT-BR` ↔ `EN-US`), atalhos rápidos de prateleira e **Dica de Compra** (indica qual 1 ingrediente desbloqueia mais drinks).
- **Motor de Busca & Match Inteligente**: consulta paralela na API **TheCocktailDB** para múltiplos ingredientes, busca direta por nome, filtros (Alcoólicos / Zero Álcool) e ordenação.
- **Modo Bartender Interativo**:
  - **Escalador de doses** (`1×` a `12×`) e conversão automática **`ml` ↔ `oz`**.
  - **Checklist interativo** de etapas de preparo.
  - **Cronômetro embutido** (*Shake 15s*, *Stir 25s*, *Resfriar 30s*) com alerta sonoro suave via Web Audio API.
  - **Perfil sensorial estimado** (Dulçor, Acidez, Amargor/Herbal, Intensidade).
  - **Tradução automática sob demanda** de receitas da API para PT-BR via **MyMemory API** com cache local.
- **Roleta do Bartender**: descoberta espontânea por clima (*Surpresa*, *Refrescante*, *Forte & Clássico*, *Sem Álcool*).
- **Sommelier de Paladar (Quiz)**: 3 perguntas rápidas para recomendar drinks sob medida.
- **Caderno de Drinks**: favoritos, avaliação por estrelas e notas pessoais de degustação salvas no `localStorage`.
- **Conforto Visual & Responsividade**: tema editorial **Papel Botânico** (padrão) e tema noturno **Speakeasy**, além de barra de navegação inferior dedicada para celulares.

## Arquitetura

```text
src/
├── data/          # Carta curada bilíngue (clássicos, brasileiros e mocktails)
├── i18n/          # Dicionário PT-BR / EN-US e mapeamento bilíngue de ingredientes
├── services/      # Clientes HTTP (TheCocktailDB, MyMemory) e persistência tipada
├── state/         # Store reativo com AbortController, cache e debounce
├── styles/        # TailwindCSS v4 + tokens semânticos de tema editorial
├── types/         # Tipagens de domínio TypeScript (strict mode)
├── ui/            # Componentes modulares seguros contra XSS
└── utils/         # Normalização, parser/conversor de medidas, perfil sensorial, som
```

## Como Executar

```bash
npm install
npm run dev
```

### Scripts Disponíveis

- `npm run dev` — servidor de desenvolvimento (acessível na rede local para testar no celular via `--host`)
- `npm run typecheck` — verificação estrita do TypeScript (`tsc --noEmit`)
- `npm run build` — typecheck + build otimizado de produção em `dist/`
- `npm run preview` — pré-visualização local do build de produção
