import { useEffect, useRef } from "react";
import L from "leaflet";

interface LeafletMapProps {
  city?: string;
  coordinates?: { lat: number; lng: number } | null;
  height?: number;
}

// Lightweight Nominatim geocoder
async function geocode(place: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (_) {}
  return null;
}

export default function LeafletMap({ city, coordinates, height = 280 }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const init = async () => {
      let center = coordinates || null;
      if (!center && city) center = await geocode(city);
      if (!center) center = { lat: 0, lng: 0 };

      if (!leafletRef.current) {
        leafletRef.current = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([center.lat, center.lng], center.lat === 0 && center.lng === 0 ? 2 : 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletRef.current);
      } else {
        leafletRef.current.setView([center.lat, center.lng], 11);
      }

      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      const icon = L.divIcon({ className: '', html: '<div class="pulse-pin"></div>' });
      markerRef.current = L.marker([center.lat, center.lng], { icon })
        .addTo(leafletRef.current!)
        .bindPopup(city || 'Selected destination');
      markerRef.current.openPopup();
    };

    init();

    return () => {
      // keep map for reuse in same component lifetime
    };
  }, [city, coordinates]);

  useEffect(() => {
    // inject Leaflet CSS if not present
    const id = 'leaflet-css';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const pid = 'leaflet-pulse-pin-css';
    if (!document.getElementById(pid)) {
      const style = document.createElement('style');
      style.id = pid;
      style.innerHTML = `
        .pulse-pin { position: relative; width: 14px; height: 14px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 0 0 rgba(34,197,94,0.7); transform: translate(-50%, -50%); }
        .pulse-pin::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; animation: pulse-ring 1.8s ease-out infinite; border: 3px solid rgba(34,197,94,0.6); }
        @keyframes pulse-ring { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl overflow-hidden border border-border"
      style={{ height }}
      aria-label="Destination map"
    />
  );
}
