class FormularioContacto {
    constructor() {
        this.form = document.getElementById('form-contacto');
        this.inicializar();
    }

    inicializar() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validarFormulario()) {
                this.enviarFormulario();
            }
        });

        // Validación en tiempo real
        this.form.querySelectorAll('input, textarea').forEach(campo => {
            campo.addEventListener('blur', () => {
                this.validarCampo(campo);
            });
        });
    }

    validarFormulario() {
        let esValido = true;
        this.form.querySelectorAll('input, textarea').forEach(campo => {
            if (!this.validarCampo(campo)) {
                esValido = false;
            }
        });
        return esValido;
    }

    validarCampo(campo) {
        const valor = campo.value.trim();
        let esValido = true;
        let mensaje = '';

        switch (campo.type) {
            case 'email':
                esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
                mensaje = 'Por favor, ingresa un email válido';
                break;
            case 'tel':
                esValido = /^\+?[\d\s-]{10,}$/.test(valor);
                mensaje = 'Por favor, ingresa un teléfono válido';
                break;
            default:
                esValido = valor.length > 0;
                mensaje = 'Este campo es requerido';
        }

        this.mostrarError(campo, esValido ? '' : mensaje);
        return esValido;
    }

    mostrarError(campo, mensaje) {
        const contenedor = campo.parentElement;
        const errorExistente = contenedor.querySelector('.error-mensaje');
        
        if (errorExistente) {
            errorExistente.remove();
        }

        if (mensaje) {
            const error = document.createElement('div');
            error.className = 'error-mensaje';
            error.textContent = mensaje;
            contenedor.appendChild(error);
            campo.classList.add('error');
        } else {
            campo.classList.remove('error');
        }
    }

    async enviarFormulario() {
        const datos = new FormData(this.form);
        const botonEnviar = this.form.querySelector('button[type="submit"]');
        
        try {
            botonEnviar.disabled = true;
            botonEnviar.textContent = 'Enviando...';

            // Aquí iría la llamada a tu API
            const respuesta = await fetch('/api/contacto', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(datos)),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (respuesta.ok) {
                this.mostrarMensajeExito();
                this.form.reset();
            } else {
                throw new Error('Error al enviar el mensaje');
            }
        } catch (error) {
            this.mostrarMensajeError(error.message);
        } finally {
            botonEnviar.disabled = false;
            botonEnviar.textContent = 'Enviar Mensaje';
        }
    }

    mostrarMensajeExito() {
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-exito';
        mensaje.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>¡Mensaje enviado con éxito!</p>
            <p>Nos pondremos en contacto contigo pronto.</p>
        `;
        this.form.parentElement.appendChild(mensaje);

        setTimeout(() => mensaje.remove(), 5000);
    }

    mostrarMensajeError(error) {
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-error';
        mensaje.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${error}</p>
        `;
        this.form.parentElement.appendChild(mensaje);

        setTimeout(() => mensaje.remove(), 5000);
    }
}

// Inicializar el formulario
new FormularioContacto();