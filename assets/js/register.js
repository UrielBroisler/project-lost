document.addEventListener("DOMContentLoaded", () => {

  Inputmask({ "mask": "(99) 99999-9999" }).mask(document.getElementById("telefone"));
  Inputmask({ "mask": "999.999.999-99" }).mask(document.getElementById("cpf"));

  const form = document.getElementById("registrationForm");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const nascimento = document.getElementById("datanascimento").value;
    const password = document.getElementById("senha").value;
    const confirmPassword = document.getElementById("confirmarsenha").value;

    errorMessage.innerHTML = "";

    let isValid = true;

    if (password !== confirmPassword) {
      errorMessage.innerHTML += "<p>As senhas não coincidem!</p>";
      isValid = false;
    }

    if (!email.includes("@")) {
      errorMessage.innerHTML += "<p>O email deve conter @.</p>";
      isValid = false;
    }

    if (!isValid) {
      errorMessage.style.display = "block";
      return;
    }

    const data = {
      nome,
      email,
      cpf: cpf.replace(/\D/g, ""),
      telefone: telefone.replace(/\D/g, ""),
      nascimento,
      password
    };

  });
});
