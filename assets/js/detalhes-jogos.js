const botaoExcluir = document.querySelector("#botao-excluir");
const botaoEditar = document.querySelector("#botao-editar-jogo");
const formularioStatus = document.querySelector(".atualizar-status__form");
const selectStatus = document.querySelector("#novo-status");
const statusAtual = document.querySelector(".informacoes-jogo__status");
const campoCapa = document.querySelector("#capa");
const imagemCapa = document.querySelector(".capa__imagem");
const campoBusca = document.querySelector("#busca");
const notificacoes = document.querySelector(".topo__notificacoes");

const idJogo = "jogo-hades-ii";
const chaveDados = "gamesShelfDetalhes";

const statusDisponiveis = {
    "quero-jogar": "Quero jogar",
    "jogando": "Jogando",
    "concluido": "Concluído",
    "abandonado": "Abandonado"
};

function obterDados() {
    return JSON.parse(localStorage.getItem(chaveDados)) || {};
}

function salvarDados(alteracoes) {
    const dados = obterDados();

    dados[idJogo] = {
        ...dados[idJogo],
        ...alteracoes
    };

    localStorage.setItem(chaveDados, JSON.stringify(dados));
}

function formatarData() {
    return new Date().toLocaleDateString("pt-BR");
}

function carregarDados() {
    const dados = obterDados();
    const jogo = dados[idJogo];

    if (!jogo) {
        return;
    }

    if (jogo.status) {
        selectStatus.value = jogo.status;
        statusAtual.textContent = `[${statusDisponiveis[jogo.status]}]`;
    }

    if (jogo.capa) {
        imagemCapa.src = jogo.capa;
    }

    if (jogo.ultimaAlteracao) {
        const registros = document.querySelectorAll(".registro__valor strong");
        registros[1].textContent = jogo.ultimaAlteracao;
    }
}

formularioStatus.addEventListener("submit", function(event) {
    event.preventDefault();

    const novoStatus = selectStatus.value;

    if (!statusDisponiveis[novoStatus]) {
        alert("Selecione um status válido.");
        return;
    }

    const dataAtual = formatarData();

    statusAtual.textContent = `[${statusDisponiveis[novoStatus]}]`;

    const registros = document.querySelectorAll(".registro__valor strong");
    registros[1].textContent = dataAtual;

    salvarDados({
        status: novoStatus,
        ultimaAlteracao: dataAtual
    });

    alert("Status atualizado com sucesso!");
});

campoCapa.addEventListener("change", function() {
    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem válido.");
        this.value = "";
        return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
        alert("A imagem deve possuir no máximo 2 MB.");
        this.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function() {
        imagemCapa.src = leitor.result;

        salvarDados({
            capa: leitor.result
        });
    };

    leitor.readAsDataURL(arquivo);
});

botaoExcluir.addEventListener("click", function() {
    const confirmar = confirm("Deseja realmente excluir este jogo?");

    if (!confirmar) {
        return;
    }

    const jogosExcluidos = JSON.parse(
        localStorage.getItem("gamesShelfJogosExcluidos")
    ) || [];

    if (!jogosExcluidos.includes(idJogo)) {
        jogosExcluidos.push(idJogo);
    }

    localStorage.setItem(
        "gamesShelfJogosExcluidos",
        JSON.stringify(jogosExcluidos)
    );

    window.location.href = "catalogo.html";
});

botaoEditar.addEventListener("click", function() {
    window.location.href = `editar-jogo.html?id=${idJogo}`;
});

campoBusca.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        window.location.href = `catalogo.html?busca=${encodeURIComponent(this.value.trim())}`;
    }
});

notificacoes.addEventListener("click", function(event) {
    event.preventDefault();

    alert("Você não possui notificações novas.");
});

carregarDados();
