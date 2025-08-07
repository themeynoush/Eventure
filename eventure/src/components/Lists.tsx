"use client";

import useSWR from "swr";
import axios from "axios";
import { useFiltersStore } from "@/state/useFiltersStore";

function useNearby(category: string) {
  const { userLocation, distance, date } = useFiltersStore();
  const params: any = {};
  if (userLocation) Object.assign(params, { lat: userLocation.lat, lng: userLocation.lng });
  if (distance) params.distance = distance;
  if (date) params.date = date;
  const url = category === "event" ? "/api/events" : "/api/places";
  const key = userLocation ? [url, category, params] : null;
  return useSWR(key, ([u, c, p]) => axios.get(u, { params: { ...p, category: c } }).then(r => r.data));
}

export function Lists({ onSelect }: { onSelect?: (id: string) => void }) {
  const { category } = useFiltersStore();
  const { data, isLoading, mutate } = useNearby(category);

  const onCheckIn = async (it: any) => {
    if (category === "event") {
      await axios.post("/api/checkins", { type: "event", eventId: it.id });
    } else {
      await axios.post("/api/checkins", {
        type: "place",
        placeExternalId: it.id,
        placeName: it.title,
        placeType: category === "hotel" ? "HOTEL" : "RESTAURANT",
        latitude: it.lat,
        longitude: it.lng,
      });
    }
    mutate();
  };

  if (isLoading) return <div className="p-3">Loading...</div>;

  return (
    <div className="divide-y border rounded-lg overflow-hidden">
      {(data?.items || []).map((it: any) => (
        <div key={it.id} className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between">
          <button className="text-left" onClick={() => onSelect?.(it.id)}>
            <div className="font-medium">{it.title}</div>
            <div className="text-xs text-muted-foreground">{it.subtitle}</div>
          </button>
          <button className="border rounded px-2 py-1 text-sm" onClick={() => onCheckIn(it)}>Check in</button>
        </div>
      ))}
      {(!data || data.items.length === 0) && (
        <div className="p-3 text-sm">No results</div>
      )}
    </div>
  );
}