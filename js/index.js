// ============================
// CARRITO DE LA FLORISTERÍA
// ============================

let carrito = [];

// Añadir producto
function addToCart(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    renderCarrito();
}

// Renderizar carrito
function renderCarrito() {
    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");

    if (!listaCarrito || !totalCarrito) return;

    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.innerHTML = `
            <span>
                ${item.nombre} x${item.cantidad}
            </span>
            <span>
                ${(item.precio * item.cantidad).toFixed(2)} €
                <button onclick="removeFromCart(${index})">❌</button>
            </span>
        `;
        listaCarrito.appendChild(div);
    });

    totalCarrito.textContent = total.toFixed(2) + " €";
}

// Eliminar producto
function removeFromCart(index) {
    carrito.splice(index, 1);
    renderCarrito();
}

// Finalizar pedido (opcional)
document.addEventListener("DOMContentLoaded", () => {
    const finalizarBtn = document.getElementById("finalizarPedido");

    if (finalizarBtn) {
        finalizarBtn.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío 🌸");
                return;
            }

            alert("Pedido realizado con éxito 💐");
            carrito = [];
            renderCarrito();
        });
    }
});
