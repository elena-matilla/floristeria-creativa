let carrito = [];

// =====================
// AÑADIR AL CARRITO
// =====================
function addToCart(nombre, precio) {
    const producto = carrito.find(p => p.nombre === nombre);

    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    renderCarrito();
}

// =====================
// MOSTRAR CARRITO
// =====================
function renderCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalDiv = document.getElementById("totalCarrito");

    if (!lista || !totalDiv) return;

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.innerHTML = `
            <span>${item.nombre} x${item.cantidad}</span>
            <span>
                ${(item.precio * item.cantidad).toFixed(2)} €
                <button onclick="removeFromCart(${index})">❌</button>
            </span>
        `;
        lista.appendChild(div);
    });

    totalDiv.textContent = total.toFixed(2) + " €";
}

// =====================
// ELIMINAR PRODUCTO
// =====================
function removeFromCart(index) {
    carrito.splice(index, 1);
    renderCarrito();
}

// =====================
// ENVIAR PEDIDO POR WHATSAPP
// =====================
document.getElementById("formPedido").addEventListener("submit", function (e) {
    e.preventDefault();

    if (carrito.length === 0) {
        alert("El carrito está vacío 🌸");
        return;
    }

    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const nota = document.getElementById("nota").value;

    let mensaje = `🌸 *Nuevo pedido floristería* 🌸%0A%0A`;
    mensaje += `👤 *Nombre:* ${nombre}%0A`;
    mensaje += `📍 *Dirección:* ${direccion}%0A`;
    mensaje += `📞 *Teléfono:* ${telefono}%0A`;
    if (nota) mensaje += `📝 *Nota:* ${nota}%0A`;
    mensaje += `%0A🛒 *Pedido:*%0A`;

    carrito.forEach(item => {
        mensaje += `- ${item.nombre} x${item.cantidad} → ${(item.precio * item.cantidad).toFixed(2)} €%0A`;
    });

    const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    mensaje += `%0A💰 *Total:* ${total.toFixed(2)} €`;

    // ⚠️ CAMBIA ESTE NÚMERO
    const telefonoFloristeria = "34600000000";

    window.open(
        `https://wa.me/${telefonoFloristeria}?text=${mensaje}`,
        "_blank"
    );
});
