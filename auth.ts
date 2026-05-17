import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { publicUserSelect } from "@/lib/ledger-selects";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          select: {
            ...publicUserSelect,
            passwordHash: true,
          },
        });

        if (!user) {
          return null;
        }

        const matches = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!matches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          taxId: user.taxId,
          balance: user.balance,
          createdAt: user.createdAt.toISOString(),
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.taxId = user.taxId;
        token.balance = user.balance;
        token.createdAt = user.createdAt;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.taxId = String(token.taxId);
        session.user.balance = Number(token.balance ?? 0);
        session.user.createdAt = typeof token.createdAt === "string" ? token.createdAt : undefined;
      }

      return session;
    },
  },
});
