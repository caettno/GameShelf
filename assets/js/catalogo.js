const POR_PAGINA = 6;

const nomeStatus = {
  "quero-jogar": "Quero jogar",
  concluido: "Concluído",
  jogando: "Jogando",
  abandonado: "Abandonado"
};

const nomeCategoria = {
  acao: "Ação",
  rpg: "RPG",
  aventura: "Aventura",
  plataforma: "Plataforma",
  metroidvania: "Metroidvania"
};

const jogosIniciais = [
  { id: 6, titulo: "Hades II", capa: "../assets/imgs/Hades.jpg", generos: ["Ação", "Roguelike"], categoria: "acao", status: "jogando", nota: 9.2, descricao: "Combate rápido e uma progressão que sempre convida a mais uma tentativa." },
  { id: 5, titulo: "Baldur's Gate 3", capa: "../assets/imgs/Baldurs.jpg", generos: ["RPG", "Estratégia"], categoria: "rpg", status: "concluido", nota: 9.8, descricao: "Narrativa profunda, escolhas marcantes e personagens memoráveis." },
  { id: 4, titulo: "Hollow Knight", capa: "../assets/imgs/Hollow.jpg", generos: ["Metroidvania"], categoria: "metroidvania", status: "quero-jogar", nota: null, descricao: "Adicionado à lista pela exploração e direção de arte." },
  { id: 3, titulo: "Starfield", capa: "../assets/imgs/Star.jpg", generos: ["RPG", "Ficção científica"], categoria: "rpg", status: "abandonado", nota: 6.4, descricao: "A exploração não sustentou meu interesse após as primeiras horas." },
  { id: 2, titulo: "Celeste", capa: "../assets/imgs/Celeste.jpg", generos: ["Plataforma", "Indie"], categoria: "plataforma", status: "concluido", nota: 9.0, descricao: "Desafio preciso com uma história sensível e muito bem construída." },
  { id: 1, titulo: "Dave the Diver", capa: "../assets/imgs/Dave.jpg", generos: ["Aventura", "Simulação"], categoria: "aventura", status: "jogando", nota: 8.5, descricao: "Um ciclo relaxante entre exploração, pesca e administração." }
];

const campoBusca = document.getElementById("busca");
const campoBuscaGlobal = document.getElementById("busca-global");
const selCategoria = document.getElementById("categoria");
const selStatus = document.getElementById("status");
const selOrdem = document.getElementById("ordem");

const formFiltros = document.querySelector(".filtros__form");
const listaJogos = document.querySelector(".lista-jogos");
const resumoTotal = document.querySelector(".resumo__total");
const resumoFiltros = document.querySelector(".resumo__filtros");
const descricao = document.querySelector(".cabecalho-pagina__descricao");
const paginacao = document.querySelector(".paginacao");

function lerJogos() {
  const salvos = localStorage.getItem("jogos");

  if (salvos === null) {
    localStorage.setItem("jogos", JSON.stringify(jogosIniciais));
    return jogosIniciais;
  }
  return JSON.parse(salvos) || [];
}

const jogos = lerJogos();
let paginaAtual = 1;


function escapar(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function formatarNota(nota) {
  return nota.toFixed(1).replace(".", ",");
}

function comparar(ordem) {
  if (ordem === "maior-nota") return (a, b) => (b.nota ?? -1) - (a.nota ?? -1);
  if (ordem === "titulo") return (a, b) => a.titulo.localeCompare(b.titulo, "pt-BR");
  return (a, b) => b.id - a.id;   
}

function filtrarJogos() {
  const termo = normalizar(campoBusca.value.trim());

  return jogos
    .filter(j => !termo || normalizar(j.titulo).includes(termo))
    .filter(j => !selCategoria.value || j.categoria === selCategoria.value)
    .filter(j => !selStatus.value || j.status === selStatus.value)
    .sort(comparar(selOrdem.value));
}

function criarCartao(j) {
  const status = nomeStatus[j.status] || j.status;
  const statusTexto = j.nota != null ? `${status} - ${formatarNota(j.nota)}` : status;

  return `
    <article class="cartao-jogo">
      <img class="cartao-jogo__capa" src="${escapar(j.capa)}" alt="Capa de ${escapar(j.titulo)}" width="150">
      <h2 class="cartao-jogo__titulo">${escapar(j.titulo)}</h2>
      <p class="cartao-jogo__generos"><small>${escapar((j.generos || []).join(" - "))}</small></p>
      <p class="cartao-jogo__status">${escapar(statusTexto)}</p>
      <p class="cartao-jogo__descricao">${escapar(j.descricao)}</p>
      <p class="cartao-jogo__acoes">
        <a class="link" href="detalhes-jogo.html?id=${encodeURIComponent(j.id)}">Ver detalhes →</a>
        <span class="cartao-jogo__separador"></span>
        <a class="cartao-jogo__menu" href="#" aria-label="Mais opções">⋮</a>
      </p>
    </article>
  `;
}

function mostrarFiltros() {
  const partes = [];

  if (campoBusca.value.trim()) partes.push(`"${campoBusca.value.trim()}"`);
  if (selCategoria.value) partes.push(nomeCategoria[selCategoria.value]);
  if (selStatus.value) partes.push(nomeStatus[selStatus.value]);

  const texto = partes.length ? partes.join(", ") : "Nenhum";

  resumoFiltros.innerHTML =
    `Filtros: ${escapar(texto)} <a class="link" href="catalogo.html" data-limpar>Limpar</a>`;
}

function mostrarPaginacao(totalPaginas) {
  if (totalPaginas <= 1) {
    paginacao.innerHTML = "";
    return;
  }

  let html = "";

  if (paginaAtual > 1) {
    html += `<a class="paginacao__link" href="#" data-pagina="${paginaAtual - 1}">Anterior</a>`;
  }

  for (let p = 1; p <= totalPaginas; p++) {
    html += p === paginaAtual
      ? `<strong class="paginacao__atual" aria-current="page">${p}</strong>`
      : `<a class="paginacao__link" href="#" data-pagina="${p}">${p}</a>`;
  }

  if (paginaAtual < totalPaginas) {
    html += `<a class="paginacao__link" href="#" data-pagina="${paginaAtual + 1}">Próxima</a>`;
  }

  paginacao.innerHTML = html;
}

function mostrarJogos() {
  const filtrados = filtrarJogos();
  const total = filtrados.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const pagina = filtrados.slice(inicio, inicio + POR_PAGINA);

  if (jogos.length === 0) {
    listaJogos.innerHTML = '<p class="vazio">Nenhum jogo cadastrado ainda. Clique em "+ Adicionar Jogo".</p>';
  } else if (total === 0) {
    listaJogos.innerHTML = '<p class="vazio">Nenhum jogo encontrado com esses filtros.</p>';
  } else {
    listaJogos.innerHTML = pagina.map(criarCartao).join("");
  }

  resumoTotal.textContent = total === 0
    ? "Nenhum jogo encontrado"
    : `Exibindo ${inicio + 1}-${inicio + pagina.length} de ${total} ${total === 1 ? "jogo" : "jogos"}`;

  descricao.textContent =
    `${jogos.length} ${jogos.length === 1 ? "jogo cadastrado" : "jogos cadastrados"} na sua estante. Busque, filtre e organize sua coleção`;

  mostrarFiltros();
  mostrarPaginacao(totalPaginas);
}

function aplicarVisao() {
  const visao = document.querySelector('input[name="visao"]:checked').value;
  listaJogos.classList.toggle("lista-jogos--lista", visao === "lista");
}

function limparFiltros() {
  formFiltros.reset();
  campoBuscaGlobal.value = "";
  paginaAtual = 1;
  aplicarVisao();
  mostrarJogos();
}


campoBusca.addEventListener("input", function () {
  campoBuscaGlobal.value = this.value;
  paginaAtual = 1;
  mostrarJogos();
});

campoBuscaGlobal.addEventListener("input", function () {
  campoBusca.value = this.value;
  paginaAtual = 1;
  mostrarJogos();
});

[selCategoria, selStatus, selOrdem].forEach(sel => {
  sel.addEventListener("change", function () {
    paginaAtual = 1;
    mostrarJogos();
  });
});

document.querySelectorAll('input[name="visao"]').forEach(radio => {
  radio.addEventListener("change", aplicarVisao);
});

formFiltros.addEventListener("submit", function (e) {
  e.preventDefault();
  paginaAtual = 1;
  mostrarJogos();
});

resumoFiltros.addEventListener("click", function (e) {
  if (e.target.closest("[data-limpar]")) {
    e.preventDefault();
    limparFiltros();
  }
});

paginacao.addEventListener("click", function (e) {
  const link = e.target.closest("[data-pagina]");
  if (!link) return;

  e.preventDefault();
  paginaAtual = Number(link.dataset.pagina);
  mostrarJogos();
  window.scrollTo({ top: 0, behavior: "smooth" });
});


aplicarVisao();
mostrarJogos();