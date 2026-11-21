'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass, CircleDot, Globe, Map as MapIcon, Crosshair } from 'lucide-react';
import { Report } from '@/types';

// Konfigurasi Visual Ekosistem dengan Ikon Vektor SVG Murni (Tanpa Emoji)
const ECOSYSTEM_CONFIG: Record<string, {
  name: string;
  color: string;
  svgIcon: string;
}> = {
  hutan_tropis: {
    name: 'Hutan Tropis',
    color: '#1E7B27', // Hijau Hutan Tropis
    // SVG Vektor: Pohon Kanopi Tropis
    svgIcon: `
      <path d="M12 2L5 11h3l-2.5 5h3.5v5h4v-5h3.5l-2.5-5H17L12 2z" fill="#ffffff"/>
    `
  },
  pesisir_pantai: {
    name: 'Pesisir & Pantai',
    color: '#0284C7', // Biru Samudra
    // SVG Vektor: Gelombang Ombak Pesisir
    svgIcon: `
      <path d="M3 8c1.5 1.5 3 1.5 4.5 0 1.5-1.5 3-1.5 4.5 0 1.5 1.5 3 1.5 4.5 0 1.5-1.5 3-1.5 4.5 0M3 13c1.5 1.5 3 1.5 4.5 0 1.5-1.5 3-1.5 4.5 0 1.5 1.5 3 1.5 4.5 0 1.5-1.5 3-1.5 4.5 0" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `
  },
  mangrove: {
    name: 'Sabuk Mangrove',
    color: '#0D9488', // Hijau Toska Bakau
    // SVG Vektor: Tunas Daun Mangrove
    svgIcon: `
      <path d="M12 21v-7M12 14c-2.5-3-2.5-6.5 0-9.5 2.5 3 2.5 6.5 0 9.5zM12 16.5c-2.5 0-4.5-1.5-5.5-3.5 2-.5 4.5 0 5.5 3.5zM12 16.5c2.5 0 4.5-1.5 5.5-3.5-2-.5-4.5 0-5.5 3.5z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="#ffffff" fill-opacity="0.25"/>
    `
  },
  muara_sungai: {
    name: 'Muara Sungai',
    color: '#0891B2', // Biru Air Estuari
    // SVG Vektor: Aliran & Tetesan Air Muara
    svgIcon: `
      <path d="M12 3.5c-3 4-6 7.5-6 10.5 0 3.31 2.69 6 6 6s6-2.69 6-6c0-3-3-6.5-6-10.5z" fill="#ffffff"/>
      <path d="M12 8c-1.5 2-3 3.8-3 5.5 0 1.66 1.34 3 3 3" stroke="#0891B2" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    `
  }
};

function createCustomIcon(
  ecosystem: string = 'pesisir_pantai',
  severity: string = 'sedang',
  status: string = 'menunggu',
  isSelected: boolean = false
) {
  const eco = ECOSYSTEM_CONFIG[ecosystem] || ECOSYSTEM_CONFIG.pesisir_pantai;
  const pinColor = status === 'pulih' ? '#52B040' : eco.color;

  let severityColor = '#52B040';
  if (severity === 'kritis') severityColor = '#e11d48';
  else if (severity === 'tinggi') severityColor = '#d97706';
  else if (severity === 'sedang') severityColor = '#eab308';

  const isCritical = severity === 'kritis' && status !== 'pulih';
  const pulseRing = (isSelected || isCritical)
    ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${severityColor}26; border: 2px solid ${severityColor}80; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; top: -6px; left: -5px; pointer-events: none;"></div>`
    : '';

  const scale = isSelected ? 'scale(1.22)' : 'scale(1)';

  const svgIcon = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: ${scale}; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
      ${pulseRing}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 46" width="34" height="46" style="filter: drop-shadow(0 5px 8px rgba(0,0,0,0.28));">
        <!-- Pin Teardrop Body -->
        <path d="M17 0C7.61 0 0 7.61 0 17c0 12 17 29 17 29s17-17 17-29c0-9.39-7.61-17-17-17z" fill="${pinColor}" stroke="#ffffff" stroke-width="${isSelected ? 2.5 : 2}"/>
        
        <!-- Circular Center Disc for SVG Icon -->
        <circle cx="17" cy="17" r="11" fill="rgba(0,0,0,0.18)"/>
        
        <!-- Pure SVG Ecosystem Icon (Centered in 24x24 box) -->
        <g transform="translate(5, 5)">
          ${eco.svgIcon}
        </g>
        
        <!-- Status / Urgency Indicator Dot on Top Right -->
        <circle cx="27" cy="7" r="4.5" fill="${severityColor}" stroke="#ffffff" stroke-width="1.5"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [34, 46],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
  });
}

type BaseLayerType = 'satellite' | 'streets' | 'topo';

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
  topo: {
    name: 'Topografi',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, USGS, Garmin',
    maxZoom: 19
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
      const icon = createCustomIcon(report.ecosystem, report.severity, report.status, isSelected);
      const marker = L.marker([report.latitude, report.longitude], { 
        icon, 
        zIndexOffset: isSelected ? 1000 : 0 
      })
        .addTo(map)
        .on('click', () => {
          onSelectReport(report);
        });

      const eco = ECOSYSTEM_CONFIG[report.ecosystem] || ECOSYSTEM_CONFIG.pesisir_pantai;
      const isCritical = report.severity === 'kritis';
      const isHigh = report.severity === 'tinggi';
      const sevBg = isCritical ? '#fff1f2' : isHigh ? '#fffbeb' : '#ffffff';
      const sevText = isCritical ? '#e11d48' : isHigh ? '#d97706' : '#202820';
      const sevBorder = isCritical ? '#fecdd3' : isHigh ? '#fde68a' : '#E7ECE5';
      const sevDot = isCritical ? '#e11d48' : isHigh ? '#d97706' : '#52B040';

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; max-width: 240px; background: #ffffff; border-radius: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 8px;">
            <div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px; background: #F7F9F6; border: 1px solid #E7ECE5; font-size: 10px; font-weight: 700; color: #202820;">
              <svg width="11" height="11" viewBox="0 0 24 24" style="flex-shrink: 0;">
                ${eco.svgIcon.replace(/#ffffff/g, eco.color)}
              </svg>
              <span>${eco.name}</span>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 3.5px; padding: 2px 7px; border-radius: 6px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: ${sevBg}; color: ${sevText}; border: 1px solid ${sevBorder};">
              <span style="width: 5px; height: 5px; border-radius: 50%; background: ${sevDot}; display: inline-block;"></span>
              <span>${report.severity}</span>
            </div>
          </div>

          <strong style="font-size: 13px; display: block; color: #202820; margin-bottom: 4px; line-height: 1.35; font-weight: 700;">
            ${report.title}
          </strong>

          <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #7A8278; margin-bottom: 8px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52B040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${report.location_name}</span>
          </div>

          <div style="padding-top: 6px; border-top: 1px solid #EEF1EC; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 10px; font-family: monospace; color: #52B040; font-weight: 600;">
              ${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #348D32; display: inline-flex; align-items: center; gap: 2px;">
              Klik untuk Detail &rarr;
            </span>
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
      <div ref={mapContainerRef} className="w-full h-full" />

      <div className="absolute top-3 left-14 z-[999] flex flex-wrap items-center gap-2">
        <div className="matte-track-container">
          {(['satellite', 'streets', 'topo'] as BaseLayerType[]).map((layerKey) => {
            const isActive = baseLayer === layerKey;
            return (
              <button
                key={layerKey}
                type="button"
                onClick={() => setBaseLayer(layerKey)}
                className={`matte-track-item gap-1.5 ${
                  isActive ? 'matte-track-item-active-brand' : ''
                }`}
              >
                {layerKey === 'satellite' && <Globe className="w-3 h-3" />}
                {layerKey === 'streets' && <MapIcon className="w-3 h-3" />}
                {layerKey === 'topo' && <Layers className="w-3 h-3" />}
                <span>{TILE_LAYERS[layerKey].name}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowBufferZone(!showBufferZone)}
          className={`gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border shadow-xs flex items-center ${
            showBufferZone
              ? 'bg-[#52B040] text-white border-[#3e8a30] font-semibold'
              : 'bg-white text-[#202820] border-[#E7ECE5] hover:bg-[#F7F9F6]'
          }`}
          title="Tampilkan / sembunyikan radius sempadan konservasi 350m"
        >
          <CircleDot className={`w-3.5 h-3.5 ${showBufferZone ? 'text-white' : 'text-[#52B040]'}`} />
          <span className="hidden sm:inline">Buffer 350m:</span>
          <span>{showBufferZone ? 'Aktif' : 'Mati'}</span>
        </button>

        <button
          type="button"
          onClick={handleRecenter}
          className="btn-matte-secondary gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer"
          title="Pusatkan kembali kamera ke Pesisir Bengkulu"
        >
          <Compass className="w-3.5 h-3.5 text-[#52B040]" />
          <span className="hidden md:inline">Pesisir Bengkulu</span>
        </button>
      </div>

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
