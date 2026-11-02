//Muestra carreras en la tabla, editar y eliminar carreras

const cuerpoTabla = document.getElementById("tabla_carreras");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");

//Agrega fila con un mensaje que ocupa toda la tabla:
function mostrarMensaje(texto) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.textContent = texto;
    celda.colSpan = 6;
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
}

function mostrarCarreras() {    
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
        const carreras = JSON.parse(localStorage.getItem("carreras")) || [];
        const textoBuscado = inputBusqueda.value.trim().toLowerCase();
        let mostrados = 0;

        if (carreras.length === 0) {
            mostrarMensaje("No hay carreras cargadas.");
            return;
        }

        carreras.forEach(function (carrera, indice) {
            if (!carrera.nombre.toLowerCase().includes(textoBuscado)) {
                return;
            }
            mostrados++;
            const fila = document.createElement("tr");

            const datos = [
                carrera.codigo,
                carrera.nombre,
                carrera.duracion,
                carrera.tituloOtorga,
                carrera.plan
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
                window.location.href = "alta_carreras.html?indice=" + indice;
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", function () {
                eliminarCarrera(indice);
            });

            celdaAcciones.appendChild(botonEditar);
            celdaAcciones.appendChild(botonEliminar);
            fila.appendChild(celdaAcciones);

            cuerpoTabla.appendChild(fila);
        });

        if (mostrados === 0) {
            mostrarMensaje("No se encontraron carreras con ese plan.");
        }
    }
}

function eliminarCarrera(indice) {
    const carreras = JSON.parse(localStorage.getItem("carreras")) || [];
    const materias = JSON.parse(localStorage.getItem("materias")) || [];

    const tieneMaterias = materias.some(function (m) {
        return m.carreraCodigo === carreras[indice].codigo;
    });

    if (tieneMaterias) {
        alert("No se puede eliminar: la carrera tiene materias asignadas.");
        return;
    }
    
    const confirmar = confirm("¿Seguro que desea eliminar esta Carrera?");
    if (!confirmar) {
        return;
    }
    
    carreras.splice(indice, 1);
    localStorage.setItem("carreras", JSON.stringify(carreras));
    
    mostrarCarreras();
}

//Buscar por nombre de carrera:
formBusqueda.addEventListener("submit", function (event) {
    event.preventDefault();
    mostrarCarreras();
});

mostrarCarreras();