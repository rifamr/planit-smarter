import { useEffect, useMemo, useRef, useState } from "react";
import type { Activity } from "@/services/api";

interface MapViewProps {
  activities: Activity[];
  height?: number;
}

const token = import.meta.env.VITE_MAPBOX_API_KEY as string | undefined;

const getBounds = (points: { lat: number; lng: number }[]) => {
  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return [[minLng, minLat], [maxLng, maxLat]] as const;
};

export default function MapView({ activities, height = 320 }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [mapFailed, setMapFailed] = useState(false);

  const points = useMemo(() => (
    activities
      .map(a => a.location?.coordinates)
      .filter(Boolean) as { lat: number; lng: number }[]
  ), [activities]);

  // Initialize Mapbox GL if token present
  useEffect(() => {
    if (!mapContainer.current) return;
    if (!token || token === 'demo-key') return;
    if (points.length === 0) return;

    (async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default as any;
        mapboxgl.accessToken = token;
        const first = points[0];
        mapRef.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [first.lng, first.lat],
          zoom: 11,
          attributionControl: true,
        });

        mapRef.current.on('load', () => {
          // Fit bounds
          if (points.length > 1) {
            const b = getBounds(points);
            mapRef.current.fitBounds(b, { padding: 40, duration: 800 });
          }

          // Add markers
          points.forEach((p, idx) => {
            const el = document.createElement('div');
            el.className = 'w-3.5 h-3.5 rounded-full bg-blue-600 ring-2 ring-white shadow';
            new mapboxgl.Marker({ element: el })
              .setLngLat([p.lng, p.lat])
              .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(activities[idx]?.name || ''))
              .addTo(mapRef.current);
          });

          // Draw route line (simple order)
          if (points.length > 1) {
            mapRef.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: points.map(p => [p.lng, p.lat])
                },
                properties: {}
              }
            });
            mapRef.current.addLayer({
              id: 'route-line',
              type: 'line',
              source: 'route',
              paint: {
                'line-color': '#3b82f6',
                'line-width': 3
              }
            });
          }
        });
      } catch (e) {
        console.error('Mapbox init failed', e);
        setMapFailed(true);
      }
    })();

    return () => {
      try {
        mapRef.current && mapRef.current.remove();
      } catch {}
    };
  }, [points]);

  // If no token or failed, render static fallback
  if (!token || token === 'demo-key' || mapFailed) {
    const center = points[0] || { lat: 0, lng: 0 };
    const staticUrl = token && token !== 'demo-key'
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+3b82f6(${center.lng},${center.lat})/${center.lng},${center.lat},10,0/${Math.min(800, 1280)}x${height}?access_token=${token}`
      : undefined;

    return (
      <div className="w-full rounded-xl overflow-hidden border border-border">
        {staticUrl ? (
          <img src={staticUrl} alt="Map preview" className="w-full" height={height} loading="eager" />
        ) : (
          <div className="w-full flex items-center justify-center bg-muted" style={{ height }}>
            <span className="text-sm text-muted-foreground">Map preview unavailable</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-xl overflow-hidden border border-border"
      style={{ height }}
      aria-label="Itinerary map"
    />
  );
}
