// Datos de ejemplo de productos
const productos = [
    {
        id: 1,
        nombre: "Smartphone XYZ",
        precio: 599.99,
        imagen: "img/productos/smartphone.jpg",
        categoria: "electronica",
        descripcion: "Último modelo con cámara de alta resolución",
        oferta: true,
        descuento: 10
    },
    {
        id: 2,
        nombre: "Laptop Pro",
        precio: 1299.99,
        imagen: "img/productos/laptop.jpg",
        categoria: "electronica",
        descripcion: "Potente laptop para profesionales",
        oferta: false
    },
    // Añade más productos aquí...
];

// Estado del carrito
let carrito = [];

// Función para renderizar productos
function renderizarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';

    productos.forEach(producto => {
        const precioFinal = producto.oferta 
            ? producto.precio * (1 - producto.descuento/100) 
            : producto.precio;

        const productoHTML = `
            <div class="producto-card">
                ${producto.oferta ? `<span class="badge-oferta">${producto.descuento}% OFF</span>` : ''}
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <div class="producto-precio">
                        ${producto.oferta ? 
                            `<span class="precio-original">$${producto.precio.toFixed(2)}</span>` : ''}
                        <span class="precio-final">$${precioFinal.toFixed(2)}</span>
                    </div>
                </div>
                <div class="producto-acciones">
                    <button class="btn-carrito" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-shopping-cart"></i> Añadir
                    </button>
                    <button class="btn-favorito" onclick="toggleFavorito(${producto.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += productoHTML;
    });
}

// Función para agregar al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
        const itemCarrito = carrito.find(item => item.id === productoId);
        if (itemCarrito) {
            itemCarrito.cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        actualizarCarrito();
        mostrarNotificacion('Producto añadido al carrito');
    }
}

// Función para actualizar el carrito
function actualizarCarrito() {
    const contador = document.querySelector('.carrito-contador');
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    contador.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const carritoItems = document.getElementById('carrito-items');
    if (carritoItems) {
        carritoItems.innerHTML = carrito.map(item => `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
                </div>
                <button onclick="eliminarDelCarrito(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(productos);
    
    // Filtros
    document.getElementById('categoria-filtro')?.addEventListener('change', (e) => {
        const categoria = e.target.value;
        const productosFiltrados = categoria === 'todos' 
            ? productos 
            : productos.filter(p => p.categoria === categoria);
        renderizarProductos(productosFiltrados);
    });

    // Modal del carrito
    const carritoBtn = document.getElementById('carrito-btn');
    const modalCarrito = document.getElementById('modal-carrito');
    
    carritoBtn?.addEventListener('click', () => {
        modalCarrito.classList.toggle('visible');
    });
});