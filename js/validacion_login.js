//Prueba de que las rutas están conectadas:
// console.log("Bienvenidos");

//Validación para que los campos usuario y contraseña no estén vacíos
const formLogin = document.getElementById("form-login");

if (formLogin) {
    const inputUsuario = document.getElementById("usuario");
    const inputContrasena = document.getElementById("contrasena");
    const mensajeError = document.getElementById("mensaje-error");

    formLogin.addEventListener("submit", function (event) {
        const usuario = inputUsuario.value.trim();
        const contrasena = inputContrasena.value.trim();

        if (usuario === "" || contrasena === "") {
            event.preventDefault();
            mensajeError.textContent = "Los campos usuario y/o contraseña no deben estar vacíos.";
            return;
        }

        if (contrasena.length < 4) {
            event.preventDefault();
            mensajeError.textContent = "La contraseña debe tener al menos 4 caracteres";
            return;
        }

        //Para que el login dirija al Panel de Administración
        const parametros = new URLSearchParams(window.location.search);
        const rol = parametros.get("rol");

        if (rol === "admin") {
            formLogin.action = "panel_administracion.html";
        }
        
        mensajeError.textContent = "";
    });
}