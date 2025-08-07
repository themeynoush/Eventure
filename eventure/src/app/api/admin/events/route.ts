import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const events = await prisma.event.findMany({ orderBy: { startTime: "asc" } });
  return NextResponse.json({ items: events });
}