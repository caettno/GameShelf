
const formulario = document.querySelector("#formulario-jogo");
const titulo = document.querySelector("#titulo");
const nota = document.querySelector("#nota");
const categoria = document.querySelector("#categoria");
const avaliacao = document.querySelector("#avaliacao");
const capa = document.querySelector("#capa");
const imagemCapa = document.querySelector(".capa-atual__imagem");
const radiosStatus = document.querySelectorAll('input[name="status"]');

const parametros = new URLSearchParams(window.location.search);
const idJogo = parametros.get("id");

const jogos = JSON.parse(localStorage.getItem("jogos")) || [];

let imagemAtual = imagemCapa.src;

const categorias = {
    "acao-roguelike": {
        categoria: "acao",
        generos: ["Ação", "Roguelike"]
    },
    aventura: {
        categoria: "aventura",
        generos: ["Aventura"]
    },
    metroidvania: {
        categoria: "metroidvania",
        generos: ["Metroidvania"]
    },
    plataforma: {
        categoria: "plataforma",
        generos: ["Plataforma"]
    },
    rpg: {
        categoria: "rpg",
        generos: ["RPG"]
    }
};

const jogoExistente = jogos.find(jogo => String(jogo.id) === idJogo);

if (jogoExistente) {
    titulo.value = jogoExistente.titulo;
    nota.value = jogoExistente.nota ?? "";
    avaliacao.value = jogoExistente.descricao || "";

    const categoriaSelecionada = Object.keys(categorias).find(
        chave => categorias[chave].categoria === jogoExistente.categoria
    );

    categoria.value = categoriaSelecionada || "";

    radiosStatus.forEach(radio => {
        radio.checked = radio.value === jogoExistente.status;
    });

    if (jogoExistente.capa) {
        imagemAtual = jogoExistente.capa;
        imagemCapa.src = imagemAtual;
    }
}

capa.addEventListener("change", function () {
    const arquivo = capa.files[0];

    if (!arquivo) return;

    if (!["image/jpeg", "image/png"].includes(arquivo.type)) {
        alert("Selecione uma imagem JPG ou PNG.");
        capa.value = "";
        return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2 MB.");
        capa.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function () {
        imagemAtual = leitor.result;
        imagemCapa.src = imagemAtual;
    };

    leitor.readAsDataURL(arquivo);
});

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const statusSelecionado = document.querySelector('input[name="status"]:checked');

    if (!statusSelecionado) {
        alert("Selecione o status da jogatina.");
        return;
    }

    const dadosCategoria = categorias[categoria.value];

    const novoJogo = {
        id: jogoExistente ? jogoExistente.id : Date.now(),
        titulo: titulo.value.trim(),
        capa: imagemAtual,
        generos: dadosCategoria.generos,
        categoria: dadosCategoria.categoria,
        status: statusSelecionado.value,
        nota: Number(nota.value),
        descricao: avaliacao.value.trim()
    };

    const indice = jogos.findIndex(
        jogo => String(jogo.id) === String(novoJogo.id)
    );

    if (indice !== -1) {
        jogos[indice] = novoJogo;
    } else {
        jogos.push(novoJogo);
    }

    localStorage.setItem("jogos", JSON.stringify(jogos));

    alert("Jogo salvo com sucesso!");

    window.location.href = "catalogo.html";
});

const campoBusca = document.querySelector("#busca");

campoBusca.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" && campoBusca.value.trim() !== "") {
        window.location.href = "catalogo.html?busca=" + encodeURIComponent(campoBusca.value.trim());
    }
});
