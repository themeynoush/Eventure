import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }, include: { profile: true } });
  return NextResponse.json({ profile: user?.profile });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { bio, interests } = body as { bio?: string; interests?: string[] };
  await prisma.profile.upsert({
    where: { userId: (session.user as any).id },
    update: { bio, interests: interests || [] },
    create: { userId: (session.user as any).id, bio, interests: interests || [] },
  });
  return NextResponse.json({ ok: true });
}