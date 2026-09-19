import { urlImagem } from "./tmdb"

const FilaDePosteres = ({ titulos, invertida }) => {

    let classe = "fila"
    if (invertida) {
        classe = "fila fila-invertida"
    }

    return (
        <div className={classe}>
            <div className="fila-conteudo">
                {titulos.map((titulo) => (
                    <img
                        key={titulo.id}
                        className="fila-poster"
                        src={urlImagem(titulo.poster_path, "w342")}
                        alt=""
                    />
                ))}
            </div>

            <div className="fila-conteudo">
                {titulos.map((titulo) => (
                    <img
                        key={titulo.id}
                        className="fila-poster"
                        src={urlImagem(titulo.poster_path, "w342")}
                        alt=""
                    />
                ))}
            </div>
        </div>
    )
}

export default FilaDePosteres
