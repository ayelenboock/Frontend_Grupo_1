//Completar formulario, validar, editar carrera
const formAlta = document.getElementById("form-altacar");

if (formAlta) {
    const inputCodigo = document.getElementById("codigo");
    const inputNombre = document.getElementById("nombre");
    const selectDuracion = document.getElementById("duracion");
    const inputTituloOtorga = document.getElementById("tituloOtorga");
    const inputPlan = document.getElementById("plan");
    const mensajeError = document.getElementById("mensaje-error");

    //Para cuando se edita, si la dirección trae ?indice= se edita una carrera existente
    const parametros = new URLSearchParams(window.location.search);
    const indiceEditar = parametros.get("indice");

    if (indiceEditar !== null) {
        const carreras = JSON.parse(localStorage.getItem("carreras")) || [];

        const carrera = carreras[indiceEditar];

        if (carrera) {
            inputCodigo.value = carrera.codigo;
            inputCodigo.readOnly = true;
            inputNombre.value = carrera.nombre;
            selectDuracion.value = carrera.duracion;
            inputTituloOtorga.value = carrera.tituloOtorga;
            inputPlan.value = carrera.plan;
        
            document.getElementById("titulo-altacar").textContent = "EDITAR CARRERA";
            document.getElementById("btn-guardar").textContent = "Guardar cambios";
        }           
    }
    
    formAlta.addEventListener("submit", function (event) {
        event.preventDefault();
        const codigo = inputCodigo.value.trim().toUpperCase();
        const nombre = inputNombre.value.trim();        
        const duracion = selectDuracion.value;
        const tituloOtorga = inputTituloOtorga.value.trim();
        const plan = inputPlan.value.trim();

        if (codigo === "" || nombre === "" || tituloOtorga === "" || plan === "") {
            mensajeError.textContent = "Los campos son obligatorios, no deben estar vacíos.";
            return;
        }

        if (!/^CAR-\d{3}$/.test(codigo)) {
            mensajeError.textContent = "El código debe tener el formato CAR-123 (CAR- seguido de 3 números).";
            return;
        }
        if (!/^\d{4}$/.test(plan)) {
            mensajeError.textContent = "El plan debe tener 4 números, por ejemplo 2026.";
            return;
        }

        const carrera = {
            codigo: codigo,
            nombre: nombre,
            duracion: duracion,
            tituloOtorga: tituloOtorga,
            plan: plan
        };

        const carreras = JSON.parse(localStorage.getItem("carreras")) || [];

        //Para que dos carreras no tengan el mismo código:
        const codigoRepetido = carreras.some(function (c, i) {
            return c.codigo === codigo && String(i) !== indiceEditar;
        });

        if (codigoRepetido) {
            mensajeError.textContent = "Ya existe una carrera con el código " + codigo + ".";
            return;
        }

        //para no duplicar campos cuando se edita las carreras:
        if (indiceEditar !== null) {
            carreras[indiceEditar] = carrera;
        } else {
            carreras.push(carrera);
        }
        localStorage.setItem("carreras", JSON.stringify(carreras));

        //Para que redirija a la página de gestión de carreras cuando se edita
        if (indiceEditar !== null) {
            alert("Carrera actualizada correctamente.");
            window.location.href = "registro_carreras.html";
        } else {
            mensajeError.textContent = "Carrera guardada correctamente.";
            formAlta.reset();
        }
    });
}