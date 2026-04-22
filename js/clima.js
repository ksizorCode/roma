/**
 * ⛅ Roma Explorer - Weather Logic
 */

const WEATHER_API = "https://api.open-meteo.com/v1/forecast?latitude=41.8967&longitude=12.4822&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe%2FBerlin";

window.initWeather = async function() {
    const currentContainer = document.getElementById('current-weather');
    const forecastContainer = document.getElementById('forecast-container');

    try {
        const response = await fetch(WEATHER_API);
        const data = await response.json();
        
        renderCurrentWeather(data.current, currentContainer);
        renderForecast(data.daily, forecastContainer);
        
    } catch (error) {
        console.error('Error cargando clima:', error);
        currentContainer.innerHTML = '<p>Error cargando información meteorológica.</p>';
    }
};

function renderCurrentWeather(current, container) {
    const icon = getWeatherIcon(current.weather_code);
    container.innerHTML = `
        <div class="current-main">
            <h2>Clima en Roma</h2>
            <i class="ph-fill ${icon}" style="font-size: 5rem; color: var(--primary); margin: 1rem 0; display: block;"></i>
            <div class="temp-big">${Math.round(current.temperature_2m)}°C</div>
            <p style="color: var(--text-muted); margin-top: 0.5rem;">Sensación: ${Math.round(current.apparent_temperature)}°C</p>
        </div>
        <div class="weather-details" style="display: flex; justify-content: space-around; margin-top: 2rem;">
            <div class="detail-item">
                <i class="ph ph-drop"></i>
                <span>Humedad</span>
                <strong>${current.relative_humidity_2m}%</strong>
            </div>
            <div class="detail-item">
                <i class="ph ph-wind"></i>
                <span>Viento</span>
                <strong>${current.wind_speed_10m} km/h</strong>
            </div>
        </div>
    `;
}

function renderForecast(daily, container) {
    container.innerHTML = '';
    
    // Saltamos el primer día (es hoy)
    for (let i = 1; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
        const icon = getWeatherIcon(daily.weather_code[i]);
        
        const dayElem = document.createElement('div');
        dayElem.className = 'forecast-day';
        dayElem.innerHTML = `
            <div class="fc-name">${dayName}</div>
            <i class="ph ${icon.replace('-fill', '')} fc-icon"></i>
            <div class="fc-temp">${Math.round(daily.temperature_2m_max)}°</div>
        `;
        container.appendChild(dayElem);
    }
}

function getWeatherIcon(code) {
    // Mapeo simplificado de códigos WMO a Phosphor Icons
    if (code === 0) return "ph-sun"; // Despejado
    if (code >= 1 && code <= 3) return "ph-cloud-sun"; // Parcialmente nublado
    if (code >= 45 && code <= 48) return "ph-cloud-fog"; // Niebla
    if (code >= 51 && code <= 67) return "ph-cloud-rain"; // Lluvia/Drizzle
    if (code >= 71 && code <= 77) return "ph-cloud-snow"; // Nieve
    if (code >= 80 && code <= 82) return "ph-cloud-rain"; // Chubascos
    if (code >= 95) return "ph-cloud-lightning"; // Tormenta
    return "ph-cloud";
}
