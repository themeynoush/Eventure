import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";
import { messageCreateSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) return NextResponse.json({ message: "Missing conversationId" }, { status: 400 });
  const items = await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = messageCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  const { conversationId, content } = parsed.data;
  const msg = await prisma.message.create({ data: { conversationId, content, senderId: (session.user as any).id } });
  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
  return NextResponse.json({ item: msg });
}