import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  const { name, email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ message: "Email already registered" }, { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, profile: { create: {} } } });
  return NextResponse.json({ id: user.id });
}

export async function GET(req: NextRequest) {
  // basic users list (no geo filtering to keep it simple here)
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } });
  return NextResponse.json({ items: users });
}