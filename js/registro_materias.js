//Muestra materias en la tabla, editar y eliminar materias

const cuerpoTabla = document.getElementById("tabla_materias");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");

//Agrega fila con un mensaje que ocupa toda la tabla:
function mostrarMensaje(texto) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.textContent = texto;
    celda.colSpan = 9;
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
}

function mostrarMaterias() {
    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
    const carreras = JSON.parse(localStorage.getItem("carreras")) || [];
    
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
        const materias = JSON.parse(localStorage.getItem("materias")) || [];
        const textoBuscado = inputBusqueda.value.trim().toLowerCase();
        let mostrados = 0;

        if (materias.length === 0) {
            mostrarMensaje("No hay materias cargadas.");
            return;
        }

        materias.forEach(function (materia, indice) {
            //si la asignatura no coincide con la búsqueda se saltea esta materia:
            if (!materia.asignatura.toLowerCase().includes(textoBuscado)) {
                return;
            }
            mostrados++;

            const fila = document.createElement("tr");

            const textoHorarios = materia.horarios.map(function (h) {
                return h.dia + " " + h.horario;
            }).join(" / ");

            const profesor = profesores.find(function (p) {
                return p.cuil === materia.profesorCuil;
            });

            let nombreProfesor = "Sin asignar";
            if (profesor) {
                nombreProfesor = profesor.apellido + ", " + profesor.nombre;
            }

            const carrera = carreras.find(function (c) {
                return c.codigo === materia.carreraCodigo;
            });

            let nombreCarrera = "Sin carrera";
            if (carrera) {
                nombreCarrera = carrera.nombre;
            }

            const datos = [
                materia.codigo,
                materia.asignatura,
                nombreCarrera,
                materia.anio + "°",
                textoHorarios,                
                nombreProfesor,
                materia.duracion,
                materia.lectivo                
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
                window.location.href = "alta_materias.html?indice=" + indice;
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", function () {
                eliminarMateria(indice);
            });

            celdaAcciones.appendChild(botonEditar);
            celdaAcciones.appendChild(botonEliminar);
            fila.appendChild(celdaAcciones);

            cuerpoTabla.appendChild(fila);
        });

        if (mostrados === 0) {
            mostrarMensaje("No se encontraron materias con esa denominación.");
        }
    }
}

function eliminarMateria(indice) {
    const confirmar = confirm("¿Seguro que desea eliminar esta Materia?");
    if (!confirmar) {
        return;
    }

    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    materias.splice(indice, 1);
    localStorage.setItem("materias", JSON.stringify(materias));
    
    mostrarMaterias();
}

//Buscar por asignatura
formBusqueda.addEventListener("submit", function (event) {
    event.preventDefault();
    mostrarMaterias();
});

mostrarMaterias();