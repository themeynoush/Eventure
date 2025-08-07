import { create } from "zustand";

export type Category = "event" | "hotel" | "restaurant";

interface FiltersState {
  category: Category;
  distance: number; // meters
  date?: string;
  userLocation?: { lat: number; lng: number };
  setCategory: (c: Category) => void;
  setDistance: (d: number) => void;
  setDate: (date?: string) => void;
  setUserLocation: (loc?: { lat: number; lng: number }) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  category: "event",
  distance: 5000,
  date: undefined,
  userLocation: undefined,
  setCategory: (category) => set({ category }),
  setDistance: (distance) => set({ distance }),
  setDate: (date) => set({ date }),
  setUserLocation: (userLocation) => set({ userLocation }),
}));