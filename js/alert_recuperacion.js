
const formRecuperar = document.getElementById("form-recuperar");

formRecuperar.addEventListener("submit", function (event) {
        event.preventDefault();

        const documento = document.getElementById("numero").value.trim(); //validación campo DNI que sea numérico y no esté vacío.

        if (documento === "") {
            alert("El campo número no puede estar vacío.");
            return;
        }

        if (isNaN(documento)) {
            alert("El documento debe tener solo números, sin puntos.");
            return;
        }

        alert("Se ha enviado un mail al correo registrado");
        window.location.href = "./login.html";
});