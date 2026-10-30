//Muestra alta de estudiantes en la tabla, buscar, editar y eliminar estudiantes

const cuerpoTabla = document.getElementById("tabla_estudiantes");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");

//Agrega fila con un mensaje que ocupa toda la tabla:
function mostrarMensaje(texto) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.textContent = texto;
    celda.colSpan = 8;
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
}

function mostrarEstudiantes() {
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
        const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
        const textoBuscado = inputBusqueda.value.trim().toLowerCase();
        let mostrados = 0;

        if (estudiantes.length === 0) {
            mostrarMensaje("No hay estudiantes cargados.");
            return;
        }

        estudiantes.forEach(function (estudiante, indice) {
            if (!estudiante.apellido.toLowerCase().includes(textoBuscado)) {
                return;
            }
            mostrados++;

            const fila = document.createElement("tr");

            const datos = [
                estudiante.dni,
                estudiante.apellido + ", " + estudiante.nombre,
                estudiante.fechaNac,
                estudiante.lugarNac,
                estudiante.direccion,
                estudiante.telefono,
                estudiante.urgencia
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
                window.location.href = "alta_estudiantes.html?indice=" + indice;
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", function () {
                eliminarEstudiante(indice);
            });

            celdaAcciones.appendChild(botonEditar);
            celdaAcciones.appendChild(botonEliminar);
            fila.appendChild(celdaAcciones);

            cuerpoTabla.appendChild(fila);
        });

        if (mostrados === 0) {
            mostrarMensaje("No se encontraron estudiantes con ese apellido.");
        }
    }
}

function eliminarEstudiante(indice) {
    const confirmar = confirm("¿Seguro que desea eliminar este estudiante?");
    if (!confirmar) {
        return;
    }

    const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    estudiantes.splice(indice, 1);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    mostrarEstudiantes();    
}

//Buscar por apellido:
formBusqueda.addEventListener("submit", function (event) {
    event.preventDefault();
    mostrarEstudiantes();
});

mostrarEstudiantes();