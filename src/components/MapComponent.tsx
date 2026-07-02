import React, { useEffect, useRef } from "react";
import L from "leaflet";

// Fix default marker icon issues in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

import { Booking } from "../types";

interface MapComponentProps {
  mode: "pinning" | "tracking" | "routing" | "all-dispatches";
  lat?: number;
  lng?: number;
  targetLat?: number;
  targetLng?: number;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  crewName?: string;
  bookings?: Booking[];
  onSelectBooking?: (booking: Booking) => void;
}

export default function MapComponent({
  mode,
  lat = 4.85329,
  lng = 31.58301,
  targetLat,
  targetLng,
  onCoordinatesChange,
  crewName = "Clean World Alpha Team",
  bookings = [],
  onSelectBooking
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  // Default Juba coordinates if none supplied
  const baseLat = 4.8601;
  const baseLng = 31.5910;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map centering
    let initialLat = lat;
    let initialLng = lng;
    let zoomLevel = 14;

    if (mode === "pinning") {
      initialLat = lat;
      initialLng = lng;
      zoomLevel = 15;
    } else if (mode === "all-dispatches") {
      initialLat = baseLat;
      initialLng = baseLng;
      zoomLevel = 13;
    } else {
      initialLat = targetLat || lat;
      initialLng = targetLng || lng;
      zoomLevel = 14;
    }

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: zoomLevel,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    mapRef.current = map;

    // Custom icons
    const homeIcon = L.divIcon({
      html: `<div class="flex items-center justify-center bg-emerald-500 border-2 border-white rounded-full shadow-lg h-9 w-9 text-base text-slate-950 font-bold font-sans">📍</div>`,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    const truckIcon = L.divIcon({
      html: `<div class="flex items-center justify-center bg-sky-500 border-2 border-white rounded-full shadow-lg h-9 w-9 text-base text-slate-950 font-bold font-sans animate-bounce">🚚</div>`,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    const baseIcon = L.divIcon({
      html: `<div class="flex items-center justify-center bg-sky-600 border-2 border-slate-950 rounded-full shadow-lg h-8 w-8 text-xs text-white font-bold font-mono">HQ</div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    const pendingIcon = L.divIcon({
      html: `<div class="flex items-center justify-center bg-amber-500 border-2 border-slate-950 rounded-full shadow-lg h-8 w-8 text-[11px] text-slate-950 font-sans">🧹</div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    const completedIcon = L.divIcon({
      html: `<div class="flex items-center justify-center bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg h-8 w-8 text-[11px] text-slate-950 font-sans">✅</div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    // Custom helper for landmarks decoration
    const landmarkIcon = (emoji: string, label: string) => L.divIcon({
      html: `<div class="flex items-center bg-slate-950/90 border border-slate-800 rounded-lg px-2 py-0.5 shadow-md text-[9px] font-sans font-semibold text-slate-300 gap-1.5 whitespace-nowrap"><span class="text-xs shrink-0">${emoji}</span><span>${label}</span></div>`,
      className: "",
      iconSize: [95, 22],
      iconAnchor: [47, 11]
    });

    if (mode === "pinning") {
      // Draggable marker for coordinates pinning
      const marker = L.marker([lat, lng], {
        draggable: true,
        icon: homeIcon
      }).addTo(map);

      marker.bindPopup("Drag me to your exact facility gate!").openPopup();
      markerRef.current = marker;

      marker.on("dragend", () => {
        const position = marker.getLatLng();
        if (onCoordinatesChange) {
          onCoordinatesChange(position.lat, position.lng);
        }
      });

      map.on("click", (e) => {
        const clickPos = e.latlng;
        marker.setLatLng(clickPos);
        if (onCoordinatesChange) {
          onCoordinatesChange(clickPos.lat, clickPos.lng);
        }
      });
    } else if (mode === "all-dispatches") {
      // HQ Dispatch Center
      L.marker([baseLat, baseLng], { icon: baseIcon })
        .addTo(map)
        .bindPopup("<b>Clean World HQ Juba</b><br/>Hai Kuwait Center");

      // Place visual Juba landmarks for local reference
      L.marker([4.8720, 31.6011], { icon: landmarkIcon("🛫", "Juba Airport") }).addTo(map);
      L.marker([4.8465, 31.5450], { icon: landmarkIcon("🛍️", "Custom Market") }).addTo(map);
      L.marker([4.8190, 31.6110], { icon: landmarkIcon("🌉", "Nile Bridge") }).addTo(map);
      L.marker([4.8385, 31.5990], { icon: landmarkIcon("🛒", "Konyo Konyo") }).addTo(map);

      // Loop and draw booking locations
      bookings.forEach(booking => {
        if (!booking.lat || !booking.lng) return;
        const icon = booking.status === "completed" ? completedIcon : pendingIcon;
        const marker = L.marker([booking.lat, booking.lng], { icon }).addTo(map);

        const sspPrice = booking.price * 1300;
        const popupContent = document.createElement("div");
        popupContent.className = "p-1 font-sans text-xs text-slate-100 bg-slate-950 border border-slate-800 flex flex-col gap-1.5 max-w-[200px]";
        
        popupContent.innerHTML = `
          <div class="flex justify-between items-center gap-2">
            <span class="font-mono font-bold text-sky-400 text-[10px]">${booking.id}</span>
            <span class="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
              booking.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
            }">${booking.status}</span>
          </div>
          <div class="font-bold text-white text-[11px] capitalize">${booking.cleanType} Clean</div>
          <div class="text-[10px] text-slate-300">${booking.address}</div>
          ${booking.landmark ? `<div class="text-[9px] text-slate-400 italic leading-tight mt-0.5">📍 Landmark: ${booking.landmark}</div>` : ""}
          <div class="flex justify-between items-center text-[10px] border-t border-slate-800/80 pt-1.5 mt-0.5">
            <span class="font-mono text-emerald-400 font-bold">$${booking.price.toFixed(0)} / SSP ${sspPrice.toLocaleString()}</span>
            <span class="text-[9px] font-semibold text-slate-400 bg-slate-900 px-1 py-0.5 rounded">${booking.transportMode === "boda" ? "🏍️ Boda-Boda" : "🚚 Crew Truck"}</span>
          </div>
        `;

        if (onSelectBooking && booking.status !== "cancelled") {
          const btn = document.createElement("button");
          btn.className = "w-full mt-2 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold rounded uppercase transition-colors pointer-events-auto cursor-pointer";
          btn.innerText = "Open Job Sheet";
          btn.onclick = (e) => {
            e.stopPropagation();
            onSelectBooking(booking);
          };
          popupContent.appendChild(btn);
        }

        marker.bindPopup(popupContent);
      });

      // Fit bounds to fit bookings + HQ
      const points = bookings
        .filter(b => b.lat && b.lng && b.status !== "cancelled")
        .map(b => L.latLng(b.lat!, b.lng!));
      if (points.length > 0) {
        points.push(L.latLng(baseLat, baseLng));
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      }

    } else if (mode === "routing" && targetLat && targetLng) {
      // Static routing from HQ to Client Destination
      const startPoint: L.LatLngExpression = [baseLat, baseLng];
      const endPoint: L.LatLngExpression = [targetLat, targetLng];

      // Base marker
      L.marker(startPoint, { icon: baseIcon })
        .addTo(map)
        .bindPopup("Clean World HQ Juba (Hai Kuwait)");

      // Destination marker
      L.marker(endPoint, { icon: homeIcon })
        .addTo(map)
        .bindPopup(`Client Destination`);

      // Generate a slightly curved simulated route path (Juba streets)
      const midLat = (baseLat + targetLat) / 2;
      const midLng = (baseLng + targetLng) / 2;
      const routePoints: L.LatLngExpression[] = [
        startPoint,
        [baseLat, midLng],
        [midLat, midLng],
        [targetLat, midLng],
        endPoint
      ];

      const routeLine = L.polyline(routePoints, {
        color: "#3b82f6",
        weight: 5,
        opacity: 0.8,
        dashArray: "10, 10"
      }).addTo(map);

      routeLineRef.current = routeLine;
      map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

    } else if (mode === "tracking" && targetLat && targetLng) {
      // Live Crew Tracking animation from HQ to target
      const startPoint: L.LatLngExpression = [baseLat, baseLng];
      const endPoint: L.LatLngExpression = [targetLat, targetLng];

      // Base marker
      L.marker(startPoint, { icon: baseIcon })
        .addTo(map)
        .bindPopup("HQ Dispatch Center");

      // Home marker
      L.marker(endPoint, { icon: homeIcon })
        .addTo(map)
        .bindPopup("Your Home Location");

      // Zig-zag route path
      const midLat = (baseLat + targetLat) / 2;
      const midLng = (baseLng + targetLng) / 2;
      const routePoints = [
        L.latLng(baseLat, baseLng),
        L.latLng(baseLat, midLng),
        L.latLng(midLat, midLng),
        L.latLng(targetLat, midLng),
        L.latLng(targetLat, targetLng)
      ];

      const routeLine = L.polyline(routePoints, {
        color: "#10b981",
        weight: 5,
        opacity: 0.7
      }).addTo(map);

      routeLineRef.current = routeLine;
      map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

      // Truck marker initialized at HQ
      const truckMarker = L.marker(startPoint, { icon: truckIcon })
        .addTo(map)
        .bindPopup(`<b>${crewName}</b><br/>En Route (Live Tracker)`)
        .openPopup();

      truckMarkerRef.current = truckMarker;

      // Animate the truck along the route
      let pointIndex = 0;
      let step = 0;
      const stepsPerSegment = 40; // smoothness

      const animate = () => {
        if (!mapRef.current || !truckMarkerRef.current || !routeLineRef.current) return;

        if (pointIndex >= routePoints.length - 1) {
          // Restart animation after arrival
          setTimeout(() => {
            if (truckMarkerRef.current) {
              truckMarkerRef.current.setLatLng(startPoint);
              pointIndex = 0;
              step = 0;
              animate();
            }
          }, 4000);
          return;
        }

        const start = routePoints[pointIndex];
        const end = routePoints[pointIndex + 1];
        
        const lat = start.lat + (end.lat - start.lat) * (step / stepsPerSegment);
        const lng = start.lng + (end.lng - start.lng) * (step / stepsPerSegment);

        truckMarkerRef.current.setLatLng([lat, lng]);

        step++;
        if (step > stepsPerSegment) {
          step = 0;
          pointIndex++;
        }

        setTimeout(animate, 100);
      };

      animate();
    }

    return () => {
      // Clean up map instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mode, lat, lng, targetLat, targetLng, crewName, bookings, onSelectBooking]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner min-h-[300px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-10" />
      
      {/* Decorative Juba GPS Coordinates HUD Panel overlay */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl z-20 text-[10px] font-mono text-slate-400 backdrop-blur-md shadow-lg pointer-events-none flex flex-col gap-0.5">
        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">TELEMETRY</span>
        <div>REG: Juba, Central Equatoria</div>
        <div>LAT: {mode === "pinning" ? lat.toFixed(5) : (targetLat?.toFixed(5) || lat.toFixed(5))}</div>
        <div>LNG: {mode === "pinning" ? lng.toFixed(5) : (targetLng?.toFixed(5) || lng.toFixed(5))}</div>
        {mode === "tracking" && (
          <div className="text-emerald-400 animate-pulse font-bold mt-1">SIMULATING LIVE DISPATCH ROUTE</div>
        )}
      </div>
    </div>
  );
}
