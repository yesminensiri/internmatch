import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "admin" | "student" | "company";
    } & DefaultSession["user"];
  }

  interface JWT {
    id: number;
    role: "admin" | "student" | "company";
  }
}