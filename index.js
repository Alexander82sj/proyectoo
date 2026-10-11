
 // AUTOMAX TUNING - JAVASCRIPT COMPLETO

// 1. ELEMENTOS DEL HTML

const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tablaVehiculos");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const buscar = document.getElementById("buscar");
const filtroCombustible = document.getElementById("filtroCombustible");
const ordenar = document.getElementById("ordenar");
const modal = document.getElementById("modalDetalles");


// 2. RECUPERAR VEHÍCULOS

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

document.getElementById("anio").max =
    new Date().getFullYear() + 1;


// 3. GALERÍA DE IMÁGENES

const fotos = [
    {
        archivo: "./img/mustang-gt500.jpg",
        nombre: "Mustang GT500",
        alt: "Mustang naranja modificado"
    },
    {
        archivo: "./img/porsche-cayman.jpg",
        nombre: "Porsche Cayman",
        alt: "Porsche Cayman blanco"
    },
    {
        archivo: "./img/ford-raptor.jpg",
        nombre: "Ford Raptor",
        alt: "Ford Raptor modificada"
    },
    {
        archivo: "./img/rolls-royce-ghost.jpg",
        nombre: "Rolls-Royce Ghost",
        alt: "Rolls-Royce Ghost"
    }
];

let fotoActual = 0;


// CAMBIAR FOTO PRINCIPAL

function cambiarFoto(posicion) {

    if (posicion < 0) {
        posicion = fotos.length - 1;
    }

    if (posicion >= fotos.length) {
        posicion = 0;
    }

    fotoActual = posicion;

    document.getElementById("heroImagen").src =
        fotos[posicion].archivo;

    document.getElementById("heroImagen").alt =
        fotos[posicion].alt;

    document.getElementById("nombreSlide").textContent =
        fotos[posicion].nombre;

    document.getElementById("numeroSlide").textContent =
        String(posicion + 1).padStart(2, "0") +
        " / " +
        String(fotos.length).padStart(2, "0");
}


// BOTÓN ANTERIOR

document.getElementById("anterior").addEventListener("click", function () {

    cambiarFoto(fotoActual - 1);

});


// BOTÓN SIGUIENTE

document.getElementById("siguiente").addEventListener("click", function () {

    cambiarFoto(fotoActual + 1);

});


// 4. CORREGIR EL BOTÓN INICIO

const enlacesInicio = document.querySelectorAll('a[href="#inicio"]');

for (let i = 0; i < enlacesInicio.length; i++) {

    enlacesInicio[i].addEventListener("click", function (evento) {

        evento.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
}


// 5. VISOR DE FOTOGRAFÍAS

// CREAR ESTILOS DEL VISOR DESDE JAVASCRIPT

const estilosVisor = document.createElement("style");

estilosVisor.textContent = `

    #visorFotosAutoMax {
        width: min(1080px, 95vw);
        max-height: 94vh;
        margin: auto;
        padding: 0;
        border: 1px solid #444c55;
        border-radius: 12px;
        background: #0b0e12;
        color: white;
        box-shadow: 0 20px 70px #000b;
        overflow: hidden;
    }

    #visorFotosAutoMax::backdrop {
        background: #000e;
    }

    #visorFotosAutoMax .visor-imagen {
        display: block;
        width: 100%;
        max-height: 78vh;
        object-fit: contain;
        background: #05070a;
    }

    #visorFotosAutoMax .visor-pie {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        padding: 13px;
        font-family: Arial, sans-serif;
    }

    #visorFotosAutoMax .visor-titulo {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #ff722f;
    }

    #visorFotosAutoMax button {
        border: 1px solid #888;
        background: #232a33;
        color: white;
        border-radius: 6px;
        padding: 8px 13px;
        cursor: pointer;
    }

    #visorFotosAutoMax button:hover {
        background: #ff722f;
        color: #111;
    }

    #visorFotosAutoMax .visor-cerrar {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 2;
        font-size: 22px;
        background: #111c;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        padding: 0;
    }

    @media (max-width: 650px) {
        #visorFotosAutoMax .visor-imagen {
            max-height: 70vh;
        }

        #visorFotosAutoMax .visor-titulo {
            font-size: 14px;
        }
    }
`;

document.head.appendChild(estilosVisor);


// CREAR VENTANA DE IMÁGENES

const visorGaleria = document.createElement("dialog");

visorGaleria.id = "visorFotosAutoMax";

visorGaleria.setAttribute(
    "aria-label",
    "Fotografía ampliada del vehículo"
);

visorGaleria.innerHTML = `
    <button type="button" class="visor-cerrar" aria-label="Cerrar fotografía">
        ×
    </button>

    <img class="visor-imagen" alt="Vehículo seleccionado">

    <div class="visor-pie">
        <button type="button" class="visor-anterior" aria-label="Foto anterior">❮</button>

        <span class="visor-titulo"></span>

        <button type="button" class="visor-siguiente" aria-label="Foto siguiente">❯</button>
    </div>
`;

document.body.appendChild(visorGaleria);


// ELEMENTOS DE LA VENTANA

const imagenVisor = visorGaleria.querySelector(".visor-imagen");

const tituloVisor = visorGaleria.querySelector(".visor-titulo");

let indiceVisor = 0;


// FUNCIÓN PARA ACTUALIZAR EL VISOR

function actualizarVisor(indice) {

    if (indice < 0) {
        indice = fotos.length - 1;
    }

    if (indice >= fotos.length) {
        indice = 0;
    }

    indiceVisor = indice;

    imagenVisor.src = fotos[indice].archivo;

    imagenVisor.alt = fotos[indice].alt;

    tituloVisor.textContent = fotos[indice].nombre;

    cambiarFoto(indice);
}


// ABRIR FOTO AL HACER CLIC EN EL SHOWROOM

const botonesGaleria = document.querySelectorAll(".foto-galeria");

for (let i = 0; i < botonesGaleria.length; i++) {

    botonesGaleria[i].addEventListener("click", function () {

        const indice = Number(this.dataset.slide);

        if (
            !Number.isInteger(indice) ||
            indice < 0 ||
            indice >= fotos.length
        ) {
            return;
        }

        actualizarVisor(indice);

        if (!visorGaleria.open) {
            visorGaleria.showModal();
        }

    });
}


// CERRAR FOTO

visorGaleria.querySelector(".visor-cerrar").addEventListener("click", function () {

    visorGaleria.close();

});


// FOTO ANTERIOR

visorGaleria.querySelector(".visor-anterior").addEventListener("click", function () {

    actualizarVisor(indiceVisor - 1);

});


// FOTO SIGUIENTE

visorGaleria.querySelector(".visor-siguiente").addEventListener("click", function () {

    actualizarVisor(indiceVisor + 1);

});


// CERRAR HACIENDO CLIC FUERA

visorGaleria.addEventListener("click", function (evento) {

    if (evento.target === visorGaleria) {
        visorGaleria.close();
    }

});


// CAMBIAR FOTO AUTOMÁTICAMENTE CADA 7 SEGUNDOS

setInterval(function () {

    if (!visorGaleria.open) {
        cambiarFoto(fotoActual + 1);
    }

}, 7000);


// 6. NOTIFICACIONES

function mostrarMensaje(texto, error) {

    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = texto;

    mensaje.className = error
        ? "mensaje visible error"
        : "mensaje visible";

    clearTimeout(tiempoMensaje);

    tiempoMensaje = setTimeout(function () {

        mensaje.className = "mensaje";

    }, 3600);
}


// 7. GUARDAR EN LOCALSTORAGE

function guardarDatos(lista) {

    try {

        localStorage.setItem(
            "vehiculos",
            JSON.stringify(lista)
        );

        return true;

    } catch (error) {

        mostrarMensaje(
            "No se pudieron guardar los datos en este navegador.",
            true
        );

        return false;
    }
}


// 8. REGISTRAR O ACTUALIZAR VEHÍCULO

function registrarVehiculo() {

    // OBTENER DATOS DEL FORMULARIO

    const codigo = document.getElementById("codigo").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const anioTexto = document.getElementById("anio").value;
    const color = document.getElementById("color").value.trim();
    const combustible = document.getElementById("combustible").value;
    const precioTexto = document.getElementById("precio").value;
    const cantidadTexto = document.getElementById("cantidad").value;
    const descripcion = document.getElementById("descripcion").value.trim();


    // VALIDAR CAMPOS VACÍOS

    if (
        !codigo ||
        !marca ||
        !modelo ||
        !anioTexto ||
        !color ||
        !combustible ||
        !precioTexto ||
        !cantidadTexto ||
        !descripcion
    ) {

        mostrarMensaje("Todos los campos son obligatorios.", true);

        return;
    }


    // CONVERTIR VALORES NUMÉRICOS

    const anio = Number(anioTexto);
    const precio = Number(precioTexto);
    const cantidad = Number(cantidadTexto);

    const anioActual = new Date().getFullYear();


    // VALIDAR AÑO

    if (
        !Number.isInteger(anio) ||
        anio < 2000 ||
        anio > anioActual + 1
    ) {

        mostrarMensaje("Introduce un año válido.", true);

        return;
    }


    // VALIDAR PRECIO

    if (!Number.isFinite(precio) || precio <= 0) {

        mostrarMensaje(
            "El precio debe ser mayor que cero.",
            true
        );

        return;
    }


    // VALIDAR CANTIDAD

    if (!Number.isInteger(cantidad) || cantidad < 0) {

        mostrarMensaje(
            "La cantidad debe ser un entero mayor o igual a cero.",
            true
        );

        return;
    }


    // EVITAR CÓDIGOS REPETIDOS

    for (let i = 0; i < vehiculos.length; i++) {

        if (
            i !== indiceEditando &&
            vehiculos[i].codigo.toLowerCase() === codigo.toLowerCase()
        ) {

            mostrarMensaje(
                "Ya existe un vehículo con ese código.",
                true
            );

            return;
        }
    }


    // CREAR OBJETO VEHÍCULO

    const vehiculo = {
        codigo,
        marca,
        modelo,
        anio,
        color,
        combustible,
        precio,
        cantidad,
        descripcion
    };


    // PREPARAR REGISTRO O ACTUALIZACIÓN

    const copia = vehiculos.slice();

    const editando = indiceEditando !== -1;

    if (editando) {

        copia[indiceEditando] = vehiculo;

    } else {

        copia.push(vehiculo);

    }


    // GUARDAR CAMBIOS

    if (!guardarDatos(copia)) {
        return;
    }

    vehiculos = copia;

    limpiarFormulario();

    mostrarVehiculos();

    actualizarEstadisticas();


    // MOSTRAR RESULTADO

    if (editando) {

        mostrarMensaje(
            "Vehículo actualizado correctamente.",
            false
        );

    } else {

        mostrarMensaje(
            "Vehículo registrado correctamente.",
            false
        );

    }


    document.getElementById("inventario").scrollIntoView({
        behavior: "smooth"
    });
}


// 9. MOSTRAR VEHÍCULOS Y FILTROS

function mostrarVehiculos() {

    tabla.innerHTML = "";

    const textoBuscado = buscar.value.toLowerCase().trim();

    const combustibleBuscado = filtroCombustible.value;

    const lista = [];


    // BUSCAR REGISTROS

    for (let i = 0; i < vehiculos.length; i++) {

        const v = vehiculos[i];

        const texto = (
            v.codigo + " " +
            v.marca + " " +
            v.modelo
        ).toLowerCase();

        if (
            texto.includes(textoBuscado) &&
            (
                combustibleBuscado === "" ||
                v.combustible === combustibleBuscado
            )
        ) {

            lista.push({
                vehiculo: v,
                indice: i
            });

        }
    }


    // ORDENAR

    if (ordenar.value === "precioAsc") {

        lista.sort(function (a, b) {
            return a.vehiculo.precio - b.vehiculo.precio;
        });

    } else if (ordenar.value === "precioDesc") {

        lista.sort(function (a, b) {
            return b.vehiculo.precio - a.vehiculo.precio;
        });

    } else if (ordenar.value === "anioDesc") {

        lista.sort(function (a, b) {
            return b.vehiculo.anio - a.vehiculo.anio;
        });

    } else {

        lista.reverse();

    }


    // CONTADOR

    document.getElementById("contadorResultados").textContent =
        lista.length +
        (lista.length === 1
            ? " vehículo encontrado"
            : " vehículos encontrados");


    // SIN REGISTROS

    if (lista.length === 0) {

        const fila = document.createElement("tr");

        const celda = document.createElement("td");

        celda.colSpan = 9;

        celda.className = "sinDatos";

        celda.textContent = vehiculos.length === 0
            ? "No hay vehículos registrados. Agrega el primero en el formulario."
            : "No hay vehículos que coincidan con los filtros.";

        fila.appendChild(celda);

        tabla.appendChild(fila);

        return;
    }


    // CREAR TABLA

    for (let i = 0; i < lista.length; i++) {

        const v = lista[i].vehiculo;

        const indice = lista[i].indice;

        const fila = document.createElement("tr");

        const datos = [
            v.codigo,
            v.marca,
            v.modelo,
            v.anio,
            v.color,
            v.combustible,
            formatoPrecio(v.precio)
        ];


        for (let j = 0; j < datos.length; j++) {

            const celda = document.createElement("td");

            celda.textContent = datos[j];

            fila.appendChild(celda);
        }


        // CANTIDAD DISPONIBLE

        const celdaCantidad = document.createElement("td");

        const estado = document.createElement("span");

        estado.className = Number(v.cantidad) === 0
            ? "estado-stock agotado"
            : "estado-stock";

        estado.textContent = Number(v.cantidad) === 0
            ? "Agotado"
            : v.cantidad + " disp.";

        celdaCantidad.appendChild(estado);

        fila.appendChild(celdaCantidad);


        // BOTONES VER, EDITAR Y ELIMINAR

        const acciones = document.createElement("td");

        acciones.className = "acciones-tabla";


        crearBotonAccion(
            acciones,
            "Ver",
            function () {
                verDetalles(indice);
            },
            "accion"
        );


        crearBotonAccion(
            acciones,
            "Editar",
            function () {
                editarVehiculo(indice);
            },
            "accion"
        );


        crearBotonAccion(
            acciones,
            "Eliminar",
            function () {
                eliminarVehiculo(indice);
            },
            "accion peligro"
        );


        fila.appendChild(acciones);

        tabla.appendChild(fila);
    }
}


// CREAR BOTONES DE ACCIÓN

function crearBotonAccion(contenedor, titulo, accion, clase) {

    const boton = document.createElement("button");

    boton.type = "button";

    boton.textContent = titulo;

    boton.className = clase;

    boton.addEventListener("click", accion);

    contenedor.appendChild(boton);
}


// FORMATO DE PRECIO

function formatoPrecio(precio) {

    return "RD$ " + Number(precio).toLocaleString("es-DO", {
        maximumFractionDigits: 2
    });
}


// 10. ESTADÍSTICAS

function actualizarEstadisticas() {

    let unidades = 0;

    const marcas = [];

    for (let i = 0; i < vehiculos.length; i++) {

        unidades += Number(vehiculos[i].cantidad) || 0;

        const marca = String(vehiculos[i].marca)
            .trim()
            .toLowerCase();

        if (!marcas.includes(marca)) {

            marcas.push(marca);
        }
    }

    document.getElementById("totalModelos").textContent =
        vehiculos.length;

    document.getElementById("totalUnidades").textContent =
        unidades;

    document.getElementById("totalMarcas").textContent =
        marcas.length;
}


// 11. EDITAR VEHÍCULO

function editarVehiculo(indice) {

    const v = vehiculos[indice];

    if (!v) {
        return;
    }

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

    btnGuardar.textContent = "Guardar cambios ↗";

    btnCancelar.hidden = false;

    document.getElementById("tituloFormulario").innerHTML =
        "Editar <span>vehículo</span>";

    document.getElementById("registro").scrollIntoView({
        behavior: "smooth"
    });
}


// 12. ELIMINAR VEHÍCULO

function eliminarVehiculo(indice) {

    const v = vehiculos[indice];

    if (!v) {
        return;
    }

    const respuesta = confirm(
        "¿Deseas eliminar el vehículo " + v.codigo + "?"
    );

    if (!respuesta) {
        return;
    }

    const copia = vehiculos.slice();

    copia.splice(indice, 1);

    if (!guardarDatos(copia)) {
        return;
    }

    vehiculos = copia;

    limpiarFormulario();

    mostrarVehiculos();

    actualizarEstadisticas();

    mostrarMensaje(
        "Vehículo eliminado correctamente.",
        false
    );
}


// LIMPIAR FORMULARIO

function limpiarFormulario() {

    formulario.reset();

    indiceEditando = -1;

    btnGuardar.textContent = "Registrar vehículo ↗";

    btnCancelar.hidden = true;

    document.getElementById("tituloFormulario").innerHTML =
        "Registrar <span>vehículo</span>";
}


// 13. BUSCAR FOTO DE VEHÍCULO

function buscarFotoVehiculo(v) {

    const texto = (
        v.marca + " " + v.modelo
    ).toLowerCase();

    if (texto.includes("mustang")) {
        return fotos[0].archivo;
    }

    if (texto.includes("porsche")) {
        return fotos[1].archivo;
    }

    if (texto.includes("raptor")) {
        return fotos[2].archivo;
    }

    if (
        texto.includes("rolls") ||
        texto.includes("ghost")
    ) {
        return fotos[3].archivo;
    }

    return "";
}


// 14. VER DETALLES DEL VEHÍCULO

function verDetalles(indice) {

    const v = vehiculos[indice];

    if (!v) {
        return;
    }

    document.getElementById("detalleTitulo").textContent =
        v.marca + " " + v.modelo;

    document.getElementById("detalleDescripcion").textContent =
        v.descripcion || "Sin descripción";

    const imagen = document.getElementById("imagenDetalle");

    const foto = buscarFotoVehiculo(v);

    if (foto) {

        imagen.style.backgroundImage =
            "linear-gradient(0deg,#0008,#0002),url('" + foto + "')";

    } else {

        imagen.style.backgroundImage = "";

    }

    document.getElementById("textoImagenDetalle").textContent =
        foto ? "IMAGEN DE REFERENCIA" : "AUTOMAX TUNING";

    const datos = document.getElementById("detalleDatos");

    datos.innerHTML = "";

    const campos = [
        ["Código", v.codigo],
        ["Año", v.anio],
        ["Color", v.color],
        ["Combustible", v.combustible],
        ["Precio", formatoPrecio(v.precio)],
        ["Cantidad", v.cantidad]
    ];

    for (let i = 0; i < campos.length; i++) {

        const caja = document.createElement("div");

        const etiqueta = document.createElement("small");

        etiqueta.textContent = campos[i][0];

        const valor = document.createElement("strong");

        valor.textContent = campos[i][1];

        caja.appendChild(etiqueta);

        caja.appendChild(valor);

        datos.appendChild(caja);
    }

    modal.showModal();
}


// 15. EVENTOS DEL SISTEMA

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    registrarVehiculo();
});

btnCancelar.addEventListener("click", limpiarFormulario);

buscar.addEventListener("input", mostrarVehiculos);

filtroCombustible.addEventListener("change", mostrarVehiculos);

ordenar.addEventListener("change", mostrarVehiculos);


// LIMPIAR FILTROS

document.getElementById("limpiarFiltros").addEventListener("click", function () {

    buscar.value = "";

    filtroCombustible.value = "";

    ordenar.value = "recientes";

    mostrarVehiculos();
});


// CERRAR FICHA DEL VEHÍCULO

document.getElementById("cerrarModal").addEventListener("click", function () {

    modal.close();
});

modal.addEventListener("click", function (evento) {

    if (evento.target === modal) {
        modal.close();
    }
});


// 16. CARGAR REGISTROS AL ABRIR LA PÁGINA

mostrarVehiculos();

actualizarEstadisticas();
