
//Validación para que los campos del formulario no estén vacíos
const formAlta = document.getElementById("form-altapr");

if (formAlta) {
    const inputApellido = document.getElementById("apellido");
    const inputNombre = document.getElementById("nombre");
    const inputDni = document.getElementById("dni");
    const inputCuil = document.getElementById("cuil");
    const inputFechaNac = document.getElementById("fechaNac");
    const inputLugarNac = document.getElementById("lugarNac");
    const inputDireccion = document.getElementById("direccion");
    const inputTelefono = document.getElementById("telefono");
    const inputTituloObtenido = document.getElementById("titulo");
    const inputInstitucion = document.getElementById("institucion");
    const mensajeError = document.getElementById("mensaje-error");


    //Para cuando se edita, si la dirección trae ?indice= se edita un profesor existente
    const parametros = new URLSearchParams(window.location.search);
    const indiceEditar = parametros.get("indice");

    if (indiceEditar !== null) {
        const profesores = JSON.parse(localStorage.getItem("profesores")) || [];

        const profesor = profesores[indiceEditar];

        if (profesor) {
            inputApellido.value = profesor.apellido;
            inputNombre.value = profesor.nombre;
            inputDni.value = profesor.dni;
            inputCuil.value = profesor.cuil;
            inputFechaNac.value = profesor.fechaNac;
            inputLugarNac.value = profesor.lugarNac;
            inputDireccion.value = profesor.direccion;
            inputTelefono.value = profesor.telefono;
            inputTituloObtenido.value = profesor.titulo;
            inputInstitucion.value = profesor.institucion;

            document.getElementById("titulo-altapr").textContent = "EDITAR PROFESOR";
            document.getElementById("btn-guardar").textContent = "Guardar cambios";
        }
            
    }

    formAlta.addEventListener("submit", function (event) {
        event.preventDefault();
        const apellido = inputApellido.value.trim();
        const nombre = inputNombre.value.trim();
        const dni = inputDni.value.trim();
        const cuil = inputCuil.value.trim();
        const fechaNac = inputFechaNac.value.trim();
        const lugarNac = inputLugarNac.value.trim();
        const direccion = inputDireccion.value.trim();
        const telefono = inputTelefono.value.trim();
        const titulo = inputTituloObtenido.value.trim();
        const institucion = inputInstitucion.value.trim();
        

        if (apellido === "" || nombre === "" || dni === "" || cuil === "" || fechaNac === "" || lugarNac === "" || direccion === "" || telefono === "" || titulo === "" || institucion === "") {
            mensajeError.textContent = "Los campos son obligatorios, no deben estar vacíos.";
            return;
        }

        if (dni.length < 7 || isNaN (dni)) {
            mensajeError.textContent = "El DNI debe tener al menos 7 caracteres";
            return;
        }

        if (cuil.length < 10 || isNaN (cuil)) {
            mensajeError.textContent = "El CUIL debe tener al menos 10 caracteres";
            return;
        }

    const profesor = {
        apellido : apellido,
        nombre : nombre,
        dni : dni,
        cuil : cuil,
        fechaNac : fechaNac,
        lugarNac : lugarNac,
        direccion : direccion,
        telefono : telefono,
        titulo : titulo,
        institucion : institucion
        };

    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];

        //para no duplicar campos cuando se edita el profesores:
        if (indiceEditar !== null) {
            profesores[indiceEditar] = profesor;
        } else {
            profesores.push(profesor);
        }
        localStorage.setItem("profesores", JSON.stringify(profesores));

        //Para que redirija a la página de gestión de profesores cuando se edita
        if (indiceEditar !== null) {
            alert("Profesor actualizado correctamente.");
            window.location.href = "registro_profesores.html";
        } else {
            mensajeError.textContent = "Profesor guardado correctamente.";
            formAlta.reset();            
        }        
    });
}