class Galeria {
    constructor() {
        this.imagenes = [
            { src: 'img/equipo/1.jpg', titulo: 'Nuestro Equipo', descripcion: 'Reunión de equipo' },
            { src: 'img/equipo/2.jpg', titulo: 'Instalaciones', descripcion: 'Nuestras oficinas' },
            // Añade más imágenes aquí
        ];
        this.indiceActual = 0;
        this.inicializar();
    }

    inicializar() {
        this.crearGaleria();
        this.configurarLightbox();
    }

    crearGaleria() {
        const contenedor = document.querySelector('.galeria-imagenes');
        if (!contenedor) return;

        this.imagenes.forEach((imagen, indice) => {
            const elemento = document.createElement('div');
            elemento.className = 'galeria-item';
            elemento.innerHTML = `
                <img src="${imagen.src}" alt="${imagen.titulo}"
                     data-indice="${indice}">
                <div class="galeria-overlay">
                    <h3>${imagen.titulo}</h3>
                    <p>${imagen.descripcion}</p>
                </div>
            `;
            contenedor.appendChild(elemento);
        });
    }

    configurarLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-contenido">
                <button class="lightbox-cerrar">&times;</button>
                <button class="lightbox-anterior">&lt;</button>
                <button class="lightbox-siguiente">&gt;</button>
                <img src="" alt="">
                <div class="lightbox-info">
                    <h3></h3>
                    <p></p>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        document.addEventListener('click', (e) => {
            if (e.target.matches('.galeria-item img')) {
                this.abrirLightbox(parseInt(e.target.dataset.indice));
            } else if (e.target.matches('.lightbox, .lightbox-cerrar')) {
                this.cerrarLightbox();
            } else if (e.target.matches('.lightbox-anterior')) {
                this.navegarLightbox(-1);
            } else if (e.target.matches('.lightbox-siguiente')) {
                this.navegarLightbox(1);
            }
        });
    }

    abrirLightbox(indice) {
        this.indiceActual = indice;
        const lightbox = document.querySelector('.lightbox');
        const imagen = this.imagenes[indice];
        
        lightbox.querySelector('img').src = imagen.src;
        lightbox.querySelector('h3').textContent = imagen.titulo;
        lightbox.querySelector('p').textContent = imagen.descripcion;
        
        lightbox.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    cerrarLightbox() {
        const lightbox = document.querySelector('.lightbox');
        lightbox.classList.remove('activo');
        document.body.style.overflow = '';
    }

    navegarLightbox(direccion) {
        this.indiceActual = (this.indiceActual + direccion + this.imagenes.length) % this.imagenes.length;
        this.abrirLightbox(this.indiceActual);
    }
}

// Inicializar la galería
new Galeria();