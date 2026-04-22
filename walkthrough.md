# Roma Explorer: PWA de Turismo Premium 🏛️

¡La PWA de turismo para Roma está lista! He implementado todas las funcionalidades solicitadas con un diseño que busca impresionar desde el primer momento, usando una estética "Roman Noir" con acentos dorados.

![Mockup de la PWA](/Users/miguel/.gemini/antigravity/brain/2e86b70a-b7c1-46ac-a064-ae6c740bf264/roma_mockup.png)

## Características Implementadas 🚀

- **Puntos de Interés:** 20 lugares icónicos con descripciones, horarios, precios y ratings.
- **Imágenes Dinámicas:** Uso de `picsum.photos` con semillas específicas para cada lugar.
- **Filtrado Avanzado:** Búsqueda por texto y filtros por categoría (Cultura, Museos, Restaurantes, etc.).
- **Vistas Múltiples:** 
    - Vista de **Tarjetas** (Grid) y vista de **Lista**.
    - Mapa interactivo con **OpenStreetMap** (Leaflet.js) en modo oscuro.
    - Opción de navegación directa a **Google Maps**.
- **Social Share:** Integración con la **Web Share API** para enviar lugares a amigos.
- **Clima en Tiempo Real:** Pestaña dedicada con el clima actual de Roma y pronóstico para los próximos 7 días mediante la API de **Open-Meteo**.
- **Modo PWA:** Service Worker configurado para funcionamiento offline y manifiesto para instalación en móvil.

## Detalles Técnicos 🛠️

- **Frontend:** HTML5 semántico, CSS3 con variables y Glassmorphism (sin Tailwind por defecto, control total).
- **Lógica:** Vanilla JavaScript modular.
- **Diseño Responsivo:** Mobile-first, optimizado para tablets y smartphones.
- **Iconografía:** Phosphor Icons para un look moderno y limpio.

## Estructura del Proyecto 📁

```text
/
├── index.html       # Estructura principal y navegación
├── css/
│   └── styles.css   # Sistema de diseño y animaciones
├── js/
│   ├── app.js       # Lógica general y filtrado
│   ├── mapa.js      # Integración de Leaflet
│   └── clima.js     # Consumo de API meteorológica
├── lista.json       # Base de datos de lugares
├── manifest.json    # Configuración PWA
└── sw.js            # Service Worker (Caché offline)
```

> [!TIP]
> Puedes cambiar entre el modo oscuro y claro usando el icono de la luna/sol en la parte superior derecha. ¡El diseño se adapta automáticamente! 🌓

> [!IMPORTANT]
> Para probar la funcionalidad PWA y el Mapa en local, asegúrate de servir los archivos a través de un servidor web (como `Live Server` en VS Code o `python3 -m http.server`).
