//Muestra el listado de estudiantes a profesores y a la administración

const cuerpoTabla = document.getElementById("tabla_listado");
const formBusqueda = document.getElementById("form-lista");
const inputBusqueda = document.getElementById("input-buscar");
const selectMateria = document.getElementById("filtro-materia");
const celdaPromedioGeneral = document.getElementById("promedio-general");

if (cuerpoTabla) {
    const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const notas = JSON.parse(localStorage.getItem("notas")) || [];

    //Llenar el select con las materias:
    const opcionTodas = document.createElement("option");
    opcionTodas.value = "";
    opcionTodas.textContent = "Todas las materias";
    selectMateria.appendChild(opcionTodas);

    materias.forEach(function (materia) {
        const opcion = document.createElement("option");
        opcion.value = materia.codigo;
        opcion.textContent = materia.asignatura;
        selectMateria.appendChild(opcion);
    });

    //Promedio de un arreglo de notas sin contar vacías:
    function calcularPromedio(listaNotas) {
        let suma = 0;
        let cantidad = 0;

        listaNotas.forEach(function (n) {
            if (n !== null) {
                suma = suma + n;
                cantidad++;
            }
        });

        if (cantidad === 0) {
            return null;
        }
        return suma / cantidad;
    }

    //Muestra un número con dos decimales, o un guión si no hay valor:
    function formatear(valor) {
        if (valor === null || valor === undefined) {
            return "-";
        }
        return Number(valor).toFixed(2);
    }

    //Arma una fila por cada estudiante y materia con notas. Los estudiantes sin nota aparecen una sola vez sin materia:
    const registros = [];

    estudiantes.forEach(function (estudiante) {
        const notasDelEstudiante = notas.filter(function (r) {
            return r.dni === estudiante.dni;
        });

        if (notasDelEstudiante.length === 0) {
            registros.push({
                estudiante: estudiante,
                materiaCodigo: "",
                materiaNombre: "-",
                notas: [null, null, null]
            });
        }

        notasDelEstudiante.forEach(function (r) {
            const materia = materias.find(function (m) {
                return m.codigo === r.materiaCodigo;
            });

            let materiaNombre = "Materia eliminada";
            if (materia) {
                materiaNombre = materia.asignatura;
            }
            registros.push({
                estudiante: estudiante,
                materiaCodigo: r.materiaCodigo,
                materiaNombre: materiaNombre,
                notas: r.notas
            });
        });
    });

    //Dibuja la tabla según búsqueda y materia elegida:
    function mostrarListado() {
        cuerpoTabla.innerHTML = "";
        const textoBuscado = inputBusqueda.value.trim().toLowerCase();
        const materiaElegida = selectMateria.value;
        const promedios = [];

        const filtrados = registros.filter(function (r) {
            const coincideApellido = r.estudiante.apellido.toLowerCase().includes(textoBuscado);
            const coincideMateria = materiaElegida === "" || r.materiaCodigo === materiaElegida;
            return coincideApellido && coincideMateria;
        });        

        if (filtrados.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");            
            celda.colSpan = 7;

            if (estudiantes.length === 0) {
                celda.textContent = "No hay estudiantes cargados.";
            } else {
                celda.textContent = "No se encontraron resultados.";
            }

            fila.appendChild(celda);
            cuerpoTabla.appendChild(fila);
        }

        filtrados.forEach(function (r) {
            const promedio = calcularPromedio(r.notas);
            if (promedio !== null) {
                promedios.push(promedio);
            }

            const fila = document.createElement("tr");

            const datos = [
                r.estudiante.dni,
                r.estudiante.apellido + ", " + r.estudiante.nombre,
                r.materiaNombre,
                formatear(r.notas[0]),
                formatear(r.notas[1]),
                formatear(r.notas[2]),
                formatear(promedio)            
            ];

            datos.forEach(function (dato) {
                const celda = document.createElement("td");
                celda.textContent = dato;
                fila.appendChild(celda);
            });

            cuerpoTabla.appendChild(fila);
        });

        //Promedio general cuando se elige una materia:
        if (materiaElegida !== "" && promedios.length > 0) {
            celdaPromedioGeneral.textContent = formatear(calcularPromedio(promedios));
        } else {
            celdaPromedioGeneral.textContent = "-";
        }
    }

    //Filtrar mientras se escribe o al cambiar de materia
    inputBusqueda.addEventListener("input", mostrarListado);
    selectMateria.addEventListener("change", mostrarListado);

    //Evitar que Enter recargue la página;
    formBusqueda.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    mostrarListado();
}
