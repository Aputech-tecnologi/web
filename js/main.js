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

    // Animación al hacer scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.servicio-card').forEach(card => {
        observer.observe(card);
    });
});

async function cargarContenido(pagina) {
    const contenedor = document.getElementById('contenido');
    if (!contenedor) return;

    try {
        const response = await fetch(`paginas/${pagina}.html`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Animación de transición
        contenedor.style.opacity = '0';
        
        setTimeout(() => {
            contenedor.innerHTML = html;
            contenedor.style.opacity = '1';
            
            // Inicializar componentes específicos
            switch(pagina) {
                case 'inicio':
                    if (typeof Slider !== 'undefined') {
                        new Slider();
                    }
                    break;
                case 'productos':
                    inicializarProductos();
                    break;
                case 'contacto':
                    inicializarFormularioContacto();
                    break;
            }
        }, 300);

        // Actualizar clase activa en navegación
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pagina) {
                link.classList.add('active');
            }
        });

    } catch (error) {
        console.error('Error:', error);
        contenedor.innerHTML = `
            <div class="error-mensaje">
                <h2>Error al cargar el contenido</h2>
                <p>No se pudo cargar la página ${pagina}</p>
            </div>
        `;
    }
}

// Funciones de inicialización
function inicializarProductos() {
    console.log('Inicializando productos...');
}

function inicializarFormularioContacto() {
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Enviando formulario...');
        });
    }
}

// Cargar la página inicial
if (window.location.hash) {
    const pagina = window.location.hash.slice(1);
    cargarContenido(pagina);
} else {
    cargarContenido('inicio');
} 