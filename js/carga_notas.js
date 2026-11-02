//Carga de notas: elegir materia, cargar 3 notas por estudiante, ver el promedio y guardar
const selectMateria = document.getElementById("materia");
const cuerpoTabla = document.getElementById("tabla_notas");
const botonGuardar = document.getElementById("btn-guardar-notas");
const mensajeNotas = document.getElementById("mensaje-notas");

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

    //Agrega una fila con un mensaje que ocupa toda la tabla
    function mostrarMensaje(texto) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.textContent = texto;
        celda.colSpan = 5;
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
    }

    //Calcula el promedio de las notas cargadas (ignora los inputs vacíos)
    function calcularPromedio(inputs) {
        let suma = 0;
        let cantidad = 0;

        inputs.forEach(function (input) {
            if (input.value !== "") {
                suma = suma + Number(input.value);
                cantidad++;
            }
        });

        if (cantidad === 0) {
            return "-";
        }

        return (suma / cantidad).toFixed(2);
    }

    //Dibuja una fila por estudiante, con sus notas guardadas en la materia elegida
    function mostrarTabla() {
        cuerpoTabla.innerHTML = "";
        mensajeNotas.textContent = "";
        const materiaCodigo = selectMateria.value;

        if (materiaCodigo === "") {
            mostrarMensaje("Elegí una materia para cargar notas.");
            return;
        }

        if (estudiantes.length === 0) {
            mostrarMensaje("No hay estudiantes cargados.");
            return;
        }

        const notas = JSON.parse(localStorage.getItem("notas")) || [];

        estudiantes.forEach(function (estudiante) {
            //Buscar si el estudiante ya tiene notas en esta materia
            const registro = notas.find(function (r) {
                return r.dni === estudiante.dni && r.materiaCodigo === materiaCodigo;
            });

            const fila = document.createElement("tr");
            fila.dataset.dni = estudiante.dni;

            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = estudiante.apellido + ", " + estudiante.nombre;
            fila.appendChild(celdaNombre);

            const inputs = [];

            for (let i = 0; i < 3; i++) {
                const celda = document.createElement("td");
                const input = document.createElement("input");
                input.type = "number";
                input.min = 1;
                input.max = 10;
                input.step = 0.5;
                input.className = "input-nota";

                if (registro && registro.notas[i] !== null) {
                    input.value = registro.notas[i];
                }

                celda.appendChild(input);
                fila.appendChild(celda);
                inputs.push(input);
            }

            const celdaPromedio = document.createElement("td");
            celdaPromedio.textContent = calcularPromedio(inputs);
            fila.appendChild(celdaPromedio);

            //Recalcular el promedio de esta fila cada vez que cambia una nota
            inputs.forEach(function (input) {
                input.addEventListener("input", function () {
                    celdaPromedio.textContent = calcularPromedio(inputs);
                });
            });

            cuerpoTabla.appendChild(fila);
        });
    }

    //Guardar las notas de la materia elegida
    botonGuardar.addEventListener("click", function () {
        const materiaCodigo = selectMateria.value;

        if (materiaCodigo === "") {
            mensajeNotas.textContent = "Elegí una materia antes de guardar.";
            return;
        }

        const notas = JSON.parse(localStorage.getItem("notas")) || [];
        const filas = cuerpoTabla.querySelectorAll("tr");

        for (const fila of filas) {
            const inputs = fila.querySelectorAll("input");

            //Las filas de mensaje no tienen inputs
            if (inputs.length === 0) {
                continue;
            }

            const valores = [];

            for (const input of inputs) {
                if (input.value === "") {
                    valores.push(null);
                    continue;
                }

                const nota = Number(input.value);

                if (nota < 1 || nota > 10) {
                    mensajeNotas.textContent = "Las notas deben estar entre 1 y 10.";
                    return;
                }

                valores.push(nota);
            }

            const dni = fila.dataset.dni;

            const posicion = notas.findIndex(function (r) {
                return r.dni === dni && r.materiaCodigo === materiaCodigo;
            });

            const tieneNotas = valores.some(function (v) {
                return v !== null;
            });

            if (posicion !== -1) {
                notas[posicion].notas = valores;
            } else if (tieneNotas) {
                notas.push({
                    dni: dni,
                    materiaCodigo: materiaCodigo,
                    notas: valores
                });
            }
        }

        localStorage.setItem("notas", JSON.stringify(notas));
        mensajeNotas.textContent = "Notas guardadas correctamente.";
    });

    //Volver a dibujar la tabla al cambiar de materia
    selectMateria.addEventListener("change", mostrarTabla);

    mostrarTabla();
}