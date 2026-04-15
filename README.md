# 🛸 Rick & Morty Explorer

> Aplicação React de estudo que consome a [Rick and Morty API](https://rickandmortyapi.com/) e exibe o catálogo completo de personagens do multiverso — com filtros, scroll infinito e modal de detalhes.

![Rick and Morty Explorer](https://rickandmortyapi.com/api/character/avatar/1.jpeg)

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Demonstração](#-demonstração)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura-mvvc)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Funcionalidades](#-funcionalidades)
- [Como rodar](#-como-rodar)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Testes com Playwright](#-testes-com-playwright)
- [Decisões técnicas](#-decisões-técnicas)
- [Limitações da API](#-limitações-da-api)
- [Licença](#-licença)

---

## 📖 Sobre o projeto

Projeto de **estudo prático** de React com foco em:

- Arquitetura **MVVC** (Model → ViewModel → View) aplicada a hooks customizados
- **Paginação cursor-based** — diferente do offset tradicional, a API retorna a URL da próxima página diretamente
- **Scroll infinito** com `IntersectionObserver` via `react-intersection-observer`
- **TypeScript strict** do início ao fim — sem `any`, sem atalhos
- Componentes **totalmente desacoplados** via props tipadas
- `data-testid` em todos os elementos interativos para testes E2E com Playwright

Todo componente relevante contém **comentários didáticos** explicando o raciocínio por trás das decisões.

---

## 🖥️ Demonstração

| Listagem | Filtros | Modal de detalhes |
|----------|---------|-------------------|
| Grid responsivo 2→5 colunas | Status (Vivo/Morto/Desconhecido) + busca por nome | Ficha completa com habilidades e fraquezas |

---

## 🛠️ Tecnologias

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| UI | [React](https://react.dev/) | 18 |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) | 5 — strict mode |
| Bundler | [Vite](https://vitejs.dev/) | 5 |
| Estilização | [TailwindCSS](https://tailwindcss.com/) | 3 |
| Roteamento | [React Router](https://reactrouter.com/) | 6 |
| HTTP | [Axios](https://axios-http.com/) | 1.6 |
| Scroll infinito | [react-intersection-observer](https://www.npmjs.com/package/react-intersection-observer) | 9 |
| API | [Rick and Morty API](https://rickandmortyapi.com/documentation) | pública, sem auth |

---

## 🏗️ Arquitetura MVVC

O projeto segue o padrão **MVVC (Model-View-ViewModel)** adaptado para React:

```
Model       →  Serviços de API + tipos TypeScript + mock de dados local
ViewModel   →  Custom hooks (useCharacters, useCharacterDetail)
View        →  Componentes React puros (só renderização)
```

### Por que MVVC e não só "componentes com hooks"?

A separação formal força algumas disciplinas importantes:

- **Views** não fazem fetch direto — elas só consomem o que o ViewModel expõe
- **ViewModels** não sabem nada de CSS ou DOM — eles gerenciam estado e lógica
- **Models** não sabem que React existe — são funções puras de dados

Isso facilita trocar a API (ex: migrar para GraphQL) sem tocar em nenhum componente visual.

---

## 📁 Estrutura de pastas

```
rick-and-morty/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── src/
    ├── App.tsx                          # BrowserRouter + Routes + MainLayout
    ├── main.tsx                         # Bootstrap ReactDOM + StrictMode
    │
    ├── models/                          # ── CAMADA MODEL ──
    │   ├── types.ts                     # Interfaces TypeScript (API raw + domínio)
    │   ├── rickAndMortyApi.ts           # Axios + transformação raw → domínio
    │   └── abilities.json               # Mock local de habilidades/fraquezas
    │
    ├── viewmodels/                      # ── CAMADA VIEWMODEL ──
    │   ├── useCharacters.ts             # Estado, paginação cursor, filtro, scroll
    │   └── useCharacterDetail.ts        # Estado do modal + fetch por ID
    │
    ├── views/                           # ── CAMADA VIEW ──
    │   ├── components/
    │   │   ├── CharacterCard.tsx        # Card puro (props in, eventos out)
    │   │   ├── SearchBar.tsx            # Input controlado
    │   │   └── LoadingSpinner.tsx       # Portal animado de loading
    │   ├── pages/
    │   │   ├── HomePage.tsx             # Grid + filtros + sentinela de scroll
    │   │   └── CharacterModal.tsx       # Modal com focus trap + Escape handler
    │   └── layouts/
    │       └── MainLayout.tsx           # Header + footer
    │
    ├── utils/
    │   └── helpers.ts                   # Funções puras (truncate, normalize, etc.)
    │
    └── styles/
        └── globals.css                  # Tailwind + tokens CSS + scanlines CRT
```

---

## ✅ Funcionalidades

- [x] **826 personagens** carregados via scroll infinito (20 por página)
- [x] **Busca por nome** — filtro client-side com normalização de acentos
- [x] **Filtro por status** — Vivo / Morto / Desconhecido
- [x] **Barra de progresso** mostrando X de 826 personagens carregados
- [x] **Modal de detalhes** — ficha completa com status, espécie, origem, localização, episódios
- [x] **Habilidades e fraquezas** — mock local por ID (`abilities.json`)
- [x] **Scroll infinito** com `IntersectionObserver` e `rootMargin` de antecipação
- [x] **Tratamento de erros** — mensagens específicas por tipo de falha
- [x] **Loading states** — portal animado enquanto dados carregam
- [x] **Acessibilidade** — `role`, `aria-label`, `aria-live`, focus trap no modal, suporte a teclado
- [x] **Tema sci-fi** — Creepster + Space Mono, neon verde, scanlines CRT
- [x] `data-testid` em todos os elementos testáveis

---

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9+

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/rick-and-morty-explorer.git
cd rick-and-morty-explorer

# 2. Instale as dependências
npm install

# 3. Suba o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** — sem configuração de chave, sem `.env`, direto ao ponto.

> A Rick & Morty API é **100% pública e sem autenticação**. Nenhuma variável de ambiente é necessária para rodar o projeto.

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção (output em `/dist`) |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Roda ESLint |
| `npm run format` | Formata com Prettier |

---

## 🔐 Variáveis de ambiente

**Nenhuma.** Esse projeto não precisa de `.env`.

A Rick & Morty API não exige autenticação — sem API key, sem hash, sem token. Basta fazer GET e receber dados. Se você migrar para uma API autenticada no futuro, o ponto de entrada é `src/models/rickAndMortyApi.ts`.

---

## 🧪 Testes com Playwright

O projeto tem `data-testid` em todos os elementos interativos, prontos para testes E2E:

```bash
# Instalar o Playwright
npm init playwright@latest

# Rodar os testes
npx playwright test
```

### Seletores disponíveis

| Elemento | Seletor |
|----------|---------|
| Card de personagem | `[data-testid="character-card"]` |
| Card específico | `[data-testid-specific="character-card-1"]` |
| Input de busca | `[data-testid="search-input"]` |
| Botão limpar busca | `[data-testid="search-button"]` |
| Modal de detalhes | `[data-testid="character-modal"]` |
| Indicador de loading | `[data-testid="loading-indicator"]` |
| Mensagem de erro | `[data-testid="error-message"]` |

### Exemplo de teste

```typescript
import { test, expect } from '@playwright/test'

test('deve abrir modal ao clicar em um card', async ({ page }) => {
  await page.goto('http://localhost:5173')

  // Espera o primeiro card aparecer
  await page.waitForSelector('[data-testid="character-card"]')

  // Clica no primeiro card
  await page.locator('[data-testid="character-card"]').first().click()

  // Modal deve estar visível
  await expect(page.locator('[data-testid="character-modal"]')).toBeVisible()
})

test('deve filtrar personagens por nome', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.waitForSelector('[data-testid="character-card"]')

  await page.fill('[data-testid="search-input"]', 'Rick')

  const cards = page.locator('[data-testid="character-card"]')
  await expect(cards).not.toHaveCount(0)
})
```

---

## 🧠 Decisões técnicas

### Paginação cursor-based vs offset

A Rick & Morty API usa **cursor-based pagination**: em vez de `?offset=20&limit=20`, ela retorna `info.next` com a URL completa da próxima página.

```typescript
// offset-based (ex: Marvel API)
offsetRef.current = offset + characters.length

// cursor-based (Rick & Morty API)
nextPageUrlRef.current = nextPageUrl // string | null
```

Cursor-based é mais eficiente porque o servidor não precisa contar registros anteriores a cada requisição. A desvantagem é que você não pode "pular" para uma página arbitrária — só seguir a fila.

### Por que `useRef` para o cursor de paginação?

O `nextPageUrlRef` é um `ref` e não um `state` porque mudar o cursor **não deve causar re-render**. Ele é um dado interno de controle, não um dado visual. O re-render acontece quando o array de personagens muda — o cursor é só um ponteiro.

### Por que `useMemo` para o filtro?

Sem `useMemo`, a filtragem por nome rodaria a cada render do componente — incluindo renders causados por hover, animações e eventos que nada têm a ver com a lista. Com `useMemo`, o filtro só recalcula quando `allCharacters` ou `searchQuery` mudam de verdade.

### Mock de habilidades (`abilities.json`)

A API não retorna habilidades ou fraquezas. O arquivo `src/models/abilities.json` simula esse dado por ID de personagem. Em produção, isso viria de uma API complementar, um CMS ou uma tabela de banco de dados. IDs não mapeados recebem fallback `"Habilidades desconhecidas"`.

---

## ⚠️ Limitações da API

| Campo | Disponível na API? | Solução no projeto |
|-------|-------------------|-------------------|
| Descrição do personagem | ❌ | — |
| Habilidades / fraquezas | ❌ | Mock local `abilities.json` |
| Nome do episódio | Fetch separado | Exibimos só o número (`EP 28`) |
| Áudio / trilha sonora | ❌ | Propriedade Adult Swim |
| Busca server-side | ✅ `?name=` | Usamos filtro client-side (já temos os dados) |

> **Rate limit:** 10.000 requests por IP por dia. Para uso normal de desenvolvimento, isso é praticamente ilimitado.

---

## 📚 Referências

- [Rick and Morty API — Documentação oficial](https://rickandmortyapi.com/documentation)
- [React Docs — Hooks](https://react.dev/reference/react/hooks)
- [Intersection Observer API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Vite — Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TailwindCSS — Configuration](https://tailwindcss.com/docs/configuration)
- [React Router v6 — Concepts](https://reactrouter.com/en/main/start/concepts)

---

## 📄 Licença

Este projeto é **open source** para fins de estudo.  
Os dados e imagens dos personagens pertencem à **Adult Swim / Warner Bros. Discovery**.  
A API é mantida por [Axel Fuhrmann](https://github.com/afuh/rick-and-morty-api).
