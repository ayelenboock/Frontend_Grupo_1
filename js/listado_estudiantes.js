//Muestra el listado de estudiantes a profesores

const cuerpoTabla = document.getElementById("tabla_listado");
const formBusqueda = document.getElementById("form-lista");
const inputBusqueda = document.getElementById("input-buscar");

if (cuerpoTabla) {
    const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

    function mostrarEstudiantes(lista, mensajeVacio) {
        cuerpoTabla.innerHTML = "";

        if (lista.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.textContent = mensajeVacio;
            celda.colSpan = 7;
            fila.appendChild(celda);
            cuerpoTabla.appendChild(fila);
        }

        lista.forEach(function (estudiante) {
            const fila = document.createElement("tr");

            const datos = [
                estudiante.dni,
                estudiante.apellido + ", " + estudiante.nombre,
                "-",   // Materia
                "-",   // Nota 1
                "-",   // Nota 2
                "-",   // Nota 3
                "-"    // Promedio                
            ];

            datos.forEach(function (dato) {
                const celda = document.createElement("td");
                celda.textContent = dato;
                fila.appendChild(celda);
            });

            cuerpoTabla.appendChild(fila);
        });
    }

    //Muestra todos los estudiantes al cargar la página:
    mostrarEstudiantes(estudiantes, "No hay estudiantes cargados");

    //Búsqueda por apellido
    formBusqueda.addEventListener("input", function (event) {
        
        const textoBuscado = inputBusqueda.value.trim().toLowerCase();

        const filtrados = estudiantes.filter(function (estudiante) {
            return estudiante.apellido.toLowerCase().includes(textoBuscado);
        });

        mostrarEstudiantes(filtrados, "No se encontraron estudiantes con ese apellido");
    });
}
