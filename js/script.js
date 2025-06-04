document.addEventListener('DOMContentLoaded', function() {
    // Cargar página inicial
    cargarContenido('inicio');
    
    // Menú responsive
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Navegación
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pagina = this.getAttribute('data-page');
            cargarContenido(pagina);
            
            // Cerrar menú móvil si está abierto
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
});

async function cargarContenido(pagina) {
    const contenedor = document.getElementById('contenido');
    if (!contenedor) return;

    try {
        console.log(`Intentando cargar: paginas/${pagina}.html`); // Debug
        const response = await fetch(`paginas/${pagina}.html`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        contenedor.innerHTML = html;
        
        // Inicializar módulos específicos después de cargar el contenido
        setTimeout(() => {
            inicializarModulos(pagina);
        }, 100);

        // Actualizar clase activa en navegación
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === pagina);
        });

    } catch (error) {
        console.error('Error detallado:', error); // Debug
        contenedor.innerHTML = `
            <div class="error-mensaje">
                <h2>Error al cargar el contenido</h2>
                <p>No se pudo cargar la página ${pagina}</p>
                <small>Por favor, verifica que el archivo exista en la carpeta "paginas"</small>
            </div>
        `;
    }
}

function inicializarModulos(pagina) {
    try {
        switch(pagina) {
            case 'contacto':
                if (typeof FormularioContacto !== 'undefined') {
                    new FormularioContacto();
                }
                break;
            case 'reservaciones':
                if (typeof Reservaciones !== 'undefined') {
                    new Reservaciones();
                }
                break;
            case 'mapa':
                if (typeof MapaInteractivo !== 'undefined') {
                    new MapaInteractivo();
                }
                break;
            case 'productos':
                if (typeof renderizarProductos !== 'undefined') {
                    renderizarProductos(productos);
                }
                break;
            case 'galeria':
                if (typeof Galeria !== 'undefined') {
                    new Galeria();
                }
                break;
        }
    } catch (error) {
        console.error('Error al inicializar módulo:', error);
    }
}