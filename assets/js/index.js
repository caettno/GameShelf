const formularios = document.querySelectorAll(".formulario");

const campos = document.querySelectorAll(".campo__input");

campos.forEach(campo => {
    campo.required = true;
});

const senhaCadastro = document.querySelector("#signup-senha");

senhaCadastro.addEventListener("input", function() {
    if (this.value.length > 0 && this.value.length < 8) {
        this.setCustomValidity("A senha deve possuir pelo menos 8 caracteres.");
    } else {
        this.setCustomValidity("");
    }
});

formularios.forEach(formulario => {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        window.location.href = formulario.action;
    });
});

const linkEsqueciSenha = document.querySelector(".link");
const emailLogin = document.querySelector("#login-email");

linkEsqueciSenha.addEventListener("click", function(event) {
    event.preventDefault();

    if (emailLogin.value.trim() === "") {
        alert("Digite seu e-mail para continuar.");
        emailLogin.focus();
    } else {
        alert("A recuperação de senha ainda não está disponível.");
    }
});
