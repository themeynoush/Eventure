import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const distance = Number(searchParams.get("distance") || 5000);
  const date = searchParams.get("date");

  // Internal events (simplified: not strict geo filtering)
  const internal = await prisma.event.findMany({ take: 20 });

  // Eventbrite API
  const token = process.env.EVENTBRITE_TOKEN;
  let external: any[] = [];
  if (token && lat && lng) {
    const withinKm = Math.min(Math.max(Math.round(distance / 1000), 1), 50);
    const params: any = {
      "location.latitude": lat,
      "location.longitude": lng,
      "location.within": `${withinKm}km`,
      expand: "venue",
    };
    if (date) params["start_date.range_start"] = new Date(date).toISOString();
    try {
      const res = await axios.get("https://www.eventbriteapi.com/v3/events/search/", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      external = (res.data.events || []).slice(0, 20).map((e: any) => ({
        id: e.id,
        title: e.name?.text || "Event",
        subtitle: e.venue?.address?.localized_address_display || e.url,
        lat: Number(e.venue?.latitude) || lat,
        lng: Number(e.venue?.longitude) || lng,
        type: "event",
      }));
    } catch (e) {
      // ignore external errors
    }
  }

  const items = [
    ...internal.map((e) => ({ id: e.id, title: e.title, subtitle: e.address || "Event", lat: e.latitude, lng: e.longitude, type: "event" })),
    ...external,
  ];

  return NextResponse.json({ items });
}