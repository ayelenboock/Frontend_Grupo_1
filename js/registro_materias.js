//Muestra materias en la tabla, editar y eliminar materias

const cuerpoTabla = document.getElementById("tabla_materias");

function mostrarMaterias() {
    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
        const materias = JSON.parse(localStorage.getItem("materias")) || [];

        if (materias.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.textContent = "No hay materias cargadas.";
            celda.colSpan = 8;
            fila.appendChild(celda);
            cuerpoTabla.appendChild(fila);
        }

        materias.forEach(function (materia, indice) {
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

            const datos = [
                materia.codigo,
                materia.asignatura,
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

mostrarMaterias();