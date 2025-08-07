"use client";

import { Filters } from "@/components/Filters";
import { Map, type MapPoint } from "@/components/Map";
import { Lists } from "@/components/Lists";
import { PeopleNearby } from "@/components/PeopleNearby";
import { useFiltersStore } from "@/state/useFiltersStore";
import useSWR from "swr";
import axios from "axios";
import { useMemo } from "react";

function usePoints() {
  const { category, userLocation, distance, date } = useFiltersStore();
  const params: any = {};
  if (userLocation) Object.assign(params, { lat: userLocation.lat, lng: userLocation.lng });
  if (distance) params.distance = distance;
  if (date) params.date = date;
  const url = category === "event" ? "/api/events" : "/api/places";
  const key = userLocation ? [url, category, params] : null;
  const { data } = useSWR(key, ([u, c, p]) => axios.get(u, { params: { ...p, category: c } }).then(r => r.data));
  const points: MapPoint[] = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((it: any) => ({ id: it.id, title: it.title, position: { lat: it.lat, lng: it.lng }, type: it.type }));
  }, [data]);
  return points;
}

export default function Home() {
  const points = usePoints();

  return (
    <div className="flex flex-col gap-4">
      <Filters />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Map points={points} />
        </div>
        <div className="space-y-4">
          <Lists />
          <PeopleNearby />
        </div>
      </div>
    </div>
  );
}
