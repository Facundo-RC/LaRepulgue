// Lógica del pedido y su guardado en localStorage (no toca la página)

const COSTO_ENVIO = 500;

function leerPedidoGuardado() {
    try {
        return JSON.parse(localStorage.getItem('pedido')) || [];
    } catch {
        localStorage.removeItem('pedido');
        return [];
    }
}

let pedido = leerPedidoGuardado();

function guardarPedido() {
    localStorage.setItem('pedido', JSON.stringify(pedido));
}

function agregarAlPedido(empanada) {
    const empanadaEnPedido = pedido.find((item) => item.id === empanada.id);

    if (empanadaEnPedido) {
        empanadaEnPedido.cantidad++;
    } else {
        const { id, nombre, precio } = empanada;
        pedido.push({ id, nombre, precio, cantidad: 1 });
    }

    guardarPedido();
}

function cambiarCantidad(id, cambio) {
    const empanadaEnPedido = pedido.find((item) => item.id === id);
    empanadaEnPedido.cantidad += cambio;

    if (empanadaEnPedido.cantidad <= 0) {
        eliminarDelPedido(id);
        return;
    }

    guardarPedido();
}

function eliminarDelPedido(id) {
    pedido = pedido.filter((item) => item.id !== id);
    guardarPedido();
}

function vaciarPedido() {
    pedido = [];
    localStorage.removeItem('pedido');
}

function contarEmpanadas() {
    return pedido.reduce((acumulado, item) => acumulado + item.cantidad, 0);
}

function calcularSubtotal() {
    return pedido.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
}

function calcularEnvio(tipoEntrega) {
    return tipoEntrega === 'envio' && pedido.length > 0 ? COSTO_ENVIO : 0;
}
