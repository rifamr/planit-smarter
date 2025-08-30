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

      L.marker([center.lat, center.lng])
        .addTo(leafletRef.current)
        .bindPopup(city || 'Selected destination')
        .openPopup();
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
