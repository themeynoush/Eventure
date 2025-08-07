import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "USER" | "ADMIN";
  }
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & Session["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
  }
}