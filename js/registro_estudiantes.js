//Guardar el alta de estudiantes en la tabla, editar y eliminar estudiantes

const cuerpoTabla = document.getElementById("tabla_estudiantes");

function mostrarEstudiantes() {
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
        const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

        if (estudiantes.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.textContent = "No hay estudiantes cargados.";
            celda.colSpan = 6;
            fila.appendChild(celda);
            cuerpoTabla.appendChild(fila);
        }

        estudiantes.forEach(function (estudiante, indice) {
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
            fila.appendChild(celdaAcciones)

            cuerpoTabla.appendChild(fila);
        });
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

mostrarEstudiantes();