//Muestra el alta de profesores en la tabla, buscar, editar y eliminar profesores

const cuerpoTabla = document.getElementById("tabla_profesores");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");

//Agrega fila con un mensaje que ocupa toda la tabla:
function mostrarMensaje(texto) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.textContent = texto;
    celda.colSpan = 10;
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
}

function mostrarProfesores() {
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
        const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
        const materias = JSON.parse(localStorage.getItem("materias")) || [];
        const textoBuscado = inputBusqueda.value.trim().toLowerCase();
        let mostrados = 0;

        if (profesores.length === 0) {
            mostrarMensaje("No hay profesores cargados.");
            return;
        }

        profesores.forEach(function (profesor, indice) { 
            //si el apellido no coincide con la búsqueda saltea este profesor:
            if (!profesor.apellido.toLowerCase().includes(textoBuscado)) {
                return;
            }
            mostrados++;

            const fila = document.createElement("tr");
            const materiasDelProfesor = materias.filter(function (m) {
                return m.profesorCuil === profesor.cuil;
            });
            let textoMaterias = "Sin materias";
            if (materiasDelProfesor.length > 0) {
                textoMaterias = materiasDelProfesor.map(function (m) {
                    return m.asignatura;
                }).join(", ");
            }

            const datos = [
                profesor.cuil,
                profesor.apellido + ", " + profesor.nombre,
                profesor.fechaNac,
                profesor.lugarNac,
                profesor.direccion,
                profesor.telefono,
                profesor.titulo,
                profesor.institucion,
                textoMaterias
            ];

            datos.forEach(function (dato) {
                const celda = document.createElement("td");
                celda.textContent = dato;
                fila.appendChild(celda);
            });

            const celdaAcciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.addEventListener("click", function (){
                window.location.href = "alta_profesor.html?indice=" + indice;
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", function () {
                eliminarProfesor(indice);
            });

            celdaAcciones.appendChild(botonEditar);
            celdaAcciones.appendChild(botonEliminar);
            fila.appendChild(celdaAcciones);

            cuerpoTabla.appendChild(fila);
        });

        if (mostrados === 0) {
            mostrarMensaje("No se encontraron profesores con ese apellido.");
        }
    }
}

function eliminarProfesor(indice) {
    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
    const materias = JSON.parse(localStorage.getItem("materias")) || [];

    //si el profesor dicta materias no se puede eliminar
    const tieneMaterias = materias.some(function (m) {
        return m.profesorCuil === profesores[indice].cuil;
    });

    if (tieneMaterias) {
        alert("No se puede eliminar: el profesor tiene materias asignadas.");
        return;
    }

    const confirmar = confirm("¿Seguro que desea eliminar este Profesor?");
    if (!confirmar) {
        return;
    }

    profesores.splice(indice, 1);
    localStorage.setItem("profesores", JSON.stringify(profesores));
    
    mostrarProfesores();    
}

//Buscar por apellido:
formBusqueda.addEventListener("submit", function (event) {
    event.preventDefault();
    mostrarProfesores();
});

mostrarProfesores();