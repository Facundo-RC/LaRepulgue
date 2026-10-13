// Carga de datos, dibujo de la página y eventos del usuario

let menuEmpanadas = [];
let sucursales = [];

const alerta = Swal.mixin({
    confirmButtonColor: '#7A3E1D',
    cancelButtonColor: '#A89888'
});

function formatearPrecio(numero) {
    return numero.toLocaleString('es-UY');
}

async function cargarDatos() {
    const estadoCarga = document.getElementById('estado-carga');

    try {
        const respuestaEmpanadas = await fetch('data/empanadas.json');
        const respuestaSucursales = await fetch('data/sucursales.json');

        if (!respuestaEmpanadas.ok || !respuestaSucursales.ok) {
            throw new Error('No se pudieron leer los archivos de datos');
        }

        menuEmpanadas = await respuestaEmpanadas.json();
        sucursales = await respuestaSucursales.json();

        mostrarEmpanadas(menuEmpanadas);
        mostrarSucursales();
    } catch {
        const contenedor = document.getElementById('contenedor-empanadas');
        contenedor.innerHTML = '<p class="text-danger">No pudimos cargar el menú. Intentá de nuevo más tarde.</p>';
    } finally {
        estadoCarga.remove();
    }
}

function mostrarEmpanadas(empanadas) {
    const contenedor = document.getElementById('contenedor-empanadas');
    contenedor.innerHTML = '';

    empanadas.forEach((empanada) => {
        const { nombre, precio, descripcion, imagen } = empanada;

        const columna = document.createElement('div');
        columna.className = 'col-12 col-md-6 col-lg-3';
        columna.innerHTML = `
            <div class="card h-100 text-center">
                <div class="foto">
                    <img src="${imagen}" alt="Empanada de ${nombre}">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${nombre}</h3>
                    <p class="card-text">${descripcion}</p>
                    <p class="fw-bold">Precio: $${formatearPrecio(precio)}</p>
                    <button class="btn boton-agregar"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                </div>
            </div>
        `;
        contenedor.appendChild(columna);

        const botonAgregar = columna.querySelector('button');
        botonAgregar.addEventListener('click', () => {
            agregarAlPedido(empanada);
            mostrarPedido();
            avisarAgregado(nombre);
        });
    });
}

function filtrarEmpanadas(categoria) {
    const empanadasFiltradas = categoria === 'todos'
        ? menuEmpanadas
        : menuEmpanadas.filter((empanada) => empanada.categoria === categoria);

    mostrarEmpanadas(empanadasFiltradas);
}

function mostrarSucursales() {
    const selectorSucursal = document.getElementById('sucursal-elegida');

    selectorSucursal.innerHTML = sucursales
        .map(({ id, nombre, direccion, horario }) => `<option value="${id}">${nombre} - ${direccion} (${horario})</option>`)
        .join('');
}

function obtenerTipoEntrega() {
    return document.querySelector('input[name="tipo-entrega"]:checked').value;
}

function cambiarTipoEntrega() {
    const esEnvio = obtenerTipoEntrega() === 'envio';

    document.getElementById('campo-direccion').classList.toggle('d-none', !esEnvio);
    document.getElementById('campo-sucursal').classList.toggle('d-none', esEnvio);

    mostrarPedido();
}

function mostrarPedido() {
    const listaPedido = document.getElementById('lista-pedido');

    listaPedido.innerHTML = pedido.length === 0 ? '<p class="text-muted">Todavía no agregaste empanadas.</p>' : '';

    pedido.forEach((item) => {
        const { id, nombre, precio, cantidad } = item;

        const fila = document.createElement('div');
        fila.className = 'd-flex justify-content-between align-items-center border-bottom py-2';
        fila.innerHTML = `
            <span>${nombre}</span>
            <div class="d-flex align-items-center gap-3">
                <div class="selector-cantidad">
                    <button class="btn-restar" aria-label="Quitar una"><i class="bi bi-dash"></i></button>
                    <span>${cantidad}</span>
                    <button class="btn-sumar" aria-label="Agregar una"><i class="bi bi-plus"></i></button>
                </div>
                <span class="fw-bold precio-item">$${formatearPrecio(precio * cantidad)}</span>
                <button class="boton-icono btn-eliminar" aria-label="Eliminar ${nombre}"><i class="bi bi-trash3"></i></button>
            </div>
        `;
        listaPedido.appendChild(fila);

        fila.querySelector('.btn-restar').addEventListener('click', () => {
            cambiarCantidad(id, -1);
            mostrarPedido();
        });
        fila.querySelector('.btn-sumar').addEventListener('click', () => {
            cambiarCantidad(id, 1);
            mostrarPedido();
        });
        fila.querySelector('.btn-eliminar').addEventListener('click', () => {
            eliminarDelPedido(id);
            mostrarPedido();
        });
    });

    const subtotal = calcularSubtotal();
    const envio = calcularEnvio(obtenerTipoEntrega());

    document.getElementById('subtotal-pedido').textContent = formatearPrecio(subtotal);
    document.getElementById('envio-pedido').textContent = formatearPrecio(envio);
    document.getElementById('total-pedido').textContent = formatearPrecio(subtotal + envio);
    document.getElementById('contador-pedido').textContent = contarEmpanadas();
}

function avisarAgregado(nombreEmpanada) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${nombreEmpanada} agregada al pedido`,
        showConfirmButton: false,
        timer: 1500
    });
}

async function pedirVaciarPedido() {
    if (pedido.length === 0) {
        alerta.fire({ icon: 'info', title: 'Tu pedido ya está vacío' });
        return;
    }

    const resultado = await alerta.fire({
        icon: 'warning',
        title: '¿Vaciar el pedido?',
        text: 'Se van a quitar todas las empanadas.',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
        vaciarPedido();
        mostrarPedido();
    }
}

function validarEntrega() {
    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const direccionCliente = document.getElementById('direccion-cliente').value.trim();

    if (pedido.length === 0) {
        return 'Agregá al menos una empanada para confirmar.';
    }
    if (nombreCliente === '') {
        return 'Escribí tu nombre para saber de quién es el pedido.';
    }
    if (obtenerTipoEntrega() === 'envio' && direccionCliente === '') {
        return 'Escribí la dirección de envío.';
    }
    if (obtenerTipoEntrega() === 'retiro' && sucursales.length === 0) {
        return 'No hay sucursales disponibles para retirar. Elegí envío a domicilio.';
    }
    return '';
}

function describirEntrega() {
    if (obtenerTipoEntrega() === 'envio') {
        const direccionCliente = document.getElementById('direccion-cliente').value.trim();
        return `Envío a ${direccionCliente}`;
    }

    const idSucursal = Number(document.getElementById('sucursal-elegida').value);
    const sucursal = sucursales.find((local) => local.id === idSucursal);
    return `Retiro en ${sucursal.nombre} (${sucursal.direccion})`;
}

async function confirmarPedido() {
    const mensajeError = validarEntrega();

    if (mensajeError) {
        alerta.fire({ icon: 'info', title: 'Falta un dato', text: mensajeError });
        return;
    }

    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const total = calcularSubtotal() + calcularEnvio(obtenerTipoEntrega());
    const cantidadEmpanadas = contarEmpanadas();
    const textoCantidad = `${cantidadEmpanadas} ${cantidadEmpanadas === 1 ? 'empanada' : 'empanadas'}`;

    const resultado = await alerta.fire({
        icon: 'question',
        title: `${nombreCliente}, ¿confirmás tu pedido?`,
        html: `${textoCantidad} por un total de <b>$${formatearPrecio(total)}</b><br>${describirEntrega()}`,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Seguir eligiendo'
    });

    if (resultado.isConfirmed) {
        const descripcionEntrega = describirEntrega();
        vaciarPedido();
        mostrarPedido();
        document.getElementById('form-entrega').reset();
        cambiarTipoEntrega();

        alerta.fire({
            icon: 'success',
            title: '¡Pedido confirmado!',
            text: `${descripcionEntrega}. ¡Gracias por elegir La Repulgue!`
        });
    }
}

const botonesFiltro = document.querySelectorAll('#filtros button');
botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
        botonesFiltro.forEach((botonFiltro) => botonFiltro.classList.remove('active'));
        boton.classList.add('active');
        filtrarEmpanadas(boton.dataset.categoria);
    });
});

document.querySelectorAll('input[name="tipo-entrega"]').forEach((opcion) => {
    opcion.addEventListener('change', cambiarTipoEntrega);
});

document.getElementById('btn-vaciar').addEventListener('click', pedirVaciarPedido);
document.getElementById('btn-confirmar').addEventListener('click', confirmarPedido);

cargarDatos();
cambiarTipoEntrega();
