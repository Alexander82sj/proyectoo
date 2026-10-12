// AUTOMAX TUNING - JAVASCRIPT CON TARJETAS Y FOTOS EN LOCALSTORAGE

const formulario = document.getElementById("formulario");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const buscar = document.getElementById("buscar");

let vehiculos = [];

try {
    const datos = JSON.parse(localStorage.getItem("vehiculos"));
    if (Array.isArray(datos)) {
        vehiculos = datos.filter(function (v) {
            return v && typeof v.codigo === "string";
        });
    }
} catch (error) {
    console.error("No se pudieron recuperar los vehículos:", error);
}

let indiceEditando = -1;
let tiempoMensaje;

document.getElementById("anio").max = new Date().getFullYear() + 1;

// SISTEMA DE NOTIFICACIONES
function mostrarMensaje(texto, error) {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = texto;
    mensaje.className = error ? "mensaje visible error" : "mensaje visible";

    clearTimeout(tiempoMensaje);
    tiempoMensaje = setTimeout(function () {
        mensaje.className = "mensaje";
    }, 3600);
}

// GUARDAR EN LOCALSTORAGE
function guardarDatos(lista) {
    try {
        localStorage.setItem("vehiculos", JSON.stringify(lista));
        return true;
    } catch (error) {
        mostrarMensaje("El almacenamiento local está lleno o la imagen es demasiado pesada.", true);
        return false;
    }
}

// REGISTRAR O ACTUALIZAR VEHÍCULO
function registrarVehiculo() {
    const codigo = document.getElementById("codigo").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const anioTexto = document.getElementById("anio").value;
    const color = document.getElementById("color").value.trim();
    const combustible = document.getElementById("combustible").value;
    const precioTexto = document.getElementById("precio").value;
    const cantidadTexto = document.getElementById("cantidad").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const inputFoto = document.getElementById("fotoVehiculo");

    if (!codigo || !marca || !modelo || !anioTexto || !color || !combustible || !precioTexto || !cantidadTexto || !descripcion) {
        mostrarMensaje("Todos los campos de texto son obligatorios.", true);
        return;
    }

    if (indiceEditando === -1 && inputFoto.files.length === 0) {
        mostrarMensaje("Debes seleccionar una fotografía para el vehículo.", true);
        return;
    }

    const anio = Number(anioTexto);
    const precio = Number(precioTexto);
    const cantidad = Number(cantidadTexto);
    const anioActual = new Date().getFullYear();

    if (!Number.isInteger(anio) || anio < 2000 || anio > anioActual + 1) {
        mostrarMensaje("Introduce un año válido.", true);
        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        mostrarMensaje("El precio debe ser mayor que cero.", true);
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad < 0) {
        mostrarMensaje("La cantidad debe ser un número entero válido.", true);
        return;
    }

    for (let i = 0; i < vehiculos.length; i++) {
        if (i !== indiceEditando && vehiculos[i].codigo.toLowerCase() === codigo.toLowerCase()) {
            mostrarMensaje("Ya existe un vehículo con ese código.", true);
            return;
        }
    }

    function guardarConImagen(urlImagen) {
        const vehiculo = {
            codigo,
            marca,
            modelo,
            anio,
            color,
            combustible,
            precio,
            cantidad,
            descripcion,
            foto: urlImagen || (indiceEditando !== -1 ? vehiculos[indiceEditando].foto : "")
        };

        const copia = vehiculos.slice();
        const editando = indiceEditando !== -1;

        if (editando) {
            copia[indiceEditando] = vehiculo;
        } else {
            copia.push(vehiculo);
        }

        if (!guardarDatos(copia)) {
            return;
        }

        vehiculos = copia;
        limpiarFormulario();
        mostrarVehiculos();

        mostrarMensaje(
            editando ? "Vehículo actualizado correctamente." : "Vehículo registrado correctamente.",
            false
        );

        document.getElementById("inventario").scrollIntoView({ behavior: "smooth" });
    }

    if (inputFoto.files && inputFoto.files[0]) {
        const lector = new FileReader();
        lector.onload = function (e) {
            guardarConImagen(e.target.result);
        };
        lector.onerror = function () {
            mostrarMensaje("Error al leer el archivo de imagen.", true);
        };
        lector.readAsDataURL(inputFoto.files[0]);
    } else {
        guardarConImagen("");
    }
}

// MOSTRAR VEHÍCULOS EN FORMATO TARJETA
function mostrarVehiculos() {
    const contenedor = document.getElementById("contenedorTarjetas");
    contenedor.innerHTML = "";

    const textoBuscado = buscar.value.toLowerCase().trim();
    const lista = [];

    for (let i = 0; i < vehiculos.length; i++) {
        const v = vehiculos[i];
        const texto = (v.codigo + " " + v.marca + " " + v.modelo).toLowerCase();
        if (texto.includes(textoBuscado)) {
            lista.push({ vehiculo: v, indice: i });
        }
    }

    document.getElementById("contadorResultados").textContent =
        lista.length + (lista.length === 1 ? " vehículo encontrado" : " vehículos encontrados");

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--suave);">
                ${vehiculos.length === 0 ? "No hay vehículos registrados." : "No hay vehículos que coincidan con la búsqueda."}
            </div>
        `;
        return;
    }

    for (let i = 0; i < lista.length; i++) {
        const v = lista[i].vehiculo;
        const indice = lista[i].indice;

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-vehiculo";

        const img = document.createElement("img");
        img.className = "tarjeta-imagen";
        img.src = v.foto || "./img/mustang-gt500.jpg";
        img.alt = v.modelo;
        tarjeta.appendChild(img);

        const cuerpo = document.createElement("div");
        cuerpo.className = "tarjeta-cuerpo";

        cuerpo.innerHTML = `
            <span class="tarjeta-codigo">Cód: ${v.codigo}</span>
            <h3 class="tarjeta-titulo">${v.marca} ${v.modelo}</h3>
            <div class="tarjeta-info">
                <span>Año: <strong>${v.anio}</strong></span>
                <span>Color: <strong>${v.color}</strong></span>
                <span>Combustible: <strong>${v.combustible}</strong></span>
                <span>Disp: <strong>${v.cantidad}</strong></span>
            </div>
            <p style="font-size: 12px; color: var(--suave); margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${v.descripcion}
            </p>
            <div class="tarjeta-precio">${formatoPrecio(v.precio)}</div>
        `;
        tarjeta.appendChild(cuerpo);

        const acciones = document.createElement("div");
        acciones.className = "tarjeta-acciones";

        crearBotonAccion(acciones, "Editar", function () {
            editarVehiculo(indice);
        }, "accion");

        crearBotonAccion(acciones, "Eliminar", function () {
            eliminarVehiculo(indice);
        }, "accion peligro");

        tarjeta.appendChild(acciones);
        contenedor.appendChild(tarjeta);
    }
}

function crearBotonAccion(contenedor, titulo, accion, clase) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = titulo;
    boton.className = clase;
    boton.addEventListener("click", accion);
    contenedor.appendChild(boton);
}

function formatoPrecio(precio) {
    return "RD$ " + Number(precio).toLocaleString("es-DO", { maximumFractionDigits: 2 });
}

// EDITAR VEHÍCULO
function editarVehiculo(indice) {
    const v = vehiculos[indice];
    if (!v) return;

    document.getElementById("codigo").value = v.codigo;
    document.getElementById("marca").value = v.marca;
    document.getElementById("modelo").value = v.modelo;
    document.getElementById("anio").value = v.anio;
    document.getElementById("color").value = v.color;
    document.getElementById("combustible").value = v.combustible;
    document.getElementById("precio").value = v.precio;
    document.getElementById("cantidad").value = v.cantidad;
    document.getElementById("descripcion").value = v.descripcion || "";

    indiceEditando = indice;
    btnGuardar.textContent = "Guardar cambios";
    btnCancelar.hidden = false;

    document.getElementById("tituloFormulario").innerHTML = "Editar <span>vehículo</span>";
    document.getElementById("registro").scrollIntoView({ behavior: "smooth" });
}

// ELIMINAR VEHÍCULO
function eliminarVehiculo(indice) {
    const v = vehiculos[indice];
    if (!v) return;

    const respuesta = confirm("¿Deseas eliminar el vehículo " + v.codigo + "?");
    if (!respuesta) return;

    const copia = vehiculos.slice();
    copia.splice(indice, 1);

    if (!guardarDatos(copia)) return;

    vehiculos = copia;
    limpiarFormulario();
    mostrarVehiculos();
    mostrarMensaje("Vehículo eliminado correctamente.", false);
}

function limpiarFormulario() {
    formulario.reset();
    indiceEditando = -1;
    btnGuardar.textContent = "Registrar vehículo";
    btnCancelar.hidden = true;
    document.getElementById("tituloFormulario").innerHTML = "Registrar <span>vehículo</span>";
}

// EVENTOS
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    registrarVehiculo();
});

btnCancelar.addEventListener("click", limpiarFormulario);
buscar.addEventListener("input", mostrarVehiculos);

// CARGAR AL ABRIR LA PÁGINA
mostrarVehiculos();