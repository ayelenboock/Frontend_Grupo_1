//Carga de asistencias: elegir materia, fecha, guardar asistencias
const selectMateria = document.getElementById("materia");
const cuerpoTabla = document.getElementById("tabla_asistencia");
const botonGuardar = document.getElementById("btn-guardar-asistencia");
const mensajeAsistencia = document.getElementById("mensaje-asistencia");
const inputFecha = document.getElementById("fecha");

if (selectMateria && cuerpoTabla) {
    const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    const materias = JSON.parse(localStorage.getItem("materias")) || [];

    //Llenar el select con las materias guardadas
    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";

    if (materias.length === 0) {
        opcionInicial.textContent = "No hay materias cargadas";
    } else {
        opcionInicial.textContent = "Seleccioná una materia";
    }

    selectMateria.appendChild(opcionInicial);

    materias.forEach(function (materia) {
        const opcion = document.createElement("option");
        opcion.value = materia.codigo;
        opcion.textContent = materia.asignatura;
        selectMateria.appendChild(opcion);
    });

    inputFecha.value = new Date().toISOString().slice(0, 10);

    //Agrega una fila con un mensaje que ocupa toda la tabla
    function mostrarMensaje(texto) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.textContent = texto;
        celda.colSpan = 2;
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
    }
    
    //Dibuja una fila por estudiante
    function mostrarTabla() {
        cuerpoTabla.innerHTML = "";
        mensajeAsistencia.textContent = "";
        const materiaCodigo = selectMateria.value;
        const fecha = inputFecha.value;

        if (fecha === "") {
            mostrarMensaje("Elegí una fecha.");
            return;
        }    

        if (materiaCodigo === "") {
            mostrarMensaje("Elegí una materia para cargar asistencia.");
            return;
        }

        if (estudiantes.length === 0) {
            mostrarMensaje("No hay estudiantes cargados.");
            return;
        }
        
        const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];

        estudiantes.forEach(function (estudiante) {
            const registro = asistencias.find(function (r) {
                return r.dni === estudiante.dni && r.materiaCodigo === materiaCodigo && r.fecha === fecha;
            });
            
            const fila = document.createElement("tr");
            fila.dataset.dni = estudiante.dni;

            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = estudiante.apellido + ", " + estudiante.nombre;
            fila.appendChild(celdaNombre);

            const celdaAsistencia = document.createElement("td");

            const opciones = [
                { valor: "P", texto: "Presente" },
                { valor: "A", texto: "Ausente"}
            ];

            opciones.forEach(function (opcion) {
                const label = document.createElement("label");
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "asistencia-" + estudiante.dni;
                radio.value = opcion.valor;

                //Si ya había una asistencia guardada se marca
                if (registro && registro.estado === opcion.valor) {
                    radio.checked = true;
                }

                label.appendChild(radio);
                label.append(" " + opcion.texto);
                celdaAsistencia.appendChild(label);
            });
            
            fila.appendChild(celdaAsistencia);
            cuerpoTabla.appendChild(fila);
        });
    }

    //Guardar las asistencias de la materia y fecha elegida
    botonGuardar.addEventListener("click", function () {
        const materiaCodigo = selectMateria.value;
        const fecha = inputFecha.value;
        const hoy = new Date().toISOString().slice(0, 10);

        if (materiaCodigo === "") {
            mensajeAsistencia.textContent = "Elegí una materia antes de guardar.";
            return;
        }

        if (fecha === "") {
            mensajeAsistencia.textContent = "Elegí una fecha antes de guardar.";
            return;
        }

        if (fecha > hoy) {
            mensajeAsistencia.textContent = "La fecha no puede ser futura.";
            return;
        }

        const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];
        
        const filas = cuerpoTabla.querySelectorAll("tr");

        for (const fila of filas) {
            //Las filas de mensaje no tienen DNI
            if (!fila.dataset.dni) {
                continue;
            }

            const marcado = fila.querySelector('input[type="radio"]:checked');

            if (marcado === null) {
                mensajeAsistencia.textContent = "Marcá la asistencia de todos los estudiantes.";
                return;
            }

            const dni = fila.dataset.dni;

            const posicion = asistencias.findIndex(function (r) {
                return r.dni === dni && r.materiaCodigo === materiaCodigo && r.fecha === fecha;
            });

            if (posicion !== -1) {
                asistencias[posicion].estado = marcado.value;
            } else {
                asistencias.push({
                    dni: dni,
                    materiaCodigo: materiaCodigo,
                    fecha: fecha,
                    estado: marcado.value
                });
            }
        }

        localStorage.setItem("asistencias", JSON.stringify(asistencias));
        mensajeAsistencia.textContent = "Asistencia guardada correctamente.";
    });

    //Volver a dibujar la tabla al cambiar de materia/fecha
    selectMateria.addEventListener("change", mostrarTabla);
    inputFecha.addEventListener("change", mostrarTabla);

    mostrarTabla();
}