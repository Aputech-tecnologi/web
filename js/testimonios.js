class SistemaTestimonios {
    constructor() {
        this.testimonios = [
            {
                id: 1,
                nombre: 'Juan Pérez',
                cargo: 'CEO, Empresa ABC',
                foto: 'img/testimonios/juan.jpg',
                texto: 'Excelente servicio, superó todas nuestras expectativas.',
                calificacion: 5
            },
            // Añade más testimonios aquí
        ];
        this.inicializar();
    }

    inicializar() {
        this.renderizarTestimonios();
        this.configurarCarrusel();
        this.configurarFormulario();
    }

    renderizarTestimonios() {
        const contenedor = document.querySelector('.testimonios-carrusel');
        if (!contenedor) return;

        contenedor.innerHTML = this.testimonios.map(testimonio => `
            <div class="testimonio-slide">
                <div class="testimonio-contenido">
                    <img src="${testimonio.foto}" alt="${testimonio.nombre}">
                    <div class="testimonio-texto">
                        <p>${testimonio.texto}</p>
                        <div class="testimonio-calificacion">
                            ${this.generarEstrellas(testimonio.calificacion)}
                        </div>
                        <footer>
                            <strong>${testimonio.nombre}</strong>
                            <span>${testimonio.cargo}</span>
                        </footer>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generarEstrellas(calificacion) {
        return Array(5).fill('').map((_, i) => `
            <i class="fas fa-star ${i < calificacion ? 'activa' : ''}"></i>
        `).join('');
    }

    configurarCarrusel() {
        const carrusel = document.querySelector('.testimonios-carrusel');
        if (!carrusel) return;

        let posicionActual = 0;
        const slides = carrusel.children;
        
        setInterval(() => {
            posicionActual = (posicionActual + 1) % slides.length;
            carrusel.style.transform = `translateX(-${posicionActual * 100}%)`;
        }, 5000);
    }

    configurarFormulario() {
        const form = document.getElementById('form-testimonio');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarTestimonio(new FormData(form));
        });
    }

    async enviarTestimonio(datos) {
        try {
            // Aquí iría la llamada a tu API
            const respuesta = await fetch('/api/testimonios', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(datos)),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (respuesta.ok) {
                this.mostrarMensajeExito('¡Gracias por tu testimonio!');
                // Actualizar la lista de testimonios
                this.testimonios = await respuesta.json();
                this.renderizarTestimonios();
            }
        } catch (error) {
            this.mostrarMensajeError('Error al enviar el testimonio');
        }
    }

    mostrarMensajeExito(mensaje) {
        // Similar a la función en FormularioContacto
    }

    mostrarMensajeError(mensaje) {
        // Similar a la función en FormularioContacto
    }
}

// Inicializar el sistema de testimonios
new SistemaTestimonios();