import { z } from "zod";

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const filterSchema = z.object({
  category: z.enum(["event", "hotel", "restaurant"]).default("event"),
  distance: z.number().int().min(100).max(50000).default(5000),
  date: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const conversationCreateSchema = z.object({
  participantId: z.string().min(1),
});

export const messageCreateSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export const checkInSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("event"), eventId: z.string().min(1) }),
  z.object({
    type: z.literal("place"),
    placeExternalId: z.string().min(1),
    placeName: z.string().min(1),
    placeType: z.enum(["HOTEL", "RESTAURANT"]),
    latitude: z.number(),
    longitude: z.number(),
  }),
]);