class MapaInteractivo {
    constructor() {
        this.mapa = null;
        this.marcadores = [];
        this.ubicacion = {
            lat: 40.416775,
            lng: -3.703790
        };
        this.inicializar();
    }

    inicializar() {
        // Cargar Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);

        window.initMap = () => this.crearMapa();
    }

    crearMapa() {
        const mapaContainer = document.getElementById('mapa');
        if (!mapaContainer) return;

        this.mapa = new google.maps.Map(mapaContainer, {
            center: this.ubicacion,
            zoom: 15,
            styles: this.obtenerEstiloMapa()
        });

        this.agregarMarcador(this.ubicacion);
        this.agregarControles();
    }

    agregarMarcador(posicion) {
        const marcador = new google.maps.Marker({
            position: posicion,
            map: this.mapa,
            title: 'Nuestra Ubicación',
            animation: google.maps.Animation.DROP
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="info-window">
                    <h3>Nuestra Tienda</h3>
                    <p>Calle Principal 123</p>
                    <p>Tel: +1 234 567 890</p>
                </div>
            `
        });

        marcador.addListener('click', () => {
            infoWindow.open(this.mapa, marcador);
        });

        this.marcadores.push(marcador);
    }

    agregarControles() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'mapa-controles';
        
        const controles = [
            { texto: 'Como Llegar', icono: 'fas fa-directions', accion: () => this.mostrarRuta() },
            { texto: 'Street View', icono: 'fas fa-street-view', accion: () => this.activarStreetView() }
        ];

        controles.forEach(control => {
            const boton = document.createElement('button');
            boton.innerHTML = `<i class="${control.icono}"></i> ${control.texto}`;
            boton.onclick = control.accion;
            controlDiv.appendChild(boton);
        });

        this.mapa.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
    }

    mostrarRuta() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (posicion) => {
                    const origen = {
                        lat: posicion.coords.latitude,
                        lng: posicion.coords.longitude
                    };

                    const directionsService = new google.maps.DirectionsService();
                    const directionsRenderer = new google.maps.DirectionsRenderer();
                    directionsRenderer.setMap(this.mapa);

                    directionsService.route({
                        origin: origen,
                        destination: this.ubicacion,
                        travelMode: google.maps.TravelMode.DRIVING
                    }, (result, status) => {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                        }
                    });
                },
                () => alert('No se pudo obtener tu ubicación')
            );
        }
    }
}

// Inicializar el mapa
new MapaInteractivo();