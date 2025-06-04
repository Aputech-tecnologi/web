class Reservaciones {
    constructor() {
        this.fechasOcupadas = new Set();
        this.horasDisponibles = [
            '09:00', '10:00', '11:00', '12:00', 
            '14:00', '15:00', '16:00', '17:00'
        ];
        this.inicializar();
    }

    inicializar() {
        this.renderizarCalendario();
        this.configurarEventListeners();
    }

    renderizarCalendario() {
        const calendario = document.getElementById('calendario-widget');
        if (!calendario) return;

        const fecha = new Date();
        const mes = fecha.getMonth();
        const año = fecha.getFullYear();

        calendario.innerHTML = this.generarCalendarioHTML(mes, año);
        this.actualizarDisponibilidad();
    }

    generarCalendarioHTML(mes, año) {
        const primerDia = new Date(año, mes, 1);
        const ultimoDia = new Date(año, mes + 1, 0);
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        let html = `
            <div class="calendario-header">
                <button class="btn-mes" data-accion="anterior">&lt;</button>
                <h3>${this.obtenerNombreMes(mes)} ${año}</h3>
                <button class="btn-mes" data-accion="siguiente">&gt;</button>
            </div>
            <div class="calendario-dias">
                ${diasSemana.map(dia => `<div class="dia-semana">${dia}</div>`).join('')}
        `;

        // Días del mes
        for (let i = 0; i < primerDia.getDay(); i++) {
            html += '<div class="dia vacio"></div>';
        }

        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
            const fecha = new Date(año, mes, dia);
            const esHoy = this.esFechaHoy(fecha);
            const esPasado = fecha < new Date();
            const clase = esPasado ? 'pasado' : (esHoy ? 'hoy' : '');

            html += `
                <div class="dia ${clase}" data-fecha="${fecha.toISOString().split('T')[0]}">
                    ${dia}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    configurarEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.dia:not(.pasado)')) {
                this.seleccionarFecha(e.target);
            }
            if (e.target.matches('.btn-mes')) {
                this.cambiarMes(e.target.dataset.accion);
            }
        });

        const formReserva = document.getElementById('form-reserva');
        if (formReserva) {
            formReserva.addEventListener('submit', (e) => {
                e.preventDefault();
                this.procesarReserva(e.target);
            });
        }
    }

    seleccionarFecha(elemento) {
        const fecha = elemento.dataset.fecha;
        document.querySelectorAll('.dia').forEach(dia => {
            dia.classList.remove('seleccionado');
        });
        elemento.classList.add('seleccionado');
        this.actualizarHorasDisponibles(fecha);
    }

    actualizarHorasDisponibles(fecha) {
        const selectHora = document.getElementById('hora');
        if (!selectHora) return;

        selectHora.innerHTML = this.horasDisponibles
            .filter(hora => !this.estaHoraOcupada(fecha, hora))
            .map(hora => `<option value="${hora}">${hora}</option>`)
            .join('');
    }

    procesarReserva(formulario) {
        const datos = new FormData(formulario);
        const reserva = {
            nombre: datos.get('nombre'),
            email: datos.get('email'),
            telefono: datos.get('telefono'),
            servicio: datos.get('servicio'),
            fecha: datos.get('fecha'),
            hora: datos.get('hora'),
            notas: datos.get('notas')
        };

        // Aquí irían las validaciones y el envío al servidor
        console.log('Reserva procesada:', reserva);
        this.mostrarConfirmacion(reserva);
    }

    mostrarConfirmacion(reserva) {
        const modal = document.createElement('div');
        modal.className = 'modal-confirmacion';
        modal.innerHTML = `
            <div class="modal-contenido">
                <h2>¡Reserva Confirmada!</h2>
                <p>Gracias ${reserva.nombre} por tu reserva.</p>
                <p>Fecha: ${reserva.fecha} a las ${reserva.hora}</p>
                <p>Te hemos enviado un email de confirmación a ${reserva.email}</p>
                <button class="btn-cerrar">Cerrar</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.querySelector('.btn-cerrar').onclick = () => modal.remove();
    }
}

// Inicializar el sistema de reservaciones
new Reservaciones();