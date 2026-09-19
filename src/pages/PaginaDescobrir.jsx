import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { buscarTitulos, buscarPorNome, GENEROS, TIPOS, HUMORES, TEMPOS } from "../components/tmdb"
import { lerMinhaLista, salvarMinhaLista, alternarItem } from "../components/minhaLista"
import GradeTitulos from "../components/GradeTitulos"

const PaginaDescobrir = () => {

    const [termo, setTermo] = useState("")
    const [tipo, setTipo] = useState("movie")
    const [humorId, setHumorId] = useState(HUMORES[0].id)
    const [tempoId, setTempoId] = useState(TEMPOS[2].id)
    const [generosExtras, setGenerosExtras] = useState([])

    const [filtros, setFiltros] = useState(null)

    const [resultados, setResultados] = useState([])
    const [situacao, setSituacao] = useState("parado")
    const [mensagemErro, setMensagemErro] = useState("")

    const [minhaLista, setMinhaLista] = useState(lerMinhaLista())

    const alternarGenero = (id) => {
        if (generosExtras.includes(id)) {
            setGenerosExtras(generosExtras.filter((generoId) => generoId !== id))
        } else {
            setGenerosExtras([...generosExtras, id])
        }
    }

    const aoEnviarFormulario = (evento) => {
        evento.preventDefault()

        const humor = HUMORES.find((item) => item.id === humorId)
        const tempo = TEMPOS.find((item) => item.id === tempoId)

        const generos = [...humor.generos]
        for (let i = 0; i < generosExtras.length; i++) {
            if (!generos.includes(generosExtras[i])) {
                generos.push(generosExtras[i])
            }
        }

        setSituacao("carregando")
        setMensagemErro("")
        setFiltros({
            tipo: tipo,
            termo: termo.trim(),
            generos: generos,
            duracaoMaxima: tempo.duracaoMaxima
        })
    }

    useEffect(() => {
        if (!filtros) {
            return
        }

        let busca
        if (filtros.termo) {
            busca = buscarPorNome(filtros.tipo, filtros.termo)
        } else {
            busca = buscarTitulos(filtros.tipo, filtros.generos, filtros.duracaoMaxima)
        }

        busca
            .then((dados) => {
                setResultados(dados.results)
                setSituacao("pronto")
            })
            .catch((erro) => {
                setMensagemErro(erro.message)
                setSituacao("erro")
            })
    }, [filtros])

    const aoSalvar = (titulo, tipoDoTitulo) => {
        const atualizada = alternarItem(minhaLista, titulo, tipoDoTitulo)
        setMinhaLista(atualizada)
        salvarMinhaLista(atualizada)
    }

    const classeDoBotao = (ativo, pequeno) => {
        let classe = "pill"
        if (pequeno) {
            classe = classe + " pill-small"
        }
        if (ativo) {
            classe = classe + " pill-active"
        }
        return classe
    }

    const humorEscolhido = HUMORES.find((item) => item.id === humorId)

    let resumo = humorEscolhido.nome
    if (termo.trim()) {
        resumo = "Buscando por nome"
    }

    let mensagemVazia = "Nenhum título encontrado com esses filtros. Tente remover algum gênero extra."
    if (filtros && filtros.termo) {
        mensagemVazia = "Nenhum título encontrado com esse nome. Confira a escrita ou tente outro termo."
    }

    return (
        <div className="discover">
            <div className="page-header">
                <h1>Descobrir</h1>
                <p>Ajuste os filtros abaixo e encontre algo que caiba no seu momento agora.</p>
            </div>

            <form className="filters-form" onSubmit={aoEnviarFormulario}>
                <div className="filtros-topo">
                    <span>Filtros</span>
                    <span className="filtros-resumo">{resumo}</span>
                </div>

                <div className="filtros-busca">
                    <label className="busca-rotulo" htmlFor="busca-nome">
                        Já sabe o que quer assistir?
                    </label>
                    <input
                        id="busca-nome"
                        type="text"
                        className="campo-texto"
                        placeholder="Buscar pelo nome do filme ou da série"
                        value={termo}
                        onChange={(evento) => setTermo(evento.target.value)}
                    />
                    <p className="campo-aviso">
                        Preenchendo aqui, a busca usa o nome e ignora os filtros abaixo.
                    </p>
                </div>

                <fieldset className="filter-field">
                    <legend>O que assistir</legend>
                    <div className="pill-group">
                        {TIPOS.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                className={classeDoBotao(tipo === item.id, false)}
                                onClick={() => setTipo(item.id)}
                            >
                                {item.nome}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="filter-field">
                    <legend>Tempo livre</legend>
                    <div className="pill-group">
                        {TEMPOS.map((tempo) => (
                            <button
                                type="button"
                                key={tempo.id}
                                className={classeDoBotao(tempoId === tempo.id, false)}
                                onClick={() => setTempoId(tempo.id)}
                                disabled={tipo === "tv" && tempo.duracaoMaxima !== null}
                                title={tipo === "tv" ? "Filtro de duração disponível apenas para filmes" : ""}
                            >
                                {tempo.nome}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="filter-field filter-field-largo">
                    <legend>Humor</legend>
                    <div className="pill-group">
                        {HUMORES.map((humor) => (
                            <button
                                type="button"
                                key={humor.id}
                                className={classeDoBotao(humorId === humor.id, false)}
                                onClick={() => setHumorId(humor.id)}
                            >
                                {humor.nome}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="filter-field filter-field-largo">
                    <legend>Gênero (opcional)</legend>
                    <div className="pill-group">
                        {GENEROS.map((genero) => (
                            <button
                                type="button"
                                key={genero.id}
                                className={classeDoBotao(generosExtras.includes(genero.id), true)}
                                onClick={() => alternarGenero(genero.id)}
                            >
                                {genero.nome}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <div className="filtros-rodape">
                    <button type="submit" className="botao-seta" aria-label="Buscar sugestões">
                        <span className="botao-rotulo">
                            <span>Buscar</span>
                            <span aria-hidden="true">Buscar</span>
                        </span>

                        <span className="botao-icone" aria-hidden="true">
                            <ArrowRight size={16} />
                            <ArrowRight size={16} />
                        </span>
                    </button>
                </div>
            </form>

            <section className="results">
                {situacao === "carregando" && <p className="status-message">Buscando sugestões...</p>}

                {situacao === "erro" && (
                    <p className="status-message status-error">
                        Não deu para buscar agora ({mensagemErro}). Tente novamente em instantes.
                    </p>
                )}

                {situacao === "pronto" && resultados.length === 0 && (
                    <p className="status-message">{mensagemVazia}</p>
                )}

                {situacao === "pronto" && resultados.length > 0 && (
                    <GradeTitulos
                        titulos={resultados}
                        tipo={filtros.tipo}
                        minhaLista={minhaLista}
                        aoSalvar={aoSalvar}
                    />
                )}
            </section>
        </div>
    )
}

export default PaginaDescobrir
