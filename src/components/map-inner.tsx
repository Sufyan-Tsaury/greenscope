'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass, CircleDot, Globe, Map as MapIcon, Crosshair } from 'lucide-react';
import { Report } from '@/types';

function createCustomIcon(severity: string, status: string, isSelected: boolean = false) {
  let color = '#52B040'; // Carbonery nature green
  if (status === 'pulih') {
    color = '#52B040';
  } else if (severity === 'kritis') {
    color = '#e11d48'; // rose-600
  } else if (severity === 'tinggi') {
    color = '#d97706'; // amber-600
  } else if (severity === 'sedang') {
    color = '#eab308'; // yellow-500
  }

  const pulseRing = isSelected
    ? `<div style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: ${color}33; border: 2px solid ${color}88; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; top: -8px; left: -9px; pointer-events: none;"></div>`
    : '';

  const scale = isSelected ? 'scale(1.22)' : 'scale(1)';

  const svgIcon = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: ${scale}; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      ${pulseRing}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="46" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="${isSelected ? 2.5 : 2}"/>
        <circle cx="12" cy="12" r="5" fill="#ffffff"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [32, 46],
    iconAnchor: [16, 46],
    popupAnchor: [0, -46],
  });
}

type BaseLayerType = 'satellite' | 'streets' | 'carto';

const TILE_LAYERS: Record<BaseLayerType, { name: string; url: string; attribution: string; maxZoom: number }> = {
  satellite: {
    name: 'Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19
  },
  streets: {
    name: 'Jalan',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  },
  carto: {
    name: 'Minimalis',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20
  }
};

interface MapInnerProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

export default function MapInner({ reports, selectedReport, onSelectReport }: MapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);
  const bufferCircleRef = useRef<L.Circle | null>(null);

  // Layer & GIS Features State
  const [baseLayer, setBaseLayer] = useState<BaseLayerType>('satellite');
  const [showBufferZone, setShowBufferZone] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(12);

  // 1. Inisialisasi peta Leaflet satu kali
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      // Peta terpusat di Pesisir Bengkulu (-3.8214, 102.2741)
      const map = L.map(mapContainerRef.current, {
        center: [-3.8214, 102.2741],
        zoom: 12,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // Tambahkan scale bar kartografi resmi (metrik)
      L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);

      // Event listener mousemove untuk koordinat riil
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      map.on('mouseout', () => {
        setCursorCoords(null);
      });

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Switch base tile layer (Satelit vs Jalan vs Minimalis)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const config = TILE_LAYERS[baseLayer];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(map);

    newLayer.bringToBack();
    activeTileLayerRef.current = newLayer;
  }, [baseLayer]);

  // 3. Render buffer zone lingkaran konservasi (300 meter radius) saat laporan dipilih
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (bufferCircleRef.current) {
      bufferCircleRef.current.remove();
      bufferCircleRef.current = null;
    }

    if (showBufferZone && selectedReport) {
      let color = '#52B040';
      if (selectedReport.severity === 'kritis') color = '#e11d48';
      else if (selectedReport.severity === 'tinggi') color = '#d97706';
      else if (selectedReport.severity === 'sedang') color = '#eab308';

      const circle = L.circle([selectedReport.latitude, selectedReport.longitude], {
        radius: 350, // 350m radius zona intervensi
        color: color,
        fillColor: color,
        fillOpacity: 0.16,
        weight: 1.5,
        dashArray: '6, 6'
      }).addTo(map);

      bufferCircleRef.current = circle;
    }
  }, [selectedReport, showBufferZone]);

  // 4. Render marker saat reports atau selectedReport berubah
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Bersihkan marker lama
    markersMapRef.current.forEach((marker) => marker.remove());
    markersMapRef.current.clear();

    // Tambahkan marker laporan
    reports.forEach((report) => {
      const isSelected = selectedReport?.id === report.id;
      const icon = createCustomIcon(report.severity, report.status, isSelected);
      const marker = L.marker([report.latitude, report.longitude], { 
        icon, 
        zIndexOffset: isSelected ? 1000 : 0 
      })
        .addTo(map)
        .on('click', () => {
          onSelectReport(report);
        });

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 6px; max-width: 230px; border-radius: 12px;">
          <strong style="font-size: 12px; display: block; color: #202820; margin-bottom: 2px; line-height: 1.35; font-weight: 700;">${report.title}</strong>
          <span style="font-size: 11px; color: #7A8278; display: block; margin-bottom: 5px;">${report.location_name}</span>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 600; background: ${report.severity === 'kritis' ? '#fff1f2' : report.severity === 'tinggi' ? '#fffbeb' : '#EAF5E6'}; color: ${report.severity === 'kritis' ? '#e11d48' : report.severity === 'tinggi' ? '#d97706' : '#348D32'};">
            URGENSI: ${report.severity.toUpperCase()} • ${report.status.toUpperCase()}
          </div>
        </div>
      `, { closeButton: false, offset: [0, -10] });

      markersMapRef.current.set(report.id, marker);
    });
  }, [reports, selectedReport, onSelectReport]);

  // 5. Smooth Camera FlyTo Navigation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const timer = setTimeout(() => {
      if (selectedReport) {
        map.flyTo(
          [selectedReport.latitude, selectedReport.longitude],
          14,
          {
            duration: 1.25,
            easeLinearity: 0.25,
          }
        );

        const targetMarker = markersMapRef.current.get(selectedReport.id);
        if (targetMarker) {
          targetMarker.openPopup();
        }
      } else {
        if (markersMapRef.current.size > 0) {
          const markersArray = Array.from(markersMapRef.current.values());
          const group = L.featureGroup(markersArray);
          map.flyToBounds(group.getBounds().pad(0.2), {
            maxZoom: 13,
            duration: 1.25,
          });
        } else {
          map.flyTo([-3.8214, 102.2741], 12, { duration: 1.25 });
        }
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [selectedReport, reports]);

  // Handle recenter to Bengkulu
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([-3.8214, 102.2741], 12, { duration: 1.25 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* FLOATING GIS TOOLBAR: LAYER SWITCHER & RECENTER (TOP-LEFT POSITION) */}
      <div className="absolute top-3 left-14 z-[999] flex flex-wrap items-center gap-2">
        {/* Layer Switcher Pill */}
        <div className="flex items-center p-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E7ECE5] shadow-md text-xs">
          {(['satellite', 'streets', 'carto'] as BaseLayerType[]).map((layerKey) => {
            const isActive = baseLayer === layerKey;
            return (
              <button
                key={layerKey}
                type="button"
                onClick={() => setBaseLayer(layerKey)}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#52B040] text-white font-semibold shadow-xs'
                    : 'text-[#4A5449] hover:text-[#202820] hover:bg-stone-100'
                }`}
              >
                {layerKey === 'satellite' && <Globe className="w-3 h-3" />}
                {layerKey === 'streets' && <MapIcon className="w-3 h-3" />}
                {layerKey === 'carto' && <Layers className="w-3 h-3" />}
                <span>{TILE_LAYERS[layerKey].name}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle Conservation Buffer Zone (350m) */}
        <button
          type="button"
          onClick={() => setShowBufferZone(!showBufferZone)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
            showBufferZone
              ? 'bg-[#EAF5E6] text-[#348D32] border-[#d2ebd0] font-semibold'
              : 'bg-white/95 text-[#4A5449] border-[#E7ECE5] hover:bg-stone-50'
          }`}
          title="Tampilkan / sembunyikan radius sempadan konservasi 350m"
        >
          <CircleDot className="w-3.5 h-3.5 text-[#52B040]" />
          <span className="hidden sm:inline">Buffer 350m:</span>
          <span>{showBufferZone ? 'Aktif' : 'Mati'}</span>
        </button>

        {/* Recenter / Focus Bengkulu */}
        <button
          type="button"
          onClick={handleRecenter}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/95 hover:bg-[#F7F9F6] text-[#202820] border border-[#E7ECE5] shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          title="Pusatkan kembali kamera ke Pesisir Bengkulu"
        >
          <Compass className="w-3.5 h-3.5 text-[#52B040]" />
          <span className="hidden md:inline">Pesisir Bengkulu</span>
        </button>
      </div>

      {/* FLOATING REAL-TIME COORDINATE & ZOOM BADGE (BOTTOM-LEFT BESIDE SCALE BAR) */}
      <div className="absolute bottom-2 left-28 z-[999] hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#E7ECE5] px-3 py-1 rounded-full text-[11px] font-mono text-[#4A5449] shadow-sm">
        <Crosshair className="w-3 h-3 text-[#52B040]" />
        {cursorCoords ? (
          <span>
            {cursorCoords.lat.toFixed(4)}°, {cursorCoords.lng.toFixed(4)}° • Z{currentZoom}
          </span>
        ) : (
          <span>Pesisir Bengkulu • Zoom {currentZoom}</span>
        )}
      </div>
    </div>
  );
}
