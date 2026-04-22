/**
 * 🏛️ Roma Explorer - Main App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        pois: [],
        filteredPois: [],
        currentView: 'explore',
        category: 'todos',
        searchTerm: '',
        viewMode: 'cards' // 'cards' o 'list'
    };

    // DOM Elements
    const loader = document.getElementById('loader');
    const poiContainer = document.getElementById('poi-container');
    const searchInput = document.getElementById('poi-search');
    const categoryFilters = document.getElementById('category-filters');
    const toggleViewBtn = document.getElementById('toggle-view-btn');
    const bottomNavItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.app-view');
    const themeToggle = document.getElementById('theme-toggle');
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = modal.querySelector('.close-modal');

    // 🚀 Init
    init();

    async function init() {
        try {
            const response = await fetch('lista.json');
            state.pois = await response.json();
            state.filteredPois = [...state.pois];
            
            renderPois();
            setupEventListeners();
            
            // Ocultar loader tras pequeña pausa
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 1000);

            // Cargar Mapa (inicialización diferida)
            if (window.initMap) window.initMap(state.pois);
            // Cargar Clima
            if (window.initWeather) window.initWeather();

        } catch (error) {
            console.error('Error cargando los datos:', error);
        }
    }

    // 🎨 Renders
    function renderPois() {
        poiContainer.innerHTML = '';
        
        if (state.filteredPois.length === 0) {
            poiContainer.innerHTML = `
                <div class="no-results">
                    <i class="ph ph-mask-sad"></i>
                    <p>No encontramos lugares que coincidan con tu búsqueda.</p>
                </div>`;
            return;
        }

        state.filteredPois.forEach(poi => {
            const card = document.createElement('div');
            card.className = `poi-card ${state.viewMode === 'list' ? 'list-item' : ''}`;
            card.innerHTML = `
                <div class="card-img">
                    <img src="${poi.imagenThumb}" alt="${poi.nombre}" loading="lazy">
                    <span class="card-badge">${poi.tipo}</span>
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <span class="rating"><i class="ph-fill ph-star"></i> ${poi.rating}</span>
                        <span>•</span>
                        <span>${poi.tiempoVisita}</span>
                    </div>
                    <h3>${poi.nombre}</h3>
                    <p class="card-desc">${poi.descripcion.substring(0, 80)}...</p>
                </div>
            `;
            card.addEventListener('click', () => openDetail(poi));
            poiContainer.appendChild(card);
        });

        // Aplicar clase de vista
        if (state.viewMode === 'list') {
            poiContainer.classList.add('list-view');
        } else {
            poiContainer.classList.remove('list-view');
        }
    }

    function openDetail(poi) {
        modalBody.innerHTML = `
            <div class="modal-header-img">
                <img src="${poi.imagen}" alt="${poi.nombre}">
            </div>
            <div class="modal-info">
                <div class="modal-meta">
                    <span class="badge">${poi.tipo}</span>
                    <span class="rating"><i class="ph-fill ph-star"></i> ${poi.rating}</span>
                </div>
                <h2>${poi.nombre}</h2>
                <p class="full-desc">${poi.descripcion}</p>
                
                <div class="info-grid">
                    <div class="info-item">
                        <i class="ph ph-map-pin"></i>
                        <div>
                            <strong>Dirección</strong>
                            <p>${poi.direccion}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="ph ph-clock"></i>
                        <div>
                            <strong>Horario</strong>
                            <p>${poi.horario}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="ph ph-ticket"></i>
                        <div>
                            <strong>Precio</strong>
                            <p>${poi.precio}</p>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}" target="_blank" class="btn btn-primary">
                        <i class="ph ph-navigation-arrow"></i> ¿Cómo llegar?
                    </a>
                    <button class="btn btn-secondary share-btn" data-id="${poi.id}">
                        <i class="ph ph-share-network"></i> Compartir
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Evento Share
        modalBody.querySelector('.share-btn').addEventListener('click', () => sharePlace(poi));
    }

    async function sharePlace(poi) {
        const shareData = {
            title: `Explora Roma: ${poi.nombre}`,
            text: poi.descripcion.substring(0, 100) + '...',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Lugar compartido con éxito');
            } catch (err) {
                console.log('Error compartiendo:', err);
            }
        } else {
            // Fallback: Copiar al portapapeles
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = `${shareData.title} - ${shareData.url}`;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('¡Enlace copiado al portapapeles! Envíalo a un amigo 🤩');
        }
    }

    // 🛠️ Event Listeners
    function setupEventListeners() {
        // Búsqueda
        searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value.toLowerCase();
            filterPois();
        });

        // Categorías
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                state.category = e.target.dataset.category;
                filterPois();
            }
        });

        // Cambio de Vista (Navegación Inferior)
        bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                bottomNavItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const targetView = item.dataset.view;
                views.forEach(v => {
                    v.classList.remove('active');
                    if (v.id === `view-${targetView}`) v.classList.add('active');
                });

                // Si es mapa, redimensionar
                if (targetView === 'map' && window.refreshMap) {
                    window.refreshMap();
                }
            });
        });

        // Toggle Grid/List
        toggleViewBtn.addEventListener('click', () => {
            state.viewMode = state.viewMode === 'cards' ? 'list' : 'cards';
            const icon = toggleViewBtn.querySelector('i');
            icon.className = state.viewMode === 'cards' ? 'ph ph-squares-four' : 'ph ph-list';
            renderPois();
        });

        // Dark/Light Theme
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.querySelector('i').className = newTheme === 'light' ? 'ph ph-sun' : 'ph ph-moon';
        });

        // Modal close
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    function filterPois() {
        state.filteredPois = state.pois.filter(poi => {
            const matchesCategory = state.category === 'todos' || poi.tipo === state.category;
            const matchesSearch = poi.nombre.toLowerCase().includes(state.searchTerm) || 
                                 poi.descripcion.toLowerCase().includes(state.searchTerm);
            return matchesCategory && matchesSearch;
        });
        renderPois();
    }
});
