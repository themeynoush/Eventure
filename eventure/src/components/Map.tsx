"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useFiltersStore } from "@/state/useFiltersStore";
import type { LatLngExpression } from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

export interface MapPoint {
  id: string;
  title: string;
  position: { lat: number; lng: number };
  type: "event" | "hotel" | "restaurant";
}

export function Map({ points, onSelect }: { points: MapPoint[]; onSelect?: (id: string) => void }) {
  const { userLocation, setUserLocation } = useFiltersStore();
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([51.505, -0.09]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
        },
        () => {
          // keep default center
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [userLocation, setUserLocation]);

  const markers = useMemo(() => points, [points]);

  return (
    <div className="h-[60vh] w-full rounded-lg overflow-hidden border">
      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {markers.map((p) => (
          <Marker key={p.id} position={[p.position.lat, p.position.lng]} eventHandlers={{ click: () => onSelect?.(p.id) }}>
            <Popup>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.type}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}