import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
  return NextResponse.json({ items: users });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  if (!id || !body?.role) return NextResponse.json({ message: "Bad request" }, { status: 400 });
  await prisma.user.update({ where: { id }, data: { role: body.role } });
  return NextResponse.json({ ok: true });
}