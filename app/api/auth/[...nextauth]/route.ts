import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name || "Google User",
            password: "", // no password for Google login
            role: "student", // default role
          },
        });
      }

      return true;
    },

    async session({ session }) {
      // Attach role and id from database
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email! },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.role = dbUser.role as "admin" | "student" | "company";
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };