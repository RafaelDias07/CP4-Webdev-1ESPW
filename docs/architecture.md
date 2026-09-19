# Architecture — WatchNext

## 1. Visão Geral

A aplicação é uma SPA em React (via Vite), organizada em páginas
(uma por rota, em `pages/`) que usam componentes reutilizáveis
(em `components/`) para exibir listas e cartões de título. Dentro de
`components/`, o arquivo `tmdb.js` concentra toda a lógica de acesso à
API do TMDB (não é um componente visual, mas um módulo de apoio usado
pelos componentes e páginas), e `minhaLista.js` concentra as funções de
leitura e escrita da lista pessoal no `localStorage`. Cada página que
precisa da lista a carrega com `useState` ao montar e regrava quando a
pessoa salva ou remove um título — assim não precisamos de estado global.

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── Cabecalho.jsx       # cabeçalho com a navegação entre as páginas
│   ├── Rodape.jsx          # rodapé do site
│   ├── RolarParaTopo.jsx   # volta a página ao topo a cada troca de rota
│   ├── FundoAnimado.jsx    # manchas de cor e malha animadas ao fundo
│   ├── ParedeDePosteres.jsx # abertura da home com os títulos em alta
│   ├── FilaDePosteres.jsx  # uma fila de pôsteres em movimento
│   ├── SecaoDestaque.jsx   # banner da página inicial (recebe textos por props)
│   ├── ComoFunciona.jsx    # os três passos explicativos da página inicial
│   ├── CardTitulo.jsx      # cartão de um título (pôster, nome, nota, botão salvar)
│   ├── GradeTitulos.jsx    # grade que renderiza vários CardTitulo a partir de uma lista
│   ├── tmdb.js             # única camada de acesso à API (fetch, URLs, mapeamentos)
│   └── minhaLista.js       # funções de leitura/escrita da lista pessoal no localStorage
├── pages/
│   ├── PaginaInicio.jsx
│   ├── PaginaDescobrir.jsx       # formulário de filtros + busca na API
│   ├── PaginaDetalhes.jsx        # rota dinâmica com detalhe de um título
│   ├── PaginaMinhaLista.jsx
│   └── PaginaNaoEncontrada.jsx
├── App.jsx      # layout do site (Cabecalho + <Outlet /> + Rodape)
├── App.css      # estilos de todos os componentes e páginas
├── main.jsx     # definição das rotas com createBrowserRouter
└── index.css    # variáveis de cor, fontes e estilos base
```

`tmdb.js` e `minhaLista.js` ficam dentro de `components/` (em vez de
pastas próprias como `data/` ou `services/`) para manter a estrutura de
pastas usada em aula, restrita a `components/` e `pages/` dentro de `src/`.

Seguindo o padrão usado em aula, o CSS não é dividido por componente: as
variáveis e os estilos base ficam em `index.css` e todas as classes dos
componentes e páginas ficam em `App.css`.

## 3. Páginas e Rotas

As rotas são declaradas em `main.jsx` com `createBrowserRouter` e
entregues à aplicação pelo `RouterProvider`. `App` é a rota pai (o
layout) e as demais são rotas filhas, renderizadas dentro do `<Outlet />`.

| Página | Rota | Objetivo |
|---|---|---|
| PaginaInicio | `/` | Apresentar o produto e levar à página de descoberta |
| PaginaDescobrir | `/descobrir` | Formulário de filtros (humor, tempo, gênero) e resultados da busca — core do MVP |
| PaginaDetalhes | `/titulo/:tipo/:id` | Detalhe de um filme ou série específico |
| PaginaMinhaLista | `/minha-lista` | Lista de títulos salvos pela pessoa |
| PaginaNaoEncontrada | `errorElement` | Página 404 para qualquer rota não mapeada |

`tipo` existe como parâmetro (e não só `:id`) porque a TMDB usa endpoints
diferentes para filmes (`/movie/{id}`) e séries (`/tv/{id}`), e os IDs não
são únicos entre os dois.

## 4. Componentes

| Componente | Responsabilidade | Props |
|---|---|---|
| `App` | Layout do site: cabeçalho, área de conteúdo com `<Outlet />` e rodapé | — |
| `Cabecalho` | Navegação entre as páginas, destacando a página ativa | — |
| `Rodape` | Rodapé com o crédito da API | — |
| `RolarParaTopo` | Não desenha nada: volta a rolagem ao topo sempre que a rota muda | — |
| `FundoAnimado` | Manchas de cor e malha de linhas animadas atrás de todo o site | — |
| `ParedeDePosteres` | Abertura da home: divide os títulos em duas filas | `titulos` |
| `FilaDePosteres` | Uma fila de pôsteres correndo na horizontal | `titulos`, `invertida` |
| `SecaoDestaque` | Banner da página inicial: linha de meta, manchete e saída | `meta`, `indice`, `linha1`, `linha2`, `texto`, `textoBotao`, `linkBotao` |
| `ComoFunciona` | Os três passos que explicam a mecânica do produto | — |
| `CardTitulo` | Exibir um único título (pôster, nome, ano, nota) e avisar o pai quando o botão de salvar é clicado | `titulo`, `tipo`, `salvo`, `aoSalvar` |
| `GradeTitulos` | Renderizar uma grade de `CardTitulo` a partir de uma lista de títulos | `titulos`, `tipo`, `minhaLista`, `aoSalvar` |

## 5. Estado da Aplicação

| Estado | Onde é controlado? | Por quê? |
|---|---|---|
| `termo` | `PaginaDescobrir` (useState) | Texto da busca por nome, oferecida como barra de busca no topo do painel para quem já sabe o que quer. Quando está preenchido, a busca usa o endpoint `/search` da TMDB e os filtros são ignorados |
| `tipo`, `humorId`, `tempoId`, `generosExtras` | `PaginaDescobrir` (useState) | Valores do formulário antes de a pessoa aplicar a busca; o humor escolhido também aparece na faixa de cabeçalho do painel de filtros |
| `filtros` | `PaginaDescobrir` (useState) | Guarda os filtros efetivamente enviados; mudar esse valor é o gatilho do `useEffect` de busca |
| `resultados`, `situacao`, `mensagemErro` | `PaginaDescobrir` (useState) | Resultado da busca e seu ciclo de vida (carregando/pronto/erro) |
| `titulo`, `situacao` | `PaginaDetalhes` (useState) | Dado carregado da API e ciclo de vida da chamada de detalhe |
| `minhaLista` | Cada página que precisa dela (useState) | A lista fica guardada no `localStorage` por `minhaLista.js`; cada página lê a lista ao montar e regrava quando a pessoa salva ou remove um título |

## 6. useEffect

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Busca de sugestões | Sempre que `filtros` muda, em `PaginaDescobrir` | Chama `buscarPorNome()` se houver um nome digitado, ou `buscarTitulos()` caso contrário, e atualiza `resultados`/`situacao` |
| Busca de detalhe | Sempre que `tipo` ou `id` mudam, em `PaginaDetalhes` | Chama `buscarDetalhes()` na API do TMDB e atualiza `titulo`/`situacao` |
| Títulos em alta | Uma vez, quando `PaginaInicio` abre | Chama `buscarEmAlta()` na API do TMDB e alimenta a parede de pôsteres |
| Rolagem ao topo | Sempre que o caminho da rota muda, em `RolarParaTopo` | Chama `window.scrollTo(0, 0)`. Numa SPA a página não recarrega ao navegar, então sem isso a nova tela abriria na mesma altura de rolagem da anterior |

## 7. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| `react-router` | Rotas com layout aninhado (`App` + `Outlet`) e rota dinâmica (`:tipo/:id`) | Requisito técnico do projeto (React Router com múltiplas páginas e rotas dinâmicas) |
| `lucide-react` | Ícones usados na navegação, botões e cartões (ex.: `Bookmark`, `Star`, `Clock`) | Requisito técnico do projeto (biblioteca de ícones) |
| TMDB API (`fetch` nativo) | Busca de filmes/séries e detalhe de título | API pública do domínio escolhido (filmes/séries), conforme sugerido no enunciado |
