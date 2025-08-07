import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";
import { conversationCreateSchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: { participants: { include: { user: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const items = conversations.map((c) => ({ id: c.id, title: c.participants.map((p) => p.user.email).join(", ") }));
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = conversationCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  const participantId = parsed.data.participantId;
  const userId = (session.user as any).id;
  const conv = await prisma.conversation.create({
    data: {
      participants: { createMany: { data: [{ userId }, { userId: participantId }] } },
    },
  });
  return NextResponse.json({ id: conv.id });
}