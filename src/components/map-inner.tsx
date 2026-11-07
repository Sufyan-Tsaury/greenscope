'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Report } from '@/types';

function createCustomIcon(severity: string, status: string) {
  let color = '#10b981'; // emerald
  if (status === 'pulih') {
    color = '#059669';
  } else if (severity === 'kritis') {
    color = '#e11d48'; // rose-600
  } else if (severity === 'tinggi') {
    color = '#d97706'; // amber-600
  } else if (severity === 'sedang') {
    color = '#eab308'; // yellow-500
  }

  const svgIcon = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="44" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="12" r="5" fill="#ffffff"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [30, 44],
    iconAnchor: [15, 44],
    popupAnchor: [0, -44],
  });
}

interface MapInnerProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

export default function MapInner({ reports, selectedReport, onSelectReport }: MapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Inisialisasi peta terpusat di Bengkulu (-3.8214, 102.2741)
      const map = L.map(mapContainerRef.current, {
        center: [-3.8214, 102.2741],
        zoom: 12,
        scrollWheelZoom: true,
      });

      // CartoDB Voyager tiles (ringan, modern, kontras tinggi)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Bersihkan marker lama
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Tambahkan marker laporan
    reports.forEach((report) => {
      const icon = createCustomIcon(report.severity, report.status);
      const marker = L.marker([report.latitude, report.longitude], { icon })
        .addTo(map)
        .on('click', () => {
          onSelectReport(report);
        });

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 2px;">
          <strong style="font-size: 12px; display: block; color: #0f172a; margin-bottom: 2px;">${report.title}</strong>
          <span style="font-size: 11px; color: #64748b;">${report.location_name}</span>
          <div style="font-size: 10px; font-weight: bold; color: #059669; margin-top: 4px;">
            Skor Urgensi: ${report.urgency_score}/100 • ${report.status.toUpperCase()}
          </div>
        </div>
      `);

      markersRef.current.push(marker);
    });

    return () => {
      // cleanup on unmount
    };
  }, [reports, onSelectReport]);

  // Pan ke laporan yang dipilih
  useEffect(() => {
    if (mapInstanceRef.current && selectedReport) {
      mapInstanceRef.current.flyTo(
        [selectedReport.latitude, selectedReport.longitude],
        14,
        { duration: 1.2 }
      );
    }
  }, [selectedReport]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
