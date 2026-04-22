/**
 * 📍 Roma Explorer - Map Logic
 */

let map;
let markers = [];

window.initMap = function(pois) {
    // Inicializar el mapa centrado en Roma
    map = L.map('map-container', {
        zoomControl: false // Desactivar para posición personalizada
    }).setView([41.8967, 12.4822], 13);

    // Añadir capa de azulejos (CartoDB Dark Matter para ir con nuestra estética)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Mover control de zoom a la derecha
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Añadir marcadores
    pois.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lng]).addTo(map);
        
        // Popup personalizado
        const popupContent = `
            <div class="map-popup">
                <img src="${poi.imagenThumb}" alt="${poi.nombre}" style="width:100%; border-radius:8px; margin-bottom:8px">
                <strong style="color:#c9a84c; display:block; margin-bottom:4px">${poi.nombre}</strong>
                <p style="font-size:12px; color:#ccc; margin-bottom:8px">${poi.tipo}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}" target="_blank" 
                   style="display:inline-block; background:#c9a84c; color:white; padding:4px 12px; border-radius:4px; text-decoration:none; font-size:12px">
                   Ir con Google Maps
                </a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
};

// Función para refrescar el mapa cuando se cambia de pestaña
window.refreshMap = function() {
    if (map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
};
