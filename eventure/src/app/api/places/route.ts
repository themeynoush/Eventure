import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const distance = Number(searchParams.get("distance") || 5000);
  const category = searchParams.get("category") || "restaurant";

  const type = category === "hotel" ? "lodging" : "restaurant";
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return NextResponse.json({ items: [] });

  const radius = Math.min(Math.max(distance, 100), 50000);
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

  const res = await axios.get(url, { params: { key, location: `${lat},${lng}`, radius, type } });
  const items = (res.data.results || []).slice(0, 30).map((p: any) => ({
    id: p.place_id,
    title: p.name,
    subtitle: p.vicinity,
    lat: p.geometry?.location?.lat,
    lng: p.geometry?.location?.lng,
    type: category,
  }));
  return NextResponse.json({ items });
}