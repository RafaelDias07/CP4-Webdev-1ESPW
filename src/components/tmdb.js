const URL_BASE = "https://api.themoviedb.org/3"
const CHAVE_API = import.meta.env.VITE_TMDB_API_KEY

export const HUMORES = [
    { id: "leve", nome: "Leve e divertido", generos: [35, 10751] },
    { id: "tenso", nome: "Tenso e adrenalina", generos: [53, 28] },
    { id: "emocionante", nome: "Emocionante", generos: [18] },
    { id: "misterio", nome: "Mistério", generos: [9648, 80] },
    { id: "fantasia", nome: "Fantasia e aventura", generos: [14, 12] }
]

export const TEMPOS = [
    { id: "curto", nome: "Até 100 min", duracaoMaxima: 100 },
    { id: "medio", nome: "Até 130 min", duracaoMaxima: 130 },
    { id: "livre", nome: "Sem limite", duracaoMaxima: null }
]

export const TIPOS = [
    { id: "movie", nome: "Filmes" },
    { id: "tv", nome: "Séries" }
]

export const GENEROS = [
    { id: 28, nome: "Ação" },
    { id: 12, nome: "Aventura" },
    { id: 16, nome: "Animação" },
    { id: 35, nome: "Comédia" },
    { id: 80, nome: "Crime" },
    { id: 18, nome: "Drama" },
    { id: 14, nome: "Fantasia" },
    { id: 27, nome: "Terror" },
    { id: 9648, nome: "Mistério" },
    { id: 10749, nome: "Romance" },
    { id: 878, nome: "Ficção científica" },
    { id: 53, nome: "Thriller" }
]

const montarUrl = (caminho, parametros) => {
    const url = new URL(URL_BASE + caminho)
    url.searchParams.set("api_key", CHAVE_API)
    url.searchParams.set("language", "pt-BR")

    const chaves = Object.keys(parametros)
    for (let i = 0; i < chaves.length; i++) {
        const chave = chaves[i]
        const valor = parametros[chave]
        if (valor !== null && valor !== undefined && valor !== "") {
            url.searchParams.set(chave, valor)
        }
    }

    return url.toString()
}

const buscar = (caminho, parametros) => {
    return fetch(montarUrl(caminho, parametros)).then((resposta) => {
        if (!resposta.ok) {
            throw new Error("Erro na API do TMDB (" + resposta.status + ")")
        }
        return resposta.json()
    })
}

export const buscarTitulos = (tipo, generos, duracaoMaxima) => {
    const parametros = {
        sort_by: "popularity.desc",
        "vote_count.gte": 100
    }

    if (generos.length > 0) {
        parametros.with_genres = generos.join(",")
    }

    if (tipo === "movie" && duracaoMaxima) {
        parametros["with_runtime.lte"] = duracaoMaxima
    }

    return buscar("/discover/" + tipo, parametros)
}

export const buscarPorNome = (tipo, termo) => {
    return buscar("/search/" + tipo, { query: termo })
}

export const buscarEmAlta = () => {
    return buscar("/trending/all/week", {})
}

export const buscarDetalhes = (tipo, id) => {
    return buscar("/" + tipo + "/" + id, {
        append_to_response: "videos,credits,watch/providers"
    })
}

export const urlImagem = (caminho, tamanho) => {
    if (!caminho) {
        return null
    }
    return "https://image.tmdb.org/t/p/" + tamanho + caminho
}
