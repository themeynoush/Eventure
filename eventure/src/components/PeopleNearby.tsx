"use client";

import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import { useFiltersStore } from "@/state/useFiltersStore";
import { io } from "socket.io-client";

export function PeopleNearby() {
  const { userLocation, distance } = useFiltersStore();
  const { data, mutate } = useSWR(
    userLocation ? ["/api/presence", userLocation, distance] : null,
    ([, loc, d]) => axios.get("/api/presence", { params: { lat: loc.lat, lng: loc.lng, distance: d } }).then((r) => r.data)
  );

  useEffect(() => {
    if (!userLocation) return;
    axios.post("/api/presence", { lat: userLocation.lat, lng: userLocation.lng });
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001");
    s.on("presence:updated", () => mutate());
    return () => { s.disconnect(); };
  }, [userLocation, mutate]);

  return (
    <div className="border rounded">
      <div className="p-2 font-medium border-b">People nearby</div>
      <div className="divide-y">
        {(data?.items || []).map((p: any) => (
          <div key={p.id} className="p-2 text-sm">
            {p.name} <span className="text-xs text-muted-foreground">({new Date(p.lastSeenAt).toLocaleTimeString()})</span>
          </div>
        ))}
        {!data?.items?.length && <div className="p-2 text-sm">No one nearby</div>}
      </div>
    </div>
  );
}