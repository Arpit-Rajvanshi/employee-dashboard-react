/*
 * City → Lat/Lng lookup
 * ---------------------
 * The employee API doesn't return geographic coordinates, so we need
 * a static mapping to plot markers on the Leaflet map. This list covers
 * the cities that appear in the API response (Edinburgh, Tokyo,
 * San Francisco, London, New York, Singapore) plus major Indian cities
 * as a safety net.
 *
 * Source: approximate city-centre coordinates from Google Maps.
 */

const CITY_COORDS = {
    // ── Cities from the API ─────────────────────────
    edinburgh: { lat: 55.9533, lng: -3.1883 },
    tokyo: { lat: 35.6762, lng: 139.6503 },
    'san francisco': { lat: 37.7749, lng: -122.4194 },
    london: { lat: 51.5074, lng: -0.1278 },
    'new york': { lat: 40.7128, lng: -74.0060 },
    singapore: { lat: 1.3521, lng: 103.8198 },
    sydney: { lat: -33.8688, lng: 151.2093 },

    // ── Indian cities (fallback / future-proofing) ──
    mumbai: { lat: 19.0760, lng: 72.8777 },
    delhi: { lat: 28.7041, lng: 77.1025 },
    'new delhi': { lat: 28.6139, lng: 77.2090 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    bengaluru: { lat: 12.9716, lng: 77.5946 },
    hyderabad: { lat: 17.3850, lng: 78.4867 },
    ahmedabad: { lat: 23.0225, lng: 72.5714 },
    chennai: { lat: 13.0827, lng: 80.2707 },
    kolkata: { lat: 22.5726, lng: 88.3639 },
    pune: { lat: 18.5204, lng: 73.8567 },
    jaipur: { lat: 26.9124, lng: 75.7873 },
    surat: { lat: 21.1702, lng: 72.8311 },
    lucknow: { lat: 26.8467, lng: 80.9462 },
    kanpur: { lat: 26.4499, lng: 80.3319 },
    nagpur: { lat: 21.1458, lng: 79.0882 },
    indore: { lat: 22.7196, lng: 75.8577 },
    bhopal: { lat: 23.2599, lng: 77.4126 },
    noida: { lat: 28.5355, lng: 77.3910 },
    gurgaon: { lat: 28.4595, lng: 77.0266 },
    gurugram: { lat: 28.4595, lng: 77.0266 },
    chandigarh: { lat: 30.7333, lng: 76.7794 },
    kochi: { lat: 9.9312, lng: 76.2673 },
};

// Default coordinates (centre of the world map) for cities we don't recognise
const DEFAULT_COORDS = { lat: 30.0, lng: 10.0 };

/**
 * Look up coordinates for a city name.
 * Case-insensitive; returns DEFAULT_COORDS for unknown cities.
 */
export function getCityCoords(cityName) {
    if (!cityName) return DEFAULT_COORDS;
    const key = cityName.trim().toLowerCase();
    return CITY_COORDS[key] || DEFAULT_COORDS;
}
