//Completar formulario, validar, seleccionar dia y horario, editar materia
const formAlta = document.getElementById("form-altamat");

if (formAlta) {
    const inputCodigo = document.getElementById("codigo");
    const inputAsignatura = document.getElementById("asignatura");
    const selectAnio = document.getElementById("anio");    
    const selectProfesor = document.getElementById("profesor");
    const selectDuracion = document.getElementById("duracion");
    const inputLectivo = document.getElementById("lectivo");
    const mensajeError = document.getElementById("mensaje-error");

    //SELECT con profesores guardados:
    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
   
    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";

    if (profesores.length === 0) {
        opcionInicial.textContent = "No hay profesores cargados";
    } else {
        opcionInicial.textContent = "Selecciona un profesor";
    }

    selectProfesor.appendChild(opcionInicial);

    profesores.forEach(function (profesor) {
        const opcion = document.createElement("option");
        opcion.value = profesor.cuil;
        opcion.textContent = profesor.apellido + ", " + profesor.nombre;
        selectProfesor.appendChild(opcion);
    });


    //Para cuando se edita, si la dirección trae ?indice= se edita una materia existente
    const parametros = new URLSearchParams(window.location.search);
    const indiceEditar = parametros.get("indice");

    if (indiceEditar !== null) {
        const materias = JSON.parse(localStorage.getItem("materias")) || [];

        const materia = materias[indiceEditar];

        if (materia) {
            inputCodigo.value = materia.codigo;
            inputAsignatura.value = materia.asignatura;
            selectAnio.value = materia.anio;
            selectProfesor.value = materia.profesorCuil;
            selectDuracion.value = materia.duracion;
            inputLectivo.value = materia.lectivo;

            //Marcar los días guardados y elegir un horario
            materia.horarios.forEach(function (h) {
                const casilla = document.querySelector('input[name="dia"] [value= "' + h.dia + '"]');
                if (casilla) {
                    casilla.checked = true;
                    const fila = casilla.closest(".fila-horario");
                    fila.querySelector("select").value = h.horario;
                }                
            });
            
            document.getElementById("titulo-altamat").textContent = "EDITAR MATERIA";
            document.getElementById("btn-guardar").textContent = "Guardar cambios";
        }           
    }
    
    formAlta.addEventListener("submit", function (event) {
        event.preventDefault();
        const codigo = inputCodigo.value.trim().toUpperCase();
        const asignatura = inputAsignatura.value.trim();
        const anio = selectAnio.value.trim();
        const profesorCuil = selectProfesor.value.trim();
        const duracion = selectDuracion.value.trim();
        const lectivo = inputLectivo.value.trim();      

        if (codigo === "" || asignatura === "" || anio === "" || profesorCuil === "" || lectivo === "") {
            mensajeError.textContent = "Los campos son obligatorios, no deben estar vacíos.";
            return;
        }

        if (!/^MAT-\d{3}$/.test(codigo)) {
            mensajeError.textContent = "El código debe tener el formato MAT-123 (MAT- seguido de 3 números).";
            return;
        }
        if (!/^\d{4}$/.test(lectivo)) {
            mensajeError.textContent = "El año lectivo debe tener 4 números, por ejemplo 2026.";
            return;
        }

        //Días y horarios (1-4) y cada día marcado con su horario    
        const marcadas = document.querySelectorAll('input[name="dia"]:checked');

        if (marcadas.length < 1 || marcadas.length > 4){
            mensajeError.textContent = "Elegí entre 1 y 4 días de cursada.";
            return;
        }

        const horarios = [];
        for (const casilla of marcadas) {
            const fila = casilla.closest(".fila-horario");
            const selectHorario = fila.querySelector("select");

            if (selectHorario.value === "") {
                mensajeError.textContent = "Elegí el horario del día " + casilla.value + "."; 
                return;
            }

            horarios.push({
                dia: casilla.value,
                horario: selectHorario.value
            });
        }
        
        const materia = {
            codigo: codigo,
            asignatura: asignatura,
            anio: anio,
            horarios: horarios,
            profesorCuil: profesorCuil,
            duracion: duracion,
            lectivo: lectivo
        };

        const materias = JSON.parse(localStorage.getItem("materias")) || [];

        //para no duplicar campos cuando se edita el materias:
        if (indiceEditar !== null) {
            materias[indiceEditar] = materia;
        } else {
            materias.push(materia);
        }
        localStorage.setItem("materias", JSON.stringify(materias));

        //Para que redirija a la página de gestión de materias cuando se edita
        if (indiceEditar !== null) {
            alert("Materia actualizado correctamente.");
            window.location.href = "registro_materias.html";
        } else {
            mensajeError.textContent = "Materia guardado correctamente.";
            formAlta.reset();            
        }        
    });
}