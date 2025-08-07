import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";
import { checkInSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = checkInSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  const data = parsed.data;
  if (data.type === "event") {
    const checkIn = await prisma.checkIn.create({ data: { userId: (session.user as any).id, eventId: data.eventId } });
    return NextResponse.json({ id: checkIn.id });
  } else {
    const checkIn = await prisma.checkIn.create({
      data: {
        userId: (session.user as any).id,
        placeExternalId: data.placeExternalId,
        placeName: data.placeName,
        placeType: data.placeType as any,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    return NextResponse.json({ id: checkIn.id });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const placeExternalId = searchParams.get("placeExternalId");

  const where: any = {};
  if (eventId) where.eventId = eventId;
  if (placeExternalId) where.placeExternalId = placeExternalId;

  const items = await prisma.checkIn.findMany({ where, include: { user: true }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ items: items.map((i) => ({ id: i.id, user: { id: i.userId, email: i.user.email }, createdAt: i.createdAt })) });
}