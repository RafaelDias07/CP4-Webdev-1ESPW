# WatchNext

MVP de plataforma web para descobrir o que assistir, feito como avaliação
(CP1 — 2º trimestre — WebDev) inspirado no vácuo deixado pelo
encerramento do TV Time.

**Site publicado:** https://cp-4-webdev-1-espw-lime.vercel.app

**Repositório:** https://github.com/RafaelDias07/CP4-Webdev-1ESPW

## Integrantes do grupo

- Luca Baccari Dos Santos — RM 569807
- Rafael Dias Fontes — RM 570504
- Gustavo Pereira Inoue — RM 570549

## Problema

Com o fim do TV Time, ficou um vazio na forma como pessoas descobriam o
que assistir. Além disso, catálogos de streaming são grandes demais para
navegar rapidamente: a pessoa sabe que quer assistir algo, mas não sabe
exatamente o quê, e acaba gastando mais tempo escolhendo do que
assistindo.

## Solução

O WatchNext resolve especificamente o problema de **"descobrir o que
assistir"**. Em vez de mostrar um catálogo genérico, a pessoa escolhe:

- tipo de conteúdo (filme ou série),
- o **humor** do momento (leve, tenso, emocionante, mistério, fantasia),
- o **tempo disponível** (para filmes, filtra por duração máxima),
- opcionalmente, gêneros extras específicos,

e recebe uma lista curta e relevante de sugestões, com a opção de salvar
qualquer título em uma lista pessoal para assistir depois.

## Tecnologias

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) (build tool)
- [React Router](https://reactrouter.com/) — rotas com layout aninhado
  e rota dinâmica
- [lucide-react](https://lucide.dev/) — biblioteca de ícones
- CSS puro (sem framework de UI), com as variáveis em `src/index.css` e
  as classes em `src/App.css`
- `localStorage` para persistir a lista pessoal

## API usada

[TMDB — The Movie Database](https://www.themoviedb.org/documentation/api)
(v3), usando os endpoints:

- `GET /discover/movie` e `GET /discover/tv` — busca filtrada por gênero
  e duração
- `GET /movie/{id}` e `GET /tv/{id}` — detalhe de um título, incluindo
  vídeos, créditos e provedores de streaming (`append_to_response`)

## Funcionalidades

- **Descobrir** (`/descobrir`): formulário de filtros (tipo, humor,
  tempo, gêneros) que busca sugestões reais na TMDB. Para quem já sabe o
  que quer, há também uma busca direta pelo nome do filme ou da série.
- **Detalhe do título** (`/titulo/:tipo/:id`): sinopse, gêneros,
  duração, nota e onde assistir (quando disponível na API).
- **Minha lista** (`/minha-lista`): títulos salvos, persistidos entre
  sessões via `localStorage`.
- Estados de carregamento, erro e lista vazia tratados em toda a
  aplicação.
- Layout responsivo (funciona em celular).

## Uso de IA

Usamos IA (Claude, da Anthropic) como apoio ao longo de todo o processo,
seguindo a metodologia de Spec Driven Development pedida no enunciado.
Abaixo está exatamente onde ela entrou e onde não entrou.

### Onde usamos

- Na estruturação da spec (`docs/requirements.md` e
  `docs/architecture.md`), a partir das decisões de produto que já
  tínhamos tomado: qual problema resolver, a mecânica de filtrar por
  humor e tempo, e o nome do produto.
- No refinamento do design e do acabamento visual da interface, depois
  de escolhermos as referências que queríamos seguir.
- Na responsividade: ajustar os pontos de quebra para o layout funcionar
  em celular, tablet e desktop.
- Como apoio para entender recursos de CSS que não conhecíamos.

### O que decidimos sozinhos

As decisões de produto, de negócio e de estética foram nossas, e vieram
antes de qualquer código: qual problema atacar, como o filtro de humor
deveria funcionar, a paleta, o nome e as referências visuais que
escolhemos. Revisamos tudo o que entregamos e conseguimos explicar cada
parte do código.

### Recursos que foram além do que vimos em aula

Escolhemos usar alguns recursos de CSS que não foram dados em aula,
porque queríamos que a página tivesse um acabamento visual mais próximo
dos sites que usamos como referência (ver `docs/references/references.md`)
e porque achamos que valia a pena apresentar algo mais bem resolvido. São
eles:

| Recurso | Para que usamos |
|---|---|
| `animation-timeline: view()` | Fazer os blocos aparecerem conforme a pessoa rola a página, sem usar JavaScript |
| `:has()` | O "holofote" na grade de resultados: ao passar o mouse em um pôster, os outros escurecem |
| `@property` | Animar o facho de luz que atravessa o fio fino abaixo do cabeçalho da home |
| `mask-image` | Fazer a parede de pôsteres e a malha do fundo sumirem suavemente nas bordas |
| `counter()` | Gerar a numeração 01–04 dos filtros e 01–03 dos passos direto pelo CSS |
| `-webkit-text-stroke` | As linhas de título vazadas, em que só o contorno das letras aparece |
| `feTurbulence` (SVG) | A textura de grão por cima de toda a página |

Nenhum deles é obrigatório para o projeto funcionar: são todos
acabamento visual. Pesquisamos cada um na documentação e testamos até
entender como funcionam, para termos contexto do que estávamos usando e
conseguirmos aplicar em outros projetos.

## Instruções de execução

### Pré-requisitos

- Node.js 18+ instalado
- Uma chave de API gratuita da TMDB: crie uma conta em
  https://www.themoviedb.org/ e gere a chave em **Configurações → API**

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/RafaelDias07/CP4-Webdev-1ESPW.git
cd CP4-Webdev-1ESPW

# 2. Instalar dependências
npm install

# 3. Configurar a variável de ambiente
cp .env.example .env.local
# edite .env.local e cole sua chave da TMDB em VITE_TMDB_API_KEY

# 4. Rodar em modo desenvolvimento
npm run dev
# abra http://localhost:5173

# 5. Gerar build de produção (opcional, local)
npm run build
```
