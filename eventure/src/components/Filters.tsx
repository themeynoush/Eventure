"use client";

import { useFiltersStore } from "@/state/useFiltersStore";

export function Filters() {
  const { category, distance, date, setCategory, setDistance, setDate } = useFiltersStore();

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border rounded-lg">
      <select
        className="border rounded px-2 py-1"
        value={category}
        onChange={(e) => setCategory(e.target.value as any)}
      >
        <option value="event">Events</option>
        <option value="hotel">Hotels</option>
        <option value="restaurant">Restaurants</option>
      </select>
      <input
        className="border rounded px-2 py-1 w-40"
        type="number"
        value={distance}
        min={100}
        max={50000}
        step={100}
        onChange={(e) => setDistance(parseInt(e.target.value, 10))}
      />
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={date || ""}
        onChange={(e) => setDate(e.target.value || undefined)}
      />
    </div>
  );
}