
const formularioCadastro = document.querySelector("#signup-nome").closest("form");
const formularioLogin = document.querySelector("#login-email").closest("form");

formularioCadastro.addEventListener("submit", function () {
    const nome = document.querySelector("#signup-nome").value.trim();
    const email = document.querySelector("#signup-email").value.trim();

    const usuario = {
        nome: nome,
        email: email
    };

    localStorage.setItem("gamesShelfConta", JSON.stringify(usuario));
    localStorage.setItem("gamesShelfUsuario", JSON.stringify(usuario));
});

formularioLogin.addEventListener("submit", function () {
    const email = document.querySelector("#login-email").value.trim();

    const conta = JSON.parse(localStorage.getItem("gamesShelfConta"));

    if (conta && conta.email === email) {
        localStorage.setItem("gamesShelfUsuario", JSON.stringify(conta));
    }
});
