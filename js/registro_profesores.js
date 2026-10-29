//Guardar el alta de profesores en la tabla, editar y eliminar profesores

const cuerpoTabla = document.getElementById("tabla_profesores");

function mostrarProfesores() {
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
        const profesores = JSON.parse(localStorage.getItem("profesores")) || [];

        if (profesores.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.textContent = "No hay profesores cargados.";
            celda.colSpan = 10;
            fila.appendChild(celda);
            cuerpoTabla.appendChild(fila);
        }

        profesores.forEach(function (profesor, indice) {
            const fila = document.createElement("tr");

            const datos = [
                profesor.cuil,
                profesor.apellido + ", " + profesor.nombre,
                profesor.fechaNac,
                profesor.lugarNac,
                profesor.direccion,
                profesor.telefono,
                profesor.titulo,
                profesor.institucion,
                "-"  // Materia que dicta
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
            fila.appendChild(celdaAcciones)

            cuerpoTabla.appendChild(fila);
        });
    }
}

function eliminarProfesor(indice) {
    const confirmar = confirm("¿Seguro que desea eliminar este Profesor?");
    if (!confirmar) {
        return;
    }

    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
    profesores.splice(indice, 1);
    localStorage.setItem("profesores", JSON.stringify(profesores));
    
    mostrarProfesores();    
}

mostrarProfesores();