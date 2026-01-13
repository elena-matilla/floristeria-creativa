document.addEventListener("deviceready", onDeviceReady, false);

let db;
let carrito = [];

function onDeviceReady() {

    db = window.sqlitePlugin.openDatabase({
        name: 'carmina.db',
        location: 'default'
    });

    crearTablas(function () {
        insertarProductosIniciales(function () {
            mostrarProductos();
        });
    });

    document.getElementById("openWeb").addEventListener("click", function () {
        alert("Aquí irá el pedido 🛒");
    });
}

/* ---------- BASE DE DATOS ---------- */

function crearTablas(callback) {
    db.transaction (function (tx) {

        //TABLA PRODUCTOS

        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                precio REAL,
                imagen TEXT
            )
        `);

        //TABLA CARRITO

        tx.executeSql (`
            CREATE TABLE IF NOT EXISTS carrito (
                producto_id INTEGER,
                cantidad INTEGER
            ) 
        `);
       
    }, function (error) {
        console.error("Error creando tablas", error);
    
    }, function () {
        console.log ("Tablas creadas correctamente");
        if (callback) callback ();

    });
}    
   

function insertarProductosIniciales(callback) {
    db.transaction(function (tx) {

        // 🔴 IMPORTANTE: borramos productos para evitar duplicados
        tx.executeSql('DELETE FROM productos');

        tx.executeSql(
            'INSERT INTO productos (nombre, precio, imagen) VALUES (?,?,?)',
            ['Hortensia', 4, 'img/hortensia.jpg']
        );

        tx.executeSql(
            'INSERT INTO productos (nombre, precio, imagen) VALUES (?,?,?)',
            ['Camelia', 2, 'img/camelia.jpg']
        );

        tx.executeSql(
            'INSERT INTO productos (nombre, precio, imagen) VALUES (?,?,?)',
            ['Buganvilla', 5, 'img/buganvilla.jpg']
        );

    }, function (error) {
        console.error("Error insertando productos", error);
    }, callback);
}

/* ---------- MOSTRAR PRODUCTOS ---------- */

function mostrarProductos() {

    db.transaction(function (tx) {

        tx.executeSql(
            'SELECT * FROM productos',
            [],
            function (tx, results) {

                let html = '';

                for (let i = 0; i < results.rows.length; i++) {
                    const p = results.rows.item(i);

                    html += `
                        <div class="producto">
                            <img src="${p.imagen}">
                            <div>
                                <h3>${p.nombre}</h3>
                                <p>${p.precio} €</p>
                            </div>
                            <button onclick="añadirAlCarrito(${p.id})">
                                Añadir
                            </button>
                        </div>
                    `;
                }

                document.getElementById("listaProductos").innerHTML = html;
            }
        );
    });
}

/* ---------- CARRITO ---------- */

function añadirAlCarrito(idProducto) {

    db.transaction(function (tx) {

        tx.executeSql(
            'SELECT * FROM productos WHERE id = ?',
            [idProducto],
            function (tx, result) {

                const producto = result.rows.item(0);

                // 🔹 Comprobamos si ya está en el carrito
                let encontrado = false;

                carrito.forEach(function (p) {
                    if (p.id === producto.id) {
                        p.cantidad++;
                        encontrado = true;
                    }
                });

                if (!encontrado) {
                    carrito.push({
                        id: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: 1
                    });
                }

                mostrarCarrito();
            }
        );
    });
}

function mostrarCarrito() {

    let html = '';
    let total = 0;

    carrito.forEach(function (p) {
        html += `
            <div>
                ${p.nombre} - ${p.precio} € (x${p.cantidad})
            </div>
        `;
        total += p.precio * p.cantidad;
    });

    document.getElementById("carrito").innerHTML = html;
    document.getElementById("total").innerText = 'Total: ' + total + ' €';
}
