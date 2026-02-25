import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchEmployees } from '../services/api';
import { getCityCoords } from '../utils/cityCoordinates';
import { formatSalary, titleCase } from '../utils/formatters';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

/*
 * Fix Leaflet's default icon paths — Vite's bundler doesn't resolve the
 * marker images that Leaflet expects at runtime, so we point to the CDN copies.
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// The employee data includes cities across the globe (Edinburgh, Tokyo,
// San Francisco, etc.) so we centre on a world-level view.
const MAP_CENTER = [30, 20];
const DEFAULT_ZOOM = 2;

/**
 * City Map Page
 * -------------
 * Renders an OpenStreetMap with markers for each employee's city.
 * Clicking a marker opens a popup with name + salary.
 */
export default function CityMap() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const data = await fetchEmployees();
                if (!cancelled) setEmployees(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // Build an array of markers with coordinates looked up from our utility
    const markers = employees
        .filter((emp) => emp.city) // skip employees with no city
        .map((emp) => {
            const coords = getCityCoords(emp.city);
            return { ...emp, lat: coords.lat, lng: coords.lng };
        });

    // ── Guards ────────────────────────────────────────
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <Spinner size="lg" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="max-w-xl mx-auto mt-20 text-center card p-8">
                    <p className="text-red-500 font-medium mb-4">{error}</p>
                    <button className="btn-primary" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center gap-1 cursor-pointer"
                >
                    ← Back to Dashboard
                </button>

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Employee Locations
                </h2>

                <div className="card overflow-hidden" style={{ height: '520px' }}>
                    <MapContainer
                        center={MAP_CENTER}
                        zoom={DEFAULT_ZOOM}
                        scrollWheelZoom
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {markers.map((m, idx) => (
                            <Marker key={m.id || idx} position={[m.lat, m.lng]}>
                                <Popup>
                                    <strong>{m.name}</strong>
                                    <br />
                                    {titleCase(m.city)} — {formatSalary(m.salary)}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </main>
        </>
    );
}
