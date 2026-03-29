'use client';

import { useEffect, useRef } from 'react';

export interface MapMarker {
  lat: number;
  lng: number;
  color: string;
  label: string;
  pulse?: boolean;
  popupHtml?: string;
}

interface LeafletMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number | string;
  markers?: MapMarker[];
  style?: React.CSSProperties;
}

export default function LeafletMap({
  lat = 23.0225,
  lng = 72.5714,
  zoom = 12,
  height = 340,
  markers = [],
  style = {},
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      // Fix default icons
      // @ts-expect-error – leaflet internals
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom,
        zoomControl: true,
        attributionControl: true,
        fadeAnimation: true,
      });

      mapInstanceRef.current = map;

      // Dark theme tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map);

      // Add markers
      renderMarkers(L, map, markers);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center smoothly
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, {
        animate: true,
        duration: 2,
      });
    }
  }, [lat, lng, zoom]);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    import('leaflet').then((L) => {
      renderMarkers(L, map, markers);
    });
  }, [markers]);

  const renderMarkers = (L: typeof import('leaflet'), map: import('leaflet').Map, data: MapMarker[]) => {
    // Clear old markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    data.forEach(({ lat: mLat, lng: mLng, color, label, popupHtml, pulse }) => {
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="marker-container" style="color: ${color}">
            <div class="marker-pulse" style="background: ${color}"></div>
            ${pulse ? `<div class="marker-radar" style="border-color: ${color}"></div>` : ''}
            <div class="marker-core" style="background: ${color}; box-shadow: 0 0 15px ${color}"></div>
            <div class="marker-label-wrapper">
               <span class="marker-label">${label}</span>
            </div>
          </div>
        `,
        iconSize: [120, 50],
        iconAnchor: [60, 10],
      });

      const marker = L.marker([mLat, mLng], { icon }).addTo(map);
      if (popupHtml) {
        marker.bindPopup(popupHtml, { className: 'urban-popup' });
      }
    });
  };

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .custom-map-marker { background: none; border: none; }
        .marker-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: markerFloat 3s ease-in-out infinite;
        }
        .marker-core {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.8);
          position: relative;
          z-index: 5;
        }
        .marker-pulse {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          opacity: 0;
          animation: markerPulse 2s ease-out infinite;
          top: -8px;
        }
        .marker-radar {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid;
          opacity: 0;
          animation: markerRadar 3s linear infinite;
          top: -23px;
        }
        .marker-label-wrapper {
          transform: translateY(4px);
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(4px);
          padding: 3px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          white-space: nowrap;
          pointer-events: none;
        }
        .marker-label {
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.02em;
        }

        @keyframes markerFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes markerPulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes markerRadar {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }

        .urban-popup .leaflet-popup-content-wrapper {
          background: rgba(10,15,30,0.95) !important;
          border: 1px solid rgba(0,180,216,0.4) !important;
          border-radius: 12px !important;
          color: #e0f0ff !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.6) !important;
          backdrop-filter: blur(10px) !important;
        }
        .urban-popup .leaflet-popup-tip { background: rgba(10,15,30,0.95) !important; }
        
        /* Map Entry Animation */
        .leaflet-container {
          animation: mapReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes mapReveal {
          0% { opacity: 0; filter: saturate(0) brightness(0.5); }
          100% { opacity: 1; filter: saturate(1) brightness(1); }
        }
      `}</style>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          borderRadius: 'inherit',
          ...style,
        }}
      />
    </>
  );
}
