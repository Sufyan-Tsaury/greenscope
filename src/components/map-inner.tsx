'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="46" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));">
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

interface MapInnerProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

export default function MapInner({ reports, selectedReport, onSelectReport }: MapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // 1. Inisialisasi peta Leaflet satu kali dengan pembersihan yang aman
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Bersihkan _leaflet_id jika container pernah digunakan sebelumnya
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

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Render marker saat reports atau selectedReport berubah
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Bersihkan marker lama
    markersMapRef.current.forEach((marker) => marker.remove());
    markersMapRef.current.clear();

    // Tambahkan marker laporan yang sesuai filter
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
        <div style="font-family: inherit; padding: 6px; max-width: 220px; border-radius: 12px;">
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

  // 3. Smooth Camera FlyTo Navigation saat Filter atau Lokasi Terpilih Berubah
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const timer = setTimeout(() => {
      if (selectedReport) {
        // Perpindahan kamera halus (smooth flyTo) ke koordinat laporan terpilih
        map.flyTo(
          [selectedReport.latitude, selectedReport.longitude],
          14,
          {
            duration: 1.25,
            easeLinearity: 0.25,
          }
        );

        // Buka popup marker lokasi terpilih secara otomatis
        const targetMarker = markersMapRef.current.get(selectedReport.id);
        if (targetMarker) {
          targetMarker.openPopup();
        }
      } else {
        // Mode Ikhtisar / Semua Sektor: zoom out halus menampilkan seluruh bentang pesisir Bengkulu
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

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
