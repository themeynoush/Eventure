import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";

function withinDistance(lat1: number, lng1: number, lat2: number, lng2: number, maxMeters: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= maxMeters;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const distance = Number(searchParams.get("distance") || 5000);
  if (!lat || !lng) return NextResponse.json({ items: [] });
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
  const profiles = await prisma.profile.findMany({
    where: { lastSeenAt: { gte: fifteenMinAgo }, isPublic: true },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
  const items = profiles
    .filter((p) => p.lastLatitude != null && p.lastLongitude != null)
    .filter((p) => withinDistance(lat, lng, p.lastLatitude!, p.lastLongitude!, distance))
    .map((p) => ({ id: p.userId, name: p.user.name || p.user.email, lat: p.lastLatitude, lng: p.lastLongitude, lastSeenAt: p.lastSeenAt }));
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { lat, lng } = (await req.json()) as { lat: number; lng: number };
  await prisma.profile.upsert({
    where: { userId: (session.user as any).id },
    update: { lastLatitude: lat, lastLongitude: lng, lastSeenAt: new Date() },
    create: { userId: (session.user as any).id, lastLatitude: lat, lastLongitude: lng, lastSeenAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}