
//Validación para que los campos del formulario no estén vacíos
const formAlta = document.getElementById("form-alta");

if (formAlta) {
    const inputApellido = document.getElementById("apellido");
    const inputNombre = document.getElementById("nombre");
    const inputDni = document.getElementById("dni");
    const inputFechaNac = document.getElementById("fechaNac");
    const inputLugarNac = document.getElementById("lugarNac");
    const inputDireccion = document.getElementById("direccion");
    const inputTelefono = document.getElementById("telefono");
    const inputContactoUrg = document.getElementById("urgencia");
    const mensajeError = document.getElementById("mensaje-error");


    //Para cuando se edita, si la dirección trae ?indice= se edita un estudiante existente
    const parametros = new URLSearchParams(window.location.search);
    const indiceEditar = parametros.get("indice");

    if (indiceEditar !== null) {
        const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

        const estudiante = estudiantes[indiceEditar];

        if (estudiante) {
            inputApellido.value = estudiante.apellido;
            inputNombre.value = estudiante.nombre;
            inputDni.value = estudiante.dni;
            inputFechaNac.value = estudiante.fechaNac;
            inputLugarNac.value = estudiante.lugarNac;
            inputDireccion.value = estudiante.direccion;
            inputTelefono.value = estudiante.telefono;
            inputContactoUrg.value = estudiante.urgencia;

            document.getElementById("titulo-alta").textContent = "EDITAR ESTUDIANTE";
            document.getElementById("btn-guardar").textContent = "Guardar cambios";
        }
            
    }

    formAlta.addEventListener("submit", function (event) {
        event.preventDefault();
        const apellido = inputApellido.value.trim();
        const nombre = inputNombre.value.trim();
        const dni = inputDni.value.trim();
        const fechaNac = inputFechaNac.value.trim();
        const lugarNac = inputLugarNac.value.trim();
        const direccion = inputDireccion.value.trim();
        const telefono = inputTelefono.value.trim();
        const urgencia = inputContactoUrg.value.trim();
        

        if (apellido === "" || nombre === "" || dni === "" || fechaNac === "" || lugarNac === "" || direccion === "" || telefono === "" || urgencia === "") {
            mensajeError.textContent = "Los campos son obligatorios, no deben estar vacíos.";
            return;
        }

        if (dni.length < 7 || isNaN (dni)) {
            mensajeError.textContent = "El DNI debe tener al menos 7 caracteres";
            return;
        }

    const estudiante = {
        apellido : apellido,
        nombre : nombre,
        dni : dni,
        fechaNac : fechaNac,
        lugarNac : lugarNac,
        direccion : direccion,
        telefono : telefono,
        urgencia : urgencia
        };

    const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

        //para no duplicar campos cuando se edita el estudiantes:
        if (indiceEditar !== null) {
            estudiantes[indiceEditar] = estudiante;
        } else {
            estudiantes.push(estudiante);
        }
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

        //Para que redirija a la página de gestión de estudiantes cuando se edita
        if (indiceEditar !== null) {
            alert("Estudiante actualizado correctamente.");
            window.location.href = "registro_estudiantes.html";
        } else {
            mensajeError.textContent = "Estudiante guardado correctamente.";
            formAlta.reset();            
        }

        
    });
}